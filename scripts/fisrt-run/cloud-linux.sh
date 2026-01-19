#!/bin/bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"

# Install PostgreSQL
brew install postgresql@15
echo 'export PATH="/home/linuxbrew/.linuxbrew/opt/postgresql@15/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
/home/linuxbrew/.linuxbrew/opt/postgresql@15/bin/pg_ctl -D /home/linuxbrew/.linuxbrew/var/postgresql@15 start

psql postgres

# Create database and user
CREATE USER yonjay WITH PASSWORD 'postgres'; # create user "yonjay" and password "postgres", you can change this
GRANT ALL PRIVILEGES ON DATABASE devtools_server_db TO yonjay;
DROP DATABASE IF EXISTS devtools_server_db;
CREATE DATABASE devtools_server_db
    WITH 
    OWNER = yonjay
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TEMPLATE = template1;
\l # check database list # \l+ check database list detail
\q


# Install Redis
brew install redis
/home/linuxbrew/.linuxbrew/opt/redis/bin/redis-server --daemonize yes
# Check Redis service status
ps aux | grep redis-server | grep -v grep

# To stop Redis server, use the following command:
# /home/linuxbrew/.linuxbrew/opt/redis/bin/redis-cli shutdown
