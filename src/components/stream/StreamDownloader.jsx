import { even } from '@react-native-material/core';
import React, { useEffect } from 'react';
import { View, Button, DeviceEventEmitter, PermissionsAndroid } from 'react-native';
import { StreamDownloaderModule } from '../native';

const StreamDownloader = ({url}) => {
  
  useEffect(() => {
    // Add the event listener to the onDownloadProgress event
    const downloadProgressSubscription = DeviceEventEmitter.addListener(
      'onDownloadProgress',
      (event) => {
        console.log(event.url)
        console.log('Download Progress:', event.progress);
      }
    );

    // Cleanup the event listener when the component is unmounted
    return () => {
      downloadProgressSubscription.remove();
    };
  }, []);


  const startDownload = () => {
    StreamDownloaderModule.download("https://content.jwplatform.com/manifests/yp34SRmf.m3u8");
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Start Download" onPress={startDownload} />
    </View>
  );
};


export default StreamDownloader