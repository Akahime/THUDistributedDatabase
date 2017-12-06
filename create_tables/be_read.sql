DROP TABLE IF EXISTS "be_read";

CREATE TABLE "be_read" ( 
   "timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
   "id" SERIAL PRIMARY KEY NOT NULL, 
   "aid" INT DEFAULT NULL, 
   "readNum" INT DEFAULT 0,
   "commentNum" INT DEFAULT 0,
   "agreeNum" INT DEFAULT 0,
   "shareNum" INT DEFAULT 0,

   "readUidList" INT[] DEFAULT NULL,
   "commentUidList"  INT[] DEFAULT NULL,
   "agreeUidList"  INT[] DEFAULT NULL,
   "shareUidList"  INT[] DEFAULT NULL
);

SHOW COLUMNS from "be_read";