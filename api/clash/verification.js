const {clashHeader} = require('../../utils/headers')
const axios = require('axios').default
const {parseClashStatus} = require('../../utils/statusLogger')

const responseObject = (response, fallback) => ({
  response: response,
  error: fallback
})

const verifyProfileRequest = async ({ tag, token }) => 
    axios.post(
      `https://api.clashofclans.com/v1/players/%23${tag.toUpperCase()}/verifytoken`, 
      { token: token },
      clashHeader
    ).then((response) => response )
    .catch((error) => error.response )


const verifyProfile = async( tag, token ) => {
  const response = await verifyProfileRequest({tag, token})
  if (response.status === 200) return responseObject(response.data, null)
  return responseObject(null, parseClashStatus(response.status))
}

const findProfileRequest = async ({ tag }) => 
  axios.get(
    `https://api.clashofclans.com/v1/players/%23${tag.toUpperCase()}`, 
    clashHeader
  ).then((response) => response )
  .catch((error) => error.response )

const findProfile = async( tag ) => {
const response = await findProfileRequest({ tag })
if (response.status === 200) return responseObject ({found: true, data: response.data}, null)
if (response.status === 404) return responseObject ({found: false}, null)
return responseObject(null, parseClashStatus(response.status))
}

module.exports = {
  verifyProfile,
  findProfile
}

