require("dotenv").config();
const vkMethods = require("./vkApiMethods");
const fgo = require("./fgoGacha");
const api_key = process.env.API_TOKEN_DANBOORU;
const login = process.env.DANBOORU_LOGIN;
const HTMLParser = require("node-html-parser");
const axios = require("axios");

const commandsList = {
  найди: findPicture,
  гача: simulateGacha,
  техас: sendTexas,
  еще: someMore,
  ещё: someMore,
  мейдочку: sendMaid
};

async function findPicture(msgInfoObject, picUrl) {
  // определяем есть ли picUrl, если нет смотрим в аттачах
  const addHttps = m => {
    m.substring(0, 4) == "http" ? m : (m = "https:" + m);
    return m;
  };

  if (picUrl && picUrl.includes("https://")) {
  } else if (msgInfoObject.attachments.length) {
    picUrl = msgInfoObject.attachments[0].photo.sizes.slice(-1)[0].url;
  } else if (msgInfoObject.reply_message.attachments.length) {
    picUrl = msgInfoObject.reply_message.attachments[0].photo.sizes.slice(-1)[0]
      .url;
  } else {
    vkMethods.sendMessage(msgInfoObject.peer_id, "Неправилный запрос.");
    return;
  }

  const body = await axios.get("https://iqdb.org/", {
    params: {
      url: picUrl
    }
  });

  let parsed = HTMLParser.parse(body.data).querySelectorAll(
    "#pages.pages div table tr"
  );
  // На iqdb первые 4 вхождения по правилу выше - картинка, которую мы отправили, убираем их
  parsed = parsed.slice(4);

  // Группируем инфу о каждом совпадении по 5 (кол-во tr в table для каждой пикчи)

  let pictureInfo = []; //массив инфы по одной картинке
  let pictureLinks = []; //массив линков на посты с картинками для поиска дополнительной картинки по автору
  let message = "Я нашла это, десу: \n";
  for (let i = 0; i < parsed.length; i++) {
    pictureInfo.push(parsed[i]);
    // группируем по 5 и пихаем нужную инфу в сообщение, очищаем инфу для следующей пикчи
    if ((i + 1) % 5 == 0) {
      // всратый DOM требует всратый парсер...
      let picLink = addHttps(
        pictureInfo[1]
          .querySelectorAll(".image a")[0]
          .rawAttrs.slice(6)
          .slice(0, -1)
      );

      pictureLinks.push(picLink);
      message +=
        picLink +
        " с " +
        pictureInfo[4]
          .querySelectorAll("td")[0]
          .childNodes[0].toString()
          .slice(0, 4) +
        "похожестью" +
        "\n";
      pictureInfo = [];
    }
  }

  // функция, которая принимает ссылку на пост на данбуре и выдаёт урлу картинки того же автора
  const findArtistSendAnotherPic = async picLink => {
    const toLjson = l => {
      // если нет danbooru, то ничего не присылаем
      if (l.includes("danbooru") ? false : true) return null;
      return l + ".json";
    };
    picLink = toLjson(picLink);
    if (picLink === null) return;
    const body = await axios.get(picLink, {
      params: {
        login: login,
        api_key: api_key
      }
    });
    const artist = body.data.tag_string_artist;
    const anotherPic = await axios.get(
      "https://danbooru.donmai.us/posts.json",
      {
        params: {
          login: login,
          api_key: api_key,
          tags: artist,
          limit: 1,
          random: true
        }
      }
    );
    return { url: anotherPic.data[0].large_file_url, artist: artist };
  };

  // если команда расширенная, то ищем ещё одну картинку с этим автором и кидаем
  if (
    msgInfoObject.text.includes("еще") ||
    msgInfoObject.text.includes("ещё")
  ) {
    for (let picLink of pictureLinks) {
      const anotherPic = await findArtistSendAnotherPic(picLink);
      if (anotherPic && anotherPic.url) {
        vkMethods.uploadPhotoViaUrlAsync(
          msgInfoObject.peer_id,
          anotherPic.url,
          photoInfo => {
            vkMethods.sendMessage(
              msgInfoObject.peer_id,
              "Я ещё кое-что нашла! \n" + anotherPic.artist,
              "photo" +
                photoInfo.owner_id +
                "_" +
                photoInfo.id +
                "_" +
                photoInfo.access_key
            );
          }
        );
        break;
      }
    }
  } else {
    // если команда не расширена, то выдаём обычный результат
    vkMethods.sendMessage(msgInfoObject.peer_id, message);
  }
}

function simulateGacha(msgInfoObject) {
  let pulled = fgo.gacha();
  let msg = "Вы выбили это, десу: \n";
  for (let item of pulled) {
    msg += item + "; \n";
  }
  vkMethods.sendMessage(msgInfoObject.peer_id, msg);
}

async function sendTexas(msgInfoObject) {
  const body = await axios.get("https://danbooru.donmai.us/posts.json", {
    params: {
      login: login,
      api_key: api_key,
      tags: "texas_(arknights)",
      limit: 1,
      random: true
    }
  });
  texasPictureUrl = body.data[0].large_file_url;
  vkMethods.uploadPhotoViaUrlAsync(
    msgInfoObject.peer_id,
    texasPictureUrl,
    photoInfo => {
      vkMethods.sendMessage(
        msgInfoObject.peer_id,
        "Ваша тексас!",
        "photo" +
          photoInfo.owner_id +
          "_" +
          photoInfo.id +
          "_" +
          photoInfo.access_key
      );
    }
  );
}

async function someMore(msgInfoObject) {
  let artist;
  let text = msgInfoObject.reply_message.text;
  if (text.includes("Я ещё кое-что нашла!") || text.includes("ЕЩЁ!"))
    artist = text.split("\n")[1];
  else return;
  const anotherPic = await axios.get("https://danbooru.donmai.us/posts.json", {
    params: {
      login: login,
      api_key: api_key,
      tags: artist,
      limit: 1,
      random: true
    }
  });
  let picUrl = anotherPic.data[0].large_file_url;
  console.log(artist);
  vkMethods.uploadPhotoViaUrlAsync(msgInfoObject.peer_id, picUrl, photoInfo => {
    vkMethods.sendMessage(
      msgInfoObject.peer_id,
      "ЕЩЁ! \n" + artist,
      "photo" +
        photoInfo.owner_id +
        "_" +
        photoInfo.id +
        "_" +
        photoInfo.access_key
    );
  });
}

async function sendMaid(msgInfoObject) {
  let photo = await vkMethods.getPhoto("-78638180", "wall");

  vkMethods.sendMessage(msgInfoObject.peer_id, "Ваша мейдочка!", photo);
}

module.exports = commandsList;
