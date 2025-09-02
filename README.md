# What is StormJS Framework?
StormJS is a simple tool for building modern web applications.  
It’s no harder to learn than jQuery and doesn’t require any additional tools.

## How is it different from other frameworks?
StormJS was created so that anyone familiar with JavaScript can build applications without the need for extra backend or frontend tooling.  
It’s small, yet powerful and complete.

* Everything you need is in a single JavaScript file (~20KB).
* No compilers or build tools are required — just a text editor and a browser.
* Can be seamlessly integrated into existing HTML code.
* Requires only basic JavaScript knowledge.
* Component-based architecture.
* Direct manipulation of HTML nodes.
* Extremely easy to learn and get started — you can write a working component in 30 seconds (!).
* SEO-friendly.
* Supports server side rendering (SSR)

## Quick Start

### Installation
Simply include the source file:

```html
<head>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/stormmoredev/storm-js-framework/dist/storm.min.js" />
</head>
```

### Example Component
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Click counter</title>
    <link rel="stylesheet" href="main.css">
    <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/stormmoredev/storm-js-framework/dist/storm.min.js"></script>
    <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'>
</head>
<body>
<div class="container">
    <header><h1><a href="/">StormJS Guide</a> - Modal</h1></header>
    <x-first-component>
        <button x-click="click">Click</button>
        <div>Number of clicks <span x-prop="counter"></span></div>
    </x-first-component>
    <script type="text/javascript">
        function FirstComponent(self) {
            self.counter = 0;
            self.click = () => {
                self.counter++;
            }
        }
        $(FirstComponent);
    </script>
</div>
</body>
</html>
```

## Getting Started
The best way to learn StormJS is by going through the guide.  
It covers all the common use cases for modern web applications.

👉 [Guide & Examples](https://stormmoredev.github.io/storm-js-framework/)

## Documentation
Before diving into the documentation, make sure to read the guide first.

👉 [Documentation](https://stormmoredev.github.io/storm-js-framework/docs)  
