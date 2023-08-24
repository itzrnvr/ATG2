import React, {useState, useRef, useEffect} from 'react';
import { View, StyleSheet } from "react-native";
import VideoContainer from "./VideoContainer";
import VideoControls from "./VideoControls";


export const VideoPlayer = () => {

    const qualityList = [
        {
            bitrate: "",
            name: "1080p",
        },
        {
            bitrate: "",
            name: "720p",
        },
        {
            bitrate: "",
            name: "480p",
        },
        {
            bitrate: "",
            name: "360p",
        }
    ]

    const playerContainerRef = useRef(null)

    useEffect(() => {
        if (playerContainerRef.current) {
            playerContainerRef.current.play();
        }
    }, []);

  return (
    <View style={styles.container}>
      <VideoContainer ref={playerContainerRef} style={styles.viewOne}/>
      <VideoControls style={styles.viewTwo}
         qualityList={qualityList}
         onQualitySelect={(item) => console.log(item)}
         onBackPress={() => console.log('back pressed')}
         onProgressChange={(progress) => console.log(`progress changed: ${progress}`)}
         onPlay={() => playerContainerRef.current && playerContainerRef.current.play()}
         onPause={() => {
             console.log(playerContainerRef.current)
             playerContainerRef.current && playerContainerRef.current.pause()
         }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewOne: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    viewTwo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});
