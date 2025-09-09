# x509 TLS Ceritification

- [Required Client Cerification](#required-client-certification)
- [CNF](#cnf)

## Required Client Certification

- grafana-promtheus

## CNF

```ini
# cert/prod/client/cnf/grafana-client.cnf

[ req ]
default_bits       = 2048
distinguished_name = req_distinguished_name
prompt             = no

[ req_distinguished_name ]
C  = GB
ST = London
L  = Production
O  = techexpo_crm
OU = grafana_client                                             # Grafana service
CN = grafana.internal.client                                    # Grafana service

[ v3_client ]
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = clientAuth
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = grafana                                                 # Grafana service
DNS.2 = techexpo-grafana                                        # Grafana service
DNS.3 = grafana-client.internal                                 # Grafana service
```
