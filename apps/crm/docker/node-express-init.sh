#!/usr/bin/env sh
set -euo pipefail

export DEMO_ACC_GENERIC_NON_USER_PASSWORD=$(cat /run/secrets/demo_acc_generic_non_user_password)
export GRAPHQL_INTROSPECT_AUTH=$(cat /run/secrets/graphql_introspect_auth)
export MONGO_USER=$(cat /run/secrets/mongo_user)
export MONGO_PASSWORD=$(cat /run/secrets/mongo_password)
export MONGO_DATABASE=$(cat /run/secrets/mongo_database)
export POSTGRES_PEPPER=$(cat /run/secrets/postgres_pepper)
export POSTGRES_USER=$(cat /run/secrets/postgres_user)
export POSTGRES_PASSWORD=$(cat /run/secrets/postgres_password)
export POSTGRES_DATABASE=$(cat /run/secrets/postgres_database)
export REDIS_PASSWORD=$(cat /run/secrets/redis_password)
export NODEMAILER_USERNAME=$(cat /run/secrets/nodemailer_username)
export NODEMAILER_PASSWORD=$(cat /run/secrets/nodemailer_password)
export NODEMAILER_DEV_EMAIL=$(cat /run/secrets/nodemailer_dev_email)
export JWT_AUTH_SECRET=$(cat /run/secrets/jwt_auth_secret)
export JWT_REFRESH_SECRET=$(cat /run/secrets/jwt_refresh_secret)

npm start