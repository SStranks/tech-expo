# x509 TLS Ceritification

- [Overview](#overview)
- [Current Directory](#current-directory)
  - [certs-init.sh](#certs-initsh)
- [Required Files](#required-files)
  - [Development](#for-development)
    - [Certificate Authority](#certificate-authority)
    - [Service Certification](#service-certification)
  - [Production](#for-production)
    - [File Structure](#directory-structure)
    - [Root Certificate Authority](#root-certificate-authority)
    - [Intermediate Certificate Authorities](#intermediate-certificate-authorities)
    - [Service Certification](#service-certification)
    - [Client Certification](#client-certification)
    - [Revoking Certification](#revoking-certification)
  - [.secret.certs.yml](#secretcertsyml)

## Overview

Certification is comprised of three components: the certificate authority, the server certification, and client certification.

Self-signed root certification is used internally, inside the docker network, for development and production. The client browser utilizes a self-signed root certification for development purposes, and in production the public facing Nginx server holds an authorized certificate from the [Let's Encrypt](https://letsencrypt.org/) certificate provider.

For production, in the non-public internal docker network, the certificate authority is split into two authority levels: root, and the intermediary. Each docker service shall have its own intermediary, signed by the root certificate. Client certification for all services will be signed by a single client intermediary.

For development, the server and client certification is stored in a flat certification folder within each respective docker service e.g. [`certs/dev/mongo`](./dev/mongo/)

For production, the certification and folder structure is determined by the openssl library; the root certificate authority key and certificate reside in the top-level `certs` folder, and all other files in a child `prod` folder. See the [Production File Structure](#directory-structure) for more details.

## Current Directory

The [`certs`](../certs/) folder is associated with the [`tmpfs-certs`](../docker-compose.override.yml#L264) docker container, as evidenced by the [`certs-init.sh`](certs-init.sh) initialization script. It also serves as the data folder for the certificate authority files.

### certs-init.sh

This script acts on all the certification files passed in via docker volumes from [`certs/dev`](../certs/dev/); certification files are placed into a top-level `/certs` folder in the [`tmpfs-certs`](../docker-compose.override.yml#L264) docker container.

- For each service a copy the development root-ca.crt is created under the intermediary name e.g. postgres-ca.crt
- Sets the UID:GID ownership for the service key files; must match the container USER process e.g. Postgres requires 999:999
- Sets permissions to 400 for the service key files; read only

## Required files

### For development:

#### Certificate Authority

The following certificate authority commands should be executed in the [`certs/dev`](./dev/) folder.

###### root-ca.key

```console
openssl genrsa -aes256 -out root-ca.key 4096
```

###### root-ca.crt

⚠️ This certificate should be added to your browser of choice to establish trust and ensure that connections to the application are recognized as secure. If you don’t add it, you may still connect by bypassing the browser’s security warning, but the connection will be flagged as untrusted.

`Chrome / Edge` Settings > Privacy & Security > Security > Manage Certificates > Import

`Firefox` Settings > Privacy & Security > Certificates > View Certificates > Import

`Safari (macOS)` Keychain Access > System / login keychain > Certificates > Import

```console
openssl req -x509 -new -nodes -key root-ca.key -sha256 -days 3650 -out root-ca.crt -subj "/C=GB/ST=Dev/L=Local/O=techexpo_crm/OU=dev_ca/CN=techexpo_crm_dev"
```

###### root-ca.pem

```console
cat root-ca.crt > root-ca.pem
```

###### client-ext.cnf

```yaml
#  certs/dev/client-ext.cnf

authorityKeyIdentifier = keyid, issuer
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = clientAuth

[alt_names]
DNS.1 = localhost
```

#### Service Certification

Each service requires server certification, and if connecting to another TLS enabled docker service it requires client certification also. Refer to the README.md in each service folder for details on the required files e.g. [`Expressjs README.md`](./dev/expressjs/README.md)

### For production:

#### Overview

The `openssl` library is used to generate and coordinate all production certification.

**`!`** **All commands should be run from the** [`root certification folder`](../certs/)

Each docker service has it's own intermediate certificate authority, used to sign server certification. Client certification, for all services, is signed by a single client intermediate certificate authority.

#### Security

- All files should be excluded from [`.gitignore`](../../../../.gitignore) and [`.dockerignore`](../../../../.dockerignore)
- Permissions: `chmod 600` on private keys, `chmod 700` on private/ dirs.
- Backups: Store root and intermediates securely outside of Docker (e.g. encrypted vault, offline).
- Environment: Certificates mounted via Docker secrets - not baked into docker images.

#### Directory Structure

Directory and file structure is determined and coordinated using the `openssl` library when generating certification. Each sub-folder within the production `prod` folder contains the same structure; the directory tree below demonstrates the layout - see [`certs/prod/root`](../certs/prod/root/) for live example. Each docker service is represented as a sub-folder, containing server certification. Client certification, for all services, is consolidated in the client sub-folder.

```console
apps/crm/docker/certs/
├─ prod/
│  ├─ root/
│  │  ├─ certs/
│  │  ├─ cnf/
│  │  ├─ crl/
│  │  ├─ csr/
│  │  ├─ newcerts/
│  │  ├─ private/
│  │  ├─ index.txt
│  │  └─ serial
│  ├─ client/
│  ├─ grafana/
│  ├─ prometheus/
│  └─ ...more services
```

#### Root Certificate Authority

###### Preare Root Directory

```bash
# cd into apps/crm/docker/certs before running commands

mkdir -p prod/root/{certs,crl,cnf,csr,newcerts,private}
chmod 700 prod/root/private
touch prod/root/index.txt
echo 1000 > prod/root/serial
```

###### Create Root CA .cnf

```ini
# certs/prod/root/cnf/openssl.cnf
[ ca ]
default_ca = CA_default

[ CA_default ]
dir               = ./prod/root
database          = $dir/index.txt
new_certs_dir     = $dir/newcerts
certificate       = $dir/certs/root-ca.crt
serial            = $dir/serial
private_key       = $dir/private/root-ca.key
default_days      = 3650
default_md        = sha256
policy            = policy_loose
x509_extensions   = v3_ca

[ policy_loose ]
countryName             = optional
stateOrProvinceName     = optional
localityName            = optional
organizationName        = optional
organizationalUnitName  = optional
commonName              = supplied
emailAddress            = optional

[ req ]
default_bits        = 4096
distinguished_name  = req_distinguished_name
prompt              = no
default_md          = sha256

[ req_distinguished_name ]
C  = GB
ST = London
L  = Production
O  = techexpo_crm
OU = prod_root
CN = techexpo_crm_prod_root_ca

[ v3_ca ]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical, CA:true
keyUsage = critical, digitalSignature, cRLSign, keyCertSign

[ v3_intermediate_ca ]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical, CA:true, pathlen:0
keyUsage = critical, digitalSignature, cRLSign, keyCertSign
```

###### Create Root CA Certification

```console
openssl req -new -x509 -days 3650 -sha256 \
  -config prod/root/cnf/openssl.cnf \
  -extensions v3_ca \
  -keyout prod/root/private/root-ca.key \
  -out prod/root/certs/root-ca.crt
```

Key requires passphrase for security. See [`.secret.certs.yml`](#secretcertsyml). Key file and associated passphrase should be stored offline in physically secure location.

###### Root Certification Verification

```bash
# Inspect cert
openssl x509 -in prod/root/certs/root-ca.crt -noout -text
```

#### Intermediate Certificate Authorities

Each docker service should have its own intermediate certificate authority. The following example demonstrates the process for the [`grafana`](../grafana/) docker service.

Services required: (client, mongo, redis, postgres, nginx, nginxreact, nginxmetrics, expressjs, grafana, prometheus)

###### Preare Intermediate Certificate Directory

```bash
# cd into apps/crm/docker/certs before running commands

mkdir -p prod/grafana/{certs,crl,cnf,csr,newcerts,private}
chmod 700 prod/grafana/private
touch prod/grafana/index.txt
echo 1000 > prod/grafana/serial
```

###### Create Intermediate CA .cnf

```ini
# certs/prod/grafana/cnf/openssl.cnf

[ ca ]
default_ca = CA_default

[ CA_default ]
dir               = ./prod/grafana                       # Grafana service
database          = $dir/index.txt
new_certs_dir     = $dir/newcerts
certificate       = $dir/certs/grafana-ca.crt            # Grafana service
serial            = $dir/serial
private_key       = $dir/private/grafana-ca.key          # Grafana service
default_days      = 1825
default_md        = sha256
policy            = policy_loose
x509_extensions   = v3_intermediate_ca

[ policy_loose ]
countryName             = optional
stateOrProvinceName     = optional
localityName            = optional
organizationName        = optional
organizationalUnitName  = optional
commonName              = supplied
emailAddress            = optional

[ req ]
default_bits        = 4096
distinguished_name  = req_distinguished_name
prompt              = no
default_md          = sha256

[ req_distinguished_name ]
C  = GB
ST = London
L  = Production
O  = techexpo_crm
OU = prod_intermediate
CN = techexpo_crm_grafana_ca                                  # Grafana service

[ v3_intermediate_ca ]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical, CA:true, pathlen:0
keyUsage = critical, digitalSignature, cRLSign, keyCertSign
```

###### Create Intermediate CSR

```console
openssl req -new -sha256 \
  -config prod/grafana/cnf/openssl.cnf \
  -keyout prod/grafana/private/grafana-ca.key \
  -out prod/grafana/csr/grafana-ca.csr
```

###### Sign Intermediate with Root Certificate

```console
openssl ca -config prod/root/cnf/openssl.cnf \
  -extensions v3_intermediate_ca \
  -in prod/grafana/csr/grafana-ca.csr \
  -out prod/grafana/certs/grafana-ca.crt \
  -batch
```

###### Intermediate Certification Verification

```bash
# Verify intermediate cert chains to root
openssl verify -CAfile prod/root/certs/root-ca.crt \
  prod/grafana/certs/grafana-ca.crt

# Inspect cert
openssl x509 -in prod/grafana/certs/grafana-ca.crt -noout -text
```

#### Server Certification

###### Create Server .cnf

```ini
#certs/prod/grafana/cnf/server.cnf

[ req ]
default_bits       = 2048
distinguished_name = req_distinguished_name
prompt             = no

[ req_distinguished_name ]
C  = GB
ST = London
L  = Production
O  = techexpo_crm
OU = grafana_service                          # Grafana service
CN = grafana.internal                         # Grafana service

[ v3_server ]
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = grafana.internal                      # Grafana service
DNS.2 = grafana.prod.local                    # Grafana service
DNS.3 = techexpo.grafana                      # Grafana service
```

###### Create Service Key and CSR

```console
openssl req -new -nodes \
  -newkey rsa:2048 \
  -keyout prod/grafana/private/server.key \
  -out prod/grafana/csr/server.csr \
  -config prod/grafana/cnf/server.cnf
```

###### Sign Service with Intermediate

```console
openssl ca -config prod/grafana/cnf/openssl.cnf \
  -in prod/grafana/csr/server.csr \
  -out prod/grafana/certs/server.crt \
  -extensions v3_server \
  -extfile prod/grafana/cnf/server.cnf \
  -batch
```

###### Service Certification Verification

```bash
# Verify service certificate
cat prod/grafana/certs/grafana-ca.crt prod/root/certs/root-ca.crt | \
openssl verify -CAfile /dev/stdin prod/grafana/certs/server.crt

# Inspect cert
openssl x509 -in prod/client/certs/server.crt -noout -text
```

#### Client Certification

The following example shows client certification of the grafana service for connecting to the prometheus service. To see the required client certification for a service and for its `.cnf`, refer to the documentation in the respective production folder e.g. [`certs/prod/grafana/README.md`](./prod/grafana/README.md).

- One client .cnf file can be reused across multiple client certificates issued for that service.
- Generated .key/.csr/.crt files follow the naming convention &lt;SERVICE&gt;-&lt;CLIENT&gt; e.g. `grafana-prometheus`

###### Create Client .cnf

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

###### Generate Client Key and CSR

```ini
openssl req -new -nodes \
  -newkey rsa:2048 \
  -keyout prod/client/private/grafana-prometheus.key \          # Grafana-Prometheus
  -out prod/client/csr/grafana-prometheus.csr \                 # Grafana-Prometheus
  -config prod/client/cnf/grafana-client.cnf
```

###### Sign CSR with Client Intermediate

```ini
openssl ca -config prod/client/cnf/openssl.cnf \                # Grafana-Prometheus
  -in prod/client/csr/grafana-prometheus.csr \                  # Grafana-Prometheus
  -out prod/client/certs/grafana-prometheus.crt \               # Grafana-Prometheus
  -extensions v3_client \
  -extfile prod/client/cnf/grafana-client.cnf \
  -batch
```

###### Client Certification Verification

```bash
# Verify client cert chains to root
cat prod/grafana/certs/grafana-ca.crt prod/root/certs/root-ca.crt | \
openssl verify -CAfile /dev/stdin prod/client/certs/grafana-prometheus.crt

# Inspect cert
openssl x509 -in prod/client/certs/grafana-prometheus.crt -noout -text
```

#### Revoking Certification

Certificates can be revoked if erroneously created or for security purposes - certificates should not be manually deleted to ensure openssl log consistency.

Certificates can only be revoked by a higher authority. The following example shows the intermediate CA authority revoking a server certificate.

```bash
openssl ca -config prod/nginxreact/cnf/openssl.cnf -revoke prod/nginxreact/certs/server.crt
```

#### .secret.certs.yml

Should contain:

- `prod-root-ca-passphrase:<strong password>`
- `prod-client-ca-passphrase:<strong password>`
- `prod-expressjs-ca-passphrase:<strong password>`
- `prod-grafana-ca-passphrase:<strong password>`
- `prod-mongo-ca-passphrase:<strong password>`
- `prod-nginx-ca-passphrase:<strong password>`
- `prod-nginxmetrics-ca-passphrase:<strong password>`
- `prod-nginxreact-ca-passphrase:<strong password>`
- `prod-postgres-ca-passphrase:<strong password>`
- `prod-prometheus-ca-passphrase:<strong password>`
- `prod-redis-ca-passphrase:<strong password>`

Encrypt the file in-place using SOPS for secure storage; files should ideally be stored offline in physically secure location. Passphrases should be at least 30 characters; [Password Strength Checker](https://www.passwordmonster.com/)
