class SelectedHandler extends AttributeHandler {
    handle(component, element) {
        if (!element.hasAttribute('x-selected')) return;
        const prop = element.getAttribute('x-selected');
        component.bindings.on(prop, () => {
            this.setOption(component, element, prop);
        })
        element.addEventListener('change', e => {
            component[prop] = element.getValue();
        });
        this.setOption(component, element, prop);
    }

    setOption(component, element, prop) {
        element.setValue(component[prop]);
    }
}

(function() {
    StormElementHandler.handlers.push(new SelectedHandler());
})();
