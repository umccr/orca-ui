import json
import subprocess
import os


def handler(event, context):

    project_name = os.environ['CODEBUILD_PROJECT_NAME']
    target_bucket = os.environ['TARGET_BUCKET']
    prefix_source = os.environ['ARTIFACT_SOURCE_PREFIX']

    try:

        run_cmd(
            f"/opt/awscli/aws s3 sync ./artifact-source s3://{target_bucket}/{prefix_source}/ --exclude 'deploy/*'")

        run_cmd(
            f"/opt/awscli/aws codebuild start-build --project-name {project_name}")
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
