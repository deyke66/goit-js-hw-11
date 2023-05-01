import './css/styles.css';
import Notiflix, { Notify } from 'notiflix';
import { fetchSearchParameters } from './js/fetchSearchParameters';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css"
import axios from 'axios';

const axios = require('axios');

const refs = {
    searchForm: document.querySelector('.search-form'),
    formBtn: document.querySelector('.form-btn'),
    galleryBox: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more')
}
const { searchForm, formBtn, galleryBox, loadMoreBtn } = refs;

let lightbox = new SimpleLightbox('.gallery a');

let pageCount = 1;
let inputValue = '';

loadMoreBtn.style.display = 'none';

searchForm.addEventListener('submit', onSubmitButtonSearch);

async function onSubmitButtonSearch(e) {
  e.preventDefault();
  clearHtml();
  pageCount = 1;
  formBtn.disabled = true;

  const { searchQuery } = e.target;
  inputValue = searchQuery.value.trim()

  try {
    const fetchUrl = await fetchSearchParameters(inputValue, pageCount);
    const { data: { hits, totalHits, total } } = fetchUrl;
    

    if (!total || inputValue === '') {
      loadMoreBtn.style.display = 'none';
      formBtn.disabled = false;
      return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    }

    createMarkupForGallery(hits);
    lightbox.refresh();  

    Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
    formBtn.disabled = false;
    loadMoreBtn.style.display = 'block';
    

  } catch (error) {
    return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
  }
}

loadMoreBtn.addEventListener('click', async () => {
    loadMoreBtn.disabled = true;
    pageCount += 1;
      try {
        const fetchUrlForBtn = await fetchSearchParameters(inputValue, pageCount);
        const { data: { hits: hitsForBtn, totalHits, total } } = fetchUrlForBtn;

        createMarkupForGallery(hitsForBtn);  
        loadMoreBtn.disabled = false;
        console.log(totalHits);
        console.log(hitsForBtn)
       
        

      } catch (err) {
        const { response: { status } } = err;

        if (status === 400) {
          Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`)
        }
        
      }
      
})
  
function clearHtml() {
  galleryBox.innerHTML = '';
}

function createMarkupForGallery(value) {
  const markup = value.map(({ webformatURL, tags, likes, views, comments, downloads, largeImageURL }) => `<div class="photo-card">
  <a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>`).join('');
  return galleryBox.insertAdjacentHTML('beforeend', markup);
}