# x509 TLS Ceritification

- [Required Client Cerification](#required-client-certification)
- [CNF](#cnf)

## Required Client Certification

- nginx-client
  - Used to connect to both expressjs and react upstream services: [`nginxm default.conf`](../../../nginx/templates/default.conf.template)

## CNF

```ini
# cert/prod/client/cnf/nginx-client.cnf

[ req ]
default_bits       = 2048
distinguished_name = req_distinguished_name
prompt             = no

[ req_distinguished_name ]
C  = GB
ST = London
L  = Production
O  = techexpo_crm
OU = nginx_client                                             # nginx service
CN = nginx.internal.client                                    # nginx service

[ v3_client ]
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = clientAuth
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = nginx                                                 # nginx service
DNS.2 = techexpo-nginx                                        # nginx service
DNS.3 = nginx-client.internal                                 # nginx service
```
