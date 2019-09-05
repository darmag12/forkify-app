// Global app controller
import axios from 'axios';

async function getResults(query){
    const key = '8d395b77b9ce5645626ccae8d7fb1b7d';
    try{
        const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${query}`);
    
        const recipes = res.data.recipes;
        console.log(recipes);
    } catch (error){
        alert(error);
    }
}
getResults('pizza')

// https://www.food2fork.com/api/search
// 8d395b77b9ce5645626ccae8d7fb1b7d