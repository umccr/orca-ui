FROM public.ecr.aws/docker/library/alpine:latest

WORKDIR /app

# Ensure the asset directory exists
RUN mkdir -p output

COPY ./deploy/lambda/start_build.py ./output

COPY . ./output/artifact-source/
