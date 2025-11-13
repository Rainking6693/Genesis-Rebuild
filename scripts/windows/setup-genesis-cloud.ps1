<#
    .SYNOPSIS
        Bootstraps the Genesis cloud-native agent stack on Windows using Podman.

    .DESCRIPTION
        1. Validates prerequisites (Podman + kubectl)
        2. Loads cloud credentials from deploy/cloud/genesis-cloud.env
        3. Tests connectivity to MongoDB Atlas, Upstash Redis, Grafana Cloud
        4. Creates ConfigMaps for connection strings
        5. Launches the genesis-system pod with 25 agents + OTLP collector
        6. Prints URLs for dashboards and log viewers

    .NOTES
        Run this script from an elevated PowerShell terminal.
#>

param(
    [string]$EnvFile = "$PSScriptRoot/../../deploy/cloud/genesis-cloud.env",
    [string]$PodManifest = "$PSScriptRoot/../../deploy/cloud/genesis-pod-cloud.yaml",
    [string]$OtelConfig = "$PSScriptRoot/../../deploy/cloud/otel-config-cloud.yaml"
)

$ErrorActionPreference = "Stop"

function Write-Status($message) {
    Write-Host "[+] $message" -ForegroundColor Cyan
}

function Assert-Command($name, $hint) {
    if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
        throw "Missing command '$name'. $hint"
    }
}

Write-Status "Validating prerequisites"
Assert-Command -name "podman" -hint "Install Podman Desktop for Windows: https://podman.io/getting-started/installation"
Assert-Command -name "kubectl" -hint "Install kubectl: https://kubernetes.io/docs/tasks/tools/"

if (-not (Test-Path $EnvFile)) {
    throw "Environment file not found: $EnvFile"
}

Write-Status "Loading environment variables from $EnvFile"
Get-Content $EnvFile |
    Where-Object { $_ -and ($_ -notmatch '^#') } |
    ForEach-Object {
        $pair = $_.Split('=',2)
        if ($pair.Length -eq 2) {
            [System.Environment]::SetEnvironmentVariable($pair[0], $pair[1])
        }
    }

function Test-MongoConnection {
    Write-Status "Testing MongoDB Atlas connectivity"
    $script = @"
from pymongo import MongoClient
import os
uri = os.getenv("MONGODB_URI")
if not uri:
    raise SystemExit("Missing MONGODB_URI")
client = MongoClient(uri, tls=True, tlsAllowInvalidCertificates=False)
print(client.admin.command("ping"))
"@
    podman run --rm `
        --env MONGODB_URI=$env:MONGODB_URI `
        --pull=always `
        python:3.12-slim `
        python - <<'PY'
$script
PY
}

function Test-RedisConnection {
    Write-Status "Testing Upstash Redis connectivity"
    $script = @"
import os, redis
url = os.getenv("REDIS_URL")
if not url:
    raise SystemExit("Missing REDIS_URL")
client = redis.from_url(url, ssl=True)
client.set("genesis:ping", "pong", ex=20)
print(client.get("genesis:ping"))
"@
    podman run --rm `
        --env REDIS_URL=$env:REDIS_URL `
        --pull=always `
        python:3.12-slim `
        sh -c "pip install -q redis pymongo && python - <<'PY'
$script
PY"
}

function Test-GrafanaCredentials {
    Write-Status "Validating Grafana Cloud OTLP endpoint"
    $response = Invoke-WebRequest -Uri $env:GRAFANA_OTLP_ENDPOINT -Method Head -Headers @{
        "Authorization" = "Bearer $($env:GRAFANA_API_KEY)"
    } -ErrorAction Stop
    if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 400) {
        Write-Status "Grafana Cloud endpoint reachable (HTTP $($response.StatusCode))"
    } else {
        throw "Unexpected Grafana response: $($response.StatusCode)"
    }
}

Test-MongoConnection
Test-RedisConnection
Test-GrafanaCredentials

Write-Status "Creating ConfigMap for OTEL collector"
kubectl delete configmap otel-config -n default -ErrorAction SilentlyContinue | Out-Null
kubectl create configmap otel-config --from-file=otel-config-cloud.yaml=$OtelConfig | Out-Null

Write-Status "Applying genesis pod manifest"
kubectl delete pod genesis-system -n default -ErrorAction SilentlyContinue | Out-Null
kubectl apply -f $PodManifest | Out-Null

Write-Status "Waiting for pod readiness"
kubectl wait pod/genesis-system --for=condition=Ready --timeout=300s | Out-Null

Write-Host "`nGenesis cloud stack is online!" -ForegroundColor Green
Write-Host "• Pod status:    kubectl get pod genesis-system -o wide"
Write-Host "• MongoDB Atlas: https://cloud.mongodb.com/"
Write-Host "• Upstash:       https://console.upstash.com/redis"
Write-Host "• Grafana:       https://grafana.com/orgs (use your stack URL)"
Write-Host "• Better Stack:  https://logs.betterstack.com/" 
Write-Host "• Verify OTLP:   Grafana → Explore → Query `{service_name=\"genesis-agents\"}`"

Write-Status "All done. Run scripts/windows/test-cloud-connections.ps1 to re-check anytime."

