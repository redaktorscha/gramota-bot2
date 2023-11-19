import botReplies from './textResources.json';
import { regexps } from './utils/regexps';
// import { readFileSync } from 'node:fs';

// import path from 'path';
type PipeFunctionType = (str: string) => string;

const pipe = (arr: PipeFunctionType[], word: string) =>
  arr.reduce((acc, cur) => cur(acc), word);

// const ACUTEACCENTLETTERS = {
//   'а': 'а́',
//   'е': 'е́',
//   'и': 'и́',
//   'о': 'о́',
//   'у': 'у́',
//   'ы': 'ы́',
//   'э': 'э́',
//   'ю': 'ю́',
//   'я': 'я́',
//   'А': 'А́',
//   'Е': 'Е́',
//   'И': 'И́',
//   'О': 'О́',
//   'У': 'У́',
//   'Ы': 'Ы́',
//   'Э': 'Э́',
//   'Ю': 'Ю́',
//   'Я': 'Я́',
// } as const;

const ACCENT_SYMBOL = '\u0301';

// const MAYBEACCENTCHARS = Object.keys(ACUTEACCENTLETTERS);

const MAYBEACCENTCHARS = [
  'а',
  'е',
  'и',
  'о',
  'у',
  'ы',
  'э',
  'ю',
  'я',
  'А',
  'Е',
  'И',
  'О',
  'У',
  'Ы',
  'Э',
  'Ю',
  'Я',
] as const;

type AccentCharType = (typeof MAYBEACCENTCHARS)[number];

const isAccentedLetter = (letter: string): letter is AccentCharType =>
  MAYBEACCENTCHARS.includes(letter as AccentCharType);

const removeUnsupportedTags = (html: string) => {
  const { unsupportedHtmlTags } = regexps;
  return html.replace(unsupportedHtmlTags, '');
};

enum pageTargets {
  OpeningTagDiv = '<div style="padding-left:50px">',
  OpeningTagP = '<p style="padding-left:50px">',
  ClosingTagDiv = '</div>',
  ClosingTagP = '</p>',
  LineBreaks = '<br><br>',
  NotFound = 'искомое слово отсутствует',
  FoundSimilar = 'Похожие слова',
  AccentClass = '<span class="accent">',
  SupTag = '<sup>',
  specialEntity = '&',
}

const Sups = [
  '\u2070',
  '\u00B9',
  '\u00B2',
  '\u00B3',
  '\u2074',
  '\u2075',
  '\u2076',
  '\u2077',
  '\u2078',
  '\u2079',
] as const;

const handleSups = (str: string) => {
  if (!str.includes(pageTargets.SupTag)) {
    return str;
  }
  const isSupIndex = (s: string) => Number(s) < Sups.length && Number(s) >= 0;

  return str
    .split(pageTargets.SupTag)

    .map((el) => {
      if (isSupIndex(el[0])) {
        return `${Sups[Number(el[0])]}${el.slice(1)}`;
      }
      return el;
    })
    .join('');
};

const validateMarkup = (tags: string[]) => {
  const wrongIndices: number[] = [];

  let bCounter = 0;
  let iCounter = 0;

  for (let i = 0; i < tags.length; i += 1) {
    const tag = tags[i];
    if (tag === '</b>') {
      bCounter -= 1;

      if (bCounter < 0) {
        wrongIndices.push(i);
        bCounter = 0;
      }
    }

    if (tag === '</i>') {
      iCounter -= 1;
      if (iCounter < 0) {
        wrongIndices.push(i);
        iCounter = 0;
      }
    }

    if (tag === '<b>') {
      bCounter += 1;

      if (bCounter === 2) {
        wrongIndices.push(i);
        bCounter = 1;
      }
    }

    if (tag === '<i>') {
      iCounter += 1;

      if (iCounter === 2) {
        wrongIndices.push(i);
        iCounter = 1;
      }
    }
  }
  return wrongIndices;
};

const fixIncorrectMarkup = (s: string) => {
  let str = s;
  str = str.replace('<<', '<');

  const tagsColl = str.match(regexps.htmlTags);

  if (!tagsColl) {
    return str;
  }

  const wrongIndices = validateMarkup(tagsColl);
  if (wrongIndices.length === 0) {
    return str;
  }

  const newStr: string[] = [];

  let i = 1;
  let j = 1;
  let prevI = 0;
  let targetIndex = 0;

  while (i < str.length && targetIndex < wrongIndices.length) {
    i = str.indexOf(tagsColl[j], i);
    const currentTag = tagsColl[j];
    const pos = wrongIndices[targetIndex];
    if (j === pos) {
      newStr.push(str.slice(prevI, i));
      prevI = i + currentTag.length;
      targetIndex += 1;
    }

    j += 1;
    i += currentTag.length;
  }
  newStr.push(str.slice(prevI));
  console.log(newStr.join(''));
  return newStr.join('');
};

// const handleSpecialChars = (s: string) => {
//   let str = s;
//   let i = str.indexOf(pageTargets.specialEntity);

//   while (i !== -1) {
//     let j = i;

//     while (str[j] !== ';') {
//       j += 1;
//     }
//     str = `${str.slice(0, i)}${str.slice(j + 1)}`;
//     i = str.indexOf(pageTargets.specialEntity);
//   }

//   return str;
// };

const handleHTML = (s: string) => {
  const clearedString = removeUnsupportedTags(s);
  // const withoutEntities = handleSpecialChars(clearedString);
  return fixIncorrectMarkup(clearedString);
};

const cutAnswerString =
  (openTag: string, closingTag: string) => (htmlString: string) => {
    const tagLen = openTag.length;
    const leftSliceIndex = htmlString.indexOf(openTag) + tagLen;
    let resultString = htmlString.slice(leftSliceIndex);
    const rightSliceIndex = resultString.indexOf(closingTag);
    return resultString.slice(0, rightSliceIndex);
  };

const insertLineBreaks = (str: string) => {
  const hasLineBreaksAtTheEnd = (s: string) =>
    s.indexOf(pageTargets.LineBreaks) ===
    s.length - pageTargets.LineBreaks.length;

  let string = str;
  const lineBreaksEndIndex = pageTargets.LineBreaks.length * -1;

  if (hasLineBreaksAtTheEnd(str)) {
    string = string.slice(0, lineBreaksEndIndex);
  }

  if (string.includes(pageTargets.LineBreaks)) {
    string = string.split(pageTargets.LineBreaks).join('\n');
  }

  return string;
};

const insertAccents = (str: string) => {
  if (!str.includes(pageTargets.AccentClass)) {
    return str;
  }
  return str
    .split(pageTargets.AccentClass)

    .map((el) => {
      if (isAccentedLetter(el[0])) {
        // return `${ACUTEACCENTLETTERS[el[0]]}${el.slice(1)}`;
        return `${el[0]}${ACCENT_SYMBOL}${el.slice(1)}`;
      }
      return el;
    })
    .join('');
};

const parse = (html: string) => {
  if (
    html.includes(pageTargets.NotFound) &&
    !html.includes(pageTargets.FoundSimilar)
  ) {
    return botReplies.not_found;
  }

  const isNotExactMatch = html.includes(pageTargets.FoundSimilar);

  // let answerString = isNotExactMatch
  //   ? cutAnswerString(html, pageTargets.OpeningTagP, pageTargets.ClosingTagP)
  //   : cutAnswerString(
  //       html,
  //       pageTargets.OpeningTagDiv,
  //       pageTargets.ClosingTagDiv
  //     );

  // answerString = insertLineBreaks(answerString);

  // if (answerString.includes(pageTargets.SupTag)) {
  //   answerString = handleSups(answerString);
  // }

  // if (answerString.includes(pageTargets.AccentClass)) {
  //   answerString = insertAccents(answerString);
  // }

  // if (isNotExactMatch) {
  //   return `${botReplies.found_similar}${handleHTML(answerString)}`;
  // }
  // return handleHTML(answerString);

  if (isNotExactMatch) {
    const answerString = pipe(
      [cutAnswerString(pageTargets.OpeningTagP, pageTargets.ClosingTagP), insertLineBreaks, handleSups, insertAccents, handleHTML],
      html
    );
    return `${botReplies.found_similar}${answerString}`;
  }
  return pipe(
    [cutAnswerString(pageTargets.OpeningTagDiv, pageTargets.ClosingTagDiv), insertLineBreaks, handleSups, insertAccents, handleHTML],
    html
  );
};

export default parse;

// const txt = readFileSync(path.join(__dirname, '..', 'gr-zar'), 'utf-8');

// console.log(parse(txt));
