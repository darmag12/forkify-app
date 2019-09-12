// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView'
import { elements, renderLoader, clearLoader } from './views/base';

/* Global state of the app.
- Search object
- Current recipe object
- Shopping list object
- Liked recipes 
*/
const state = {};

/*  SEARCH CONTROLLER  */
const controlSearch = async() =>{
    // 1) get query from view
    const query = searchView.getInput();
    // console.log(query)

    if (query){
        // 2) new search object and add to state
        state.search = new Search(query);

        // 3) prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResults);

        try{
            // 4) search for recipes
            await state.search.getResults();
    
            // 5) render results to the UI
            clearLoader();
            searchView.renderResults(state.search.results);

        } catch (err){
            alert('Something went wrong with the search...');
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();

});

elements.searchResPages.addEventListener('click', (e) =>{
    const btn = e.target.closest('.btn-inline');
    if (btn){
        const goToPage = parseInt(btn.dataset.goto);
        searchView.clearResults();
        searchView.renderResults(state.search.results, goToPage);
    }
});

/*  RECIPE CONTROLLER  */
const controlRecipe = async () => {
// get id from url
const id = window.location.hash.replace('#', '');
console.log(id);

if (id){
// prepare UI for changes

// create a new recipe object and add it to state
state.recipe = new Recipe(id);

try{
    // get recipe data
    await state.recipe.getRecipe();
    // calculate servings and time
    state.recipe.calcServings();
    state.recipe.calcTime();

    // render recipe
    console.log(state.recipe);
} catch (err){
    alert('Error processing recipe!');
}
}

}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

