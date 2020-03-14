const axios = require("axios");
const FormData = require("form-data");
const baseUrl = "https://api.vk.com/method/";
require("dotenv").config({ path: "../.env" });
const TOKEN = process.env.TOKEN;
const v = "5.103";

async function sendMessage(peer_id, message, attachment) {
  let url = baseUrl + "messages.send";
  const body = axios.get(url, {
    params: {
      peer_id: peer_id,
      message: message,
      attachment: attachment,
      random_id: Math.random(),
      access_token: TOKEN,
      v: v
    }
  });
}

async function uploadPhotoViaUrlAsync(peer_id, photoUrl, callback) {
  let url = baseUrl + "photos.getMessagesUploadServer";
  let photoInfo;
  let uploadServerURI = await axios.get(url, {
    params: {
      peer_id: peer_id,
      access_token: TOKEN,
      v: v
    }
  });

  uploadServerURI = uploadServerURI.data.response.upload_url;
  let photoBuffer = await axios.get(photoUrl, {
    responseType: "arraybuffer"
  });

  const form = new FormData();
  form.append("photo", photoBuffer.data, "image.jpg");

  let uploadedPhotoPayload = await axios.post(uploadServerURI, form, {
    headers: form.getHeaders()
  });

  console.log(uploadedPhotoPayload.data);
  let saveMessagesPhoto = await axios.get(
    baseUrl + "photos.saveMessagesPhoto",
    {
      params: {
        photo: uploadedPhotoPayload.data.photo,
        server: uploadedPhotoPayload.data.server,
        hash: uploadedPhotoPayload.data.hash,
        access_token: TOKEN,
        v: v
      }
    }
  );

  photoInfo = saveMessagesPhoto.data.response[0];
  callback(photoInfo);
}

async function getPhoto(owner_id, album_id) {
  let offset = Math.floor(Math.random() * 9899);
  let url = baseUrl + "photos.get";
  const body = await axios.get(url, {
    params: {
      owner_id: owner_id,
      offset: offset,
      album_id: album_id,
      random_id: Math.random(),
      count: 1,
      access_token:
        "e638637de638637de638637d65e667c14dee638e638637dbc2b0bc46541aa33ce5752d5", //сервисный, потом вынести в .env
      v: v
    }
  });
  let photo = body.data.response.items[0];
  photo = "photo" + photo.owner_id + "_" + photo.id;
  return photo;
}

module.exports = {
  sendMessage: sendMessage,
  uploadPhotoViaUrlAsync: uploadPhotoViaUrlAsync,
  getPhoto: getPhoto
};
