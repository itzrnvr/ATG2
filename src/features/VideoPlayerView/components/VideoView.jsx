import React, { useEffect } from "react";
import { View, Dimensions } from 'react-native';
import { WebVideoManager } from "../../../components/native"


const VideoView = () => {
    const dimensions = Dimensions.get('window');

    useEffect(() => {
        // Lock the screen to landscape and make the WebVideoManager fullscreen
    }, []);



    return (
        <View style={{ flex: 1,
          padding: 16,
          backgroundColor: "black" }}>
            <WebVideoManager
              fullScreen={true}
              style={{flex: 1, backgroundColor: "black"}}
            />
        </View>
    );
}


export default VideoView;
