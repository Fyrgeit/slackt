export type PersonNew = {
    nameFirst: string | null;
    nameLast: string | null;
    nameLastMaiden: string | null;
    dateBirth: string | null;
    dateDeath: string | null;
};

export type Person = PersonNew & {
    id: number;
    families: number[];
};

export type Family = {
    id: number;
    husband: number | null;
    wife: number | null;
    children: number[];
    nameLastOverride: string | null;
    dateStart: string | null;
};

export type Slackt = {
    people: Person[];
    families: Family[];
};

export function AddPerson(s: Slackt, newPerson: PersonNew) {
    let newId = s.people.length;

    s.people.push({
        id: newId,
        families: [],
        ...newPerson,
    });

    return newId;
}

export function AddPeople(s: Slackt, newPeople: PersonNew[]) {
    return newPeople.map((p) => AddPerson(s, p));
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

export function DisplayName(p: Person, type: 'short' | 'long' = 'short') {
    if (type === 'long')
        return `${p.id}: ${p.nameFirst} ${p.nameLast}${
            p.nameLastMaiden ? ` (f. ${p.nameLastMaiden})` : ''
        }`;

    if (type === 'short') return p.nameFirst;

    return null;
}
