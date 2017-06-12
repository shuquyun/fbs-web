FROM terminus/herd:0.3.9

COPY public /feebas/public
COPY lib /feebas/lib
COPY node_modules /feebas/node_modules
COPY Pampasfile-*.js /feebas/

WORKDIR /feebas

EXPOSE 8081

CMD herd Pampasfile-docker.js
