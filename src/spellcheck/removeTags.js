const {
    htmlTags
} = require('../tools/regexps');

const removeTags = (html) => {
    return html.replace(htmlTags, '');
}

module.exports = removeTags;