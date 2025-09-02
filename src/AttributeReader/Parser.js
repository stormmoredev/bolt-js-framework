class AttributePropertyValuesParser {
    // x-class="prop1:class1,class2;prop2:class2,class3"
    static getMap(definition) {
        let map = new AttributePropertyValuesMap();
        const propertiesWithValues = definition.split(';');
        for(const propertyWithValues of propertiesWithValues) {
            const propertyWithValuesArray = propertyWithValues.split(":");
            const property = propertyWithValuesArray[0];
            map.addProperty(property);
            if (propertyWithValuesArray.length > 1) {
                map.addPropertyValues(property, propertyWithValuesArray[1].split(','));
            }
        }
        return map;
    }
}