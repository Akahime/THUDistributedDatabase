DROP TABLE IF EXISTS "be_read";

CREATE TABLE be_read (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aid" INT DEFAULT NULL,
    "readnumtotal" INT DEFAULT 0,
    "readnumdaily" INT DEFAULT 0,
    "readnumweekly" INT DEFAULT 0,
    "readnummonthly" INT DEFAULT 0,
    "readuidlist" INT[],
    "commentnum" INT DEFAULT 0,
    "commentuidlist"  INT[],
    "agreenum" INT DEFAULT 0,
    "agreeuidlist"  INT[],
    "sharenum" INT DEFAULT 0,
    "shareuidlist"  INT[],
     PRIMARY KEY ("aid","id"),
     CONSTRAINT fk_user FOREIGN KEY ("aid") REFERENCES "article") INTERLEAVE IN PARENT "article" ("aid");

SHOW COLUMNS from be_read;