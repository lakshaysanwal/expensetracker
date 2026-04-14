# Deployment Build Script
Write-Host "--- Starting Production Build ---" -ForegroundColor Cyan

# 1. Build Frontend
Write-Host "Building Frontend..." -ForegroundColor Yellow
cd frontend
npm run build
cd ..

# 2. Clean and Prepare Backend Static Folder
Write-Host "Preparing Backend Static Folder..." -ForegroundColor Yellow
$staticDir = "backend/src/main/resources/static"
if (Test-Path $staticDir) { Remove-Item -Recurse -Force $staticDir }
New-Item -ItemType Directory -Path $staticDir

# 3. Copy Frontend Build to Backend
Write-Host "Copying Frontend to Backend..." -ForegroundColor Yellow
Copy-Item -Path "frontend/dist/*" -Destination $staticDir -Recurse

# 4. Build Backend JAR
Write-Host "Building Backend Executable..." -ForegroundColor Yellow
cd backend
.\gradlew.bat bootJar
cd ..

Write-Host "--- Deployment Ready ---" -ForegroundColor Green
Write-Host "Your final deployable file is located at: backend/build/libs/backend-0.0.1-SNAPSHOT.jar" -ForegroundColor Cyan
