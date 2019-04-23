.PHONY: start-everything-local
start-everything-local:
	docker-machine start default
	docker-compose up -d -f server/docker-compose-yml