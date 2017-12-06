DROP TABLE IF EXISTS "user_read";
CREATE TABLE "user_read" ( 
          "timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
          "urid" SERIAL PRIMARY KEY NOT NULL, 
          "uid" INT DEFAULT NULL, 
          "aid" INT DEFAULT NULL, 
          "readOrNot" BOOLEAN DEFAULT false,
          "readTimeLength" INTERVAL DEFAULT NULL,
          "readSequence" BOOLEAN DEFAULT false,
          "agreeOrNot" BOOLEAN DEFAULT false,
          "commentOrNot" BOOLEAN DEFAULT false,
          "shareOrNot" BOOLEAN DEFAULT false,
          "commentDetail" STRING(100) DEFAULT NULL);
