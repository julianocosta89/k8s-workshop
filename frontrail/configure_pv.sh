#!/bin/bash

# Prepare environment before deploying frontail (https://github.com/mthenw/frontail)
sudo mkdir /tmp/pv-data/
sudo chmod 755 -R /tmp/pv-data
USER=ubuntu
#USER=$(whoami)
sudo chown $USER:$USER /tmp/pv-data
export PROMPT_COMMAND='history -a'
ln  ~/.bash_history /tmp/pv-data/history.log
echo "" > /tmp/pv-data/history.log
