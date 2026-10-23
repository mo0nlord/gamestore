$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
& "$PSScriptRoot\.venv\Scripts\python.exe" "$PSScriptRoot\manage.py" $args
