const regex = /(https?:\/\/[^\s]+)/g;

module.exports = text => {
    return text.match(regex);
};
