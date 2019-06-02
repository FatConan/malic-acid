# malic-acid
A javascript  HTML form handling library for use atop formic-acid.  Formic and Malic acids are designed around the principle of
bridging HTML forms to JSON Rest APIs. 

Formic-acid provides extraction and validation mechanisms for validating JSON data 
against a set of rules as well as, in recent additions, mechanisms for representing and generating HTML forms for that purpose in 
a standardised way (based around Play's Twirl templating library)

Malic-acid is a collection of Javascript (Actually EMAScript 6) classes and helpers designed to add frequently encountered interactions atop the HTML forms 
as well as offering a standardised mechanism to translate HTML form data into JSON (and vice versa) so that it can be submitted to REST endpoints.
Like Formic, Malic is based on a more ad-hoc set of implementations in a production system and has been factored out with the intent
that it can eventually be brought back into the said system as a replacement for those looser pieces. 

**WARNING:** this project in in its early stages and is severely lacking in the sort of testing and validation one might expect 
from a project. It has however, been incorporated into an existing production project where its functionality will be refined, and 
test harnesses constructed. Eventually.


## Build
Install Node and run:

```
npx webpack
```

To create the AMD library in the dist folder.
