#!/bin/bash

# Script to initialize Repl-Set; requires 'mongo:6.0.6-custom' docker image which contains mongo.key in /data

echo "*** Preparing MongoDB Configuration - Sleep 10 Seconds ***"
sleep 10
echo "*** Initializing MongoDB Configuration ***"
mongosh --username $MONGODB_USER --password $MONGODB_PASSWORD --host $MONGODB_HOST --eval "rs.initiate({_id:'$MONGODB_REPLSET',members:[{_id:0,host:'$MONGODB_REPLSET_NODE1'}]})"