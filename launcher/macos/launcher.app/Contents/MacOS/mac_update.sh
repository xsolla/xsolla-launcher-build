#!/bin/bash
pathToProgramm=$1
pathToUpdater=$2
sleep 5
cp -rf "$pathToUpdater"/* "$pathToProgramm/Contents"
sh "$pathToProgramm/Contents/MacOS/startLauncher.sh"
