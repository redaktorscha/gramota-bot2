const cutString = (str, closingTag) => {
    const substr = 'style="padding-left:50px">';
    const cutIndexLeft = str.indexOf(substr) + substr.length;

    str = str.slice(cutIndexLeft);

    const cutIndexRight = str.indexOf(closingTag);
    
    return str.slice(0, cutIndexRight);
}

module.exports = cutString;