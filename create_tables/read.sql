DROP TABLE IF EXISTS "read";

CREATE TABLE "read" ( 
   "id" SERIAL PRIMARY KEY NOT NULL, 
   "timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
   "uid" INT DEFAULT NULL,
   "aid" INT DEFAULT NULL,
   "readOrNot" BOOLEAN DEFAULT true,
   "readTimeLength" INTERVAL DEFAULT NULL,
   "readSequence" INT DEFAULT 0,
   "agreeOrNot" BOOLEAN DEFAULT false,
   "commentOrNot" BOOLEAN DEFAULT false,
   "shareOrNot" BOOLEAN DEFAULT false,
   "commentDetail" STRING(280) DEFAULT NULL
);

SHOW COLUMNS from "read";