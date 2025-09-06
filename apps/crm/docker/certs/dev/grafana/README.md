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

###### grafana.key

```console
openssl genrsa -out grafana.key 4096
```

###### grafana.csr

```console
openssl req -new -key grafana.key -out grafana.csr -subj "/C=GB/ST=Dev/L=Local/O=techexpo_crm/OU=dev_grafana/CN=localhost"
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
DNS.1 = techexpo-grafana
DNS.2 = localhost
IP.1 = 127.0.0.1
```

###### grafana.crt

```console
openssl x509 -req -in grafana.csr -CA ../root-ca.crt -CAkey ../root-ca.key -CAcreateserial -out grafana.crt -days 365 -sha256 -extfile server-ext.cnf
```

#### Client Certification

###### grafana-prometheus.key

```console
openssl genrsa -out grafana-prometheus.key 4096
```

###### grafana-prometheus.csr

```console
openssl req -new -key grafana-prometheus.key -out grafana-prometheus.csr -subj "/C=GB/ST=Dev/L=Local/O=techexpo_crm/OU=dev_grafana/CN=localhost"
```

###### grafana-prometheus.crt

```console
openssl x509 -req -in grafana-prometheus.csr -CA ../root-ca.crt -CAkey ../root-ca.key -CAcreateserial -out grafana-prometheus.crt -days 365 -sha256 -extfile ../client-ext.cnf
```

### For production:

Refer to [Production Certification](../../README.md#for-production)
