type CamelotNumbers = 1|2|3|4|5|6|7|8|9|10|11|12
type Notes = 'Ab'|'Eb'|'Bb'|'F'|'C'|'G'|'D'|'A'|'E'|'B'|'F#'|'Db'
type CamelotCell = [CamelotNumbers, 'A'|'B']
type MusicalCell = [Notes, 'Minor'|'Major']

export class Key {
    public camelot: CamelotCell
    public musical: MusicalCell
    public numeric: number

    static camelotWheel : CamelotCell[] = [
        [1, 'B'], [1, 'A'],
        [2, 'B'], [2, 'A'],
        [3, 'B'], [3, 'A'],
        [4, 'B'], [4, 'A'],
        [5, 'B'], [5, 'A'],
        [6, 'B'], [6, 'A'],
        [7, 'B'], [7, 'A'],
        [8, 'B'], [8, 'A'],
        [9, 'B'], [9, 'A'],
        [10, 'B'], [10, 'A'],
        [11, 'B'], [11, 'A'],
        [12, 'B'], [12, 'A']
    ]
    static musicalWheel : MusicalCell[] = [
        ['Ab', 'Major'], ['Ab', 'Minor'],
        ['Eb', 'Major'], ['Eb', 'Minor'],
        ['Bb', 'Major'], ['Bb', 'Minor'],
        ['F', 'Major'], ['F', 'Minor'],
        ['C', 'Major'], ['C', 'Minor'],
        ['G', 'Major'], ['G', 'Minor'],
        ['D', 'Major'], ['D', 'Minor'],
        ['A', 'Major'], ['A', 'Minor'],
        ['E', 'Major'], ['E', 'Minor'],
        ['B', 'Major'], ['B', 'Minor'],
        ['F#', 'Major'], ['F#', 'Minor'],
        ['Db', 'Major'], ['Db', 'Minor']
    ]
    constructor(numeric: number) {
        this.camelot = Key.camelotWheel[numeric]
        this.musical = Key.musicalWheel[numeric]
        this.numeric = numeric
    }

    public toString(): string {
        return `${this.camelot[0]}${this.camelot[1]}`
    }
}