class ConditionalHandler extends AttributeHandler {
    handle(component, element) {
        if (element.hasAttribute('x-if')) {
            const propertyName = element.getAttribute('x-if');
            this.onIfChangeAction(component, element, propertyName);
            component.bindings.on(propertyName, () => {
                this.onIfChangeAction(component, element, propertyName);
            });
        }
        element.removeAttribute('x-if');
        element.removeAttribute('x-if-not');
    }

    onIfChangeAction(component, element, propertyName) {
        const propertyValue = component[propertyName];
        if (!propertyValue) element.hide();
        if (propertyValue) element.show();
    }
}
(function() {
    StormElementHandler.handlers.push(new ConditionalHandler());
})();
