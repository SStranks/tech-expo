# x509 TLS Ceritification

- [Required Files](#required-files)
  - [Development](#for-development)
    - [Server Certification](#server-certification)

## Required files

Commands should be run from the current directory.

### For development:

#### Server Certification

###### mailpit.key

```console
openssl genrsa -out mailpit.key 4096
```

###### mailpit.csr

```console
openssl req -new -key mailpit.key -out mailpit.csr -subj "/C=GB/ST=Dev/L=Local/O=techexpo_crm/OU=dev_mailpit/CN=localhost"
```

###### server-ext.cnf

```yaml
# server-ext.cnf

authorityKeyIdentifier = keyid,issuer
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = techexpo-mailpit
DNS.2 = localhost
IP.1 = 127.0.0.1
```

###### mailpit.crt

```console
openssl x509 -req -in mailpit.csr -CA ../root-ca.crt -CAkey ../root-ca.key -CAcreateserial -out mailpit.crt -days 365 -sha256 -extfile server-ext.cnf
```

###### mailpit.pem

```console
cat mailpit.key mailpit.crt > mailpit.pem
```
