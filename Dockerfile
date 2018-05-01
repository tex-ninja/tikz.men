FROM schickling/latex
FROM node
ADD . /app
EXPOSE 9000
CMD node /app/src/index.js

