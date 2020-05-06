import axios from 'axios';



export default class Search{
    constructor(query){
        this.query = query;
    }

    async getResults(){
        try{
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
            this.recipes = res.data.recipes;
    
        }
        catch(e){
            console.log("Error " , e);
        }
    }
    
}

