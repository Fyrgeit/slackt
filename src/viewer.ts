import {
    Slackt,
    open,
    download,
    clear,
    FormatFamily,
    Person,
    FindPerson,
} from './typesnmethods.js';

function refresh() {
    familySelectEl.innerHTML =
        '<option value="null" disabled selected hidden>Ingen vald</option>';

    openedFile.families.forEach((f) => {
        const o = document.createElement('option');
        o.innerHTML = FormatFamily(openedFile, f);
        o.value = '' + f.id;
        familySelectEl.append(o);
    });

    familySelectEl.value = '' + selectedFamily;

    mainArea.innerHTML = '';
    let family = openedFile.families.find((f) => f.id === selectedFamily);
    if (family) {
        if (family.husband !== null)
            mainArea.append(infoBox(FindPerson(openedFile, family.husband)));
    }
}

function infoBox(person: Person) {
    const box = document.createElement('div');
    box.classList.add('infoBox');
    box.innerHTML = person.nameFirst;
    return box;
}

const openButton = document.getElementById('open')!;
const saveButton = document.getElementById('save')!;
const clearButton = document.getElementById('clear')!;

openButton.addEventListener('change', async (e) => {
    openedFile = (await open(e, openedFile)) || openedFile;
    refresh();
});
saveButton.onclick = () => download(openedFile);
clearButton.onclick = () => {
    openedFile = clear();
    refresh();
};

const familySelectEl = document.getElementById(
    'selectFamily'
) as HTMLSelectElement;

familySelectEl.onchange = (e) => {
    let target = e.target as HTMLSelectElement;
    selectedFamily = parseInt(target.value);
    localStorage.setItem('selectedFamily', target.value);
    refresh();
};

const mainArea = document.getElementById('viewer')!;

let openedFile: Slackt = { people: [], families: [] };
let fromLS = localStorage.getItem('openedFile');
if (fromLS) {
    openedFile = JSON.parse(fromLS) || { people: [], families: [] };
}

let selectedFamily: number | null = null;
let sf = localStorage.getItem('selectedFamily');
if (sf !== null && sf !== 'null') selectedFamily = parseInt(sf);

refresh();
