#/bin/bash

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

echo 'num_replicas: 6' | cockroach zone set .default --insecure -f -

cockroach init \
--insecure \
--host=localhost \
--port=26257

haproxy -f haproxy.cfg &

cockroach start --insecure --locality=datacenter=bj-1 --store=THUddb-4 --host=localhost --port=26260 --http-port=8083 \
				--cache=100MB --join=localhost:26257,localhost:26258,localhost:26259 &

cockroach start --insecure --locality=datacenter=bj-1 --store=THUddb-5 --host=localhost --port=25261 --http-port=8084 \
				--cache=100MB --join=localhost:26257,localhost:26258,localhost:26259 &

				cockroach start --insecure --locality=datacenter=bj-1 --store=THUddb-6 --host=localhost --port=25262 --http-port=8085 \
--cache=100MB --join=localhost:26257,localhost:26258,localhost:26259 &


#$HOME/go/bin/ycsb -duration 20m -tolerate-errors -concurrency 10 -rate-limit 100 'postgresql://root@localhost:26000?sslmode=disable'

#echo 'constraints: [+datacenter=bj-1]' | cockroach zone set .default --insecure --host=localhost -f -
#echo 'constraints: [-datacenter=bj-1]' | cockroach zone set .default --insecure --host=localhost -f -
#echo 'constraints: [+datacenter=hk-1]' | cockroach zone set .default --insecure --host=localhost -f -