pwd := $(shell pwd)
PROJ_NAME :=
ifeq (${UNAME}, Windows_NT)
PROJ_NAME += @echo $(shell basename $(pwd))
endif


.PHONY: dev
dev:
	yarn dev


.PHONY: create-server
create-server:
	doctl compute droplet create $(PROJ_NAME)-server --size 1gb --image ubuntu-18-04-x64 --region nyc1 --ssh-keys ${DOFP} -t ${DOAT} --tag-names $(PROJ_NAME),$(PROJ_NAME)-server

.PHONY: delete-server
delete-server:
	doctl compute droplet delete $(PROJ_NAME)-server -t ${DOAT}


SERVER_IP = ${shell doctl compute droplet list --tag-name $(PROJ_NAME)-server --format "PublicIPv4" -t ${DOAT} | tail -n +2}

.PHONY: server-ip
server-ip:
	@echo ${SERVER_IP}


.PHONY: delete-old
delete-old: stop-old
	docker rm $(PROJ_NAME)

.PHONY: build-prod-webpack
build-prod-webpack:
	rm -rf build/* && yarn build

.PHONY: build-prod-docker
build-prod-docker: 
	docker build . -t $(PROJ_NAME)

.PHONY: build-prod
build-prod: build-prod-webpack build-prod-docker

.PHONY: stop-old
stop-old:
	docker kill $(PROJ_NAME)

.PHONY: deploy
deploy: build-prod
	docker run --name $(PROJ_NAME) -p 3600:3000 -d $(PROJ_NAME) 

.PHONY: kill-and-deploy
kill-and-deploy: delete-old build-prod

.PHONY: show-proj-name
show-proj-name:
	@echo $(shell basename $(pwd))