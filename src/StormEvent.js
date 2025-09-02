class StormEvent {
    constructor(event) {
        this.ori = event;
    }
    stop() { this.ori.stopPropagation(); }

    target() { return new StormElement(this.ori.target); }

    preventDefault() {
        this.ori.preventDefault();
    }
    preventWhenKeyIsPressed(keyCode) {
        if (this.ori.keyCode === keyCode)
            this.ori.preventDefault();
    }
    preventWhenKeysArePressed() {
        for(const keyCode of arguments) {
            this.preventWhenKeyIsPressed(keyCode);
        }
    }
    isKeyPressed(key) {
        if (typeof key === 'string')
            return this.ori.key === key;

        return this.ori.keyCode === key;
    }

    hasFiles() {
        return this.ori.target.files.length > 0;
    }
    getFile(index) {
        return this.ori.target.files[index];
    }
}
