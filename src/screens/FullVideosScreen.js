import {
  View,
  Text,
  StyleSheet,
  SectionList,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {React, useEffect, useState} from 'react';
import {Divider} from '@react-native-material/core';
import {mac_id_exists, setValue, getValue} from '../helpers/sessionManager';
import {getMainVideos} from '../utilities/constant';
import axios from 'axios';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PlayCircleIcon from '../components/icons/PlayCircleIcon';
import ScreenContainer from '../layouts/ScreenContainer';

const FullVideosScreen = ({navigation}) => {
  const [macId, setMacId] = useState('');

  const [videoData, setvideoData] = useState([]);
  const getMainVideosList = async () => {
    try {
      const response = await axios({
        method: 'POST',
        url: getMainVideos,
        params: {
          mac_id: getValue(mac_id_exists),
        },
      });
      const videoData = await response;
      console.log('videoData', videoData?.data.video_list);
      console.log('data', videoData?.data.video_list[0].data);
      // updateData(videoData?.data?.video_list);
      setvideoData(videoData?.data?.video_list);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  useEffect(() => {
    getMainVideosList();
  }, []);

  const updateData = data => {
    const dta = [];
    data.forEach(el => {
      dta.push({
        title: el.package_title,
        data: el.program_list,
      });
    });
    console.log({dta});
    setvideoData(dta);
  };

  const onGoBack = () => {
    navigation.goBack();
  };

  const onGridTap = item => {
    navigation.navigate('VideoPlayerView', {item});
  };

  return (
    <ScreenContainer showLoading={videoData.length === 0}>
      <View>
        <Image
          style={{height: 100}}
          source={require('../assets/header_background.png')}
        />
        <View style={styles.main_view}>
          <TouchableOpacity style={styles.view_back_image} onPress={onGoBack}>
            <Image
              style={styles.image_two}
              source={require('../assets/back_arrow.png')}
            />
          </TouchableOpacity>
          <Text style={styles.name_text}>Main Videos</Text>
        </View>
      </View>
      <View>
        {videoData && (
          <SectionList
            style={styles.second_view}
            sections={videoData}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => onGridTap(item)}>
                <View style={{flexDirection: 'column', margin: 10}}>
                  <View style={{flexDirection: 'row'}}>
                    {/*<Image*/}
                    {/*  style={{width: '100%', height: '100%'}}*/}
                    {/*  resizeMode="cover"*/}
                    {/*  source={{uri: item.thumbnail}}*/}
                    {/*/>*/}

                    <PlayCircleIcon height="100%" width="20%" />
                    <Text style={styles.item}>{item.title}</Text>
                  </View>
                  <Divider style={{marginTop: 10}} leadingInset={16} />
                </View>
              </TouchableOpacity>
            )}
            renderSectionHeader={({section: {title, thumbnail}}) => (
              <View style={{margin: 10}}>
                <Text style={styles.sectionHeader}>{title}</Text>
              </View>
            )}
            keyExtractor={(item, index) => item + index}
          />
        )}
      </View>
    </ScreenContainer>
  );
};
export default FullVideosScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    margin: 18,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  topText: {
    fontSize: 14,
    color: '#4C2CD5',
    textAlign: 'right',
    marginLeft: 10,
    marginRight: 10,
  },
  GridViewTextLayout: {
    fontSize: 14,
    justifyContent: 'center',
    color: '#4C2CD5',
    marginLeft: 10,
    marginRight: 10,
  },
  GridViewDesc: {
    fontSize: 14,
    alignItems: 'center',
    color: '#000000',
    marginLeft: 10,
    marginRight: 10,
    textAlign: 'right',
  },
  GridViewContainer: {
    flex: 1,
    margin: 5,
    height: 250,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-around',
    position: 'relative',
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    elevation: 3,
    margin: 18,
  },
  view_grid_image: {
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 15,
    padding: 20,
    width: 80,
    backgroundColor: '#EBEEFF',
    alignItems: 'center',
  },
  item: {
    padding: 10,
    fontSize: 14,
    color: '#002427',
  },
  sectionHeader: {
    width: '100%',
    padding: 10,
    fontSize: 18,
    backgroundColor: '#EBEEFF',
    color: '#4325C2',
    borderRadius: 50,
    elevation: 2,
    alignItems: 'center',
  },
});
