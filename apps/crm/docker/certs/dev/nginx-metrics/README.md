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

###### nginxmetrics.key

```console
openssl genrsa -out nginxmetrics.key 4096
```

###### nginxmetrics.csr

```console
openssl req -new -key nginxmetrics.key -out nginxmetrics.csr -subj "/C=GB/ST=Dev/L=Local/O=techexpo_crm/OU=dev_nginx-metrics/CN=localhost"
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
DNS.1 = techexpo-nginx-metrics
DNS.2 = localhost
IP.1 = 127.0.0.1
```

###### nginxmetrics.crt

```console
openssl x509 -req -in nginxmetrics.csr -CA ../root-ca.crt -CAkey ../root-ca.key -CAcreateserial -out nginxmetrics.crt -days 365 -sha256 -extfile server-ext.cnf
```

#### Client Certification

###### nginxmetrics-client.key

```console
openssl genrsa -out nginxmetrics-client.key 4096
```

###### nginxmetrics-client.csr

```console
openssl req -new -key nginxmetrics-client.key -out nginxmetrics-client.csr -subj "/C=GB/ST=Dev/L=Local/O=techexpo_crm/OU=dev_nginxmetrics/CN=localhost"
```

###### nginxmetrics-client.crt

```console
openssl x509 -req -in nginxmetrics-client.csr -CA ../root-ca.crt -CAkey ../root-ca.key -CAcreateserial -out nginxmetrics-client.crt -days 365 -sha256 -extfile ../client-ext.cnf
```

### For production:

Refer to [Production Certification](../../README.md#for-production)
