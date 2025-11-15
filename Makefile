
.PHONY: dev build clean stop down

dev: clean build
	docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules shooting-trainer-dev

build:
	docker build --no-cache -t shooting-trainer-dev .

clean:
	docker ps -aq --filter ancestor=shooting-trainer-dev | xargs docker stop | xargs docker rm || true

stop:
	docker stop $(docker ps -q --filter ancestor=shooting-trainer-dev) || true

down: clean
	docker rmi shooting-trainer-dev || true
