class StormComponent {
    static eventBindings = { }
    bindings
    componentName
    templateName

    constructor(componentName, templateName) {
        this.componentName = componentName;
        this.templateName = templateName;
        this.bindings = new StormBindings(this);
    }

    set(target, prop, value, receiver) {
        let result = Reflect.set(...arguments);
        this[prop] = value;
        this.bindings.componentPropertyChanged(prop);
        return result;
    }

    get(target, prop, receiver) {
        return Reflect.get(target, prop, receiver);
    }

    setElement(element) {
        if (element instanceof StormElement) {
            this.element = element;
        } else {
            this.element = new StormElement(element);
        }
        this.bindings.bind()
    }
    isOnViewport() {
        const y = this.element.ori.getBoundingClientRect().top;
        if (y >= 0 && y <= window.innerHeight) {
            return true;
        }
        return false;
    }
    onViewport(listener) {
        if (this._viewPortEvent == undefined) {
            this._viewPortEvent = {
                triggered: false,
                stop() { this.triggered = true; },
                resume() { this.triggered = false; }
            };
        }
        if (this.isOnViewport() && !this._viewPortEvent.triggered) {
            listener(this._viewPortEvent);
        }
        window.addEventListener('scroll', () => {
            if (this.isOnViewport() && !this._viewPortEvent.triggered) {
                listener(this._viewPortEvent);
            }
        });
    }
    scrollToHash() {
        if (location.hash) {
            this.scrollToId(location.hash.replace('#', ''));
        }
    }
    scrollToId(id) {
        const el = document.getElementById(id);
        if (el == null) return;
        window.scrollTo(0, el.getBoundingClientRect().top);
    }
    onScroll(listener, timeout = 0) {
        window.addEventListener('scroll', (e) => {
            if (timeout > 0) {
                if (this._onScrollTimeout) {
                    clearTimeout(this._onScrollTimeout);
                }
                this._onScrollTimeout = setTimeout(listener, timeout);
            } else {
                listener(e)
            }
        });
    }
    onScrollEnd(listener, pixelsBefore = 50) {
        if (this._scrollEndEvent == undefined) {
            this._scrollEndEvent = {
                notify: true,
                stop() { this.notify = false; },
                resume() { this.notify = true; }
            };
        }
        window.addEventListener('scroll', () => {
            const endOfPage = window.innerHeight + window.scrollY >= document.body.scrollHeight - pixelsBefore;
            if (endOfPage && this._scrollEndEvent.notify) {
                listener(this._scrollEndEvent);
            }
        });
    }
    reload() {
        location.reload();
    }
    exist(path) {
        return this.find(path) != null;
    }
    findAll(path) {
        return StormComponentFinder.findAttributes(this.element, path);
    }
    document() {
        return new StormElement(document);
    }
    find(path) {
        return this.element.find(path);
    }

    remove() { this.element.ori.remove(); }

    submit(serializedForm = null) {
        if (serializedForm == null) {
            serializedForm  = this.getFormData();
        }
        return fetch(serializedForm.action, {
            method: serializedForm.method,
            body: serializedForm.data
        });
    }

    emit(name, data) {
        if (StormComponent.eventBindings[name]) {
            for(let callback of StormComponent.eventBindings[name]) {
                callback(data);
            }
        }
    }

    on(name, callback) {
        if (!StormComponent.eventBindings.hasOwnProperty(name)) {
            StormComponent.eventBindings[name] = [];
        }
        StormComponent.eventBindings[name].push(callback);
    }

    removeChildren() {
        this.element.ori.innerHTML = '';
    }


    appendHtml(html) {
        this.element.appendHtml(html);
    }

    append(component) {
        this.appendTo(this.element.ori, component);
    }

    appendTo(element, component) {
        if (component.template) {
            let template = document.createElement('template');
            template.innerHTML = component.template.trim();
            template = template.content.firstElementChild;
            component.setElement(template);
            Mounter.mount(component);
            element.append(component.element.ori);
        }
        else {
            const componentName = component.templateName
            this.loadTemplateDocFragment(componentName)
                .then((template) => {
                    component.setElement(template);
                    Mounter.mount(component);
                    element.append(component.element.ori);
                })
                .catch(e => {
                    console.error(e);
                });
        }
    }
    showTemplate() {
        let templateElement = this.element.find('template');
        if (templateElement) {
            let element =  new StormElement(templateElement.ori.content.cloneNode(true));
            this.removeChildren();
            Mounter.mountComponentElement(this, element);
            this.element.ori.append(element.ori);
            this.bindings.bind();
        }
    }
    /**
     * @param {string} templateName
     * @returns {Promise<Element>}
     */
    loadTemplateDocFragment(templateName) {
        return new Promise((resolve, reject) => {
            const templateElement =  document.querySelector('[x-for=' +  templateName + ']');
            if (templateElement == null) {
                reject(`Template '${templateName}' not found.`);
            }

            let clone = templateElement.content.cloneNode(true);
            if (templateElement.content.children.length === 1) {
                resolve(templateElement.content.children[0].cloneNode(true));
            } else {
                const div = document.createElement("div");
                for(let child of templateElement.content.children) {
                    div.appendChild(child.cloneNode(true));
                }
                resolve(div);
            }
        });
    }

}