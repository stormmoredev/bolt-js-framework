class ClassHandler extends AttributeHandler{
    handle(component, element) {
        if (!element.hasAttribute('x-class')) return;
        const attributeValue = element.getAttribute('x-class');
        const map =  AttributePropertyValuesParser.getMap(attributeValue);
        for(const propertyName of map.getProperties()) {
            this.onAction(component, propertyName, element, attributeValue);
            component.bindings.on(propertyName, () => {
                this.onAction(component, propertyName, element, attributeValue);
            });
        }
        element.removeAttribute('x-class');
    }

    onAction(component, propertyName, element, attributeValue) {
        const propertyValue = component[propertyName];
        const map = AttributePropertyValuesParser.getMap(attributeValue);
        const classes = map.getPropertyValues(propertyName);
        if (propertyValue) { element.addClass(classes); }
        if (!propertyValue) { element.removeClass(classes); }
    }
}

(function() {
    StormElementHandler.handlers.push(new ClassHandler());
})();
