# coding=utf-8
import config
from random import random

# Beijing:60%   Hong Kong:40%
# en:20%    zh:80%
# 20 depts
# 3 roles
# 50 tags
# 0~99 credits
def gen_an_user(i):
    user = {}
    user["uid"] = str(i)
    user["timestamp"] = config.random_timestamp()
    user["name"] = "user%d" %i
    user["gender"] = 'false' if random() > 0.33 else 'true'
    user["email"] = "email%d" % i
    user["phone"] = "phone%d" % i
    user["dept"] = str(int(random() * 20))
    user["grade"] = str(int(random() * 4 + 1))
    user["language"] = "en" if random() > 0.8 else "zh"
    user["region"] = "Beijing" if random() > 0.4 else "Hong Kong"
    user["role"] = str(int(random() * 3))
    user["preferTags"] = "tags%d" % int(random() * 50)
    user["obtainedCredits"] = str(int(random() * 100))

    return "(" +  \
            user["uid"] + ", " + \
            "\'" + user["timestamp"] + "\', " + \
            "\'" + user["name"] + "\', " + \
            user["gender"] + ", " + \
            "\'" + user["email"] + "\', " + \
            "\'" + user["phone"] + "\', " + \
            "\'" + user["language"] + "\', " + \
            "\'" + user["region"] + "\', " + \
            user["dept"] + ", " + \
            user["grade"] + ", " + \
            user["role"] + ", " + \
            "\'" + user["preferTags"] + "\', " + \
            user["obtainedCredits"] + ")"


# SLOW PC : GENERATE SEVERAL INSERT FILES
for i in range(int(config.USERS_NUM/config.INSERTS_NUM)):
    with open("temp/fill_user_"+str(i)+".sql", "w+") as f:
        f.write('INSERT INTO "user" VALUES\n')
        for j in range(i*config.INSERTS_NUM, (i+1)*config.INSERTS_NUM-1):
            f.write("  " + gen_an_user(j) + ",\n")
        f.write("  " + gen_an_user((i+1)*config.INSERTS_NUM-1) + ";")


# FAST PC : only one insert file

# with open("fill_user.sql", "w+") as f:
#     f.write('use test;\n')
#     f.write('INSERT INTO "user" VALUES\n')
#     for j in range(config.USERS_NUM-1):
#         f.write("  " + gen_an_user(j) + ",\n")
#     f.write("  " + gen_an_user(config.USERS_NUM-1) + ";")