# x509 TLS Ceritification

- [Required Files](#required-files)
  - [Development](#for-development)
    - [Client Certification](#client-certification)
  - [Production](#for-production)

## Required files

Commands should be run from the current directory.

### For development:

#### Client Certification

###### expressjs-&lt;SERVICE&gt;.key

```console
openssl genrsa -out expressjs-mongo.key 4096
openssl genrsa -out expressjs-postgres.key 4096
openssl genrsa -out expressjs-postgreseeder.key 4096
openssl genrsa -out expressjs-redis.key 4096
```

###### expressjs-&lt;SERVICE&gt;.csr

⚠️ **Important**: Postgres utilizes the CN field in mTLS to match against the username attempting to log-on to its service. Replace `<USERNAME>` in the following code with the appropriate postgres username.

```console
openssl req -new -key expressjs-mongo.key -out expressjs-mongo.csr -subj "/C=GB/ST=Dev/L=Local/O=techexpo_crm/OU=dev_expressjs/CN=mongo"
openssl req -new -key expressjs-postgres.key -out expressjs-postgres.csr -subj "/C=GB/ST=Dev/L=Local/O=techexpo_crm/OU=dev_expressjs/CN=<USERNAME>"
openssl req -new -key expressjs-postgresseeder.key -out expressjs-postgresseeder.csr -subj "/C=GB/ST=Dev/L=Local/O=techexpo_crm/OU=dev_expressjs/CN=<USERNAME>"
openssl req -new -key expressjs-redis.key -out expressjs-redis.csr -subj "/C=GB/ST=Dev/L=Local/O=techexpo_crm/OU=dev_expressjs/CN=redis"
```

###### expressjs-&lt;SERVICE&gt;.crt

```console
openssl x509 -req -in expressjs-mongo.csr -CA ../root-ca.crt -CAkey ../root-ca.key -CAcreateserial -out expressjs-mongo.crt -days 365 -sha256 -extfile ../client-ext.cnf
openssl x509 -req -in expressjs-postgres.csr -CA ../root-ca.crt -CAkey ../root-ca.key -CAcreateserial -out expressjs-postgres.crt -days 365 -sha256 -extfile ../client-ext.cnf
openssl x509 -req -in expressjs-postgresseeder.csr -CA ../root-ca.crt -CAkey ../root-ca.key -CAcreateserial -out expressjs-postgresseeder.crt -days 365 -sha256 -extfile ../client-ext.cnf
openssl x509 -req -in expressjs-redis.csr -CA ../root-ca.crt -CAkey ../root-ca.key -CAcreateserial -out expressjs-redis.crt -days 365 -sha256 -extfile ../client-ext.cnf
```

###### expressjs-mongo.pem

This file is required for the expressjs/PinoLogger connection to Mongo

```console
cat expressjs-mongo.key expressjs-mongo.crt > expressjs-mongo.pem
```

### For production:

Refer to [Production Certification](../../README.md#for-production)
