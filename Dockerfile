FROM gkutiel/texlive_node_extra
ADD . /app

VOLUME ["/data"]
EXPOSE 8979
CMD node /app/src/index.js

