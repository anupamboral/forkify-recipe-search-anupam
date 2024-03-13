import View from './view.js';
import icons from 'url:../../img/icons.svg'; //* while importing images or icons we have to mention url: before the path
import { Fraction } from 'fractional';
//*Lesson 14
class PreviewView extends View {
  _parentElement = document.querySelector(`.bookmarks__list`);

  _generateMarkup() {
    //* this is part is from 19th lesson
    const id = window.location.hash.slice(1);
    //*lesson 14
    return `
    <li class="preview">
            <a  class="preview__link ${
              this._data.id === id ? 'preview__link--active' : ''
            }" href= "#${this._data.id}">
               <figure class="preview__fig">
                 <img src="${this._data.imageUrl}" alt="${this._data.title}" />
               </figure>
               <div class="preview__data">
                 <h4 class="preview__title">${this._data.title}</h4>
                 <p class="preview__publisher">${this._data.publisher}</p>
  
               </div>
               <div class="preview__user-generated ${
                 this._data.key ? `` : `hidden`
               }">
                 <svg>
                   <use href="${icons}#icon-user"></use>
                 </svg>
               </div>
            </a>
    </li>
    `;
  }
}
export default new PreviewView();
