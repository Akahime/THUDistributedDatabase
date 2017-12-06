DROP TABLE IF EXISTS "article";
    CREATE TABLE "article" (
              "timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
              "aid" SERIAL PRIMARY KEY NOT NULL, 
              "title" STRING(15) DEFAULT NULL, 
              "category" STRING(11) DEFAULT NULL, 
              "abstract" STRING(50) DEFAULT NULL, 
              "articleTags" STRING(14) DEFAULT NULL, 
              "authors" STRING(13) DEFAULT NULL, 
              "language" STRING(2) DEFAULT NULL, 
              "text" STRING(50) DEFAULT NULL, 
              "image" STRING(50) DEFAULT NULL, 
              "video" STRING(50) DEFAULT NULL);
