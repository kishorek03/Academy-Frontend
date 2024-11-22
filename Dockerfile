FROM node:20-alpine
WORKDIR /Academy-Frontend
COPY package.json ./
RUN npm install
COPY . .
COPY public/ /Academy-Frontend/public
EXPOSE 3000
CMD ["npm", "start"]
