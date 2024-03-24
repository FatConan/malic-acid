# Malic Acid

A javascript HTML form handling library for use atop Formic Acid. Formic and
Malic acids are designed around the principle of
bridging HTML forms to JSON Rest APIs.

[Formic Acid](https://github.com/FatConan/formic-acid) provides extraction and
validation mechanisms for validating JSON data (it will also process multipart
form data, but this was never its primary purpose)
against a set of rules as well as, in recent additions, mechanisms for
representing and generating HTML forms for that purpose in
a standardised way (based around Play's Twirl templating library).

*Malic Acid* is a collection of Javascript (Actually ECMAScript 6) classes and
helpers designed to add frequently encountered interactions atop the HTML forms
as well as offering a standardised mechanism to translate HTML form data into
JSON (and vice versa) so that it can be submitted to REST endpoints. Like
Formic, Malic is based on a more ad-hoc set of implementations in a production
system and has been factored out with the intent that it can eventually be
brought back into the said system as a replacement for those looser pieces.

**WARNING:** this project is in its early stages and is severely lacking in the
sort of testing and validation one might expect from a project. It has however,
been incorporated into an existing production project where its functionality
will be refined, and test harnesses constructed. Eventually.

## Build

Install Node and run:

```
npx esbuild --bundle src/index.js --format=esm --outdir=dist --external:jquery --external:underscore --external:jquery-ui --minify --sourcemap
```

To create the dist folder.

## Usage

Malic is designed to be pretty pick-and-choose. It comes with a number of
components that may be helpful when used on their own, or in conjunction
with others. It's an attempt (as with Formic) to be a little less prescriptive
in its approach. There are obviously ways in which it's designed to work in an
entirely joined up system, but components can be used in a way that means that
this isn't rigidly locked in.

Malic uses JQuery and underscore for making things like DOM navigation and
templating cleaner and easier.

Malic may be imported either as a unit or by selecting specific modules. For example:

```
import malicacid from "malicacid";
malicacid.ElementHelper.guid();
> "c535b471-ca10-acea-dd84-0437c3ebbb7a"
```
provides the malicacid object referenced in the examples below, but more specific imports may be used to pull in 
particular modules:

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

```
malicacid.ElementHelper.guid();
> "c535b471-ca10-acea-dd84-0437c3ebbb7a"
```

### ElementHelper.getData(element, dataLabel)

If the element isn't null, returns `$(element).data(dataLabel)`, or `null`
otherwise. This means `element` can be very flexible ranging from strings of content, identifiers or DOM elements.

```
let el = '<div data-title="Element Title"></div>';
malicacid.ElementHelper.getData(el, "title");
> "Element Title"
```

### ElementHelper.findParentTag(element, tagName)

Provided a DOMElement and a tag name this method will step through the ancestors of the element and return the first 
one with the matching tag name. 

```
//Use jquery to quickly construct a nested structure
let el = $('<div data-title="Element Title"></div>');
let li = $('<li></li>');
let span = $('<span>This is a span</span>');
el.append(li);
li.append(span);

//But pass the base DOMElement into the call
malicacid.ElementHelper.findParentTag(span[0], "div"); 
> <div data-title="Element Title">
```

## High Level Event Handler

The high level click event handler is an event handler that can be registered on a particular element and used to 
capture click events bubbling up from any child elements by comparing them to a known set of matching keys in a map. 
The first step in using the event handler is to "hookup" the listener.

```
malicacid.HighLevelEventHandler.hookup({target: "html"});
```

## Base Classes

## Forms

