import vk_methods
import json
import comands
import Games
from config import *



# initial operator names
faris_names = ['faris', 'фейрис', 'фэйрис', 'няннян', 'нян']
secret_names = ['rumiho', 'akiha', 'румихо', 'акиха']

# Comands block
comands_list = {
    'помощь': comands.hello_faris,
    'до свидания': comands.bye_faris,
    'idealgf': comands.ideal_gf,
    'картинк': comands.get_random_picture(0),
    'левд': comands.get_random_picture(1),
    'скрин': comands.screenshot,
    'регистрация': comands.db_register_user,
    'кочерг': Games.throw_kocherga,
    'топ': comands.fetch_vk_top
}


def handle_request(request):
    event = json.loads(request)
    peer_id = event['object']['peer_id']
    from_id = event['object']['from_id']
    peer_from_comands = [
        'регистрация',
        'кочерг'
    ]

    if 'message_new' in event['type']:
        if any(name in event['object']['text'].lower() for name in faris_names):
            for comand in comands_list:
                if comand in event['object']['text'].lower():
                    if comand in peer_from_comands:
                        comands_list[comand](peer_id, from_id)
                    elif comand == 'бой':
                        comands_list[comand](peer_id, from_id, event['object']['text'])
                    else:
                        comands_list[comand](peer_id)
        elif any(name in event['object']['text'].lower() for name in secret_names):
            message = 'О чём ты говоришь, господин, меня зовут Фейрис НянНян!'
            vk_methods.send_message(message, peer_id, '0')
