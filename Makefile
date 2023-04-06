# You can change the default pattern with `make PATTERN="*.env.dist" build`
PATTERN ?= *.env.dist
env_files := $(shell find . -name $(PATTERN))

# HELP - This will output the help for each task
.PHONY: help

help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.DEFAULT_GOAL := help

# DOCKER TASKS

## Copy .env.dist files
define copy_envs
	$(foreach file, $(env_files), if [ -f $(file) ]; then cp $(file) $(file:.env.dist=.env); fi;)
endef


up: build ## Copy .env.dist file, Starts and Runs the containers
	@$(call copy_envs)
	docker-compose up

build: ## Copy .env.dist file, build containers from custom file
	@$(call copy_envs)
	docker-compose -f docker-compose.build.yml build

up-detach: ## Starts and Runs the containers in detached mode
	@$(call copy_envs)
	docker-compose up --detach

stop: ## Stop and remove a running container
	docker-compose stop

down: ## Remove running images and delete .env files
	docker-compose down --rmi all
	@rm -f -- $(foreach file, $(env_files), $(file:.env.dist=.env))

restart: down up-detach

