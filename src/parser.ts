import botReplies from './bot/textResources.json';
import { regexps } from './utils/regexps';
import { readFileSync } from 'node:fs';
import path from 'path';

/**
 * arr of Russian letters that could have accent marks
 */
const ACCENTS = [
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

type AccentLetterType = (typeof ACCENTS)[number];

// const isInReadonlyArray = <T, A extends T>(
//   item: T,
//   array: ReadonlyArray<A>
// ): item is A => array.includes(item as A);

const isAccentedLetter = (letter: string): letter is AccentLetterType =>
  ACCENTS.includes(letter as AccentLetterType);

const removeTags = (html: string) => {
  const { htmlTags } = regexps;
  return html.replace(htmlTags, '');
};

/**
 * text that could be found at the dict page
 */
enum pageTargets {
  OpeningTagDiv = '<div style="padding-left:50px">',
  OpeningTagP = '<p style="padding-left:50px">',
  ClosingTagDiv = '</div>',
  ClosingTagP = '</p>',
  LineBreaks = '<br><br>',
  NotFound = 'искомое слово отсутствует',
  FoundSimilar = 'Похожие слова',
  HasAccents = '<span class="accent">',
}

const cutAnswerString = (
  htmlString: string,
  openTag: string,
  closingTag: string
) => {
  const tagLen = openTag.length;

  const leftSliceIndex = htmlString.indexOf(openTag);
  let resultString = htmlString.slice(leftSliceIndex);
  const rightSliceIndex = resultString.indexOf(closingTag);

  return resultString.slice(0, rightSliceIndex);
};

/**
 * cuts <br><br> that appears at the end of the string and inserts '/n' if the string contains more than one word
 */

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
  const isUpperCasedChar = (char: string) => char.toUpperCase() === char;

  return str
    .split(pageTargets.HasAccents)

    .map((el) => {
      if (isAccentedLetter(el[0])) {
        const letterWithAccent = isUpperCasedChar(el[0])
          ? `${el[0]}\u0341`
          : `${el[0]}\u0301`;
        el = `${letterWithAccent}${el.slice(1)}`;
      }
      return el;
    })
    .join('');
};

const parse = (html: string) => {
  if (
    !html.includes(pageTargets.OpeningTagDiv) &&
    !html.includes(pageTargets.OpeningTagP)
  ) {
    return botReplies.not_found;
  }

  const isNotExactMatch = html.includes(pageTargets.FoundSimilar);

  let answerString = isNotExactMatch
    ? cutAnswerString(html, pageTargets.OpeningTagP, pageTargets.ClosingTagP)
    : cutAnswerString(html, pageTargets.OpeningTagDiv, pageTargets.ClosingTagDiv);

  if (answerString.includes(pageTargets.LineBreaks)) {
    answerString = insertLineBreaks(answerString);
  }

  if (answerString.includes(pageTargets.HasAccents)) {
    return removeTags(insertAccents(answerString));
  } else {
    return removeTags(answerString);
  }

  // let leftSliceIndex = html.indexOf(pageTargets.OpeningTagDiv)
  // const targetIndex = convertedString.indexOf(substr);
  // const cutIndexLeft = targetIndex + substr.length;

  // let queryResult = convertedString.slice(cutIndexLeft);
  // const cutIndexRight = queryResult.indexOf(closingTag);
  // queryResult = queryResult.slice(0, cutIndexRight);
  // console.log('queryResult', queryResult);
  // return queryResult;
};

// export default parse;

const txt = readFileSync(path.join(__dirname, '..', 'gr-bts'), 'utf-8');

console.log(parse(txt));
