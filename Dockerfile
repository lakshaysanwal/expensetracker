# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM gradle:8-jdk17 AS backend-build
WORKDIR /app/backend
COPY backend/ ./
# Copy built frontend to backend static resources
COPY --from=frontend-build /app/frontend/dist /app/backend/src/main/resources/static
RUN ./gradlew bootJar --no-daemon

# Stage 3: Final Production Image
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=backend-build /app/backend/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
