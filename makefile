build:
	docker build -t gkutiel/tikz.men .

publish: build
	docker push gkutiel/tikz.men

run: build
	docker run -d --name tikz.men -p 80:8979 --tmpfs /tmp gkutiel/tikz.men 