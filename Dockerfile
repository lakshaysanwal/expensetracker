# Stage 1: Build Backend (Using pre-built frontend)
FROM amazoncorretto:17 AS backend-build
WORKDIR /app
RUN yum install -y findutils
COPY backend/ ./
# IMPORTANT: The frontend is already pre-built in src/main/resources/static
# Fix line endings and permissions
RUN tr -d '\r' < gradlew > gradlew.new && mv gradlew.new gradlew && chmod +x gradlew
# Build JAR
RUN ./gradlew bootJar --no-daemon -x test -Dorg.gradle.jvmargs="-Xmx512m"

# Stage 2: Final Production Image
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=backend-build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENV PORT=8080
ENTRYPOINT ["java", "-Xmx512m", "-Dserver.port=${PORT}", "-jar", "app.jar"]
