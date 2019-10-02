FROM node:12.9-alpine as builder

WORKDIR /build

COPY package*json ./

RUN npm i --no-optional --no-audit --silent

COPY . .

RUN npm run build

RUN ls -A | grep -v dist | xargs rm -rf &&  find dist -type d -name '__*' -exec rm -r {} +;

##

FROM node:12.9-alpine

ENV USER=normal-user
RUN adduser --disabled-password --gecos "" $USER

WORKDIR /app

COPY package*json ./
RUN npm i --production --no-optional --no-audit --silent

COPY --from=builder /build/dist dist
COPY bin bin
COPY lib lib

RUN chown $USER -R dist

USER $USER

EXPOSE 5000

CMD npm start
