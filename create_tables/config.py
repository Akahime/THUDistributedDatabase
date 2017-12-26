# config.py

import time
from random import randrange

USERS_NUM = 10000
ARTICLES_NUM = 200000
READS_NUM = 1000000
INSERTS_NUM = 5000

def random_timestamp():
    start_timestamp = time.mktime(time.strptime('Jan 1 2010  01:33:00', '%b %d %Y %I:%M:%S'))
    end_timestamp = time.mktime(time.strptime('Dec 20 2017  12:33:00', '%b %d %Y %I:%M:%S'))
    return time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(randrange(start_timestamp,end_timestamp)))