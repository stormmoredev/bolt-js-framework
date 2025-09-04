class ConditionalHandler extends AttributeHandler {
    handle(component, element) {
        if (element.hasAttribute('x-if')) {
            const expression = element.getAttribute('x-if');
            this.onIfChangeAction(component, element, expression);
            for(let prop of StormExpression.getExpressionMembers(expression)) {
                component.bindings.on(prop, () => {
                    this.onIfChangeAction(component, element, expression);
                });
            }
        }
        element.removeAttribute('x-if');
    }

    onIfChangeAction(component, element, expression) {
        const propertyValue = StormExpression.evaluate(expression, component);
        if (propertyValue === true) {
            element.show();
        } else {
            element.hide();
        }
    }
}
(function() {
    StormElementHandler.handlers.push(new ConditionalHandler());
})();
