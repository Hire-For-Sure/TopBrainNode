const urlRegex = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;

const urlValidator = link => {
    if (!urlRegex.test(url)) { 
        return false;
    }
    return true;
}

module.exports = {
    urlValidator
}