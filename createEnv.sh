#!/bin/bash

# Get the values
CANISTER_ORIGIN=$(dfx canister id backend)
WEBSERVER_PORT=$(dfx info webserver-port)
IDENTITY_PROVIDER=$(dfx canister id internet_identity)


cd src/Frontend

# Write to .env file
echo "VITE_CANISTER_ORIGIN=http://$CANISTER_ORIGIN.localhost:$WEBSERVER_PORT" > .env
echo "VITE_IDENTITY_PROVIDER=http://$IDENTITY_PROVIDER.localhost:$WEBSERVER_PORT" >> .env

echo "II_URL=http://$IDENTITY_PROVIDER.localhost:$WEBSERVER_PORT" >> .env