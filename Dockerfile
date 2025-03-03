FROM node:22.12.0-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG VITE_APP_API_URL
ENV VITE_APP_API_URL=$VITE_APP_API_URL

ARG VITE_NODE_ENV
ENV VITE_NODE_ENV=$VITE_NODE_ENV

ARG VITE_SOCKET_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL

RUN npm run build

RUN mkdir -p /frontend-build && cp -r /app/dist/* /frontend-build/

CMD ["echo", "Frontend build complete. Nginx will serve the files."]

# FROM nginx:1.25.3-alpine-slim

# COPY --from=build /app/dist /usr/share/nginx/html
# COPY ./nginx.conf /etc/nginx/nginx.conf

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]