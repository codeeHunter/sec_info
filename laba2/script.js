function gaenerEncrypt(text, key) {
  const keyBytes = unescape(encodeURIComponent(key));
  let result = "";

  for (let i = 0; i < text.length; i++) {
    let charCode = text.charCodeAt(i);
    let keyChar = keyBytes.charCodeAt(i % keyBytes.length);
    let encryptedCharCode = charCode ^ keyChar;
    result += String.fromCharCode(encryptedCharCode);
  }

  return btoa(result);
}

function gaenerDecrypt(encryptedText, key) {
  const keyBytes = unescape(encodeURIComponent(key));
  let result = "";

  encryptedText = atob(encryptedText);

  for (let i = 0; i < encryptedText.length; i++) {
    let charCode = encryptedText.charCodeAt(i);
    let keyChar = keyBytes.charCodeAt(i % keyBytes.length);
    let decryptedCharCode = charCode ^ keyChar;
    result += String.fromCharCode(decryptedCharCode);
  }

  return result;
}

function encrypt() {
  const key = document.getElementById("key").value;
  const plaintext = document.getElementById("plaintext");
  const ciphertext = gaenerEncrypt(plaintext.value, key);
  plaintext.value = "";
  document.getElementById("ciphertext").value = ciphertext;
}

function decrypt() {
  const key = document.getElementById("key").value;
  const ciphertext = document.getElementById("ciphertext");
  const decryptedText = gaenerDecrypt(ciphertext.value, key);
  ciphertext.value = "";
  document.getElementById("plaintext").value = decryptedText;
}
