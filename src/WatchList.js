class WatchList {
    addCallback = []
    deleteCallback = []
    items = []

    constructor(items) {
        if (items instanceof Array) {
            this.addAll(items);
        }  
    }

    add(item) {
        this.items.push(item);
        this.addCallback.forEach(callback => {
            callback(item)
        });
    }

    addAll(items) {
        for (let item of items) {
            this.add(item);
        }
    }

    delete(callback) {
        if (typeof callback !== 'function') {
            throw new Error("Callback is not function") 
        }
        let toDelete = [];
        for (let item of this.items) {
            if (callback(item)) {
                toDelete.push(item);
            }
        }
        for (let item of toDelete) {
            let index = this.items.indexOf(item);
            if (index !== -1) {
                this.items.splice(index, 1);
                this.deleteCallback.forEach(callback => callback(item));
            }
        }
    }

    find(callback) {
        if (typeof callback !== 'function') {
            throw new Error("Callback is not function") 
        }
        return this.items.filter(callback);
    }

    count(callback) {
        if (typeof callback !== 'function') {
            return this.items.length;
        }
        return this.items.filter(callback).length
    }

    onAdd(callback) {
        this.addCallback.push(callback)
    }

    onDelete(callback) {
        this.deleteCallback.push(callback)
    }

    *[Symbol.iterator]() {
        for (let item of this.items) {
            yield item;
        }
    }
}