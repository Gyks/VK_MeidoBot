import json
import operator
import random
import sys
import threading
import requests

from config import *


def get_chat(chat_id):
    payload = {
        'chat_id': chat_id,
        'chat_ids': '',
        'fields': '',
        'name_case': '',
        'access_token': access_token,
        'v': version
    }
    r = requests.post('https://api.vk.com/method/messages.getChat', params=payload)
    print(r.json()['response']['members_count'])
    print(r.json()['response']['users'])
    return r.json()


def get_photos(owner_id, album_id, rev: bool, extended: bool, photo_sizes: bool, offset: int, count: int):
    payload = {
        'owner_id': owner_id,
        'album_id': album_id,
        'rev': int(rev),
        'extended': int(extended),
        'photo_sizes': int(photo_sizes),
        'offset': offset,
        'count': count,
        'access_token': access_token_app,
        'v': '5.80'
    }
    r = requests.post('https://api.vk.com/method/photos.get', params=payload)
    return r.json()


def get_user_info(user_id):
    payload = {
        'v': version,
        'access_token': access_token_app,
        'user_ids': user_id
    }
    r = requests.post('https://api.vk.com/method/users.get', params=payload)
    user_info = "{0} {1}".format(r.json()['response'][0]['first_name'], r.json()['response'][0]['last_name'])
    return user_info


def send_message(message, peer_id, attachment):
    random_id = random.randrange(sys.maxsize)
    if peer_id < 2000000000:
        peer_id += 2000000000
    if attachment == 0:
        payload = {
            'v': version,
            'access_token': access_token,
            'peer_id': peer_id,
            'random_id': random_id,
            'message': message
        }
    else:
        payload = {
            'v': version,
            'access_token': access_token,
            "attachment": attachment,
            'peer_id': peer_id,
            'random_id': random_id,
            'message': message
        }
    # <type><owner_id>_<media_id>
    r = requests.post('https://api.vk.com/method/messages.send', params=payload)


def get_long_poll_server(need_pts: str, lp_verison: str):
    payload = {
        'need_pts': need_pts,
        'lp_version': lp_verison,
        'access_token': access_token,
        'v': version,
        'group_id': '175863232'
    }
    r = requests.post('https://api.vk.com/method/groups.getLongPollServer', params=payload)
    print(r.json())
    key = r.json()['response']['key']
    ts = r.json()['response']['ts']
    server = r.json()['response']['server']
    print('connection established')
    return key, ts, server
