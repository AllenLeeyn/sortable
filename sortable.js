// display data in a table. DONE
// sort table by any column
// use a select input to chose page size
// interactive search
// optimize
// specify field that search is apply to
// custom searhc operators
// detail ciew
// css
// url query to determine search conditions
function getTable(heroes){
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
    
    const heroTable = document.createElement('table');
    const headerRow = heroTable.insertRow();
    const headers = [
        'Icon',
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

    const pwrStatsAbrv = {
        'intelligence': 'INT',
        'strength': 'STR',
        'speed': 'SPD',
        'durability': 'DUR',
        'power': 'PWR',
        'combat': 'COM'
    }

    headers.forEach(headerTitle => {
        const th = document.createElement('th');
        th.textContent = headerTitle;
        headerRow.appendChild(th);
    });

    heroes.forEach((hero) => {
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
        heightCell.textContent = hero.appearance.height.join('\n');

        const weightCell = curRow.insertCell();
        weightCell.textContent = hero.appearance.weight.join('\n');

        const placeOfBirthCell = curRow.insertCell();
        placeOfBirthCell.textContent = hero.biography.placeOfBirth;

        const alignmentCell = curRow.insertCell();
        alignmentCell.textContent = hero.biography.alignment;
    });

    document.body.appendChild(heroTable);
}

export function sortable(heroes){
    getTable(heroes);
};