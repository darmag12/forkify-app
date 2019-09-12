import { elements } from './base'

// function for getting inputs from the DOM
export const getInput = () => elements.searchInput.value;

// function for clearing inputs in the form
export const clearInput = () => {
    elements.searchInput.value = '';
}

// function for displaying the titles in a limit of 17 characters or less to keep everything on the same line 
const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit){
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit){
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0)
        // return the result
        return `${newTitle.join(' ')} ...`;
    }
    return title;
}

export const clearResults = () => {
    // clear the list and print the new list
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
}

// injects html in the DOM
const renderRecipe = recipe => {
    const markup = `
    <li>
    <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
    </li>
    `
elements.searchResList.insertAdjacentHTML('beforeend', markup);

}

const createButton = (page, type) => `
<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
<span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
<svg class="search__icon">
<use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
</svg>
</button>

`



const renderButtons = (page, numResults, resPerPage) => {
const pages = Math.ceil(numResults / resPerPage);

let button;
if (page === 1 && pages > 1){
  // only button to go to the next page
  button = createButton(page, 'next');
} else if (page < pages){
  // both buttons
  button = `
  ${createButton(page, 'prev')}
  ${createButton(page, 'next')}
  `
} else if (page === pages && pages > 1){
  // only button to go to prev page
  button = createButton(page, 'prev');
}
elements.searchResPages.insertAdjacentHTML('beforeend', button)
}

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // render results of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    // loops over each recipe then calls renderRecipe on each recipe
    recipes.slice(start, end).forEach(el => renderRecipe(el));

    // render pagination buttons
    renderButtons(page, recipes.length, resPerPage)
}