import { View, Text, SafeAreaView, StyleSheet, Image, TextInput, ScrollView, FlatList, Button, TouchableOpacity ,Linking} from 'react-native'
import React from 'react'
import { getPackages } from '../utilities/constant';
import useGetData from '../hooks/useGetData';
import { getValue, STORAGE_KEY } from '../helpers/sessionManager';


const BuySerialKeyScreen = ({ navigation }) => {

  let url;
  getValue(STORAGE_KEY).then((userStr)=>{
    url=JSON.parse(userStr);
  } );
  
  const { data, isLoading, isSuccess } = useGetData("getPackages", getPackages);

  const onGridTap = (key) => {
    Linking.openURL(url.Buy_Now);
  }
  const onGoBack = () => {
    navigation.goBack();
  }

  return (
    <SafeAreaView>
      <View>
        <Image source={require('../assets/top_back_img.png')}></Image>
        <View style={styles.main_view}>
        <TouchableOpacity style={styles.view_back_image} onPress={onGoBack}><Image style={styles.image_two} source={require('../assets/back_arrow.png')} /></TouchableOpacity>          
        <Text style={styles.name_text} >Buy  Key</Text>
        </View>
      </View>
      <View>
        {
          isSuccess && (
            <FlatList
            style={styles.second_view}
            data={data?.result}
            renderItem={({ item }) =>
              <View>
                <TouchableOpacity style={styles.GridViewContainer} onPress={() => onGridTap(item.id)} >
                  <View style={styles.view_grid_image}><Image tyle={styles.GridViewImage} source={require('../assets/student_package.png')}></Image></View>
                  <View style={{ flexDirection: 'row' }} >
                    <View style={{ flexDirection: 'column' }}>
                      <Text style={styles.GridViewTextLayout}> Package </Text>
                      <Text style={styles.GridViewTextLayout}> Price </Text>
                      <Text style={styles.GridViewTextLayout}> Duration </Text>
  
                    </View>
                    <View style={{ flexDirection: 'column' }} >
                      <Text style={styles.GridViewDesc}> {item.package_title}</Text>
                      <Text style={styles.GridViewDesc}> ₹ {item.basic_rate} </Text>
                      <Text style={styles.GridViewDesc}> {item.duration} Days </Text>
                    </View>
                  </View>
                  <Text style={{ backgroundColor: '#FF9411', borderRadius: 10, padding: 5, marginLeft: 30, marginRight: 30, textAlign: 'center' }} >Buy Now</Text>
                </TouchableOpacity>
                <View style={{ backgroundColor: '#4C2CD5', position: 'absolute', width: 50, height: 15, right: 25, borderRadius: 10, alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontSize: 8 }} >{item.package_title}</Text>
                </View>
              </View>
  
            }
            numColumns={2}
          />
          )
        }
        
       
      </View>


    </SafeAreaView>
  )
}

export default BuySerialKeyScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main_view: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    height: 56,
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
    height: 48
  },
  name_text: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center'
  },

  second_view: {
    margin: 18,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25
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
    color: "#000000",
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
    position: 'relative'
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
    alignItems: 'center'
  },
})