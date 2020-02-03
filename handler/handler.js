const sendMessage = require("./commands");
const fgo = require("./fgoGacha");
const util = require("util");
const request = require("request");

const commandsList = {
  найди: findPicture,
  гача: simulateGacha
};

function findPicture(msgInfoObject, picUrl) {
  url = "http://iqdb.org/?url=";

  if (picUrl) {
    url += picUrl;
  } else if (msgInfoObject.attachments.length) {
    url += msgInfoObject.attachments[0].photo.sizes.slice(-1)[0].url;
  } else if (msgInfoObject.reply_message.attachments.length) {
    url += msgInfoObject.reply_message.attachments[0].photo.sizes.slice(-1)[0]
      .url;
  } else {
    sendMessage.sendMessage(msgInfoObject.peer_id, "Неправилный запрос.");
    return;
  }
  request(
    {
      url: url,
      method: "GET"
    },
    function(error, response, body) {
      let regex = /<a href="(.*?)">/gm;
      var count = 0;
      let msg = "Я нашла это: ";
      for (let item of body.matchAll(regex)) {
        if (count++ == 2) break;
        msg += " https:" + item[1];
      }
      sendMessage.sendMessage(msgInfoObject.peer_id, msg);
    }
  );
}

function simulateGacha(msgInfoObject) {
  let pulled = fgo.gacha();
  let msg = "Вы выбили это, десу: \n";
  for (let item of pulled) {
    msg += item + "; \n";
  }
  sendMessage.sendMessage(msgInfoObject.peer_id, msg);
}

exports.handle = vkEventRequest => {
  if (vkEventRequest.type == "message_new") {
    const msgInfoObject = vkEventRequest.object.message;
    const text = msgInfoObject.text;
    /*if (msgInfoObject.from_id == "-163683277") {
      sendMessage.sendMessage(
        msgInfoObject.peer_id,
        "Да что ты говоришь, Костян!"
      );
    }*/
    if (text.toLowerCase().includes("мейда")) {
      // Проверяем, что в сообщение есть ключевое обращение
      let text_arr = text.split(" ");
      // разделяем сообщение по пробелам,
      // если на втором месте в сообщении есть команда,
      // то выполняем её с аргументами на следующих позициях(если они есть)
      if (text_arr[1] in commandsList) {
        commandsList[text_arr[1]](msgInfoObject, text_arr[2]);
        //Дебажное сообщение юзеру о начале работы.

        /*sendMessage.sendMessage(
          msgInfoObject.peer_id,
          `Приступаю к выполнению команды "${text_arr[1]}" Аргументы: ${
            text_arr[2] ? text_arr[2] : "отсутствуют."
          }`
        );*/
      }

      /* console.log(
        util.inspect(
          msgInfoObject.reply_message,
          false,
          null,
          true 
        )
      );
      console.log(
        msgInfoObject.reply_message.attachments[0].photo.sizes.slice(-1)[0].url
      );*/
    }
  }
};
