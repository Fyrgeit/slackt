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
        el.innerHTML = DisplayName(p, 'long') ?? '?';
        el.setAttribute('data-id', '' + p.id);
        el.onclick = select;
        peopleSection.append(el);
    });

    openedFile.families.forEach((f) => {
        let husband = f.husband
            ? DisplayName(FindPerson(openedFile!, f.husband))
            : null;
        let wife = f.wife ? DisplayName(FindPerson(openedFile!, f.wife)) : null;
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

function select(e: MouseEvent) {
    let target = e.target as Element;

    console.log(target.attributes.getNamedItem('data-id')?.value);
}

const openButton = document.getElementById('open')!;
const saveButton = document.getElementById('save')!;
const clearButton = document.getElementById('clear')!;

openButton.addEventListener('change', async (e) => await open(e));
saveButton.onclick = download;
clearButton.onclick = clear;

const peopleSection = document.getElementById('people')!;
const familiesSection = document.getElementById('families')!;

let openedFile: Slackt | null = null;

let fromLS = localStorage.getItem('openedFile');
if (fromLS && JSON.parse(fromLS)) {
    openedFile = JSON.parse(fromLS);
    refresh();
}
