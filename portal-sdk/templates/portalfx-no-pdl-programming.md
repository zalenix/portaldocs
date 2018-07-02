
## Defining Blades and Parts using TypeScript decorators (a.k.a. 'no-PDL')

For those who want to jump right into using TypeScript decorators to develop Blades and Parts, here are some quick and easy resources to consider:  

* Getting started [https://aka.ms/portalfx/typescriptdecorators](https://aka.ms/portalfx/typescriptdecorators)
* [FAQ](#faq)

### Introduction  

Using the PDL language to develop the metadata that accompanies a Blade or Part and to define the API for a Blade or Part has a couple of signficant drawbacks to developer productivity and code quality.  First, it's burdensome for developers to manage an extra file authored in a different language (PDL/XAML).  Second, the API by which one would open a Blade or pin a Part is *not strongly-typed*, potentially leading to run-time bugs when extensions change their Blade/Part API.  

In the latest versions of the Ibiza SDK, extension teams can develop Blades and Parts using [TypeScript decorators](https://www.typescriptlang.org/docs/handbook/decorators.html) (and not PDL).  With this, you'll define metadata in TypeScript right alongside your Blade/Part implementation.  Also, you'll define the API for a Blade or Part in terms of *TypeScript interfaces* (for the Blade/Part's parameters, for instance).  With this, when you (or other teams) write TypeScript code to *open* the Blade or *pin* the Part, the TypeScript compiler validates calls to `openBlade(...)` or `PartPinner.pin(...)` and issues conventional TypeScript compilation errors.  

PDL is still supported for back compat reasons, but using Blade/Part TypeScript decorators is the recommended pattern for new Blades/Parts and for teams who elect to port old PDL Blades/Parts.

The next few sections provide an overview on how to use these decorators.  Additionally, there is an [Introduction video](https://aka.ms/portalfx/typescriptdecorators) that walks through these concepts.

### Current TypeScript decorator support

The following SDK features can be built today with TypeScript decorators.  If you have access, you can explore the interfaces with jsdoc comments [directly in our source code](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FFramework.Client%2FTypeScript%2FFx%2FComposition&version=GBdev&_a=contents).  We will eventually export the jsdocs for the SDK to a public location.  That effort is in progress.

**Blades**  

- **Template Blade** - A Blade where you develop the Blade's content using an HTML template bound to properties on the Blade's TypeScript class
- **Menu Blade** - A Blade that exposes menu items where each item opens a sub-Blade
- **Frame Blade** - A Blade that provides you with an IFrame where you develop your Blade content as a conventional web page (or rehost an existing web page)
- **Blade** - A special case of Template Blade, where the Blade's UI uses only a single FX control (like Grid) and doesn't require an HTML template to apply styling or compose multiple FX controls.

#### Parts (a.k.a. Tiles)
- **Template Part** - Like Template Blade, you'll develop your Part's content using an HTML template
Parts (tiles)
- **Frame Part** - Like Frame Blade, you'll develop your Blade content as a conventional web page and the FX will render your Blade in an IFrame
- **Button Part** - A simple API that allows you develop standard Parts with title/subtitle/icon
- **Part** - Like 'Blade' above, this is a special case of Template Part for cases where a single FX control is used (like Chart, Grid).

These SDK features cannot **(yet)** be built with decorators:

- Unlocked blades - Blades with tiles on them - These will likely never get decorator support since that is not a pattern that is recommended for any experience.
- The asset model - Defines the asset types (usually ARM resources) in your extension
- Extension definition - A very small amount of PDL that provides general metadata about your extension

### Building a hello world template blade using decorators 

This section pulls from a sample that [you can see in the dogfood environment](https://df.onecloud.azure-test.net/?SamplesExtension=true#blade/SamplesExtension/TemplateBladesBlade/simpleTemplateBlade).

Here is an example of a very simple template blade, represented by a single TpeScript file in your extension project.

 {"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/V2/Blades/Template/SimpleTemplateBlade.ts", "section": "docs#HelloWorld"}

This is the decorator code.  There are several options that can be specified as properties on the object passed into the decorator.  This sample shows the simplest scenario where you only need to provide an HTML template.  In this case, the template is provided inline, something the SDK supports for convinience.  You also have the ability to provide a relative path to an html file that contains the template (e.g. If your blade is in a file called `MyBlade.ts` then you can add a file right next to it called `MyBlade.html` and then pass `./MyBladeName.html` into the htmlTemplate property of the decorator).

 {"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/V2/Blades/Template/SimpleTemplateBlade.ts", "section": "docs#DecoratorReference"}

Additionally, the No-PDL programming model introduces (and requires) a context property to be present in your blade class. The context property is populated by the framework on your behalf and contains APIs you can call to interact with the shell.  You can learn more about the context property [here](#the-context-property).

 {"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/V2/Blades/Template/SimpleTemplateBlade.ts", "section": "docs#Context"}

### Building a menu blade using decorators

Below is an example of a menu blade build using decorators.  It uses the `@MenuBlade` decorator.  This decorator puts two constraints on your type.

1.  It makes the public `viewModel` property required.  The property is of type `MenuBlade.ViewModel2` and provides you with APIs to setup the menu.
2.  It makes the public 'context' property required.  The property is of type `MenuBlade.Context`.

```ts
/// <reference path="../../../TypeReferences.d.ts" />

import BladesArea = require("../BladesArea");
import ClientResources = require("ClientResources");
import BladeReferences = require("../../../_generated/BladeReferences");
import MenuBlade = require("Fx/Composition/MenuBlade");

export = Main;

module Main {
    "use strict";

    @MenuBlade.Decorator()
    export class TemplateBladesBlade {
        public title = ClientResources.templateBladesBladeTitle;
        public subtitle = ClientResources.samples;

        public context: MenuBlade.Context<void, BladesArea.DataContext>;

        public viewModel: MenuBlade.ViewModel2;

        public onInitialize() {
            const { container } = this.context;

            this.viewModel = MenuBlade.ViewModel2.create(container, {
                groups: [
                    {
                        id: "default",
                        displayText: "",
                        items: [
                            {
                                id: "simpleTemplateBlade",
                                displayText: ClientResources.simpleTemplateBlade,
                                icon: null,
                                supplyBladeReference: () => {
                                    return new BladeReferences.SimpleTemplateBladeReference();
                                }
                            },
                            {
                                id: "templateBladeWithShield",
                                displayText: ClientResources.templateBladeWithShield,
                                icon: null,
                                supplyBladeReference: () => {
                                    return new BladeReferences.TemplateBladeWithShieldReference();
                                }
                            },
                            {
                                id: "templateBladeWithCommandBar",
                                displayText: ClientResources.templateBladeWithCommandBar,
                                icon: null,
                                supplyBladeReference: () => {
                                    return new BladeReferences.TemplateBladeWithCommandBarReference();
                                }
                            },
                            {
                                id: "templateBladeReceivingDataFromChildBlade",
                                displayText: ClientResources.templateBladeReceivingDataFromChildBlade,
                                icon: null,
                                supplyBladeReference: () => {
                                    return new BladeReferences.TemplateBladeReceivingDataFromChildBladeReference();
                                }
                            },
                            {
                                id: "templateBladeWithSettings",
                                displayText: ClientResources.templateBladeWithSettings,
                                icon: null,
                                supplyBladeReference: () => {
                                    return new BladeReferences.TemplateBladeWithSettingsReference();
                                }
                            },
                            {
                                id: "templateBladeInMenuBlade",
                                displayText: ClientResources.templateBladeInMenuBlade,
                                icon: null,
                                supplyBladeReference: () => {
                                    return new BladeReferences.TemplateBladeInMenuBladeReference();
                                }
                            },
                        ]
                    }
                ],
                defaultId: "simpleTemplateBlade"
            });

            return Q();  // This sample loads no data.
        }
    }
}
```


### The context property

The context property contains APIs you can call to interact with the shell. It will be populated for you by the framework before your `onInitialize()` function is called.  **It will not be populated in your constructor.  In fact, we advise against having a constructor and instead doing all initialization work in the onInitialize function.** This is a fairly common [Dependency injection technique](https://en.wikipedia.org/wiki/Dependency_injection).

Declaring the type of this property can be a little tricky, and the declaration can change if more No-PDL decorators are added to your file.  This is because certain APIs on the context object get enhanced when new decorators are used.  Let's start with a basic example and build from there.

 {"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/V2/Blades/Template/SimpleTemplateBlade.ts", "section": "docs#Context"}

This is the simplest declaration of the context property.  The framework provided `TemplateBlade.Context` type takes in two generic parameters. The first parameter represents the type of object that represents the parameters to the blade.  This simple blade takes no parameters, hence the value of `void` for the first generic parameter.  The second generic parameter represents the type of your model data, which – today – must be the DataContext object for your Blade/Part. This makes the context property aware of your data context in a strongly typed way.

Note that in this example there is an API on the context called `context.container.closeCurrentBlade()`.  This function takes no parameters.

Now let's say you're changing this blade so that it returns data to its parent (i.e. the blade or part that opened it). First, you would add the returns data decorator. **Note that not all blades need this behavior, and it does come with the consequence that the child blade is not deep-linkable if it requires a parent blade. Use only as appropriate.**

        @TemplateBlade.ReturnsData.Decorator()

That will cause a compiler error because that decorator changes the context in a way that must be declared.  The `closeCurrentBlade()` function that previously took no arguments now needs to accept the data to return to the parent blade. 

To fix the error, add `& TemplateBlade.ReturnsData.Context<{ value: string }>` to the declaration like this.

        public context: TemplateBlade.Context<void, BladesArea.DataContext> & TemplateBlade.ReturnsData.Context<{ value: string }>;

This uses TypeScript [intersection types](https://www.typescriptlang.org/docs/handbook/advanced-types.html) to overload the closeCurrentBlade function to look like this `closeCurrentBlade(data: { value: string })` so that when you use it the compiler will enforce that data is provided to it like this:

    context.container.closeCurrentBlade({
        value: "Data to return to parent blade"
    });

Intersection types combine the members of all types that get and'd (&'d) together.

When you build your project, the compiler will also produce an auto generated blade reference file that gives the same level of type safety to the parent blade.  Here is code that the parent blade would have.  Note that the callback that fires when `SimpleTemplateBlade` closes has the type information about the data being returned.

    context.container.openBlade(new BladeReferences.SimpleTemplateBlade((reason: BladeClosedReason, data: {value: string}) => {
            if (reason === BladeClosedReason.ChildClosedSelf) {
                const newValue = data && data.value ? data.value : noValue;
                this.previouslyReturnedValue(newValue);
            }
        }));

Each time you add an additional decorator you will need to incorporate it into the context declaration as we did here.  


### FAQ

#### How do I know what properties/methods to add to my Blade or Part class?  I'm used to my TypeScript class inheriting an interface.

The short answer here is that:
- Yes, interface types exist for every no-PDL TypeScript decorator. For every decorator (@TemplateBlade.Decorator, for instance), there is a corresponding interface type that applies to the Blade/Part class (for instance, TemplateBlade.Contract).  
- No, it is **not necessary** to follow this extra step of having your Blade/Part class inherit an interface.  

To the larger question now, if it's unnecessary to inherit the 'Contract' interface in my Blade/Part class, how is this workable in practice?  How do I know what properties to add to my class and what their typing should be?  

Here, the 'Contract' interface is applied *implicitly* as part of the implementation of the Blade/Part TypeScript decorator.  

So, once you've applied a TypeScript decorator to your Blade/Part class, TypeScript Intellisense and compiler errors should inform you what is missing from your Blade/Part class.  By mousing over Intellisense errors in your IDE, you can act on each of the TypeScript errors to:
- add a missing property  
- determine the property's type or the return type of your added method.  

If you iteratively refine your class based on Intellisense errors, once these are gone, you should be able to compile and run your new Blade / Part.  This technique is demonstrated in the intro [video](https://aka.ms/portalfx/typescriptdecorators).

#### How do I know what types to return from the `onInitialize` method?  

Covered above, if you start by simply *not* using a 'return' statement in your `onInitialize` (or any other method required by you choice of TypeScript decorator), Intellisense errors will reflect the expected return type for the method:
```
public onInitialize() {
    // No return statement
}

...
```

#### Unassignable argument

```
Argument of type 'typeof TestTemplateBlade' is not assignable to parameter of type 'TemplateBladeClass'.
  Type 'TestTemplateBlade' is not assignable to type 'Contract<any, any>'.
    Types of property `onInitialize` are incompatible.
      Type '() => void' is not assignable to type '() => Promise<any>'.
        Type 'void' is not assignable to type 'Promise<any>'.
```
#### Why can't I return my data-loading Promise directly from 'onInitialize'

Extensions will see compile errors when then attempt to return from `onInitialize` the result of a call to `queryView.fetch(...)`, `entityView.fetch(...)`, `Base.Net.ajax2(...)`:  
```
public onInitialize() {
    public { container, model, parameters } = this.context;
    public view = model.websites.createView(container);

    // Returns MsPortalFx.Base.PromiseV and not the required Q.Promise<any>.
    return view.fetch(parameters.websiteId).then(...);
}
```
Here, our FX data-loading APIs return an old `MsPortalFx.Base.PromiseV` type that is not compatible with the `Q.Promise` type expected for `onInitialize`.  To workaround this shortcoming of the FX data-loading APIs, until these APIs are revised you'll do:  
```
    ...
    return Q(view.fetch(...)).then(...);
    ...
```
This application of `Q(...)` simply coerces your data-loading Promise into the return type expected for `onInitialize`.  

#### I don't understand the TypeScript compilation error I'm getting around my no-PDL Blade/Part.  And there are lots of them.  What should I do here?  

Typically, around no-PDL Blades and Parts (and even old PDL-defined Blades/Parts), only the first 1-5 compilation errors are easily understandable and actionable.  

Here, the best practice is to:  
- **Focus on** errors in your Blade/Part TypeScript (and in PDL for old Blades/Parts)
- **Ignore** errors in TypeScript files in your extension's '_generated' directory
- Until compile errors in your Blade/Part named 'Foo' are fixed, **ignore** errors around uses of the corresponding, code-generated FooBladeReference/FooPartReference in `openBlade(...)` and `PartPinner.pin(...)`.
    - This is because errors in the 'Foo' Blade/Part will cause *no code* to be generated for 'Foo'.  

Some gotchas to be aware of:
- **Read all lines of multi-line TypeScript errors** - TypeScript -errors are frequently multi-line.  If you compile from your IDE, often only the first line of each error is shown and the first line is often not useful (see an example [here](#unassignable-argument)).  Be sure to look at the whole error, focusing on the last lines of the multi-line error message.
- **Don't suppress compiler warnings** - Ibiza compilation of no-PDL TypeScript decorators often generates build *warnings* that are specific to no-PDL and more actionable than TypeScript errors.  To easily understand warnings/errors and turn these into code fixes, be sure to read *all compiler warnings*, which some IDEs / command-line builds are configured to suppress.

#### How do I add an icon to my Blade?  

Developers coming from PDL will be used to customizing their Blade's icon like so:  
```
this.icon(MsPortalFx.Base.Images.Logos.MicrosoftSquares());  // For instance
```
With no-PDL decorators, developers are confused as to why this API isn't available in no-PDL.  

To answer here, first, how *does* one add an icon to a no-PDL Blade?  You do this in two steps:  
1. Associate the icon with the  `<AssetType>`
```
<AssetType
    Name='Carrots'
    Icon='MsPortalFx.Base.Images.Logos.MicrosoftSquares()'
    ...
```
2. Associate the TypeScript Blade with the AssetType
```
import { AssetTypes, AssetTypeNames } from "../_generated/ExtensionDefinition";

@TemplateBlade.Decorator({
    forAsset: {
        assetType: AssetTypeNames.customer,
        assetIdParameter: "carrotId"
    }
})
export class Carrot {
    ...
}
```
Now, why is this so?  It seems easier to do this in a single-step at the Blade-level.  The answer here is that - according to Ibiza UX design - only Blades associated with a resource/asset should show a Blade icon.  To make this more obvious at the API level, as it stands, the only place to associate an icon for a Blade is on `<AssetType>`.


#### How can I save some state for my no-PDL Blade?  
There is a decorator - @TemplateBlade.Configurable.Decorator for example, available on all Blade variations - that adds a `this.context.configuration` API that can be used to load/save Blade "settings".  See a sample [here](https://df.onecloud.azure-test.net/#blade/SamplesExtension/TemplateBladeWithSettings).

**WARNING** - We've recently identified this API as a source of Portal perf problems.  In the near future, the Ibiza team will break this API and replace it with an API that is functionally equivalent (and better performing).  
