import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

export function renderGallery(images) {
  const gallery = document.querySelector('.gallery');
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
    <a href="${largeImageURL}" class="gallery-item">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      <div class="info">
        <p><b>Likes</b><br>${likes}</p>
        <p><b>Views</b><br>${views}</p>
        <p><b>Comments</b><br>${comments}</p>
        <p><b>Downloads</b><br>${downloads}</p>
      </div>
    </a>
  `
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  new SimpleLightbox('.gallery a').refresh();
}

export function clearGallery() {
  document.querySelector('.gallery').innerHTML = '';
}
