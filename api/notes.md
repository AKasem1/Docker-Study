# Notes

## For listing images

```bash
# list all images:
# docker images

# list only images with name "node" (partial match):
# docker images node

# list all images (long format - shows more details):
# docker images -l

```

## For creating and running containers

```bash
# create a container from an image:
# docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
# 
# common options:
# -d: run in detached mode (background)
# -p: publish a container's port to the host
# --name: name the container
# --rm: remove the container when it exits
# -e: set environment variables
# -v: mount volumes
#
# example:
# docker run -d -p 8080:4000 --name my-container my-image
# docker run -d -p 8080:4000 --name my-container my-image
# docker run --name myapp_c2 -p 4000:4000 -d myapp
# docker run --name myapp_c1 myapp

```

## Difference between docker run and docker start

- `docker run`: Creates a **new** container from an image and starts it. It essentially combines `docker create` and `docker start`.
- `docker start`: Starts an **existing** but stopped container. It does not create a new container.

## For listing current running processes

```bash
# list all containers:
# docker ps

# list all containers (including stopped ones):
# docker ps -a

```
## Stop and remove a container

```bash
# stop a container:
# docker stop <container_id_or_name>

# remove a container:
# docker rm <container_id_or_name>

# force remove a container:
# docker rm -f <container_id_or_name>

```