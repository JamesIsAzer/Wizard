const { getAllVerifications } = require('../../dao/mongo/verification/queries');
const { findProfile } = require('../../dao/clash/verification')
const limiter = new Bottleneck({
    maxConcurrent: 40,
    minTime: 25
  });
  
const refreshProfiles = async() => {
    getAllVerifications().then(verification => {
        // get clash data for player tag
        // get current roles on discord
        // check if eligible for any more roles
    })
}