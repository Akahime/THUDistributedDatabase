# THUDistributedDatabase
Project of a Distributed Database containing articles, using Cockroachdb.


= Useful commands =

== Cockroach ==

*Execute SQL file:*
```cockroach sql --insecure --database=bank < ~/Documents/Tsinghua/articles.sql```


*Performance optimization*
Horizontal partitionning (where clause) : Indexes
Vertical partitionning (columns often called together) : Column Families
Parent - child relations : Interleaved Tables

== HDFS ==

Pour pouvoir récupérer les infos (sans utiliser une interface graphique), utiliser WebHDFS ???




