import View from './view.js';
import icons from 'url:../../img/icons.svg'; //* while importing images or icons we have to mention url: before the path
import previewView from './previewView.js'; //* from lesson 21
import { Fraction } from 'fractional';

class ResultsView extends View {
  _parentElement = document.querySelector(`.results`);
  errorMessage = `Can't find any recipe with your query! Please try again!`;
  message = ``;
  _generateMarkup() {
    //*lesson 14
    // return this._data.map(this._generateMarkupPreview).join(``);//* changed in lesson 21
    //*lesson 21
    return this._data.map(result => previewView.render(result, false)).join(``);
  }
}
export default new ResultsView();
