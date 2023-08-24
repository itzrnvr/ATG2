import '../../ignoreWarnings';
import React, {useState, useRef, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRoute} from '@react-navigation/native';
import decryptionManger from '../helpers/decryptionManger';
import RNFetchBlob from 'rn-fetch-blob';
// import { NativeModules } from "react-native";
// const {SecurePlayer} = NativeModules
// console.log(SecurePlayer)
// import CryptoJS from 'react-native-crypto'
import SecurePlayerView from '../features/VideoPlayerView/components/SecurePlayerView';
import {FullScreenModule, WebVideoManager} from '../components/native';
import WebVideoView from '../features/VideoPlayerView/components/WebVideoView';
import StreamDownloader from '../components/stream/StreamDownloader';
import VideoView from '../features/VideoPlayerView/components/VideoView';
import Orientation from 'react-native-orientation-locker';
import {StatusBar} from 'react-native';
import {requireNativeComponent} from 'react-native';
import {VideoPlayer} from '../components/player/VideoPlayer';

const FlordiaPlayer = requireNativeComponent('FlordiaPlayer');
// import SecurePlayerFragmentView from "../features/VideoPlayerView/components/SecurePlayerFragment";

const VideoPlayerView = ({navigation}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    StatusBar.setHidden(true);
    Orientation.lockToLandscape();
    FullScreenModule.enableFullScreen();
    return () => {
      StatusBar.setHidden(false);
      Orientation.lockToPortrait();
    };
  });

  return (
    <View style={{flex: 1}}>
      {/*<Video*/}
      {/*  source={{*/}
      {/*    uri: 'https://junglebookpune.org/test_awaken_genius/videos/speed_reading/master.m3u8',*/}
      {/*  }}*/}
      {/*  ref={videoRef}*/}
      {/*  style={{flex: 1}}*/}
      {/*/>*/}
      <VideoPlayer style={{flex: 1}} />
    </View>
  );
};

export default VideoPlayerView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  videoViewContainer: {
    height: 300,
    backgroundColor: 'white',
    // borderWidth: 4,
    // borderColor: "red",
  },
  pageDataContainer: {
    flex: 1,
    padding: 16,
  },
  videoTitle: {
    fontSize: 24,
    color: 'black',
  },
});
