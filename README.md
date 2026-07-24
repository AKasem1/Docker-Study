# Docker Study

Personal study repo for learning Docker, built around a small Node/Express API and a React
front-end that get containerized step by step, then wired together with Docker Compose.
The apps themselves are deliberately trivial — the point is the Dockerfile, the
image/container lifecycle, volumes, and the CLI.

---

## Contents

```
docker-crash-course/
├── docker-compose.yml    # runs both services together
├── api/                  # Express API, port 4000
│   ├── app.js
│   ├── package.json      # express + cors, `npm run dev` uses nodemon
│   ├── Dockerfile        # the image definition (annotated)
│   ├── .dockerignore     # keeps node_modules out of the build context
│   └── notes.md          # running command notes taken while studying
└── myblog/               # React front-end, port 3000
    ├── src/ public/
    ├── package.json
    ├── Dockerfile
    └── .dockerignore
```

## The app

A single-endpoint Express server:

| Method | Route | Response |
| ------ | ----- | -------- |
| `GET`  | `/`   | JSON array of review objects |

It listens on **port 4000** inside the container. CORS is enabled so a browser front-end
can hit it directly.

---

## The Dockerfile, line by line

```dockerfile
FROM node:17-alpine
RUN npm install -g nodemon
```
Base layer. `alpine` is a minimal Linux distro — much smaller image than the default
Debian-based `node:17`. `nodemon` is installed globally so the container can run the app
in watch mode.

```dockerfile
WORKDIR /app
```
Sets the working directory *inside the image*. Every following `COPY`, `RUN`, and `CMD`
is relative to it, so you don't have to write `/app/...` everywhere.

```dockerfile
COPY package*.json .
RUN npm install
```
**Order matters.** Copying only the manifests before `npm install` means Docker can reuse
the cached dependency layer whenever source files change but dependencies don't. Copying
everything first would bust that cache on every edit.

```dockerfile
COPY . .
```
Now the source. `.dockerignore` excludes `node_modules` so the host's (possibly
platform-specific) modules never overwrite the ones installed in the image.

```dockerfile
EXPOSE 4000
```
Documentation + a hint to Docker Desktop, which uses it to pre-fill port mapping. It does
**not** publish the port by itself — `docker run -p` is what actually maps it.

```dockerfile
CMD ["npm", "run", "dev"]
```
The process that runs when a container starts. Exec form (JSON array) so the process gets
PID 1 and receives signals properly, instead of being wrapped in a shell.

`npm run dev` maps to `nodemon -L app.js`. The `-L` flag turns on legacy polling — inside
a container, filesystem events from a bind-mounted host directory don't reliably reach
nodemon, so it has to poll for changes instead.

---

## Build and run

```bash
cd api

# build an image tagged "myapp"
docker build -t myapp .

# run it, mapping host port 4000 -> container port 4000
docker run --name myapp_c1 -p 4000:4000 -d myapp

# check it
curl http://localhost:4000
```

Then `docker stop myapp_c1` to stop, `docker start myapp_c1` to bring it back.

---

## Running both services with Compose

Doing this by hand means two builds, two `docker run` invocations, and remembering every
flag. `docker-compose.yml` declares it once:

```bash
docker compose up -d      # build if needed, create, and start everything
docker compose down       # stop and remove containers + networks
```

Each service maps to one container. `api` is published on **4000**, `myblog` on **3000**,
and Compose puts them on a shared network so they can reach each other by service name.

### Volumes — why the app reloads without a rebuild

```yaml
volumes:
  - ./api:/app
  - /app/node_modules
```

The first line is a **bind mount**: the host's `./api` directory is mounted over `/app`
inside the container, so editing a file on your machine changes it in the container
immediately. That's what makes `nodemon` useful — it sees the change and restarts.

The second line is the important trick. The bind mount hides *everything* that was at
`/app`, including the `node_modules` the image installed at build time. Listing
`/app/node_modules` on its own creates an **anonymous volume** at that path, which takes
priority over the bind mount and preserves the container's own dependencies. Without it,
the container would look for modules in the host's `node_modules` — often missing, or
built for the wrong platform.

### `stdin_open` and `tty`

```yaml
stdin_open: true
tty: true
```

The React dev server exits immediately if it isn't attached to an interactive terminal.
These two keep STDIN open and allocate a TTY — the Compose equivalent of `docker run -it`.

---

## Concepts covered

### Images vs. containers
An **image** is a read-only blueprint: a stack of layers containing the runtime, the
dependencies, and the source. A **container** is a running instance of that image with a
thin writable layer on top. One image → many containers.

### Layers and caching
Each instruction in a Dockerfile creates a layer. Docker caches layers and reuses them
while the instruction *and* everything above it are unchanged. This is why dependency
installation goes above the source copy.

### `docker run` vs. `docker start`
- `docker run` — creates a **new** container from an image and starts it
  (`docker create` + `docker start`).
- `docker start` — restarts an **existing**, stopped container. No new container is made.

Running `docker run` repeatedly is a common way to accidentally accumulate dead containers.

### Port mapping
The container has its own network namespace. `-p HOST:CONTAINER` forwards traffic from a
host port to a container port. `-p 8080:4000` means "hit localhost:8080, reach the app on
4000 inside".

### Build context and `.dockerignore`
`docker build .` uploads the whole directory to the daemon as the build context.
`.dockerignore` trims it — faster builds, smaller images, and no host `node_modules`
leaking in.

---

## Command reference

### Images
```bash
docker images                  # list images
docker images node             # filter by name (partial match)
docker build -t myapp .        # build from Dockerfile in current dir
docker build -t myapp:v1 .     # build with an explicit tag
docker image rm myapp          # remove an image
docker image rm myapp -f       # force remove (even if a container used it)
docker system prune -a         # remove all unused images, containers, networks, cache
```

### Tags
`myapp:v1` is `name:tag`. Omitting the tag means `:latest` — which is just a default
label, not a promise that it's the newest build. Tagging explicitly makes it possible to
keep multiple versions of an image side by side.

### Containers
```bash
docker run [OPTIONS] IMAGE     # create + start a container
docker ps                      # running containers
docker ps -a                   # all containers, including stopped
docker stop <name|id>          # stop
docker start <name|id>         # start an existing container
docker rm <name|id>            # remove
docker rm -f <name|id>         # force remove (stops it first)
docker logs -f <name|id>       # tail logs
docker exec -it <name|id> sh   # shell into a running container
```

### Common `docker run` options

| Flag | Meaning |
| ---- | ------- |
| `-d` | detached — run in the background |
| `-p HOST:CONTAINER` | publish a port to the host |
| `--name` | give the container a readable name |
| `--rm` | auto-remove the container when it exits |
| `-e KEY=value` | set an environment variable |
| `-v HOST:CONTAINER` | mount a volume / bind mount |

### Compose
```bash
docker compose up                  # build, create, start, attach
docker compose up -d               # same, detached
docker compose down                # stop + remove containers and networks
docker compose down --rmi all -v   # also remove built images and volumes
```

---

## Notes

Working command notes live in [`api/notes.md`](api/notes.md) and grow as the study
progresses.

Original course material: [iamshaunjp/docker-crash-course](https://github.com/iamshaunjp/docker-crash-course).
