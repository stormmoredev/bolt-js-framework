class StormComponentFinder {

    /**
     * @param {document|StormElement|StormComponent} parent
     * @returns {StormElement[]}
     */
    static find(parent = null) {
        let element = parent;
        if (element == null) {
            element = document.body;
        }
        if (parent != null && parent.element != null && parent.element.ori != null) {
            element = parent.element.ori;
        }
        if (parent instanceof StormElement) {
            element = parent.ori;
        }
        let items = Array.from(element.querySelectorAll("*"))
            .filter(el => el.tagName.toLowerCase().startsWith('x-'))
            .filter(el => {
                let closest = this.closestStormComponent(el);
                return (closest == null || closest == element) && el.closest('template') == null
            });
        return Array.from(items, x => new StormElement(x));
    }

    /**
     * @param {StormElement} element
     * @returns {StormElement[]}
     */
    static findAttributes(element, query = "*") {
        let attributedNode = Array.from(element.ori.querySelectorAll(query))
            .filter(n => this.#hasAttribute(n))
            .filter(n => {
                const closest = this.closestStormComponent(n);
                return (closest == null || closest == element.ori) && n.closest('template') == null
            });
        if (this.#hasAttribute(element.ori)) {
            attributedNode.push(element.ori);
        }
        return Array.from(attributedNode, (i) => new StormElement(i));
    }

    static #hasAttribute(node) {
        if (node.attributes == null) return false;
        return Array
            .from(node.attributes)
            .filter(({name}) => name.startsWith("x-"))
            .length;
    }

    static closestStormComponent(el) {
        let i = el.parentElement;
        while(i) {
            let name = i.tagName.toLowerCase();
            if (name.startsWith('x-')) {
                return i;
            }
            i = i.parentElement;
        }

        return null;
    }
}