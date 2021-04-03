export class Queue<T> {
    private maxLength: number
    private data : T[] = []

    constructor(maxLength: number = 0) {
        this.maxLength = maxLength
    }

    get first() {
        return this.data[0]
    }

    get last() {
        return this.data[this.data.length - 1]
    }

    get array() {
        return this.data
    }

    public add(item:T) {
        if(this.maxLength > 0 && this.data.length >= this.maxLength) {
            this.data.pop()
        }
        this.data.unshift(item)
    }
}