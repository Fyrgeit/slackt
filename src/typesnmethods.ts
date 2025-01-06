export type PersonNew = {
    nameFirst: string | null;
    nameGiven: string | null;
    nameLast: string | null;
    nameLastMaiden: string | null;
    dateBirth: string | null;
    dateDeath: string | null;
};

export type Person = PersonNew & {
    id: number;
    parents: number[];
    children: number[];
    relationIds: number[];
    groupIds: number[];
};

export type Relation = {
    id: number;
    type: string | null;
    people: number[];
    dateStart: string | null;
    dateEnd: string | null;
};

export type Group = {
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

export function AddPerson(s: Slackt, newPerson: PersonNew) {
    let newId = s.people.length;

    s.people.push({
        id: newId,
        parents: [],
        children: [],
        relationIds: [],
        groupIds: [],
        ...newPerson,
    });

    return newId;
}

export function AddPeople(s: Slackt, newPeople: PersonNew[]) {
    return newPeople.map((p) => AddPerson(s, p));
}

export function FindPerson(s: Slackt, personId: number, role?: string) {
    let person = s.people.find((p) => p.id === personId);
    if (person === undefined)
        throw new Error(`${role || 'Person'} ${personId} does not exist`);
    return person;
}

export function FindPeople(s: Slackt, personIds: number[], role?: string) {
    return personIds.map((p) => FindPerson(s, p, role));
}

export function GetPerson(s: Slackt, personId: number) {
    return s.people.find((p) => p.id === personId);
}

export function ConnectParents(
    s: Slackt,
    childId: number,
    parentIds: number[]
) {
    let child = FindPerson(s, childId, 'Child');
    let parents = FindPeople(s, parentIds, 'Parent');

    child.parents.push(...parentIds);
    parents.forEach((p) => p.children.push(childId));
}

export function AddRelation(
    s: Slackt,
    personIds: number[],
    type: 'marriage' | 'formal' | null
) {
    let id = s.relations.length;
    let people = FindPeople(s, personIds, 'Person');

    s.relations.push({
        id: id,
        type: type,
        people: personIds,
        dateStart: null,
        dateEnd: null,
    });

    people.forEach((p) => p.relationIds.push(id));

    return id;
}

export function FindSiblings(s: Slackt, personId: number) {
    let person = FindPerson(s, personId);
    let parents = FindPeople(s, person.parents, 'Parent');

    return parents
        .map((p) => p.children)
        .reduce((intersection, currentArray) => {
            return intersection.filter((item) => currentArray.includes(item));
        })
        .filter((s) => s !== personId);
}

export function FindCousins(s: Slackt, personId: number) {
    let person = FindPerson(s, personId);
    let parents = FindPeople(s, person.parents, 'Parent');

    return [
        ...new Set(
            FindPeople(s, parents.map((p) => FindSiblings(s, p.id)).flat())
                .map((s) => s.children)
                .flat()
        ),
    ];
}

export function DisplayName(
    s: Slackt,
    personId: number,
    type: 'given' | 'identifier' = 'given'
) {
    let p = FindPerson(s, personId);

    if (type === 'given') return p.nameGiven ?? p.nameFirst?.split(' ')[0];

    if (type === 'identifier')
        return `${p.id}: ${p.nameFirst}${
            p.nameGiven ? ` (f. ${p.nameGiven})` : ''
        } ${p.nameLast}${p.nameLastMaiden ? ` (f. ${p.nameLastMaiden})` : ''}`;
}
