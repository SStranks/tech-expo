#!/usr/bin/env bash

# Script to initialize Repl-Set; requires 'mongo:6.0.6-custom' docker image which contains mongo.key in /data

echo "*** Preparing MongoDB Configuration - Sleep 10 Seconds ***"
sleep 10
echo "*** Initializing MongoDB Configuration ***"
mongosh --username $MONGO_USER --password $MONGO_PASSWORD --host $MONGO_HOST --eval "rs.initiate({_id:'$MONGO_REPLSET',members:[{_id:0,host:'$MONGO_REPLSET_NODE1'}]})"