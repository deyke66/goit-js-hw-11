import './css/styles.css';
import Notiflix, { Notify } from 'notiflix';
import { fetchCountries } from './js/fetch';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
    inputSearchCountry: document.querySelector('input#search-box'),
    countryList: document.querySelector('.country-list')
}

const { inputSearchCountry, countryList } = refs;

inputSearchCountry.addEventListener('input', debounce(onInputCountryValue, DEBOUNCE_DELAY));

function onInputCountryValue(e) {
    const userValue = e.target.value;
    if (!userValue) {
        clearHtml()
        return
    }
    fetchCountries(userValue.trim()).then(data => {
        if (data.length > 10) {
            clearHtml()
            return Notify.info('Too many matches found. Please enter a more specific name.');
        } else if (data.length >= 2) {
            markupForManyCountries(data);
        } else if (data.length === 1) {
            markupForOneElement(data)
        }
    }).catch(err => {
        clearHtml();
        return Notify.failure('Oops, there is no country with that name')
    });
}

function markupForManyCountries(array) {
    clearHtml();
      const newMarkup = array.map(({name, flags}) => {
        return `<li class='country-list'><div class='flex-box'><img src="${flags.svg}" alt="${name.official}" width='50' height='50'>
    <p>${name.official}</p></div></li>`
      }).join('');
    
    countryList.insertAdjacentHTML('beforeend', newMarkup);
}

function markupForOneElement(array) {
    clearHtml();
    const mainMarkup = array.map(({ name, flags, capital, population, languages }) => {
            return `<div class="flex-box">
      <img src="${flags.svg}" alt="${name.official}" width='50' height='50'>
      <p>${name.official}</p>
    </div>
    <p><span class='params'>Capital:</span> ${capital}</p>
    <p><span class='params'>Population:</span> ${population}</p>
    <p><span class='params'>Languages:</span> ${Object.values(languages)}</p>`
        }).join('');

    countryList.insertAdjacentHTML('beforeend', mainMarkup);
}
function clearHtml() {
   countryList.innerHTML = ''; 
}