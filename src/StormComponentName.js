class StormComponentName {
    static getComponentName(element) {
        let tagName = element.ori.tagName.toLowerCase();
        let items = tagName.split('-').slice(1);
        items.forEach((e,i) => {
            items[i] = items[i].charAt(0).toUpperCase() + items[i].slice(1);
        });
        return items.join('');
    }

    static getComponentPropertyName(element) {
        let name = this.getComponentName(element);
        return name.charAt(0).toLowerCase() + name.slice(1);
    }

    static getComponentTagName(component) {
        let name = component.constructor.name;
        let tagNam = "";
        for(let i = 0; i < name.length; i++) {
            if (name.charAt(i) === name.charAt(i).toUpperCase()) {
                if (i > 0) {
                    tagNam += "-";
                }
                tagNam += name.charAt(i).toLowerCase();
            } else {
                tagNam += name.charAt(i);
            }
        }
        return tagNam
    }

    static getTagName(component) {
        return "x-" + this.getComponentTagName(component);
    }
}