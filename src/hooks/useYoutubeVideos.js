import { useQuery } from "react-query";
import { getVideoSlider } from "../utilities/constant";
import axios from 'axios';

const fetchPosts = async () => {
    const { data } = await axios.get(getVideoSlider);
    return data;
};

const useYoutubeVideos = () => useQuery('getVideoSlider', fetchPosts);
export default useYoutubeVideos;