# coding=utf-8
import config
from random import random


# user in Beijing read/agree/comment/share an english article with the probability 0.6/0.2/0.2/0.1
# user in Hong Kong read/agree/comment/share an Chinese article with the probability 0.8/0.2/0.2/0.1
p = {}
p["Beijing" + "en"] = [0.6, 0.2, 0.2, 0.1]
p["Beijing" + "zh"] = [1, 0.3, 0.3, 0.2]
p["Hong Kong" + "en"] = [1, 0.3, 0.3, 0.2]
p["Hong Kong" + "zh"] = [0.8, 0.2, 0.2, 0.1]


def gen_an_read(i):
    read = {}
    read["id"] = str(i)
    read["timestamp"] = config.random_timestamp()
    read["uid"] = str(int(random() * config.USERS_NUM))
    read["aid"] = str(int(random() * config.ARTICLES_NUM))
    read["readOrNot"] = "true"
    read["readTimeLength"] = str(int(random() * 60))+"m"+str(int(random() * 60))+"s"
    read["readSequence"] = str(int(random() * 4))
    read["agreeOrNot"] = "true" if random() < 0.3 else "false"
    read["commentOrNot"] = "true" if random() < 0.3 else "false"
    read["shareOrNot"] = "true" if random() < 0.2 else "false"
    read["commentDetail"] = "commented by user " + read["uid"] + " on article " + read["aid"] if read["commentOrNot"] else ""
    return "(" + \
            read["id"] + ", "+ \
           "\'" + read["timestamp"] + "\', " + \
            read["uid"] + ", " + \
           read["aid"] + ", " + \
           read["readOrNot"] + ", " + \
           "\'" + read["readTimeLength"] + "\', " + \
           "\'" + read["readSequence"] + "\', " + \
           read["agreeOrNot"] + ", " + \
           read["commentOrNot"] + ", " + \
            read["shareOrNot"] + ", " + \
           "\'" + read["commentDetail"] + "\')"


# SLOW PC : GENERATE SEVERAL INSERT FILES
for i in range(int(config.READS_NUM/config.INSERTS_NUM)):
    with open("temp/fill_read_"+str(i)+".sql", "w+") as f:
        f.write('INSERT INTO "read" VALUES\n')
        for j in range(i*config.INSERTS_NUM, (i+1)*config.INSERTS_NUM-1):
            f.write("  " + gen_an_read(j) + ",\n")
        f.write("  " + gen_an_read((i+1)*config.INSERTS_NUM-1) + ";")


# FAST PC : only one insert file

# with open("fill_read.sql", "w+") as f:
#     f.write('use test;\n')
#     f.write('INSERT INTO "read" VALUES\n')
#     for j in range(config.READS_NUM-1):
#         f.write("  " + gen_an_article(j) + ",\n")
#     f.write("  " + gen_an_user(config.READS_NUM-1) + ";")