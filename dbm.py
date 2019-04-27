import sqlite3
from sqlite3 import Error
import random


sql_create_new_table = """CREATE TABLE IF NOT EXISTS registered_users (
id integer PRIMARY KEY AUTOINCREMENT,
name text NOT NULL,
vk_id text NOT NULL UNIQUE,
kocherga_common integer DEFAULT 0,
kocherga_common_gold integer DEFAULT 0
);"""


def select_user_by_vkid(conn, user_id):

    cur = conn.cursor()
    cur.execute("SELECT * FROM registered_users WHERE vk_id=?", (user_id,))

    rows = cur.fetchall()

    return rows


def select_all_users(conn):

    cur = conn.cursor()
    cur.execute("""SELECT * FROM registered_users""")

    rows = cur.fetchall()

    return rows


def select_random_user(conn):
    user = random.choice(select_all_users(conn))
    return user


def delete_by_vkid(conn, user_id):
    with conn:
        cur = conn.cursor()
        cur.execute("DELETE from registered_users where vk_id=?", (user_id,))
    print(f'deleted {user_id}')


def create_connection(db_file):
    try:
        conn = sqlite3.connect(db_file)
        return conn
    except Error as e:
        print(e)
        return None


def create_table(conn, create_table_sql):
    try:
        c = conn.cursor()
        c.execute(create_table_sql)
    except Error as e:
        print(e)


def add_user(conn, user):
    try:
        sql = '''INSERT INTO registered_users(name, vk_id) VALUES(?, ?)'''
        print(sql)
        cur = conn.cursor()
        cur.execute(sql, user)
        return cur.lastrowid
    except Error as e:
        print(e)


def add_common_kocherga(conn, user_id):
    sql = f'''UPDATE registered_users SET kocherga_common = kocherga_common + 1 WHERE vk_id = {user_id};'''
    cur = conn.cursor()
    cur.execute(sql)


def add_gold_kocherga(conn, user_id):
    sql = f'''UPDATE registered_users SET kocherga_common_gold = kocherga_common_gold + 1 WHERE vk_id = {user_id};'''
    cur = conn.cursor()
    cur.execute(sql)


def set_kocherga_date(conn, user_id, strdate):
    sql = f'''UPDATE registered_users SET _last_kocherga = \"{strdate}\" WHERE vk_id = {user_id};'''
    print(sql)
    cur = conn.cursor()
    cur.execute(sql)


def get_kocherga_date(conn, user_id):
    cur = conn.cursor()
    cur.execute("SELECT _last_kocherga  FROM registered_users WHERE vk_id=?", (user_id,))

    row = cur.fetchone()

    return row


def add_win(conn, user_id):
    sql = f'''UPDATE registered_users SET wins = wins + 1 WHERE vk_id = {user_id};'''
    cur = conn.cursor()
    cur.execute(sql)


def fetch_top(conn):
    cur = conn.cursor()
    sql = f'''SELECT name, kocherga_common, kocherga_common_gold FROM registered_users ORDER BY kocherga_common_gold DESC,kocherga_common DESC;'''
    cur.execute(sql)

    rows = cur.fetchall()
    # print(rows)
    return rows


def fetch_best(conn):
    cur = conn.cursor()
    sql = f'''select name, wins from registered_users order by wins desc;'''
    cur.execute(sql)

    rows = cur.fetchall()
    return rows


if __name__ == '__main__':
    conn = create_connection("users.db")
    create_table(conn, sql_create_new_table)
    with conn:
        # select_user_by_vkid(conn, "321")
        add_win(conn, '101081222')