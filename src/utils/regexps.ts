export const regexps = {
    containsCyrillic: /\p{sc=Cyrillic}/u,
    onlyAsteriks: /^\*+$/,
    unsupportedHtmlTags: /<(?!\/?(b(?!r)|i|B|I)\b)[^>]*>/g,
    allowedChars: /[а-яё*?]+/ig,
}