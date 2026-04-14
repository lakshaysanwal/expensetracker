# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
# Use --legacy-peer-deps to avoid common environment conflicts
RUN npm install --legacy-peer-deps
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM gradle:8-jdk17 AS backend-build
WORKDIR /app/backend
COPY backend/ ./
# IMPORTANT: Give execution permission for the build on Linux
RUN chmod +x gradlew
# Copy built frontend from Stage 1 into the backend static resources
COPY --from=frontend-build /app/frontend/dist /app/backend/src/main/resources/static
# Build the backend (skip tests to speed up the deploy)
RUN ./gradlew bootJar --no-daemon -x test

# Stage 3: Final Production Image
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=backend-build /app/backend/build/libs/*.jar app.jar
EXPOSE 8080
# Set environment variable to make sure Spring runs on Port 8080 (Render's default)
ENV PORT=8080
ENTRYPOINT ["java", "-Xmx512m", "-jar", "app.jar"]
