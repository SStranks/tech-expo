# x509 TLS Ceritification

- [Required Client Cerification](#required-client-certification)
- [CNF](#cnf)

## Required Client Certification

- mongo-healthcheck
  - `!` mongo requires a `.pem` file containing both key and certificate:
  - `cat mongo-healthcheck.key mongo-healthcheck.crt`

## CNF

```ini
# cert/prod/client/cnf/mongo-client.cnf

[ req ]
default_bits       = 2048
distinguished_name = req_distinguished_name
prompt             = no

[ req_distinguished_name ]
C  = GB
ST = London
L  = Production
O  = techexpo_crm
OU = mongo_client                                             # mongo service
CN = mongo.internal.client                                    # mongo service

[ v3_client ]
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = clientAuth
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = mongo                                                 # mongo service
DNS.2 = techexpo-mongo                                        # mongo service
DNS.3 = mongo-client.internal                                 # mongo service
```
