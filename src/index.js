import './css/styles.css';
import Notiflix, { Notify } from 'notiflix';
import { fetchSearchParameters } from './js/fetchSearchParameters';

const axios = require('axios');

const refs = {
    searchForm: document.querySelector('.search-form'),
    formInput: document.querySelector('[name=searchQuery]')
}
const { searchForm, formInput } = refs;

searchForm.addEventListener('submit', onSubmitButtonSearch);

function onSubmitButtonSearch(e) {
    e.preventDefault();
    const { searchQuery } = e.target;
    fetchSearchParameters(searchQuery.value).then(resp => {
        const {data: {total}} = resp
        if (!total) {
            return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        }
        
    }).catch(err=>console.log(err)) 
}

function createMarkup(data){

}

