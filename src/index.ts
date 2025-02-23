import {
    Slackt,
    FormatName,
    FindPerson,
    Person,
    FormatFamily,
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
    const fileName = 'bruv.json';
    el.setAttribute('download', fileName);
    el.click();
}

function clear() {
    openedFile = null;
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
        el.onclick = select;
        peopleSection.append(el);
    });

    openedFile.families.forEach((f) => {
        let el = document.createElement('p');
        el.innerHTML = FormatFamily(openedFile!, f);
        familiesSection.append(el);
    });
}

function refreshInspector() {
    inspector.innerHTML = '';

    if (selected === null || !openedFile) {
        inspector.innerHTML = 'Välj person/familj';
        return;
    }

    if (selected.type === 'person') {
        let person = FindPerson(openedFile, selected.id);

        let formEl = document.createElement('form');
        formEl.id = 'form';
        formEl.onchange = (e) => {
            let target = e.target;
            //uppdatera openedFile
        };

        let keys: (keyof Person)[] = [
            'nameFirst',
            'nameLast',
            'nameLastMaiden',
            'dateBirth',
            'dateDeath',
        ];

        keys.forEach((key) => {
            let labelEl = document.createElement('label');
            labelEl.innerHTML = key;
            labelEl.setAttribute('for', key);

            let inputEl = document.createElement('input');
            inputEl.setAttribute('type', 'text');
            inputEl.setAttribute('name', key);
            inputEl.value = '' + person[key];

            formEl.append(labelEl);
            formEl.append(inputEl);
        });

        inspector.append(formEl);
    }
}

function select(e: MouseEvent) {
    let target = e.target as Element;
    let id = target.attributes.getNamedItem('data-id')?.value;
    if (id === undefined || openedFile === null) {
        selected = null;
        refreshInspector();
        return;
    }

    selected = { type: 'person', id: parseInt(id) };
    refreshInspector();
}

const openButton = document.getElementById('open')!;
const saveButton = document.getElementById('save')!;
const clearButton = document.getElementById('clear')!;

openButton.addEventListener('change', async (e) => await open(e));
saveButton.onclick = download;
clearButton.onclick = clear;

const peopleSection = document.getElementById('people')!;
const familiesSection = document.getElementById('families')!;
const inspector = document.getElementById('inspector')!;

let openedFile: Slackt | null = null;
let selected:
    | { type: 'person'; id: number }
    | { type: 'family'; id: number }
    | null = null;

let fromLS = localStorage.getItem('openedFile');
if (fromLS) {
    openedFile = JSON.parse(fromLS);
}

refresh();
refreshInspector();
