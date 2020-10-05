const log = (funcName, txt) => {
    fs.appendFileSync('./log', `${funcName}:${txt}\n`); //for console.log
}

module.exports = log;