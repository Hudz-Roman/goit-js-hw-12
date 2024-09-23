import { fetchImages } from './js/pixabay-api';
import { renderGallery, clearGallery } from './js/render-functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.search-form');
const input = document.querySelector('.search-input');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;
let totalPages = 0;

loadMoreBtn.classList.add('hidden');

function showLoader() {
  loader.classList.add('visible');
}

function hideLoader() {
  loader.classList.remove('visible');
}

function smoothScroll() {
  const gallery = document.querySelector('.gallery');
  const cardHeight = gallery.firstElementChild.getBoundingClientRect().height;
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  query = input.value.trim();
  if (!query) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search query',
      position: 'topRight',
    });
    return;
  }
  page = 1;
  clearGallery();
  showLoader();
  try {
    const data = await fetchImages(query, page);
    hideLoader();
    totalPages = Math.ceil(data.totalHits / data.hits.length);
    if (data.hits.length === 0) {
      iziToast.info({
        title: 'Info',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      loadMoreBtn.classList.add('hidden');
    } else {
      renderGallery(data.hits);
      if (page < totalPages) {
        loadMoreBtn.classList.remove('hidden');
      } else {
        loadMoreBtn.classList.add('hidden');
      }
    }
  } catch (error) {
    hideLoader();
    iziToast.error({
      title: 'Error',
      message: error.message,
      position: 'topRight',
    });
  }
});

loadMoreBtn.addEventListener('click', async () => {
  if (page >= totalPages) {
    iziToast.info({
      title: 'Info',
      message: `We're sorry, but you've reached the end of search results.`,
      position: 'topRight',
    });
    loadMoreBtn.classList.add('hidden');
    return;
  }
  page += 1;
  loadMoreBtn.classList.add('hidden');
  showLoader();
  try {
    const data = await fetchImages(query, page);
    hideLoader();
    if (data.hits.length > 0) {
      renderGallery(data.hits);
      smoothScroll();
      if (page < totalPages) {
        loadMoreBtn.classList.remove('hidden');
      } else {
        loadMoreBtn.classList.add('hidden');
        iziToast.info({
          title: 'Info',
          message: `We're sorry, but you've reached the end of search results.`,
          position: 'topRight',
        });
      }
    }
  } catch (error) {
    hideLoader();
    iziToast.error({
      title: 'Error',
      message: error.message,
      position: 'topRight',
    });
  }
});
