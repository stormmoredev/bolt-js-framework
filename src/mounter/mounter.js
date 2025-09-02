class Mounter
{
    static mount(component) {
        if (component == null) return;
        if (component.init) component.init();

        let elements = StormComponentFinder.findAttributes(component.element);
        StormElementHandler.handle(component, elements);

        this.installChildComponents(component);

        this.#runPlugins(component, component.element);

        if (component.initialized) component.initialized();
    }

    static mountComponentElement(component, element) {
        if (component == null) return;

        let elements = StormComponentFinder.findAttributes(element);
        StormElementHandler.handle(component, elements);

        this.installChildComponents(component);
        
        this.#runPlugins(component, element);
    }

    static installChildComponents(component) {
        let elements = StormComponentFinder.find(component);
        StormComponentInstantiator.instantiateChildComponent(component, elements);
    }

    static #runPlugins(component, element) {
        for(let plugin of $.plugins) {
            plugin(component, element);
        }
    }
}