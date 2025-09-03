class StormComponentInstantiator {
    static instantiateAll(elements) {
        for(let element of elements) {
            const component = this.instantiate(element);
            Mounter.mount(component);
        }
    }

    static instantiateChildComponent(component, elements) {
        for(let element of elements) {
            let childComponent;
            let componentProp = component[StormComponentName.getComponentPropertyName(element)];
            if (componentProp) {
                childComponent = componentProp;
                childComponent.element = element;
            }
            else {
               childComponent = this.instantiate(element);
            }
            Mounter.mount(childComponent);
        }
    }

    static instantiate(element) {
        let name = StormComponentName.getComponentName(element);
        let component = $.newWithElement(name, element);
        let props = element.getAttribute("x-init");
        if (props) {
            let object = JSON.parse(props);
            for (let [name, value] of Object.entries(object)) {
                component[name] = value;
            }
            element.removeAttribute("x-init");
        }
        component.setElement(element);
        return component;
    }
}