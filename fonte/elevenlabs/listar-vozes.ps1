# Lista as vozes da sua conta ElevenLabs e salva em vozes.json (sem a chave).
$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$key = (Get-Content -Raw (Join-Path $here 'chave.txt')).Trim()
if (-not $key -or $key -like 'COLE_*') { Write-Host 'Cole sua chave da ElevenLabs no arquivo chave.txt e rode de novo.' -ForegroundColor Red; exit 1 }
$h = @{ 'xi-api-key' = $key }
$all = @(); $token = $null
do {
  $url = 'https://api.elevenlabs.io/v2/voices?page_size=100&include_total_count=true'
  if ($token) { $url += '&next_page_token=' + [uri]::EscapeDataString($token) }
  $r = Invoke-RestMethod -Uri $url -Headers $h
  $all += $r.voices
  $token = $r.next_page_token
} while ($r.has_more)
$list = $all | ForEach-Object { [pscustomobject]@{ voice_id = $_.voice_id; name = $_.name; category = $_.category; labels = $_.labels; languages = ($_.verified_languages | ForEach-Object { $_.language + '/' + $_.accent }) -join ', ' } }
$list | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 (Join-Path $here 'vozes.json')
try { $s = Invoke-RestMethod -Uri 'https://api.elevenlabs.io/v1/user/subscription' -Headers $h; Write-Host ("Plano: {0}. Creditos usados: {1} de {2}." -f $s.tier, $s.character_count, $s.character_limit) } catch {}
Write-Host ("{0} vozes salvas em vozes.json. Avise o Claude." -f $list.Count) -ForegroundColor Green
