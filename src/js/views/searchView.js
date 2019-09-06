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
}

// injects html in the DOM
const renderRecipe = recipe => {
    const markup = `
    <li>
    <a class="results__link" href="${recipe.recipe_id}">
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

export const renderResults = recipes => {
    // loops over each recipe then calls renderRecipe on each recipe
    recipes.forEach(el => renderRecipe(el))
}