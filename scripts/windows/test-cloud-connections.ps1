<#
    .SYNOPSIS
        Quick health check for Genesis cloud dependencies.

    .DESCRIPTION
        Loads environment variables, pings MongoDB Atlas, Upstash Redis,
        Grafana Cloud OTLP, and Better Stack logging endpoint. Prints a
        color-coded summary.
#>

param(
    [string]$EnvFile = "$PSScriptRoot/../../deploy/cloud/genesis-cloud.env"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $EnvFile)) {
    throw "Environment file not found: $EnvFile"
}

Get-Content $EnvFile |
    Where-Object { $_ -and ($_ -notmatch '^#') } |
    ForEach-Object {
        $pair = $_.Split('=',2)
        if ($pair.Length -eq 2) {
            [System.Environment]::SetEnvironmentVariable($pair[0], $pair[1])
        }
    }

function Confirm-Step($name, $action) {
    try {
        $result = & $action
        Write-Host "✔ $name" -ForegroundColor Green
        if ($result) { Write-Host "  $result" }
    } catch {
        Write-Host "✖ $name" -ForegroundColor Red
        Write-Host "  $_"
    }
}

Confirm-Step "MongoDB Atlas reachable" {
    $mongoHost = ([Uri]$env:MONGODB_URI).Host
    Test-Connection -TargetName $mongoHost -Count 1 -ErrorAction Stop | Out-Null
    return "Pinged $mongoHost"
}

Confirm-Step "Upstash Redis reachable" {
    $redisHost = ($env:REDIS_URL.Split("@")[1]).Split(":")[0]
    Test-Connection -TargetName $redisHost -Count 1 -ErrorAction Stop | Out-Null
    return "Pinged $redisHost"
}

Confirm-Step "Grafana Cloud OTLP reachable" {
    $resp = Invoke-WebRequest -Uri $env:GRAFANA_OTLP_ENDPOINT -Method Head -Headers @{
        "Authorization" = "Bearer $($env:GRAFANA_API_KEY)"
    } -ErrorAction Stop
    return "HTTP $($resp.StatusCode)"
}

Confirm-Step "Better Stack ingest reachable" {
    if (-not $env:BETTERSTACK_SOURCE_TOKEN) {
        return "Skipped (no token configured)"
    }
    $resp = Invoke-WebRequest -Uri "https://in.logs.betterstack.com/ingest" `
        -Method Post `
        -Headers @{ "Authorization" = "Bearer $($env:BETTERSTACK_SOURCE_TOKEN)"; "Content-Type" = "application/json" } `
        -Body '{"message":"Genesis connectivity probe","level":"info","service":"health-check"}' `
        -ErrorAction Stop
    return "HTTP $($resp.StatusCode)"
}

Write-Host "`nRun 'podman pod ps' to confirm the genesis-system pod is live." -ForegroundColor Cyan

