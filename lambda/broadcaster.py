import json
import os
import boto3
import urllib3
import hashlib
import logging
from botocore.auth import SigV4Auth
from botocore.awsrequest import AWSRequest

logger = logging.getLogger()
logger.setLevel(logging.INFO)

APPSYNC_URL = os.environ.get('APPSYNC_URL')
REGION = os.environ.get('AWS_REGION', 'ap-southeast-1')
http = urllib3.PoolManager()

def lambda_handler(event, context):
    for record in event['Records']:
        if record['eventName'] == 'MODIFY':
            new_image = record['dynamodb']['NewImage']
            ai_text = new_image.get('ai_analysis', {}).get('S', 'Pending...')

            if ai_text == "Pending...":
                continue

            variables = {
                "threatId": new_image.get('threatId', {}).get('S', 'unknown'),
                "type": new_image.get('type', {}).get('S', 'Unknown'),
                "severity": new_image.get('severity', {}).get('S', 'LOW'),
                "sourceIp": new_image.get('sourceIp', {}).get('S', '0.0.0.0'),
                "target_resource": new_image.get('target_resource', {}).get('S', 'External_Interface'),
                "timestamp": new_image.get('timestamp', {}).get('S', ''),
                "location": new_image.get('location', {}).get('S', 'Lookup Skipped'),
                "ai_analysis": ai_text
            }

            query = """
            mutation PublishThreat($threatId: ID!, $type: String, $severity: String, $sourceIp: String, $target_resource: String, $timestamp: String, $location: String, $ai_analysis: String) {
                createThreat(threatId: $threatId, type: $type, severity: $severity, sourceIp: $sourceIp, target_resource: $target_resource, timestamp: $timestamp, location: $location, ai_analysis: $ai_analysis) {
                    threatId
                    type
                    severity
                    sourceIp
                    location
                    target_resource
                    ai_analysis
                    timestamp
                }
            }
            """

            payload = json.dumps({'query': query, 'variables': variables})
            host = APPSYNC_URL.replace('https://', '').split('/')[0]

            request = AWSRequest(
                method='POST', url=APPSYNC_URL, data=payload,
                headers={'Content-Type': 'application/json', 'host': host,
                         'x-amz-content-sha256': hashlib.sha256(payload.encode('utf-8')).hexdigest()}
            )

            SigV4Auth(boto3.Session().get_credentials(), 'appsync', REGION).add_auth(request)

            try:
                response = http.request('POST', APPSYNC_URL, body=payload, headers=dict(request.headers))
                logger.info(f"✅ Broadcast status: {response.status}")
            except Exception as e:
                logger.error(f"❌ Broadcast failed: {e}")

    return {"status": "done"}