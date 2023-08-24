import React, {useState} from 'react'
import { View, StyleSheet, Text, Modal, ActivityIndicator} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const ScreenContainer = ({children, showLoading = false}) => {

  return (
    <SafeAreaView style = {styles.container}>
        {!showLoading && <View style={styles.screenContainer}>
            {children}
        </View>}
        {showLoading && <LoadingModal visible={true}/>}

    </SafeAreaView>
  )
}

export default ScreenContainer

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    screenContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#FFFFFF',
      },
      activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
      },
})

const LoadingModal = ({ isLoading }) => (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={isLoading}
      onRequestClose={() => console.log('close modal')}
    >
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator animating={isLoading} size="large" color="#0000ff" />
        </View>
      </View>
    </Modal>
  );

