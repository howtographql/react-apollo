pwd := $(shell pwd)
PROJ_NAME = $(shell basename $(pwd))
PORT = 3500
ifneq (${ENV}, prod)
ENV := stag
endif
NAME_ENV = ${PROJ_NAME}-${ENV}
 
.PHONY: create-server
create-server:
	doctl compute droplet create ${NAME_ENV}-server --size 1gb --image ubuntu-18-04-x64 --region nyc1 --ssh-keys ${DOFP} -t ${DOAT} --tag-names ${NAME_ENV}-server

.PHONY: delete-server
delete-server:
	doctl compute droplet delete ${NAME_ENV}-server -t ${DOAT}


ifneq (${LOC}, local)
SERVER_IP = ${shell doctl compute droplet list --tag-name ${NAME_ENV}-server --format "PublicIPv4" -t ${DOAT} | tail -n +2}
DOCKER_TLS_VERIFY="1"
DOCKER_CERT_PATH = ${HOME}/.docker/machine/machines/${NAME_ENV}
DOCKER_MACHINE_NAME = ${NAME_ENV}
COMPOSE_CONVERT_WINDOWS_PATHS = "true"
DOCKER_HOST = tcp://${SERVER_IP}:2376
endif

.PHONY: server-ip
server-ip:
	@echo http://${SERVER_IP}:${PORT}


.PHONY: delete-old
delete-old: stop-old
	-docker rm ${NAME_ENV}

.PHONY: stop-old
stop-old:
	-docker kill ${NAME_ENV}


.PHONY: build-webpack
build-webpack:
	rm -rf build/*
	yarn build
	cp -r build dist
	cp -r public dist
	cp -r src dist
	cp package.json dist
	cp yarn.lock dist

.PHONY: build-docker
build-docker:
	docker build dist -t $(NAME_ENV) -f Dockerfile

.PHONY: build
build: build-webpack build-docker


.PHONY: deploy
deploy: build delete-old
	docker run --name ${NAME_ENV} -p ${PORT}:3000 -d ${NAME_ENV} 
	@echo Listening on  http://${SERVER_IP}:${PORT}


.PHONY: create-machine
create-machine:
	docker-machine create --driver generic --generic-ip-address=${SERVER_IP} --generic-ssh-user root --generic-ssh-key ${HOME}/secrets/do_id_rsa ${NAME_ENV}

.PHONY: remove-machine
remove-machine:
	docker-machine rm ${NAME_ENV}