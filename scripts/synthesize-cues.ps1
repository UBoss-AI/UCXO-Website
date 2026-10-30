param([string]$CueFile,[string]$OutputDirectory)
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Speech
$voice = New-Object System.Speech.Synthesis.SpeechSynthesizer
$voice.SelectVoice('Microsoft David Desktop')
$cues = Get-Content -LiteralPath $CueFile -Raw | ConvertFrom-Json
foreach($cue in $cues){
  $voice.Rate=2
  $voice.SetOutputToWaveFile((Join-Path $OutputDirectory ($cue.id+'.wav')))
  $voice.Speak($cue.text)
  $voice.SetOutputToNull()
}
$voice.Dispose()


