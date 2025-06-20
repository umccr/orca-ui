#!/usr/bin/env source
# -*- coding: utf-8 -*-
# This wrapper script is mainly for local development purpose only.
#
# Sourcing this script will perform:
#   1. get required config values from SSM Parameter Store
#   2. export them as VITE_x environment variables
#   3. start local development node server
#
# REQUIRED CLI:
# aws, jq
#
# USAGE:
# Typically (recommended) use in conjunction with Yarn:
#     yarn start
#
# Otherwise source it standalone itself by:
#     source start.sh
#     source start.sh unset
#
# CAVEATS:
# If your Portal Django backend is not running on :8000, then before start
# you can override by, e.g.  export DATA_PORTAL_API_URL=localhost:5000
#
# Try to be POSIX-y. Only tested on macOS! Contrib welcome for other OSs.

if [ "$(ps -p $$ -ocomm=)" = 'zsh' ] || [ "${BASH_SOURCE[0]}" -ef "$0" ]
then
    ps -p $$ -oargs=
    echo "YOU SHOULD SOURCE THIS SCRIPT, NOT EXECUTE IT!"
    exit 1
fi

command -v aws >/dev/null 2>&1 || {
  echo >&2 "AWS CLI COMMAND NOT FOUND. ABORTING..."
  return 1
}

command -v jq >/dev/null 2>&1 || {
  echo >&2 "JQ COMMAND NOT FOUND. ABORTING..."
  return 1
}

if [ -n "$1" ] && [ "$1" = "unset" ]; then
  unset VITE_REGION
  unset VITE_COG_USER_POOL_ID
  unset VITE_COG_IDENTITY_POOL_ID
  unset VITE_COG_APP_CLIENT_ID_LOCAL
  unset VITE_OAUTH_DOMAIN
  unset VITE_OAUTH_REDIRECT_IN_LOCAL
  unset VITE_OAUTH_REDIRECT_OUT_LOCAL
  echo "UNSET VITE ENV VAR"
  return 0
fi

cog_user_pool_id=$(aws ssm get-parameter --name '/data_portal/client/cog_user_pool_id' --with-decryption | jq -r .Parameter.Value)
if [[ "$cog_user_pool_id" == "" ]]; then
  echo "Halt, No valid AWS login session found. Please 'aws sso login --profile dev && export AWS_PROFILE=dev'"
  return 1
fi
cog_identity_pool_id=$(aws ssm get-parameter --name '/data_portal/client/cog_identity_pool_id' --with-decryption | jq -r .Parameter.Value)
oauth_domain=$(aws ssm get-parameter --name '/data_portal/client/oauth_domain' --with-decryption | jq -r .Parameter.Value)
unsplash_client_id=$(aws ssm get-parameter --name '/data_portal/unsplash/client_id' --with-decryption | jq -r .Parameter.Value)
cog_app_client_id_local=$(aws ssm get-parameter --name '/data_portal/client/cog_app_client_id_local' --with-decryption | jq -r .Parameter.Value)
oauth_redirect_in_local=$(aws ssm get-parameter --name '/data_portal/client/oauth_redirect_in_local' --with-decryption | jq -r .Parameter.Value)
oauth_redirect_out_local=$(aws ssm get-parameter --name '/data_portal/client/oauth_redirect_out_local' --with-decryption | jq -r .Parameter.Value)

export VITE_REGION=ap-southeast-2
export VITE_COG_USER_POOL_ID=$cog_user_pool_id
export VITE_COG_IDENTITY_POOL_ID=$cog_identity_pool_id
export VITE_OAUTH_DOMAIN=$oauth_domain
export VITE_UNSPLASH_CLIENT_ID=$unsplash_client_id
export VITE_COG_APP_CLIENT_ID=$cog_app_client_id_local
export VITE_OAUTH_REDIRECT_IN=$oauth_redirect_in_local
export VITE_OAUTH_REDIRECT_OUT=$oauth_redirect_out_local

# Backend API URLs (default to dev), see [README.md](./README.md)
export VITE_METADATA_URL=${VITE_METADATA_URL:-"https://metadata.dev.umccr.org"}
export VITE_WORKFLOW_URL=${VITE_WORKFLOW_URL:-"https://workflow.dev.umccr.org"}
export VITE_SEQUENCE_RUN_URL=${VITE_SEQUENCE_RUN_URL:-"https://sequence.dev.umccr.org"}
export VITE_FILE_URL=${VITE_FILE_URL:-"https://file.dev.umccr.org"}
export VITE_SSCHECK_URL=${VITE_SSCHECK_URL:-"https://sscheck-orcabus.dev.umccr.org"}

# API Version (default is v1, update this to update the api version respectively)
# export VITE_METADATA_API_VERSION=${VITE_METADATA_API_VERSION:-"v1"}
# export VITE_WORKFLOW_API_VERSION=${VITE_WORKFLOW_API_VERSION:-"v1"}
# export VITE_SEQUENCE_RUN_API_VERSION=${VITE_SEQUENCE_RUN_API_VERSION:-"v1"}
# export VITE_FILE_API_VERSION=${VITE_FILE_API_VERSION:-"v1"}

env | grep VITE

yarn run -B vite
