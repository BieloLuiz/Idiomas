# Gera o audio do curso pela API da ElevenLabs.
# Uso: gerar-teste.bat (6 falas, uma por voz) ou gerar-tudo.bat (todas).
param([switch]$Teste, [string]$Manifest = 'manifest-11labs.json', [string]$Saida = 'audio', [string]$Zip = 'audio-11labs.zip', [string]$Chave = 'chave.txt')
$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$kf = Join-Path $here $Chave
if (-not (Test-Path $kf)) { Set-Content -Path $kf -Value 'COLE_SUA_CHAVE_AQUI'; Write-Host ('Criei o arquivo ' + $Chave + '. Cole nele a chave da ElevenLabs e rode de novo.') -ForegroundColor Yellow; exit 1 }
$key = (Get-Content -Raw $kf).Trim()
if (-not $key -or $key -like 'COLE_*') { Write-Host ('Cole sua chave da ElevenLabs no arquivo ' + $Chave + ' e rode de novo.') -ForegroundColor Red; exit 1 }
$cfg = Get-Content -Raw -Encoding UTF8 (Join-Path $here 'config.json') | ConvertFrom-Json
$items = Get-Content -Raw -Encoding UTF8 (Join-Path $here $Manifest) | ConvertFrom-Json
$missing = @($cfg.vozes.PSObject.Properties | Where-Object { -not $_.Value } | ForEach-Object { $_.Name })
if ($missing.Count -gt 0) { Write-Host ("Ainda sem voz (serao pulados): " + ($missing -join ', ')) -ForegroundColor Yellow }
$items = @($items | Where-Object { $cfg.vozes.($_.role) })
$h = @{ 'xi-api-key' = $key }
function Credits { try { $s = Invoke-RestMethod -Uri 'https://api.elevenlabs.io/v1/user/subscription' -Headers $h; return [int]$s.character_count } catch { return $null } }

if ($Teste) {
  $out = Join-Path $here 'audio-teste'
  $seen = @{}; $sel = @()
  foreach ($it in $items) { if (-not $seen.ContainsKey($it.role) -and $it.text.Length -gt 20) { $seen[$it.role] = 1; $sel += $it } }
  $items = $sel
} else { $out = Join-Path $here $Saida }
New-Item -ItemType Directory -Force -Path $out | Out-Null

$before = Credits
$n = $items.Count; $i = 0; $fail = 0; $chars = 0
foreach ($it in $items) {
  $i++
  $name = if ($Teste) { "$($it.role).mp3" } else { $it.f }
  $file = Join-Path $out $name
  if (Test-Path $file) { continue }
  $vid = $cfg.vozes.($it.role)
  $json = @{ text = $it.text; model_id = $cfg.modelo; language_code = $it.lang } | ConvertTo-Json -Compress
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
  $url = "https://api.elevenlabs.io/v1/text-to-speech/$vid" + "?output_format=" + $cfg.formato
  try {
    Invoke-WebRequest -Uri $url -Method Post -Headers $h -ContentType 'application/json; charset=utf-8' -Body $bytes -OutFile "$file.part" -UseBasicParsing -TimeoutSec 300
    Move-Item -Force "$file.part" $file
    $chars += $it.text.Length
    Write-Host ("[{0}/{1}] {2}: {3}" -f $i, $n, $it.role, $it.text)
  } catch {
    $fail++
    Remove-Item -ErrorAction SilentlyContinue "$file.part"
    $msg = $_.Exception.Message
    try { $msg += ' ' + $_.ErrorDetails.Message } catch {}
    Write-Host ("[{0}/{1}] ERRO: {2} -> {3}" -f $i, $n, $it.text, $msg) -ForegroundColor Red
    if ($msg -match 'quota|credits|401|402') { Write-Host 'Parece falta de creditos ou chave invalida. Parando.' -ForegroundColor Red; break }
  }
  Start-Sleep -Milliseconds 150
}
$after = Credits
Write-Host ""
Write-Host "Caracteres enviados agora: $chars. Erros: $fail."
if ($before -ne $null -and $after -ne $null) { Write-Host ("Creditos gastos agora: {0}" -f ($after - $before)) }
if ($Teste) { Write-Host 'Ouca os arquivos na pasta audio-teste e diga ao Claude o que achou.' -ForegroundColor Green }
else {
  Compress-Archive -Force -Path (Join-Path $out '*.mp3') -DestinationPath (Join-Path $here $Zip)
  Write-Host ('Pronto! Avise o Claude que o ' + $Zip + ' foi gerado.') -ForegroundColor Green
}
