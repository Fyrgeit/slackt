import {
    Slackt,
    open,
    download,
    clear,
    FormatFamily,
    Family,
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
    localStorage.setItem('selectedFamily', target.value);
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
