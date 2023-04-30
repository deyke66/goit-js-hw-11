import axios from 'axios';

export function fetchSearchParameters(value) {
    return axios.get(`https://pixabay.com/api/?key=35922682-1b431e882647e6bfef105f4f6&q=${value}&image_type=photo&orientation=horizontal&safesearch=true`);
}
