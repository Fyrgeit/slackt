import { Slackt } from './typesnmethods';

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

        localStorage.setItem('openedFile', JSON.stringify(openedFile));
    }
}

let openButton = document.getElementById('open')!;

openButton.addEventListener('change', async (e) => await open(e));

let openedFile: Slackt = { people: [], families: [] };
let fromLS = localStorage.getItem('openedFile');
if (fromLS) {
    openedFile = JSON.parse(fromLS) || { people: [], families: [] };
}
