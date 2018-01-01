#/bin/bash

echo "Starting demonstration of Distributed Databases course !"
cd ./databases

read -p ">>>>  Press enter to launch Cockroach and 8 nodes"

echo "cockroach start --insecure \
--locality=datacenter=hk-1 \
--store=THUddb-1 \
--host=localhost \
--cache=100MB  \
--join=localhost:26257,localhost:26258,localhost:26259 &"

cockroach start --insecure \
--locality=datacenter=hk-1 \
--store=THUddb-1 \
--host=localhost \
--cache=100MB  \
--join=localhost:26257,localhost:26258,localhost:26259 &

cockroach start --insecure \
--locality=datacenter=hk-1 \
--store=THUddb-2 \
--host=localhost \
--port=25258 \
--http-port=8081 \
--cache=100MB \
--join=localhost:26257,localhost:26258,localhost:26259 &

cockroach start --insecure \
--locality=datacenter=hk-1 \
--store=THUddb-3 \
--host=localhost \
--port=25259 \
--http-port=8082 \
--cache=100MB \
--join=localhost:26257,localhost:26258,localhost:26259 &

cockroach start --insecure \
--locality=datacenter=hk-1 \
--store=THUddb-4 \
--host=localhost \
--port=0 \
--http-port=0 \
--cache=100MB \
--join=localhost:26257,localhost:26258,localhost:26259 &

read -p "Press enter to init the cluster"

echo "cockroach init \
--insecure \
--host=localhost \
--port=26257"
cockroach init \
--insecure \
--host=localhost \
--port=26257

echo "echo 'num_replicas: 6' | cockroach zone set .default --insecure -f -"
echo 'num_replicas: 6' | cockroach zone set .default --insecure -f -

cockroach start --insecure --locality=datacenter=bj-1 --store=THUddb-5 --host=localhost --port=26260 --http-port=8083 \
				--cache=100MB --join=localhost:26257,localhost:26258,localhost:26259 &

cockroach start --insecure --locality=datacenter=bj-1 --store=THUddb-6 --host=localhost --port=25261 --http-port=8084 \
				--cache=100MB --join=localhost:26257,localhost:26258,localhost:26259 &

cockroach start --insecure --locality=datacenter=bj-1 --store=THUddb-7 --host=localhost --port=25262 --http-port=8085 \
				--cache=100MB --join=localhost:26257,localhost:26258,localhost:26259 &

cockroach start --insecure --locality=datacenter=bj-1 --store=THUddb-8 --host=localhost --port=0 --http-port=0 \
				--cache=100MB --join=localhost:26257,localhost:26258,localhost:26259 &

# read -p "Press enter to launch the website."

# echo "npm start" 
# cd ../ddbwebsite/ ; npm start &

