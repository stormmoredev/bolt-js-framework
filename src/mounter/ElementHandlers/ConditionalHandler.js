class ConditionalHandler extends AttributeHandler {
    handle(component, element) {
        if (element.hasAttribute('x-if')) {
            const propertyName = element.getAttribute('x-if');
            this.onIfChangeAction(component, element, propertyName);
            component.addToBinding(propertyName, propertyName, element, this.onIfChangeAction);
        }
        if (element.hasAttribute('x-if-not')) {
            const propertyName = element.getAttribute('x-if-not');
            this.onIfNotAction(component, element, propertyName);
            component.addToBinding(propertyName, propertyName, element, this.onIfNotAction);
        }
        element.removeAttribute('x-if');
        element.removeAttribute('x-if-not');
    }

    onIfChangeAction(component, element, propertyName) {
        const propertyValue = component[propertyName];
        if (!propertyValue) element.hide();
        if (propertyValue) element.show();
    }
    onIfNotAction(component, element, propertyName) {
        const propertyValue = component[propertyName];
        if (!propertyValue) element.show();
        if (propertyValue) element.hide();
    }
}
(function() {
    StormElementHandler.handlers.push(new ConditionalHandler());
})();
