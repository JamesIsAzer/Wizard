const {Promise} = require('bluebird');

const promiseAllProps = (arrayOfObjects) => 
    Promise.map(arrayOfObjects, (obj) => Promise.props(obj));

module.exports = {
    promiseAllProps
};