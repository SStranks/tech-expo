#!/usr/bin/env sh
set -eu

DEST_DIR="/certs"
mkdir -p /tmp/certs "$DEST_DIR"

# Function: get_file_extension FILE
#
# Description:
#   Extract the extension of a file name.
#
# Args:
#   FILE - Path or filename (e.g., /path/to/myfile.key)
# Returns:
#   Prints the extension part (e.g., key)
get_file_extension() {
  _file="$1"
  _ext=$(expr "$_file" : '.*\.\(.*\)$')

  echo "$_ext"
}

# Function: copy_root_ca_certs_to_tmp SERVICE OUTDIR
#
# Description:
#   Copy the root CA key, certificate, and PEM files into the specified output directory,
#   renaming them to appear as the intermediate CA for the given service.
#
# Args:
#   SERVICE - Name of the service (used as prefix for copied files)
copy_root_ca_certs_to_tmp() {
  _service="$1"

  cp /src/root-ca.key "/tmp/$_service/$_service-ca.key"
  cp /src/root-ca.crt "/tmp/$_service/$_service-ca.crt"
  cp /src/root-ca.pem "/tmp/$_service/$_service-ca.pem"
}

# Function: copy_service_certs_to_tmp
#
# Description:
#   Copies all SSL/TLS certificate and key files (.key, .pem, .crt) from a
#   specified service directory under /src to a corresponding directory in /tmp.
#   Useful for temporarily exposing service certificates for processes that
#   require them without modifying the original files.
#
# Args:
#   $1 - The name of the service. The function will look for certificate files
#        under /src/<service_name> and copy them to /tmp/<service_name>.
copy_service_certs_to_tmp() {
  _service="$1"

  find "/src/$_service" -type f \( -name "*.key" -o -name "*.pem" -o -name "*.crt" \) \
    -exec cp -t "/tmp/$_service" {} +
}

# Function: process_cert_files FILE SERVICE UID GID
#
# Description:
#   Copies certificate files to the service directory.
#   If the file is a .crt, it is copied directly.
#   If it is a key or pem file, it is copied to a temporary location;
#   ownership is changed to UID:GID, permissions set to 400, then moved
#
# Args:
#   FILE   - path to the certificate/key file
#   SERVICE - name of the service (used to form DEST_DIR/SERVICE)
#   UID    - numeric user ID for ownership
#   GID    - numeric group ID for ownership
process_cert_files() {
  _service="$1"
  _uid="$2"
  _gid="$3"

  for file in "/tmp/$_service"/*; do
    _ext=$(get_file_extension "$file")

    if [ "$_ext" = "crt" ]; then
      chmod 444 "$file"
      mv "$file" "$DEST_DIR"
    else
      chown "$_uid":"$_gid" "$file"
      chmod 400 "$file"
      mv "$file" "$DEST_DIR"
    fi
  done
}

# --------------- Server/Client Files ---------------

# ExpressJS 1000:1000
mkdir -p "/tmp/expressjs"
copy_root_ca_certs_to_tmp expressjs
copy_service_certs_to_tmp expressjs
process_cert_files expressjs 1000 1000

# # Postgres 999:999
mkdir -p "/tmp/postgres"
copy_root_ca_certs_to_tmp postgres
copy_service_certs_to_tmp postgres
process_cert_files postgres 999 999

# # Mongo 999:999
mkdir -p "/tmp/mongo"
copy_root_ca_certs_to_tmp mongo
copy_service_certs_to_tmp mongo
process_cert_files mongo 999 999

# # Redis 999:1000
mkdir -p "/tmp/redis"
copy_root_ca_certs_to_tmp redis
copy_service_certs_to_tmp redis
process_cert_files redis 999 1000

# # RedisInsight 1000:1000
mkdir -p "/tmp/redisinsight"
copy_root_ca_certs_to_tmp redisinsight
copy_service_certs_to_tmp redisinsight
process_cert_files redisinsight 1000 1000

# # Nginx 101:101
mkdir -p "/tmp/nginx"
copy_root_ca_certs_to_tmp nginx
copy_service_certs_to_tmp nginx
process_cert_files nginx 101 101

# # Nginx-metrics 101:101
mkdir -p "/tmp/nginx-metrics"
copy_root_ca_certs_to_tmp nginx-metrics
copy_service_certs_to_tmp nginx-metrics
process_cert_files nginx-metrics 101 101

# # Nginx-react 101:101
mkdir -p "/tmp/nginx-react"
copy_root_ca_certs_to_tmp nginx-react
copy_service_certs_to_tmp nginx-react
process_cert_files nginx-react 101 101

# # Grafana 472:472
mkdir -p "/tmp/grafana"
copy_root_ca_certs_to_tmp grafana
copy_service_certs_to_tmp grafana
process_cert_files grafana 472 472

# Prometheus + Exporters
mkdir -p "/tmp/prometheus"
copy_root_ca_certs_to_tmp prometheus
process_cert_files prometheus 65534 65534
find /src/prometheus -type f \( -name "*.key" -o -name "*.pem" -o -name "*.crt" \) | while read -r FILE; do
  _basename=$(basename "$FILE")
  _tmpFile="/tmp/prometheus/$_basename"
  cp "$FILE" "$_tmpFile"

  # UID:GID take from exporter Dockerfiles on respective Github repos
  filename=${FILE##*/}
  if [ "$filename" != "${filename%postgresexporter*}" ]; then
    # PostgresExporter ("nobody") 65534:65534
    process_cert_files prometheus 65534 65534
  elif [ "$filename" != "${filename%mongoexporter*}" ]; then
    # MongoExporter 65535:65535
    process_cert_files prometheus 65535 65535
  elif [ "$filename" != "${filename%redisexporter*}" ]; then
    # RedisExporter 59000:59000
    process_cert_files prometheus 59000 59000
  else
    # Prometheus ("nobody") 65534:65534
    process_cert_files prometheus 65534 65534
  fi
done

# # Mailpit 0:0
mkdir -p "/tmp/mailpit"
copy_root_ca_certs_to_tmp mailpit
copy_service_certs_to_tmp mailpit
process_cert_files mailpit 0 0

# # Mongoexpress 0:0
mkdir -p "/tmp/mongoexpress"
copy_root_ca_certs_to_tmp mongoexpress
copy_service_certs_to_tmp mongoexpress
process_cert_files mongoexpress 0 0

# ----------------- Initialize Service---------------

# Health check and suspend container alive
touch /certs/.ready
sleep infinity
