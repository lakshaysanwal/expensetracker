# Stage 1: Build Frontend
# Upgrade to Node 20 as required by Vite 8
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM gradle:8-jdk17 AS backend-build
WORKDIR /app
COPY backend/ ./
# Clean up Windows line endings
RUN tr -d '\r' < gradlew > gradlew.new && mv gradlew.new gradlew && chmod +x gradlew
# Copy built frontend
COPY --from=frontend-build /app/dist ./src/main/resources/static/
# Build the JAR
RUN ./gradlew bootJar --no-daemon -x test

# Stage 3: Final Production Image
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=backend-build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENV PORT=8080
ENTRYPOINT ["java", "-Xmx512m", "-Dserver.port=${PORT}", "-jar", "app.jar"]
