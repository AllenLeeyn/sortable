// display data in a table. DONE
// sort table by any column. DONE
// use a select input to chose page size
// interactive search
// optimize
// specify field that search is apply to
// custom search operators
// detail view
// css
// url query to determine search conditions
import { 
    insertHeroTable
} from "./insertFunc.js";

export function init(heroes){
    heroes[135].appearance.height = ["5'5", "165 cm"]
    heroes.forEach((hero)=>{
        const heightParam = hero.appearance.height[1].split(' ');
        hero.appearance.height = Number(heightParam[0])
        if (heightParam[1] === 'meters') hero.appearance.height *= 10;

        const weightParam = hero.appearance.weight[1].split(' ');
        hero.appearance.weight = Number(weightParam[0].replaceAll(',',''));
        if (weightParam[1] === 'tons') hero.appearance.weight *= 1000;
    });

    insertHeroTable(heroes);
};
