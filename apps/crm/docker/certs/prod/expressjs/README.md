# x509 TLS Ceritification

- [Required Client Cerification](#required-client-certification)
- [CNF](#cnf)

## Required Client Certification

- expressjs-mongo
- expressjs-postgres
- expressjs-redis

## CNF

```ini
# cert/prod/client/cnf/expressjs-client.cnf

[ req ]
default_bits       = 2048
distinguished_name = req_distinguished_name
prompt             = no

[ req_distinguished_name ]
C  = GB
ST = London
L  = Production
O  = techexpo_crm
OU = expressjs_client                                             # expressjs service
CN = expressjs.internal.client                                    # expressjs service

[ v3_client ]
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = clientAuth
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = expressjs                                                 # expressjs service
DNS.2 = techexpo-expressjs                                        # expressjs service
DNS.3 = expressjs-client.internal                                 # expressjs service
```
