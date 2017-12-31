# Import the driver.
import psycopg2
import sys

def get_list_from_value(value, aid):
	cur.execute("SELECT uid FROM read WHERE " + value + " IS TRUE AND aid = " + str(aid) + ";")
	rows = cur.fetchall()
	articles = ""
	i = 0
	for row in rows:
		articles = articles + " " + str(row[0])
		i = i + 1
		if (i < len(rows)):
			articles = articles + ","
	return articles

def update_one_row_be_read(aid):
	cur.execute("SELECT aid, COUNT(aid), SUM(CASE WHEN readOrNot = true THEN 1 ELSE 0 END) AS readNum, SUM(CASE WHEN commentOrNot = true THEN 1 ELSE 0 END) as commentnum, SUM(CASE WHEN agreeOrNot = true THEN 1 ELSE 0 END) AS agreeNum, SUM(CASE WHEN shareOrNot = true THEN 1 ELSE 0 END) as sharenum FROM read WHERE aid = " + str(aid) + " GROUP BY aid;")
	numbers = cur.fetchall()
	cur.execute("SELECT COUNT(aid) FROM read WHERE aid = " + str(aid) + " AND (extract('day', CAST(timestamp AS DATE)) = extract('day', current_date())) AND (extract('month', CAST(timestamp AS DATE)) = extract('month', current_date())) AND (extract('year', CAST(timestamp AS DATE)) = extract('year', current_date())) GROUP BY aid;")
	numdaily = cur.fetchone()[0]
	cur.execute("SELECT COUNT(aid) FROM read WHERE aid = " + str(aid) + " AND (extract('week', CAST(timestamp AS DATE)) = extract('week', current_date())) AND (extract('month', CAST(timestamp AS DATE)) = extract('month', current_date())) AND (extract('year', CAST(timestamp AS DATE)) = extract('year', current_date())) GROUP BY aid;")
	numweekly = cur.fetchone()[0]
	cur.execute("SELECT COUNT(aid) FROM read WHERE aid = " + str(aid) + " AND (extract('month', CAST(timestamp AS DATE)) = extract('month', current_date())) AND (extract('year', CAST(timestamp AS DATE)) = extract('year', current_date())) GROUP BY aid;")
	nummonthly = cur.fetchone()[0]
	#a faire
	
def be_read():
	cur.execute("DROP TABLE IF EXISTS \"be_read\"; \
				CREATE TABLE \"be_read\" ( \
				\"id\" SERIAL PRIMARY KEY NOT NULL, \
				\"timestamp\" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, \
				\"aid\" INT DEFAULT NULL, \
				\"readnumtotal\" INT DEFAULT 0,\
				\"readnumdaily\" INT DEFAULT 0,\
				\"readnumweekly\" INT DEFAULT 0,\
				\"readnummonthly\" INT DEFAULT 0,\
				\"readuidlist\" INT[],\
				\"commentnum\" INT DEFAULT 0,\
				\"commentuidlist\"  INT[],\
				\"agreenum\" INT DEFAULT 0,\
				\"agreeuidlist\"  INT[],\
				\"sharenum\" INT DEFAULT 0,\
				\"shareuidlist\"  INT[]);")
	cur.execute("SELECT aid, COUNT(aid), SUM(CASE WHEN readOrNot = true THEN 1 ELSE 0 END) AS readNum, SUM(CASE WHEN commentOrNot = true THEN 1 ELSE 0 END) as commentnum, SUM(CASE WHEN agreeOrNot = true THEN 1 ELSE 0 END) AS agreeNum, SUM(CASE WHEN shareOrNot = true THEN 1 ELSE 0 END) as sharenum FROM read GROUP BY aid;")
	rows = cur.fetchall()
	i = 0
	for row in rows:
		i = i + 1
		cur.execute("SELECT COUNT(aid) FROM read WHERE (extract('day', CAST(timestamp AS DATE)) = extract('day', current_date())) AND (extract('month', CAST(timestamp AS DATE)) = extract('month', current_date())) AND (extract('year', CAST(timestamp AS DATE)) = extract('year', current_date())) GROUP BY aid;")
		numdaily = cur.fetchone()[0]
		cur.execute("SELECT COUNT(aid) FROM read WHERE (extract('week', CAST(timestamp AS DATE)) = extract('week', current_date())) AND (extract('month', CAST(timestamp AS DATE)) = extract('month', current_date())) AND (extract('year', CAST(timestamp AS DATE)) = extract('year', current_date())) GROUP BY aid;")
		numweekly = cur.fetchone()[0]
		cur.execute("SELECT COUNT(aid) FROM read WHERE (extract('month', CAST(timestamp AS DATE)) = extract('month', current_date())) AND (extract('year', CAST(timestamp AS DATE)) = extract('year', current_date())) GROUP BY aid;")
		nummonthly = cur.fetchone()[0]
		cur.execute("INSERT INTO be_read VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)" % (str(i), "CURRENT_TIMESTAMP()", row[0], row[2], numdaily, numweekly, nummonthly, "ARRAY[" + get_list_from_value("readornot", row[0]) + "]", row[3], "ARRAY[" + get_list_from_value("commentornot", row[0]) + "]", row[4],  "ARRAY[" + get_list_from_value("agreeornot", row[0]) + "]", row[5],  "ARRAY[" + get_list_from_value("shareornot", row[0]) + "]"))

def get_list_ranked(s):
	cur.execute("SELECT aid FROM be_read ORDER BY " + s + " DESC LIMIT 5;")
	rows = cur.fetchall()
	articles = ""
	i = 0
	for row in rows:
		articles = articles + " " + str(row[0])
		i = i + 1
		if (i < len(rows)):
			articles = articles + ","
	return articles

	
def popular_rank():
	cur.execute("DROP TABLE IF EXISTS \"popular_rank\"; \
				CREATE TABLE IF NOT EXISTS \"popular_rank\" (  \
				\"id\" serial primary key not null, \
				\"timestamp\" timestamp not null default current_timestamp,\
				\"temporalgranularity\" string(8) default null, \
				\"articleaidlist\"  int[]); \
				INSERT INTO popular_rank VALUES \
				(1, CURRENT_TIMESTAMP(), \'Daily\', ARRAY[" + get_list_ranked("readnumdaily") + "]),\
				(2, CURRENT_TIMESTAMP(), \'Weekly\', ARRAY[" + get_list_ranked("readnumweekly") + "]),  \
				(3, CURRENT_TIMESTAMP(), \'Monthly\', ARRAY[" + get_list_ranked("readnummonthly") + "]);")
	
def main():
	conn = psycopg2.connect(database='bank', user='maxroach', host='localhost', port=26257)
	conn.set_session(autocommit=True)
	global cur
	cur = conn.cursor()
	# be_read()
	# popular_rank()
	update_one_row_be_read(str(1))
	cur.close()
	conn.close()

if __name__ == "__main__":
	main()