# x509 TLS Ceritification

- [Required Files](#required-files)
  - [Development](#for-development)
    - [Server Certification](#server-certification)
    - [Client Certification](#client-certification)

## Required files

Commands should be run from the `certs/dev/redisinsight` of the private credentials folder.

### For development:

#### Server Certification

###### redisinsight.key

```console
openssl genrsa -out redisinsight.key 4096
```

###### redisinsight.csr

```console
openssl req -new -key redisinsight.key -out redisinsight.csr -subj "/C=GB/ST=Dev/L=Local/O=techexpo_crm/OU=dev_redisinsight/CN=localhost"
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
DNS.1 = techexpo-redisinsight
DNS.2 = localhost
IP.1 = 127.0.0.1
```

###### redisinsight.crt

```console
openssl x509 -req -in redisinsight.csr -CA ../root-ca.crt -CAkey ../root-ca.key -CAcreateserial -out redisinsight.crt -days 365 -sha256 -extfile server-ext.cnf
```

#### Client Certification

###### redisinsight-redis.key

```console
openssl genrsa -out redisinsight-redis.key 4096
```

###### redisinsight-redis.csr

```console
openssl req -new -key redisinsight-redis.key -out redisinsight-redis.csr -subj "/C=GB/ST=Dev/L=Local/O=techexpo_crm/OU=dev_redisinsight/CN=redis"
```

###### redisinsight-redis.crt

```console
openssl x509 -req -in redisinsight-redis.csr -CA ../root-ca.crt -CAkey ../root-ca.key -CAcreateserial -out redisinsight-redis.crt -days 365 -sha256 -extfile ../client-ext.cnf
```
