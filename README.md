# THUDistributedDatabase
Project of a Distributed Database containing articles, using Cockroachdb.


# 1. Cockroachdb #

## 1.1 Cockroach Nodes ##
### Launch cockroach Nodes ###

If it is the first time we initiate the cluster :
```./0-init_cockroach```

If you have already initiated it once :
```./1-setup_demo``` (press enter 2 times : first time to launch 7 nodes, second to launch 8th node)

### Stop cockroach Nodes ###
Execute this command as long as there are still outputs:
```killall cockroach```

## 1.2 Monitoring 
Once you have started some nodes, go to http://localhost:8080 in your browser

## 1.3 Cockroach SQL ###

### Initial Setup ###

Create user "thuuser" for database "thudb" and give him access rights.
The database configuration can be found in ddbwebsite/back/config/config.json

1. ```cockroach user set thuuser --insecure```
2. ```cockroach sql --insecure -e 'CREATE DATABASE thudb'```
3. ```cockroach sql --insecure -e 'GRANT ALL ON DATABASE thudb TO thuuser'```

### Use Cockroach SQL interface ###
```cockroach sql --insecure --database=thudb```

### Execute SQL file without copy-pasting in the interface ###
```cockroach sql --insecure --database=thudb < create_tables/articles.sql```

##1.4 Demonstration of Server Management

These scripts are created by Valentin. They give series of instructions and explain each step of the demonstration, 
so you need to *pay attention at the console* you are launching these scripts with and follow the written instructions.
You need to give execute authorization to your computer to launch them : ```chmod +x path/to/script```

1. Expansion at the DBMS-level allowing a new DBMS server to join : ```./1-setup_demo``` (Press Enter 2 times)
2. Dropping a DBMS server at will and fault tolerance: ```./2-remove_node_tempo```
3. Loadbalancing and Data migration : install requirements https://www.cockroachlabs.com/docs/stable/demo-automatic-cloud-migration.html
Then run ```./3-loadbalancing_migration```



#2. Website (\ddbwebsite folder) #

##2.1 Packages required

- node v4.x (see NodeJS website)
- npm 2.x (with NodeJS)
- forever (npm package): run a node web server in background

##2.2 Usage

Build:
1. (sudo) ```npm install``` to install packages dependancies
2. (Local) To change the environment variables create a config.json file and update the variables if needed. Default: 
  * Server: localhost:8888
  * Database: localhost:3306
3. (sudo) ```npm start``` to start the server
4. If you launch ```npm start``` more than once, on your terminal is written the path to the log file.
5. Go to http://localhost:8888 to see the website
6. ```forever stop ddbwebsite``` to stop the server


##2.3 Backend Organization (\back folder)

- config : config files for general working of the website (db, translations, utils ..)
- locales : translation files
- queries : queries to cockroachdb for each table : user, article, read, be_read, popular_rank


