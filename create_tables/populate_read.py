import time
from random import random, randrange

ARTICLES_NUM = 200000


def random_timestamp():
    start_timestamp = time.mktime(time.strptime('Jan 1 1980  01:33:00', '%b %d %Y %I:%M:%S'))
    end_timestamp = time.mktime(time.strptime('Dec 20 2017  12:33:00', '%b %d %Y %I:%M:%S'))
    return time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(randrange(start_timestamp,end_timestamp)))


# science:45%   technology:55%
# en:50%    zh:50%
# 50 tags
# 2000 authors
def gen_an_article(i):
    article = {}
    article["aid"] = str(i)
    article["timestamp"] = random_timestamp()
    article["title"] = "title%d" % i
    article["category"] = "science" if random() > 0.55 else "technology"
    article["abstract"] = "abstract of article %d" % i
    article["articleTags"] = "tags%d" % int(random() * 50)
    article["authors"] = "author%d" % int(random() * 2000)
    article["language"] = "en" if random() > 0.5 else "zh"
    article["text"] = "text %d location on hdfs" % i
    article["image"] = "https://s3.ap-northeast-2.amazonaws.com/dfs-edai/pictures/%d.jpg" % int(random()*100)
    article["video"] = "video %d location on hdfs" % i

    return "(" + \
           article["aid"] + ", " + \
            "\'" + article["timestamp"] + "\', " + \
            "\'" + article["title"] + "\', " + \
            "\'" + article["category"] + "\', " + \
            "\'" + article["abstract"] + "\', " + \
            "\'" + article["articleTags"] + "\', " + \
            "\'" + article["authors"] + "\', " + \
            "\'" + article["language"] + "\', " + \
            "\'" + article["text"] + "\', " + \
            "\'" + article["image"] + "\', " + \
            "\'" + article["video"] + "\')"


# SLOW PC : GENERATE SEVERAL INSERT FILES
for i in range(4):
    with open("fill_article_"+str(i)+".sql", "w+") as f:
        f.write('INSERT INTO "article" VALUES\n')
        for j in range(i*5000, (i+1)*5000-1):
            f.write("  " + gen_an_article(j) + ",\n")
        f.write("  " + gen_an_article((i+1)*5000-1) + ";")


# FAST PC : only one insert file

# with open("fill_article.sql", "w+") as f:
#     f.write('use test;\n')
#     f.write('INSERT INTO "article" VALUES\n')
#     for j in range(ARTICLES_NUM-1):
#         f.write("  " + gen_an_article(j) + ",\n")
#     f.write("  " + gen_an_user(ARTICLES_NUM-1) + ";")