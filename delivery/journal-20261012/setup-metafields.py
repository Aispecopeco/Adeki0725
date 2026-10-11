#!/usr/bin/env python3
"""Validate locally, inspect definitions, or create missing ARTICLE definitions.

This helper never creates/publishes articles or overwrites existing definitions.
Supply credentials through secure environment bindings; never paste them in chat.
"""
import argparse
import json
import os
from pathlib import Path
import re
import sys
import urllib.error
import urllib.request


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--plan', action='store_true', help='Read existing definitions from Shopify; no writes.')
    parser.add_argument('--apply', action='store_true', help='Create missing definitions; never modify existing ones.')
    args = parser.parse_args()
    if args.plan and args.apply:
        parser.error('Choose either --plan or --apply.')
    manifest = json.loads(Path(__file__).with_name('metafield-definitions.json').read_text())
    definitions = manifest['definitions']
    supported = {'single_line_text_field', 'multi_line_text_field', 'file_reference', 'url', 'date_time', 'product_reference'}
    assert len({d['key'] for d in definitions}) == len(definitions)
    assert all(d['ownerType'] == 'ARTICLE' and d['namespace'] == 'ta_vie_notice' and d['type'] in supported for d in definitions)
    if not args.plan and not args.apply:
        print(json.dumps({'status': 'manifest-valid', 'definitions': len(definitions), 'networkRequests': 0, 'articleWrites': 0}))
        return
    store = os.environ.get('SHOPIFY_STORE', '').strip()
    token = os.environ.get('SHOPIFY_ADMIN_ACCESS_TOKEN', '')
    if not re.fullmatch(r'[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com', store) or not token:
        raise RuntimeError('Set SHOPIFY_STORE (host only) and SHOPIFY_ADMIN_ACCESS_TOKEN in secure environment settings.')
    endpoint = f'https://{store}/admin/api/{manifest["apiVersion"]}/graphql.json'

    def graphql(query, variables):
        request = urllib.request.Request(endpoint, data=json.dumps({'query': query, 'variables': variables}).encode(), headers={'Content-Type': 'application/json', 'X-Shopify-Access-Token': token}, method='POST')
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                result = json.loads(response.read())
        except urllib.error.HTTPError as error:
            raise RuntimeError(f'Shopify request rejected with HTTP {error.code}. No credential values were logged.') from None
        if result.get('errors'):
            raise RuntimeError('GraphQL operation failed: ' + json.dumps(result['errors'], ensure_ascii=False))
        return result['data']

    query = 'query Existing($cursor:String){metafieldDefinitions(first:100,after:$cursor,ownerType:ARTICLE,namespace:"ta_vie_notice"){nodes{id key type{name}} pageInfo{hasNextPage endCursor}}}'
    current, cursor = {}, None
    while True:
        data = graphql(query, {'cursor': cursor})['metafieldDefinitions']
        current.update({d['key']: d for d in data['nodes']})
        if not data['pageInfo']['hasNextPage']:
            break
        cursor = data['pageInfo']['endCursor']
    conflicts = [d['key'] for d in definitions if d['key'] in current and current[d['key']]['type']['name'] != d['type']]
    if conflicts:
        raise RuntimeError('Existing definition types differ; review them in Shopify without overwriting: ' + ', '.join(conflicts))
    missing = [d for d in definitions if d['key'] not in current]
    if args.plan:
        print(json.dumps({'status': 'read-only-plan', 'existing': len(current), 'missing': [d['key'] for d in missing], 'articleWrites': 0}, ensure_ascii=False))
        return
    created = []
    mutation = 'mutation Create($definition:MetafieldDefinitionInput!){metafieldDefinitionCreate(definition:$definition){createdDefinition{id key} userErrors{field message code}}}'
    for definition in missing:
        result = graphql(mutation, {'definition': definition})['metafieldDefinitionCreate']
        if result['userErrors']:
            raise RuntimeError('Could not create ' + definition['key'] + ': ' + json.dumps(result['userErrors'], ensure_ascii=False))
        created.append(definition['key'])
    print(json.dumps({'status': 'definitions-created', 'created': created, 'unchangedExisting': len(current), 'articleWrites': 0}, ensure_ascii=False))


if __name__ == '__main__':
    try:
        main()
    except (AssertionError, RuntimeError, urllib.error.URLError) as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
