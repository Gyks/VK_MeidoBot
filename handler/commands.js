require("dotenv").config();
const vkMethods = require("./vk_api");
const fgo = require("./fgo_gacha");
const api_key = process.env.API_TOKEN_DANBOORU;
const login = process.env.DANBOORU_LOGIN;
const sauce_api_key = process.env.SAUCE_NAO_TOKEN;
const axios = require("axios");
const keyboard = {
  buttons: [
    [
      {
        action: {
          type: "text",
          label: "Мейдочку",
          payload: '{"command":"мейдочку"}'
        },
        color: "primary"
      },
      {
        action: {
          type: "text",
          label: "Тяночку",
          payload: '{"command":"тяночку"}'
        },
        color: "negative"
      }
    ]
  ],
  inline: true
};

const commandsList = {
  поищи: betterPictureFind,
  гача: simulateGacha,
  арк: sendArk,
  еще: someMore,
  ещё: someMore,
  мейдочку: sendMaid,
  help: sendHelp,
  тяночку: sendGirl,
  асочку: sendAska
};

function simulateGacha(msgInfoObject) {
  let pulled = fgo.gacha();
  let msg = "Вы выбили это, десу: \n";
  for (let item of pulled) {
    msg += item + "; \n";
  }
  vkMethods.sendMessage(msgInfoObject.peer_id, msg);
}

async function sendArk(msgInfoObject) {
  // арк кальцит
  let waifu;
  const listOfWaifus = {
    техас: "texas_(arknights)",
    амия: "amiya_(arknights)",
    кальцит: "kal'tsit_(arknights)",
    сиджа: "siege_(arknights)",
    лапа: "lappland_(arknights)",
    скади: "skadi_(arknights)",
    эхуй: "exusiai_(arknights)",
    член: "ch'en_(arknights)",
    метеорит: "meteorite_(arknights)",
    сария: "saria_(arknights)"
  };
  if (msgInfoObject.payload) {
    let command = JSON.parse(msgInfoObject.payload).command.split(" ");
    waifu = listOfWaifus[command[1]];
  } else {
    let text = msgInfoObject.text.split(" ");
    waifu = listOfWaifus[text[2]];
  }

  const keyboard = {
    buttons: [
      [
        {
          action: {
            type: "text",
            label: "Кальцит",
            payload: '{"command":"арк кальцит"}'
          },
          color: "secondary"
        },
        {
          action: {
            type: "text",
            label: "Техас",
            payload: '{"command":"арк техас"}'
          },
          color: "secondary"
        },
        {
          action: {
            type: "text",
            label: "Амия",
            payload: '{"command":"арк амия"}'
          },
          color: "secondary"
        },
        {
          action: {
            type: "text",
            label: "Сиджа",
            payload: '{"command":"арк сиджа"}'
          },
          color: "secondary"
        },
        {
          action: {
            type: "text",
            label: "Лапа",
            payload: '{"command":"арк лапа"}'
          },
          color: "secondary"
        }
      ],
      [
        {
          action: {
            type: "text",
            label: "Скади",
            payload: '{"command":"арк скади"}'
          },
          color: "secondary"
        },
        {
          action: {
            type: "text",
            label: "Эхуй",
            payload: '{"command":"арк эхуй"}'
          },
          color: "secondary"
        },
        {
          action: {
            type: "text",
            label: "Член",
            payload: '{"command":"арк член"}'
          },
          color: "secondary"
        },
        {
          action: {
            type: "text",
            label: "Метеорит",
            payload: '{"command":"арк метеорит"}'
          },
          color: "secondary"
        },
        {
          action: {
            type: "text",
            label: "Сария",
            payload: '{"command":"арк сария"}'
          },
          color: "secondary"
        }
      ]
    ],
    inline: true
  };
  const body = await axios.get("https://danbooru.donmai.us/posts.json", {
    params: {
      login: login,
      api_key: api_key,
      tags: waifu,
      limit: 1,
      random: true
    }
  });
  arkPictureUrl = body.data[0].large_file_url;
  vkMethods.uploadPhotoViaUrlAsync(
    msgInfoObject.peer_id,
    arkPictureUrl,
    photoInfo => {
      vkMethods.sendMessage(
        msgInfoObject.peer_id,
        `Ваша вайфу!`,
        "photo" +
          photoInfo.owner_id +
          "_" +
          photoInfo.id +
          "_" +
          photoInfo.access_key,
        keyboard
      );
    }
  );
}

async function sendAska(msgInfoObject) {
  const keyboard = {
    buttons: [
      [
        {
          action: {
            type: "text",
            label: "Асочку",
            payload: '{"command":"асочку"}'
          },
          color: "negative"
        }
      ]
    ],
    inline: true
  };
  const tags = ["souryuu_asuka_langley", "shikinami_asuka_langley"];
  const tag = tags[Math.round(Math.random())];
  const body = await axios.get("https://danbooru.donmai.us/posts.json", {
    params: {
      login: login,
      api_key: api_key,
      tags: tag + " ass",
      limit: 1,
      random: true
    }
  });
  PictureUrl = body.data[0].large_file_url;
  vkMethods.uploadPhotoViaUrlAsync(
    msgInfoObject.peer_id,
    PictureUrl,
    photoInfo => {
      vkMethods.sendMessage(
        msgInfoObject.peer_id,
        `Правильная асочка!`,
        "photo" +
          photoInfo.owner_id +
          "_" +
          photoInfo.id +
          "_" +
          photoInfo.access_key,
        keyboard
      );
    }
  );
}

async function someMore(msgInfoObject) {
  let artist;

  if (msgInfoObject.payload) {
    artist = JSON.parse(msgInfoObject.payload).artist;
  } else return;

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
  const keyboardMore = {
    buttons: [
      [
        {
          action: {
            type: "text",
            label: "Ещё",
            payload: { command: "ещё", artist: artist }
          },
          color: "positive"
        }
      ]
    ],
    inline: true
  };
  vkMethods.uploadPhotoViaUrlAsync(msgInfoObject.peer_id, picUrl, photoInfo => {
    vkMethods.sendMessage(
      msgInfoObject.peer_id,
      "ЕЩЁ!",
      "photo" +
        photoInfo.owner_id +
        "_" +
        photoInfo.id +
        "_" +
        photoInfo.access_key,
      keyboardMore
    );
  });
}

async function sendMaid(msgInfoObject) {
  let photo = await vkMethods.getPhoto("-78638180", "wall");

  vkMethods.sendMessage(
    msgInfoObject.peer_id,
    "Ваша мейдочка!",
    photo,
    keyboard
  );
}

async function sendGirl(msgInfoObject) {
  const sources = ["-29937425", "-11695248", "-132029645", "-52347284"];
  const level = Math.floor(Math.random() * 4);
  let photo = await vkMethods.getPhoto(sources[level], "wall");

  vkMethods.sendMessage(
    msgInfoObject.peer_id,
    "Ваша тяночка!",
    photo,
    keyboard
  );
}

async function betterPictureFind(msgInfoObject, picUrl) {
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
  const result = await axios.get("https://saucenao.com/search.php", {
    params: {
      output_type: 2,
      api_key: sauce_api_key,
      db: 999,
      numres: 5,
      url: picUrl
    }
  });
  let message = "Ваша мейдочка нашла это:\n";
  const picLinks = [];
  for (let item of result.data.results) {
    if (item.data.ext_urls != undefined) {
      message += item.data.ext_urls[0];
      picLinks.push(...item.data.ext_urls);
    }
    if (item.data.titleundefined) {
      message += " " + item.data.title;
    } else if (item.data.source) {
      message += " " + item.data.source;
    }
    message += " с похожестью " + item.header.similarity + "%\n";
  }

  const findArtistSendAnotherPic = async picLink => {
    const toLjson = l => {
      // если нет danbooru, то ничего не присылаем
      if (l.includes("danbooru") ? false : true) return null;
      let re = /\d+/;
      return `https://danbooru.donmai.us/posts/${l.match(re)}.json`;
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

  if (
    msgInfoObject.text.includes("еще") ||
    msgInfoObject.text.includes("ещё")
  ) {
    let notFound = true;
    for (let picLink of picLinks) {
      const anotherPic = await findArtistSendAnotherPic(picLink);
      if (anotherPic && anotherPic.url) {
        const keyboardMore = {
          buttons: [
            [
              {
                action: {
                  type: "open_link",
                  link:
                    "https://danbooru.donmai.us/posts?tags=" +
                    anotherPic.artist,
                  label: anotherPic.artist,
                  payload: ""
                }
              }
            ],
            [
              {
                action: {
                  type: "text",
                  label: "Ещё",
                  payload: { command: "ещё", artist: anotherPic.artist }
                },
                color: "positive"
              }
            ]
          ],
          inline: true
        };
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
                photoInfo.access_key,
              keyboardMore
            );
          }
        );
        notFound = false;
        break;
      }
    }
    if (notFound)
      vkMethods.sendMessage(msgInfoObject.peer_id, "Что-то ничего нет...");
  } else {
    vkMethods.sendMessage(msgInfoObject.peer_id, message);
  }
}

async function sendHelp(msgInfoObject) {
  const helpMessage = `Доброго здоровья, Хозяин, я умею следующее:
  \n1)<найди> - я пытаюсь найти соус аниме-картинки.
  \n2)<поищи> - тщательно ищу соус, косплей, додзю, мангу.
  \n3)<гача> - гранд-ролл в ФГО
  \n4)<техас> - отправляю картинку texas из arknights
  \n5)<найди еще> - если я найду автора картинки, то отправлю его случайную работу
  \n6)<еще> - если есть имя автора после <найди еще> или <еще> я повторю команду
  \n7)<мейдочку> - отправлю картинку милой мейды
  \n PS: Ваши картинки я беру из аттачей и реплаев`;
  vkMethods.sendMessage(msgInfoObject.peer_id, helpMessage);
}

module.exports = commandsList;
