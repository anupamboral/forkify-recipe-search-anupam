import View from './view.js';
import icons from 'url:../../img/icons.svg'; //* while importing images or icons we have to mention url: before the path
import previewView from './previewView.js'; //* from lesson 21
import { Fraction } from 'fractional';
//*Lesson 14
class BookmarksView extends View {
  _parentElement = document.querySelector(`.bookmarks__list`);
  errorMessage = `No bookmarks yet. Find a nice recipe and bookmark it :)`;
  message = `No bookmarks yet ,find a nice recipe and bookmark it`;
  _generateMarkup() {
    //*lesson 14
    // return this._data.map(this._generateMarkupPreview).join(``);//* changed in lesson 21
    //*lesson 21
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join(``);
  }
  //*from lesson 22
  addHandlerRender(handler) {
    window.addEventListener(`load`, handler);
  }
}
export default new BookmarksView();
