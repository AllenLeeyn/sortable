// display data in a table. DONE
// sort table by any column. DONE
// use a select input to chose page size
// interactive search
// optimize
// specify field that search is apply to
// custom searhc operators
// detail view
// css
// url query to determine search conditions
import { sortTable } from "./sortFunc.js";

const heroTable = document.createElement('table');
const pwrStatsAbrv = {
    'intelligence': 'INT',
    'strength': 'STR',
    'speed': 'SPD',
    'durability': 'DUR',
    'power': 'PWR',
    'combat': 'COM'
}
const headers = [
    '',
    'Name',
    'Full Name',
    'Powerstats',
    'Race',
    'Gender',
    'Height',
    'Weight',
    `Place Of \nBirth`,
    'Alignment'
];

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

    const optionDiv = document.createElement('div');
    optionDiv.className = 'options';
    document.body.appendChild(optionDiv);

    const selectDiv = document.createElement('div');
    const selectLabel = document.createElement('label');
    selectLabel.textContent = 'Show ';
    selectDiv.appendChild(selectLabel);

    const selectInput = document.createElement('select');
    const sizeOptions = [10, 20, 50, 100, 'All'];
    sizeOptions.forEach((size) => {
        const ele = document.createElement('option');
        ele.value = size;
        ele.textContent = `${size} Results`;
        if (size === 20) ele.selected = true;
        selectInput.appendChild(ele);
    });
    selectDiv.appendChild(selectInput);
    optionDiv.appendChild(selectDiv);

    insertHeaders(heroes);
    heroes.forEach((hero) => insertHeroEntries(hero, heroTable));

    document.body.appendChild(heroTable);
};


function insertHeaders(heroes){
    const headerRow = heroTable.insertRow();

    headers.forEach(headerTitle => {
        const th = document.createElement('th');
        th.textContent = headerTitle;
        headerRow.appendChild(th);

        th.addEventListener('click', ()=>{
            sortTable(
                heroes,
                headerTitle,
                heroTable,
                insertHeaders,
                insertHeroEntries
            );
        });
    });
}

function insertHeroEntries(hero){
    const curRow = heroTable.insertRow();

    const iconCell = curRow.insertCell();
    const img = document.createElement('img');
    img.src = hero.images.xs;
    img.alt = hero.name;
    iconCell.appendChild(img);

    const nameCell = curRow.insertCell();
    nameCell.textContent = hero.name;

    const fullNameCell = curRow.insertCell();
    fullNameCell.textContent = hero.biography.fullName;

    const powerStatsCell = curRow.insertCell();
    let strContainer = '';
    Object.entries(hero.powerstats).forEach(([key, value]) => {
        strContainer += `${pwrStatsAbrv[key]}: ${value}\n`;
    });
    powerStatsCell.textContent = strContainer;

    const raceCell = curRow.insertCell();
    raceCell.textContent = hero.appearance.race;

    const genderCell = curRow.insertCell();
    genderCell.textContent = hero.appearance.gender;

    const heightCell = curRow.insertCell();
    heightCell.className = 'height'
    heightCell.textContent = hero.appearance.height;

    const weightCell = curRow.insertCell();
    weightCell.className = 'weight'
    weightCell.textContent = hero.appearance.weight;

    const placeOfBirthCell = curRow.insertCell();
    placeOfBirthCell.textContent = hero.biography.placeOfBirth;

    const alignmentCell = curRow.insertCell();
    alignmentCell.textContent = hero.biography.alignment;
}
