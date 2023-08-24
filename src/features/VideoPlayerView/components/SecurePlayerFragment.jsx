// import React, {useEffect, useRef} from 'react';
// import {
//     StyleSheet,
//     View,
//     Dimensions,
//   PixelRatio,
//   UIManager,
//   findNodeHandle,
// } from 'react-native';

// import {SecurePlayerFragment} from '../../../components/native';

// const windowWidth = Dimensions.get('window').width;
// const windowHeight = Dimensions.get('window').height;

// const createFragment = viewId =>
//   UIManager.dispatchViewManagerCommand(
//     viewId,
//     // we are calling the 'create' command
//     UIManager.SecurePlayerFragment.Commands.create.toString(),
//     [viewId],
//   );

// const SecurePlayerFragmentView = ({
//     src
// }) => {
//   const ref = useRef(null);

//   useEffect(() => {
//     const viewId = findNodeHandle(ref.current);
//     console.log(viewId)
//     createFragment(viewId);
//   }, []);
 
//   return (
//     <SecurePlayerFragment ref={ref} 
//             style={{
//         // converts dpi to px, provide desired height
//         height: PixelRatio.getPixelSizeForLayoutSize(200),
//         // converts dpi to px, provide desired width
//         width: PixelRatio.getPixelSizeForLayoutSize(200),
//         }}/>
//   );
// };

// export default SecurePlayerFragmentView

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: 'black',
//     },
//   });
  