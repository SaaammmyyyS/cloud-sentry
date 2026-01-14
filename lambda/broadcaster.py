import json
import os
import boto3
import urllib3
import hashlib
from botocore.auth import SigV4Auth
from botocore.awsrequest import AWSRequest

APPSYNC_URL = os.environ.get('APPSYNC_URL')
REGION = os.environ.get('AWS_REGION', 'ap-southeast-1')

def lambda_handler(event, context):
    http = urllib3.PoolManager()

    for record in event['Records']:
        if record['eventName'] == 'INSERT':
            new_image = record['dynamodb']['NewImage']
            source_ip = new_image['sourceIp']['S']

            location = "Unknown Origin"
            try:
                geo_resp = http.request('GET', f'http://ip-api.com/json/{source_ip}', timeout=2.0)
                data = json.loads(geo_resp.data.decode('utf-8'))
                if data.get('status') == 'success':
                    location = f"{data.get('city')}, {data.get('country')}"
            except: pass

            variables = {
                "type": new_image['type']['S'],
                "severity": new_image['severity']['S'],
                "sourceIp": source_ip,
                "timestamp": new_image['timestamp']['S'],
                "location": location
            }

            query = """
            mutation CreateThreat($type: String, $severity: String, $sourceIp: String, $timestamp: String, $location: String) {
            createThreat(type: $type, severity: $severity, sourceIp: $sourceIp, timestamp: $timestamp, location: $location) {
                type
                severity
                sourceIp
                timestamp
                location
            }
            }
            """

            payload = json.dumps({'query': query, 'variables': variables})

            payload_hash = hashlib.sha256(payload.encode('utf-8')).hexdigest()

            host = APPSYNC_URL.replace('https://', '').split('/')[0]

            request = AWSRequest(
                method='POST',
                url=APPSYNC_URL,
                data=payload,
                headers={
                    'Content-Type': 'application/json',
                    'host': host,
                    'x-amz-content-sha256': payload_hash
                }
            )

            credentials = boto3.Session().get_credentials()
            SigV4Auth(credentials, 'appsync', REGION).add_auth(request)

            try:
                response = http.request(
                    'POST',
                    APPSYNC_URL,
                    body=payload,
                    headers=dict(request.headers)
                )
                print(f"✅ AppSync Response: {response.data.decode('utf-8')}")
            except Exception as e:
                print(f"❌ Network Error: {e}")

    return {"status": "done"}