class BoltElement {
    constructor(htmlElement) {
        this.ori = htmlElement;
    }
    id() {
        return this.ori.id;
    }
    href() {
        if (this.is('a')) {
            return this.ori.getAttribute('href');
        }
        return this.ori.getAttribute('x-href');
    }
    redirect() {
        window.location = this.href();
    }
    disable() {
        this.ori.disabled = true;
    }
    enable() {
        this.ori.disabled = false;
    }
    hasAttribute(name) {
        return this.ori.hasAttribute(name);
    }
    getAttribute(name) {
        return this.ori.getAttribute(name);
    }
    setAttribute(name, value) {
        if (name.toLowerCase() === 'checked') {
            this.ori.checked = value === true;
        }
        else {
            this.ori.setAttribute(name, value);
        }
    }
    removeAttribute(name) {
        return this.ori.removeAttribute(name);
    }
    addClass(className) {
        this.ori.classList.add(className);
        return this;
    }
    hasClass(name) {
        return this.ori.classList.contains(name);
    }
    removeClass(className) {
        this.ori.classList.remove(className);
        return this;
    }
    on(eventName, listener) {
        this.addEventListener(eventName, listener);
    }
    addEventListener(eventName, listener) {
        this.ori.addEventListener(eventName, e => { listener(new BoltEvent(e), this) });
        return this;
    }
    addEventListenerOn(eventName, path, listener) {
        const el = this.find(path);
        if (el == null) return this;

        el.addEventListener(eventName, listener);
        return this;
    }
    addEventListenerOnAll(eventName, path, listener) {
        const elements = this.findAll(path);
        elements.forEach(el => {
            el.addEventListener(eventName, listener);
        });
        return this;
    }
    loaded(listener) {
        if (this.ori.complete) {
            listener();
        } else {
            this.addEventListener('load', listener);
        }
        return this;
    }

    focus() {
        this.ori.focus();
        return this;
    }
    isFocused() {
        return this.ori == document.activeElement;
    }
    setEditable(val) {
        this.ori.contentEditable = val;
    }
    scrollCenter() {
        this.ori.scrollIntoView({block: 'center'});
        return this;
    }
    scrollTop(offset = 0) {
        const top = this.ori.offsetTop;
        window.scrollTo(0, top + offset);
        //this.ori.scrollIntoView({block: 'start'});
        return this;
    }
    removeStyleProperty(name) {
        this.ori.style.removeProperty(name);
    }
    setMinWidth(width, unit = 'px') {
        this.ori.style.minWidth = width + unit;
    }
    setWidth(width, unit = 'px') {
        this.ori.style.width = width + unit;
        return this;
    }
    setMinHeight(width, unit = 'px') {
        this.ori.style.minHeight = width + unit;
    }
    setHeight(height, unit = 'px') {
        this.ori.style.height = height + unit;
        return this;
    }
    setHeightToScroll() {
        this.ori.style.height = 'auto';
        this.ori.style.height = this.ori.scrollHeight + "px";
    }
    submit() {
        this.ori.submit();
    }
    getWidth() {
        return this.ori.offsetWidth;
    }
    getHeight() {
        return this.ori.offsetHeight;
    }

    getScrollHeight() {
        return this.ori.scrollHeight;
    }

    show(visible = true) {
        if (visible) {
            this.ori.style.removeProperty('display');
        } else {
            this.hide();
        }
        return this;
    }
    hide() {
        this.ori.style.display = 'none';
    }
    formData() {
        return new FormData(this.ori);
    }
    getAction() {
        return this.ori.getAttribute('action');
    }

    getMethod() {
        return this.ori.getAttribute('method');
    }
    serialize() {
        return {
            action: this.getAction(),
            method: this.getMethod(),
            data: this.formData()
        }
    }
    clear() {
        const tagName = this.ori.tagName.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea') {
            this.ori.value = "";
        }
        if (tagName === 'img') {
            this.ori.setAttribute('src', "");
        }
        else {
            this.ori.innerHTML = "";
        }
        return this;
    }
    setValue(value) {
        const tagName = this.ori.tagName.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
            this.ori.value = value;
        }
        return this;
    }
    getValue() {
        const tagName = this.ori.tagName.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
            return this.ori.value;
        }
    }

    is(name) {
        if (typeof name == 'string' && this.ori.tagName.toLowerCase() === name.toLowerCase()) {
            return true;
        }
    }
    isCheckbox() {
        return this.is('input') && this.ori.type === 'checkbox';
    }
    isRadio() {
        return this.is('input') && this.ori.type === 'radio';
    }
    isChecked() {
        return this.ori.checked;
    }

    tag() {
        return this.ori.tagName.toLowerCase();
    }
    count() {
        return this.ori.childElementCount;
    }

    find(path) {
        const htmlElement = this.ori.querySelector(path);
        if (htmlElement == null) return;

        return new BoltElement(htmlElement);
    }
    findAll(path) {
        const elements = [];
        const htmlElements = this.ori.querySelectorAll(path);
        htmlElements.forEach((htmlElement) => {
            elements.push(new BoltElement(htmlElement));
        });
        return elements;
    }
    index() {
        const parent = this.parent();
        if (parent == null) return -1;
        return Array.from(parent.ori.children).indexOf(this.ori);
    }
    remove() {
        this.ori.remove();
    }
    closest(path) {
        return new BoltElement(this.ori.closest(path));
    }
    parent() {
        return new BoltElement(this.ori.parentElement);
    }
    prev() {
        if (this.ori.previousElementSibling)
            return new BoltElement(this.ori.previousElementSibling);
        return null;
    }
    next() {
        if (this.ori.nextElementSibling)
            return new BoltElement(this.ori.nextElementSibling);
        return null;
    }
    setHtml(html) {
        this.ori.innerHTML = html;
    }
    append(element) {
        this.ori.append(element);
        return this;
    }
    appendHtml(html) {
        const el = document.createRange().createContextualFragment(html);
        let componentElements = BoltComponentFinder.find(el);
        BoltComponentInstantiator.instantiateAll(componentElements);
        this.ori.append(el);
    }
}