import { API_URL } from './config.js';
// import { getJson } from './helper.js';//*refactored in 26th lesson
import { RESULTS_PER_PAGE } from './config.js';
// import { sendJson } from './helper.js';//*refactored in 26th lesson
import { ajax } from './helper.js';
import { key } from './config.js';
//* here in this state object we will keep all the data which is necessary for the frontend , so recipes data which we will fetch and all so the bookmarks , search.

export const state = {
  recipe: {}, //* now it is a empty object but when the data will arrive from the api then we will save it inside this object.
  search: {
    query: ``, //*lesson 13
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
    page: 1,
  },

  bookmarks: [],
};
//*from lesson 25
const createRecipeObject = function (data) {
  let { recipe } = data.data;
  return {
    title: recipe.title,
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    imageUrl: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    ...(recipe.key && { key: recipe.key }), //*for preserving the key in the object
  };
};

//* this function will load the data from the server so it has to be async function and it will be exported from this module because we are gonna call this function inside the controller module .
export const loadRecipes = async function (id) {
  try {
    const data = await ajax(`${API_URL}${id}?key=${key}`); //*refactored getJson func with ajax function.key is added in 26th lesson for showing own recipe icon to user's added recipe.

    // //* saving the arrived data inside or state object
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    console.log(state.recipe);
  } catch (err) {
    console.error(err);
    throw err; //*propagating down the error so we catch this in error in the controller
  }
};

//* for searching recipes
export const loadSearchResults = async function (query) {
  try {
    //* for saving the query name in the state
    state.search.query = query;
    //* fetching the data using the query
    // const data = await getJson(`${API_URL}?search=${query}`);//*refactored in 26th lesson

    const data = await ajax(`${API_URL}?search=${query}&key=${key}`); //*refactored getJson func with ajax function

    //* saving the data in the state object
    state.search.results = data.data.recipes.map(recipe => {
      return {
        title: recipe.title,
        id: recipe.id,
        imageUrl: recipe.image_url,
        publisher: recipe.publisher,
        ...(recipe.key && { key: recipe.key }), //*for preserving the key in the object
      };
    });
    //* resetting the page property(only this line is from lesson 20)
    state.search.page = 1;
  } catch (err) {
    console.error(err);
    throw err; //*propagating down the error so we catch this in error in the controller
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  //* changing the current page number in the state if next or previous page is loaded  by the user using pagination
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

//* from 18 th lesson
export const updateServings = function (newServings) {
  //* updating the ingredients quantity
  state.recipe.ingredients.forEach(ing => {
    ing.quantity =
      ing.quantity === null
        ? null
        : (ing.quantity * newServings) / state.recipe.servings;
  });
  //*updating the servings
  state.recipe.servings = newServings;
};
//*from lesson 22
const persistBookmarks = function () {
  localStorage.setItem(`bookmarks`, JSON.stringify(state.bookmarks));
  // localStorage.removeItem(`bookmarks`);
};

//* for adding a bookmark
export const addBookmark = function (recipe) {
  //*adding bookmark
  state.bookmarks.push(recipe);

  //* mark current recipe as bookmarked(creating a new property inside current recipe which is bookmarked);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

//*for deleting a bookmark
export const deleteBookmark = function (id) {
  //* deleting the bookmark
  const index = state.bookmarks.findIndex(el => el.id === id); //?finding the index of the element
  state.bookmarks.splice(index, 1);
  //*marking current recipe as not bookmarked
  if ((state.recipe.id = id)) state.recipe.bookmarked = false;
  //* updating bookmarks array in localStorage(from lesson 22)
  persistBookmarks();
};

//* for taking bookmarks data out of the localStorage
const init = function () {
  const storage = localStorage.getItem(`bookmarks`);
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

//* for clearing all of the bookmarks at once, but are not gonna use it
const clearBookmarks = function () {
  localStorage.clear();
};

export const uploadRecipe = async function (newRecipe) {
  try {
    // console.log(Object.entries(newRecipe));
    const ingArr = Object.entries(newRecipe)
      .filter(entry => {
        return entry[0].startsWith(`ingredient`) && entry[1] !== ``;
      })
      .map(ing => {
        // const [quantity, unit, description] = ing[1]
        //   .replaceAll(` `, ``)
        //   .split(',');RepReplaced it on lesson 26 and that's because of the replace all method need to remove all of the white spaces and that is not what we want and that is why we are doing the below to make it correct.The trim() method removes whitespace from only both sides of a string.
        const [quantity, unit, description] = ing[1]
          .split(',')
          .map(el => el.trim());
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    //*guard clause for throwing an error if the user does not follow the current format
    if (ingArr.length !== 3)
      throw new Error(`Wrong ingredient format! Please use the correct`);
    const ingredients = ingArr;
    console.log(ingredients);

    const recipe = {
      title: newRecipe.title,
      cooking_time: newRecipe.cookingTime,
      id: newRecipe.id,
      image_url: newRecipe.image,
      ingredients,
      publisher: newRecipe.publisher,
      servings: newRecipe.servings,
      source_url: newRecipe.sourceUrl,
    };

    const data = await ajax(`${API_URL}?key=${key}`, recipe);
    //* saving the data inside the state
    state.recipe = createRecipeObject(data);
    //*adding bookmark
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
