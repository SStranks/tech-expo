#!/usr/bin/env sh
set -eu

DEMO_ACC_GENERIC_NON_USER_PASSWORD="$(cat /run/secrets/demo_acc_generic_non_user_password)"
GRAPHQL_INTROSPECT_AUTH="$(cat /run/secrets/graphql_introspect_auth)"
MONGO_USER="$(cat /run/secrets/mongo_user_service)"
MONGO_PASSWORD="$(cat /run/secrets/mongo_password_service)"
MONGO_DATABASE="$(cat /run/secrets/mongo_database)"
POSTGRES_PEPPER="$(cat /run/secrets/postgres_pepper)"
POSTGRES_USER="$(cat /run/secrets/postgres_user_service)"
POSTGRES_PASSWORD="$(cat /run/secrets/postgres_password_service)"
POSTGRES_DATABASE="$(cat /run/secrets/postgres_database)"
REDIS_PASSWORD="$(cat /run/secrets/redis_password)"
NODEMAILER_USERNAME="$(cat /run/secrets/nodemailer_username)"
NODEMAILER_PASSWORD="$(cat /run/secrets/nodemailer_password)"
NODEMAILER_DEV_EMAIL="$(cat /run/secrets/nodemailer_dev_email)"
JWT_AUTH_SECRET="$(cat /run/secrets/jwt_auth_secret)"
JWT_REFRESH_SECRET="$(cat /run/secrets/jwt_refresh_secret)"

: "${DEMO_ACC_GENERIC_NON_USER_PASSWORD:?demo_acc_generic_non_user_password is empty}"
: "${GRAPHQL_INTROSPECT_AUTH:?graphql_introspect_auth is empty}"
: "${MONGO_USER:?mongo_user_service is empty}"
: "${MONGO_PASSWORD:?mongo_password_service is empty}"
: "${MONGO_DATABASE:?mongo_database is empty}"
: "${POSTGRES_PEPPER:?postgres_pepper is empty}"
: "${POSTGRES_USER:?postgres_user_service is empty}"
: "${POSTGRES_PASSWORD:?postgres_password_service is empty}"
: "${POSTGRES_DATABASE:?postgres_database is empty}"
: "${REDIS_PASSWORD:?redis_password is empty}"
: "${NODEMAILER_USERNAME:?nodemailer_username is empty}"
: "${NODEMAILER_PASSWORD:?nodemailer_password is empty}"
: "${NODEMAILER_DEV_EMAIL:?nodemailer_dev_email is empty}"
: "${JWT_AUTH_SECRET:?jwt_auth_secret is empty}"
: "${JWT_REFRESH_SECRET:?jwt_refresh_secret is empty}"

export DEMO_ACC_GENERIC_NON_USER_PASSWORD
export GRAPHQL_INTROSPECT_AUTH
export MONGO_USER
export MONGO_PASSWORD
export MONGO_DATABASE
export POSTGRES_PEPPER
export POSTGRES_USER
export POSTGRES_PASSWORD
export POSTGRES_DATABASE
export REDIS_PASSWORD
export NODEMAILER_USERNAME
export NODEMAILER_PASSWORD
export NODEMAILER_DEV_EMAIL
export JWT_AUTH_SECRET
export JWT_REFRESH_SECRET

npm start
