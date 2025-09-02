class EnterPressedHandler extends AttributeHandler{
    attributeName = "x-enter-pressed";

    handle(component, element) {
        if (!element.hasAttribute(this.attributeName)) return;
        
        const handlerName = element.getAttribute(this.attributeName);
        const handler = component[handlerName];
        if (handler !== undefined) {
            element.addEventListener("keydown", e => {
                if (e.ori.keyCode === 13) {
                    e.source = element;
                    component[handlerName](e);
                }
            });
        } else {
            const componentName = component.constructor.name;
            console.error(`Component '${componentName}' doesn't have '${handlerName}' callback.`);
        }
    }
}

(function() {
    StormElementHandler.handlers.push(new EnterPressedHandler());
})();
