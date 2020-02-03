const request = require("request");

function findAnime(picUrl) {
  url = "https://trace.moe/?url=";

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
      console.log(body);
      /*let regex = /<a href="(.*?)">/gm;
      var count = 0;
      let msg = "Я нашла это: ";
      for (let item of body.matchAll(regex)) {
        if (count++ == 2) break;
        msg += " https:" + item[1];
      }
      sendMessage.sendMessage(msgInfoObject.peer_id, msg);*/
    }
  );
}

/*findAnime(
  "https://sun9-32.userapi.com/c206528/v206528918/55e18/FxDhp3oDb30.jpg"
);*/
var url =
  "https://sun9-32.userapi.com/c206528/v206528918/55e18/FxDhp3oDb30.jpg";
request(
  {
    url: url,
    method: "GET"
  },
  function(error, response, body) {
    console.log(body);
    const formData = {
      custom_file: {
        value: Buffer.from(body),
        options: {
          name: "image",
          filename: "blob",
          contentType: "image/jpeg"
        }
      }
    };

    request.post(
      { url: "http://trace.moe/search", formData: formData },
      function optionalCallback(err, httpResponse, body) {
        if (err) {
          return console.error("upload failed:", err);
        }
        console.log(
          "Upload successful!  Server responded with:",
          httpResponse.toJSON()
        );
      }
    );
  }
);
