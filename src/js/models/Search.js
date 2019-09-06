import axios from 'axios';

 export default class Search {
     constructor(query){
         this.query = query;
     }

  async getResults(){
    const key = '8d395b77b9ce5645626ccae8d7fb1b7d';
    try{
        const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
        this.results = res.data.recipes;
        // console.log(this.results);
    } catch (error){
        alert(error);
    }
}

 }