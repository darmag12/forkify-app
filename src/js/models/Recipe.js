import axios from 'axios'
import { key } from '../config';

export default class Recipe {
    constructor(id){
        this.id = id;
    }
    
    async getRecipe(){
        try{
            const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
            console.log(res);
        } catch (error){
            console.log(error);
            alert('Something went wrong :(');
        }
    }

    calcTime(){
        // Assuming that we need 15 minutes for every three ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings(){
        this.servings = 4;
    }

    parseIngredients(){
        const newIngredients = this.ingredients.map(el => {
            // 1) uniform units
                const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
                const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
                let ingredients = el.toLowerCase();
                unitsLong.forEach((unit, i) => {
                    ingredients = ingredients.replace(unit, unitsShort[i]);
                });
            // 2) Remove parenthesis
                ingredients = ingredients.replace(/ *\([^)]*\) */g, ' ');

            // 3) parse ingredients into count, unit and ingredient
            return ingredients;
        });
        this.ingredients = newIngredients;
    }
}