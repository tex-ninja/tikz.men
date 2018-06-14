FROM gkutiel/texlive_node_extra
ADD . /app

VOLUME ["/tmp"]
EXPOSE 8979
CMD node /app/src/index.js

