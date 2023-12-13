function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function power(a, b, n) {
  let tmp = a;
  let sum = tmp;
  for (let i = 1; i < b; i++) {
    for (let j = 1; j < a; j++) {
      sum += tmp;
      if (sum >= n) {
        sum -= n;
      }
    }
    tmp = sum;
  }
  return tmp;
}

function mul(a, b, n) {
  let sum = 0;
  for (let i = 0; i < b; i++) {
    sum += a;
    if (sum >= n) {
      sum -= n;
    }
  }
  return sum;
}

function encryptAndDecrypt() {
  let p = parseInt(document.getElementById("p").value);
  let g = parseInt(document.getElementById("g").value);
  let x = parseInt(document.getElementById("x").value);
  let inputText = document.getElementById("inputText").value;

  let txtBCrypt = "";
  let txtBDecrypt = "";

  let y = power(g, x, p);
  let publicKey = `Public Key (p, g, y): (${p}, ${g}, ${y})`;
  let secretKey = `Private Key x: ${x}`;

  if (inputText.length > 0) {
    for (let i = 0; i < inputText.length; i++) {
      let m = inputText.charCodeAt(i);
      if (m > 0) {
        let k = getRandomInt(p - 2) + 1;
        let a = power(g, k, p);
        let b = mul(power(y, k, p), m, p);
        txtBCrypt += `${a} ${b} `;
      }
    }
  }

  if (txtBCrypt.length > 0) {
    let strA = txtBCrypt.split(" ");
    if (strA.length > 0) {
      for (let i = 0; i < strA.length - 1; i += 2) {
        let ai = parseInt(strA[i]);
        let bi = parseInt(strA[i + 1]);
        if (!isNaN(ai) && !isNaN(bi)) {
          let deM = mul(bi, power(ai, p - 1 - x, p), p);
          txtBDecrypt += String.fromCharCode(deM);
        }
      }
    }
  }
  document.getElementById("encryptText").value = "";
  document.getElementById("encryptText").value = txtBCrypt;

  document.getElementById("decryptText").value = "";
  document.getElementById("decryptText").value = txtBDecrypt;

  console.log("Public Key:", publicKey);
  console.log("Private Key:", secretKey);
}
