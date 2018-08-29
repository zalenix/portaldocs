* [Performance Overview](#performance-overview)
    * [Extension performance](#performance-overview-extension-performance)
    * [Blade performance](#performance-overview-blade-performance)
    * [Part performance](#performance-overview-part-performance)
    * [WxP score](#performance-overview-wxp-score)
    * [How to assess your performance](#performance-overview-how-to-assess-your-performance)
        * [Extension](#performance-overview-how-to-assess-your-performance-extension)
        * [Blade](#performance-overview-how-to-assess-your-performance-blade)
        * [Part](#performance-overview-how-to-assess-your-performance-part)
* [Performance Frequently Asked Questions (FAQ)](#performance-frequently-asked-questions-faq)
    * [My Extension 'load' is above the bar, what should I do](#performance-frequently-asked-questions-faq-my-extension-load-is-above-the-bar-what-should-i-do)
    * [My Blade 'FullReady' is above the bar, what should I do](#performance-frequently-asked-questions-faq-my-blade-fullready-is-above-the-bar-what-should-i-do)
    * [My Part 'Ready' is above the bar, what should I do](#performance-frequently-asked-questions-faq-my-part-ready-is-above-the-bar-what-should-i-do)
    * [My WxP score is below the bar, what should I do](#performance-frequently-asked-questions-faq-my-wxp-score-is-below-the-bar-what-should-i-do)
    * [Is there any way I can get further help](#performance-frequently-asked-questions-faq-is-there-any-way-i-can-get-further-help)
* [Performance best practices](#performance-best-practices)
    * [Operational best practices](#performance-best-practices-operational-best-practices)
    * [Coding best practices](#performance-best-practices-coding-best-practices)
    * [General best practices](#performance-best-practices-general-best-practices)
* [Performance profiling](#performance-profiling)
    * [How to profile your scenario](#performance-profiling-how-to-profile-your-scenario)
    * [Idenitifying common slowdowns](#performance-profiling-idenitifying-common-slowdowns)
    * [Verifying a change](#performance-profiling-verifying-a-change)


<a name="performance-overview"></a>
# Performance Overview

Portal performance from a customer's perspective is seen as all experiences throughout the product. 
As an extension author you have a duty to uphold your experience to the performance bar at a minimum.

| Area      | 95th Percentile Bar | Telemetry Action         | How is it measured? |
| --------- | ------------------- | ------------------------ | ------------------- |
| Extension | < 4 secs       | ExtensionLoad            | The time it takes for your extension's home page to be loaded and initial scripts, the `initialize` call to complete within your Extension definition file  |
| Blade     | < 4 secs       | BladeFullReady           | The time it takes for the blade's `onInitialize` or `onInputsSet` to resolve and all the parts on the blade to become ready |
| Part      | < 4 secs       | PartReady                | Time it takes for the part to be rendered and then the part's OnInputsSet to resolve |
| WxP       | > 80       | N/A                      | An overall experience score, calculated by weighting blade usage and the blade full ready time |

<a name="performance-overview-extension-performance"></a>
## Extension performance

Extension performance effects both Blade and Part performance, as your extension is loaded and unloaded as and when it is required.
In the case a user is visiting your resource blade for the first time, the Fx will load up your extension and then request the view model, consequently your Blade/Part performance is affected.
If the user were to browse away from your experience and browse back before your extension is unloaded obviously second visit will be faster, as they don't pay the cost of loading the extension.

<a name="performance-overview-blade-performance"></a>
## Blade performance

Blade performance is spread across a couple of main areas:

1. Blade's constructor
1. Blade's onInitialize or onInputsSet
1. Any Parts within the Blade become ready

If your blade is a FrameBlade or AppBlade there is an additional initialization message from your iframe to your viewmodel which is also tracked, see the samples extension [framepage.js](https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FAcceptanceTests%2FExtensions%2FSamplesExtension%2FExtension%2FContent%2FScripts%2Fframepage.js&version=GBproduction&_a=contents) for an example of what messages are required.

All of which are encapsulated under the one 'BladeFullReady' action.

<a name="performance-overview-part-performance"></a>
## Part performance

Similar to Blade performance, Part performance is spread across a couple of areas:

1. Part's constructor
1. Part's onInitialize or onInputsSet

If your part is a FramePart there is an additional initialization message from your iframe to your viewmodel which is also tracked, see the samples extension [framepage.js](https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FAcceptanceTests%2FExtensions%2FSamplesExtension%2FExtension%2FContent%2FScripts%2Fframepage.js&version=GBproduction&_a=contents) for an example of what messages are required.

All of which are encapsulated under the one 'PartReady' action.

<a name="performance-overview-wxp-score"></a>
## WxP score

The WxP score is a per extension Weight eXPerience score (WxP). It is calculated by the as follows:

```txt

WxP = (BladeViewsMeetingTheBar * 95thPercentileBar) / ((BladeViewsMeetingTheBar * 95thPercentileBar) + ∑(BladeViewsNotMeetingTheBar * ActualLoadTimePerBlade))

```

| Blade   | 95th Percentile Times | Usage Count | Meets 95th Percentile Bar? |
| ------- | --------------------- | ----------- | -------------------------- |
| Blade A | 1.2                   | 1000        | Yes                        |
| Blade B | 5                     | 500         | No                         |
| Blade C | 6                     | 400         | No                         |

```txt

WxP = (BladeViewsMeetingTheBar * 95thPercentileBar) / ((BladeViewsMeetingTheBar * 95thPercentileBar) + ∑(BladeViewsNotMeetingTheBar * ActualLoadTimePerBlade)) %
    = (4 * 1000) / ((4 * 1000) + ((5 * 500) + (6 * 400))) %
    = 44.94%

```

As you can see the model penalizes the number of views which don’t meet the bar and weights those.

<a name="performance-overview-how-to-assess-your-performance"></a>
## How to assess your performance

There are two methods to assess your performance:

1. Visit the IbizaFx provided PowerBi report*
1. Run Kusto queries locally to determine your numbers

    (*) To get access to the PowerBi dashboard reference the [Telemetry onboarding guide][TelemetryOnboarding], then access the following [Extension performance/reliability report][Ext-Perf/Rel-Report]

The first method is definitely the easiest way to determine your current assessment as this is maintained on a regular basis by the Fx team.
You can, if preferred, run queries locally but ensure you are using the Fx provided Kusto functions to calculate your assessment.

<a name="performance-overview-how-to-assess-your-performance-extension"></a>
### Extension

[database('Partner').ExtensionPerformance(ago(1h), now())](https://aka.ms/kwe?cluster=azportal.kusto.windows.net&database=AzurePortal&q=H4sIAAAAAAAAA0tJLElMSixO1VAPSCwqyUstUtfUc60oSc0rzszPC0gtSssvyk3MS07VSEzP1zDM0NRRyMsv19DU5AIAxF6Q5zkAAAA%3D)

ExtensionPerformance will return a table with the following columns:

- Extension
    - The name of the extension
- Loads
    - How many times the extension was loaded within the given date range
- 50th, 80th, 95th
    - The time it takes for your extension to initialize. This is captured under the `ExtensionLoad` action in telemetry
- HostingServiceloads
    - The number of loads from the hosting service
- UsingTheHostingService
    - If the extension is predominantly using the hosting service in production

<a name="performance-overview-how-to-assess-your-performance-blade"></a>
### Blade

[database('Partner').BladePerformanceIncludingNetwork(ago(1h), now())](https://aka.ms/kwe?cluster=azportal.kusto.windows.net&database=AzurePortal&q=H4sIAAAAAAAAA0tJLElMSixO1VAPSCwqyUstUtfUc8pJTEkNSC1Kyy%2FKTcxLTvXMS84pTcnMS%2FdLLSnPL8rWSEzP1zDM0NRRyMsv19DU5AIA1W5beEUAAAA%3D)

With the `BladePerformanceIncludingNetwork` function, we sample 1% of traffic to measure the number of network requests that are made throughout their session, that sampling does not affect the overall duration that is reported. Within the function we will correlate the count of any network requests, these are tracked in telemetry under the action `XHRPerformance`, made when the user is loading a given blade. It does not impact the markers that measure performance. That said a larger number of network requests will generally result in slower performance.

The subtle difference with the standard `BladeFullReady` marker is that if the blade is opened within a resource menu blade we will attribute the time it takes to resolve the `getMenuConfig` promise as the resource menu blade is loaded to the 95th percentile of the 'BladeFullReady' duration. This is attributed using a proportional calculation based on the number of times the blade is loaded inside the menu blade.

For example, a blade takes 2000ms to complete its `BladeFullReady` and 2000ms to return its `getMenuConfig`.
It is only loaded once (1) in the menu blade out of its 10 loads. Its overall reported FullDuration would be 2200ms.

BladePerformanceIncludingNetwork will return a table with the following columns

 - FullBladeName, Extension, BladeName
   - Blade/Extension identifiers
 - BladeCount
   - The number of blade loads within the given date range
 - InMenuLoads
   - The number of in menu blade loads within the given date range
 - PctOfMenuLoads
   - The percentage of in menu blade loads within the given date range
 - Samples
   - The number of loads which were tracking the number of XHR requests
 - StaticMenu
   - If the `getMenuConfig` call returns within < 10ms, only applicable to ResourceMenu cases
 - MenuConfigDuration95
   - The 95th percentile of the `getMenuConfig` call
 - LockedBlade
   - If the blade is locked, ideally blades are now template blades or no-pdl
   - All no-pdl and template blades are locked, pdl blades can be made locked by setting the locked property to true
 - XHRCount, XHRCount95th, XHRMax
   - The 50th percentile (95th or MAX) of XHR requests sent which correlate to that blade load
 - Bytes
   - Bytes transferred to the client via XHR requests
 - FullDuration50, 80, 95, 99
   - The time it takes for the `BladeFullReady` + (`PctOfMenuLoads` * the `getMenuConfig` to resolve)
 - RedScore
   - Number of violations for tracked bars
 - AlertSeverity
   - If the blade has opted to be alerted against via the [alerting infrastructure](index-portalfx-extension-monitor.md#performance) and what severity the alert will open at.

<a name="performance-overview-how-to-assess-your-performance-part"></a>
### Part

[database('Partner').PartPerformance(ago(1h), now())](https://aka.ms/kwe?cluster=azportal.kusto.windows.net&database=AzurePortal&q=H4sIAAAAAAAAA0tJLElMSixO1VAPSCwqyUstUtfUA7ECUovS8otyE%2FOSUzUS0%2FM1DDM0dRTy8ss1NDW5AIGipTc0AAAA)

PartPerformance will return a table with the following columns:

- FullPartName, Extension, PartName
    - Part/Extension identifiers
- PartCount
    - How many times the part was loaded within the given date range
- Samples
    - The number of loads which were tracking the number of XHR requests
- XHRCount, XHRCount95th, XHRMax
    - The 50th percentile (95th or MAX) of XHR requests sent which correlate to that part load (*) This is a rough heuristic, based on a 1% sampling.
- Bytes
    - Bytes transferred to the client via XHR requests
- 50th, 80th, 95th, 99th
    - The time it takes for your part to resolve its `onInputsSet` or `onInitialize` promise. This is captured under the `PartReady` action in telemetry
 - RedScore
   - Number of violations for tracked bars 

<a name="performance-frequently-asked-questions-faq"></a>
# Performance Frequently Asked Questions (FAQ)

<a name="performance-frequently-asked-questions-faq-my-extension-load-is-above-the-bar-what-should-i-do"></a>
## My Extension &#39;load&#39; is above the bar, what should I do

1. Profile what is happening in your extension load. [Profile your scenario](#performance-profiling)
1. Are you using the Portal's ARM token? If no, verify if you can use the Portal's ARM token and if yes, follow: [Using the Portal's ARM token](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-manager-api-authentication)
1. Are you on the hosting service? If no, migrate to the hosting service: [Hosting service documentation](portalfx-extension-hosting-service.md#extension-hosting-service)
    - If you are, have you enabled prewarming? 
        - Follow http://aka.ms/portalfx/docs/prewarming to enable prewarming for your extension load.
1. Are you using obsolete bundles? 
    - If yes, remove your dependency to them and then remove the obsolete bitmask. This is a blocking download before your extension load. See below for further details.
1. See our [best practices](#performance-best-practices)

<a name="performance-frequently-asked-questions-faq-my-blade-fullready-is-above-the-bar-what-should-i-do"></a>
## My Blade &#39;FullReady&#39; is above the bar, what should I do

1. Assess what is happening in your Blades's `onInitialize` or constructor and `onInputsSet`. [Profile your scenario](#performance-profiling)
    1. Can that be optimized?
1. If there are any AJAX calls;
    1. Can they use batch? If so, migrate over to use the batch api.
    1. Wrap them with custom telemetry and ensure they you aren't spending a large amount of time waiting on the result. If you are to do this, please only log one event per blade load, this will help correlate issues but also reduce unneccesary load on telemetry servers.
1. How many parts are on the blade?
    - If there is only a single part, if you're not using a no-pdl blade or `<TemplateBlade>` migrate your current blade to a no-pdl blade.
    - If there are multiple parts, migrate over to use a no-pdl blade.
    - Ensure to support any old pinned parts when you migrate.
1. Does your blade open within a resource menu blade?
    - If it does, ensure the `getMenuConfig` call is returned statically (< 10ms). You can make use of the enabled/disabled observable property on menu items, if you need to asynchronously determine to enable a menu item. 
1. See our [best practices](#performance-best-practices)
    
<a name="performance-frequently-asked-questions-faq-my-part-ready-is-above-the-bar-what-should-i-do"></a>
## My Part &#39;Ready&#39; is above the bar, what should I do

1. Assess what is happening in your Part's `onInitialize` or constructor and `onInputsSet`. [Profile your scenario](#performance-profiling)
    1. Can that be optimized?
1. If there are any AJAX calls;
    1. Can they use batch? If so, migrate over to use the batch api.
    1. Wrap them with custom telemetry and ensure they you aren't spending a large amount of time waiting on the result. If you are to do this, please only log one event per part load, this will help correlate issues but also reduce unneccesary load on telemetry servers.
1. See our [best practices](#performance-best-practices)

<a name="performance-frequently-asked-questions-faq-my-wxp-score-is-below-the-bar-what-should-i-do"></a>
## My WxP score is below the bar, what should I do

Using the [Extension performance/reliability report][Ext-Perf/Rel-Report] you can see the WxP impact for each individual blade. Although given the Wxp calculation,
if you are drastically under the bar its likely a high usage blade is not meeting the performance bar, if you are just under the bar then it's likely it's a low usage
blade which is not meeting the bar.

<a name="performance-frequently-asked-questions-faq-is-there-any-way-i-can-get-further-help"></a>
## Is there any way I can get further help

Sure! Book in some time in the Azure performance office hours.

- __When?__  Wednesdays from 13:00 to 16:00
- __Where?__ B41 (Conf Room 41/24)
- __Contacts:__ Sean Watson (sewatson)
- __Goals__
    - Help extensions to meet the performance bar
    - Help extensions to measure performance 
    - Help extensions to understand their current performance status
- __How to book time__: Send a meeting request with the following
    - TO: sewatson;
    - Subject: YOUR_EXTENSION_NAME: Azure performance office hours
    - Location: Conf Room 41/24 (It is already reserved)

<a name="performance-best-practices"></a>
# Performance best practices

<a name="performance-best-practices-operational-best-practices"></a>
## Operational best practices

- Enable performance alerts
    - To ensure your experience never regresses unintentionally, you can opt into configurable alerting on your extension, blade and part load times. See [performance alerting](index-portalfx-extension-monitor.md#performance)
- Move to [hosting service](portalfx-extension-hosting-service.md#extension-hosting-service)
    - We've seen every team who have onboarded to the hosting service get some performance benefit from the migration. 
        - Performance benefits vary from team to team given your current infrastructure
        - We've commonly seen teams improve their performance by > 0.5s at the 95th  
    - If you are not on the hosting service ensure;
        1. Homepage caching is enabled
        1. Persistent content caching is enabled
        1. Compression is enabled
        1. Your service is efficiently geo-distributed (Note: we have seen better performance from having an actual presence in a region vs a CDN)
- Compression (Brotli)
    - Move to V2 targets to get this by default
- Remove controllers 
    - Don't proxy ARM through your controllers
- Don't require full libraries to make use of a small portion
    - Is there another way to get the same result?
- If you're using iframe experiences
    1. Ensure you have the correct caching enabled
    1. Ensure you have compression enabled
    1. Your bundling logic is optimised
    1. Are you serving your iframe experience geo-distributed efficiently?

<a name="performance-best-practices-coding-best-practices"></a>
## Coding best practices

- Reduce network calls
    - Ideally 1 network call per blade
    - Utilise `batch` to make network requests, see our [batch documentation](http://aka.ms/portalfx/docs/batch)
- Remove automatic polling
    - If you need to poll, only poll on the second request and ensure `isBackgroundTask: true` in the batch call
- Optimize bundling (Avoiding the waterfall)
    ```typescript
    /// <amd-bunding root="true" priority="0" />

    import ClientResources = require("ClientResources");
    ```
- Remove all dependencies on obsoleted code
    - Loading any required obsoleted bundles is a blocking request during your extension load times
    - See https://aka.ms/portalfx/obsoletebundles for further details
- Use the Portal's ARM token
- Don't use old PDL blades composed of parts: [hello world template blade](portalfx-no-pdl-programming.md#building-a-hello-world-template-blade-using-decorators)
    - Each part on the blade has its own viewmodel and template overhead, switching to a no-pdl template blade will mitigate that overhead
- Use the latest controls available: see https://aka.ms/portalfx/playground
    - This will minimise your observable usage
    - The newer controls are AMD'd reducing what is required to load your blade
- Remove Bad CSS selectors
    - Build with warnings as errors and fix them
    - Bad CSS selectors are defined as selectors which end in HTML elements for example `.class1 .class2 .class3 div { background: red; }`
        - Since CSS is evaluated from right-to-left the browser will find all `div` elements first, this is obviously expensive
- Fix your telemetry
    - Ensure you are returning the relevant blocking promises as part of your initialization path (`onInitialize` or `onInputsSet`), today you maybe cheating the system but that is only hurting your users.
    - Ensure your telemetry is capturing the correct timings

<a name="performance-best-practices-general-best-practices"></a>
## General best practices

- Test your scenarios at scale
    - How does your scenario deal with 100s of subscriptions or 1000s of resources?
    - Are you fanning out to gather all subscriptions, if so do not do that.
        - Limit the default experience to first N subscriptions and have the user determine their own scope.
- Develop in diagnostics mode
    - Use https://portal.azure.com?trace=diagnostics to detect console performance warnings
        - Using too many defers
        - Using too many ko.computed dependencies
- Be wary of observable usage
    - Try not to use them unless necessary
    - Don't aggressively update UI-bound observables
        - Accumulate the changes and then update the observable
        - Manually throttle or use `.extend({ rateLimit: 250 });` when initializing the observable

<a name="performance-profiling"></a>
# Performance profiling

<a name="performance-profiling-how-to-profile-your-scenario"></a>
## How to profile your scenario

1. Open a browser and load portal using `https://portal.azure.com/?clientoptimizations=bundle&feature.nativeperf=true​`
    - `clientOptimizations=bundle` will allow you to assess which bundles are being downloaded in a user friendly manner
    - `feature.nativeperf=true` will expose native performance markers within your profile traces, allowing you to accurately match portal telemetry markers to the profile
1. Go to a blank dashboard​
1. Clear cache (hard reset), remove all application data and reload the portal​
1. Use the browsers profiling timeline to throttle both network and CPU, this best reflects the 95th percentile scenario, then start the profiler
1. Walk through your desired scenario
    - Switch to the desired dashboard
    - Deep link to your blade, make sure to keep the feature flags in the deep link. Deeplinking will isolate as much noise as possible from your profile
1. Stop the profiler
1. Assess the profile

<a name="performance-profiling-idenitifying-common-slowdowns"></a>
## Idenitifying common slowdowns

1. Blocking network calls
    - Fetching data - We've seen often that backend services don't have the same performance requirements as the front end experience, because of which you may need to engage your backend team/service to ensure your front end experience can meet the desired performance bar. 
    - Required files - Downloading more than what is required, try to minimise your total payload size. 
1. Heavy rendering and CPU from overuse of UI-bound observables
    - Are you updating the same observable repeatedly in a short time frame? Is that reflected in the DOM in any way? Do you have computeds listening to a large number of observables?

<a name="performance-profiling-verifying-a-change"></a>
## Verifying a change

To correctly verify a change you will need to ensure the before and after are instrumented correctly with telemetry. Without that you cannot truly verify the change was helpful.
We have often seen what seems like a huge win locally transition into a smaller win once it's in production, we've also seen the opposite occur too.
The main take away is to trust your telemetry and not profiling, production data is the truth. 


[TelemetryOnboarding]: <portalfx-telemetry-getting-started.md>
[Ext-Perf/Rel-Report]: <http://aka.ms/portalfx/dashboard/extensionperf>