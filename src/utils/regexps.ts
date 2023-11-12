export const regexps = {
    containsCyrillic: /\p{sc=Cyrillic}/u,
    onlyAsteriks: /^\*+$/,
    unsupportedHtmlTags: /<(?!<)(?!\/?(b(?!r)|i|B|I)\b)[^>]*>/g,
    htmlTags: /<[^>]*>/g,
    allowedChars: /[а-яё*?]+/ig,
    htmlEntities: /(<(b|i)>)?&.*;(<\/(b|i)>)?/g,
}