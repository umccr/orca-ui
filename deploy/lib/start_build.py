import json
import subprocess


def lambda_handler(event, context):
    # Specify your CodeBuild project name
    project_name = "YourCodeBuildProjectName"

    # Construct the AWS CLI command to start the CodeBuild project
    command = f"/opt/awscli/aws codebuild start-build --project-name {project_name}"

    try:
        # Execute the command
        result = subprocess.run(command, shell=True, check=True,
                                stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

        # Log the output and return a successful response
        print("Command output:", result.stdout)
        return {
            'statusCode': 200,
            'body': json.dumps('CodeBuild project triggered successfully.')
        }
    except subprocess.CalledProcessError as e:
        # Log the error and return a failure response
        print("Error:", e.stderr)
        return {
            'statusCode': 500,
            'body': json.dumps('Failed to trigger CodeBuild project.')
        }
