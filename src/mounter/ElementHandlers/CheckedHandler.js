class CheckedHandler extends AttributeHandler{
    handle(component, element) {
        if (!element.hasAttribute('x-checked')) return;
        const propertyName = element.getAttribute('x-checked');
        element.addEventListener('change', e => {
            if (element.isCheckbox()) {
                component[propertyName] = e.ori.target.checked;
            }
            if (element.isRadio()) {
                component[propertyName] = e.ori.target.value;
            }
        });
        component.addToBinding(propertyName, propertyName, element, this.onAction);
        this.onAction(component, element, propertyName);
        element.removeAttribute('x-checked');
    }

    onAction(component, element, propertyName) {
        let value = component[propertyName];
        if (element.isCheckbox()) {
            element.setAttribute('checked', (value === '1' || value === 'on' || value === 'true' || value === true));
        }
        if (element.isRadio() && value === element.getValue()) {
            element.setAttribute('checked', true);
        }
    }
}


(function() {
    StormElementHandler.handlers.push(new CheckedHandler());
})();
