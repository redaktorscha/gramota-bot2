const doQuery = async (word) => {

    require('dotenv').config();

    const childProcess = require('child_process');
    const URL = `${process.env.GRAMOTA_URL}${word}`; //rename!
    const logError = require('./logError');


    return new Promise((resolve, reject) => {

        childProcess.exec(`curl ${URL} | iconv -f windows-1251 -t utf-8`, (error, stdout) => { //curl shell cmd
            //console.log(stdout.slice(0, 25));
            if (error) {
                console.log('exec error: ' + error);
                logError(error);
                reject(error);
            }
            // if (stderr) {
            //     console.log('stderr: ' + stderr); //что это такое и чем отл от error??
            // }

            resolve(stdout); //Почему нельзя просто  return stdout, а снаружи await?

        });
    });
}

module.exports = doQuery;



//import {dictLookUp} from './dictLookUp';


//const str = `<div style="padding-left:50px"><b>кор<span class="accent">о</span>ва</b>, -ы<br><br></div>`;
//`curl http://gramota.ru/slovari/dic/?word='корова' | iconv -f windows-1251 -t utf-8 > output`;