import React from 'react'
import { StyleSheet ,View, Text, Image} from "react-native";
import { Button} from "@react-native-material/core";

const SplashScreen= ({navigation}) => {

  

//  StatusBar.setBarStyle("dark-content");
//  if (Platform.OS === "android") {
//    StatusBar.setBackgroundColor("rgba(0,0,0,0)");
//    StatusBar.setTranslucent(true);
//  }
  return (

    <View style={styles.container} >
       {/* <StatusBar backgroundColor="rgba(0,0,0,0)" barStyle="light-content" translucent={true} /> */}
    <Image style={styles.splash1} source={require('../assets/splash1.png')}></Image>
    <Image style={styles.splash2} source={require('../assets/splash2.png')}></Image>

    <View style={styles.main_part} >

      <Image style={styles.logo} source={require('../assets/logo.png')}></Image>
        <Text style={styles.text_atg}>Your Brain is your Genie. Use it better for success</Text>
        <Button color='#FF9411' style={styles.button} title="Get Started" onPress={() =>
        navigation.navigate('OnBoarding')
      }/>
     
    </View>
  </View>
  )
}

export default SplashScreen;


const styles = StyleSheet.create({
  container: {
    flex: 6,
    flexDirection:'column',
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },

  splash1: {
    flex:2,
    width: '100%',
    height: 250

  },
  splash2: {
    position: 'absolute',
    flex: 2,
    width: '100%',
    height: 250,
    marginTop: 50,
    opacity: 2
  },


  main_part: {
    flex: 4,
    flexDirection:'column',
    alignItems: 'center',
    justifyContent: 'center'
  },

  logo: {

    width: 150,
    height: 150
  },

  view_one: {
    width: 148,
    height: 244,
  },

  text_atg:{
    position: 'relative',
    marginTop:20,
    marginBottom:20,
    marginLeft:50,
    marginRight:50,
    fontSize:14,
    fontWeight:'100',
    fontFamily:'Inter-Regular',
    color:'#000000'
    
  },

  button: {
    alignItems: 'center',
    borderRadius: 10,
    elevation: 2,
    color:'white',
    fontFamily:'Inter-Regular',
    fontSize:12,
  
  },
  text: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: 'normal',
    letterSpacing: 0.25,
    color: 'white',
  },
});

