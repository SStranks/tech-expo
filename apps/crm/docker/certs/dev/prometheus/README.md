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

###### prometheus.key

```console
openssl genrsa -out prometheus.key 4096
```

###### prometheus.csr

```console
openssl req -new -key prometheus.key -out prometheus.csr -subj "/C=GB/ST=Dev/L=Local/O=techexpo_crm/OU=dev_prometheus/CN=localhost"
```

###### dev-server-ext.cnf

```yaml
# dev-server-ext.cnf

authorityKeyIdentifier = keyid, issuer
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = techexpo-prometheus
DNS.2 = prometheus
DNS.3 = localhost
IP.1 = 127.0.0.1
```

###### prometheus.crt

```console
openssl x509 -req -in prometheus.csr -CA ../root-ca.crt -CAkey ../root-ca.key -CAcreateserial -out prometheus.crt -days 365 -sha256 -extfile dev-server-ext.cnf
```

#### Client Certification

###### prometheus-&lt;SERVICE&gt;exporter.key

```console
openssl genrsa -out prometheus-mongoexporter.key 4096
openssl genrsa -out prometheus-postgresexporter.key 4096
openssl genrsa -out prometheus-redisexporter.key 4096
openssl genrsa -out prometheus-expressjsexporter.key 4096
openssl genrsa -out prometheus-prometheusexporter.key 4096
openssl genrsa -out prometheus-healthcheck.key 4096
```

###### prometheus-&lt;SERVICE&gt;exporter.csr

⚠️ Replace `<USERNAME>` with the respective postgres username/s.

```console
openssl req -new -key prometheus-mongoexporter.key -out prometheus-mongoexporter.csr -subj "/C=GB/ST=Dev/L=Local/O=techexpo_crm/OU=dev_prometheus/CN=localhost"
openssl req -new -key prometheus-postgresexporter.key -out prometheus-postgresexporter.csr -subj "/C=GB/ST=Dev/L=Local/O=techexpo_crm/OU=dev_prometheus/CN=<USERNAME>"
openssl req -new -key prometheus-redisexporter.key -out prometheus-redisexporter.csr -subj "/C=GB/ST=Dev/L=Local/O=techexpo_crm/OU=dev_prometheus/CN=localhost"
openssl req -new -key prometheus-expressjsexporter.key -out prometheus-expressjsexporter.csr -subj "/C=GB/ST=Dev/L=Local/O=techexpo_crm/OU=dev_prometheus/CN=localhost"
openssl req -new -key prometheus-prometheusexporter.key -out prometheus-prometheusexporter.csr -subj "/C=GB/ST=Dev/L=Local/O=techexpo_crm/OU=dev_prometheus/CN=localhost"
openssl req -new -key prometheus-healthcheck.key -out prometheus-healthcheck.csr -subj "/C=GB/ST=Dev/L=Local/O=techexpo_crm/OU=dev_prometheus/CN=localhost"
```

###### prometheus-&lt;SERVICE&gt;exporter.crt

```console
openssl x509 -req -in prometheus-mongoexporter.csr -CA ../root-ca.crt -CAkey ../root-ca.key -CAcreateserial -out prometheus-mongoexporter.crt -days 365 -sha256 -extfile ../client-ext.cnf
openssl x509 -req -in prometheus-postgresexporter.csr -CA ../root-ca.crt -CAkey ../root-ca.key -CAcreateserial -out prometheus-postgresexporter.crt -days 365 -sha256 -extfile ../client-ext.cnf
openssl x509 -req -in prometheus-redisexporter.csr -CA ../root-ca.crt -CAkey ../root-ca.key -CAcreateserial -out prometheus-redisexporter.crt -days 365 -sha256 -extfile ../client-ext.cnf
openssl x509 -req -in prometheus-expressjsexporter.csr -CA ../root-ca.crt -CAkey ../root-ca.key -CAcreateserial -out prometheus-expressjsexporter.crt -days 365 -sha256 -extfile ../client-ext.cnf
openssl x509 -req -in prometheus-prometheusexporter.csr -CA ../root-ca.crt -CAkey ../root-ca.key -CAcreateserial -out prometheus-prometheusexporter.crt -days 365 -sha256 -extfile ../client-ext.cnf
openssl x509 -req -in prometheus-healthcheck.csr -CA ../root-ca.crt -CAkey ../root-ca.key -CAcreateserial -out prometheus-healthcheck.crt -days 365 -sha256 -extfile ../client-ext.cnf
```

###### prometheus-mongoexporter.pem

Mongo-exporter uses TLS syntax in connection string URI; requires PEM (.crt+.key) for the client certification.

```console
cat prometheus-mongoexporter.key prometheus-mongoexporter.crt > prometheus-mongoexporter.pem
```

### For production:

Refer to [Production Certification](../../README.md#for-production)
