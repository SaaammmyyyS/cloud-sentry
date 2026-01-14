import boto3
import json
import os
import random
import uuid
from datetime import datetime

TABLE_NAME = os.environ.get('TABLE_NAME', 'Sentinel-Threats')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    ips = ["8.8.8.8", "45.33.22.11", "212.55.10.4", "1.1.1.1", "104.26.10.19"]
    threats = ["SSH Brute Force", "SQL Injection", "DDoS Pattern", "Port Scan"]
    severities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]

    new_threat = {
        "threatId": str(uuid.uuid4()),
        "sourceIp": random.choice(ips),
        "type": random.choice(threats),
        "severity": random.choice(severities),
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "location": "Pending Scan..."
    }

    try:
        table.put_item(Item=new_threat)
        return {"statusCode": 200, "body": json.dumps(new_threat)}
    except Exception as e:
        return {"statusCode": 500, "body": str(e)}