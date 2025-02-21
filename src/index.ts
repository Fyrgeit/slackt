import { Slackt, DisplayName, FindPerson, GetPerson } from './typesnmethods.js';

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
                `<p>${DisplayName(p, 'long')}</p>`
            );
        });

        openedFile.families.forEach((f) => {
            let husband = f.husband
                ? DisplayName(FindPerson(openedFile!, f.husband))
                : null;
            let wife = f.wife
                ? DisplayName(FindPerson(openedFile!, f.wife))
                : null;
            let children = f.children.map((c) =>
                DisplayName(FindPerson(openedFile!, c))
            );
            familiesSection.insertAdjacentHTML(
                'beforeend',
                `<p>${f.id}: ${husband} + ${wife}${
                    children.length > 0 ? ' = ' + children.join(', ') : ''
                }</p>`
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

const sectionEl = `
    <section><h1>${'Personer'}</h1><main id="${'people'}" /></section>
    <section><h1>${'Familjer'}</h1><main id="${'families'}" /></section>`;
output.insertAdjacentHTML('beforeend', sectionEl);

const peopleSection = document.getElementById('people')!;
const familiesSection = document.getElementById('families')!;

let openedFile: Slackt | null = null;

statusField.innerText = 'Ingen fil öppnad';
