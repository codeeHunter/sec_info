const cypher = {
  a: "c",
  b: "d",
  c: "e",
  d: "f",
  e: "g",
  f: "h",
  g: "i",
  h: "j",
  i: "k",
  j: "l",
  k: "m",
  l: "n",
  m: "o",
  n: "p",
  o: "q",
  p: "r",
  q: "s",
  r: "t",
  s: "u",
  t: "v",
  u: "w",
  v: "x",
  w: "y",
  x: "z",
  y: "a",
  z: "b",
};

const cypherProc = {
  a: 8.167,
  b: 1.492,
  c: 2.782,
  d: 4.253,
  e: 12.702,
  f: 2.228,
  g: 2.015,
  h: 6.094,
  i: 6.966,
  j: 0.153,
  k: 0.772,
  l: 4.025,
  m: 2.406,
  n: 6.749,
  o: 7.507,
  p: 1.929,
  q: 0.095,
  r: 5.987,
  s: 6.327,
  t: 9.056,
  u: 2.758,
  v: 0.978,
  w: 2.361,
  x: 0.15,
  y: 1.974,
  z: 0.074,
};

const calculateMSE = (textCounts, cypher) => {
  let mse = 0;
  const keys = Object.keys(textCounts);

  for (const key of keys) {
    if (cypher.hasOwnProperty(key)) {
      const diff = textCounts[key] - cypher[key];
      mse += Math.pow(diff, 2);
    }
  }

  if (keys.length === 0) {
    return NaN; // Handle the case when there are no valid keys in textCounts
  }

  mse /= keys.length;
  return mse;
};

const getCypher = () => {
  let word = document
    .getElementById("word")
    .value.replace(/[ /^\d+$/,.:]/g, "");

  const displayError = document.querySelector(".word__error");
  const displaySpan = document.querySelector(".cypher");

  let answer = "";

  const numberPattern = /^\d+$/;

  if (!numberPattern.test(word)) {
    displayError.style.display = "none";
  } else {
    displayError.style.display = "block";
    return;
  }

  for (let i = 0; i < word.length; i++) {
    let lowLetter = word[i].toLowerCase();
    console.log(lowLetter);
    answer += cypher[lowLetter];
  }

  displaySpan.textContent = answer;
};

const getDecrypt = () => {
  const displaySpan = document.querySelector(".cypher").textContent;
  const displayDecrypt = document.querySelector(".decrypt");
  let decryptedText = "";

  const reverseCypher = {};
  for (const key in cypher) {
    if (cypher.hasOwnProperty(key)) {
      reverseCypher[cypher[key]] = key;
    }
  }

  for (let i = 0; i < displaySpan.length; i++) {
    const encryptedChar = displaySpan[i];
    const decryptedChar = reverseCypher[encryptedChar] || encryptedChar;
    decryptedText += decryptedChar;
  }

  displayDecrypt.textContent = decryptedText;
};

const performFrequencyAnalysis = (encryptedText) => {
  let bestShift = 0;
  let lowestMSE = Infinity;

  for (let shift = 0; shift < 26; shift++) {
    const decryptedText = decryptCaesarCipher(encryptedText, shift);
    const textCounts = {};

    for (let i = 0; i < decryptedText.length; i++) {
      let letter = decryptedText[i];
      if (cypherProc[letter]) {
        if (!textCounts[letter]) {
          textCounts[letter] = 0;
        }
        textCounts[letter]++;
      }
    }

    const mse = calculateMSE(textCounts, cypherProc);

    if (mse < lowestMSE) {
      lowestMSE = mse;
      bestShift = shift;
    }
  }

  return bestShift;
};

const decryptCaesarCipher = (encryptedText, shift) => {
  let decryptedText = "";

  for (let i = 0; i < encryptedText.length; i++) {
    let letter = encryptedText[i];
    if (cypherProc[letter]) {
      let decryptedCharCode = letter.charCodeAt(0) - shift;
      if (letter >= "A" && letter <= "Z") {
        if (decryptedCharCode < "A".charCodeAt(0)) {
          decryptedCharCode += 26;
        }
      } else if (letter >= "a" && letter <= "z") {
        if (decryptedCharCode < "a".charCodeAt(0)) {
          decryptedCharCode += 26;
        }
      }
      decryptedText += String.fromCharCode(decryptedCharCode);
    } else {
      decryptedText += letter;
    }
  }

  return decryptedText;
};

const hacker = () => {
  const displayDecrypt = document
    .querySelector(".cypher")
    .textContent.toLowerCase();

  const textCounts = {};

  for (let i = 0; i < displayDecrypt.length; i++) {
    const letter = displayDecrypt[i];
    if (cypher.hasOwnProperty(letter)) {
      if (!textCounts.hasOwnProperty(letter)) {
        textCounts[letter] = 0;
      }
      textCounts[letter] += 1;
    }
  }

  const mse = calculateMSE(textCounts, cypherProc);

  if (!isNaN(mse)) {
    console.log("Mean Squared Error:", mse);

    // Найти сдвиг и дешифрированный текст
    const shift = performFrequencyAnalysis(displayDecrypt);
    const decryptedText = decryptCaesarCipher(displayDecrypt, shift);

    // Вывести результат в .hack
    const displayHack = document.querySelector(".hack");
    displayHack.textContent =
      "Found Shift: " + shift + "\nDecrypted Text: " + decryptedText;
  } else {
    console.log("Error: Unable to calculate MSE.");
  }
};
