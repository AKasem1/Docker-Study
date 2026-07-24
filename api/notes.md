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

## For listing current running processes and containers

```bash
# list all containers:
# docker ps

# list all containers (including stopped ones):
# docker ps -a

```

## Listing all images

```bash
# list all images:
# docker images

# list only images with name "node" (partial match):
# docker images node

# list all images (long format - shows more details):
# docker images -l

```

## Managing Containers and Images

```bash
# Remove an image:
# docker image rm <image_name_or_id>
# example: docker image rm myapp3

# Force remove an image:
# docker image rm <image_name_or_id> -f
# example: docker image rm myapp4 -f

# Remove a single container:
# docker container rm <container_name_or_id>
# example: docker container rm myapp4_c

# Remove multiple containers at once:
# docker container rm <container1> <container2> ...
# example: docker container rm myapp_c1 myapp_c2

# Remove all unused containers, networks, images, and build cache:
# docker system prune -a

# Build an image with a specific tag:
# docker build -t <image_name:tag> <path>
# example: docker build -t myapp4:v1 .

# Run a container from a tagged image with name and port mapping:
# docker run --name <container_name> -p <host_port>:<container_port> <image_name:tag>
# example: docker run --name myapp_c -p 4000:4000 myapp4:v1

```

## Running Containers with Nodemon & Auto-Removal (--rm)

```bash
# Run container in detached (background) mode:
# docker run --name myapp_c_nodemon -p 4000:4000 -d myapp:nodemon

# Run container in background and automatically remove it (--rm) when stopped:
# docker run --name myapp_c_nodemon -p 4000:4000 -d --rm myapp:nodemon

# Stop the running container (auto-removed if --rm was passed):
# docker stop myapp_c_nodemon

# Run in interactive/foreground mode to view live logs (e.g., nodemon console output):
# Automatically removes the container when stopped with Ctrl+C (^C):
# docker run --name myapp_c_nodemon -p 4000:4000 --rm myapp:nodemon
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



### Key Takeaways:
- **`-d`**: Runs the container in the background (detached mode) and outputs the container ID.
- **`--rm`**: Tells Docker to automatically remove the container when it exits or is stopped.
- **Foreground Mode (without `-d`)**: Streams container output (e.g. `nodemon` logs) directly to your terminal. Pressing `Ctrl+C` (`^C`) sends an interrupt signal to stop the container (which auto-deletes if `--rm` is used).

## Docker Compose Commands

```bash
# Build, (re)create, start, and attach to containers for all services defined in docker-compose.yml:
# docker compose up

# Run services in detached mode (background):
# docker compose up -d

# Stop and remove containers and networks created by 'docker compose up':
# docker compose down

# Stop containers and remove containers, networks, ALL images built/used by services, and volumes:
# docker compose down --rmi all -v
```

### Example Usage:
```bash
# Start your project in detached mode:
docker compose up -d

# Stop and clean up everything (including images and volumes):
docker compose down --rmi all -v
```

### Options Breakdown for `docker compose down`:
- `--rmi all`: Removes **all** images built or used by services in the compose file.
- `-v` (or `--volumes`): Removes **volumes** (both named and anonymous volumes attached to containers).

> [!NOTE]
> **Obsolete `version` attribute**: In Docker Compose V2 specification, the top-level `version: "3.8"` property is obsolete and can be safely removed from `docker-compose.yml`.
