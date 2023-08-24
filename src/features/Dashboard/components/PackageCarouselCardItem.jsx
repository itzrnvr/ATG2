import React, {useState, useEffect} from 'react'
import { View, Text, SafeAreaView, StyleSheet, Dimensions,Image, FlatList, TouchableOpacity,Linking } from 'react-native'
import COLORS from '../../../utilities/colors';
import { getValue, STORAGE_KEY } from '../../../helpers/sessionManager';


export const SLIDER_WIDTH = Dimensions.get('window').width - 40;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 1);


const PackageCarouselCardItem = ({ item, index, onClick }) => {
    console.log(JSON.stringify(item))
    let url;
    getValue(STORAGE_KEY).then((userStr)=>{
      url=JSON.parse(userStr);
    } );
    
    return (
        <TouchableOpacity  style={styles.PCardContainer} key={index} onPress={()=> Linking.openURL(url.Buy_Now)} >
            <Image
                source={require('../../../assets/packages.png')}
                style={styles.PCardImage}
            />
            <View style={styles.PCardBody} >
                <Text style={styles.CardHeader}>{++index}.  {item.package_title}</Text>
                            <Text style={styles.header}>₹ {item.basic_rate}</Text>
            </View>
  
        </TouchableOpacity>
    )
  }

export default PackageCarouselCardItem

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      marginTop: 40,
      marginLeft: 18,
      marginRight: 18,
    },
  
    main_view: {
      flexDirection: 'row',
      height: 56,
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    banner_view: {
      width: '100%',
      marginTop: 9,
      marginBottom: 9,
      height: 200,
      borderRadius: 15
    },
  
    pager_view: {
      position: 'absolute',
      top: 150,
      backgroundColor: 'red'
    },
    name_text: {
      flex: 8,
      color: '#2E3E5C',
      fontSize: 25,
      fontWeight: 'bold'
    },
    image: {
      marginLeft: 18,
      width: 24,
      height: 24
    },
  
    image_two: {
      width: 24,
      height: 24
    },
  
    view_back_image: {
      marginLeft: 18,
      padding: 10,
      backgroundColor: '#4C2CD5',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      width: 48,
      height: 48
    },
    GridViewContainer: {
      flex: 1,
      margin: 8,
      height: 150,
      borderRadius: 15,
      backgroundColor: '#EBEEFF',
      justifyContent: 'space-around'
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
      justifyContent: 'space-around'
    },
    GridViewImage: {
      width: 30,
      height: 30,
    },
  
    CardContainer: {
      backgroundColor: 'red',
      width: ITEM_WIDTH,
      height: 200,
      borderRadius: 15
  
  },
  CardImage: {
    borderRadius: 15,
    width: ITEM_WIDTH,
    height: 200,
    position: 'relative'
  },
  CardHeader: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  CardBody: {
    marginBottom: 20,
    marginLeft: 15,
    marginRight: 15,
    top: 160,
    position: 'absolute'
  },
  PCardContainer: {
    width: ITEM_WIDTH,
    height: 180,
    borderRadius: 15
  
  },
  PCardImage: {
    width:380,
    borderRadius: 15,
    height: 180,
    position: 'relative'
  },
  PCardBody: {
    marginBottom: 20,
    marginLeft: 15,
    marginRight: 15,
    top: 20,
    position: 'absolute'
  }
  
  })