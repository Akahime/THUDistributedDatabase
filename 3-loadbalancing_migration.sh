#/bin/bash

cockroach gen haproxy \
	 --insecure \
	 --host=localhost \
	 --port=26257
	 
echo "Generated haproxy.cfg : please modify the port now."

read -p "Press enter to launch the Load Balancer"
haproxy -f haproxy.cfg &

read -p "Press enter to simulate clients"
$HOME/go/bin/ycsb -duration 20m -tolerate-errors -concurrency 10 -rate-limit 100 'postgresql://root@localhost:26000?sslmode=disable' > log &

read -p "Press enter to only use one specific datacenter"
echo 'constraints: [+datacenter=bj-1]' | cockroach zone set .default --insecure --host=localhost -f -

read -p "Press enter to use both datacenters"
echo 'constraints: []' | cockroach zone set .default --insecure --host=localhost -f -

read -p "Stop the simulation"
killall ycsb