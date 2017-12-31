DROP TABLE IF EXISTS popular_rank;

CREATE TABLE popular_rank ( 
    "id" serial primary key not null,
    "timestamp" timestamp not null default current_timestamp,
    "temporalgranularity" string(8) default null,
    "articleaidlist"  int[]);

SHOW COLUMNS from "popular_rank";