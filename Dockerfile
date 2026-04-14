# Stage 1: Build Frontend
FROM node:20 AS frontend-build
WORKDIR /app
# Copy the frontend folder into the container
COPY frontend/ ./
# Run install and build inside the folder
RUN cd /app && npm install --legacy-peer-deps && npm run build

# Stage 2: Build Backend
# Using Amazon Corretto - extremely stable and widely available
FROM amazoncorretto:17 AS backend-build
WORKDIR /app
# Install findutils (needed for Gradle on some Linux distros)
RUN yum install -y findutils
# Copy the entire backend
COPY backend/ ./
# Copy built frontend from Stage 1
RUN mkdir -p /app/src/main/resources/static
COPY --from=frontend-build /app/dist/ /app/src/main/resources/static/
# Fix permissions and line endings
RUN tr -d '\r' < gradlew > gradlew.new && mv gradlew.new gradlew && chmod +x gradlew
# Build JAR
RUN ./gradlew bootJar --no-daemon -x test

# Stage 3: Final Production Image
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=backend-build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENV PORT=8080
# Use simple exec form for entrypoint
ENTRYPOINT ["java", "-jar", "app.jar", "--server.port=8080"]
