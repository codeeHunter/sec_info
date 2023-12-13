const sizeOfBlock = 128;
const sizeOfChar = 16;
const shiftKey = 2;
const quantityOfRounds = 16;

let Blocks;

function StringToRightLength(input) {
  while ((input.length * sizeOfChar) % sizeOfBlock !== 0) input += "#";

  return input;
}

function CutStringIntoBlocks(input) {
  Blocks = new Array((input.length * sizeOfChar) / sizeOfBlock);

  const lengthOfBlock = input.length / Blocks.length;

  for (let i = 0; i < Blocks.length; i++) {
    Blocks[i] = input.substring(i * lengthOfBlock, (i + 1) * lengthOfBlock);
    Blocks[i] = StringToBinaryFormat(Blocks[i]);
  }
}

function StringToBinaryFormat(input) {
  let output = "";

  for (let i = 0; i < input.length; i++) {
    let char_binary = input[i].charCodeAt(0).toString(2);

    // Дополним биты слева до 16, если необходимо
    while (char_binary.length < 16) char_binary = "0" + char_binary;

    output += char_binary;
  }

  return output;
}

function CorrectKeyWord(input, lengthKey) {
  if (input.length > lengthKey) input = input.substring(0, lengthKey);
  else while (input.length < lengthKey) input = "0" + input;

  return input;
}

function XOR(s1, s2) {
  let result = "";

  for (let i = 0; i < s1.length; i++) {
    const a = parseInt(s1[i]);
    const b = parseInt(s2[i]);

    if (a ^ b) result += "1";
    else result += "0";
  }

  return result;
}

function f(s1, s2) {
  return XOR(s1, s2);
}

function EncodeDES_One_Round(input, key) {
  const L = input.substring(0, input.length / 2);
  const R = input.substring(input.length / 2, input.length);

  return R + XOR(L, f(R, key));
}

function DecodeDES_One_Round(input, key) {
  const L = input.substring(0, input.length / 2);
  const R = input.substring(input.length / 2, input.length);

  return XOR(f(L, key), R) + L;
}

function KeyToNextRound(key) {
  for (let i = 0; i < shiftKey; i++) {
    key = key[key.length - 1] + key;
    key = key.substring(0, key.length - 1);
  }

  return key;
}

function KeyToPrevRound(key) {
  for (let i = 0; i < shiftKey; i++) {
    key = key + key[0];
    key = key.substring(1);
  }

  return key;
}

function StringFromBinaryToNormalFormat(input) {
  let output = "";

  while (input.length > 0) {
    const char_binary = input.substring(0, sizeOfChar);
    input = input.substring(sizeOfChar);

    let a = 0;
    let degree = char_binary.length - 1;

    for (const c of char_binary) a += parseInt(c) * Math.pow(2, degree--);

    output += String.fromCharCode(a);
  }

  return output;
}

function EncryptText() {
  const inputText = document.getElementById("inputText").value;
  const key = "secretkey"; // You can change this key
  const adjustedString = StringToRightLength(inputText);
  CutStringIntoBlocks(adjustedString);
  const adjustedKey = CorrectKeyWord(
    key,
    adjustedString.length / (2 * Blocks.length)
  );
  let binaryKey = StringToBinaryFormat(adjustedKey);

  for (let j = 0; j < quantityOfRounds; j++) {
    for (let i = 0; i < Blocks.length; i++)
      Blocks[i] = EncodeDES_One_Round(Blocks[i], binaryKey);

    binaryKey = KeyToNextRound(binaryKey);
  }

  let result = "";

  for (let i = 0; i < Blocks.length; i++) result += Blocks[i];

  document.getElementById("outputText").value =
    StringFromBinaryToNormalFormat(result);
}

function DecodeDES_One_Round(input, key) {
  const L = input.substring(0, input.length / 2);
  const R = input.substring(input.length / 2, input.length);

  return XOR(f(L, key), R) + L;
}

function DecryptText() {
  const inputText = document.getElementById("inputText").value;
  const key = "secretkey"; // You can change this key
  const adjustedString = StringToRightLength(inputText);
  CutStringIntoBlocks(adjustedString);
  const adjustedKey = CorrectKeyWord(
    key,
    adjustedString.length / (2 * Blocks.length)
  );
  let binaryKey = StringToBinaryFormat(adjustedKey);

  // For decryption, we need to reverse the key schedule
  for (let j = 0; j < quantityOfRounds; j++) {
    binaryKey = KeyToPrevRound(binaryKey);
  }

  // Perform decryption using the reversed key schedule
  for (let j = 0; j < quantityOfRounds; j++) {
    for (let i = 0; i < Blocks.length; i++)
      Blocks[i] = DecodeDES_One_Round(Blocks[i], binaryKey);

    binaryKey = KeyToPrevRound(binaryKey);
  }

  let result = "";

  for (let i = 0; i < Blocks.length; i++) result += Blocks[i];

  document.getElementById("outputText").value =
    StringFromBinaryToNormalFormat(result);
}
