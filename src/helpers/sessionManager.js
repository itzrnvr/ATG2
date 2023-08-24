import EncryptedStorage from 'react-native-encrypted-storage';
/**
 * The key to use when referencing the example value
 */
 export const STORAGE_KEY = 'LINKS';
 export const Packages = "Packages";
 export   const keys = "keys";
 export   const TrailerVideoList = "TrailerVideoList";
 export   const PromoVideoList = "PromoVideoList";
 export   const FullVideoList = "FullVideoList";
 export  const KEY_MAC_ID = "mac_id";
 export const Buy_Now = "Buy_Now";
 export const Privacy_Policy = "Privacy_Policy";
 export const MM_Journey = "MM_Journey";
 export const help_support = "help_support";
 export const how_to_learn = "how_to_learn";
 export const faqs = "faqs";
 export const Assessment = "Assessment";
 export const SPATH = "spath";
 export const mac_id_exists = "mac_id_exists";

   /**
   * Saves a random number to the device storage
   * @param {Function} done The function to call when the operation completes
   */
   export  function setValue(key,value) {
    
        try {
           EncryptedStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
        } finally {
        }
      }
    
      /**
       * Retrieves the previously saved number from the device storage
       * @param {Function} done The function to call when the operation completes
       */
    export function getValue(key) {
        try {
          const savedNumber =  EncryptedStorage.getItem(key);
          console.log(savedNumber);
    
          if (savedNumber) {
           return savedNumber;  
        } else {
            return '';
          }
        } catch (error) {
          
        } finally {
          
        }
      }
    
      /**
       * Removes the previously saved number from the device storage
       * @param {Function} done The function to call when the operation completes
       */
      async function removeValue(done) {
        try {
          await EncryptedStorage.removeItem(STORAGE_KEY);
          Alert.alert(`The value with key ${STORAGE_KEY} was succesfully deleted`);
        } catch (error) {
          Alert.alert(
            `The value with key ${STORAGE_KEY} could not be deleted - ${error}`
          );
        } finally {
          done();
        }
      }
    
      /**
       * Completely clears all values from the device storage (only those accesible by the app)
       * @param {Function} done The function to call when the operation completes
       */
      async function clearValues(done) {
        try {
          await EncryptedStorage.clear();
          Alert.alert('The storage has been successfully cleared');
        } catch (error) {
          Alert.alert(`The storage could not be cleared - ${error}`);
        } finally {
          done();
        }
      }