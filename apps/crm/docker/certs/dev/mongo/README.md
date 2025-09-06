# x509 TLS Ceritification

- [Required Files](#required-files)
  - [Development](#for-development)
    - [Server Certification](#server-certification)
    - [Client Certification](#client-certification)
  - [Production](#for-production)
- [mongod.conf](#mongodconf)

## Required files

Commands should be run from the current directory.

### For development:

#### Server Certification

###### mongo.key

```console
openssl genrsa -out mongo.key 4096
```

###### mongo.csr

```console
openssl req -new -key mongo.key -out mongo.csr -subj "/C=GB/ST=Dev/L=Local/O=techexpo_crm/OU=dev_mongo/CN=localhost"
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
DNS.1 = techexpo-mongo
DNS.2 = localhost
IP.1 = 127.0.0.1
```

###### mongo.crt

```console
openssl x509 -req -in mongo.csr -CA ../root-ca.crt -CAkey ../root-ca.key -CAcreateserial -out mongo.crt -days 365 -sha256 -extfile server-ext.cnf
```

###### mongo.pem

```console
cat mongo.key mongo.crt > mongo.pem
```

#### Client Certification

###### mongo-healthcheck.key

```console
openssl genrsa -out mongo-healthcheck.key 4096
```

###### mongo-healthcheck.csr

```console
openssl req -new -key mongo-healthcheck.key -out mongo-healthcheck.csr -subj "/C=GB/ST=Dev/L=Local/O=techexpo_crm/OU=dev_mongo/CN=mongo_healthcheck"
```

###### mongo-healthcheck.crt

```console
openssl x509 -req -in mongo-healthcheck.csr -CA ../root-ca.crt -CAkey ../root-ca.key -CAcreateserial -out mongo-healthcheck.crt -days 365 -sha256 -extfile ../client-ext.cnf
```

###### mongo-healthcheck.pem

```console
cat mongo-healthcheck.key mongo-healthcheck.crt > mongo-healthcheck.pem
```

### For production:

Refer to [Production Certification](../../README.md#for-production)

## mongod.conf

The following should be included within the mongod.conf file to enable TLS.

```
net:
  tls:
    mode: requireTLS
    allowConnectionsWithoutCertificates: false
    certificateKeyFile: /etc/mongo/certs/mongo.pem
    CAFile: /etc/mongo/certs/mongo-ca.crt
    disabledProtocols: "TLS1_0,TLS1_1"
  port: 27017
```

Notes:

- '/certs' is mapped from the [`tmpfs-certs`](../../../docker-compose.override.yml#L264) container in development
- Certification file name prefixes are handled by [`certs-init.sh`](../../certs-init.sh)
