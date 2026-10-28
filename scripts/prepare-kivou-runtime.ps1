$ErrorActionPreference = 'Stop'
$runtimeRoot = Join-Path $PSScriptRoot '..\ui\creator\.runtime'
New-Item -ItemType Directory -Force -Path $runtimeRoot | Out-Null
$archive = Join-Path $runtimeRoot 'goose-v1.56.0-windows.zip'
$releaseUrl = 'https://github.com/aaif-goose/goose/releases/download/v1.56.0/goose-x86_64-pc-windows-msvc.zip'
if (-not (Test-Path -LiteralPath $archive)) { Invoke-WebRequest -Uri $releaseUrl -OutFile $archive }
$expanded = Join-Path $runtimeRoot 'goose-v1.56.0'
if (-not (Test-Path -LiteralPath $expanded)) { Expand-Archive -LiteralPath $archive -DestinationPath $expanded }
$binary = Get-ChildItem -LiteralPath $expanded -Filter 'goose.exe' -Recurse | Select-Object -First 1
if (-not $binary) { throw 'The pinned release archive did not contain goose.exe.' }
$version = & $binary.FullName --version
if ($LASTEXITCODE -ne 0 -or $version.Trim() -ne '1.56.0') { throw 'The pinned runtime version check failed.' }
$env:KIVOU_GOOSE_BINARY = $binary.FullName
Write-Output ('KIVOU_GOOSE_BINARY is set for this PowerShell session: ' + $binary.FullName)
Get-FileHash -Algorithm SHA256 -LiteralPath $archive
