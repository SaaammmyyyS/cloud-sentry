import json
import boto3
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

REGION = "ap-southeast-1"
TABLE_NAME = "Sentinel-Threats"

bedrock = boto3.client("bedrock-runtime", region_name=REGION)
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    system_prompt = (
        "You are an Elite SOC Analyst. Analyze security logs. "
        "Return ONLY a valid JSON object. Do not include any markdown formatting, preamble, or code blocks. "
        "Required format: {\"summary\": \"...\", \"action\": \"...\"}"
    )

    for record in event.get('Records', []):
        if record['eventName'] != 'INSERT':
            continue

        try:
            new_image = record['dynamodb']['NewImage']
            threat_id = new_image.get('threatId', {}).get('S')
            timestamp = new_image.get('timestamp', {}).get('S')
            raw_log = new_image.get('raw_log', {}).get('S', 'No content')

            body = json.dumps({
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 150,
                "system": system_prompt,
                "messages": [
                    {"role": "user", "content": raw_log},
                    {"role": "assistant", "content": "{"} # This is 'Response Prefill' - forces JSON start
                ],
                "temperature": 0
            })

            response = bedrock.invoke_model(
                body=body,
                modelId="anthropic.claude-3-haiku-20240307-v1:0", # Standardized ID
                accept="application/json",
                contentType="application/json"
            )

            # Re-attach the '{' we forced at the start
            ai_text_raw = json.loads(response.get("body").read())["content"][0]["text"]
            ai_text = "{" + ai_text_raw

            table.update_item(
                Key={'threatId': threat_id, 'timestamp': timestamp},
                UpdateExpression="SET ai_analysis = :val",
                ExpressionAttributeValues={':val': ai_text}
            )
            logger.info(f"✅ AI Analysis complete for {threat_id}")

        except Exception as e:
            logger.error(f"❌ AI Error: {str(e)}")

    return {"status": "done"}