# Stage 1: Build Frontend
# Using standard Node 22 for maximum library compatibility with Vite 8/Rolldown
FROM node:22 AS frontend-build
WORKDIR /app
# Copy only package files first
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
# Copy all frontend files
COPY frontend/ ./
# Run build with extra memory and skipping strict linting if necessary
RUN NODE_OPTIONS="--max-old-space-size=1024" npm run build

# Stage 2: Build Backend
FROM amazoncorretto:17 AS backend-build
WORKDIR /app
RUN yum install -y findutils
COPY backend/ ./
# Create static directory
RUN mkdir -p src/main/resources/static
# Copy frontend build results
COPY --from=frontend-build /app/dist/ src/main/resources/static/
# Fix line endings and permissions
RUN tr -d '\r' < gradlew > gradlew.new && mv gradlew.new gradlew && chmod +x gradlew
# Build JAR
RUN ./gradlew bootJar --no-daemon -x test -Dorg.gradle.jvmargs="-Xmx512m"

# Stage 3: Final Production Image
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=backend-build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENV PORT=8080
ENTRYPOINT ["java", "-Xmx512m", "-jar", "app.jar", "--server.port=8080"]
