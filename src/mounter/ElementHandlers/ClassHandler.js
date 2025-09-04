class ClassHandler extends AttributeHandler {
    handle(component, element) {
        if (!element.hasAttribute('x-class')) return;
        const attributeValue = element.getAttribute('x-class');
        let conditions = this.getClassConditions(attributeValue);
        for(let condition of conditions) {
            this.evaluate(component, element, condition.expression, condition.className)
            let props = StormExpression.getExpressionMembers(condition.expression);
            for(let prop of props) {
                component.bindings.on(prop, () => {
                    this.evaluate(component, element, condition.expression, condition.className)
                })
            }
        }
        element.removeAttribute('x-class');
    }

    evaluate(component, element, expression, className) {
        let result = StormExpression.evaluate(expression, component);
        if (result === true) { element.addClass(className); }
        else { element.removeClass(className); }
    }

    //prop1 == true and prop2 == 'on': class1, prop3 == 'off' : class2
    getClassConditions(attribute) {
        let result = [];
        let classExpressions = attribute.split(',');
        for(let classExpression of classExpressions) {
            let [expression, className] = classExpression.split(":");
            if (!expression || !className) throw new Error(`Invalid class expression ${classExpression}'`);
            expression = expression.trim();
            className = className.trim();
            result.push({ expression, className });
        }
        return result;
    }
}

(function() {
    StormElementHandler.handlers.push(new ClassHandler());
})();
