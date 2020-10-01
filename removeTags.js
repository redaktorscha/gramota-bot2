const {
    htmlTags
} = require('./regexps');

const removeTags = (html) => {
    return html.replace(htmlTags, '');
}

module.exports = removeTags;