const {clashHeader} = require('../../utils/headers')
const axios = require('axios').default;
const {parseClashStatus} = require('../../utils/statusLogger')

const responseObject = (response, fallback) => ({
  response: response,
  error: fallback
})

const verifyProfileRequest = async ({ id, token }) => {
    return axios.post(
      `https://api.clashofclans.com/v1/players/%23${id.toUpperCase()}/verifytoken`, 
      { token: token },
      clashHeader
    ).then((response) => response )
    .catch((error) => error.response )
};

const verifyProfile = async( id, token ) => {
  const response = await verifyProfileRequest({id, token})
  if (response.status === 200) return responseObject(response.data, null)
  return responseObject(null, parseClashStatus(clashStatus))
}

module.exports = {
  verifyProfile
}

