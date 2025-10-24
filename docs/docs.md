
-----

# Documentation

## BoltComponent

This class represents a component in the Bolt framework.

### Properties

* `element`: The DOM element of the component, of type `BoltElement`.

### Methods

* `isOnViewport()`: Returns a boolean value indicating whether the component is currently within the browser's viewport.
* `scrollToHash()`: Scrolls to the element whose ID matches the hash in the current URL. For example, for the URL `/my-article/comments/#345`, it will scroll to the element with the ID `345`.
* `scrollToId(id)`: Scrolls the page to the element with the specified ID.
* `onScroll(listener, timeout = 0)`: Executes a listener function when the window is scrolled. The `timeout` parameter can be used to debounce the event.
* `onScrollEnd(listener, pixelsBefore = 50)`: Triggers an event when the user scrolls to within a specified number of pixels from the bottom of the page. By default, the event fires when there are 50 pixels or less remaining.
  ```js
  onScrollEnd((e) => {
      e.stop(); // Prevents the event from firing again.
      // You can fetch more data via AJAX and then re-enable the event,
      // making it easy to implement infinite scroll.
  });
  ```
* `reload()`: Reloads the current URL.
* `exists(path)`: Checks if an element specified by the path exists within the component.
* `find(path)`: Finds a single element within the component matching the given path.
* `findAll(path)`: Finds all elements within the component that match the given path.
* `document()`: Returns the `document` object wrapped in a `BoltElement`.
* `remove()`: Removes the entire component from the DOM.
* `emit(name, data)`: Emits an event with a given name and data.
* `on(name, handler)`: Sets a handler function to catch an event with a given name.
* `appendHtml(html)`: Appends an HTML string to the component's element.
* `append(component)`: Appends another component to this component.
* `appendTo(element, component)`: Appends a component to a specified element.
* `showTemplate()`: Renders the content of a `<template>` tag within the component.

-----

## BoltElement

This class is a wrapper for a standard DOM element, providing additional helper methods.

### Properties

* `ori`: The original, native JavaScript DOM element.

### Methods

* `id()`: Returns the ID of the element.
* `href()`: Returns the value of the `href` attribute.
* `redirect()`: Redirects the browser to the URL specified in the element's `href` attribute.
* `disable()`: Disables the element.
* `enable()`: Enables the element.
* `hasAttribute(name)`: Checks if the element has a specific attribute.
* `getAttribute(name)`: Returns the value of a specified attribute.
* `setAttribute(name, value)`: Sets the value of an attribute.
* `addClass(className)`: Adds a CSS class to the element.
* `hasClass(className)`: Checks if the element has a specific CSS class.
* `removeClass(className)`: Removes a CSS class from the element.
* `addEventListener(eventName, listener)`: Attaches an event listener to the element.
* `on(eventName, listener)`: An alias for `addEventListener`.
* `addEventListenerOn(eventName, path, listener)`: Attaches an event listener to a descendant element matching the `path`.
* `addEventListenerOnAll(eventName, path, listener)`: Attaches an event listener to all descendant elements matching the `path`.
* `loaded(listener)`: Executes the listener function once the element has loaded. If the element is already loaded, the listener is executed immediately.
* `focus()`: Sets the focus on the element.
* `setEditable(val)`: Sets the `contentEditable` property of the element.
* `scrollCenter()`: Scrolls the view to center the element on the screen.
* `scrollTop(offset = 0)`: Scrolls the view to the top of the element, with an optional pixel offset.
* `removeStyleProperty(name)`: Removes a specific CSS style property.
* `setMinWidth(width, unit = 'px')`: Sets the minimum width of the element.
* `setWidth(width, unit = 'px')`: Sets the width of the element.
* `setMinHeight(height, unit = 'px')`: Sets the minimum height of the element.
* `setHeight(height, unit = 'px')`: Sets the height of the element.
* `setHeightToScroll()`: Sets the element's height to its `scrollHeight`.
* `submit()`: Triggers the `submit` action on a form element.
* `getWidth()`: Returns the total width of the element, including padding and margin.
* `getHeight()`: Returns the total height of the element, including padding and margin.
* `getScrollHeight()`: Returns the entire height of the element's content.
* `show()`: Makes the element visible.
* `hide()`: Hides the element.
* `formData()`: Returns the `FormData` from a form.
* `getAction()`: Returns the `action` attribute of a form.
* `getMethod()`: Returns the `method` attribute of a form.
* `serialize()`: Returns an object containing the form's `action`, `method`, and `data`.
* `clear()`: Clears the content of an element. For `input` and `textarea`, it clears the value. For `img`, it removes the `src` attribute. For other elements, it clears the inner HTML.
* `setValue(value)`: Sets the value of the element.
* `getValue()`: Returns the value of the element.
* `is(name)`: Checks if the element is of a certain type (case-insensitive).
* `isCheckbox()`: Checks if the element is a checkbox.
* `isRadio()`: Checks if the element is a radio button.
* `isChecked()`: Checks if a checkbox or radio button is checked.
* `tag()`: Returns the tag name of the element.
* `count()`: Returns the number of child elements.
* `find(path)`: Finds the first descendant element matching the selector and returns it as a `BoltElement`.
* `findAll(path)`: Finds all descendant elements matching the selector and returns them as an array of `BoltElement` objects.
* `index()`: Returns the element's index among its siblings.
* `remove()`: Removes the element from the DOM.
* `closest(path)`: Finds the nearest ancestor element that matches the selector.
* `parent()`: Returns the parent element.
* `prev()`: Returns the previous sibling element.
* `next()`: Returns the next sibling element.
* `setHtml(html)`: Sets the inner HTML of the element.
* `append(element)`: Appends an element to the end of this element's children.
* `appendHtml(html)`: Appends an HTML string to the end of this element's children.

-----

## BoltEvent

A wrapper for a native browser event object.

### Properties

* `ori`: The original, native JavaScript event object.

### Methods

* `stop()`: Stops the event's propagation.
* `target()`: Returns the event's target as a `BoltElement`.
* `preventDefault()`: Prevents the default action of the event.
* `preventWhenKeyIsPressed(keyCode)`: Prevents the default action only if a specific key is pressed.
* `isKeyPressed(key)`: Checks if a specific key is pressed. The `key` can be a string or an integer key code.