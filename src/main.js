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
      loadMoreBtn.classList.remove('hidden');
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
  page += 1;
  loadMoreBtn.disabled = true;
  showLoader();
  try {
    const data = await fetchImages(query, page);
    hideLoader();
    if (data.hits.length > 0) {
      renderGallery(data.hits);
      smoothScroll();
      loadMoreBtn.disabled = false;
    } else {
      iziToast.info({
        title: 'Info',
        message: 'No more images to load.',
        position: 'topRight',
      });
      loadMoreBtn.classList.add('hidden');
    }
  } catch (error) {
    hideLoader();
    iziToast.error({
      title: 'Error',
      message: error.message,
      position: 'topRight',
    });
    loadMoreBtn.disabled = false;
  }
});
