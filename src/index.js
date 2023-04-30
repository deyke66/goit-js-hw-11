import './css/styles.css';
import Notiflix, { Notify } from 'notiflix';
import { fetchSearchParameters } from './js/fetchSearchParameters';

const axios = require('axios');

const refs = {
    searchForm: document.querySelector('.search-form'),
    formInput: document.querySelector('[name=searchQuery]'),
    galleryBox: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more')
}
const { searchForm, formInput, galleryBox, loadMoreBtn } = refs;

let pageCount = 1;

searchForm.addEventListener('submit', onSubmitButtonSearch);

function onSubmitButtonSearch(e) {
    e.preventDefault();
    pageCount = 1;
    galleryBox.innerHTML = '';
    const { searchQuery } = e.target;

    fetchSearchParameters(searchQuery.value, pageCount).then(resp => {
        const { data: { total } } = resp
        if (!total) {
            return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        }

        createMarkupForGallery(resp.data.hits);
        
        loadMoreBtn.addEventListener('click', () => {
            pageCount += 1;
            fetchSearchParameters(searchQuery.value, pageCount).then(response => {
                createMarkupForGallery(response.data.hits)
            });
            
        })
        
    }).catch(err => console.log(err));
    
}
console.log(pageCount)

function createMarkupForGallery(value) {
    const markup = value.map(({ webformatURL, tags, likes, views, comments, downloads }) => `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`).join('');
    return galleryBox.insertAdjacentHTML('beforeend', markup);
}

