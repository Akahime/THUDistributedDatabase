#!/bin/bash

cockroach user set thuuser --insecure
cockroach sql --insecure -e 'GRANT ALL ON DATABASE thudb TO thuuser'
cockroach sql --insecure -e 'GRANT ALL ON TABLE thudb.article TO thuuser'
cockroach sql --insecure -e 'GRANT ALL ON TABLE thudb."user" TO thuuser'
cockroach sql --insecure -e 'GRANT ALL ON TABLE thudb.be_read TO thuuser'
cockroach sql --insecure -e 'GRANT ALL ON TABLE thudb.popular_rank TO thuuser'
cockroach sql --insecure -e 'GRANT ALL ON TABLE thudb.read TO thuuser'