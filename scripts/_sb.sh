#!/bin/bash
# stop/start storybook 6007
pid=$(netstat -ano | grep ":6007 " | grep LISTENING | awk '{print $5}' | head -1)
[ -n "$pid" ] && taskkill //F //T //PID $pid >/dev/null 2>&1
sleep 2
L="C:/Users/walder/AppData/Local/Temp/claude/c--Users-walder-Documents-UiNova/d2af93d4-9496-4185-b902-1712c6c4ce58/scratchpad"
[ "$1" = stop ] && exit 0
nohup npx storybook dev -p 6007 --ci --no-open > $L/sb7.log 2>&1 &
for i in $(seq 1 40); do sleep 2; curl -s localhost:6007/index.json >/dev/null && break; done
