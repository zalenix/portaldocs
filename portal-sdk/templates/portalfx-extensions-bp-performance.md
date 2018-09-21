
## Best Practices

There are a few patterns that assist in improving browser and Portal performance.

### General Best Practices

1. Test your scenarios at scale 

    * Determine how your scenario deals with hundreds of subscriptions or thousands of resources.

    * Do not fan out to gather all subscriptions. Instead, limit the default experience to first N subscriptions and have the user determine their own scope.

1. Develop in diagnostics mode 

    * Use [https://portal.azure.com?trace=diagnostics](https://portal.azure.com?trace=diagnostics) to detect console performance warnings, like using too many defers or using too many `ko.computed` dependencies.

1. Be wary of observable usage 

    * Try not to use them unless necessary

    * Do not aggressively update UI-bound observables. Instead, accumulate the changes and then update the observable. Also, manually throttle or use `.extend({ rateLimit: 250 });` when initializing the observable.

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

### Operational best practices

1. Enable performance alerts

    To ensure your experience never regresses unintentionally, you can opt into configurable alerting on your extension, blade and part load times. For more information, see [top-extensions-telemetry-alerting.md](top-extensions-telemetry-alerting.md).

1. Move the extension to the Azure hosting service, as specified in [top-extensions-hosting-service.md](top-extensions-hosting-service.md). If it is not on the hosting service, check the following factors.

    * Homepage caching should be enabled
    * Persistent content caching should be enabled
    * Compression is enabled
    * Your service is efficiently geo-distributed 

    **NOTE**: An actual presence in a region instead of a CDN contributes to extension performance.

1. Use Brotli Compression 

    Move to V2 targets to get this type of compression by default. 


1. Remove controllers. Do not proxy ARM through your controllers.


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

### Use pageableGrids for large data sets

When working with large data sets, developers should use grids and their paging features.
Paging allows deferred loading of rows, so even with large datasets, responsiveness is maintained.

Paging implies that many rows might not need to be loaded at all. For more information about paging with grids, see [portalfx-control-grid.md](portalfx-controls-grid.md)  and the sample located at `<dir>\Client\V1\Controls\Grid\ViewModels\PageableGridViewModel.ts`.

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

### Benefits to UI-rendering performance

The following image uses the selectableGrid `map` function to display only the data that is associated the properties that are required by the grid row.

![alt-text](../media/top-extensions-performance/mapping.png "Using knockout projections to map an array")

* The data contains 300 items, and the time to load is over 1.5s. 
* The optimization of mapping to just the two columns in the selectable grid reduces the message size by 2/3. 
* The size reduction decreases the time needed to transfer the view model by about 50% for this sample data.
* The decrease in size and transfer time also reduces  memory usage.
