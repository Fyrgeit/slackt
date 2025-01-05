import data from './slackt.js';

type PersonNew = {
    nameFirst: string | null;
    nameGiven: string | null;
    nameLast: string | null;
    nameLastMaiden: string | null;
    dateBirth: string | null;
    dateDeath: string | null;
};

type Person = PersonNew & {
    id: number;
    parents: number[];
    children: number[];
    relationIds: number[];
    groupIds: number[];
};

type Relation = {
    id: number;
    type: string | null;
    people: number[];
    dateStart: string | null;
    dateEnd: string | null;
};

type Group = {
    id: number;
    type: string | null;
    personIds: number[];
    dateStart: string | null;
    dateEnd: string | null;
};

export type Slackt = {
    people: Person[];
    relations: Relation[];
    groups: Group[];
};

let slackt: Slackt = data;

function AddPerson(newPerson: PersonNew) {
    let newId = slackt.people.length;

    slackt.people.push({
        id: newId,
        parents: [],
        children: [],
        relationIds: [],
        groupIds: [],
        ...newPerson,
    });

    return newId;
}

function AddPeople(newPeople: PersonNew[]) {
    return newPeople.map((p) => AddPerson(p));
}

function FindPerson(personId: number, role?: string) {
    let person = slackt.people.find((p) => p.id === personId);
    if (person === undefined)
        throw new Error(`${role || 'Person'} ${personId} does not exist`);
    return person;
}

function FindPeople(personIds: number[], role?: string) {
    return personIds.map((p) => FindPerson(p, role));
}

function GetPerson(personId: number) {
    return slackt.people.find((p) => p.id === personId);
}

function ConnectParents(childId: number, parentIds: number[]) {
    let child = FindPerson(childId, 'Child');
    let parents = FindPeople(parentIds, 'Parent');

    child.parents.push(...parentIds);
    parents.forEach((p) => p.children.push(childId));
}

function AddRelation(personIds: number[], type: 'marriage' | 'formal' | null) {
    let id = slackt.relations.length;
    let people = FindPeople(personIds, 'Person');

    slackt.relations.push({
        id: id,
        type: type,
        people: personIds,
        dateStart: null,
        dateEnd: null,
    });

    people.forEach((p) => p.relationIds.push(id));

    return id;
}

function FindSiblings(personId: number) {
    let person = FindPerson(personId);
    let parents = FindPeople(person.parents, 'Parent');

    return parents
        .map((p) => p.children)
        .reduce((intersection, currentArray) => {
            return intersection.filter((item) => currentArray.includes(item));
        })
        .filter((s) => s !== personId);
}

function FindCousins(personId: number) {
    let person = FindPerson(personId);
    let parents = FindPeople(person.parents, 'Parent');

    return [
        ...new Set(
            FindPeople(parents.map((p) => FindSiblings(p.id)).flat())
                .map((s) => s.children)
                .flat()
        ),
    ];
}

function DisplayName(personId: number, type: 'given' | 'identifier' = 'given') {
    let p = FindPerson(personId);

    if (type === 'given') return p.nameGiven ?? p.nameFirst?.split(' ')[0];

    if (type === 'identifier')
        return `${p.id}: ${p.nameFirst}${
            p.nameGiven ? ` (f. ${p.nameGiven})` : ''
        } ${p.nameLast}${p.nameLastMaiden ? ` (f. ${p.nameLastMaiden})` : ''}`;
}

let out = document.getElementById('out');

slackt.people.forEach((p) => {
    let el = document.createElement('p');
    el.innerText = DisplayName(p.id, 'identifier') ?? '?';
    out?.append(el);
});

console.log(
    'Pappas syskon:',
    FindSiblings(4)
        .map((p) => DisplayName(p))
        .join(', ')
);
console.log(
    'Mammas syskon:',
    FindSiblings(3)
        .map((p) => DisplayName(p))
        .join(', ')
);
console.log(
    'Mina kusiner:',
    FindCousins(0)
        .map((p) => DisplayName(p))
        .join(', ')
);

console.log(
    'Relationer:\n',
    slackt.relations
        .map((r) => r.people.map((p) => DisplayName(p)).join(' + '))
        .join('\n')
);
