"""Single-photo clothing study. Geometry is illustrative, not a measured pattern."""
import bpy, bmesh, math, os, json
from mathutils import Vector
import numpy as np

OUT = os.path.abspath(os.environ.get('TA_VIE_3D_OUTPUT', '/workspace/outputs/ta-vie-shirt-3d'))
os.makedirs(OUT, exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
garment = []

def material(name, color, roughness):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    mat.use_backface_culling = True
    p = mat.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value = (*color, 1)
    p.inputs['Roughness'].default_value = roughness
    p.inputs['Metallic'].default_value = 0
    p.inputs['Specular IOR Level'].default_value = .5
    return mat

cloth = material('White fabric — appearance study, composition unverified', (.66,.67,.65), .78)
seam = material('Subtle white stitching', (.59,.60,.57), .85)
# A small synthetic weave normal map provides surface detail, not product texture.
res = 512
y,x = np.mgrid[0:res,0:res]
nx = .0264*np.sin(x*2*math.pi/8) * (.82+.18*np.cos(y*2*math.pi/8))
ny = .0264*np.sin(y*2*math.pi/8) * (.82+.18*np.cos(x*2*math.pi/8))
nz = np.sqrt(np.maximum(0, 1-nx*nx-ny*ny))
pixels = np.stack((nx*.5+.5, ny*.5+.5, nz*.5+.5, np.ones_like(nx)), axis=-1).astype(np.float32)
texture = bpy.data.images.new('Illustrative fine fabric normal', width=res, height=res, alpha=False)
texture.colorspace_settings.name = 'Non-Color'
texture.pixels.foreach_set(pixels.ravel())
texture.filepath_raw = OUT+'/illustrative-fabric-normal.png'
texture.file_format = 'PNG'
texture.save()
texture.pack()
nodes=cloth.node_tree.nodes
image=nodes.new('ShaderNodeTexImage'); image.image=texture
normal=nodes.new('ShaderNodeNormalMap'); normal.inputs['Strength'].default_value=1
cloth.node_tree.links.new(image.outputs['Color'], normal.inputs['Color'])
cloth.node_tree.links.new(normal.outputs['Normal'], nodes.get('Principled BSDF').inputs['Normal'])
pocket_cloth=cloth.copy(); pocket_cloth.name='White pocket — subtle illustrative shading'
pocket_cloth.node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value=(.62,.63,.61,1)
pocket_cloth.node_tree.nodes.get('Principled BSDF').inputs['Roughness'].default_value=.84

def surface(name, rows, cols, sample, reverse=False, thickness=.0012, subdiv=1, mat=cloth):
    verts=[sample(i/rows,j/cols) for i in range(rows+1) for j in range(cols+1)]
    faces=[]
    for i in range(rows):
        for j in range(cols):
            a=i*(cols+1)+j; b=a+1; c=b+cols+1; d=a+cols+1
            faces.append((d,c,b,a) if reverse else (a,b,c,d))
    mesh=bpy.data.meshes.new(name); mesh.from_pydata(verts,[],faces); mesh.update()
    uv=mesh.uv_layers.new(name='Fabric UV')
    for polygon in mesh.polygons:
        polygon.use_smooth=True
        for loop in polygon.loop_indices:
            vi=mesh.loops[loop].vertex_index
            uv.data[loop].uv=((vi%(cols+1))/cols,(vi//(cols+1))/rows)
    obj=bpy.data.objects.new(name,mesh); bpy.context.collection.objects.link(obj)
    mesh.materials.append(mat)
    if subdiv:
        m=obj.modifiers.new('Soft fabric curvature','SUBSURF'); m.levels=subdiv; m.render_levels=subdiv
        # Simplify the cloth surface before giving it thickness. Decimating
        # thin inside/outside layers together can damage the open hems.
        m=obj.modifiers.new('Mobile surface optimization','DECIMATE'); m.ratio=.20; m.use_collapse_triangulate=True
    if thickness:
        m=obj.modifiers.new('Physical cloth thickness','SOLIDIFY'); m.thickness=thickness; m.offset=0; m.use_even_offset=True
    garment.append(obj)
    return obj

def stitch(name, points, radius=.00048, mat=seam, cyclic=False):
    curve=bpy.data.curves.new(name,'CURVE'); curve.dimensions='3D'; curve.resolution_u=1
    curve.bevel_depth=radius; curve.bevel_resolution=2
    spline=curve.splines.new('POLY'); spline.points.add(len(points)-1)
    for p,co in zip(spline.points,points):p.co=(*co,1)
    spline.use_cyclic_u=cyclic
    obj=bpy.data.objects.new(name,curve); bpy.context.collection.objects.link(obj)
    curve.materials.append(mat); garment.append(obj)
    return obj

def smooth(t):
    t=min(1,max(0,t)); return t*t*(3-2*t)
def width(v):return .345+.014*math.sin(math.pi*v)+.013*(1-v)
def depth(v):return .139+.018*math.sin(math.pi*v)+.003*v
def top(x,back=False):
    shoulder=.137*smooth((abs(x)-.105)/.24)
    return .870-shoulder-(.073*math.exp(-(x/.087)**4) if back else 0)
def hem(x):return .016+.017*(abs(x)/.36)**2+.004*math.sin(18*x+.4)
def opening(v):return .105*max(0,(v-.60)/.40)**.95
def body_point(x,v,back=False):
    w=width(v); u=min(.999999,abs(x)/w)
    z=hem(x)+(top(x,back)-hem(x))*v
    f=math.sqrt(max(.000001,1-u*u))
    folds=(.014*math.sin(49*x+2*v)+.006*math.sin(96*x-11*v))*math.sin(math.pi*v)*f
    folds+=.0025*math.sin(124*x+27*v)*math.sin(math.pi*v)*f
    yy=(depth(v)+folds)*f
    return (x, yy if back else -yy, z)
def front_at(x,z):
    v=(z-hem(x))/(top(x)-hem(x))
    return body_point(x,min(1,max(0,v)))

for side in [1,-1]:
    def panel(v,u,side=side):
        x=side*(opening(v)+(width(v)-opening(v))*u)
        return body_point(x,v)
    surface(('Right' if side==1 else 'Left')+' front draped panel',64,48,panel,reverse=side==-1)
surface('Unverified plain back panel',64,96,lambda v,u:body_point((u*2-1)*width(v),v,True),reverse=True)

# Shoulder cloth closes the top between the front and back, outside the neck.
for side in [1,-1]:
    def shoulder(v,u,side=side):
        x=side*(.105+(width(1)-.105)*u)
        a=Vector(body_point(x,1)); b=Vector(body_point(x,1,True))
        p=a.lerp(b,v); p.z+=.012*math.sin(math.pi*v)*(1-u)
        return tuple(p)
    surface(('Right' if side==1 else 'Left')+' dropped shoulder',20,48,shoulder,reverse=side==-1)

# Broad sleeves slope slightly down in a neutral product-display pose.
for side in [1,-1]:
    axis=Vector((side*.930,0,-.368)).normalized()
    origin=Vector((side*.205,0,.620))
    vertical=Vector((side*.368,0,.930)).normalized()
    forward=Vector((0,-1,0))
    def sleeve(v,u,axis=axis,origin=origin,vertical=vertical,forward=forward):
        angle=u*2*math.pi
        radius=.151-.017*v+.004*math.sin(8*angle+4*v)*math.sin(math.pi*v)
        center=origin+axis*(.354*v)
        front_ratio=.72+.19*smooth(v/.45)
        return tuple(center+vertical*(radius*math.cos(angle))+forward*(radius*front_ratio*math.sin(angle)))
    surface(('Right' if side==1 else 'Left')+' loose sleeve',32,64,sleeve,reverse=side==-1)
    def cuff(v,u,axis=axis,origin=origin,vertical=vertical,forward=forward):
        a=u*2*math.pi; length=.295+.066*v
        r=.142+.003*math.sin(math.pi*v)+.0018*math.sin(6*a)
        return tuple(origin+axis*length+vertical*(r*math.cos(a))+forward*(r*.91*math.sin(a)))
    surface(('Right' if side==1 else 'Left')+' wide folded cuff',12,64,cuff,reverse=side==-1,thickness=.0026)
    for edge in [.02,.98]:
        stitch(('Right' if side==1 else 'Left')+' cuff edge', [cuff(edge,j/128) for j in range(129)],radius=.0007)

# The large rectangular chest pockets have gently rounded lower corners.
for side in [1,-1]:
    center=side*.191
    def pocket(v,u,center=center):
        inset=.008*(1-smooth(v/.08))
        x=center+(u-.5)*(.164-2*inset)
        z=.370+.245*v+.004*math.sin(math.pi*u)
        base=Vector(front_at(x,z))
        base.y-=.0035+.006*math.sin(math.pi*u)+.003*math.sin(3*math.pi*u+2*v)*math.sin(math.pi*v)
        return tuple(base)
    surface(('Right' if side==1 else 'Left')+' large patch pocket',32,32,pocket,mat=pocket_cloth)
    outline=[pocket(v/64,.015) for v in range(65)]
    outline+=[pocket(.014,u/64) for u in range(1,65)]
    outline+=[pocket(v/64,.985) for v in reversed(range(65))]
    stitch(('Right' if side==1 else 'Left')+' pocket side stitching',outline)
    stitch(('Right' if side==1 else 'Left')+' pocket opening', [pocket(.978,j/80) for j in range(81)],radius=.00065)
    surface(('Right' if side==1 else 'Left')+' folded pocket lip',4,32,lambda v,u,pocket=pocket: (lambda p:(p[0],p[1]-.0008,p[2]))(pocket(.925+.07*v,u)),thickness=.0015)

# Front placket: no guessed button count is added.
def placket(v,u):
    x=.026*(u-.5); z=.02+.502*v
    p=Vector(front_at(x,z)); p.y-=.002
    return tuple(p)
surface('Front opening placket',36,6,placket,thickness=.0015)
for edge in [.08,.92]:stitch('Placket edge', [placket(i/90,edge) for i in range(91)])

# Folded lapels follow the deep V opening; extra cloth bends toward the front.
for side in [1,-1]:
    def lapel(t,u,side=side):
        v=.6+.4*t
        a=Vector(body_point(side*opening(v),v))
        foldwidth=.070*(.48*math.sin(math.pi*t)+.90*t)
        x=a.x+side*foldwidth*u
        z=a.z-.105*t*t*u
        base=Vector(front_at(x,z))
        base.y-=.002+.014*math.sin(math.pi*u)+.006*t*u
        return (x,base.y,z)
    surface(('Right' if side==1 else 'Left')+' open folded lapel',48,14,lapel,reverse=side==-1,thickness=.0018)
    stitch(('Right' if side==1 else 'Left')+' lapel free edge', [lapel(i/100,.985) for i in range(101)])

control=[Vector(p) for p in [(.105,-.136,.870),(.124,-.025,.870),(.093,.119,.827),(0,.142,.797),(-.093,.119,.827),(-.124,-.025,.870),(-.105,-.136,.870)]]
def neck_path(t):
    q=t*(len(control)-1); i=min(len(control)-2,int(q)); f=q-i
    a=control[max(0,i-1)]; b=control[i]; c=control[i+1]; d=control[min(len(control)-1,i+2)]
    return .5*((2*b)+(-a+c)*f+(2*a-5*b+4*c-d)*f*f+(-a+3*b-3*c+d)*f*f*f)
def collar(t,u):
    p=neck_path(t)
    radial=Vector((p.x,p.y,0)); radial.normalize()
    p+=radial*(.042*u)
    p.z+=(.038*math.sin(math.pi*u)+.012*u)*math.sin(math.pi*t)**.6
    return tuple(p)
surface('Folded collar around unverified back neckline',72,16,collar,thickness=.0018)
stitch('Collar outer stitch', [collar(i/160,.985) for i in range(161)])

# Rounded hem stitching follows the front and back surfaces.
for back in [False,True]:
    points=[]
    for i in range(161):
        p=Vector(body_point(width(0)*(2*i/160-1),.006,back)); p.y+=(.001 if back else -.001)
        points.append(tuple(p))
    stitch(('Back' if back else 'Front')+' hem stitch',points,radius=.00065)

# Convert stitching curves so both GLB and USDZ receive real triangles.
for obj in garment:
    if obj.type=='CURVE':
        bpy.ops.object.select_all(action='DESELECT'); obj.select_set(True); bpy.context.view_layer.objects.active=obj
        bpy.ops.object.convert(target='MESH')
        for p in obj.data.polygons:p.use_smooth=True
# Keep thin hem/pocket rims from averaging their downward normals into the
# broad fabric panels: that creates false triangular dark marks in WebGL.
for obj in garment:
    bpy.ops.object.select_all(action='DESELECT'); obj.select_set(True)
    bpy.context.view_layer.objects.active=obj
    for modifier in list(obj.modifiers):bpy.ops.object.modifier_apply(modifier=modifier.name)
    bm=bmesh.new(); bm.from_mesh(obj.data); bm.normal_update()
    for face in bm.faces:face.smooth=True
    for edge in bm.edges:
        edge.smooth=len(edge.link_faces)!=2 or edge.calc_face_angle() < math.radians(50)
    bm.to_mesh(obj.data); bm.free(); obj.data.update()
for obj in garment:
    obj['prototype']=True
    obj['source']='Single front photograph supplied by user; back, dimensions and composition unverified'
    obj['dimensions_note']='Display scale only; not true-size AR or manufacturing data'
bpy.ops.object.select_all(action='DESELECT')
for obj in garment:obj.select_set(True)
bpy.context.view_layer.objects.active=garment[0]
bpy.ops.export_scene.gltf(filepath=OUT+'/ta-vie-white-shirt-prototype.glb',export_format='GLB',use_selection=True,export_apply=True,export_texcoords=True,export_normals=True,export_tangents=True,export_materials='EXPORT',export_extras=True,export_yup=True)
# A collapsed UV at a pointed cloth edge can give Blender a zero tangent.
# Correct only that invalid direction to a unit vector in its normal plane.
import contextlib, runpy, sys
repair_script=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fix-zero-tangents.py')
saved_argv=sys.argv[:]
try:
    sys.argv=[repair_script, OUT+'/ta-vie-white-shirt-prototype.glb', '--in-place']
    with open(OUT+'/tangent-repair.json','w') as report, contextlib.redirect_stdout(report):
        runpy.run_path(repair_script,run_name='__main__')
finally:sys.argv=saved_argv

# Studio render objects are deliberately excluded from the exported garment.
studio=material('Studio background',(.86,.85,.82),.9)
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-.025)); ground=bpy.context.object; ground.name='Preview ground only'; ground.data.materials.append(studio)
def area(name,loc,power,size):
    light=bpy.data.lights.new(name,'AREA'); light.energy=power; light.shape='DISK'; light.size=size
    obj=bpy.data.objects.new(name,light); bpy.context.collection.objects.link(obj); obj.location=loc
    obj.rotation_euler=(Vector((0,0,.45))-obj.location).to_track_quat('-Z','Y').to_euler()
area('Large front softbox',(-1.4,-1.8,2.7),220,2.3)
area('Gentle fill',(1.7,-.3,1.5),70,2.0)
area('Upper back rim',(.5,1.4,2.4),140,1.7)
world=bpy.data.worlds.new('Studio ambient'); bpy.context.scene.world=world; world.use_nodes=True
world.node_tree.nodes['Background'].inputs[0].default_value=(.80,.80,.80,1)
world.node_tree.nodes['Background'].inputs[1].default_value=.15
bpy.ops.object.camera_add(location=(1.30,-2.7,1.15)); camera=bpy.context.object
camera.rotation_euler=(Vector((0,0,.46))-camera.location).to_track_quat('-Z','Y').to_euler()
camera.data.type='ORTHO'; camera.data.ortho_scale=1.35
scene=bpy.context.scene; scene.camera=camera; scene.render.engine='CYCLES'; scene.cycles.samples=96
scene.cycles.use_denoising=False; scene.render.resolution_x=1200; scene.render.resolution_y=1400; scene.render.resolution_percentage=100
scene.view_settings.view_transform='AgX'; scene.render.image_settings.file_format='PNG'
bpy.ops.wm.save_as_mainfile(filepath=OUT+'/ta-vie-white-shirt-prototype.blend')
scene.render.filepath=OUT+'/shirt-prototype-studio.png'
if os.environ.get('TA_VIE_RENDER', '1') != '0':bpy.ops.render.render(write_still=True)
with open(OUT+'/model-notes.json','w') as f:
    json.dump({'status':'single-photo illustrative prototype','garment':'white oversized open-collar shirt','geometry':'clothing only; no person, accessories or photo texture','verified_reference_features':['oversized long body','dropped shoulders','deep open collar','wide rolled cuffs','two large patch pockets','rounded hem'], 'unknown':['back construction','true dimensions and AR scale','fabric composition','button count and concealed closure'], 'public_product_use':'Review against actual garment before uploading/publishing as product representation'},f,ensure_ascii=False,indent=2)
print('SHIRT_COMPLETE',OUT)
