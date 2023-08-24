import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  FlatList,
  Button,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
// import { requestMultiple, requestPermission, PERMISSION_TYPE, checkPermission, PLATFORM_ACCESS_WIFI_STATE_PERMISSION } from '../components/AppPermission'
import {getUniqueId} from 'react-native-device-info';
import {getSerailKeyList, getSerailKeyStatus} from '../utilities/constant';
import {useQuery, useMutation} from 'react-query';
import axios from 'axios';
import {mac_id_exists, setValue, getValue} from '../helpers/sessionManager';
import {Snackbar} from 'react-native-paper';

const SerialKeyScreen = ({navigation}) => {
  const [visible, setVisible] = useState(true);
  const onDismissSnackBar = () => setVisible(false);
  const [postResult, setPostResult] = useState(null);
  const [data, setData] = useState([]);

  const [macId, setMacId] = useState('');
  const [serialKey, setSerialKey] = useState('');

  getUniqueId().then(mac => {
    setMacId(mac);
    setValue(mac_id_exists, mac);
  });

  const SerailKeyList = async () => {
    try {
      const response = await axios({
        method: 'POST',
        url: getSerailKeyList,
        params: {
          mac_id: macId,
        },
      });
      const json = await response;
      setData(json.data.serial_list);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  useEffect(() => {
    SerailKeyList();
  }, [macId]);

  //   const useSerialKey = async ({ queryKey }) => {
  //     const [_, mac_id] = 'aabbccdd'
  //     const { data } = await axios({
  //         method: 'post',
  //         url: getSerailKeyList,
  //         params: {
  //           mac_id: 'aabbccdd'
  //       }
  //     })
  //     return data
  // }
  //   const { data: list} = useQuery(['getSerailKeyList', macId], useSerialKey)

  const {isLoading: isPostingKey, mutate: postData} = useMutation(
    async () => {
      return await axios({
        method: 'post',
        url: getSerailKeyStatus,
        params: {
          serial_key: serialKey,
          mac_id: getValue(mac_id_exists),
        },
      });
    },
    {
      onSuccess: res => {
        if (res.data.response !== 400) {
          setPostResult(res.data.message);
          console.log(res.data.message);
        } else {
          setPostResult(res.data.message);
          console.log(res.data.message);
        }
      },
      onError: err => {
        setPostResult(err.response?.data || err);
      },
    },
  );

  const onGoBack = () => {
    navigation.goBack();
  };

  const onChangeText = text => {
    let formattedText = text.split('-').join('');
    if (formattedText.length > 0) {
      formattedText = formattedText.match(new RegExp('.{1,4}', 'g')).join('-');
    }

    setSerialKey(formattedText);
  };
  const onSubmit = () => {
    if (serialKey.length == 0) {
      setPostResult('Enter Serial Key');
      return;
    }
    postData();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image source={require('../assets/top_back_img.png')} />
        <View style={styles.main_view}>
          <TouchableOpacity style={styles.view_back_image} onPress={onGoBack}>
            <Image
              style={styles.image_two}
              source={require('../assets/back_arrow.png')}
            />
          </TouchableOpacity>
          <Text style={styles.name_text}>Serial Key</Text>
        </View>
      </View>
      <View style={styles.second_view}>
        <Text style={styles.text_enter_key}>Enter Serial Key</Text>
        <View
          style={{
            borderColor: 'black',
            borderWidth: 1,
            borderRadius: 15,
            marginTop: 10,
            padding: 5,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TextInput
            value={serialKey}
            maxLength={19}
            placeholder="CP8S-WI61-7CHJ-LXMP"
            style={styles.input}
            onChangeText={text => onChangeText(text)}
          />
          <Button
            color="#FF9411"
            style={{flex: 1}}
            title="Verify Key"
            onPress={onSubmit}
          />
        </View>

        <View style={{margin: 10, flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.blue_input}>Where is my 16 letter code?</Text>
          <Text style={styles.blck_input}>Key Type - Student Trial</Text>
        </View>
        <View style={{marginTop: 10, flexDirection: 'column'}}>
          <Text style={styles.key_details}>Key Details</Text>

          {data && (
            <FlatList
              data={data}
              renderItem={({item}) => (
                <View
                  style={{
                    margin: 15,
                    padding: 10,
                    elevation: 2,
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    alignItems: 'center',
                    shadowColor: '#254996',
                    borderRadius: 15,
                  }}>
                  <View style={{flex: 8}}>
                    <Text style={styles.GridViewTextLayout}>
                      {item.serial_key}
                    </Text>
                    <Text style={styles.GridViewDesc}>
                      {' '}
                      {item.serial_key_status}{' '}
                    </Text>
                  </View>
                  <Image source={require('../assets/tick_key.png')} />
                </View>
              )}
              numColumns={1}
            />
          )}
        </View>

        <View
          style={{
            borderRadius: 15,
            padding: 8,
            marginLeft: 30,
            marginRight: 30,
            marginBottom: 30,
          }}>
          <Button
            color="#FF9411"
            title="Buy New Serial Key"
            onPress={() => navigation.navigate('BuySerialKey')}
          />
        </View>
      </View>

      {postResult && (
        <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          action={{
            label: 'Dismiss',
            onPress: () => {},
          }}>
          {postResult}
        </Snackbar>
      )}
    </SafeAreaView>
  );
};

export default SerialKeyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  main_view: {
    alignItems: 'center',
    flex: 1,
    position: 'absolute',
    marginTop: 40,
    marginLeft: 18,
    marginRight: 18,
    flexDirection: 'row',
    height: 56,
  },

  view_back_image: {
    marginRight: 18,
    backgroundColor: '#EBEEFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
  },
  name_text: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },

  second_view: {
    backgroundColor: 'white',
    margin: 18,
    height: '100%',
  },

  text_enter_key: {
    color: 'black',
  },
  input: {
    color: 'black',
    flex: 5,
  },
  blue_input: {
    color: '#4A2AD2',
    flex: 8,
    fontSize: 11,
  },
  blck_input: {
    color: '#000000',
    flex: 5,
    fontSize: 11,
  },
  key_details: {
    color: '#000000',
    fontSize: 18,
  },
  GridViewTextLayout: {
    fontSize: 16,
    justifyContent: 'center',
    color: '#121212',
    marginLeft: 10,
    marginRight: 10,
  },
  GridViewDesc: {
    fontSize: 14,
    fontWeight: 'normal',
    justifyContent: 'center',
    color: '#000000',
    marginLeft: 10,
    marginRight: 10,
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    elevation: 3,
    margin: 18,
  },
});
