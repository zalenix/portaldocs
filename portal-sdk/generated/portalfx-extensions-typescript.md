<a name="typescript-decorators"></a>
## TypeScript decorators

 ## Overview

**TypeScript** is the recommended alternative to PDL.

Using the PDL language to develop the metadata that accompanies a Blade or Part reduces developer productivity and code quality. It also negatively impacts the definition of the API for a blade or part by the following factors.
* It is burdensome for developers to manage an extra file authored in a different language, like PDL or XAML. 
* The API that is used to open Blades or pin Parts is not strongly-typed.  This can lead to run-time bugs when extensions update Blade or Part APIs or choose to display different ones.

By using the most recent edition of the Azure SDK, extension teams can develop Blades and Parts using **TypeScript** decorators as specified in [https://www.typescriptlang.org/docs/handbook/decorators.html](https://www.typescriptlang.org/docs/handbook/decorators.html), instead of PDL.  

Decorators allow you to define metadata in **TypeScript** while implementing the Blade or Part.  Also, the  API for a Blade or Part can be defined in terms of **TypeScript** interfaces, for example, for the Blade or Part's parameters.  With this, when **TypeScript** code is used to open the Blade or pin the Part, the **TypeScript** compiler validates calls to `openBlade(...)` or `PartPinner.pin(...)` and issues conventional **TypeScript** compilation errors.

PDL is still supported for backward compatibility, but **TypeScript** decorators are the recommended pattern for new Blades and Parts and migration of old PDL Blades and Parts.

The next few sections provide an overview on what decorators are and how to use them.

<a name="typescript-decorators-current-typescript-decorator-support"></a>
### Current <strong>TypeScript</strong> decorator support

All developers who install the Portal Framework SDK that is located at [http://aka.ms/portalfx/download](http://aka.ms/portalfx/download) also install SDK samples on their computers during the installation process. The source for the samples is located in the `Documents\PortalSDK\FrameworkPortal\Extensions\SamplesExtension\Extension\` folder.  

<!-- TODO: Determine whether the environment that is being described is Dogfood, or whether a different environment would be more appropriate. -->
First-party extension developers, i.e. Microsoft employees, can view the interfaces with jsdoc comments that are located at [https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FFramework.Client%2FTypeScript%2FFx%2FComposition&version=GBdev&_a=content](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FFramework.Client%2FTypeScript%2FFx%2FComposition&version=GBdev&_a=content).

External partners may need to contact <a href="mailto:ibizafxpm@microsoft.com?subject=TypeScript">ibizafxpm@microsoft.com</a> or <a href="mailto:ibiza-onboarding@microsoft.com?subject=TypeScript">ibiza-onboarding@microsoft.com</a> instead of using the internal sites that are in this document. 

We will eventually export the jsdocs for the SDK to a public location.  That effort is in progress.
<!-- TODO: The effort that is in progress should not be included in the doc until there is an actuality that can be published.  -->

<!-- TODO: Validate this list against the existing files in the .ts directories. doc to ensure that none of them are missing. Are these the same interfaces in both places? -->

<!-- TODO:  Add this list to the new samples doc as appropriate. -->

The following SDK features can be built with **TypeScript** decorators. 

<details>
<summary>Blades</summary>

* **Template Blade**:  A Blade where you develop the Blade's content using an HTML template bound to properties on the Blade's **TypeScript** class
* **Menu Blade**:  A Blade that exposes menu items where each item opens a sub-Blade
* **Frame Blade**:  A Blade that provides you with an IFrame where you develop your Blade content as a conventional web page (or rehost an existing web page)
* **Blade**: A special case of Template Blade, where the Blade's UI uses only a single FX control (like Grid) and doesn't require an HTML template to apply styling or compose multiple FX controls.
</details>

<details>
<summary>Parts (a.k.a. Tiles)</summary>
- **Template Part** - Like Template Blade, you'll develop your Part's content using an HTML template
Parts (tiles)
- **Frame Part** - Like Frame Blade, you'll develop your Blade content as a conventional web page and the FX will render your Blade in an IFrame
- **Button Part** - A simple API that allows you develop standard Parts with title/subtitle/icon
- **Part** - Like 'Blade' above, this is a special case of Template Part for cases where a single FX control is used (like Chart, Grid).
</details>

These SDK features cannot yet be built with decorators:

* Unlocked blades:  Blades with tiles on them are not a recommended pattern for any experience. 
* The asset model:  Defines the asset types (usually ARM resources) in the extension
* Extension definition: A very small amount of PDL that provides general metadata about the extension

<a name="typescript-decorators-building-a-hello-world-template-blade-using-decorators"></a>
### Building a hello world template blade using decorators

In this discussion, `<dir>` is the `SamplesExtension\Extension\` directory and  `<dirParent>`  is the `SamplesExtension\` directory. Links to Dogfood copies of samples are included as appropriate. 

This section demonstrates how to create a "Hello World" template blade using decorators. The template blade is represented by a single TypeScript file in a Visual Studio project. The source code for the template blade is located at `<dir>/Client/V2/Blades/Template/SimpleTemplateBlade.ts` in the Azure samples. The working copy of the same source can be viewed at [simple Template Blade](https://df.onecloud.azure-test.net/?SamplesExtension=true#blade/SamplesExtension/TemplateBladesBlade/simpleTemplateBlade).

There are several options that can be specified as properties on the object that is sent to the decorator. The following code contains the simplest scenario where only an HTML template is needed.  The template is provided inline.

  ```typescript

/// <reference path="../../../TypeReferences.d.ts" />
import * as ClientResources from "ClientResources";
import * as TemplateBlade from "Fx/Composition/TemplateBlade";
import * as BladesArea from "../BladesArea";

//docs#DecoratorReference
@TemplateBlade.Decorator({
htmlTemplate: "" +
    "<div class='msportalfx-padding'>" +
    "  <div>This is a Template Blade.</div>" +
    "</div>",
})
//docs#DecoratorReference
export class SimpleTemplateBlade {
public title = ClientResources.simpleTemplateBlade;
public subtitle: string;

//docs#Context
public context: TemplateBlade.Context<void, BladesArea.DataContext>;
//docs#Context

public onInitialize() {
    return Q();  // This sample loads no data.
}
}

```

A relative path to an html file that contains the template can also be provided. In the following code, if the blade is in a file called `MyBlade.ts`, then a file named `MyBlade.html` can be added in the same directory; then, send  `./MyBladeName.html` to the htmlTemplate property of the decorator.

  ```typescript

@TemplateBlade.Decorator({
htmlTemplate: "" +
    "<div class='msportalfx-padding'>" +
    "  <div>This is a Template Blade.</div>" +
    "</div>",
})

```

In addition, the TypeScript programming model requires a context property to be present in the  blade class. For more information about the context property, see [the context property](#the-context-property).  The context property is populated by the framework by default and contains APIs that can be called to interact with the shell. The following code describes the context property.
  
  ```typescript

public context: TemplateBlade.Context<void, BladesArea.DataContext>;

```

For more information about building single page applications, and how to develop blades and parts for the Portal using **TypeScript** decorators, see the video located at  [https://aka.ms/portalfx/typescriptdecorators](https://aka.ms/portalfx/typescriptdecorators).

### The context property

The context property contains APIs that can be called to interact with the shell. It will be populated by the framework before the `onInitialize()` function is called.  It is not populated in a constructor.  In fact, it is recommended not to use a constructor and instead doing all initialization work in the onInitialize function. This is a fairly common [dependency injection technique](portalfx-extensions-glossary-typescript.md).

Declaring the type of this property can be a little tricky, and the declaration can change if more typeScript decorators are added to the  file.  This is because certain APIs on the context object get enhanced when new decorators are used.  Let's start with a basic example and build from there.

This is the simplest declaration of the context property, and it is included in the following code.

  ```typescript

public context: TemplateBlade.Context<void, BladesArea.DataContext>;

```

The framework provided `TemplateBlade.Context` type takes in two generic parameters.

* The first parameter represents the type of object that represents the parameters to the blade.  This simple blade takes no parameters, hence the value of `void` for the first generic parameter.  
* The second generic parameter represents the type of the model data, which – today – must be the DataContext object for your Blade or Part. 

This makes the context property aware of your data context in a strongly typed way.

**NOTE**: In this example there is an API on the context called `context.container.closeCurrentBlade()`.  This function takes no parameters.

Now let's say this blade will be changed so that it returns data to its parent (i.e. the blade or part that opened it). First, add the `returns data` decorator. 

**NOTE**: Not all blades need this behavior, and it does come with the consequence that the child blade is not deep-linkable if it requires a parent blade. Use only as appropriate.

        @TemplateBlade.ReturnsData.Decorator()

That will cause a compiler error because that decorator changes the context in a way that must be declared.  The `closeCurrentBlade()` function that previously took no arguments now needs to accept the data to return to the parent blade. 

To fix the error, add `& TemplateBlade.ReturnsData.Context<{ value: string }>` to the declaration, as in the following example.

```
  public context: TemplateBlade.Context<void, BladesArea.DataContext> & TemplateBlade.ReturnsData.Context<{ value: string }>;
```

This uses **TypeScript** [intersection types](portalfx-extensions-glossary-typescript.md) to overload the `closeCurrentBlade` function to look like `closeCurrentBlade(data: { value: string })` so that when it is used, the compiler will enforce that data is provided to it in the following format. 

```
  context.container.closeCurrentBlade({
        value: "Data to return to parent blade"
    });
```

Intersection types combine the members of all types that get and'd together.

When the project is built, the compiler will also produce an auto generated blade reference file that gives the same level of type safety to the parent blade.  The following is code that the parent blade would have.  

**NOTE**: The callback that fires when `SimpleTemplateBlade` closes has the type information about the data being returned.

```
    context.container.openBlade(new BladeReferences.SimpleTemplateBlade((reason: BladeClosedReason, data: {value: string}) => {
            if (reason === BladeClosedReason.ChildClosedSelf) {
                const newValue = data && data.value ? data.value : noValue;
                this.previouslyReturnedValue(newValue);
            }
        }));
```

Each time an additional decorator is added, it should be incorporated into the context declaration as done here. 


<a name="typescript-decorators-building-a-menu-blade-using-decorators"></a>
### Building a menu blade using decorators

The following is an example of a menu blade built using decorators.  It uses the `@MenuBlade` decorator.  This decorator puts two constraints on the type.

1.  It requires  the public `viewModel` property.  The property is of type `MenuBlade.ViewModel2` and provides APIs to setup the menu.
1.  It requires the public 'context' property.  The property is of type `MenuBlade.Context`, as in the following code.

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


<a name="typescript-decorators-type-metadata"></a>
### Type metadata
<!-- TODO:  Move this back to the TypeScript  document -->
***Q: When do I need to worry about type metadata for my EditScope?***

SOLUTION: For many of the most common, simple Form scenarios, there is no need to describe the EditScope/Form model in terms of type metadata. Generally speaking, supplying type metadata is the way to turn on advanced FX behavior, in much the same way that - in .NET - developers apply custom attributes to their .NET types to tailor .NET FX behavior for the types.

For more information about type metadata, see [portalfx-data-typemetadata.md](portalfx-data-typemetadata.md).

 For EditScope and Forms, extensions supply [type metadata] for the following scenarios: 
<a name="typescript-decorators-type-metadata-editable-grid"></a>
#### Editable grid
<a name="typescript-decorators-type-metadata-entity-type"></a>
#### Entity-type

* **Editable grid** - Today's editable grid was developed to work exclusively with EditScope 'entity' arrays. An EditScope 'entity' array is one where created/updated/deleted array items are tracked individually by EditScope. To grant this special treatment to an array in the EditScope/Form model, supply type metadata for the type of the array items (for the `T` in `KnockoutObservableArray<T>`). The type is marked as an "entity type" and, the property/properties that constitute the entity's 'id' are specified in the following examples. 

**NOTE**: In this discussion, `<dir>` is the `SamplesExtension\Extension\` directory, and  `<dirParent>`  is the `SamplesExtension\` directory, based on where the samples were installed when the developer set up the SDK.
 
* In TypeScript:

The TypeScript sample is located at 
`<dir>\Client\V1\Forms\Scenarios\ChangeTracking\Models\EditableFormData.ts`. This code is also included in the following working copy.

```typescript

MsPortalFx.Data.Metadata.setTypeMetadata("GridItem", {
properties: {
    key: null,
    option: null,
    value: null,
},
entityType: true,
idProperties: [ "key" ],
});

```

* In C#:

The C# sample is located at 
`<dirParent>\SamplesExtension.DataModels/Person.cs`. This code is also included in the following working copy.

```csharp

[TypeMetadataModel(typeof(Person), "SamplesExtension.DataModels")]
[EntityType]
public class Person
{
    /// <summary>
    /// Gets or sets the SSN of the person.
    /// The "Id" attribute will be serialized to TypeScript/JavaScript as part of type metadata, and will be used
    /// by MsPortalFx.Data.DataSet in its "merge" method to merge data by identity.
    /// </summary>
    [Id]
    public int SsnId { get; set; }
    
```
  
<a name="typescript-decorators-type-metadata-track-edits"></a>
#### Track edits

* **Opting out of edit tracking** - There are Form scenarios where some properties on the EditScope/Form model are not meant for editing but are - possibly - for presentation only. In this situation, the extension can instruct EditScope to *not track* user edits for such EditScope/Form model properties, like so:

In TypeScript:  

    MsPortalFx.Data.Metadata.setTypeMetadata("Employee", {
        properties: {
            accruedVacationDays: { trackEdits: false },
            ...
        },
        ...
    });  

In C#:  

    [TypeMetadataModel(typeof(Employee))]
    public class Employee
    {
        [TrackEdits(false)]
        public int AccruedVacationDays { get; set; }

        ...
    }  

Extensions can supply type metadata to configure their EditScope as follows:  

* When using ParameterProvider, supply the '`editScopeMetadataType`' option to the ParameterProvider constructor.
* When using EditScopeCache, supply the '`entityTypeName`' option to `MsPortalFx.Data.EditScopeCache.createNew`.

To either of these, extensions pass the type name used when registering the type metadata via '`MsPortalFx.Data.Metadata.setTypeMetadata`'.  
  

  
<a name="typescript-decorators-type-metadata-loading-indicators"></a>
#### Loading indicators

Loading indicators should be consistently applied across all blades and parts of the extension. For no-PDL, this is demonstrated in the sample located at  [https://df.onecloud.azure-test.net/#blade/SamplesExtension/TemplateBladeWithSettings](https://df.onecloud.azure-test.net/#blade/SamplesExtension/TemplateBladeWithSettings).  The steps for TypeScript and PDL are as follows.

* Call `container.revealContent()` to limit the time when the part displays  **blocking loading** indicators. For more information, see [portalfx-parts-revealContent.md](portalfx-parts-revealContent.md).

* Return a `Promise` from the `onInitialize` method that reflects all data-loading for the part. Return the `Promise` from the blade if it is locked or is of type  `<TemplateBlade>`.

* The extension can return a data-loading Promise directly from `onInitialize`, but it will receive compile errors when it attempts to return the result of a call to `queryView.fetch(...)`, `entityView.fetch(...)`, `Base.Net.ajax2(...)`, as in the following code.

    ```
    public onInitialize() {
        public { container, model, parameters } = this.context;
        public view = model.websites.createView(container);

        // Returns MsPortalFx.Base.PromiseV and not the required Q.Promise<any>.
        return view.fetch(parameters.websiteId).then(...);
    }
    ```

    The FX data-loading APIs return a `MsPortalFx.Base.PromiseV` type that is not compatible with the `Q.Promise` type expected for `onInitialize`.  To workaround this shortcoming of the FX data-loading APIs, use the following code until these APIs are revised. 
    ```
        ...
        return Q(view.fetch(...)).then(...);
        ...
    ```

    This application of `Q(...)`  coerces the data-loading Promise into the return type expected for `onInitialize`.  

* For PDL, do not return a `Promise` from the `onInputSet` method previous to the loading of all part data if it removes loading indicators.   The part will seem to be broken or unresponsive if no **loading** indicator is displayed while the data is loading, as in the following code.

```ts
public onInputsSet(inputs: MyPartInputs): Promise {
    this._view.fetch(inputs.resourceId);
    
    // DO NOT DO THIS!  Removes all loading indicators.
    // Your Part will look broken while the `fetch` above completes.
    return Q();
}
```

**NOTE**: In this discussion, `onInputsSet` is the PDL equivalent of `onInitialize`.






<!--gitdown": "include-file", "file": "../templates/portalfx-extensions-bp-typescript.md"}
-->


<a name="frequently-asked-questions"></a>
## Frequently asked questions

<!-- TODO:  FAQ Format is ###Link, ***title***, Description, Solution, 3 Asterisks -->

<a name="frequently-asked-questions-how-do-i-know-what-properties-methods-to-add-to-my-blade-or-part-class"></a>
### How do I know what properties/methods to add to my Blade or Part class?

***How do I know what properties/methods to add to my Blade or Part class?***

I'm used to my **TypeScript** class inheriting an interface.

SOLUTION: The short answer here is that:
- Yes, interface types exist for every **TypeScript** decorator. For every decorator (@TemplateBlade.Decorator, for instance), there is a corresponding interface type that applies to the Blade/Part class (for instance, TemplateBlade.Contract).  

- No, it is **not necessary** to follow this extra step of having your Blade/Part class inherit an interface.  

***To the larger question now, if it's unnecessary to inherit the 'Contract' interface in my Blade/Part class, how is this workable in practice?  How do I know what properties to add to my class and what their typing should be?***

SOLUTION: Here, the 'Contract' interface is applied *implicitly* as part of the implementation of the Blade/Part **TypeScript** decorator.  

So, once you've applied a **TypeScript** decorator to your Blade/Part class, **TypeScript** **Intellisense** and compiler errors should inform you what is missing from your Blade/Part class.  By hovering the mouse over **Intellisense** errors in your IDE, you can act on each of the **TypeScript** errors to:
- add a missing property  
- determine the property's type or the return type of your added method.

If you iteratively refine your class based on **Intellisense** errors, once these are gone, you should be able to compile and run your new Blade / Part.  This technique is demonstrated in the intro located at [https://aka.ms/portalfx/typescriptdecorators](https://aka.ms/portalfx/typescriptdecorators).

* * * 

<a name="frequently-asked-questions-how-do-i-know-what-types-to-return-from-the-oninitialize-method"></a>
### How do I know what types to return from the <code>onInitialize</code> method?

SOLUTION: If a 'return' statement is not used in the  `onInitialize` method, or any other method required by the  choice of **TypeScript** decorator, **Intellisense** errors will reflect the expected return type for the method:

```
public onInitialize() {
    // No return statement
}
...
```

<a name="frequently-asked-questions-why-can-t-i-return-my-data-loading-promise-directly-from-oninitialize"></a>
### Why can&#39;t I return my data-loading Promise directly from &#39;onInitialize&#39;?

SOLUTION: Extensions will see compile errors when then attempt to return from `onInitialize` the result of a call to `queryView.fetch(...)`, `entityView.fetch(...)`, `Base.Net.ajax2(...)`, as in the following code.

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

* * * 

<a name="frequently-asked-questions-why-can-t-i-return-my-data-loading-promise-directly-from-oninitialize-i-don-t-understand-the-typescript-compilation-errors-that-is-occuring-around-my-typescript-blade-part-and-there-are-lots-of-them-what-should-i-do"></a>
#### I don&#39;t understand the <strong>TypeScript</strong> compilation errors that is occuring around my TypeScript Blade/Part.  And there are lots of them.  What should I do?

SOLUTION: Typically, around  **TypeScript** Blades and Parts (and even PDL-defined Blades/Parts), only the first 1-5 compilation errors are easily understandable and actionable.  

Here, the best practice is to:  
- **Focus on** errors in your Blade/Part **TypeScript** (and in PDL for old Blades/Parts)
- **Ignore** errors in **TypeScript** files in your extension's '_generated' directory
- Until compile errors in your Blade/Part named 'Foo' are fixed, **ignore** errors around uses of the corresponding, code-generated FooBladeReference/FooPartReference in `openBlade(...)` and `PartPinner.pin(...)`.
    - This is because errors in the 'Foo' Blade/Part will cause *no code* to be generated for 'Foo'.  

Some snags to be aware of:

* Read all lines of multi-line **TypeScript** errors.

    **TypeScript** errors are frequently multi-line.  If you compile from your IDE, often only the first line of each error is shown and the first line is often not useful, as in the following example.

  ```
  Argument of type 'typeof TestTemplateBlade' is not assignable to parameter of type 'TemplateBladeClass'.
  Type 'TestTemplateBlade' is not assignable to type 'Contract<any, any>'.
    Types of property `onInitialize` are incompatible.
      Type '() => void' is not assignable to type '() => Promise<any>'.
        Type 'void' is not assignable to type 'Promise<any>'.
  ```

  Be sure to look at the entire error, focusing on the last lines of the multi-line message.

* Don't suppress compiler warnings.

    Azure compilation of **TypeScript** decorators often generates build *warnings* that are specific and more actionable than **TypeScript** errors.  To easily understand warnings/errors and turn these into code fixes, be sure to read *all compiler warnings*, which some IDEs / command-line builds are configured to suppress.

* * * 

<a name="frequently-asked-questions-how-do-i-add-an-icon-to-my-blade"></a>
### How do I add an icon to my Blade?

Developers coming from PDL will be used to customizing their Blade's icon like the following example.
```
this.icon(MsPortalFx.Base.Images.Logos.MicrosoftSquares());  
```
With TypeScript decorators, developers are confused as to why this methodology cannot be used.  The answer is that only Blades associated with a resource/asset can show a Blade icon, by Ibiza UX design.  To make this more obvious at the API level, the only place to associate an icon for a Blade is on `<AssetType>`.

The new methodology to add an icon to a TypeScript Blade is as follows.
1. Associate the icon with your `<AssetType>`
```
<AssetType
    Name='Carrots'
    Icon='MsPortalFx.Base.Images.Logos.MicrosoftSquares()'
    ...
```
1. Associate your no-PDL Blade with your AssetType
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
Now, why is this so?  It seems easier to do this in a single-step at the Blade-level. 

* * * 

<a name="frequently-asked-questions-how-do-i-control-the-loading-indicators-for-my-blade-how-is-it-different-from-pdl-blades"></a>
### How do I control the loading indicators for my Blade?  How is it different from PDL Blades?

Controlling the loading indicator in Blades/Parts, as specified in [portalfx-parts-revealContent.md](portalfx-parts-revealContent.md), is the almost exactly the same for PDL and no-PDL Blades/Parts. .

<a name="frequently-asked-questions-how-do-i-control-the-loading-indicators-for-my-blade-how-is-it-different-from-pdl-blades-when-should-i-use-the-operations-api-to-control-the-blade-part-s-loading-indicator"></a>
#### When should I use the &#39;operations&#39; API to control the Blade/Part&#39;s loading indicator?

SOLUTION: 
There are scenarios like 'User clicks "Save" or "Refresh" on my Blade/Part' where the extension wants to show loading indicators at the Blade/Part level.  What's distinct about this scenario is that the Blade/Part has already completed its initialization and, now, the user is interacting with the Blade/Part UI.  This is precisely the kind of scenario for the 'operations' API.  
For no-PDL Blades/Parts, the 'operations' API is `this.context.container.operations`, and the API's use is described in [portalfx-parts-revealContent.md#displaying-a-loading-indicator-ux](portalfx-parts-revealContent.md#displaying-a-loading-indicator-ux).  There is a sample to consult [here](https://df.onecloud.azure-test.net/#blade/SamplesExtension/TemplateBladeWithSettings).

* * * 

<a name="frequently-asked-questions-how-can-i-save-some-state-for-my-no-pdl-blade"></a>
### How can I save some state for my no-PDL Blade?

There is a decorator - @TemplateBlade.Configurable.Decorator for example, available on all Blade variations - that adds a `this.context.configuration` API that can be used to load/save Blade "settings".  See a sample [here](https://df.onecloud.azure-test.net/#blade/SamplesExtension/TemplateBladeWithSettings).

**WARNING** - We've recently identified this API as a source of Portal perf problems.  In the near future, the Ibiza team will break this API and replace it with an API that is functionally equivalent (and better performing). 

* * *
<!--
gitdown": "include-file", "file": "../templates/portalfx-extensions-glossary-typescript.md"}
-->
