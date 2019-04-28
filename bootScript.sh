#!/bin/bash

mvalue=$( pgrep chromium )
if [ -z "$mvalue" ]
then
        export DISPLAY=:0.0
	chromium-browser --force-device-scale-factor=0.8 --kiosk http://localhost:3000 &
	sudo service nginx restart
fi
