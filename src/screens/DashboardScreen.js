import React, {useEffect, useRef, useState, useCallback} from 'react';
import useGetData from '../hooks/useGetData';
import useYoutubeVideos from '../hooks/useYoutubeVideos';
import {getPackages, getImortantLinks} from '../utilities/constant';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  TouchableOpacity,
  Linking,
} from 'react-native';
import COLORS from '../utilities/colors';
import GridListItems, {shouldOpenUrl} from '../data/dashboard_data';
import {STORAGE_KEY, setValue} from '../helpers/sessionManager';
import CarouselCustom from '../features/Dashboard/components/CarouselCustom';
import ScreenContainer from '../layouts/ScreenContainer';

export const SLIDER_WIDTH = Dimensions.get('window').width - 40;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 1);

const DashboardScreen = ({navigation}) => {
  const {
    data: linkData,
    isLoading: loading,
    isSuccess: success,
  } = useGetData('getImortantLinks', getImortantLinks);

  const {data, isLoading, isSuccess} = useYoutubeVideos();
  const {
    data: packageData,
    isLoading: packageLoading,
    isSuccess: packageSucess,
  } = useGetData('getPackages', getPackages);

  useEffect(() => {
    const data = linkData?.links;
    setValue(STORAGE_KEY, data);
  }, [success]);

  const onGridTap = useCallback(
    key => {
      const getOpenLink = shouldOpenUrl.filter(item => item.id === key);
      if (getOpenLink.length > 0) {
        Linking.openURL(getOpenLink[0].url);
      } else {
        navigation.navigate(key);
      }
    },
    [navigation],
  );

  return (
    <ScreenContainer showLoading={isLoading || packageLoading}>
      <View style={styles.container}>
        <View style={styles.main_view}>
          <Text style={styles.name_text}>Hi Satish !!</Text>
          <TouchableOpacity onPress={() => onGridTap('Notification')}>
            <Image
              style={styles.image}
              source={require('../assets/notify.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onGridTap('Menu')}>
            <View style={styles.view_back_image}>
              <Image
                style={styles.image_two}
                source={require('../assets/setting.png')}
              />
            </View>
          </TouchableOpacity>
        </View>

        <FlatList
          style={{flex: 1}}
          ListHeaderComponent={
            <>
              {isSuccess && (
                <View style={styles.banner_view}>
                  <CarouselCustom data={data?.result} />
                </View>
              )}

              {packageSucess && (
                <View style={styles.banner_view}>
                  <CarouselCustom data={packageData?.result} type="package" />
                </View>
              )}
            </>
          }
          data={GridListItems}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.GridViewContainer}
              onPress={() => onGridTap(item.id)}>
              <View style={styles.view_grid_image}>
                <Image style={styles.GridViewImage} source={item.image} />
              </View>
              <View>
                <Text style={styles.GridViewTextLayout}> {item.key} </Text>
                <Text style={styles.GridViewDesc}> {item.desc} </Text>
              </View>
            </TouchableOpacity>
          )}
          numColumns={2}
          ListFooterComponent={<View style={{height: 20}} />}
        />
      </View>
    </ScreenContainer>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
  },

  main_view: {
    flexDirection: 'row',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  banner_view: {
    width: '100%',
    marginTop: 9,
    marginBottom: 9,
    height: 200,
    borderRadius: 15,
  },

  name_text: {
    flex: 8,
    color: '#2E3E5C',
    fontSize: 25,
    fontWeight: 'bold',
  },
  image: {
    marginLeft: 18,
    width: 24,
    height: 24,
  },

  image_two: {
    width: 24,
    height: 24,
  },

  view_back_image: {
    marginLeft: 18,
    padding: 10,
    backgroundColor: '#4C2CD5',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
  },
  GridViewContainer: {
    flex: 1,
    margin: 8,
    height: 150,
    borderRadius: 15,
    backgroundColor: '#EBEEFF',
    justifyContent: 'space-around',
  },
  GridViewTextLayout: {
    fontSize: 16,
    fontWeight: 'bold',
    justifyContent: 'center',
    color: COLORS.dark,
    marginLeft: 10,
    marginRight: 10,
  },
  GridViewDesc: {
    fontSize: 14,
    fontWeight: 'normal',
    justifyContent: 'center',
    color: COLORS.dark,
    marginLeft: 10,
    marginRight: 10,
  },

  view_grid_image: {
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 15,
    padding: 10,
    width: 50,
    backgroundColor: '#FFF',
    justifyContent: 'space-around',
  },
  GridViewImage: {
    width: 30,
    height: 30,
  },
});
