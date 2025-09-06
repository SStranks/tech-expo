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

###### postgres.key

```console
openssl genrsa -out postgres.key 4096
```

###### postgres.csr

```console
openssl req -new -key postgres.key -out postgres.csr -subj "/C=GB/ST=Dev/L=Local/O=techexpo_crm/OU=dev_postgres/CN=localhost"
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
DNS.1 = techexpo-postgres
DNS.2 = localhost
IP.1 = 127.0.0.1
```

###### postgres.crt

```console
openssl x509 -req -in postgres.csr -CA ../root-ca.crt -CAkey ../root-ca.key -CAcreateserial -out postgres.crt -days 365 -sha256 -extfile server-ext.cnf
```

#### Client Certification

###### postgres-dbeaver-&lt;USERNAME&gt;.key

The client in this example is DBeaver database manager
<br>
⚠️ Replace `<USERNAME>` with the respective postgres username/s

```console
openssl genrsa -out postgres-dbeaver-<USERNAME>.key 4096
```

###### postgres-dbeaver-&lt;USERNAME&gt;.csr

⚠️ **Important**: Postgres utilizes the CN field in mTLS to match against the username attempting to log-on to its service.
<br>
⚠️ Replace `<USERNAME>` with the respective postgres username/s

```console
openssl req -new -key postgres-dbeaver-<USERNAME>.key -out postgres-dbeaver-<USERNAME>.csr -subj "/C=GB/ST=Dev/L=Local/O=techexpo_crm/OU=dev_postgres/CN=<USERNAME>"
```

###### postgres-dbeaver-&lt;USERNAME&gt;.crt

```console
openssl x509 -req -in postgres-dbeaver-<USERNAME>.csr -CA ../root-ca.crt -CAkey ../root-ca.key -CAcreateserial -out postgres-dbeaver-<USERNAME>.crt -days 365 -sha256 -extfile ../client-ext.cnf
```

### For production:

Refer to [Production Certification](../../README.md#for-production)
