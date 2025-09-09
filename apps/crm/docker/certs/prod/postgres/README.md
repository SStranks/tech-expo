# x509 TLS Ceritification

- [Required Client Cerification](#required-client-certification)
- [CNF](#cnf)

## Required Client Certification

- postgres-dbeaver-&lt;USER&gt;
  - `<USER>` to be replaced with postgres username
  - `.cnf` required <u>per client certificate</u> - `CN` field in [req_distinguished_name] must match &lt;USER&gt;

## CNF

```ini
# cert/prod/client/cnf/postgres-dbeaver-<USER>.cnf

[ req ]
default_bits       = 2048
distinguished_name = req_distinguished_name
prompt             = no

[ req_distinguished_name ]
C  = GB
ST = London
L  = Production
O  = techexpo_crm
OU = postgres_client                                             # postgres service
CN = <USER>                                                      # postgres <USER>

[ v3_client ]
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = clientAuth
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = postgres                                                 # postgres service
DNS.2 = techexpo-postgres                                        # postgres service
DNS.3 = postgres-client.internal                                 # postgres service
```
