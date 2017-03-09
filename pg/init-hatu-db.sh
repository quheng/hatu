#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE USER hatu_user WITH PASSWORD 'hatu_password';
    CREATE DATABASE hatu_db;
    GRANT ALL PRIVILEGES ON DATABASE hatu_db TO hatu_user;
EOSQL

psql -U hatu_user -d hatu_db -f /docker-entrypoint-initdb.d/init.sql