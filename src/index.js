import './css/styles.css';
import Notiflix, { Notify } from 'notiflix';
import { fetchSearchParameters } from './js/fetchSearchParameters';
import SimpleLightbox from "simplelightbox";
import SimpleLightbox from "simplelightbox/dist/simple-lightbox.esm";
import axios from 'axios';

const axios = require('axios');

const refs = {
    searchForm: document.querySelector('.search-form'),
    formBtn: document.querySelector('.form-btn'),
    galleryBox: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more')
}
const { searchForm, formBtn, galleryBox, loadMoreBtn } = refs;

let pageCount = 1;
loadMoreBtn.style.display = 'none';

searchForm.addEventListener('submit', onSubmitButtonSearch);

// function onSubmitButtonSearch(e) {
//   e.preventDefault();
//   pageCount = 1;
//   galleryBox.innerHTML = '';
  
//   const { searchQuery } = e.target;
//   const inputValue = searchQuery.value.trim()

//   fetchSearchParameters(inputValue, pageCount).then(resp => {
//     const { data: { total, hits, totalHits } } = resp;
    
//     if (!total) {
//       return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
//     }

//     if (inputValue === '') {
//       return
//     }

//     Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
//     loadMoreBtn.style.display = 'block';
//     createMarkupForGallery(hits);
        
//     loadMoreBtn.addEventListener('click', () => {
//       pageCount += 1;
//       fetchSearchParameters(inputValue, pageCount).then(response => {
//         const { data: { hits, totalHits } } = response;
//         console.log(hits.length)
//         createMarkupForGallery(hits);

//         if (totalHits === hits.length) {
//           loadMoreBtn.disabled = true;
//           Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
//         }

//       });      
//     })     
//   }).catch(err => console.log(err));

// }

function createMarkupForGallery(value) {
  const markup = value.map(({ webformatURL, tags, likes, views, comments, downloads }) => `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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

async function onSubmitButtonSearch(e) {
  e.preventDefault();
  clearHtml();
  pageCount = 1;
  formBtn.disabled = true;

  const { searchQuery } = e.target;
  const inputValue = searchQuery.value.trim()

  try {
    const fetchUrl = await fetchSearchParameters(inputValue, pageCount);
    const { data: { hits, totalHits, total } } = fetchUrl;

    if (!total) {
      return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    }

    createMarkupForGallery(hits);
    formBtn.disabled = false;
    loadMoreBtn.style.display = 'block';
    

  } catch (error) {
    return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
  }

  loadMoreBtn.addEventListener('click', async () => {
    loadMoreBtn.disabled = true;
    pageCount += 1;
      try {
        let fetchUrlForBtn = await fetchSearchParameters(inputValue, pageCount);
        let { data: { hits: hitsForBtn, totalHits, total } } = fetchUrlForBtn;

        createMarkupForGallery(hitsForBtn);  
        loadMoreBtn.disabled = false;

      } catch (err) {
        console.log(err)
      }
      
  })
  
}

function clearHtml() {
  galleryBox.innerHTML = '';
}
