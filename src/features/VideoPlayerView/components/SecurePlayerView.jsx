import {requireNativeComponent, StyleSheet} from 'react-native'
const SecurePlayer = requireNativeComponent('SecurePlayer')

const SecurePlayerView = () => {
  return (
    <SecurePlayer style={styles.container} src="https://content.jwplatform.com/manifests/yp34SRmf.m3u8"/>
  )
}

export default SecurePlayerView

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
    },
  });
  