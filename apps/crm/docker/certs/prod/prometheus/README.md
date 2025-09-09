# x509 TLS Ceritification

- [Required Client Cerification](#required-client-certification)
- [CNF](#cnf)

## Required Client Certification

- prometheus-healthcheck
- prometheus-prometheus
- prometheus-expressjsexporter
- prometheus-mongojsexporter
- prometheus-postgresexporter
- prometheus-prometheusexporter
- prometheus-redisexporter

## CNF

```ini
# cert/prod/client/cnf/prometheus-client.cnf

[ req ]
default_bits       = 2048
distinguished_name = req_distinguished_name
prompt             = no

[ req_distinguished_name ]
C  = GB
ST = London
L  = Production
O  = techexpo_crm
OU = prometheus_client                                             # prometheus service
CN = prometheus.internal.client                                    # prometheus service

[ v3_client ]
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = clientAuth
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = prometheus                                                 # prometheus service
DNS.2 = techexpo-prometheus                                        # prometheus service
DNS.3 = prometheus-client.internal                                 # prometheus service
```
