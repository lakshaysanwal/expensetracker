# Stage 1: Build Frontend
FROM node:20-slim AS frontend-build
WORKDIR /app
# Copy only package files for efficient caching
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
# Copy all frontend files
COPY frontend/ ./
# Run build - using CI flag to prevent some weird terminal issues
RUN CI=true npm run build

# Stage 2: Build Backend
FROM gradle:8-jdk17 AS backend-build
WORKDIR /app
# Copy the entire backend
COPY backend/ ./
# Fix line endings and permissions
RUN tr -d '\r' < gradlew > gradlew.new && mv gradlew.new gradlew && chmod +x gradlew
# Create the target directory and copy frontend files
RUN mkdir -p src/main/resources/static
COPY --from=frontend-build /app/dist/ src/main/resources/static/
# Build JAR while skipping tests and using a memory-capped daemon
RUN ./gradlew bootJar --no-daemon -x test -Dorg.gradle.jvmargs="-Xmx512m"

# Stage 3: Final Production Image
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=backend-build /app/build/libs/*.jar app.jar
EXPOSE 8080
# Explicitly tell Spring to listen on 8080 (Render requirement)
ENV PORT=8080
ENV JAVA_OPTS="-Xmx512m"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT} -jar app.jar"]
