import {
    Slackt,
    FormatName,
    FindPerson,
    Person,
    FormatFamily,
    AddPerson,
    FindFamily,
    Family,
    AddFamily,
} from './typesnmethods.js';

async function open(e: Event) {
    if (e.target instanceof HTMLInputElement) {
        const file = e.target.files?.item(0);
        const text = await file?.text();
        if (!file || !text) {
            console.error('äawh');
            return;
        }
        try {
            openedFile = JSON.parse(text);
        } catch (error) {
            console.error('Fel på filen', error);
        }

        if (!openedFile) return;

        refresh();
    }
}

function download() {
    const blob = new Blob([JSON.stringify(openedFile)], {
        type: 'application/json',
    });
    const el = document.createElement('a');
    el.setAttribute('href', window.URL.createObjectURL(blob));

    let d = new Date();
    var datestring =
        d.getFullYear() +
        '-' +
        (d.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        d.getDate().toString().padStart(2, '0') +
        ' ' +
        d.getHours().toString().padStart(2, '0') +
        ':' +
        d.getMinutes().toString().padStart(2, '0');
    const fileName = 'slackt ' + datestring + '.json';

    el.setAttribute('download', fileName);
    el.click();
}

function clear() {
    openedFile = { people: [], families: [] };
    refresh();
}

function refresh() {
    peopleSection.innerHTML = '';
    familiesSection.innerHTML = '';

    localStorage.setItem('openedFile', JSON.stringify(openedFile));

    if (!openedFile) return;

    openedFile.people.forEach((p) => {
        let el = document.createElement('p');
        el.innerHTML = FormatName(p, 'long') ?? '?';
        el.setAttribute('data-id', '' + p.id);
        el.setAttribute('data-type', 'person');
        el.onclick = select;
        peopleSection.append(el);
    });

    openedFile.families.forEach((f) => {
        let el = document.createElement('p');
        el.innerHTML = FormatFamily(openedFile!, f);
        el.setAttribute('data-id', '' + f.id);
        el.setAttribute('data-type', 'family');
        el.onclick = select;
        familiesSection.append(el);
    });
}

function refreshPersonInspector() {
    localStorage.setItem(
        'selectedPerson',
        selectedPerson ? '' + selectedPerson : 'null'
    );
    personInspector.innerHTML = '';

    if (selectedPerson === null) {
        personInspector.innerHTML = 'Välj person';
        return;
    }

    let keys: (keyof Person)[] = [
        'nameFirst',
        'nameLast',
        'nameLastMaiden',
        'dateBirth',
        'dateDeath',
    ];

    let person = FindPerson(openedFile, selectedPerson);

    let formEl = document.createElement('form');
    formEl.id = 'form';
    formEl.onchange = (e) => {
        let target = e.target as HTMLInputElement;
        if (!target) return;
        let key = target.getAttribute('name');
        //@ts-ignore
        if (!key || !keys.includes(key)) return;
        let k = key as
            | 'nameFirst'
            | 'nameLast'
            | 'nameLastMaiden'
            | 'dateBirth'
            | 'dateDeath';
        person[k] = target.value;
        refresh();
    };

    let titleEl = document.createElement('p');
    titleEl.innerHTML = '#' + person.id;
    titleEl.style.gridColumnEnd = 'span 2';
    formEl.append(titleEl);

    keys.forEach((key) => {
        let labelEl = document.createElement('label');
        labelEl.innerHTML = key;
        labelEl.setAttribute('for', key);

        let inputEl = document.createElement('input');
        inputEl.setAttribute('type', 'text');
        inputEl.id = key;
        inputEl.value = '' + person[key];

        formEl.append(labelEl);
        formEl.append(inputEl);
    });

    personInspector.append(formEl);
}

function refreshFamilyInspector() {
    localStorage.setItem(
        'selectedFamily',
        selectedFamily ? '' + selectedFamily : 'null'
    );
    familyInspector.innerHTML = '';

    if (selectedFamily === null) {
        familyInspector.innerHTML = 'Välj familj';
        return;
    }

    let keys: (keyof Family)[] = ['nameLastOverride', 'dateStart'];

    let family = FindFamily(openedFile, selectedFamily);

    let formEl = document.createElement('form');
    formEl.onsubmit = (e) => {
        e.preventDefault();
    };
    formEl.id = 'form';
    formEl.onchange = (e) => {
        let target = e.target as HTMLInputElement;
        if (!target) return;
        let key = target.getAttribute('name');
        //@ts-ignore
        if (!key || !keys.includes(key)) return;
        let k = key as 'nameLastOverride' | 'dateStart';
        family[k] = target.value;
        refresh();
    };

    let titleEl = document.createElement('p');
    titleEl.innerHTML = '#' + family.id;
    titleEl.style.gridColumnEnd = 'span 2';
    formEl.append(titleEl);

    let husbandLabel = document.createElement('label');
    husbandLabel.innerHTML = 'Man';
    formEl.append(husbandLabel);

    let husbandContainer = document.createElement('div');
    husbandContainer.classList.add('hcont');

    let husbandEl = document.createElement('p');
    husbandEl.classList.add('grow');
    husbandEl.innerHTML = family.husband
        ? FormatName(FindPerson(openedFile, family.husband))
        : 'null';
    husbandContainer.append(husbandEl);

    let addHusband = document.createElement('button');
    addHusband.innerHTML = '+';
    addHusband.onclick = () => {
        family.husband = selectedPerson;
        refresh();
        refreshFamilyInspector();
    };
    husbandContainer.append(addHusband);

    let removeHusband = document.createElement('button');
    removeHusband.innerHTML = 'x';
    removeHusband.onclick = () => {
        family.husband = null;
        refresh();
        refreshFamilyInspector();
    };

    husbandContainer.append(removeHusband);

    formEl.append(husbandContainer);

    let wifeLabel = document.createElement('label');
    wifeLabel.innerHTML = 'Fru';
    formEl.append(wifeLabel);

    let wifeContainer = document.createElement('div');
    wifeContainer.classList.add('hcont');

    let wifeEl = document.createElement('p');
    wifeEl.classList.add('grow');
    wifeEl.innerHTML = family.wife
        ? FormatName(FindPerson(openedFile, family.wife))
        : 'null';
    wifeContainer.append(wifeEl);

    let addWife = document.createElement('button');
    addWife.innerHTML = '+';
    addWife.onclick = () => {
        family.wife = selectedPerson;
        refresh();
        refreshFamilyInspector();
    };
    wifeContainer.append(addWife);

    let removeWife = document.createElement('button');
    removeWife.innerHTML = 'x';
    removeWife.onclick = () => {
        family.wife = null;
        refresh();
        refreshFamilyInspector();
    };

    wifeContainer.append(removeWife);

    formEl.append(wifeContainer);

    keys.forEach((key) => {
        let labelEl = document.createElement('label');
        labelEl.innerHTML = key;
        labelEl.setAttribute('for', key);

        let inputEl = document.createElement('input');
        inputEl.setAttribute('type', 'text');
        inputEl.id = key;
        inputEl.value = '' + family[key];

        formEl.append(labelEl);
        formEl.append(inputEl);
    });

    familyInspector.append(formEl);
}

function select(e: MouseEvent) {
    let target = e.target as Element;
    let id = target.attributes.getNamedItem('data-id')?.value;
    let type = target.attributes.getNamedItem('data-type')?.value;

    if (type === 'person') {
        if (id === undefined) {
            selectedPerson = null;
            refreshPersonInspector();
            return;
        }

        selectedPerson = parseInt(id);
        refreshPersonInspector();
    } else if (type === 'family') {
        if (id === undefined) {
            selectedFamily = null;
            refreshFamilyInspector();
            return;
        }

        selectedFamily = parseInt(id);
        refreshFamilyInspector();
    }
}

const openButton = document.getElementById('open')!;
const saveButton = document.getElementById('save')!;
const clearButton = document.getElementById('clear')!;

openButton.addEventListener('change', async (e) => await open(e));
saveButton.onclick = download;
clearButton.onclick = clear;

const peopleSection = document.querySelector('#people .list')!;
const familiesSection = document.querySelector('#families .list')!;
const personInspector = document.getElementById('person')!;
const familyInspector = document.getElementById('family')!;

const addPerson = document.getElementById('addPerson')!;
addPerson.onclick = () => {
    AddPerson(openedFile);
    refresh();
};
const addFamily = document.getElementById('addFamily')!;
addFamily.onclick = () => {
    AddFamily(openedFile);
    refresh();
};

let openedFile: Slackt = { people: [], families: [] };

let selectedPerson: number | null = null;
let sp = localStorage.getItem('selectedPerson');
if (sp !== null && sp !== 'null') selectedPerson = parseInt(sp);

let selectedFamily: number | null = null;
let sf = localStorage.getItem('selectedFamily');
if (sf !== null && sf !== 'null') selectedFamily = parseInt(sf);

let fromLS = localStorage.getItem('openedFile');
if (fromLS) {
    openedFile = JSON.parse(fromLS) || { people: [], families: [] };
}

refresh();
refreshPersonInspector();
refreshFamilyInspector();
