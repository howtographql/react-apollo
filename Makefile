pwd := $(shell pwd)
PROJ_NAME = $(shell basename $(pwd))
PORT = 3500

ifneq (${ENV}, prod)
ENV := stag
endif
 
.PHONY: create-server
create-server:
	doctl compute droplet create ${PROJ_NAME}-server --size 1gb --image ubuntu-18-04-x64 --region nyc1 --ssh-keys ${DOFP} -t ${DOAT} --tag-names ${PROJ_NAME},${PROJ_NAME}-server-${ENV}

.PHONY: delete-server
delete-server:
	doctl compute droplet delete ${PROJ_NAME}-server-${ENV} -t ${DOAT}


SERVER_IP = ${shell doctl compute droplet list --tag-name ${PROJ_NAME}-server-${ENV} --format "PublicIPv4" -t ${DOAT} | tail -n +2}

DOCKER_TLS_VERIFY="1"
DOCKER_CERT_PATH = ${HOME}/.docker/machine/machines/${PROJ_NAME}
DOCKER_MACHINE_NAME = ${PROJ_NAME}
COMPOSE_CONVERT_WINDOWS_PATHS = "true"
DOCKER_HOST = tcp://${SERVER_IP}:2376

.PHONY: server-ip
server-ip:
	@echo ${SERVER_IP}

.PHONY: delete-old
delete-old: stop-old
	docker rm ${PROJ_NAME}

.PHONY: build-prod-webpack
build-prod-webpack:
	rm -rf build/*
	yarn build
	cp -r build dist
	cp -r public dist
	cp -r src dist


.PHONY: build-prod-docker
build-prod-docker:
	docker build dist -t $(PROJ_NAME) -f Dockerfile

.PHONY: build
build-prod: build-webpack build-docker

.PHONY: stop-old
stop-old:
	docker kill ${PROJ_NAME}

.PHONY: deploy
deploy: build delete-old
	docker run --name ${PROJ_NAME} -p ${PORT}:3000 -d ${PROJ_NAME} 

.PHONY: create-machine
create-machine:
	docker-machine create --driver generic --generic-ip-address=${SERVER_IP} --generic-ssh-user root --generic-ssh-key ${HOME}/secrets/do_id_rsa ${PROJ_NAME}

.PHONY: remove-machine
remove-machine:
	docker-machine rm ${PROJ_NAME}