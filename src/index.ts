import data from './slackt.js';
import { Slackt, DisplayName } from './typesnmethods.js';

let slackt: Slackt = data;

let out = document.getElementById('out');

slackt.people.forEach((p) => {
    let el = document.createElement('p');
    el.innerText = DisplayName(slackt, p.id, 'identifier') ?? '?';
    out?.append(el);
});

const blob = new Blob(['Hejsan vad trevligt'], { type: 'text/plain' });
const downloadButton = document.getElementById('download');
downloadButton?.setAttribute('href', window.URL.createObjectURL(blob));

let testout = document.getElementById('testout');
if (!testout) throw new Error('Did not find testuut');

let file: Slackt | null = null;

if (!file) {
    testout.innerText = '*Ingen fil öppnad*';
}

const uploadButton = document.getElementById('upload');
if (!!uploadButton) {
    //On upload file
    uploadButton.onchange = async (e) => {
        if (e.target instanceof HTMLInputElement) {
            const text = await e.target.files?.item(0)?.text();
            if (!text) return;
            try {
                file = JSON.parse(text);
                testout.innerText = text;
            } catch (error) {
                testout.innerText = '*Fel på filen*';
            }
        }
    };
}
