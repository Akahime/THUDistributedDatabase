DROP TABLE IF EXISTS "popular_rank";

CREATE TABLE "popular_rank" (  
   "id" SERIAL PRIMARY KEY NOT NULL, 
   "timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
   "temporalGranularity" STRING(8) DEFAULT NULL, 
   "articleAidList"  INT[]
);

SHOW COLUMNS from "popular_rank";