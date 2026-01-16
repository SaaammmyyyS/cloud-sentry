import boto3
import json
import random
import uuid
import logging
from datetime import datetime, timezone

logger = logging.getLogger()
logger.setLevel(logging.INFO)

TABLE_NAME = 'Sentinel-Threats'
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    entities = [
        {"ip": "45.33.22.11", "loc": "Tokyo, JP"},
        {"ip": "212.55.10.4", "loc": "Frankfurt, DE"},
        {"ip": "103.21.244.2", "loc": "Singapore, SG"},
        {"ip": "185.191.171.33", "loc": "Moscow, RU"},
        {"ip": "192.0.2.146", "loc": "Virginia, US"}
    ]

    scenarios = [
        {"type": "SQL Injection", "severity": "CRITICAL", "target": "Prod-Customer-DB",
         "log_template": "POST /api/v1/login HTTP/1.1 - 403 - payload: ' OR 1=1 -- admin"},
        {"type": "SSH Brute Force", "severity": "HIGH", "target": "Jump-Host-01",
         "log_template": "sshd[1244]: Failed password for invalid user root from {ip} port 44322 ssh2"},
        {"type": "DDoS Pattern", "severity": "MEDIUM", "target": "Web-Frontend-Edge",
         "log_template": "CloudFront: High request rate detected from {ip} (>5000 req/sec)"},
        {"type": "Unauthorized IAM Access", "severity": "CRITICAL", "target": "S3-Finance-Records",
         "log_template": "CloudTrail: AccessDenied - User: arn:aws:iam::0123:user/test - Action: s3:ListBucket"}
    ]

    selected_entity = random.choice(entities)
    selected_scenario = random.choice(scenarios)
    enriched_log = selected_scenario["log_template"].format(ip=selected_entity["ip"])

    new_threat = {
        "threatId": str(uuid.uuid4()),
        "sourceIp": selected_entity["ip"],
        "type": selected_scenario["type"],
        "severity": selected_scenario["severity"],
        "location": selected_entity["loc"],
        "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "raw_log": enriched_log,
        "target_resource": selected_scenario["target"],
        "ai_analysis": "Pending..."
    }

    try:
        table.put_item(Item=new_threat)
        logger.info(f"✅ Injected {new_threat['type']} for ID {new_threat['threatId']}")
        return {"statusCode": 200, "body": json.dumps(new_threat)}
    except Exception as e:
        logger.error(f"❌ Failed to inject threat: {str(e)}")
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}