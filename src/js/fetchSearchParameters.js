import axios from 'axios';

export async function fetchSearchParameters(value, page) {
    const API_KEY = '35922682-1b431e882647e6bfef105f4f6';
    const BASE_URL = 'https://pixabay.com/api/';
    const result = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`);
    
    return result;
}
