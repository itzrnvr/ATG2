import {Dimensions} from 'react-native';

const GridListItems = [
  {
    id: 'BuySerialKey',
    key: 'Buy',
    desc: 'Students/Corporate',
    image: require('../assets/promo.png'),
  },
  {
    id: 'SerialKey',
    key: 'Serial Key',
    desc: 'Buy/Active',
    image: require('../assets/keys.png'),
  },
  {
    id: 'FullVideos',
    key: 'Full Videos',
    desc: 'Students/Corporate',
    image: require('../assets/fullvideo.png'),
  },
  {
    id: 'Assesment',
    key: 'Assesment',
    desc: 'Practice',
    image: require('../assets/assesment.png'),
  },
  {
    id: 'Recommendation',
    key: 'MM Journey',
    desc: 'Community',
    image: require('../assets/reccomendation.png'),
  },
  // {
  //   id: 'Qualify',
  //   key: 'Strength Finder',
  //   desc: 'Community',
  //   image: require('../assets/promo.png'),
  // },
];

export const shouldOpenUrl = [
  {
    id: 'Assesment',
    url: 'https://junglebookpune.org/test_awaken_genius/website/cn_assessment_test/verify_user',
  },
  {
    id: 'Recommendation',
    url: 'https://junglebookpune.org/test_awaken_genius/cn_website/mindmap',
  },
];

export default GridListItems;
export const SLIDER_WIDTH = Dimensions.get('window').width - 40;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 1);
