import { useQuery } from "react-query";
import axios from 'axios';


const useGetData = (queryId, url) => useQuery(queryId, async () => {
    const { data } = await axios.get(url);
    return data;
});
export default useGetData;