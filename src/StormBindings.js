class StormBindings {
    bindings = [];
    onChangeListeners = {};

    constructor(component) {
        this.component = component;
    }

    on(propertyName, listener) {
        if (!this.onChangeListeners[propertyName]) {
            this.onChangeListeners[propertyName] = [];
        }
        this.onChangeListeners[propertyName].push(listener);
    }

    bind() {
        this.bindElements(this.component.element.ori);
    }

    bindElements(element) {
        for (const child of element.childNodes) {
            if (child.nodeType === Node.TEXT_NODE) {
                let text = child.textContent;
                for (const propName of this.getProps(text)) {
                    this.bindings.push({
                        propName,
                        element: child,
                        text: child.textContent + "",
                    });
                }
                for (const propName of this.getProps(text)) {
                    this.componentPropertyChanged(propName)
                }
            }
            else if (child.nodeType === Node.ELEMENT_NODE) {
                if (child.tagName === "INPUT" || child.tagName === "TEXTAREA") {
                    let val = child.value;
                    let props = this.getProps(val);
                    if (props.length === 1) {
                        let propName = props[0];
                        this.bindings.push({
                            propName,
                            element: child,
                            text: child.value,
                        });
                        child.value = this.component[propName];
                        child.addEventListener('input', () => {
                            this.component[propName] = child.value;
                            this.componentPropertyChanged(propName);
                        });
                    }
                }
                else {
                    this.bindElements(child)
                }

            }
        }
    }

    getProps(text) {
        let r = new RegExp("{{\s*(.*?)\s*}}", "g");
        return [...text.matchAll(r)].map(m => m[1]).map(m => m.trim());
    }

    componentPropertyChanged(propName) {
        Array.from(this.bindings)
            .filter(b => b.propName === propName)
            .forEach(b => {
                let text = b.text;
                let props = this.getProps(b.text);
                for (let propName of props) {
                    let regex = new RegExp("{{\\s*" + propName + "\\s*}}", "g");
                    text = text.replace(regex, this.component[propName]);
                }
                if (b.element.tagName === 'INPUT' || b.element.tagName === 'TEXTAREA') {
                    b.element.value = text;
                }
                else {
                    b.element.textContent = text;
                }
            });

        if (this.onChangeListeners[propName]) {
            Array.from(this.onChangeListeners[propName]).forEach(b => {
                b(propName, this.component[propName]);
            })
        }
    }
}

