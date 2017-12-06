DROP TABLE IF EXISTS "popular_rank";

CREATE TABLE "popular_rank" ( 
   "timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
   "id" SERIAL PRIMARY KEY NOT NULL, 
   "temporalGranularity" STRING(8) DEFAULT NULL, 
   "articleAidList"  INT[] DEFAULT NULL
);

SHOW COLUMNS from "popular_rank";