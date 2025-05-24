export type Person = {
    id: number;
    nameFirst: string;
    nameLast: string;
    nameLastMaiden: string;
    dateBirth: string;
    dateDeath: string;
};

export type Family = {
    id: number;
    husband: number | null;
    wife: number | null;
    children: number[];
    nameLastOverride: string;
    dateStart: string;
};

export type Slackt = {
    people: Person[];
    families: Family[];
};

export function AddPerson(s: Slackt) {
    let newId = s.people.length;

    s.people.push({
        id: newId,
        nameFirst: '',
        nameLast: '',
        nameLastMaiden: '',
        dateBirth: '',
        dateDeath: '',
    });

    return newId;
}

export function FindPerson(s: Slackt, personId: number) {
    let person = s.people.find((p) => p.id === personId);
    if (person === undefined)
        throw new Error(`Person ${personId} does not exist`);
    return person;
}

export function FindPeople(s: Slackt, personIds: number[]) {
    return personIds.map((p) => FindPerson(s, p));
}

export function GetPerson(s: Slackt, personId: number) {
    return s.people.find((p) => p.id === personId);
}

export function FormatName(
    p: Person,
    type: 'short' | 'full' | 'extra' = 'short'
) {
    if (type === 'short') return p.nameFirst;

    let full = `${p.nameFirst} ${p.nameLast}${
        p.nameLastMaiden ? ` (f. ${p.nameLastMaiden})` : ''
    }`;

    if (type === 'full') return full;

    if (type === 'extra') return `#${p.id} ${full}`;

    return '';
}

export function FindFamily(s: Slackt, familyId: number) {
    let family = s.families.find((p) => p.id === familyId);
    if (family === undefined)
        throw new Error(`Family ${familyId} does not exist`);
    return family;
}

export function FormatFamily(s: Slackt, f: Family) {
    let husband = f.husband ? FormatName(FindPerson(s, f.husband)) : null;
    let wife = f.wife ? FormatName(FindPerson(s, f.wife)) : null;
    let children = f.children.map((c) => FormatName(FindPerson(s, c)));

    return `#${f.id} ${husband ?? '?'} + ${wife ?? '?'}${
        children.length > 0 ? ' = ' + children.join(', ') : ''
    }`;
}

export function AddFamily(s: Slackt) {
    let newId = s.families.length;

    s.families.push({
        id: newId,
        husband: null,
        wife: null,
        children: [],
        nameLastOverride: '',
        dateStart: '',
    });

    return newId;
}

export function AddPersonToFamily(
    s: Slackt,
    familyId: number,
    personId: number,
    role: 'husband' | 'wife' | 'child'
) {
    let family = s.families.find((f) => f.id === familyId);

    if (!family) throw new Error(`Family ${familyId} does not exist`);

    if (role === 'husband') family.husband = personId;
    if (role === 'wife') family.husband = personId;
    if (role === 'child') family.children.push(personId);

    return family;
}

export function download(openedFile: Slackt) {
    const blob = new Blob([JSON.stringify(openedFile)], {
        type: 'application/json',
    });
    const el = document.createElement('a');
    el.setAttribute('href', window.URL.createObjectURL(blob));

    let d = new Date();
    var datestring =
        d.getFullYear() +
        '-' +
        (d.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        d.getDate().toString().padStart(2, '0') +
        ' ' +
        d.getHours().toString().padStart(2, '0') +
        ':' +
        d.getMinutes().toString().padStart(2, '0');
    const fileName = 'slackt ' + datestring + '.json';

    el.setAttribute('download', fileName);
    el.click();
}

export async function open(e: Event, openedFile: Slackt) {
    if (e.target instanceof HTMLInputElement) {
        const file = e.target.files?.item(0);
        const text = await file?.text();
        if (!file || !text) {
            console.error('äawh');
            return null;
        }
        try {
            openedFile = JSON.parse(text);
        } catch (error) {
            console.error('Fel på filen', error);
        }

        if (openedFile) {
            localStorage.setItem('openedFile', JSON.stringify(openedFile));
            return openedFile;
        }
    }
}

export function clear() {
    localStorage.setItem('openedFile', '{ "people": [], "families": [] }');
    return { people: [], families: [] };
}
