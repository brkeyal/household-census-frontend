FROM node:18-alpine as build

WORKDIR /app

# Define the build argument for API URL
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the React app with environment variables
RUN npm run build

# Use nginx to serve the static files
FROM nginx:alpine

# Copy build files from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the nginx port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]