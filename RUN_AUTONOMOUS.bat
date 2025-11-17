@echo off
echo Starting OmniDaemon workers...
start /B scripts\start_omnidaemon_workers.sh

echo Publishing business generation tasks...
omnidaemon task publish --topic genesis.meta.orchestrate --payload "{\"count\":3}"

echo Monitor progress:
echo   omnidaemon metrics --topic genesis.meta.orchestrate
