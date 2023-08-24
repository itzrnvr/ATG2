import React, { useCallback, useRef, useMemo, useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList } from "@gorhom/bottom-sheet";
import Icon from "react-native-vector-icons/FontAwesome6";
import bottomSheet from "@gorhom/bottom-sheet/src";

const VideoSettingsBottomSheet = ({
    isOpen,
    onClose,
    onOpened,
    data,
    onSelect
}) => {
  // hooks
  const sheetRef = useRef(null);
  const [index, setIndex] = useState(-1)
  const [selectedItem, setSelectedItem] = useState(null); // Add this line

  // variables
  const snapPoints = useMemo(() => ["70%"], []);

  // callbacks

  const handleItemOnPress = (item) => {
    setSelectedItem(item)
    onSelect?.(item)
    sheetRef.current.close()
  }

  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
    setIndex(index); // Add this line
  }, []);

  useEffect(() => {
    if(isOpen){
      setIndex(0);
      console.log('OPENED');
    } else {
      setIndex(-1);
      console.log('CLOSED');
    }
  }, [isOpen]);

  useEffect(() => {
    if(index === -1){
      onClose?.()
    } else {
      onOpened?.()
    }
  }, [index]);

  const renderBackdrop = useCallback(
      props => (
          <BottomSheetBackdrop
              {...props}
              disappearsOnIndex={-1}
              appearsOnIndex={0}
          />
      ),
      []
  );

  // render
  const renderItem = useCallback(
      ({ item }) => (
          <TouchableOpacity onPress={() => handleItemOnPress(item)}>
            <View style={styles.itemContainer}>
              <Icon name="check" size={24} style={{ opacity: selectedItem?.name === item?.name ? 1 : 0 }} />
              <Text style={{ paddingStart: 16, fontSize: 18}}>{item.name}</Text>
            </View>
          </TouchableOpacity>
      ),
      [selectedItem] // Add selectedItem to the dependency array
  );
  return (
      <BottomSheet
          ref={sheetRef}
          index={index}
          snapPoints={snapPoints}
          onChange={handleSheetChange}
          onClose={onClose}
          onCloseEnd={onClose} // Use the onCloseEnd prop here
          enablePanDownToClose={true}
          backdropComponent={renderBackdrop}
      >
        <BottomSheetFlatList
            data={data}
            // keyExtractor={(i) => i}
            renderItem={renderItem}
            contentContainerStyle={styles.contentContainer}
        />
      </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 200,
  },
  contentContainer: {
    backgroundColor: "white",
  },
  itemContainer: {
    paddingStart: 48,
    paddingTop: 16,
    margin: 6,
    alignItems: "center",
    flexDirection: 'row', // Add this line
  },
});

export default VideoSettingsBottomSheet;
