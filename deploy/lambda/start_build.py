import json
import subprocess
import os


def handler(event, context):
    pipeline_name = os.environ['CODEPIPELINE_NAME']

    try:
        run_cmd(
            f"/opt/awscli/aws codepipeline start-pipeline-execution --name {pipeline_name}")

        return {
            'statusCode': 200,
            'body': json.dumps('CodeBuild project triggered successfully.')
        }
    except subprocess.CalledProcessError as e:
        # Log the error and return a failure response
        print("Error:")
        print(e.stderr)
        return {
            'statusCode': 500,
            'body': json.dumps('Failed to trigger CodeBuild project.')
        }


def run_cmd(command: str) -> None:
    result = subprocess.run(command, shell=True, check=True,
                            stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    # Log the output and return a successful response
    print("Command output:")
    print(result.stdout)
