## Overview

**TypeScript** is the recommended alternative to PDL. The most recent edition of the Azure SDK allows  extension teams to  develop Blades and Parts using **TypeScript** decorators, as specified in [https://www.typescriptlang.org/docs/handbook/decorators.html](https://www.typescriptlang.org/docs/handbook/decorators.html), instead of PDL.

The **TypeScript** language is an improvement over PDL when developing the metadata that accompanies a Blade or Part, in terms of developer productivity and code quality. It also mitigates the negative impact of managing extra files authored in a different language. It also improves the typing for the  API that is used to open Blades or pin Parts.  When **TypeScript** code is used to open the Blade or pin the Part, the **TypeScript** compiler validates calls to `openBlade(...)` or `PartPinner.pin(...)` and issues conventional **TypeScript** compilation errors. In contrast, the use of PDL might  lead to run-time bugs when extensions update Blade or Part APIs, or choose to display different ones.

PDL is still supported for backward compatibility, but **TypeScript** decorators are the recommended pattern for new Blades and Parts.

The next few sections provide an overview on what decorators are and how to use them.

* [TypeScript decorator support](#typescript-decorator-support)

* [The context property](#the-context-property)

* [Building a template blade using decorators](#building-a-template-blade-using-decorators)

* [Building a menu blade using decorators](#building-a-menu-blade-using-decorators)

* [EditScopes and type metadata](#editscopes-and-type-metadata) 


## TypeScript decorator support

All developers who install the Portal Framework SDK that is located at [http://aka.ms/portalfx/download](http://aka.ms/portalfx/download) also install SDK samples on their computers during the installation process. The source for the samples is located in the `Documents\PortalSDK\FrameworkPortal\Extensions\SamplesExtension\Extension\` folder.  

First-party extension developers, i.e. Microsoft employees, can view the interfaces with jsdoc comments that are located at [http://aka.ms/portalfx/frameworkclient/content](http://aka.ms/portalfx/frameworkclient/content). External partners may need to contact <a href="mailto:ibizafxpm@microsoft.com?subject=TypeScript">ibizafxpm@microsoft .com</a> or <a href="mailto:ibiza-onboarding@microsoft.com?subject=TypeScript">ibiza-onboarding@microsoft .com</a> instead of using the internal sites that are in this document. 

The Ibiza team will export the jsdocs for the SDK to a public location. When this occurs, there will be a link to that location in  [/README.md#whats-new](/README.md#whats-new).

The following SDK features can be built with **TypeScript** decorators. 

* **Template Blade**:  A Blade where you develop the Blade's content using an HTML template bound to properties on the Blade's **TypeScript** class

* **Menu Blade**:  A Blade that exposes menu items where each item opens a sub-Blade

* **Frame Blade**:  A Blade that provides an IFrame where you develop your Blade content as a conventional web page (or rehost an existing web page)

* **Blade**: A special case of Template Blade, where the Blade's UI uses only a single FX control (like Grid) and doesn't require an HTML template to apply styling or compose multiple FX controls.

* **Template Part**: Part content is developed using an HTML template, similar to template blades.

* **Frame Part**: Blade content is developed as a conventional web page, and the Portal renders it in an IFrame

* **Button Part**: A simple API that allows you develop to standard Parts with title/subtitle/icon

* **Part**: Like 'Blade' above, this is a special case of Template Part for cases where a single FX control is used, like Chart or Grid.

The following SDK features cannot be built with decorators.

* **Unlocked blades**:  Blades that contain tiles are not a recommended pattern for any experience. 

* **The asset model**:  Defines the asset types, which are usually ARM resources, in the extension.

* **extension definition**: A very small amount of PDL that provides general metadata about the extension.

## The context property

The context property contains APIs that interact with the Shell. It is  populated by the framework previous to calling  the `onInitialize()` function, which should perform all of the initialization work for the extension. Consequently,  constructors are  not needed to populate the context property. This is a fairly common [dependency injection technique](top-extensions-glossary.md).

Declaring the type of the context property can be tricky. The declaration can change if more typeScript decorators are added to the  file, because certain APIs on the context object are enhanced when new decorators are used.  The simplest declaration of the context property  is included in the following code.

  {"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/V2/Blades/Template/SimpleTemplateBlade.ts", "section": "docs#Context"}

The framework provided `TemplateBlade.Context` type takes two generic parameters.

* The first parameter is the type of object that represents the parameters to the blade.  This simple blade takes no parameters, hence the value of `void` for the first generic parameter.  

* The second generic parameter is the type of the model data, which is the `DataContext` object for your Blade or Part. 

This makes the context property aware of the data context in a way that is strongly typed.

In the following example, there is an API on the context called `context.container.closeCurrentBlade()`.  This function takes no parameters. This sample blade can be modified to return data to its parent, which is the blade or part that opened it, by adding  the `returns data` decorator, as in the following code.

```
        @TemplateBlade.ReturnsData.Decorator()
```

**NOTE**: Not all blades need this behavior, and it does come with the consequence that the child blade is not deep-linkable if it requires a parent blade. 

The previous code, by itself, will cause a compiler error, because the decorator changes the context in a way that must be declared.  The `closeCurrentBlade()` function that previously took no arguments now needs to accept the data to return to the parent blade. To do so, add `& TemplateBlade.ReturnsData.Context<{ value: string }>` to the declaration, as in the following example.

```
  public context: TemplateBlade.Context<void, BladesArea.DataContext> & TemplateBlade.ReturnsData.Context<{ value: string }>;
```

This uses **TypeScript** [intersection types](top-extensions-glossary.md) to overload the `closeCurrentBlade` function to look like `closeCurrentBlade(data: { value: string })` so that when it is used, the compiler will enforce the rule that data is provided to it in the following format. 

```
  context.container.closeCurrentBlade({
        value: "Data to return to parent blade"
    });
```

Intersection types combine the members of all types that get and'd together.

When the project is built, the compiler will also generate a blade reference file that provides this sort of type safety to the parent blade. The callback that fires when `SimpleTemplateBlade` closes contains the type information for the data that is returned. The following is code for the parent blade.  

```
    context.container.openBlade(new BladeReferences.SimpleTemplateBlade((reason: BladeClosedReason, data: {value: string}) => {
            if (reason === BladeClosedReason.ChildClosedSelf) {
                const newValue = data && data.value ? data.value : noValue;
                this.previouslyReturnedValue(newValue);
            }
        }));
```

Each time an additional decorator is added, it is incorporated into this context declaration. 

## Building a template blade using decorators 

**NOTE**: In this discussion, `<dir>` is the `SamplesExtension\Extension\` directory, and  `<dirParent>`  is the `SamplesExtension\` directory, based on where the samples were installed when the developer set up the SDK.  Links to working samples are included as appropriate. 

This section demonstrates how to create a "Hello World" template blade using decorators. The template blade is represented by a single TypeScript file in a Visual Studio project. The source code for the template blade is located at `<dir>/Client/V2/Blades/Template/SimpleTemplateBlade.ts`. The working copy of the same source can be viewed at [https://df.onecloud.azure-test.net/?SamplesExtension=true#blade/SamplesExtension/TemplateBladesBlade/simpleTemplateBlade](https://df.onecloud.azure-test.net/?SamplesExtension=true#blade/SamplesExtension/TemplateBladesBlade/simpleTemplateBlade).

There are several options that can be specified as properties on the object that is sent to the decorator. The following code contains the simplest scenario where only an HTML template is needed.  The template is provided inline.

  {"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/V2/Blades/Template/SimpleTemplateBlade.ts", "section": "docs#HelloWorld"}

A relative path to an html file that contains the template can also be provided. In the following code, if the blade is in a file called `MyBlade.ts`, then a file named `MyBlade.html` can be added in the same directory; then, send  `./MyBladeName.html` to the htmlTemplate property of the decorator.

  {"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/V2/Blades/Template/SimpleTemplateBlade.ts", "section": "docs#DecoratorReference"}

In addition, the TypeScript programming model requires a context property to be present in the  blade class. For more information about the context property, see [the context property](#the-context-property).  The context property is populated by the framework by default and contains APIs that can be called to interact with the Shell. The following code describes the context property.
  
  {"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/V2/Blades/Template/SimpleTemplateBlade.ts", "section": "docs#Context"}

For more information about building single page applications, and how to develop blades and parts for the Portal using **TypeScript** decorators, see the video located at  [https://aka.ms/portalfx/typescriptdecorators](https://aka.ms/portalfx/typescriptdecorators).

## Building a menu blade using decorators

The following is an example of a menu blade built using decorators.  It uses the `@MenuBlade` decorator.  This decorator puts two constraints on the type.

1. It requires  the public `viewModel` property.  The property is of type `MenuBlade.ViewModel2` and provides APIs to setup the menu.

1. It requires the public 'context' property.  The property is of type `MenuBlade.Context`, as in the following code.

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


## EditScopes and type metadata 

Supplying type metadata to an extension is the way to invoke  advanced Portal behavior, in much the same way that  developers apply attributes to  .NET types to customize  .NET FX behavior for the types. Consequently, for many of the most common form scenarios, the EditScope/Form model is not described in terms of type metadata. For more information about type metadata, see [portalfx-data-typemetadata.md](portalfx-data-typemetadata.md).

For EditScope and Forms, extensions supply [type metadata] for the following scenarios. 

* [Editable grid](#editable-grid)

* [Track edits](#track-edits)

* [Loading indicators](#loading-indicators)

### Editable grid

The editable grid was developed to work exclusively with EditScope 'entity' arrays. An EditScope 'entity' array is one where created/updated/deleted array items are tracked individually by EditScope. To grant this special treatment to an array in the EditScope/Form model, supply type metadata for the type of the array items (for the `T` in `KnockoutObservableArray<T>`). The type is marked as an "entity type" and, the property/properties that constitute the entity's 'id' are specified in the following examples. 

* In TypeScript:

The TypeScript sample is located at 
`<dir>\Client\V1\Forms\Scenarios\ChangeTracking\Models\EditableFormData.ts`. This code is also included in the following working copy.

{"gitdown": "include-section", "file":"../Samples/SamplesExtension/Extension/Client/V1/Forms/Scenarios/ChangeTracking/Models/EditableFormData.ts", "section": "formsEditScopeFaq#entityTypeMetadata"}

* In C#:

The C# sample is located at 
`<dirParent>\SamplesExtension.DataModels/Person.cs`. This code is also included in the following working copy.

{"gitdown": "include-section", "file":"../Samples/SamplesExtension/SamplesExtension.DataModels/Person.cs", "section": "formsEditScopeFaq#entityTypeMetadataCsharp"}
  
### Track edits

There are Form scenarios where some properties on the EditScope/Form model are not meant for editing but are for presentation only. In this situation, the extension can instruct `EditScope` to opt out of edit tracking user edits for such EditScope/Form model properties, as in the following examples.

* In TypeScript:  

    ```
    MsPortalFx.Data.Metadata.setTypeMetadata("Employee", {
        properties: {
            accruedVacationDays: { trackEdits: false },
            ...
        },
        ...
    });  
    ```

* In C#:  

    ```
    [TypeMetadataModel(typeof(Employee))]
    public class Employee
    {
        [TrackEdits(false)]
        public int AccruedVacationDays { get; set; }

        ...
    }  
    ```

Extensions can supply type metadata to configure their EditScope as follows:  

* When using ParameterProvider, supply the `editScopeMetadataType` option to the `ParameterProvider` constructor.

* When using EditScopeCache, supply the `entityTypeName` option to `MsPortalFx.Data.EditScopeCache.createNew`.

 Extensions pass the type name to either of these when registering the type metadata by using  `MsPortalFx.Data.Metadata.setTypeMetadata`.  
    
### Loading indicators

Loading indicators should be consistently applied across all blades and parts of the extension, as in the sample located at  [https://df.onecloud.azure-test.net/#blade/SamplesExtension/TemplateBladeWithSettings](https://df.onecloud.azure-test.net/#blade/SamplesExtension/TemplateBladeWithSettings).  The steps for TypeScript and PDL are as follows.

1. Call `container.revealContent()` to limit the time when the part displays  **blocking loading** indicators. For more information, see [portalfx-parts-revealContent.md](portalfx-parts-revealContent.md).

1. Return a `Promise` from the `onInitialize` method that reflects all data-loading for the part. Return the `Promise` from the blade if it is locked or is of type  `<TemplateBlade>`.

1. The extension can return a data-loading Promise directly from `onInitialize`, but it will receive compile errors when it attempts to return the result of a call to `queryView.fetch(...)`, `entityView.fetch(...)`, `Base.Net.ajax2(...)`, as in the following code.

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

1. For PDL, do not return a `Promise` from the `onInputSet` method previous to the loading of all part data if the part removes loading indicators.   The part will seem to be broken or unresponsive if no **loading** indicator is displayed while the data is loading, as in the following code.

```ts
public onInputsSet(inputs: MyPartInputs): Promise {
    this._view.fetch(inputs.resourceId);
    
    // DO NOT DO THIS!  Removes all loading indicators.
    // Your Part will look broken while the `fetch` above completes.
    return Q();
}
```

**NOTE**: In this discussion, `onInputsSet` is the PDL equivalent of `onInitialize`.
