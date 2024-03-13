class SearchView {
  _parentElement = document.querySelector('.search');
  //* for receiving the search query entered by the user in the search input field

  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this.clearView();
    return query;
  }
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
  clearView() {
    this._parentElement.querySelector('.search__field').value = ``;
  }
}
export default new SearchView();
