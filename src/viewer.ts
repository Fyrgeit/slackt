import {
    Slackt,
    open,
    download,
    clear,
    FormatFamily,
    Person,
    FindPerson,
    FormatName,
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
        const firstRow = document.createElement('div');
        firstRow.classList.add('hcont');

        if (family.husband !== null) {
            firstRow.append(
                infoBox(FindPerson(openedFile, family.husband), 'husband')
            );
        } else {
            firstRow.append(infoBox('none', 'husband'));
        }

        if (family.wife !== null) {
            firstRow.append(
                infoBox(FindPerson(openedFile, family.wife), 'wife')
            );
        } else {
            firstRow.append(infoBox('none', 'wife'));
        }

        mainArea.append(firstRow);
        mainArea.append(
            (() => {
                const p = document.createElement('p');
                p.classList.add('small');
                p.innerHTML = 'Barn';
                return p;
            })()
        );

        const secondRow = document.createElement('div');
        secondRow.classList.add('hcont');

        family.children.forEach((c) => {
            secondRow.append(infoBox(FindPerson(openedFile, c), 'child'));
        });
        secondRow.append(infoBox('none', 'child'));

        mainArea.append(secondRow);
    }
}

function infoBox(person: Person | 'none', role: 'husband' | 'wife' | 'child') {
    const roleName = {
        husband: 'Man',
        wife: 'Fru',
        child: 'Barn',
    }[role];

    const wrapper = document.createElement('div');
    wrapper.classList.add('vcont');
    if (role !== 'child')
        wrapper.innerHTML = '<p class="small">' + roleName + '</p>';

    const box = document.createElement('div');
    box.classList.add('infoBox');
    if (person === 'none') {
        const button = document.createElement('button');
        button.innerHTML = '➕';
        wrapper.append(button);
        return wrapper;
    }

    box.innerHTML = `<p>${person.nameFirst}</p>`;

    const iconRow = document.createElement('div');
    iconRow.classList.add('hcont');

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '➖';
    iconRow.append(deleteButton);
    const editButton = document.createElement('button');
    editButton.innerHTML = '✏️';
    iconRow.append(editButton);
    const familyButton = document.createElement('button');
    familyButton.innerHTML = '👨‍👩‍👦';
    iconRow.append(familyButton);

    box.append(iconRow);

    wrapper.append(box);
    return wrapper;
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
