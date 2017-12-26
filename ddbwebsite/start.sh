#!/usr/bin/env bash

if (forever list | grep ddbwebsite); then
    forever stop ddbwebsite;
fi;
forever start -a --uid ddbwebsite back/app.js