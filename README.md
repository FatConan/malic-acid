# Malic Acid
A javascript  HTML form handling library for use atop Formic Acid.  Formic and Malic acids are designed around the principle of
bridging HTML forms to JSON Rest APIs. 

[Formic Acid](https://github.com/FatConan/formic-acid) provides extraction and validation mechanisms for validating JSON data 
against a set of rules as well as, in recent additions, mechanisms for representing and generating HTML forms for that purpose in 
a standardised way (based around Play's Twirl templating library).

*Malic Acid* is a collection of Javascript (Actually EMAScript 6) classes and helpers designed to add frequently encountered interactions atop the HTML forms 
as well as offering a standardised mechanism to translate HTML form data into JSON (and vice versa) so that it can be submitted to REST endpoints.
Like Formic, Malic is based on a more ad-hoc set of implementations in a production system and has been factored out with the intent
it can eventually be brought back into the said system as a replacement for those looser pieces. 

**WARNING:** this project is in its early stages and is severely lacking in the sort of testing and validation one might expect 
from a project. It has however, been incorporated into an existing production project where its functionality will be refined, and 
test harnesses constructed. Eventually.

## Build
Install Node and run:

```
npx webpack
```

```
npx esbuild --bundle src/index.js --format=esm --outdir=dist --external:jquery --external:underscore --external:jquery-ui --minify --sourcemap
```

To create the AMD library in the dist folder.

You may also use the provided deploy script in `/deploy/deploy.py` that will perform the above build and copy the resultant
js files into a folder named for the version created.

```
python3 deploy/deploy.py .
```

If run from within the project folder.

## Usage

Malic is designed to be pretty pick-and-choose. It comes with a number of components that may be helpful when used on their own
or used in conjunction with others. It's an attempt (as with Formic) to be a little less prescriptive in its approach. There
are obviously ways in which it's designed to work in an entirely joined up system, but components can be used
in a way that means that this isn't rigidly locked in.

Malic uses JQuery and underscore for making things like DOM navigation and templating cleaner and easier.  

### Element Helper

The ElementHelper class `malicacid.ElementHelper` contains collection of methods to help with manipulating the DOM.

#### ElementHelper.guid() 

Generates a random guid that can be used to uniquely identify elements injected into the DOM while minimising the chance
of an ID collision. 

```
malicacid.ElementHelper.guid();
> "c535b471-ca10-acea-dd84-0437c3ebbb7a"
```
 
#### ElementHelper.getData(element, dataLabel) 

If the element isn't null, returns $(element).data(dataLabel), or null otherwise.  This means element can be very flexible
ranging from strings of content, identifiers or DOM elements.

```
let el = '<div data-title="Element Title"></div>';
malicacid.ElementHelper.getData(el, "title");
> "Element Title"
```

#### ElementHelper.findParentTag(element, tagName)



### High Level Event Handler

### Base Classes


### Forms

