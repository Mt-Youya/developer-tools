#!/bin/bash

# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"

# Install PostgreSQL
brew install postgresql@15
brew services start postgresql@15
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
    TEMPLATE = template0;
\l # check database list # \l+ check database list detail
\q


# Install Redis
brew install redis
brew services start redis

# Check Redis service status
brew services list | grep redis