#/bin/bash

echo "Starting demonstration of Distributed Databases course !"

read -p "Press enter to launch the website."

echo "npm start" 
cd ddbwebsite/ ; npm start

cd ..
cockroach start --insecure \
--locality=datacenter=hk-1 \
--store=THUddb-1 \
--host=localhost \
--cache=100MB  \
--join=localhost:26257,localhost:26258,localhost:26259,localhost:26260 &

cockroach start --insecure \
--locality=datacenter=hk-1 \
--store=THUddb-2 \
--host=localhost \
--port=25258 \
--http-port=8081 \
--cache=100MB \
--join=localhost:26257,localhost:26258,localhost:26259,localhost:26260 &

cockroach start --insecure \
--locality=datacenter=hk-1 \
--store=THUddb-3 \
--host=localhost \
--port=25259 \
--http-port=8082 \
--cache=100MB \
--join=localhost:26257,localhost:26258,localhost:26259,localhost:26260 &

cockroach start --insecure \
--locality=datacenter=hk-1 \
--store=THUddb-4 \
--host=localhost \
--port=25260 \
--http-port=8082 \
--cache=100MB \
--join=localhost:26257,localhost:26258,localhost:26259,localhost:26260 &

cockroach init \
--insecure \
--host=localhost \
--port=26257
