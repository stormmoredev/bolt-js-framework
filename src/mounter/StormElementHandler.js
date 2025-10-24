class BoltElementHandler
{
    /**
     * @type {[AttributeHandler]}
     */
    static handlers = [];

    /**
     * @param {BoltComponent }component
     * @param {BoltElement[]} nodes
     */
    static handle(component, elements) {
        for (const node of elements) {
            for (const handler of this.handlers) {
                handler.handle(component, node);
            }
        }
    }
}