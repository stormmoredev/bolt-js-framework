class AttributePropertyValuesMap {
    data = { }

    addProperty(name)  {
        this.data[name] = [];
    }

    getFirstProperty() {
        const properties = this.getProperties();
        if (properties.length > 0)
            return properties[0];
        return null;
    }

    getProperties() {
        return Object.keys(this.data);
    }

    addPropertyValues(name, values) {
        this.data[name] = values;
    }

    getPropertyValues(name) {
        return this.data[name];
    }

    getPropertyValue(name, defaultValue = null) {
        const values = this.getPropertyValues(name);
        if (values != null && values.length > 0)
            return values[0];
        return defaultValue;
    }
}