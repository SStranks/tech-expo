# x509 TLS Ceritification

- [Required Files](#required-files)
  - [Development](#for-development)
    - [Client Certification](#client-certification)

## Required files

Commands should be run from the current directory.

### For development:

#### Client Certification

###### mongoexpress.key

```console
openssl genrsa -out mongoexpress.key 4096
```

###### mongoexpress.csr

```console
openssl req -new -key mongoexpress.key -out mongoexpress.csr -subj "/C=GB/ST=Dev/L=Local/O=techexpo_crm/OU=dev_mongo/CN=mongo_mongoexpress_client"
```

###### mongoexpress.crt

```console
openssl x509 -req -in mongoexpress.csr -CA ../root-ca.crt -CAkey ../root-ca.key -CAcreateserial -out mongoexpress.crt -days 365 -sha256 -extfile ../client-ext.cnf
```

###### mongoexpress.pem

```console
cat mongoexpress.key mongoexpress.crt > mongoexpress.pem
```
