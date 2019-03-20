import dbm
import vk_methods
import random
import datetime
import secrets


def throw_kocherga(peer_id, from_id):
    conn = dbm.create_connection("users.db")
    user = dbm.select_random_user(conn)
    user_id = user[2]
    cooldown_state = False

    with conn:
        date = dbm.get_kocherga_date(conn, from_id)
        if date is None:
            return
        if date[0] == 'None':
            new_date = datetime.datetime.now()
            dbm.set_kocherga_date(conn, from_id, new_date)
        else:
            date = datetime.datetime.strptime(date[0], '%Y-%m-%d %H:%M:%S.%f')
            new_date = datetime.datetime.now()
            delta = new_date - date
            cooldown = datetime.timedelta(hours=1)
            if cooldown > delta:
                cooldown_state = True
        if not cooldown_state:
            dbm.set_kocherga_date(conn, from_id, new_date)
            if secrets.randbelow(101) == 0:
                dbm.add_gold_kocherga(conn, user_id)
                vk_methods.send_message(f'ЗОЛОТАЯ КОЧЕРГА УНИЧТОЖАЕТ ЖОПУ {user[1]}!!!', peer_id, 'photo153866439_456239136')
            else:
                dbm.add_common_kocherga(conn, user_id)
                vk_methods.send_message(f'Кочерга попадет в {user[1]}!', peer_id, 'photo153866439_456239135')
        else:
            vk_methods.send_message(f'Ня! У вас закончились кочерги, следующая будет через {str(cooldown - delta)[0:7]}!', peer_id, '0')