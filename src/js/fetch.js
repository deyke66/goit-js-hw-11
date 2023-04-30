export function fetchCountries(name) {
    const BASIC_URL = 'https://restcountries.com/v3.1';
    const ENPOINT = '/name/';
    const PARAM_FOR_FILTER = 'fields=name,languages,population,capital,flags';
    return fetch(`${BASIC_URL}${ENPOINT}${name}?${PARAM_FOR_FILTER}`).then(resp => {
        if (!resp.ok) {
            throw new Error(resp.status)
        }
        return resp.json();
    });
};