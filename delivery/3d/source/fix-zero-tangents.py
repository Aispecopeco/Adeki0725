"""Repair invalid zero tangents with a stable tangent-plane basis, without moving geometry."""
import hashlib
import json
import math
import struct
import sys
from pathlib import Path

file = Path(sys.argv[1])
data = bytearray(file.read_bytes())
original_hash = hashlib.sha256(data).hexdigest()
json_length, json_type = struct.unpack_from('<II', data, 12)
if json_type != 0x4E4F534A:
    raise ValueError('GLB JSON chunk missing')
document = json.loads(data[20:20 + json_length])
bin_length, bin_type = struct.unpack_from('<II', data, 20 + json_length)
if bin_type != 0x004E4942:
    raise ValueError('GLB BIN chunk missing')
binary_start = 28 + json_length
fixes = []

def vector_location(accessor_index, item, width):
    accessor = document['accessors'][accessor_index]
    if accessor['componentType'] != 5126 or accessor.get('sparse'):
        raise ValueError('Only non-sparse float attributes supported')
    view = document['bufferViews'][accessor['bufferView']]
    stride = view.get('byteStride', width * 4)
    return binary_start + view.get('byteOffset', 0) + accessor.get('byteOffset', 0) + item * stride

for mesh_index, mesh in enumerate(document['meshes']):
    for primitive in mesh['primitives']:
        attributes = primitive['attributes']
        if 'TANGENT' not in attributes:
            continue
        tangent_accessor = attributes['TANGENT']
        normal_accessor = attributes['NORMAL']
        for vertex in range(document['accessors'][tangent_accessor]['count']):
            offset = vector_location(tangent_accessor, vertex, 4)
            tangent = struct.unpack_from('<4f', data, offset)
            magnitude = math.sqrt(sum(value * value for value in tangent[:3]))
            if magnitude >= 1e-8:
                continue
            normal = struct.unpack_from('<3f', data, vector_location(normal_accessor, vertex, 3))
            normal_length = math.sqrt(sum(value * value for value in normal))
            if normal_length < 1e-8:
                raise ValueError('Cannot repair tangent for a zero normal')
            n = [value / normal_length for value in normal]
            axis = [1., 0., 0.] if abs(n[0]) < 0.9 else [0., 0., 1.]
            dot = sum(a * b for a, b in zip(axis, n))
            projected = [a - dot * b for a, b in zip(axis, n)]
            length = math.sqrt(sum(value * value for value in projected))
            replacement = [value / length for value in projected] + [tangent[3]]
            if tangent[3] not in (-1., 1.):
                raise ValueError('Unexpected tangent handedness')
            struct.pack_into('<4f', data, offset, *replacement)
            fixes.append({'mesh': mesh_index, 'name': mesh.get('name'), 'accessor': tangent_accessor, 'vertex': vertex, 'original': tangent, 'normal': normal, 'replacement': replacement})

destination = file if '--in-place' in sys.argv else file.with_name(file.stem + '.repaired.glb')
destination.write_bytes(data)
print(json.dumps({'file': str(destination), 'sha256_before': original_hash, 'sha256_after': hashlib.sha256(data).hexdigest(), 'fix_count': len(fixes), 'fixes': fixes, 'geometry_changed': False}, indent=2))
