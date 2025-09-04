
-----

# Guide

## Getting Started: Core Concepts

Before you begin, it's important to understand the main elements you'll be working with in the framework.

* **Factory Function**: This is the function you write to define a component's behavior and properties. It receives the component instance as its first argument.
* **Component (`self`)**: The first argument of the factory function, conventionally named `self`. This object is the actual component instance, analogous to `this` in class-based systems. All your data and methods will be attached to it.
* **StormElement**: A wrapper around a native HTML element. The original HTML element can be accessed through the `.ori` property.
* **StormEvent**: A wrapper around a native browser event object. The original event is available via the `.ori` property.

**Note:** Component tags must start with `x-`, e.g., `<x-users></x-users>`.

**Note:** Components must be registered with the framework using the `$` function. You can register a single component, `$(MyComponent)`, or an array of components, `$([MyComponent, MySubComponent])`.

**Note:** New component instances are created using the same `$` function. If a component has been registered, calling `$(MyComponent)` will return a new instance of it.

**Note:** Using template literals (backticks `` ` ``) for component templates is often more convenient than using `<template>` tags. IDEs like WebStorm and editors like VS Code (with the `lit-html` or similar extensions) provide excellent syntax highlighting for HTML inside these strings.

**Note:** All element queries are handled internally by querySelector(), ensuring full support for CSS selectors.


## Table of Contents

* [1. Click Counter](#1-click-counter)
* [2. Nesting Components](#2-nesting-components)
* [3. Creating Components Dynamically](#3-creating-components-dynamically)
* [4. Using HTML `<template>` Tags](#4-using-html-template-tags)
* [5. Component Constructor with Arguments](#5-component-constructor-with-arguments)
* [6. Communication Between Components](#6-communication-between-components)
* [7. WatchList for Dynamic Lists](#7-watchlist-for-dynamic-lists)
* [8. Initializing Component Data from HTML](#8-initializing-component-data-from-html)
* [9. Example: TODO List](#9-example-todo-list)
* [10. Displaying a Component After Data Loading](#10-displaying-a-component-after-data-loading)
* [11. Adding Components from Server-Side HTML](#11-adding-components-from-server-side-html)
* [12. Finding and Manipulating HTML Elements](#12-finding-and-manipulating-html-elements)
* [13. Forms and Property Binding](#13-forms-and-property-binding)
* [14. Confirmation Modal Dialog](#14-confirmation-modal-dialog)
* [15. Directives](#15-directives)

***

<a name="1-click-counter"></a>
## 1. Click Counter

This example demonstrates a basic component with a property (`counter`) and a method (`click`) that modifies it.

```html
<body>
<x-first-component>
    <button x-click="click">Click</button>
    <div>Number of clicks {{counter}}</div>
</x-first-component>
</body>
<script type="text/javascript">
    function FirstComponent(self)  {
        self.counter = 0;
        self.click = () => {
            self.counter++;
        }
    }
    $(FirstComponent);
</script>
````

The component instance is the `self` object passed as the first argument to your factory function. After defining the component, you must register it using `$(FirstComponent)`.

[Working example](https://stormmoredev.github.io/storm-js-framework/click-counter.html)

-----

<a name="2-nesting-components"></a>

## 2\. Nesting Components

Components can be easily nested within each other. Each component manages its own scope and events.

```html
<x-outer-component>
    <button x-click="click">Click outer</button>
    <x-inner-component>
        <button x-click="click">Click inner</button>
    </x-inner-component>
</x-outer-component>
<script type="text/javascript">
    function OuterComponent(self) {
        self.click = () => {
            alert("outer");
        }
    }
    function InnerComponent(self) {
        self.click = () => {
            alert("inner");
        }
    }
    $([OuterComponent, InnerComponent]);
</script>
```

[Working example](https://stormmoredev.github.io/storm-js-framework/nested-components.html)

-----

<a name="3-creating-components-dynamically"></a>

## 3\. Creating Components Dynamically

To create a new instance of a registered component, use the same `$` function you used for registration. You can then append the new component to the DOM.

```html
<body>
    <x-add-component>
        <div x-click="add">Add new component</div>
    </x-add-component>
</body>
<script type="text/javascript">
    function AddComponent(self) {
        self.add = () => {
            let item = $(Item);
            self.append(item);
        }
    }
    function Item(self) {
        self.time = new Date().toLocaleString();
        self.template = `<div>Added at: {{time}}</div>`;
    }
    $([AddComponent, Item]);
</script>
```

[Working example](https://stormmoredev.github.io/storm-js-framework/adding-components.html)

-----

<a name="4-using-html-template-tags"></a>

## 4\. Using HTML `<template>` Tags

As an alternative to template literals, you can define a component's HTML structure using a `<template>` tag. The `x-for` attribute associates the template with the specified component.

```html
<body>
    <x-add-component>
        <button x-click="add">Add new component</button>
    </x-add-component>
    <template x-for="Item">
        <div>Time: {{time}}</div>
    </template>
</body>
<script type="text/javascript">
    function AddComponent(self) {
        self.add = () => {
            let item = $(Item);
            self.append(item);
        }
    }
    function Item(self) {
        self.time = new Date().toLocaleString();
    }
    $([AddComponent, Item]);
</script>
```
[Working example](https://stormmoredev.github.io/storm-js-framework/adding-components-template.html)

-----

<a name="5-component-constructor-with-arguments"></a>

## 5\. Component Constructor with Arguments

You can pass arguments when creating a new component instance. These arguments are passed to your factory function, following the initial `self` object.

```javascript
<script type="text/javascript">
    function AddComponent(self) {
        self.add = () => {
            // 'My new item' is passed as the 'text' argument to the Item constructor
            let item = $(Item, 'My new item');
            self.append(item);
        }
    }
    function Item(self, text) {
        self.text = text;
        self.template = `<div>{{text}}</div>`;
    }
    $([AddComponent, Item]);
</script>
```

The first argument to `$(...)` is always the component to create. Subsequent arguments (`'My new item'`) are passed as the second, third, etc., arguments to the constructor function (since `self` occupies the first position).

-----

<a name="6-communication-between-components"></a>

## 6\. Communication Between Components

The framework provides a simple event system for communication. Use `self.emit()` to send a custom event and `self.on()` to listen for it. This allows unrelated components to interact.

```html
<x-sender-component>
    <button x-click="send">Send message</button>
</x-sender-component>
<x-receiver-component>
    <div>Received messages:</div>
</x-receiver-component>

<script type="text/javascript">
    function SenderComponent(self)  {
        self.send = () => {
            self.emit("new-msg", "Hello World!");
        }
    }
    function ReceiverComponent(self)  {
        self.on("new-msg", (msg) => {
           self.appendHtml("<div>" + msg + "</div>");
        });
    }
    $([SenderComponent, ReceiverComponent]);
</script>
```

[Working example](https://stormmoredev.github.io/storm-js-framework/communication.html)

-----

<a name="7-watchlist-for-dynamic-lists"></a>

## 7\. `WatchList` for Dynamic Lists

The `WatchList` is a reactive object for managing dynamic lists of components. When you add or remove items from the list, the DOM is automatically updated. This eliminates the need for manual DOM manipulation.

```html
<x-users-form>
    <input type="text" placeholder="Username" x-enter-pressed="add" value="{{username}}"/>
    <button x-click="add">Add</button>
    <div x-list="items"></div>
</x-users-form>
<script type="text/javascript">
    function UsernameComponent(self, username) {
        self.username = username;
        self.template = `<div class="user-item">{{username}}</div>`;
    }
    function UsersForm(self)  {
        self.username = "";
        self.items = new WatchList([$(UsernameComponent, "John")]);
        self.add = () => {
            if (!self.username) {
                alert("Username is empty.");
                return;
            }
            self.items.add($(UsernameComponent, self.username));
            self.username = "";
        }
    }
    $([UsersForm, UsernameComponent]);
</script>
```
[Working example](https://stormmoredev.github.io/storm-js-framework/communication.html)

-----

<a name="8-initializing-component-data-from-html"></a>

## 8\. Initializing Component Data from HTML

You can initialize a component's data directly from an HTML attribute using `x-init`. This is useful for server-side rendering (SSR), allowing search engines to index content that will later become dynamic.

```html
<x-init-component x-init='{"id": 4, "username": "John"}'>
    <button x-click="alert">Show user data</button>
</x-init-component>
<script type="text/javascript">
    function InitComponent(self)  {
        // self.id and self.username are automatically populated from x-init
        self.alert = () => {
            alert(`ID: ${self.id}, Username: ${self.username}`);
        }
    }
    $([InitComponent]);
</script>
```

[Working example](https://stormmoredev.github.io/storm-js-framework/initializing-component-from-html.html)

-----

<a name="9-example-todo-list"></a>

## 9\. Example: TODO List

This example combines several concepts to build a classic TODO list application, demonstrating state management, event communication, and dynamic lists.

```html
<x-todo-form>
    <input type="text" placeholder="Your todo" value="{{todo}}" x-enter-pressed="add"/>
    <button x-click="add">Add</button>
</x-todo-form>
<x-todo-list>
    <div>Tasks todo: {{left}} of {{count}}</div>
    <div x-list="items"></div>
</x-todo-list>
<script type="text/javascript">
    function TodoItem(self, name) {
        self.name = name;
        self.done = false;
        self.delete = () => self.emit('del-todo', self);
        self.changed = () => {
            self.done = !self.done;
            self.emit('task-changed');
        };
        self.template = `
            <div class="todo-item">
                <input type="checkbox" x-change="changed" />
                <div x-class="done:done">{{name}}</div>
                <div x-click="delete" class="del">delete</div>
            </div>`;
    }

    function TodoForm(self)  {
        self.todo = "";
        self.add = () => {
            if (!self.todo) {
                alert("TODO can not be empty.");
                return;
            }
            self.emit("new-todo", self.todo);
            self.todo = "";
        }
    }

    function TodoList(self) {
        self.items = new WatchList([$(TodoItem, "My first TODO")]);
        self.left = 1;
        self.count = 1;

        self.countTasks = () => {
            self.left = self.items.count(x => x.done === false);
            self.count = self.items.count();
        };
        self.on('new-todo', todo => {
            self.items.add($(TodoItem, todo));
            self.countTasks();
        });
        self.on('del-todo', todo => {
            self.items.delete(x => x === todo);
            self.countTasks();
        });
        self.on('task-changed', self.countTasks);
    }

    $([TodoForm, TodoList, TodoItem]);
</script>
```

[Working example](https://stormmoredev.github.io/storm-js-framework/todo.html)

-----

<a name="10-displaying-a-component-after-data-loading"></a>

## 10\. Displaying a Component After Data Loading (Progress Bar)

You can show a loading message while waiting for asynchronous data. The component's main content is defined in a `<template>` tag, which you can render by calling `self.showTemplate()` once the data is available.

```html
<x-user-data>
    <div>Loading user data...</div>
    <template>
        Hi, {{username}}!
    </template>
</x-user-data>
<script type="text/javascript">
    function UserData(self) {
        // This function is called automatically on component initialization
        self.init = () => {
            setTimeout(() => self.onAjaxSuccess(), 1000); // Simulate network request
        }
        self.onAjaxSuccess = () => {
            self.username = "John";
            self.showTemplate(); // Replace loading message with the template
        }
    }
    $([UserData]);
</script>
```

[Working example](https://stormmoredev.github.io/storm-js-framework/preloading-data.html)

-----

<a name="11-adding-components-from-server-side-html"></a>

## 11\. Adding Components from Server-Side HTML

You can fetch HTML containing new components from a server and inject it into the DOM. The framework will automatically initialize any components found in the new markup.

```html
<x-main-component>
    <div>Downloading data...</div>
    <template>
        <div id="items"></div>
    </template>
</x-main-component>
<script type="text/javascript">
    function MainComponent(self) {
        self.init = () => {
            setTimeout(() => self.onAjaxSuccess(), 1000); // Simulate AJAX call
        };
        self.onAjaxSuccess = () => {
            self.showTemplate();
            const html = `
                <div>
                    <x-item x-init='{"id": "First"}'><button x-click="click">Show ID</button></x-item>
                    <x-item x-init='{"id": "Second"}'><button x-click="click">Show ID</button></x-item>
                </div>`;
            self.find("#items").appendHtml(html);
        }
    }
    function Item(self) {
        self.click = () => {
            alert(self.id);
        }
    }
    $([MainComponent, Item]);
</script>
```

[Working example](https://stormmoredev.github.io/storm-js-framework/inserting-components-as-html.html)

-----

<a name="12-finding-and-manipulating-html-elements"></a>

## 12\. Finding and Manipulating HTML Elements

Use the `self.find(selector)` method to get a `StormElement` wrapper for an element within your component's scope. This allows you to attach event listeners or manipulate the element directly.

```html
<x-example-component>
    <button class="click-me">Click</button>
    <div id="clicks"></div>
</x-example-component>
<script type="text/javascript">
    function ExampleComponent(self) {
        self.clickCount = 1;
        self.find(".click-me").on("click", function() {
            let time = new Date().toLocaleTimeString();
            let html = `<div>Click no. ${self.clickCount} at ${time}</div>`;
            self.find('#clicks').appendHtml(html);
            self.clickCount++;
        });
    }
    $(ExampleComponent);
</script>
```

[Working example](https://stormmoredev.github.io/storm-js-framework/manipulating-html.html)

-----

<a name="13-forms-and-property-binding"></a>

## 13\. Forms and Property Binding

The `{{ }}` directive provides two-way data binding for form inputs. The `self.find('form').formData()` method simplifies collecting form data for submission.

```html
<x-form-component>
    <form>
        First Name: <input type="text" value="{{name}}" /> (Bound value: {{name}})
        <br/>
        Email: <input type="email" value="{{email}}"/> (Bound value: {{email}})
        <br/>
        <button x-click="print">Print FormData</button>
    </form>
    <div id="form-result"></div>
</x-form-component>
<script type="text/javascript">
    function FormComponent(self) {
        self.name = self.email = self.password = self.about = "";
        self.print = (e) => {
            e.preventDefault();
            const formResult = self.find('#form-result');
            formResult.setHtml('');
            const formData = self.find('form').formData();
            for (let [key, value] of formData) {
               formResult.appendHtml(`<div>${key}: ${value}</div>`);
            }
        }
    }
    $(FormComponent);
</script>
```

[Working example](https://stormmoredev.github.io/storm-js-framework/form.html)

-----

<a name="14-confirmation-modal-dialog"></a>

## 14\. Confirmation Modal Dialog

This example shows how to create a reusable modal component that can be dynamically created and appended to the page to confirm an action.

```html
<x-delete-button x-init='{
    "msg": "Are you sure? Type in the name of the account to delete.",
    "account": "John"
    }'>
    <a href="/delete-user/32" class="delete-button">Delete User 'John'</a>
</x-delete-button>
<script type="text/javascript">
    function DeleteModal(self, href,msg, confirmation) {
        self.confirmation = null;
        self.account = null;
        self.msg = msg;
        self.close = () => {
            self.remove();
        }
        self.delete = () => {
            if (self.confirmation === confirmation) {
                alert("Successfully deleted!");
                self.remove();
            } else {
                self.confirmation = "";
            }
        }
        self.template = `
                <div class="overlay" >
                    <div class="modal">
                        <div class="msg">{{msg}}</div>
                        <input type="text" value="{{confirmation}}" x-enter-pressed="delete" />
                        <div class="form-buttons">
                            <div class="form-submit cancel" x-click="close">Close</div>
                            <div class="form-submit delete" x-click="delete">Delete</div>
                        </div>
                    </div>
                </div>`
    }
    function DeleteButton(self) {
        const link = self.find('a');
        link.on('click', (e) => {
            e.preventDefault();
            let href = link.getAttribute('href');
            self.append($(DeleteModal, href, self.msg, self.account))
        });
    }
    $([DeleteButton, DeleteModal]);
</script>
```

[Working example](https://stormmoredev.github.io/storm-js-framework/modal.html)

-----


<a name="15-directives"></a>

## 15. Directives

Directives are special HTML attributes that provide declarative reactivity, allowing you to manipulate the DOM based on your component's state. The most common directives are:

* **`x-if="expression"`**: Conditionally renders an element. The element is added or removed from the DOM based on whether the expression is truthy.
* **`x-class="expression: 'className'"`**: Toggles CSS classes on an element.
* **`x-enter-pressed="methodName"`**: Calls a component method when the "Enter" key is pressed inside an input field.
* **`x-checked="propertyName"`**: Provides two-way data binding for checkbox and radio inputs.

### Using Expressions in Directives

A key feature of directives like **`x-if`** and **`x-class`** is their ability to evaluate JavaScript-like expressions. This allows you to create dynamic and responsive components based on your component's state. You are not limited to simple property names; you can use comparisons, logical operators, and property access to control your template's structure and styling.

For example, you can use expressions like `items.length > 0` or `user.role == 'admin' && user.active`. This same powerful syntax works for both conditionally rendering elements with `x-if` and for applying classes with `x-class`.

### Example

The example below demonstrates how to use `x-if`, `x-class`, and `x-checked` to dynamically change styles and content.

```html
<style>
    .checked-style { background-color: lightblue; padding: 5px; margin-bottom: 10px; }
    .radio-checked-style { background-color: lightcoral; padding: 5px; }
</style>
<x-directives-component>
    <div x-class="isCheckboxChecked: checked-style">
        Toggle background:
        <input type="checkbox" x-checked="isCheckboxChecked" />
        <span x-if="isCheckboxChecked">Background is now lightblue!</span>
    </div>
    <div x-class="radioValue == 'on': radio-checked-style">
        Turn radio background on/off:
        <input type="radio" name="mode" value="on" x-checked="radioValue" /> on
        <input type="radio" name="mode" value="off" x-checked="radioValue" /> off
        <span x-if="radioValue == 'on'" style="margin-left:5px">Radio background is ON.</span>
    </div>
</x-directives-component>
</div>
<script type="text/javascript">
    function DirectivesComponent(self) {
        self.isCheckboxChecked = true;
        self.radioValue = 'on'
    }
    $(DirectivesComponent);
</script>
```

[Working example](https://stormmoredev.github.io/storm-js-framework/directives.html)

