import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome6';
import VideoSettingsBottomSheet  from "./VideoSettingsBottomSheet";

const IconButton = ({name, size = 22, onPress}) => (
  <TouchableOpacity style={{padding: 16}} onPress={onPress}>
      <Icon name={name} size={size} color="#fff" />
  </TouchableOpacity>
);

const VideoControls = ({
   qualityList,
   onQualitySelect,
   onPlay,
   onPause,
   setCurrentProgress,
   onProgressChange,
   onBackPress,
}) => {
    const [isVideoSettingsSheetOpen, setIsVideoSettingsSheetOpen] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [controlsVisible, setControlsVisible] = useState(true);

    useEffect(() => {
        setCurrentProgress?.(value => setProgress(value))
    }, [])

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleProgressChange = (value) => {
        setProgress(value);
        onProgressChange?.(value)
    };

    const handleContainerPress = () => {
        console.log("Container Pressed", `isVideoSettingsSheetOpen ${isVideoSettingsSheetOpen}`)
        console.log("Container Pressed", `controlsVisible ${controlsVisible}`)
        if(!isVideoSettingsSheetOpen){
            setControlsVisible(!controlsVisible);
            if (controlsVisible && !isVideoSettingsSheetOpen) {
                setTimeout(() => setControlsVisible(false), 5000);
            }
        }
    };

    useEffect(() => {
        if(isPlaying) {
            onPlay?.()
        } else {
            onPause?.()
        }
    }, [isPlaying])

    useEffect(() => {
        if(!controlsVisible){
            setIsVideoSettingsSheetOpen(false)
        }
    }, [controlsVisible]);



    return (
      <TouchableOpacity style={styles.container} onPress={handleContainerPress}>
          {controlsVisible && (
            <View style={styles.controls}>
                <View style={styles.topControls}>
                    <IconButton name={"arrow-left"} onPress={onBackPress}/>
                    <Text style={styles.title}>Speed Reading</Text>
                </View>

                <View style={styles.centerControls}>
                    <IconButton
                      name={isPlaying ? "pause" : "play"}
                      size={30}
                      onPress={handlePlayPause}
                    />
                </View>

                <View style={styles.bottomControls}>
                    <Text style={styles.videoTime}>{"0:00/5:00"}</Text>
                    <Slider
                      style={styles.slider}
                      value={progress}
                      onValueChange={handleProgressChange}
                      minimumValue={0}
                      maximumValue={100}
                      minimumTrackTintColor="#f00"
                      maximumTrackTintColor="#f00"
                      thumbTintColor="#f00"
                    />
                    <IconButton name={"gear"} onPress={() => {
                        setIsVideoSettingsSheetOpen(true)
                    }}/>
                </View>

                <VideoSettingsBottomSheet
                  isOpen={isVideoSettingsSheetOpen}
                  onClose={() => setIsVideoSettingsSheetOpen(false)}
                  onOpened={() => setIsVideoSettingsSheetOpen(true)}
                  data = {qualityList}
                  onSelect={onQualitySelect}
                />
            </View>
          )}
      </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    controls: {
        flex: 1,
        paddingTop: 16,
        paddingBottom: 16,
        paddingStart: 24,
        paddingEnd: 24,
        backgroundColor: "rgba(0,0,0,0.30)"
    },
    slider: {
        height: 40,
        flex: 1
    },
    videoTime: {
        color: "white"
    },
    topControls: {
        height: 56,
        color: "#fff",
        flexDirection: "row",
        alignItems: "center"
    },
    title: {
        paddingStart: 16,
        color: "#fff",
        fontSize: 18
    },
    centerControls:  {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    bottomControls: {
        height: 56,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default VideoControls;
