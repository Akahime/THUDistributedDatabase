# coding=utf-8

import time
from random import random, randrange

ARTICLES_NUM = 200000
INSERTS_NUM = 5000


def random_timestamp():
    start_timestamp = time.mktime(time.strptime('Jan 1 1980  01:33:00', '%b %d %Y %I:%M:%S'))
    end_timestamp = time.mktime(time.strptime('Dec 20 2017  12:33:00', '%b %d %Y %I:%M:%S'))
    return time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(randrange(start_timestamp,end_timestamp)))


# science:45%   technology:55%
# en:50%    zh:50%
# 50 tags
# 2000 authors
def gen_an_article(i):
    lang = random()
    article = {}
    article["aid"] = str(i)
    article["timestamp"] = random_timestamp()
    article["title"] = "Title of English article number %d" % i if lang > 0.5 else "中文文章第%d号标题" % i
    article["category"] = "science" if lang > 0.55 else "technology"
    article["abstract"] = "Abstract of article number %d" % i if lang > 0.5 else "第%d条摘要" % i
    article["articleTags"] = "tags%d" % int(random() * 50)
    article["authors"] = "English Author %d" % int(random() * 2000) if lang > 0.5 else "中国作家%d" % int(random() * 2000)
    article["language"] = "en" if lang > 0.5 else "zh"
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
for i in range(int(ARTICLES_NUM/INSERTS_NUM)):
    with open("temp/fill_article_"+str(i)+".sql", "w+") as f:
        f.write('INSERT INTO "article" VALUES\n')
        for j in range(i*INSERTS_NUM, (i+1)*INSERTS_NUM-1):
            f.write("  " + gen_an_article(j) + ",\n")
        f.write("  " + gen_an_article((i+1)*INSERTS_NUM-1) + ";")


# FAST PC : only one insert file

# with open("fill_article.sql", "w+") as f:
#     f.write('use test;\n')
#     f.write('INSERT INTO "article" VALUES\n')
#     for j in range(ARTICLES_NUM-1):
#         f.write("  " + gen_an_article(j) + ",\n")
#     f.write("  " + gen_an_user(ARTICLES_NUM-1) + ";")