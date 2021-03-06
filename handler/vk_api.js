const axios = require("axios");
const FormData = require("form-data");
const baseUrl = "https://api.vk.com/method/";
require("dotenv").config({ path: "../.env" });
const TOKEN = process.env.TOKEN;
const SERVICE_TOKEN = process.env.SERVICE_TOKEN;
const v = "5.103";

async function sendMessage(peer_id, message, attachment, keyboard = {}) {
  let url = baseUrl + "messages.send";
  const body = axios.get(url, {
    params: {
      peer_id: peer_id,
      message: message,
      attachment: attachment,
      random_id: Math.random(),
      access_token: TOKEN,
      keyboard: keyboard,
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
  const generateOffset = () => {
    const level = Math.floor(Math.random() * 3) + 1;
    const offset = 3266;
    return Math.floor(Math.random() * offset * level) + 1;
  };
  let offset = generateOffset();
  let url = baseUrl + "photos.get";
  const body = await axios.get(url, {
    params: {
      owner_id: owner_id,
      offset: offset,
      album_id: album_id,
      random_id: Math.random(),
      count: 1,
      access_token: SERVICE_TOKEN,
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
