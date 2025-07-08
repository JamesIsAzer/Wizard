const axios = require('axios').default

const fetchProfileImage = async (tag) =>
  axios.get(`http://localhost:34827/render/profile/${tag}/stats`, {
    responseType: 'arraybuffer'
  }).then((res) => res.data)
    .catch((err) => err.response);

const fetchTroopsImage = async (tag) =>
  axios.get(`http://localhost:34827/render/profile/${tag}/troops`, {
    responseType: 'arraybuffer'
  }).then((res) => res.data)
    .catch((err) => err.response);

const fetchXpThumbnail = async (tag) =>
  axios.get(`http://localhost:34827/render/profile/${tag}/xp`, {
    responseType: 'arraybuffer'
  }).then((res) => res.data)
    .catch((err) => err.response);

module.exports = {
  fetchProfileImage,
  fetchTroopsImage,
  fetchXpThumbnail
}

