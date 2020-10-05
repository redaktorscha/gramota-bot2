const regexps = {
    containsCyrillic: /\p{sc=Cyrillic}/u, //for fixing a bug at the dict page
    onlyAsteriks: /^\*+$/,                  //query consisting of asterisks only isn't valid
    latinNumbersSpecChars: /[a-z]|[A-Z]|[0-9]|[-!$%^&()_+|~=`{}\[\]:";'<>,.\/]/,//latin chars, numbers and special chars, except asterisks and '?' cause you can use them in the query   
    htmlTags: /<[^>]*>|<*>/g, //for removing html tags
}

module.exports = regexps;