# x509 TLS Ceritification

- [Required Files](#required-files)
  - [Development](#for-development)
    - [Server Certification](#server-certification)
    - [Client Certification](#client-certification)
  - [Production](#for-production)

## Required files

Commands should be run from the current directory.

### For development:

#### Server Certification

###### redis.key

```console
openssl genrsa -out redis.key 4096
```

###### redis.csr

```console
openssl req -new -key redis.key -out redis.csr -subj "/C=GB/ST=Dev/L=Local/O=techexpo_crm/OU=dev_redis/CN=localhost"
```

###### server-ext.cnf

```yaml
# server-ext.cnf

authorityKeyIdentifier = keyid, issuer
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = techexpo-redis
DNS.2 = localhost
IP.1 = 127.0.0.1
```

###### redis.crt

```console
openssl x509 -req -in redis.csr -CA ../root-ca.crt -CAkey ../root-ca.key -CAcreateserial -out redis.crt -days 365 -sha256 -extfile server-ext.cnf
```

#### Client Certification

###### redis-healthcheck.key

```console
openssl genrsa -out redis-healthcheck.key 4096
```

###### redis-healthcheck.csr

```console
openssl req -new -key redis-healthcheck.key -out redis-healthcheck.csr -subj "/C=GB/ST=Dev/L=Local/O=techexpo_crm/OU=dev_redis/CN=localhost"
```

###### redis-healthcheck.crt

```console
openssl x509 -req -in redis-healthcheck.csr -CA ../root-ca.crt -CAkey ../root-ca.key -CAcreateserial -out redis-healthcheck.crt -days 365 -sha256 -extfile ../client-ext.cnf
```

### For production:

Refer to [Production Certification](../../README.md#for-production)
