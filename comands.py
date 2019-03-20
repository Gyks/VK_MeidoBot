import vk_methods
import random
import re
import dbm

def hello_faris(peer_id):
    message = '''Да-да, ня!
        Список команд, ня!:
        нян регистрация - регистрирует вас для участия в играх.
        нян удали меня - стирает все данные об играх и удаляет вас из бд.
        нян картинка - случайная картинка.
        нян скрин - случайный скриншот из аниме.
        нян idealgf - случайный мем идеальной девушки.
        Ко мне можно обращаться - фейрис, фэйрис, faris, нян'''
    vk_methods.send_message(message, peer_id, '0')


def bye_faris(peer_id):
    message = 'Пока-пока, ня!'
    vk_methods.send_message(message, peer_id, '0')

def ideal_gf(peer_id):
    # chat_obj = vk_methods.get_chat(int(peer_id) - 2000000000)
    item = random.choice(vk_methods.get_photos('-129440544', '248976186', 0, 0, 0, 1, 999)['response']['items'])
    link = 'photo-'
    link += '129440544_'
    link += str(item['id'])
    vk_methods.send_message('Твоя идеальная тян, ня!', peer_id, link)
    # vk_methods.send_message(str(chat_obj), peer_id, '0')

def send_rndpic_from_wall(peer_id):
    groups_list = [
        '163820739',
        '129440544',
        '174289700',
        '163058008',
        '103429263'
        ]
    rnd_single_group = random.choice(groups_list)
    item = random.choice(vk_methods.get_photos('-' + rnd_single_group, 'wall', 0, 0, 0, random.randint(1, 50), 999)['response']['items'])
    link = 'photo-'
    link += rnd_single_group + '_'
    link += str(item['id'])
    vk_methods.send_message('Я нашла это на помойке... ня!', peer_id, link)

def screenshot(peer_id):
    groups_list = [
        '2343758'
    ]
    rnd_single_group = random.choice(groups_list)
    item = random.choice(vk_methods.get_photos('-' + rnd_single_group, 'wall', 0, 0, 0, random.randint(1, 50), 999)['response']['items'])
    link = 'photo-'
    link += rnd_single_group + '_'
    link += str(item['id'])
    vk_methods.send_message('А из какого это аниме, ня?', peer_id, link)


def fetch_vk_user(peer_id, from_id, conn):
    rows = dbm.select_user_by_vkid(conn, str(from_id))
    print(str(rows))
    return rows


def db_register_user(peer_id, from_id):
    try:
        conn = dbm.create_connection("users.db")
        rows = fetch_vk_user(peer_id, from_id, conn)
        if not rows:
            user_name = vk_methods.get_user_info(from_id)
            with conn:
                user = (user_name, str(from_id))
                dbm.add_user(conn, user)
                vk_methods.send_message(f'Господин, ня, я добавила {user_name} в наш клуб, ня!', peer_id, '0')
        else:
            vk_methods.send_message(f'Я поискала, ня! Вы уже зарегестрированы.', peer_id, '0')
    except:
        vk_methods.send_message(f'Я не понимаю, ня!', peer_id, '0')


def db_delete_user(peer_id, from_id):
    try:
        conn = dbm.create_connection("users.db")
        dbm.delete_by_vkid(conn, from_id)
        vk_methods.send_message(f'Вы уходите, ня? Я сделала что-то не так, ня? Простите... ня.', peer_id, '0')
    except:
        vk_methods.send_message(f'Я не понимаю, ня! Возможно вы ещё не зарегистрированы?')


def get_random_user(peer_id):
    try:
        conn = dbm.create_connection("users.db")
        res = dbm.select_random_user(conn)
        vk_methods.send_message(f'{res[1]}, ня!', peer_id, '0')
    except:
        vk_methods.send_message(f'Я не понимаю, ня!', peer_id, '0')


def fight_user(peer_id, from_id, text):
    regex = r"id(\d+)\|"
    matches = re.findall(regex, text)
    if matches:
        conn = dbm.create_connection("users.db")
        with conn:
            target_id = matches[0]
            rows = dbm.select_user_by_vkid(conn, str(target_id))
            if rows:
                res = ['Вы выиграли', 'Вас победил']
                res_i = random.randint(0, 1)
                vk_methods.send_message(f'{res[res_i]} {rows[0][1]}, ня!', peer_id, '0')
                if res_i == 0:
                    if str(target_id) is not str(from_id):
                        dbm.add_win(conn, from_id)
                        rows = dbm.select_user_by_vkid(conn, str(from_id))
                        vk_methods.send_message(f'У вас {rows[0][5]} побед, ня!', peer_id, '0')
            else:
                vk_methods.send_message(f'Я не понимаю, ня! Возможно цель не зарегестрирована!', peer_id, '0')
    else:
        vk_methods.send_message(f'Я не понимаю, ня! Возможно цель не зарегестрирована!', peer_id, '0')
    #[id101081222|@mrgyks]