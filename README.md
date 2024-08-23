# Malic Acid

A javascript HTML form handling and utility library for use atop Formic Acid. Formic and
Malic acids are designed around the principle of bridging HTML forms to JSON Rest APIs.

[Formic Acid](https://github.com/FatConan/formic-acid) provides extraction and
validation mechanisms for validating JSON data (it will also process multipart
form data, but this was never its primary purpose)
against a set of rules as well as, in recent additions, mechanisms for
representing and generating HTML forms for that purpose in
a standardised way (based around Play's Twirl templating library).

*Malic Acid* is a collection of Javascript (specifically ECMAScript 6) classes and
helpers designed to add frequently encountered interactions atop the HTML forms
as well as offering a standardised mechanism to translate HTML form data into
JSON (and vice versa) so that it may be submitted to REST endpoints. Like
Formic, Malic is based on a more ad-hoc set of implementations in a production
system and has been factored out with the intent that it can eventually be
brought back into the said system as a replacement for those looser pieces.

**WARNING:** this project is in its early stages and is severely lacking in the
sort of testing and validation one might expect from a project. It has however,
been incorporated into an existing production project where its functionality
will be refined, and test harnesses constructed. Eventually.

## Requirements

* Malic required Node to build its distributable.
* The example project (which uses Malic Acid to render this README as an interactive website 
  requires [Sand](https://github.com/FatConan/sand), a Python static site generator).

## Build

To build the *distributable version of Malic Acid* clone this repo, install Node.js and run:

```
npx esbuild --bundle src/index.js --format=esm --outdir=dist --external:jquery --external:underscore --external:jquery-ui --minify --sourcemap
```

Or you may build the webpack bundle version using:

```
npx webpack
```

To create the dist folder.

To build and launch the *example project* clone the repo, install Sand and run:

```
sand example/ --serve
```

from within the cloned directory. This will launch a server that may be accessed through a browser
at `http://localhost:9000`.


## Usage

Malic is designed to be pretty pick-and-choose. It comes with a number of
components that may be helpful when used on their own, or in conjunction
with others. It's an attempt (as is Formic) to be less prescriptive
in its approach than some alternatives. There are obviously ways in which it's designed to 
work in a joined-up system, but components may be used individually without sticking 
to any rigid ideology.

Malic uses JQuery and underscore for making things like DOM navigation and
templating cleaner and easier.

Malic is very specifically aimed at use in-browser, within HTML pages, and with minimal 
dependencies. While the `main` branch of the project contains a version that is built and packaged as
a Node module, this branch is an attempt to break free of that Node ecosystem as much as possible.
The build line above is geared toward minifying and packaging purely for the purposes of distribution
and request-minimisation. 

While the exmaple project uses a helper method to build the importmap and script tags, the generated
output is displayed here:

```html
<script type="importmap">{
    "imports": {"jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js", 
    "jquery-ui": "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js", 
    "underscore": "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.13.6/underscore-esm.min.js", 
    "malicacid": "./resources/scripts/malic-acid/index.js"}}
</script>
<script type="module"
        src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js"></script>
<script type="module"
        src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js"></script>
<script type="module"
        src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.13.6/underscore-esm.min.js"></script>
<script type="module" src="./resources/scripts/malic-acid/index.js"></script>
<script type="module" src="/resources/scripts/main.js"></script><
```

## Getting Started With Malic Acid

Malic may be imported either as a unit or by selecting specific modules. For example:

```
import malicacid from "malicacid";
malicacid.ElementHelper.guid();
> "c535b471-ca10-acea-dd84-0437c3ebbb7a"
```
provides the malicacid object referenced in the examples below, but more specific imports may be 
used to pull-in particular modules:

```
import {ElementHelper} from "malicacid";
ElementHelper.guid();
> "c535b471-ca10-acea-dd84-0437c3ebbb7a"
```

## Element Helper

The ElementHelper class `malicacid.ElementHelper` contains collection of methods
to help with manipulating the DOM.

### ElementHelper.guid()

Generates a random guid that can be used to uniquely identify elements injected
into the DOM while minimising the chance of an ID collision.

```javascript
malicacid.ElementHelper.guid();
```

> "c535b471-ca10-acea-dd84-0437c3ebbb7a"

### ElementHelper.namespacedGuid(ns)

Uses the `ElementHelper.guid()` to method to generate a namespaced identifier. For example, this method is used to 
uniquely identify form listener groups for use with the `HighLevelEventHandler` by calling `ElementHelper.namespacedGuid("form")`.

```javascript
malicacid.ElementHelper.namespacedGuid("my_namespace");
```

> "my_namespace-d65a1376-a42d-2f24-de8a-88f6c8b07dad"

### ElementHelper.getData(element, dataLabel)

If the element isn't null, returns `$(element).data(dataLabel)`, or `null`
otherwise. This means `element` can be very flexible ranging from strings of content, identifiers or DOM elements.

```javascript
let el = '<div data-title="Element Title"></div>';
malicacid.ElementHelper.getData(el, "title");
```

> "Element Title"

### ElementHelper.findParentTag(element, tagName)

Provided a DOMElement and a tag name this method will step through the ancestors of the element and return the first 
one with the matching tag name. 

```javascript
//Use jquery to quickly construct a nested structure
let el = $('<div data-title="Element Title"></div>');
let li = $('<li></li>');
let span = $('<span>This is a span</span>');
el.append(li);
li.append(span);

//But pass the base DOMElement into the call
malicacid.ElementHelper.findParentTag(span[0], "div"); 
```

> [object HTMLDivElement]


## High Level Event Handler

Malic acid originally came with its own high level click event handler, allowing handlers for click 
events on elements within the page to be managed in one place. Over time this was expanded to allow
for grouped collections of handlers so that, for example, all the click events for a specific form
could be managed in one group (and all of them dropped at once should the form be removed from the 
DOM as it might be in the case of a popup).

This ES6 version expanded on this concept again, providing high level event handlers for any event, 
while also providing backwards-compatible handlers that wrap this new functionality with the concept
of "default" events so that they may work as the old click event handlers did.

The aim of the high level handlers was to reduce the number of listeners required to handle complex
interactions and to perform a number of steps were commonly required when capturing the event: 
resolving the intended target DOMElement (and wrapping it with JQuery to ease manipulation), 
collecting the actual trigger element and offering a means of detecting DOMElements for which a 
handler may have been missed.

The high level event handler can be registered on a particular element and used to 
capture any events bubbling up from any child elements by comparing them to a known set of matching 
keys in a map.  The first step in using the event handler is to "hookup" the listener so that it 
sits ready to listen to events and then to "grab" a listener collection from it where we can start 
adding handlers.

In the `main` and legacy version of Malic Acid this was done using multiple calls:

```
malicacid.HighLevelEventHandler.hookup({target: "html"});
const eventHandler = malicacid.HighLevelEventHandler.grabHandler();
eventHandler.listeners;
```

Over time, it has become apparent that while this level of granularity may be useful in some 
circumstances, the general case is normally sufficient, so in this ES6 version the calls have been 
simplified:

```javascript
const eventHandler = malicacid.handler();
eventHandler.listeners;
```

> [object Object]

The `handler()` call will return a default `ListenerCollection` that provides the ability to add 
handlers for specific events and targets. The `addListenerOnEvent` call creates a map of events, 
target elements and actions. A single global listener will pick up on any events added via this call 
and then find the first matching ancestor to the element pointed at by `event.target` to those 
stored in its map.

A short-hand `addListener` method will add a handler for the default event type, either a `click` 
or `touchstart` event depending on the device being used.

### Adding a listener

```javascript
this.eventHandler.addListener("button", (e, args) => {
    args.$matchedEl;
});
this.eventHandler.textList()
```

>Event: click
>button
>(e, args) => {
>  args.$matchedEl;
>}


### Adding a listener for a different event

As mentioned earlier `addListener` adds a new handler for the default event 
(`touchstart` or `click`) but frequently we will need to listen for other events on the page. 
These may be standard, or they may be custom events of our own making. Both work in the same way, 
so let's listen for and trigger our own `foobar` event:

```javascript
this.eventHandler.addListenerOnEvent("foobar", "html", (e, args) => {
    console.log("ding!");
});
this.eventHandler.trigger("foobar",document.getElementsByTagName("html"));
```

No output is returned when executed, but you will see "ding!" in the console when the code is executed.

### Adding a listener group

While the listeners above have been added to the default `ListenerCollection` the `addListenerGroup`
method provides a way to create a listener group: a `NamespacedListenerCollection` that may be used 
for containing listeners for a specific piece of functionality so that they can be managed 
collectively.

Listener groups were previously added by accessing the globalEventHandler and calling 
addListenerGroup on it:
```

```

Note: In the interactive version of this documentation whenever `this.eventHandler` is referenced in the code snippet a 
`ListenerCollection` named "demo" is being used. It is established in the supporting code using the snippet:

````javascript
const context = {eventHandler: malicacid.handler("demo")};
//Passed to an evaulate.call(context, string_to_evaluate);
````



## Base Classes

## Forms

