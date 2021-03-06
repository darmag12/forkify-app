// Global app controller
// All file imports
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
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

// triggers controll search on submit
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

// alows us to do pagination
elements.searchResPages.addEventListener('click', (e) =>{
    const btn = e.target.closest('.btn-inline');
    if (btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.results, goToPage);
    }
});

/*  RECIPE CONTROLLER  */
const controlRecipe = async () => {
// get id from url
const id = window.location.hash.replace('#', '');

if (id){
// prepare UI for changes
recipeView.clearRecipe();
renderLoader(elements.recipe);

// highlight selected search item
if (state.search) searchView.highlightSelected(id);

// create a new recipe object and add it to state
state.recipe = new Recipe(id);

try{
    // get recipe data and parse ingredients
    await state.recipe.getRecipe();
    state.recipe.parseIngredients();

    // calculate servings and time
    state.recipe.calcServings();
    state.recipe.calcTime();

    // render recipe
    clearLoader();
    recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    
} catch (err){
    alert('Error processing recipe!');
    console.log(err)
}

}

}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
// a much better way of using one handler for multiple events
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/* LIST CONTROLLER */
const controlList = () => {
    // create a new list if there is none yet
    if(!state.list) state.list = new List();

    // clear the current shopping list before adding another one
    listView.clearList();

    // add each ingredients to the list and UI
    state.recipe.ingredients.forEach(el => {
      const item = state.list.addItem(el.count, el.unit, el.ingredient);
      listView.renderItem(item);
    })
};




/* LIKE CONTROLLER*/
const controlLike = () => {
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // user has NOT yet liked current recipe
    if(!state.likes.isLiked(currentID)){
        // add like to the state 
        const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img);

        // toggle the like button
        likesView.toggleLikeBtn(true);

        // add like to UI list
        likesView.renderLike(newLike);

        // user HAS liked current recipe
    } else {
        // remove like from state
        state.likes.deleteLike(currentID);

        // toggle the like button
        likesView.toggleLikeBtn(false);

        // remove like from the UI list
        likesView.deleteLike(currentID)
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}





// show favourite recipes even when the page reloads
window.addEventListener('load', () => {
    // create a new empty likes object
    state.likes = new Likes();

    // restore the likes in local storage back to the likes array
    state.likes.readStorage();
    
    // toggle like menu button based on the length of likes array
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});





// handle delete and update list item
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    
    // handle tghe delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        // delete from state
        state.list.deleteItem(id);

        // delete from UI
        listView.deleteItem(id);

        // handle count update
    } else if(e.target.matches('.shopping__count-value')){
        // get value from UI
        const val = parseFloat(e.target.value);
        // update value on the state
        state.list.updateCount(id, val);

    }
});





// handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    // this will turn out to be true if a click is triggered in the '.btn-decrease' class or any of it's child which is the purpose of the astric *
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        // decrease btn is clicked
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);

        } else {
            alert('Sorry you can only serve upto a minimum of 1 servings');
        }

    } else if(e.target.matches('.btn-increase, .btn-increase *')){
        // increase btn is clicked
        state.recipe.updateServings('inc');

        recipeView.updateServingsIngredients(state.recipe);

    } else if ( e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        // add ingredients to shopping list
        controlList();
        
    } else if (e.target.matches('.recipe__love, .recipe__love *')){
        // like controler
        controlLike();

    }
});

