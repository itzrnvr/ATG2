import React, { useEffect, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import CarouselCardItem from './CarouselCardItem';
import PackageCarouselCardItem from './PackageCarouselCardItem';
import { useAnimatedElevation } from '@react-native-material/core';

const CarouselCustom = ({
    data, 
    onClick,  
    type = "thumbnail"
}) => {

    const width = Dimensions.get('window').width;


    return (
        <View style={{ flex: 1 }}>
            <Carousel
                loop
                width={width}
                height={width / 2}
                // autoPlay={true}
                data={data}
                // scrollAnimationDuration={5000}
                key={onClick}
                onSnapToItem={(index) => console.log('current index:', index)}
                panGestureHandlerProps={{
                    activeOffsetX: [-10, 10],
                }}
                renderItem={({item, index }) => (
                    <>
                        {type == "thumbnail" && <CarouselCardItem index={index} item={item}/>}
                        {type == "package" && <PackageCarouselCardItem onClick={onClick} index={index} item={item}/>}
                    </>
                )}
            />
        </View>
    );
}

export default CarouselCustom;