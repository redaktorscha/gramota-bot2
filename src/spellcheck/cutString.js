const cutString = (str, closingTag) => {
    const substr = 'style="padding-left:50px">';
    const targetIndex = str.indexOf('style="padding-left:50px">');

    if (~targetIndex) {
        const cutIndexLeft = targetIndex + substr.length;

        str = str.slice(cutIndexLeft);

        const cutIndexRight = str.indexOf(closingTag);

        return str.slice(0, cutIndexRight);
    }

    return null;
}

module.exports = cutString;