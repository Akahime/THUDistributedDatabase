import time
from random import random, randrange

USERS_NUM = 10000
ARTICLES_NUM = 200000
READS_NUM = 1000000
INSERTS_NUM = 5000

def random_timestamp():
    start_timestamp = time.mktime(time.strptime('Jan 1 2015  01:33:00', '%b %d %Y %I:%M:%S'))
    end_timestamp = time.mktime(time.strptime('Dec 20 2017  12:33:00', '%b %d %Y %I:%M:%S'))
    return time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(randrange(start_timestamp,end_timestamp)))


# user in Beijing read/agree/comment/share an english article with the probability 0.6/0.2/0.2/0.1
# user in Hong Kong read/agree/comment/share an Chinese article with the probability 0.8/0.2/0.2/0.1
p = {}
p["Beijing" + "en"] = [0.6, 0.2, 0.2, 0.1]
p["Beijing" + "zh"] = [1, 0.3, 0.3, 0.2]
p["Hong Kong" + "en"] = [1, 0.3, 0.3, 0.2]
p["Hong Kong" + "zh"] = [0.8, 0.2, 0.2, 0.1]


def gen_an_read(i):
    commented = random()
    read = {}
    read["id"] = str(i)
    read["timestamp"] = random_timestamp()
    read["uid"] = str(int(random() * USERS_NUM))
    read["aid"] = str(int(random() * ARTICLES_NUM))
    read["readOrNot"] = "true"
    read["readTimeLength"] = str(int(random() * 60))+"m"+str(int(random() * 60))+"s"
    read["readSequence"] = str(int(random() * 4))
    read["agreeOrNot"] = "true" if random() < 0.3 else "false"
    read["commentOrNot"] = "true" if commented < 0.3 else "false"
    read["shareOrNot"] = "true" if random() < 0.2 else "false"
    read["commentDetail"] = "commented by user " + read["uid"] + " on article " + read["aid"] if commented < 0.3 else ""
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
for i in range(READS_NUM/INSERTS_NUM):
    with open("fill_read_"+str(i)+".sql", "w+") as f:
        f.write('INSERT INTO "read" VALUES\n')
        for j in range(i*INSERTS_NUM, (i+1)*INSERTS_NUM-1):
            f.write("  " + gen_an_read(j) + ",\n")
        f.write("  " + gen_an_read((i+1)*INSERTS_NUM-1) + ";")


# FAST PC : only one insert file

# with open("fill_read.sql", "w+") as f:
#     f.write('use test;\n')
#     f.write('INSERT INTO "read" VALUES\n')
#     for j in range(READS_NUM-1):
#         f.write("  " + gen_an_article(j) + ",\n")
#     f.write("  " + gen_an_user(READS_NUM-1) + ";")