class PropHandler {

    propAttributeName = "x-prop";
    propUpAttributeName = "x-prop-up";
    propElAttributeName = "x-prop-element"

    handle(component, element) {
        if (element.hasAttribute(this.propAttributeName)) {
            const propertyName = element.getAttribute(this.propAttributeName);
            this.onAction(component, element, propertyName);
            component.addToBinding(propertyName, propertyName, element, this.onAction);
            this.onKeyDown(component, element, propertyName);
            element.removeAttribute(this.propAttributeName);
        }

        if (element.hasAttribute(this.propUpAttributeName)) {
            const propertyName = element.getAttribute(this.propUpAttributeName);
            let value = element.getValue();
            if (!isNaN(value))
                value = Number(value);
            component[propertyName] = value;
            component.broadcastHtmlBindings(propertyName, element);
            component.addToBinding(propertyName, propertyName, element, this.onAction);
            this.onKeyDown(component, element, propertyName);
            element.removeAttribute(this.propUpAttributeName);
        }

        if (element.hasAttribute(this.propElAttributeName)) {
            const propertyName = element.getAttribute(this.propElAttributeName);
            component[propertyName] = element;
            element.removeAttribute(this.propElAttributeName);
        }
    }

    onKeyDown(component, element, propertyName) {
        element.addEventListener('keyup', () => {
            component[propertyName] = element.getValue();
            component.broadcastHtmlBindings(propertyName, element);
        })
    }

    onAction(component, element, propertyName) {
        const propertyValue = component[propertyName];
        if (propertyValue === undefined) return;
        if (propertyValue instanceof Array) {
            for(const child of propertyValue) {
                component.appendTo(element.ori, child);
            }
        } else {
            element.setValue(propertyValue);
        }
    }
}

(function() {
    StormElementHandler.handlers.push(new PropHandler());
})();
