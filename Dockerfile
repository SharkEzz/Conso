FROM node:lts-alpine3.15 AS front_builder

WORKDIR /build
COPY front .
RUN npm i && npm run build

FROM golang:1.18.0-alpine3.15 AS runner

WORKDIR /build
COPY . .
COPY --from=front_builder /build/dist ./front/dist
RUN apk add g++ make
RUN go build -buildvcs=false . 

ENTRYPOINT [ "./elec" ]
