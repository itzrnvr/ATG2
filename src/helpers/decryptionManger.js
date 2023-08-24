import CryptoJS from 'crypto-js';


function decryptionManger(encryptedUrl) {
   
  // Encrypted video URL and decryption key
// const encryptedUrl = encryptFile;
const decryptionKey = 'TheBestSecretKey';

// // Convert decryption key and encrypted URL to CryptoJS format
// const key = CryptoJS.enc.Utf8.parse(decryptionKey);
// const encryptedData = CryptoJS.enc.Hex.parse(encryptedUrl);

// // Decrypt the video URL
// const decryptedUrl = CryptoJS.AES.decrypt(encryptedData, key);
// // .toString(CryptoJS.enc.Utf8);

try {
    const key = CryptoJS.enc.Utf8.parse(decryptionKey);
    const encryptedData = CryptoJS.enc.Hex.parse(encryptedUrl);
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, key);
    const decryptedUrl = decryptedData.toString(CryptoJS.enc.Utf8);
    console.log('Decrypted URL:', decryptedUrl);
    return decryptedUrl;
  } catch (error) {
    console.error('Error decrypting video URL:', error);
  }


return '';
    
}

export default decryptionManger