import React from 'react'
import {View, StyleSheet} from 'react-native'
import {WebVideoManager} from "../../../components/native"

const WebVideoView = () => {
  const [isFull, setModalVisible] = useState(false);
  return (
    <View style={styles.container}>
        <WebVideoManager style={styles.videoView}/>
    </View>
  )
}

export default WebVideoView

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    videoView: {
      marginTop: 200,
    },
  });