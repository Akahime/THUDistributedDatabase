# THUDistributedDatabase
Project of a Distributed Database containing articles, using Cockroachdb.


= Useful commands =

== Cockroach ==

*Execute SQL file:*
```cockroach sql --insecure --database=test < create_tablesa/articles.sql```

*Number of Nodes*
We filled increasingly a node. Around 50 000 entries, the select response time was around 500 ms so we chose 130 000 * 3 / 50 000 = 8 nodes.


*Performance optimization*
Horizontal partitionning (where clause) : Indexes
Vertical partitionning (columns often called together) : Column Families
Parent - child relations : Interleaved Tables

== HDFS ==

Pour pouvoir récupérer les infos (sans utiliser une interface graphique), utiliser WebHDFS ???




