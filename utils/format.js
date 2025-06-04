const prettyNumbers = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

module.exports = {
    prettyNumbers
} 
