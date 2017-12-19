import time
from random import random, randrange

USERS_NUM = 10000

def random_timestamp():
    start_timestamp = time.mktime(time.strptime('Jan 1 1980  01:33:00', '%b %d %Y %I:%M:%S'))
    end_timestamp = time.mktime(time.strptime('Dec 20 2017  12:33:00', '%b %d %Y %I:%M:%S'))
    return time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(randrange(start_timestamp,end_timestamp)))

# Beijing:60%   Hong Kong:40%
# en:20%    zh:80%
# 20 depts
# 3 roles
# 50 tags
# 0~99 credits
def gen_an_user(i):
    user = {}
    user["uid"] = str(i)
    user["timestamp"] = random_timestamp()
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
for i in range(2):
    with open("fill_user.sql", "w+") as f:
        f.write('use test;\n')
        f.write('INSERT INTO "user" VALUES\n')
        for j in range(i*5000, (i+1)*5000-1):
            f.write("  " + gen_an_user(j) + ",\n")
        f.write("  " + gen_an_user((i+1)*5000-1) + ";")

# FAST PC : only one insert file

# with open("fill_user.sql", "w+") as f:
#     f.write('use test;\n')
#     f.write('INSERT INTO "user" VALUES\n')
#     for j in range(USERS_NUM-1):
#         f.write("  " + gen_an_user(j) + ",\n")
#     f.write("  " + gen_an_user(USERS_NUM-1) + ";")