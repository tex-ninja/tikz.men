FROM gkutiel/tex.ninja:init
ADD . /app

VOLUME ["/data"]
EXPOSE 9000
CMD node /app/src/index.js

