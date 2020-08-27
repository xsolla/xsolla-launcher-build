#!/bin/bash

configPath="$1"

./buildIncreaser/BuildIncreaser -config_json $configPath -log
