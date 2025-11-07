# Genesis-Rebuild Windows Setup Script
# Run this in PowerShell to set up your local development environment

Write-Host "🚀 Genesis-Rebuild Local Setup for Windows" -ForegroundColor Cyan
Write-Host "=" -ForegroundColor Cyan -NoNewline; Write-Host ("=" * 59) -ForegroundColor Cyan

# Check if Python is installed
Write-Host "`n🐍 Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "   ✅ $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Python not found!" -ForegroundColor Red
    Write-Host "   Please install Python 3.10+ from https://www.python.org/downloads/" -ForegroundColor Red
    exit 1
}

# Check Python version
$versionMatch = $pythonVersion -match "Python (\d+)\.(\d+)"
if ($versionMatch) {
    $major = [int]$Matches[1]
    $minor = [int]$Matches[2]

    if ($major -lt 3 -or ($major -eq 3 -and $minor -lt 10)) {
        Write-Host "   ❌ Python version too old (need 3.10+)" -ForegroundColor Red
        exit 1
    }
}

# Create virtual environment
Write-Host "`n📦 Creating virtual environment..." -ForegroundColor Yellow
if (Test-Path "venv") {
    Write-Host "   ⚠️  venv already exists, skipping..." -ForegroundColor Yellow
} else {
    python -m venv venv
    Write-Host "   ✅ Virtual environment created" -ForegroundColor Green
}

# Activate virtual environment
Write-Host "`n🔌 Activating virtual environment..." -ForegroundColor Yellow
$activateScript = ".\venv\Scripts\Activate.ps1"

# Check execution policy
$executionPolicy = Get-ExecutionPolicy -Scope CurrentUser
if ($executionPolicy -eq "Restricted") {
    Write-Host "   ⚠️  Execution policy is Restricted, changing to RemoteSigned..." -ForegroundColor Yellow
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
    Write-Host "   ✅ Execution policy updated" -ForegroundColor Green
}

# Activate
& $activateScript

# Upgrade pip
Write-Host "`n⬆️  Upgrading pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip --quiet
Write-Host "   ✅ pip upgraded" -ForegroundColor Green

# Install dependencies
Write-Host "`n📚 Installing dependencies..." -ForegroundColor Yellow
Write-Host "   This may take a few minutes..." -ForegroundColor Gray

if (Test-Path "requirements.txt") {
    pip install -r requirements.txt --quiet
    Write-Host "   ✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  requirements.txt not found, installing core packages..." -ForegroundColor Yellow
    pip install anthropic openai pydantic aiohttp python-dotenv --quiet
    Write-Host "   ✅ Core packages installed" -ForegroundColor Green
}

# Check if .env exists
Write-Host "`n🔑 Checking environment configuration..." -ForegroundColor Yellow
if (!(Test-Path ".env")) {
    Write-Host "   ⚠️  .env file not found, creating template..." -ForegroundColor Yellow

    $envTemplate = @"
# Genesis-Rebuild Environment Configuration
# Add your API keys below (get them from the respective platforms)

# Anthropic Claude (Recommended - get from: https://console.anthropic.com/)
ANTHROPIC_API_KEY=sk-ant-your-key-here

# OpenAI GPT (Optional - get from: https://platform.openai.com/api-keys)
# OPENAI_API_KEY=sk-your-key-here

# Google Gemini (Optional - get from: https://console.cloud.google.com/)
# GEMINI_API_KEY=your-key-here

# MongoDB (Optional - comment out if not using)
# MONGODB_URI=mongodb://localhost:27017/

# Force cloud LLM mode (disable local inference)
FORCE_CLOUD_LLM=true

# Feature flags
FEATURE_FLAGS_CONFIG=config/feature_flags.json

# Logging
LOG_LEVEL=INFO
"@

    $envTemplate | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "   ✅ .env template created" -ForegroundColor Green
    Write-Host "   ⚠️  IMPORTANT: Edit .env and add your API keys!" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ .env file exists" -ForegroundColor Green
}

# Run setup test
Write-Host "`n🧪 Running setup verification..." -ForegroundColor Yellow
Write-Host ""
python test_local_setup.py

# Final instructions
Write-Host "`n" -NoNewline
Write-Host "=" -ForegroundColor Cyan -NoNewline; Write-Host ("=" * 59) -ForegroundColor Cyan
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "=" -ForegroundColor Cyan -NoNewline; Write-Host ("=" * 59) -ForegroundColor Cyan

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "   1. Edit .env file and add your API keys" -ForegroundColor White
Write-Host "      (Open with: notepad .env)" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. Activate virtual environment (if not active):" -ForegroundColor White
Write-Host "      .\venv\Scripts\Activate.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "   3. Run Genesis:" -ForegroundColor White
Write-Host "      python scripts/autonomous_fully_integrated.py" -ForegroundColor Gray
Write-Host ""
Write-Host "   4. For help, see: LOCAL_SETUP_WINDOWS.md" -ForegroundColor White
Write-Host ""
Write-Host "=" -ForegroundColor Cyan -NoNewline; Write-Host ("=" * 59) -ForegroundColor Cyan
