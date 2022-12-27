import axios from "axios";

axios.defaults.baseURL = 'https://pixabay.com/api/';

export const fetchImages = async (value, page) => {
  const { data } = await axios.get(`?q=${value}&page=${page}&key=31303578-edf23fcb2ab8348590995fcb8&image_type=photo&orientation=horizontal&per_page=12`);
  return data;
};

