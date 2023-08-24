import RSA from 'react-native-rsa-native';
import * as Keychain from 'react-native-keychain';

const keychainOptions = {
  service: 'com.example.myapp',
};

async function generateAndStoreKeys() {
  const keys = await RSA.generateKeys(2048); // 2048 is the key size

  await Keychain.setGenericPassword(keys.public, keys.private, keychainOptions);

  return keys;
}

async function getPublicKey() {
  const credentials = await Keychain.getGenericPassword(keychainOptions);

  if (credentials) {
    console.log('Public key:', credentials.username);
    return credentials.username;
  } else {
    console.log('No keys stored');
    console.log('rest');
    return null;
  }
}

async function getPrivateKey() {
  const credentials = await Keychain.getGenericPassword(keychainOptions);

  if (credentials) {
    console.log('Private key:', credentials.password);
    return credentials.password;
  } else {
    console.log('No keys stored');
    return null;
  }
}

async function getVideoKey(videoId) {
  try {
    const keys = await generateAndStoreKeys();

    let formData = new FormData();
    formData.append('public_key', keys.public);
    formData.append('video_id', videoId);

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();

    console.log(data);
    console.log(keys.private);

    return data; // return the data
  } catch (error) {
    console.error('An error occurred:', error);
    throw error; // re-throw the error so it can be caught and handled by the calling code
  }
}

export {getVideoKey, generateAndStoreKeys, getPublicKey, getPrivateKey};

async function anotherFunction() {
  // await generateAndStoreKeys();
  //
  // // Do something else...
  //
  // const publicKey = await getPublicKey();
  // const privateKey = await getPrivateKey();
  // Use the keys...
}
