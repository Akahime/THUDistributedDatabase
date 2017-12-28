# THUDistributedDatabase
Project of a Distributed Database containing articles, using Cockroachdb.


## Cockroach ##

*Execute SQL file:*
```cockroach sql --insecure --database=thudb < create_tables/articles.sql```

*Number of Nodes*
We filled increasingly a node. Around 50 000 entries, the select response time was around 500 ms so we chose 130 000 * 3 / 50 000 = 8 nodes.


*Performance optimization*
Horizontal partitionning (where clause) : Indexes
Vertical partitionning (columns often called together) : Column Families
Parent - child relations : Interleaved Tables

## Website ##

### Global packages requirements

- node v4.x (see NodeJS website)
- npm 2.x (with NodeJS)
- forever (npm package): run a node web server in background
- mysql if you use a test database

### Usage

Build:
1. (sudo) npm install
2. ./node_modules/bower/bin/bower install
Start the web server:
3. (Local) To change the environment variables create a config.json file and update the variables if needed. Default: 
  * Server: localhost:8888
  * Database: localhost:3306
4. (sudo) npm start


### Backend Organization

- config : config files for general working of the website (db, translations, authentication ..)
- locales : translation files
- order, user: One folder per table in database.

### Translation :

For use in backend and jade views, check documentation : https://github.com/mashpie/i18n-node
For use in frontend js files, use the json variable translation
Ex:
  - Backend: (routes.js)   req.__("name") -> "Name "
  - View: (profile.jade)   #{lang.__("name")} -> "Name "
  - Frontend js : ui/index.js  translation.name -> "Name "