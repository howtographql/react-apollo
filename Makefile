pwd := $(shell pwd)
PROJ_NAME :=
ifeq (${UNAME}, Windows_NT)
PROJ_NAME += @echo $(shell basename $(pwd))
endif

.PHONY: create-server
create-server:
	doctl compute droplet create price-guide-server --size 1gb --image ubuntu-18-04-x64 --region nyc1 --ssh-keys ${DOFP} -t ${DOAT} --tag-names price-guide,price-guide-server

.PHONY: delete-server
delete-server:
	doctl compute droplet delete price-guide-server -t ${DOAT}


SERVER_IP = ${shell doctl compute droplet list --tag-name price-guide-server --format "PublicIPv4" -t ${DOAT} | tail -n +2}

.PHONY: server-ip
server-ip:
	@echo ${SERVER_IP}


.PHONY: delete-old
delete-old: stop-old
	docker rm priceguide

.PHONY: build-prod-webpack
build-prod-webpack:
	rm -rf build/* && yarn build

.PHONY: build-prod-docker
build-prod-docker: 
	docker build . -t priceguide

.PHONY: build-prod
build-prod: build-prod-webpack build-prod-docker

.PHONY: stop-old
stop-old:
	docker kill priceguide

.PHONY: deploy
deploy: build-prod
	docker run --name priceguide -p 3600:3000 -d priceguide 

.PHONY: kill-and-deploy
kill-and-deploy: delete-old build-prod

.PHONY: show-proj-name
show-proj-name:
	@echo $(shell basename $(pwd))