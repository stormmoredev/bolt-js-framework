class GenericEventHandler extends AttributeHandler {
    events = [
        'abort',
        'after-print',
        'animation-end',
        'animation-iteration',
        'animation-start',
        'before-print',
        'before-unload',
        'blur',
        'can-play',
        'can-play-through',
        'change',
        'click',
        'context-menu',
        'copy',
        'cut',
        'dblclick',
        'drag',
        'drag-end',
        'drag-enter',
        'drag-leave',
        'drag-over',
        'drag-start',
        'drop',
        'durationchange',
        'ended',
        'error',
        'focus',
        'focusin',
        'focusout',
        'fullscreenchange',
        'fullscreenerror',
        'hashchange',
        'input',
        'key-down',
        'key-up',
        'load',
        'loadeddata',
        'loadedmetadata',
        'loadstart',
        'message',
        'mousedown',
        'mouseenter',
        'mouseleave',
        'mousemove',
        'mouseout',
        'mouseover',
        'mouseup',
        'mousewheel',
        'offline',
        'online',
        'open',
        'pagehide',
        'pageshow',
        'paste',
        'pause',
        'play',
        'playing',
        'popstate',
        'progress',
        'ratechange',
        'reset',
        'resize',
        'scroll',
        'search',
        'seeked',
        'seeking',
        'select',
        'show',
        'stalled',
        'storage',
        'submit',
        'suspend',
        'timeupdate',
        'toggle',
        'touchcancel',
        'touchend',
        'touchmove',
        'touchstart',
        'transitionend',
        'unload',
        'volumechange',
        'waiting',
        'wheel'
    ]
    handle(component, element) {
        for (const eventName of this.events) {
            const attributeName = "x-" + eventName;
            if (element.hasAttribute(attributeName)) {
                const handlerName = element.getAttribute(attributeName);
                const handler = component[handlerName];
                if (handler !== undefined) {
                    element.addEventListener(this.toHtmlEventName(eventName), e => {
                        e.source = element;
                        component[handlerName](e);
                    });
                } else {
                    const componentName = component.componentName;
                    console.error(`Component '${componentName}' doesn't have '${handlerName}' callback.`);
                }

                element.removeAttribute(attributeName);
            }
        }
    }

    toHtmlEventName(name) {
        return name.split("-").join('');
    }
}

(function() {
    BoltElementHandler.handlers.push(new GenericEventHandler());
})();