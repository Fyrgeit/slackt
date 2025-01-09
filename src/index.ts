import { Slackt } from './typesnmethods.js';

function download() {
    const blob = new Blob([JSON.stringify(file)], { type: 'application/json' });
    const el = document.createElement('a');
    el.setAttribute('href', window.URL.createObjectURL(blob));
    el.setAttribute('download', 'bruv.json');
    el.click();
}

window.onbeforeunload = () => true;

let testout = document.getElementById('testout');
if (!testout) throw new Error('Did not find testout');

let saveButton = document.getElementById('save');
if (!saveButton) throw new Error('Did not find saveButton');
saveButton.onclick = () => download();

let clearButton = document.getElementById('clear');
if (!clearButton) throw new Error('Did not find clearButton');
clearButton.onclick = () => {
    file = null;
    testout.innerText = '*Ingen fil öppnad*';
};

let file: Slackt | null = null;

if (!file) {
    testout.innerText = '*Ingen fil öppnad*';
}

const openButton = document.getElementById('open');
if (!!openButton) {
    //On open file
    openButton.onchange = async (e) => {
        if (e.target instanceof HTMLInputElement) {
            const text = await e.target.files?.item(0)?.text();
            if (!text) {
                console.error('äawh');
                return;
            }
            try {
                file = JSON.parse(text);
                testout.innerText = text;
            } catch (error) {
                testout.innerText = '*Fel på filen*';
            }
        }
    };
}
