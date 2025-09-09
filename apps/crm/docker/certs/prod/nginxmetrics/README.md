# x509 TLS Ceritification

- [Required Client Cerification](#required-client-certification)
- [CNF](#cnf)

## Required Client Certification

- nginxmetrics-client
  - Used to connect to both grafana and prometheus upstream services: [`nginxmetrics default.conf`](../../../nginx-metrics/templates/default.conf.template)

## CNF

```ini
# cert/prod/client/cnf/nginxmetrics-client.cnf

[ req ]
default_bits       = 2048
distinguished_name = req_distinguished_name
prompt             = no

[ req_distinguished_name ]
C  = GB
ST = London
L  = Production
O  = techexpo_crm
OU = nginxmetrics_client                                             # nginxmetrics service
CN = nginxmetrics.internal.client                                    # nginxmetrics service

[ v3_client ]
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = clientAuth
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = nginxmetrics                                                 # nginxmetrics service
DNS.2 = techexpo-nginxmetrics                                        # nginxmetrics service
DNS.3 = nginxmetrics-client.internal                                 # nginxmetrics service
```
