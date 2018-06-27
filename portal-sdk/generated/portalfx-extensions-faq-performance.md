<a name="frequently-asked-questions"></a>
## Frequently asked questions

<a name="frequently-asked-questions-extension-scores-are-above-the-bar"></a>
### Extension scores are above the bar

***How can I refactor my code to improve performance?***


DESCRIPTION:

The PowerBi dashboard that is located at [http://aka.ms/portalfx/dashboard/extensionperf](http://aka.ms/portalfx/dashboard/extensionperf) displays various performance statistics for several extensions.
You can select your Extension and Blade on the filters.
The scores for the individual pieces of an extension are related, so it is possible that improving the scores for a part will also bring the scores for the blade or the extension into alignment with performance expectations.

SOLUTION: 

1. Decrease Part 'Revealed' scores

    * Optimize the part's `constructor` and `OnInputsSet` methods
    * Remove obsolete bundles, as specified in  [https://aka.ms/portalfx/obsoletebundles](https://aka.ms/portalfx/obsoletebundles).
    * Wrap any **AJAX** calls with custom telemetry to ensure that they are not waiting on the result of the call.     Also, ensure that **AJAX** is called using the batch api.
    * If the part receives partial data previous to the completion of the `OnInputsSet` method, then the part can reveal the information early and display the partial data.  The part should also  load the UI for the individual components.

1. Decrease Blade 'Revealed' scores.

    * Optimize the quantity and quality of parts on the blade.
        * If there is only one part, or if the part is not a `<TemplateBlade>`, then migrate the part to use the  no-pdl template as specified in  [top-blades-template.md](top-blades-template.md).
        * If there are more than three parts, consider refactoring or removing some of them so that fewer parts need to be displayed.
    * Optimize the Blades's `constructor` and `OnInputsSet` methods.
    * Remove obsolete bundles, as specified in  [https://aka.ms/portalfx/obsoletebundles](https://aka.ms/portalfx/obsoletebundles).
    * Use  the Portal's ARM token, if possible. Verify whether the extension can use the Portal's ARM token and if so, follow the instructions in the document  located at    to install it.
    * Change the extension to use the hosting service, as specified in [top-extensions-hosting-service.md](top-extensions-hosting-service.md).
       * Wrap any **AJAX** calls with custom telemetry to ensure that they are not waiting on the result of the call.   Also, ensure that **AJAX** is called using the batch api.
    * Reduce the revealed times for parts on the blade.
    * Check for waterfalling or serialized bundle requests, as described in [portalfx-extensions-bp-performance.md#coding-best-practices](portalfx-extensions-bp-performance.md#coding-best-practices).  If any waterfalls exist within the extension, ensure you have the proper bundling hinting in place, as specified in [top-extensions-debugging.md#toggling-optimizations](top-extensions-debugging.md#toggling-optimizations).

* * *

<a name="frequently-asked-questions-my-wxp-score-is-below-the-bar"></a>
### My WxP score is below the bar

***How do I identify which pieces of the extension are not performant?***

DESCRIPTION: 

The PowerBi dashboard that is located at [http://aka.ms/portalfx/dashboard/extensionperf](http://aka.ms/portalfx/dashboard/extensionperf) displays the WxP impact for each individual blade. It may not display information at the level of granularity that immediately points to the problem.

SOLUTION:

If the extension is drastically under the bar, it is  likely that a high-usage blade is not meeting the performance bar.  If the extension is nearly meeting the  bar, then it is likely that a low-usage blade is the one that is not meeting the bar.

* * * 

<a name="frequently-asked-questions-azure-performance-office-hours"></a>
### Azure performance office hours

***Is there any way I can get further help?***

Sure! Book in some time in the Azure performance office hours.

**When?** Wednesdays from 1:00 to 3:30

**Where?** Building 42, Conference Room 42/46

**Contacts**: Sean Watson (sewatson)

**Goals**:

* Help extensions to meet the performance bar
* Help extensions to measure performance
* Help extensions to understand their current performance status

**How to book time** 

Send a meeting request with the following information.

```
TO: sewatson
Subject: YOUR_EXTENSION_NAME: Azure performance office hours
Location: Conf Room 42/46 (It is already reserved)
```

You can also reach out to <a href="mailto:sewatson@microsoft.com?subject=<extensionName>: Azure performance office hours&body=Hello, I need some help with my extension.  Can I meet with you in Building 42, Conference Room 42/46 on Wednesday the <date> from 1:00 to 3:30?">Azure Extension Performance Team at sewatson@microsoft.com</a>.

<!--###  Extension 'InitialExtensionResponse' is above the bar

 'ManifestLoad' is above the bar, what should I do

 'InitializeExtensions' is above the bar, what should I do
 -->

