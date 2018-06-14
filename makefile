compile:
	npm i && npm update && ~/.npm-global/bin/tsc

prune: 
	npm prune --production && npm dedupe

build: compile prune 
	docker build -t gkutiel/tikz.men .

push: build
	docker push gkutiel/tikz.men

run: build
	docker run -d --name tikz.men -p 80:8979 --tmpfs /tmp gkutiel/tikz.men 