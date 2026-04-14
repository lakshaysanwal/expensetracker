# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app
# Only copy package files first for faster caching
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
# Copy everything else and build
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM gradle:8-jdk17 AS backend-build
WORKDIR /app
# Copy the entire backend folder contents into the workdir
COPY backend/ ./
# FIX: Clean up Windows line endings (CRLF -> LF) and set permissions
RUN tr -d '\r' < gradlew > gradlew.new && mv gradlew.new gradlew && chmod +x gradlew
# Move frontend build into backend resources
COPY --from=frontend-build /app/dist ./src/main/resources/static/
# Build the JAR
RUN ./gradlew bootJar --no-daemon -x test

# Stage 3: Final Production Image
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=backend-build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENV PORT=8080
ENTRYPOINT ["java", "-Xmx512m", "-Dserver.port=${PORT}", "-jar", "app.jar"]
