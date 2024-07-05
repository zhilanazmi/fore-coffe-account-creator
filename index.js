const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const readlineSync = require('readline-sync');
const path = require('path');
const fs = require('fs');


const accountsFilePath = path.join(__dirname, 'akun.txt');
const referral = "33A239"; // hargain yang punya code, gausah diganti mek -zhilan
const pin = "999999"


const headers = {
  'host': 'api.fore.coffee',
  'appsflyer-id': '1719494147608-8821142',
  'content-type': 'application/json',
  'accept': '*/*',
  'appsflyer-advertising-id': '00000000-0000-0000-0000-000000000000',
  'app-version': '4.1.17',
  'accept-language': 'en-ID;q=1.0, id-ID;q=0.9',
  'accept-encoding': 'gzip;q=1.0, compress;q=0.5',
  'platform': 'ios',
  'user-agent': 'Fore Coffee/4.1.17 (coffee.fore.fore; build:1168; iOS 17.5.1) Alamofire/4.9.1',
  'os-version': '17.5.1',
  'secret-key': '0kFe6Oc3R1eEa2CpO2FeFdzElp'
};

const getToken = async () => {
  try {
    const response = await axios.get('https://api.fore.coffee/auth/get-token', {
      headers: {
        ...headers,
        'device-id': uuidv4()
      }
    });
    return response.data.payload.access_token;
  } catch (error) {
    console.error('Error getting token:', error);
    process.exit(1);
  }
};

const checkPhoneNumber = async (accessToken, phoneNumber) => {
  try {
    const response = await axios.post('https://api.fore.coffee/auth/check-phone', {
      phone: phoneNumber
    }, {
      headers: {
        ...headers,
        'device-id': uuidv4(),
        'access-token': accessToken,
        'country-id': '1',
        'language': 'ID',
        'timezone': '+07:00'
      }
    });
    return response.data.payload.is_registered;
  } catch (error) {
    console.error('Error checking phone number:', error);
    process.exit(1);
  }
};

const requestOTP = async (accessToken, phoneNumber) => {
  try {
    const response = await axios.post('https://api.fore.coffee/auth/req-login-code', {
      phone: phoneNumber,
      method: ""
    }, {
      headers: {
        ...headers,
        'device-id': uuidv4(),
        'access-token': accessToken,
        'country-id': '1',
        'language': 'ID',
        'timezone': '+07:00'
      }
    });
    console.log(response.data.payload.text);
  } catch (error) {
    console.error('Error requesting OTP:', error);
    process.exit(1);
  }
};

const signUp = async (accessToken, phoneNumber, otp, name, referral) => {
  try {
    const response = await axios.post('https://api.fore.coffee/auth/sign-up', {
      referral_code: referral,
      phone: phoneNumber,
      whatsapp: 0,
      name: name,
      code: otp
    }, {
      headers: {
        ...headers,
        'device-id': uuidv4(),
        'access-token': accessToken,
        'timezone': '+07:00'
      }
    });
    console.log('Signup :', response.data.payload.text);
  } catch (error) {
    console.error('Error signing up:', error);
    process.exit(1);
  }
};

const setPin = async (accessToken, pin) => {
  try {
    const response = await axios.post('https://api.fore.coffee/auth/pin', {
      pin: pin,
      confirm_pin: pin
    }, {
      headers: {
        ...headers,
        'device-id': uuidv4(),
        'access-token': accessToken,
        'timezone': '+07:00'
      }
    });
    console.log('Set PIN :', response.data.payload.text);
  } catch (error) {
    console.error('Error signing up:', error);
    process.exit(1);
  }
};

const main = async () => {
  const accessToken = await getToken();
  console.log('Fore Account Creator created by Zhillan Azmi')
  const phoneNumber = readlineSync.question('Enter phone number: ');

  const isRegistered = await checkPhoneNumber(accessToken, phoneNumber);

  if (isRegistered === 1) {
    console.log('Phone number is already registered.');
    return;
  }

  await requestOTP(accessToken, phoneNumber);

  const otp = readlineSync.question('Enter OTP: ');
  const name = 'ZHILAN'


  await signUp(accessToken, phoneNumber, otp, name, referral);
  await setPin(accessToken, pin);
  const accountInfo = `${phoneNumber}|${pin}\n`;
  fs.appendFileSync(accountsFilePath, accountInfo, 'utf-8');

};

main();