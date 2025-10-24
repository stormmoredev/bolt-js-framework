function $(...args) {
    if (!(this instanceof $)) {
        if (args[0] instanceof Array && args.length === 1) {
            for (let item of args[0]) {
                $.add(item);
            }
            return;
        }
        let component = args[0];
        let name = component.name;
        if ($.components[name] !== undefined) {
            return $.new(...args);
        }
        else  {
            $.add(component);
        }
    }
}

$.mode = "prod";
$.plugins = [];
$.components = {};

$.getCookie = function(cookieName) {
    let name = cookieName + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}

/**
 * return obj property or default if undefined
 * @param name - parameter name
 * @param obj - object
 * @param def - default value
 */
$.getFromOptional = function(name, obj, def) {
    if (obj != null && obj[name] !== undefined) {
        return obj[name];
    }
    return def;
}

$.app  = function() {
    const elements = BoltComponentFinder.find();
    BoltComponentInstantiator.instantiateAll(elements);
}

$.addPlugin = function(callback) {
    this.plugins.push(callback);
}

$.new = function(...args) {
    let builderName = args[0];
    if (builderName instanceof Function) {
        builderName = builderName.name;
    }
    if (!this.components[builderName]) {
        console.error("Component '" + builderName + "' not found!. Did you forget to register it ?");
        return;
    }

    try {
        let component = new BoltComponent();
        component = new Proxy(component, component);
        args.shift();
        args.unshift(component)
        new $.components[builderName](...args);
        component.templateName = builderName;
        component.componentName = builderName;
        return component;
    } catch(e) {
        console.error(`Can't instantiate component '${name}'.`);
        return null;
    }
}

$.newWithElement = function(name, element) {
    if (!this.components[name]) {
        console.error("Component '" + name + "' not found!. Did you forget to register it ?");
        return;
    }

    let component = new BoltComponent();
    component.element = element;
    component = new Proxy(component, component);
    new $.components[name](component);
    component.templateName = name;
    component.componentName = name;
    return component;
}

$.add = function(component) {
    let name = component.name;
    $.components[name] = component;
}

function Component(templateName) {
    this.templateName = templateName;
}

document.addEventListener("DOMContentLoaded", function() {
    $(Component)
    $.app();
});