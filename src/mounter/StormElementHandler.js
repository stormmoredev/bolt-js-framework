class StormElementHandler
{
    /**
     * @type {[AttributeHandler]}
     */
    static handlers = [];

    /**
     * @param {StormComponent }component
     * @param {StormElement[]} nodes
     */
    static handle(component, elements) {
        for (const node of elements) {
            for (const handler of this.handlers) {
                handler.handle(component, node);
            }
        }
    }
}