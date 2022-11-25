let generateOTP = (number) => {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < number; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

let generateAZ = (number) => {
  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }
  let code = ''
  for (let i = 0; i < number; i++ ) {
      code += String.fromCharCode(getRandomArbitrary(65, 90))
  }
  return code;
}

module.exports = {
  generateOTP,
  generateAZ,
}