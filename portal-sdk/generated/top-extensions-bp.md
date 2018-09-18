<a name="azure-portal-best-practices"></a>
# Azure Portal Best Practices

<!-- Best Practices documents are included in this document in the same order as the topic documents are included in the README.md. -->

<!-- Content in a Best Practices document, for whatever reason, was not included in the narrative for the main document.  It is possible that the Best Practices content can be eventually promoted or deleted. -->

This document contains all Best Practices that have been included in the Azure Portal topics in [https://github.com/Azure/portaldocs](https://github.com/Azure/portaldocs). Practices that have been documented in textbooks and similar publications are outside of the scope of this document.
<!--
<a name="azure-portal-best-practices-onboarding-a-new-extension"></a>
## Onboarding a new extension
<a name="azure-portal-best-practices-what-s-new"></a>
## What&#39;s new
<a name="azure-portal-best-practices-getting-started"></a>
## Getting started

-->



<a name="azure-portal-best-practices-blades-and-parts"></a>
## Blades and parts


<a name="azure-portal-best-practices-best-practices"></a>
## Best Practices

Following these best practices usually results in the best performance. Portal development patterns or architectures that are recommended based on customer feedback and usability studies are categorized by the type of blade.

* [Best Practices for All blades](#best-practices-for-all-blades)

* [Best Practices for Create blades](#best-practices-for-create-blades)

* [Best Practices for Menu blades](#best-practices-for-menu-blades)

* [Best Practices for Resource List blades](#best-practices-for-resource-list-blades)
	
<a name="azure-portal-best-practices-best-practices-best-practices-for-all-blades"></a>
### Best Practices for All blades

These patterns are recommended for every extension.

* Never change the name of a blade or a part. These are unique identifiers that appear in links that users may bookmark, and they are used to locate your blade when a user pins it to the dashboard. Changing the name can break aspects of the user experience.

  * You can safely change the title (displayed in the UI) of the blade.

* Limit blade `parameters` updates to the addition of parameters that are marked in **TypeScript** as optional. Removing, renaming, or adding required parameters will cause breaks if other extensions are pointing to your blade, or if previously pinned tiles are not configured to send those parameters.

* Never remove parameters from their `Parameters` type.  Instead, ignore them if they are no longer needed.

* Use standard `<a href="#">` tags when adding `fxclick` to open child blades to make the links accessible.

* Do not use `<div>` tags when adding `fxClick` to open child blades. The <div>` tags require apply additional HTML attributes to make the links accessible.

* Do not use the **Knockout** `click` data-binding to open child Blades. The `fxClick` data-binding was developed specifically to handle asynchronous click communication between the Portal Shell IFrame and the  extension's IFrame.

* Do not call any of the `container.open*` methods from within an `fxclick handler`.  If the extension calls them, then the `ext-msportalfx-activated` class will be automatically added to the html element that was clicked. The class will be automatically removed when the child blade is closed.

* Avoid observables when possible

  The values in non-observables are much more performant than the values in observables.  Specifying a string instead of a `KnockoutObservable<string>`, os specifying a boolean instead of a `KnockoutObservable<boolean>` will improve performance. The benefit for each operation is small, but when a blade makes tens or hundreds of values, it adds up.
  
* Name `ViewModel` properties properly

  Make sure the only data that the proxied observables layer copies to the Shell is the data that is needed in the extension iFrame. The Shell displays a warning when specific types of objects are being sent to the shell, for example, `editScopes`, but it can not guard against everything. 

  Extension developers should occasionally review the data model to ensure that only the needed data is public.  The names of private members begin with an underscore, so that proxied observables are made aware by the naming convention that the members are private and therefore should not be sent to the shell.

<a name="azure-portal-best-practices-best-practices-best-practices-for-create-blades"></a>
### Best Practices for Create blades

Best practices for create blades cover common scenarios that will save time and avoid deployment failures.

* All Create blades should be a single blade. Instead of wizards or picker blades, extensions should use form sections and dropdowns.

* The subscription, resource group, and location picker blades have been deprecated.  Subscription-based resources should use the built-in subscription, resource group, location, and pricing dropdowns instead.

* Every service should expose a way to get scripts to automate provisioning. Automation options should include **CLI**, **PowerShell**, **.NET**, **Java**, **NodeJs**, **Python**, **Ruby**, **PHP**, and **REST**, in that order. ARM-based services that use template deployment are opted in by default.

<a name="azure-portal-best-practices-best-practices-best-practices-for-menu-blades"></a>
### Best Practices for Menu blades

Services should use the Menu blade instead of the Settings blade. ARM resources should opt in to the resource menu for a simpler, streamlined menu.

Extensions should migrate to the `ResourceMenu` for all of their resources.


<a name="azure-portal-best-practices-best-practices-best-practices-for-resource-list-blades"></a>
### Best Practices for Resource List blades

  Resource List blades are also known as Browse blades.

  Browse blades should contain an "Add" command to help customers create new resources quickly. They should also contain Context menu commands in the "..." menu for each row. And, they should show all resource properties in the Column Chooser.

  For more information, see the Asset documentation located at [portalfx-assets.md](portalfx-assets.md).




<a name="azure-portal-best-practices-best-practices"></a>
## Best Practices

Portal development patterns or architectures that are recommended based on customer feedback and usability studies may be categorized by the type of part.
<a name="azure-portal-best-practices-best-practices-handling-part-errors"></a>
### Handling part errors

The sad cloud UX is displayed when there is no meaningful error to display to the user. Typically this occurs when the error is unexpected and the only option the user has is to try again.

If an error occurs that the user can do something about, then the extension should launch the UX that allows them to correct the issue. Extension developers and domain owners are aware of  how to handle many types of errors.

For example, if the error is caused because the user credentials are not known to the extension, then it is best practice to use one of the following options instead of failing the part.

1. The part can handle the error and change its content to show the credentials input form

1. The part can handle the error and show a message that says ‘click here to enter credentials’. Clicking the part would launch a blade with the credentials form.

 

<!--
<a name="azure-portal-best-practices-building-ui-with-html-templates-and-fx-controls"></a>
## Building UI with HTML templates and Fx controls
-->

<!--
<a name="azure-portal-best-practices-forms"></a>
## Forms

<a name="azure-portal-best-practices-common-scenarios-and-integration-points"></a>
## Common scenarios and integration points

<a name="azure-portal-best-practices-other-ui-concepts"></a>
## Other UI concepts

<a name="azure-portal-best-practices-loading-and-managing-data"></a>
## Loading and managing data

<a name="azure-portal-best-practices-advanced-development-topics"></a>
## Advanced development topics
-->

<a name="azure-portal-best-practices-debugging"></a>
## Debugging


<a name="azure-portal-best-practices-best-practices"></a>
## Best Practices

Methodologies exist that assist developers in improving the product while it is still in the testing stage. Some strategies include describing bugs accurately, including code-coverage test cases in a thorough test plan, and other items.

A number of textbooks are devoted to the arts of software testing and maintenance.  Items that have been documented here do not preclude industry-standard practices.

Portal development patterns or architectures that are recommended based on customer feedback and usability studies are located in the topic for the blade that is being developed. For more information, see [portalfx-extensions-bp-blades.md](portalfx-extensions-bp-blades.md).

<a name="azure-portal-best-practices-best-practices-bulb-productivity-tip"></a>
### :bulb: Productivity Tip

**Typescript** 2.3.3 should be installed on your machine. The version can be verified by executing the following command.

```bash
$>tsc -version
```

Also, **Typescript** files should be set up to Compile on Save.

<a name="azure-portal-best-practices-best-practices-performance"></a>
### Performance

There are practices that can improve the performance of the extension.  For more information, see [portalfx-extensions-bp-performance.md](portalfx-extensions-bp-performance.md).

<a name="azure-portal-best-practices-best-practices-productivity-tip"></a>
### Productivity Tip

Install Chrome that is located at [https://www.google.com/intl/en_ca/chrome/](https://www.google.com/intl/en_ca/chrome/) to leverage the debugger tools while developing an extension.


<a name="azure-portal-best-practices-performance"></a>
## Performance


<a name="azure-portal-best-practices-best-practices"></a>
## Best Practices

There are a few patterns that assist in improving browser and Portal performance.

<a name="azure-portal-best-practices-best-practices-general-best-practices"></a>
### General Best Practices

1. Test your scenarios at scale 

    * Determine how your scenario deals with hundreds of subscriptions or thousands of resources.

    * Do not fan out to gather all subscriptions. Instead, limit the default experience to first N subscriptions and have the user determine their own scope.

1. Develop in diagnostics mode 

    * Use [https://portal.azure.com?trace=diagnostics](https://portal.azure.com?trace=diagnostics) to detect console performance warnings, like using too many defers or using too many `ko.computed` dependencies.

1. Be wary of observable usage 

    * Try not to use them unless necessary

    * Do not aggressively update UI-bound observables. Instead, accumulate the changes and then update the observable. Also, manually throttle or use `.extend({ rateLimit: 250 });` when initializing the observable.

<a name="azure-portal-best-practices-best-practices-coding-best-practices"></a>
### Coding best practices

1. Reduce network calls.

    * Ideally there should be only one network call per blade.

    * Utilize batch to make network requests, as in the following example.

        ```
        import { batch } from "Fx/Ajax";

        return batch<WatchResource>({
            headers: { accept: applicationJson },
            isBackgroundTask: false, // Use true for polling operations​
            setAuthorizationHeader: true,
            setTelemetryHeader: "Get" + entityType,
            type: "GET",
            uri: uri,
        }, WatchData._apiRoot).then((response) => {
            const content = response && response.content;
            if (content) {
                return convertFromResource(content);
            }
        });
        ```

1. Remove automatic polling.

    If you need to poll, only poll on the second request and ensure `isBackgroundTask: true` is in the batch call.

1. Optimize bundling. The waterfall can be avoided or reduced by using the following code.

    ```
    /// <amd-bunding root="true" priority="0" />

    import ClientResources = require("ClientResources");
    ```

1. Remove all dependencies on obsoleted code.

    * Loading any required obsoleted bundles is a blocking request during your extension load times

    * For more information, see [https://aka.ms/portalfx/obsoletebundles](https://aka.ms/portalfx/obsoletebundles).

1. Use the Portal's ARM token, as specified in the document located at    .

1. Do not use old PDL blades that are composed of parts. Instead, use TypeScript decorators, as specified in  [portalfx-no-pdl-programming.md#building-a-hello-world-template-blade-using-decorators](portalfx-no-pdl-programming.md#building-a-hello-world-template-blade-using-decorators).

    Each part on the blade has its own `viewmodel` and template overhead. Switching to a no-pdl template blade will mitigate that overhead.

1. Use the latest controls available. The controls are located at [https://aka.ms/portalfx/playground](https://aka.ms/portalfx/playground), and they  use the Asynchronous Module Loader (AMD), thereby reducing what is required to load your blade. This also  minimizes your observable usage.

1. Remove bad CSS selectors

    * Build with warnings as errors and fix them.

    * List HTML elements first in a CSS selector list.
        
        Bad CSS selectors are defined as selectors that end in HTML elements. For example, `.class1 .class2 .class3 div { background: red; } ` ends with the HTML element `div`. 
    Because CSS is evaluated from right-to-left, the browser will find all `div` elements first, which is more expensive than placing the `div`earlier in the list.

1. Fix your telemetry

    * Ensure you are returning the relevant blocking promises as part of your initialization path (`onInitialize` or `onInputsSet`).

    * Ensure your telemetry is capturing the correct timings.

<a name="azure-portal-best-practices-best-practices-operational-best-practices"></a>
### Operational best practices

1. Enable performance alerts

    To ensure your experience never regresses unintentionally, you can opt into configurable alerting on your extension, blade and part load times. For more information, see [portalfx-telemetry-alerting-overview.md](portalfx-telemetry-alerting-overview.md).

1. Move the extension to the Azure hosting service, as specified in [top-extensions-hosting-service.md](top-extensions-hosting-service.md). If it is not on the hosting service, check the following factors.

    * Homepage caching should be enabled
    * Persistent content caching should be enabled
    * Compression is enabled
    * Your service is efficiently geo-distributed 

    **NOTE**: An actual presence in a region instead of a CDN contributes to extension performance.

1. Use Brotli Compression 

    Move to V2 targets to get this type of compression by default. 


1. Remove controllers. Do not proxy ARM through your controllers.


<a name="azure-portal-best-practices-best-practices-use-amd"></a>
### Use AMD

Azure supports [Asynchronous Module Definition (AMD)](http://requirejs.org/docs/whyamd.html), which is an improvement over bundling scripts into a single file at
compilation time. Now, the Portal downloads only the files needed to display the current U
 onto the screen. This makes it faster to unload and reload an extension, and provides for generally better performance in the browser.  

* Old code

The previous coding pattern was relevant for extensions that imported modules using `<reference>` elements. These statements bundlef all scripts into a single file at compilation time, leading to a relatively large file that was downloaded whenever the extension displayed a UI.  The deprecated code is in the following example.

```ts

/// <reference path="../TypeReferences.d.ts" />
/// <reference path="WebsiteSelection.ts" />
/// <reference path="../Models/Website.ts" />
/// <reference path="../DataContexts/DataContexts.ts" />

module RemoteExtension {
    export class WebsitesBladeViewModel extends MsPortalFx.ViewModels.Blade {
    ...
    }
}

```

* New code

By using AMD, the following files are loaded only as required, instead of one large bundle. This results in increased load time, and decreased memory consumption in the browser. The improved code is in the following example.

```ts

import SecurityArea = require("../SecurityArea");
import ClientResources = require("ClientResources");
import Svg = require("../../_generated/Svg");

export class BladeViewModel extends MsPortalFx.ViewModels.Blade {
    ...
}

```

For more information about the TypeScript module loading
system, see the official language specification located at [http://www.typescriptlang.org/docs/handbook/modules.html](http://www.typescriptlang.org/docs/handbook/modules.html).

<a name="azure-portal-best-practices-best-practices-use-pageablegrids-for-large-data-sets"></a>
### Use pageableGrids for large data sets

When working with large data sets, developers should use grids and their paging features.
Paging allows deferred loading of rows, so even with large datasets, responsiveness is maintained.

Paging implies that many rows might not need to be loaded at all. For more information about paging with grids, see [portalfx-control-grid.md](portalfx-controls-grid.md)  and the sample located at `<dir>\Client\V1\Controls\Grid\ViewModels\PageableGridViewModel.ts`.

<a name="azure-portal-best-practices-best-practices-filtering-data-for-the-selectablegrid"></a>
### Filtering data for the selectableGrid

Significant performance improvements can be achieved by reducing the number of data models that are bound to controls like grids, lists, or charts.

Use the Knockout projections that are located at [https://github.com/stevesanderson/knockout-projections](https://github.com/stevesanderson/knockout-projections) to shape and filter model data.  They work in context with  with the  `QueryView` and `EntityView` objects that are discussed in [top-legacy-data.md#using-knockout-projections](top-legacy-data.md#using-knockout-projections).

The code located at `<dir>\Client\V1\Controls\Grid\ViewModels\SelectableGridViewModel.ts` improves extension performance by connecting the reduced model data to a ViewModel that uses grids.  It is also in the following example.

```ts

// Wire up the contents of the grid to the data view.
this._view = dataContext.personData.peopleQuery.createView(container);
var projectedItems = this._view.items
    .filter((person: SamplesExtension.DataModels.Person) => { return person.smartPhone() === "Lumia 520"; })
    .map((person: SamplesExtension.DataModels.Person) => {
        return <MappedPerson>{
            name: person.name,
            ssnId: person.ssnId
        };
    });

var personItems = ko.observableArray<MappedPerson>([]);
container.registerForDispose(projectedItems.subscribe(personItems));
```

In the preceding example, the `map` function uses a data model that contains only the properties necessary to fill the columns of the grid in the ViewModel. The `filter` function reduces the size of the array by returning only the  items that will be rendered as grid rows.

<a name="azure-portal-best-practices-best-practices-benefits-to-ui-rendering-performance"></a>
### Benefits to UI-rendering performance

The following image uses the selectableGrid `map` function to display only the data that is associated the properties that are required by the grid row.

![alt-text](../media/top-extensions-performance/mapping.png "Using knockout projections to map an array")

* The data contains 300 items, and the time to load is over 1.5s. 
* The optimization of mapping to just the two columns in the selectable grid reduces the message size by 2/3. 
* The size reduction decreases the time needed to transfer the view model by about 50% for this sample data.
* The decrease in size and transfer time also reduces  memory usage.



<a name="azure-portal-best-practices-best-practices"></a>
## Best Practices

<a name="azure-portal-best-practices-best-practices-resource-menu-item"></a>
### Resource menu item

Please use `cdnIntegration` for the resource menu item id. This id is used  to track blade loads and create telemetry on the CDN Integration Blade.

<a name="azure-portal-best-practices-best-practices-localizing-text"></a>
### Localizing text

 The displayText named "Azure CDN" should  be localized and located in the  `Resources.resx` file of the extension.

<a name="azure-portal-best-practices-best-practices-conditional-setting-of-integraion"></a>
### Conditional setting of Integraion

 To display this blade, set the `visible` property on the `cdnIntegration` menu item to `true`.  Also, the extension can conditionally display this blade based on a feature flag  in the extension, as in the following example.

	```ts
	visible: ko.observable(MsPortalFx.isFeatureEnabled("cdnintegration"))
	```



<a name="azure-portal-best-practices-testing"></a>
## Testing


<a name="azure-portal-best-practices-testing-best-practices"></a>
## Testing Best Practices

As you write UI based test cases using the Portal Test Framework it is recommended you follow a few best practices to ensure maximum reliability and to get the best value from your tests.

*  Always verify that every action completed as expected

    In many cases, the browser is not as fast as the test execution, so if you do not wait until expected conditions have completed, your tests could easily fail. For example, a messageBox may not be removed from the screen within a few moments after the button is clicked, even though the "Yes" button of a message box was clicked.   It is best practice to wait until the `CommandBar.HasMessageBox` property reports `false` before proceeding, as in the following example. This ensures the message box is gone and will not interfere with the next action.
    
    ```cs
    commandBar.FindMessageBox("Delete contact").ClickButton("Yes");
    webDriver.WaitUntil(() => !commandBar.HasMessageBox, "There is still a message box in the command bar.");
    ```
*  Log everything

    It can be very difficult to diagnose a failed test case without a log. An easy way to write these logs is to use the `TestContext.WriteLine` method, as in the following example.

    ```cs
    TestContext.WriteLine("Starting provisioning from the StartBoard...");
    ```

*  Use built-in Test Framework methods

    The Portal Test Framework provides many built-in methods to perform actions on Portal web elements.  It is recommended to use them for maximum test maintainability and reliability. For example, one way to find a StartBoard part by its title is in the following example.

    ```cs
    var part = webDriver.WaitUntil(
        () => portal.StartBoard.FindElements<Part>()
        .FirstOrDefault(p => p.PartTitle.Equals("TheTitle")),
        "Could not find a part with title 'Samples'.");
    ```

    This code can be simplified by using a built-in method, as in the following example.

    ```cs
    var part = portal.StartBoard.FindSinglePartByTitle("TheTitle");
    ```

    This significantly reduces the amount of code. It also encapsulates the best practice of waiting until elements are found, because the `FindSinglePartByTitle` method internally performs a `WaitUntil` operation that retries until the part is found or the timeout is reached.

    The `BaseElement` API also contains an extension method that wraps the `webDriver.WaitUntil` call.

    ```cs
    var part = blade.WaitForAndFindElement<Part>(p => p.PartTitle.Equals("TheTitle"));
    ```

* Use the WaitUntil method 

    The `WaitUntil` method should be used when retrying actions or waiting for conditions. It can also be used to retry an action, because it takes a lambda function which could be an action, followed by a verification step.  The `WaitUntil` method will return when a "truthy" value is returned, i.e., the value is neither false nor null.  This is useful if the specific action does not behave consistently.  Remember to use only actions that are [idempotent](top-extensions-glossary.md) when using the  `WaitUntil` method in this pattern.

* Use WaitUntil instead of Assert

    The traditional method of verifying conditions within test cases is by using **Assert** methods. However, when dealing with conditions that are not satisfied immediately, it is best practice to use the  **WebDriver.WaitUntil** method, as in the following example.

    ```cs
    var field = form.FindField<Textbox>("contactName");
    field.Value = contactName + Keys.Tab;
    webDriver.WaitUntil(() => field.IsValid, "The 'contactName' field did not pass validations.");
    ```

    In this example, the test would have failed if the `Assert` method had been used to verify the `IsValid` property,
     because the `TextBox` field uses a custom asynchronous validation.  This validation sends a request to the backend server to perform the required validation, which may take at least a second.

*  Create wrapper abstractions

    It is best practice to create wrappers and abstractions for common patterns of code. For example, when writing a `WaitUntil`, you may want to wrap it in a function that describes its actual intent.  This makes the intent of the  test code clear by hiding the actual details of  the abstraction's implementation.  It also helps with dealing with breaking changes, because you can modify the abstraction instead of every single test.  

    If an abstraction you wrote might be generic and useful to the test framework, you may contribute it as specified in [http://aka.ms/portalfx/contributing](http://aka.ms/portalfx/contributing).

* Clear user settings before starting a test

    The Portal keeps track of all user customizations by using persistent user settings. This behavior is not ideal for test cases, because each test case might use Portals that have different customizations. To avoid this you can use the **portal.ResetDesktopState** method. 
    
    ```cs
    portal.ResetDesktopState();
    ```

    **NOTE**: The method will force a reload of the Portal.

* Use `FindElements` to verify the absence of elements

    Sometimes an extension wants to verify that an element is not present, which may not be the same as code that validates  that an element is present.   In these cases you can use the **FindElements** method in combination with Linq methods to see if the element exists. For example, the following code verifies that there is no part with title 'John Doe' in the StartBoard.

    ```cs
    webDriver.WaitUntil(() => portal.StartBoard.FindElements<Part>()
                                            .Count(p => p.PartTitle.Equals("John Doe")) == 0,
                        "Expected to not find a part with title 'John Doe' in the StartBoard");
    ```

* Prefer CssSelector to Xpath

    It is best practice to use CSS selectors instead of **XPath** to find some web elements in the Portal. Some reasons are as follows.
    
    * **Xpath** engines are different in each browser

    * **XPath** can become complex and therefore more difficult to read

    * CSS selectors are faster

    * CSS is **JQuery's** locating strategy

    * **Internet Explorer** does not have a native **XPath** engine

    For example, the following code locates the selected row in a grid.

    ```cs
    grid.FindElements(By.CssSelector("[aria-selected=true]"))
    ```



<!--
<a name="azure-portal-best-practices-telemetry-and-alerting"></a>
## Telemetry and alerting

<a name="azure-portal-best-practices-experimentation-and-flighting"></a>
## Experimentation and flighting
-->

<a name="azure-portal-best-practices-localization-globalization"></a>
## Localization / Globalization


<a name="azure-portal-best-practices-best-practices"></a>
## Best Practices

Some best practices for localizing or globalizing extensions that run in the Portal are in _Best Practices for Developing World-Ready Applications_, which is  located at [https://docs.microsoft.com/en-us/dotnet/standard/globalization-localization/best-practices-for-developing-world-ready-apps](https://docs.microsoft.com/en-us/dotnet/standard/globalization-localization/best-practices-for-developing-world-ready-apps).



<a name="azure-portal-best-practices-accessibility"></a>
## Accessibility


<a name="azure-portal-best-practices-best-practices"></a>
## Best Practices

1. Design and code your extension with accessibility in mind  

1. Use Portal tiles/parts, forms, and controls whenever possible, as those are designed to be accessible

1. Use HTML semantics when using custom HTML, as described in [http://www.w3schools.com/html/html5_semantic_elements.asp](http://www.w3schools.com/html/html5_semantic_elements.asp). For example, create buttons with the `BUTTON`  tag instead of a  styled `DIV` tag.

1. Avoid using `aria-*`  attributes.  If you find yourself using those attributes, review your design and try to use HTML semantics as much as possible.

1. Provide concise, meaningful instructions for user input.

1. Scrub your content for consistent terminology and iconography before releasing it to the public

1. Always use multiple sensory cues to convey information. Never use the position, orientation, size, shape, or color  of a UI element alone to communicate important information to the user.


<!--
<a name="azure-portal-best-practices-deploying-your-extension"></a>
## Deploying your extension

<a name="azure-portal-best-practices-deployment-using-the-ibiza-hosting-service"></a>
## Deployment using the Ibiza hosting service

<a name="azure-portal-best-practices-custom-extension-deployment-infrastructure"></a>
## Custom extension deployment infrastructure
-->

<a name="azure-portal-best-practices-legacy-features"></a>
## Legacy features

<a name="azure-portal-best-practices-best-practices"></a>
## Best Practices

<a name="azure-portal-best-practices-best-practices-use-querycache-and-entitycache"></a>
### Use QueryCache and EntityCache

When performing data access from your view models, it may be tempting to make data calls directly from the `onInputsSet` function. By using the `QueryCache` and `EntityCache` objects from the `DataCache` class, you can control access to data through a single component. A single ref-counted cache can hold data across your entire extension.  This has the following benefits.

* Reduced memory consumption
* Lazy loading of data
* Less calls out to the network
* Consistent UX for views over the same data.

**NOTE**: Developers should use the `DataCache` objects `QueryCache` and `EntityCache` for data access. These classes provide advanced caching and ref-counting. Internally, these make use of Data.Loader and Data.DataSet (which will be made FX-internal in the future).

To learn more, visit [portalfx-data-configuringdatacache.md](portalfx-data-configuringdatacache.md).

<a name="azure-portal-best-practices-best-practices-avoid-unnecessary-data-reloading"></a>
### Avoid unnecessary data reloading

As users navigate through the Ibiza UX, they will frequently revisit often-used resources within a short period of time.
They might visit their favorite Website Blade, browse to see their Subscription details, and then return to configure/monitor their
favorite Website. In such scenarios, ideally, the user would not have to wait through loading indicators while Website data reloads.

To optimize for this scenario, use the `extendEntryLifetimes` option that is available on the `QueryCache` object and the `EntityCache` object.

```ts

public websitesQuery = new MsPortalFx.Data.QueryCache<SamplesExtension.DataModels.WebsiteModel, any>({
    entityTypeName: SamplesExtension.DataModels.WebsiteModelType,
    sourceUri: MsPortalFx.Data.uriFormatter(Shared.websitesControllerUri),
    supplyData: (method, uri, headers, data) => {
        // ...
    },
    extendEntryLifetimes: true
});

```

The cache objects contain numerous cache entries, each of which are ref-counted based on not-disposed instances of QueryView/EntityView. When a user closes a blade, typically a cache entry in the corresponding cache object will be removed, because all QueryView/EntityView instances will have been disposed. In the scenario where the user revisits the Website blade, the corresponding cache entry will have to be reloaded via an **AJAX** call, and the user will be subjected to loading indicators on the blade and its parts.

With `extendEntryLifetimes`, unreferenced cache entries will be retained for some amount of time, so when a corresponding blade is reopened, data for the blade and its parts will already be loaded and cached.  Here, calls to `this._view.fetch()` from a blade or part `ViewModel` will return a resolved Promise, and the user will not see long-running loading indicators.

**NOTE**:  The time that unreferenced cache entries are retained in QueryCache/EntityCache is controlled centrally by the FX and the timeout will be tuned based on telemetry to maximize cache efficiency across extensions.)

For your scenario to make use of `extendEntryLifetimes`, it is **very important** that you take steps to keep your client-side QueryCache/EntityCache data caches **consistent with server data**.
See [Reflecting server data changes on the client](portalfx-data-configuringdatacache.md) for details.

<a name="azure-portal-best-practices-best-practices-anti-patterns-and-best-practices"></a>
### Anti-patterns and best practices

Do not unwrap observables directly in the mapping function of your extensions.  When returning a new object from the function supplied to `map`, you should avoid unwrapping observables directly in the mapping function, illustrated by `computedName` in the following example.

```ts
var projectedItems = this._view.items.map<RobotDetails>({
    mapping: (robot: SamplesExtension.DataModels.Robot) => {
        return <RobotDetails>{
            name: robot.name,
            
            // DO NOT DO THIS!  USE A COMPUTED INSTEAD!
            computedName: "{0}:{1}".format(robot.model(), robot.manufacturer());
        };
    },
    ...
```

The `computedName` property above is the source of a common bug where "my grid loses selection when my `QueryCache` refreshes".  The reason for this is subtle.  If you unwrap observables in your mapping function, you will find that - each time the observable changes - your mapping function will be invoked again, (inefficiently) *generating an entirely new object*.  Since the Azure Portal FX's selection machinery presently relies on JavaScript object identity, selection tracked relative to the *old object* will be lost when this object is replaced by the *new object* generated by your mapping function.  Ignoring bugs around selection, generating new objects can lead to UI flicker and performance problems, as more UI is re-rendered than is necessary to reflect data changes. 

SOLUTION: Follow these two patterns to avoid re-running of mapping functions and to avoid unnecessarily generating new output objects.
 
1.  Reuse observables from the input object

    Above, the `name` property above simply reuses - in the projected output object - an observable *from the input object*

1.  Use `ko.computed()` for new, computed properties

    The `computedName` property above uses a Knockout `computed`, and unwraps observables in the function that defines the  `computed`.
 With this, only the `computedName` property is recomputed when the input `robot` object changes.

1.  Use `map` and `filter` to reduce the size of the data you are binding to a control

    See "Use map and filter to reduce size of rendered data".

1.  Do not use `subscribe` to project\shape data.

    An extreme anti-pattern would be to not use `map` at all when projecting/shaping data for use in controls, as in the following example.

    ```ts
    // DO NOT DO THIS!
    this._view.items.subscribe((items) => {
        var mappedItems: MappedPerson[] = [];
        for (var i = 0; i < items.length; i++) {
            // create a new mapped person for every item
            mappedItems.push({
                name: items[i].name,
                model: robot.model()
            });
        }

        this.selectableGridViewModel.items(mappedItems);
    });
    ```

    There are two significant problems with `subscribe` used.

    * Whenever `this._view.items` changes, an *entirely new array containing entirely new objects* will be generated.  Your scenario will suffer from the cost of serializing/deserializing this new array to the grid control and from the cost of fully re-rendering your grid.

    * Whenever the `robot.model` observable changes, this change *will not be reflected in the grid*, since no code has subscribed to this `robot.model` observable.



