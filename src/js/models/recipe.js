import axios from "axios";
import { clearLoader } from "../views/base";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(
        `https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
      );
      this.title = res.data.recipe.title;
      this.img = res.data.recipe.image_url;
      this.author = res.data.recipe.publisher;
      this.ingredients = res.data.recipe.ingredients;
      this.url = res.data.recipe.source_url;
      //console.log(res.data);
    } catch (e) {
      console.log("error", e);
      alert("something wrong :( ");
      clearLoader();
    }
  }

  calcTime() {
    //ASSUMPTION - EACH 3 INGREDIENTS TOOK 15 MIN.
    const numImg = this.ingredients.length;
    const periods = Math.ceil(numImg / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    let unitsLong = [
      "tablespoons",
      "tablespoon",
      "teaspoons",
      "teaspoon",
      "ounces",
      "ounce",
      "cups",
      "pounds",
    ];
    let unitsShort = ["tbsp", "tbsp", "tsp", "tsp", "oz", "oz", "cup", "pound"];
    const units = [...unitsShort, 'kg', 'g'];

    const newIngredients = this.ingredients.map((el) => {
      //uniform units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });

      //remove parenthesis
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

      //PARSE INGREDIENTS INTO COUNT , UNIT AND INGREDIENTS
      const arrIng = ingredient.split(" ");
      const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

      let obj , count;
      if(unitIndex > -1){
        //there is a unit
        const arrCount = arrIng.slice(0 , unitIndex);
        if(arrCount.length === 1){
          count = eval(arrIng[0].replace('-' , '+'));
        }
        else{
          count =  eval(arrIng.slice(0 , unitIndex).join('+'));   //eval => 4 + 1/2 => 4.5
        }
        obj = {
          count,
          unit : arrIng[unitIndex],
          ingredient : arrIng.slice(unitIndex+1).join(' ')
        }
      }
      else if(parseInt(arrIng[0] , 10)){
        //there is a number on the first position
        obj = {
          count : parseInt(arrIng[0] , 10),
          unit : '',
          ingredient : arrIng.slice(1).join(' '),
        }
      }
      else if(unitIndex == -1){
        //no unit and no number
        obj = {
          count : 1,
          unit : '',
          ingredient
        }
      }

      return obj;
    });

    this.ingredients = newIngredients;
    //console.log(this.ingredients);
  }

  updateServings(type){
    //serving
    const newServings = type === 'dec' ? this.servings-1 : this.servings+1;

    //ingredients
    this.ingredients.forEach(ing =>{
      ing.count *=  (newServings / this.servings);
    })

    this.servings = newServings;
  }
}
