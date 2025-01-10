import { Slackt, DisplayName } from './typesnmethods.js';

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
            statusField.innerText = 'Fel på filen';
        }

        if (!openedFile) return;

        statusField.innerText = 'Öppnade ' + file.name;

        openedFile.people.forEach((p) => {
            peopleSection.insertAdjacentHTML(
                'beforeend',
                `<p>${DisplayName(p, 'identifier')}</p>`
            );
        });

        openedFile.relations.forEach((r) => {
            relationsSection.insertAdjacentHTML(
                'beforeend',
                `<p>${r.id}: ${r.people}</p>`
            );
        });
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
    statusField.innerText = 'Downloaded ' + fileName;
}

function clear() {
    openedFile = null;
    statusField.innerText = 'Rensade';
}

const openButton = document.getElementById('open')!;
const saveButton = document.getElementById('save')!;
const clearButton = document.getElementById('clear')!;
const statusField = document.getElementById('statusField')!;

openButton.addEventListener('change', async (e) => await open(e));
saveButton.onclick = download;
clearButton.onclick = clear;

const output = document.getElementById('output')!;

['people', 'relations', 'groups'].forEach((type) => {
    const sectionEl = `<section><h1>${type}</h1><main id="${type}" /></section>`;
    output.insertAdjacentHTML('beforeend', sectionEl);
});

const peopleSection = document.getElementById('people')!;
const relationsSection = document.getElementById('relations')!;
const groupsSection = document.getElementById('groups')!;

let openedFile: Slackt | null = null;

statusField.innerText = 'Ingen fil öppnad';
