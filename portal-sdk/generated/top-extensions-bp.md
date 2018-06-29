<a name="azure-portal-best-practices"></a>
# Azure Portal Best Practices

This document  contains all Best Practices that have been added to Azure Portal topics. Best Practices that have been documented in textbooks and similar publications are outside of the scope of this document.

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

1. Run portalcop to identify and resolve common performance issues, as specified in [portalfx-performance-portalcop.md](portalfx-performance-portalcop.md).

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

![alt-text](../media/portalfx-performance/mapping.png "Using knockout projections to map an array")

* The data contains 300 items, and the time to load is over 1.5s. 
* The optimization of mapping to just the two columns in the selectable grid reduces the message size by 2/3. 
* The size reduction decreases the time needed to transfer the view model by about 50% for this sample data.
* The decrease in size and transfer time also reduces  memory usage.


<a name="azure-portal-best-practices-sideloading"></a>
## Sideloading


<a name="azure-portal-best-practices-best-practices"></a>
## Best Practices
   
***What is the best environment for sideloading during initial testing?***

 The FAQs for debugging extensions is located at [portalfx-extensions-faq-hosting-service.md](portalfx-extensions-faq-hosting-service.md).

* * *

<a name="azure-portal-best-practices-best-practices-onebox-stb-is-not-available"></a>
### Onebox-stb is not available

Onebox-stb has been deprecated. Please do not use it. Instead, migrate extensions to sideloading. For help on migration, send an email to  <a href="mailto:ibiza-onboarding@microsoft.com?subject=Help on Migration">ibiza-onboarding@microsoft.com</a>.

* * * 

<a name="azure-portal-best-practices-style-guide"></a>
## Style Guide


<a name="azure-portal-best-practices-best-practices"></a>
## Best Practices

<a name="azure-portal-best-practices-best-practices-general-best-practices"></a>
### General Best Practices

Do not use JavaScript reserved words, as specified in [https://docs.microsoft.com/en-us/scripting/javascript/reference/javascript-reserved-words](https://docs.microsoft.com/en-us/scripting/javascript/reference/javascript-reserved-words), as names for the icons in your extension.


<a name="azure-portal-best-practices-testing-in-production"></a>
## Testing in Production


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

    The `WaitUntil` method should be used when retrying actions or waiting for conditions. It can also be used to retry an action, because it takes a lambda function which could be an action, followed by a verification step.  The `WaitUntil` method will return when a "truthy" value is returned, i.e., the value is neither false nor null.  This is useful if the specific action does not behave consistently.  Remember to use only actions that are [idempotent](portalfx-extensions-glossary-testing.md) when using the  `WaitUntil` method in this pattern.

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


