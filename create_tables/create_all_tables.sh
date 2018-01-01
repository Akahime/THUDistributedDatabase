#!/bin/bash

for file in {"user","article","read","be_read","popular_rank"}
	do echo -e "\n\nCreating table $file \n\n", $(cockroach sql --insecure --database=thudb < ./$file.sql)
done
echo -e "\n\nIndexing tables $file \n\n", $(cockroach sql --insecure --database=thudb < ./create_indices.sql)
