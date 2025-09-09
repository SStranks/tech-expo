# x509 TLS Ceritification

- [Required Client Cerification](#required-client-certification)
- [CNF](#cnf)

## Required Client Certification

- redis-healthcheck

## CNF

```ini
# cert/prod/client/cnf/redis-client.cnf

[ req ]
default_bits       = 2048
distinguished_name = req_distinguished_name
prompt             = no

[ req_distinguished_name ]
C  = GB
ST = London
L  = Production
O  = techexpo_crm
OU = redis_client                                             # redis service
CN = redis.internal.client                                    # redis service

[ v3_client ]
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = clientAuth
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = redis                                                 # redis service
DNS.2 = techexpo-redis                                        # redis service
DNS.3 = redis-client.internal                                 # redis service
```
