DROP TABLE IF EXISTS "be_read";

CREATE TABLE "be_read" ( 
   "id" SERIAL PRIMARY KEY NOT NULL, 
   "timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
   "aid" INT DEFAULT NULL, 
   "readNum" INT DEFAULT 0,
   "readUidList" INT[],
   "commentNum" INT DEFAULT 0,
   "commentUidList"  INT[],
   "agreeNum" INT DEFAULT 0,
   "agreeUidList"  INT[],
   "shareNum" INT DEFAULT 0,
   "shareUidList"  INT[]
);

SHOW COLUMNS from "be_read";