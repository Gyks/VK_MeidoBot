const commandsList = require("./commands");

exports.handle = vkEventRequest => {
  if (vkEventRequest.type == "message_new") {
    const msgInfoObject = vkEventRequest.object.message;
    const text = msgInfoObject.text;

    if (text.toLowerCase().includes("мейда")) {
      // Проверяем, что в сообщение есть ключевое обращение
      let text_arr = text.split(" ");
      // разделяем сообщение по пробелам,
      // если на втором месте в сообщении есть команда,
      // то выполняем её с аргументами на следующих позициях(если они есть)
      if (text_arr[1] in commandsList) {
        commandsList[text_arr[1]](msgInfoObject, text_arr[2]);
      }
    }
  }
};
