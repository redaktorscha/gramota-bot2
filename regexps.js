const regexps = {
    containsCyrillic: /\p{sc=Cyrillic}/u, //for fixing a bug at the dict page
    onlyAsteriks: /^\*+$/, //                  query consisting of asterisks only isn't valid
    latinNumbersSpecChars: /[a-z]|[A-Z]|[0-9]|[-!$%^&()_+|~=`{}\[\]:";'<>,.\/]/, //except asterisks and '?' cause you can use them in the query
    htmlTags: /<[^>]*>|<*>/g,
}

module.exports = regexps;