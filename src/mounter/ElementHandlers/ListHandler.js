class ListHandler extends AttributeHandler{
    attributeName = "x-list";

    handle(component, element) {
        if (!element.hasAttribute(this.attributeName)) return;
        const prop = element.getAttribute(this.attributeName);
        const list = component[prop];
        if (list !== undefined) {
            this.displayList(component, element, list)
            list.onAdd(item => this.displayItem(component, element, item));
            list.onDelete(item => this.deleteItem(item))
        }
        element.removeAttribute(this.attributeName);
    }

    displayList(component, element, list) {
         for (let item of list) {
            this.displayItem(component, element, item)
         }
    }

    displayItem(component, element, item) {
        component.appendTo(element, item);
    }

    deleteItem(item) {
        item.element.remove();
    }
}

(function() {
    StormElementHandler.handlers.push(new ListHandler());
})();
