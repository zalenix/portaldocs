
<a name="frequently-asked-questions"></a>
# Frequently Asked Questions

<!-- FAQ documents are included in this document in the same order as the topic documents are included in the README.md. -->

This section contains all Azure Portal FAQ's.

<a name="frequently-asked-questions-onboarding-a-new-extension"></a>
## Onboarding a new extension

<a name="frequently-asked-questions-frequently-asked-questions"></a>
## Frequently asked questions

<a name="frequently-asked-questions-frequently-asked-questions-ssl-certs"></a>
### SSL certs

***How do I use SSL certs?***

Instructions are located at [portalfx-extensions-faq-debugging.md#sslCerts](portalfx-extensions-faq-debugging.md#sslCerts).

* * *

<a name="frequently-asked-questions-frequently-asked-questions-loading-different-versions-of-an-extension"></a>
### Loading different versions of an extension

***How do I load different versions of an extension?***

Understanding which extension configuration to modify is located at [portalfx-extensions-configuration-overview.md#understanding-which-extension-configuration-to-modify](portalfx-extensions-configuration-overview.md#understanding-which-extension-configuration-to-modify).




<a name="frequently-asked-questions-what-s-new"></a>
## What&#39;s new


<a name="frequently-asked-questions-frequently-asked-questions"></a>
## Frequently asked questions

<!-- TODO:  FAQ Format is ###Link, ***title***, Description, Solution, 3 Asterisks -->

<a name="frequently-asked-questions-frequently-asked-questions-how-do-i-know-what-properties-methods-to-add-to-my-blade-or-part-class"></a>
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

<a name="frequently-asked-questions-frequently-asked-questions-how-do-i-know-what-types-to-return-from-the-oninitialize-method"></a>
### How do I know what types to return from the <code>onInitialize</code> method?

SOLUTION: If a 'return' statement is not used in the  `onInitialize` method, or any other method required by the  choice of **TypeScript** decorator, **Intellisense** errors will reflect the expected return type for the method:

```
public onInitialize() {
    // No return statement
}
...
```

<a name="frequently-asked-questions-frequently-asked-questions-why-can-t-i-return-my-data-loading-promise-directly-from-oninitialize"></a>
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

<a name="frequently-asked-questions-frequently-asked-questions-why-can-t-i-return-my-data-loading-promise-directly-from-oninitialize-i-don-t-understand-the-typescript-compilation-errors-that-is-occuring-around-my-typescript-blade-part-and-there-are-lots-of-them-what-should-i-do"></a>
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

<a name="frequently-asked-questions-frequently-asked-questions-how-do-i-add-an-icon-to-my-blade"></a>
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

<a name="frequently-asked-questions-frequently-asked-questions-how-do-i-control-the-loading-indicators-for-my-blade-how-is-it-different-from-pdl-blades"></a>
### How do I control the loading indicators for my Blade?  How is it different from PDL Blades?

Controlling the loading indicator in Blades/Parts, as specified in [portalfx-parts-revealContent.md](portalfx-parts-revealContent.md), is the almost exactly the same for PDL and no-PDL Blades/Parts. .

<a name="frequently-asked-questions-frequently-asked-questions-how-do-i-control-the-loading-indicators-for-my-blade-how-is-it-different-from-pdl-blades-when-should-i-use-the-operations-api-to-control-the-blade-part-s-loading-indicator"></a>
#### When should I use the &#39;operations&#39; API to control the Blade/Part&#39;s loading indicator?

SOLUTION: 
There are scenarios like 'User clicks "Save" or "Refresh" on my Blade/Part' where the extension wants to show loading indicators at the Blade/Part level.  What's distinct about this scenario is that the Blade/Part has already completed its initialization and, now, the user is interacting with the Blade/Part UI.  This is precisely the kind of scenario for the 'operations' API.  
For no-PDL Blades/Parts, the 'operations' API is `this.context.container.operations`, and the API's use is described in [portalfx-parts-revealContent.md#displaying-a-loading-indicator-ux](portalfx-parts-revealContent.md#displaying-a-loading-indicator-ux).  There is a sample to consult [here](https://df.onecloud.azure-test.net/#blade/SamplesExtension/TemplateBladeWithSettings).

* * * 

<a name="frequently-asked-questions-frequently-asked-questions-how-can-i-save-some-state-for-my-no-pdl-blade"></a>
### How can I save some state for my no-PDL Blade?

There is a decorator - @TemplateBlade.Configurable.Decorator for example, available on all Blade variations - that adds a `this.context.configuration` API that can be used to load/save Blade "settings".  See a sample [here](https://df.onecloud.azure-test.net/#blade/SamplesExtension/TemplateBladeWithSettings).

**WARNING** - We've recently identified this API as a source of Portal perf problems.  In the near future, the Ibiza team will break this API and replace it with an API that is functionally equivalent (and better performing). 

* * *

<a name="frequently-asked-questions-getting-started"></a>
## Getting Started


<a name="frequently-asked-questions-frequently-asked-questions"></a>
## Frequently Asked Questions

   <!-- TODO:  FAQ Format is ###Link, ***title***, Description, Solution, 3 Asterisks -->

<a name="frequently-asked-questions-frequently-asked-questions-getting-started"></a>
### Getting Started

***Q: I want to create a new extension. How do I start?***

SOLUTION: To contribute an extension to the Portal, you can build an extension in its own source tree instead of cloning the a Portal repository.

You can write an extension by following the instructions in using the [portalfx-extensions-create-first-extension.md](portalfx-extensions-create-first-extension.md), deploy it to your own machine, and load it into the Portal at runtime.

When you are ready to register the extension in the preview or production environments, make sure you have the right environment as specified in  [top-extensions-developmentPhases.md](top-extensions-developmentPhases.md). Then publish it to the environment as specified in [top-extensions-publishing.md](top-extensions-publishing.md).

For more information about Portal architecture, see [top-extensions-architecture.md](top-extensions-architecture.md).

<a name="frequently-asked-questions-frequently-asked-questions-getting-help"></a>
### Getting Help

***Q: I'm stuck. Where can I find help?***

SOLUTION: There are a few ways to get help.

* Read the documentation located at [https://github.com/Azure/portaldocs/tree/master/portal-sdk/](https://github.com/Azure/portaldocs/tree/master/portal-sdk/).

* Read and experiment with the samples that are shipped with the SDK. They are located at `\My Documents\PortalSDK\FrameworkPortal\Extensions\SamplesExtension`   directory. If there is a working copy of the sample in the Dogfood environment, it is located at [http://aka.ms/portalfx/samples](http://aka.ms/portalfx/samples). Sections, tabs, and other controls can be found in the playground located at [https://aka.ms/portalfx/playground](https://aka.ms/portalfx/playground).

* Read the debugging guide located at [top-extensions-debugging.md](top-extensions-debugging.md).

* If you are unable to find an answer, reach out to the Ibiza team at  [Stackoverflow Ibiza](https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza).  For a list of topics and stackoverflow tags, see [portalfx-stackoverflow.md](portalfx-stackoverflow.md).


<a name="frequently-asked-questions-frequently-asked-questions-broswer-support"></a>
### Broswer Support

***Q: Which browsers are supported?***

SOLUTION: Currently the Portal supports the latest version of Edge, Firefox, Chrome, and Safari, and it also supports Internet Explorer Version 11.

<a name="frequently-asked-questions-frequently-asked-questions-blade-commands"></a>
### Blade Commands

***Q: How do I show different commands for a blade based on the parameters passed to that blade?***

SOLUTION:

This is not possible with PDL-based Commands, but is possible with TypeScript-based commands.
The **Toolbar** APIs allow an extension to call `commandBar.setItems([...])` to supply the list of commands at run-time. For more information, see `<dir>\Client\V1\Blades\Toolbar\Toolbar.pdl`, where  `<dir>` is the `SamplesExtension\Extension\` directory, based on where the samples were installed when the developer set up the SDK.



<a name="frequently-asked-questions-frequently-asked-questions"></a>
## Frequently asked questions

***Where are the FAQ's for normal debugging?***

The FAQs for debugging extensions is located at [portalfx-extensions-faq-debugging.md](portalfx-extensions-faq-debugging.md).

* * *

<a name="frequently-asked-questions-frequently-asked-questions-sandboxed-iframe-security"></a>
### Sandboxed iframe security

*** I get an error 'Security of a sandboxed iframe is potentially compromised by allowing script and same origin access'. How do I fix this? ***

You need to allow the Azure Portal to frame your extension URL. For more information, [click here](portalfx-creating-extensions.md).

* * *

<a name="frequently-asked-questions-frequently-asked-questions-extension-will-not-sideload"></a>
### Extension will not sideload

*** My Extension fails to side load and I get an ERR_INSECURE_RESPONSE in the browser console ***

![ERR_INSECURE_RESPONSE](../media/portalfx-productiontest/errinsecureresponse.png)

In this case the browser is trying to load the extension but the SSL certificate from localhost is not trusted the solution is to install/trust the certificate.

Please checkout the stackoverflow post: [https://stackoverflow.microsoft.com/questions/15194/ibiza-extension-unable-to-load-insecure](https://stackoverflow.microsoft.com/questions/15194/ibiza-extension-unable-to-load-insecure)

Items that are specifically status codes or error messages can be located in [portalfx-extensions-status-codes.md](portalfx-extensions-status-codes.md).

* * *

<a name="frequently-asked-questions-frequently-asked-questions-sideloading-in-chrome"></a>
### Sideloading in Chrome

***Ibiza sideloading in Chrome fails to load parts***
    
Enable the `allow-insecure-localhost` flag, as described in [https://stackoverflow.microsoft.com/questions/45109/ibiza-sideloading-in-chrome-fails-to-load-parts](https://stackoverflow.microsoft.com/questions/45109/ibiza-sideloading-in-chrome-fails-to-load-parts)

* * *

<a name="frequently-asked-questions-frequently-asked-questions-sideloading-in-chrome-sideloading-gallery-packages"></a>
#### Sideloading gallery packages

***Trouble sideloading gallery packages***

SOLUTION:  Some troubleshooting steps are located at [https://stackoverflow.microsoft.com/questions/12136/trouble-side-loading-gallery-packages](https://stackoverflow.microsoft.com/questions/12136/trouble-side-loading-gallery-packages)

* * *

<a name="frequently-asked-questions-frequently-asked-questions-sideloading-in-chrome-sideloading-friendly-names"></a>
#### Sideloading friendly names

***Sideloading friendly names is not working in the Dogfood environment***

In order for Portal to load a test version of an extension, i.e., load without using the PROD configuration, developers can append the feature flag `feature.canmodifystamps`. The following example uses the sideload url to load the "test" version of extension.

`https://portal.azure.com?feature.canmodifystamps=true&<extensionName>=test`

The parameter `feature.canmodifystamps=true` is required for side-loading, and 
 **extensionName**, without the angle brackets, is replaced with the unique name of extension as defined in the `extension.pdl` file. For more information, see [https://stackoverflow.microsoft.com/questions/64951/extension-hosting-service-side-loading-friendlynames-not-working-in-dogfood](https://stackoverflow.microsoft.com/questions/64951/extension-hosting-service-side-loading-friendlynames-not-working-in-dogfood).

* * *

<a name="frequently-asked-questions-frequently-asked-questions-other-testing-questions"></a>
### Other testing questions

***How can I ask questions about testing ?***

You can ask questions on Stackoverflow with the tag [ibiza-test](https://stackoverflow.microsoft.com/questions/tagged/ibiza-test).

<a name="frequently-asked-questions-samples"></a>
## Samples


<a name="frequently-asked-questions-frequently-asked-questions"></a>
## Frequently asked questions


<!-- TODO:  FAQ Format is ###Link, ***title***, Description, Solution, 3 Asterisks -->
<a name="frequently-asked-questions-frequently-asked-questions-samples-will-not-compile"></a>
### Samples will not compile

***How do I fix this?***

 DESCRIPTION:  

  By default, the samples are not aware of whether V1 or V2 is being used, or whether the IDE options match the version. There may be an error message TS1219.  Errors may also occur based on the version of the SDK.

 SOLUTION: 

 Add a `tsconfig.json` file to the project that specifies that decorators are experimental, as in the following code.

 ```cs
 {
  "compilerOptions": {
    "noImplicitAny": false,
    "noEmitOnError": true,
    "removeComments": false,
    "sourceMap": true,
    "target": "es5",
    "experimentalDecorators": true
  },
  "exclude": [
    "node_modules"
  ]
}
 ```
 
 For more information, see [https://stackoverflow.com/questions/35460232/using-of-typescript-decorators-caused-errors](https://stackoverflow.com/questions/35460232/using-of-typescript-decorators-caused-errors).

 * * *

<a name="frequently-asked-questions-frequently-asked-questions-cannot-launch-iis"></a>
### Cannot launch IIS

*** Unable to launch the Microsoft Visual Studio IIS Express Web server***

DESCRIPTION:

Failed to register URL "https://localhost:44306/" for site "SamplesExtension" application "/". Error description: Cannot create a file when that file already exists. (0x800700b7)

SOLUTION: 

Terminate IIS express processes in Task Manager and press F5 again.

* * *

<a name="frequently-asked-questions-blades-and-parts"></a>
## Blades and parts

<a name="frequently-asked-questions-frequently-asked-questions"></a>
## Frequently asked questions

<a name="frequently-asked-questions-frequently-asked-questions-when-to-make-properties-observable"></a>
### When to make properties observable

*** Why not make every property observable just in case you want to update it later?***

SOLUTION: Performance. Using an observable string instead of a string increases the size of the `ViewModel`.  It also means that the proxied observable layer has to do extra work to connect listeners to the observable if it is ever updated. Both factors reduce the blade reveal performance - for no benefit when the observable is never updated. Extensions should use non-observable values wherever possible. However, there are still many framework Viewmodels that accept only observable values, therefore the extension may provide an observable even though it will never be updated.

* * *



<a name="frequently-asked-questions-frequently-asked-questions"></a>
## Frequently asked questions

<!-- TODO:  FAQ Format is ###Link, ***title***, Description, Solution, 3 Asterisks -->

<a name="frequently-asked-questions-frequently-asked-questions-the-resource-menu"></a>
### The Resource menu

***What is the resource menu?***

SOLUTION:  The resource menu is a single location for all the resource's functionality. It reduces horizontal movement by promoting a consistent navigation model for all Azure resources.

* * *

<a name="frequently-asked-questions-frequently-asked-questions-resource-menu-samples"></a>
### Resource menu samples

***Are there any samples I can refer to?***

SOLUTION: There are numerous samples that demonstrate how to use the resource menu.  They are located at `..<dir>\Client\ResourceTypes\Desktop\AssetViewModels\DesktopViewModel.ts`, where `<dir>` is the `SamplesExtension\Extension\` directory, based on where the samples were installed when the developer set up the SDK. 

* * *

<a name="frequently-asked-questions-frequently-asked-questions-the-support-resource-management-group"></a>
### The Support Resource Management Group

***How do I add items to the Support/Resource Management Group?***

SOLUTION:  You can add items by using a `MenuGroupExtension`. `MenuGroupExtension` is a special kind of menu group that is  specified in the menu config object.  For more information, see 
[portalfx-resourcemenu-migration.md#creating-an-assetviewmodel](portalfx-resourcemenu-migration.md#creating-an-assetviewmodel).

* * * 

<a name="frequently-asked-questions-frequently-asked-questions-horizontal-scrolling"></a>
### Horizontal scrolling

***How do I reduce horizontal scrolling and UI movement in my extension?***

Horizontal scrolling and UI movement was a prime source of negative user feedback. One way of addressing this issue is to refactor the extension so that there are fewer blades on the user's journey. The average journey depth is three or four blades and the average flow is Browse, Resource blade, Settings and then some blade from Settings or Resource menu. In many cases, the fourth blade is displayed off screen and then scrolled into view.  Using a Resource blade reduces the dependency on the settings blade. In some instances, an extension no longer uses a Settings blade, thereby reducing the number of blades on the journey.

* * *

<a name="frequently-asked-questions-building-ui-with-html-templates-and-fx-controls"></a>
## Building UI with HTML templates and Fx controls

<a name="frequently-asked-questions-faqs-for-extension-controls"></a>
## FAQs for Extension Controls

   <!-- TODO:  FAQ Format is ###Link, ***title***, Description, Solution, 3 Asterisks -->

<a name="frequently-asked-questions-faqs-for-extension-controls-how-to-use-a-monitorchartpart-from-legacy-blade"></a>
### How to use a MonitorChartPart from Legacy Blade

***My extension is still using legacy blades (locked or unlocked). Is this still applicable to me? If yes, do I get the benefits mentioned above?***

SOLUTION: Even if you are not using template blades, you can reference the MonitorChartPart from the Hubs extension, as specified in [portalfx-controls-monitor-chart.md#legacy-blade-usage](portalfx-controls-monitor-chart.md#legacy-blade-usage).

If there is an Insights/Monitoring Metrics part on your blade already, you can reference the part from Hubs extension instead of referencing the metrics part from Insights/Monitoring extension. Because the Hubs extension is always loaded when you load the portal, it will be loaded before the user loads your extension blade. Hence, you will not load an additional extension and get significant performance benefits. However, for the best performance, we strongly recommend that your extension should use the Monitor Chart control directly on a template blade. For more information about migrating to template blades, see [portalfx-no-pdl-programming.md](portalfx-no-pdl-programming.md).

* * * 

<a name="frequently-asked-questions-faqs-for-extension-controls-changing-the-metrics-time-range-chart-type"></a>
### Changing the metrics/time range/chart type

***Can the users change the metrics/time range/chart type of the charts shown in the overview blade?***

SOLUTION: No, users cannot customize what is displayed in the overview blade. For customizations, users can click on the chart, navigate to Azure Monitor, make changes the chart if needed, and then pin it to the dashboard. The dashboard contains all the charts that users want to customize and view.

This means the extension has a consistent story.

1. View the metrics in overview blade

1. Explore the metrics in Azure Monitor

1. Track and monitor metrics in the Azure Dashboard

Removing customizations from blades also provides more reliable blade performance.
    
* * * 

<a name="frequently-asked-questions-faqs-for-extension-controls-controls-playground-questions"></a>
### Controls playground questions

DESCRIPTION:  If I run into any problems using the controls playground or the new control `ViewModels`, who do I ask? 

SOLUTION: For control `ViewModel` issues, please post on StackOverflow.  For specific playground extension issues or general playground extension feedback, please reach out to <a href="ibizacontrols@microsoft.com?subject=StackOverflow: Playground Controls and ViewModels">ibizacontrols@microsoft.com</a>.

* * *

<a name="frequently-asked-questions-faqs-for-extension-controls-adding-code-to-the-controls-playground"></a>
### Adding code to the controls playground

DESCRIPTION:  Why can’t I type code directly into the controls playground editor?

SOLUTION: The controls playground does not execute code provided by the user due to security concerns.  We are looking into how we can mitigate that, but for now, the code snippet is for your reference only.

* * *

<a name="frequently-asked-questions-faqs-for-extension-controls-missing-playground-controls"></a>
### Missing playground controls

DESCRIPTION: Why aren’t all of the new controls in the playground?

SOLUTION:  The code for the playground extension is generated from `Fx.d.ts`.  Some of the controls require additional configuration.

* * *

<a name="frequently-asked-questions-faqs-for-extension-controls-playground-controls-are-not-localized"></a>
### Playground controls are not localized

DESCRIPTION: Why is it that the controls playground does not provide localization?

SOLUTION: Localization is done at build times, so none of the string inputs are localized.  Instead, the strings are sent  in non-localized forms so that copy/pasted code compiles and runs without requiring additional work.

* * *


<a name="frequently-asked-questions-styling-and-theming"></a>
## Styling and theming


<a name="frequently-asked-questions-styling-and-theming-icon-incorrectly-displayed"></a>
### Icon incorrectly displayed

***The extension icon is displayed as a dark square. What happened?***

DESCRIPTION:

The extension probably circumvents the build-time icon pre-processing that  prepares the icon to pass the  html sanitizer. This may cause it to display incorrectly. The pre-processor also minifies the icon, and it to display properly using different theme colors.

**NOTE**: The icon may still display incorrectly if it is served by using **json**.

SOLUTION: 

Include the icon in your project normally. Build and  look at the generated file.  Find and copy the  fresh sanitized svg markup, and replace it.

For more information, see [top-extensions-style-guide.md#preserve-icon-colors-over-theme-changes](top-extensions-style-guide.md#preserve-icon-colors-over-theme-changes).

* * *
 
<a name="frequently-asked-questions-styling-and-theming-"></a>
### 



<a name="frequently-asked-questions-forms"></a>
## Forms

<a name="frequently-asked-questions-frequently-asked-questions"></a>
## Frequently asked questions

<a name="frequently-asked-questions-frequently-asked-questions-should-i-use-an-action-bar-or-a-commands-toolbar-on-my-form"></a>
### Should I use an action bar or a commands toolbar on my form?

It depends on the scenario that drives the UX. If the form will capture some data from the user and expect the blade to be closed after submitting the changes, then use an action bar, as specified in [portalfx-ux-create-forms.md#action-bar-+-blue-buttons](portalfx-ux-create-forms.md#action-bar-+-blue-buttons).  However, if the form will edit or update some data, and expect the user to make multiple changes before the blade is closed, then use commands, as specified in [portalfx-commands.md](portalfx-commands.md). 

* Action Bar

  The action bar will have one button whose label is something like "OK", "Create", or "Submit". The blade should automatically close immediately after the action bar button is clicked. Users can abandon the form by clicking the Close button that is located at the top right of the application bar. Developers can use a `ParameterProvider` to simplify the code, because it provisions the `editScope` and implicitly closes the blade based on clicking on the action bar. 

  Alternatively, the action bar can contain two buttons, like "OK" and "Cancel", but that requires further configuration. The two-button method is not recommended because the "Cancel" button is made redundant by the Close button.

* Commands
  
  Typically, the two commands at the top of the blade are the "Save" command and the "Discard" command. The user can make edits and click "Save" to commit the changes. The blade should show the appropriate UX for saving the data, and will stay on the screen after the data has been saved. The user can make further changes and click "Save" again. The user can also discard their changes by clicking "Discard". Once the user is satisfied with the changes, they can close the blade manually.
  
* * * 

<a name="frequently-asked-questions-common-scenarios-and-integration-points"></a>
## Common scenarios and integration points

<a name="frequently-asked-questions-faqs-for-authentication"></a>
## FAQs for Authentication

   <!-- TODO:  FAQ Format is ###Link, ***title***, Description, Solution, 3 Asterisks -->

<a name="frequently-asked-questions-faqs-for-authentication-get-subscription-list"></a>
### Get subscription list

***How do I get the list of subscriptions? Or just those selected by a user?***

SOLUTION: Call the `MsPortalFx.Azure.getAllSubscriptions()` or `MsPortalFx.Azure.getSelectedSubscriptions()` APIs. For more information, see   [portalfx-subscriptions.md](portalfx-subscriptions.md).

* * *

<a name="frequently-asked-questions-faqs-for-authentication-session-expiration"></a>
### Session expiration

***When do authenticated sessions expire?***

SOLUTION: The Portal does not automatically log users out after a period of inactivity; it only logs a user out when the user's AAD-issued authentication token expires. Otherwise, all subsequent operations would fail.

This typically happens after a few hours of usage, maybe eight to 24 hours based on the type of account. It may also happen if the token was not refreshed or renewed for a period of time, which is typically one hour.

**NOTE**: If the browser is in a situation where it cannot connect to the network for more than an hour, typically, the user is logged out.

* * *

<!--
<a name="frequently-asked-questions-other-ui-concepts"></a>
## Other UI concepts
<a name="frequently-asked-questions-loading-and-managing-data"></a>
## Loading and managing data
<a name="frequently-asked-questions-advanced-development-topics"></a>
## Advanced development topics
-->

<a name="frequently-asked-questions-debugging"></a>
## Debugging

<a name="frequently-asked-questions-faqs-for-debugging-extensions"></a>
## FAQs for Debugging Extensions

<a name="frequently-asked-questions-faqs-for-debugging-extensions-ssl-certificates"></a>
### SSL certificates

   <!-- TODO:  FAQ Format is ###Link, ***title***, Description, Solution, 3 Asterisks -->
   
***How do I use SSL certs?***
 
SSL Certs are relevant only for teams that host their own extensions.  Azure Portal ONLY supports loading extensions from HTTPS URLs. Use a wildcard SSL cert for each environment to simplify maintenance, for example,   ``` *.<extensionName>.onecloud-ext.azure-test.net  ``` or  ``` *.<extensionName>.ext.azure.com) ``` .    To simplify overall management when your team is building separate, independent extensions, you can also use  ``` <extensionName>.<team>.ext.azure.com ``` and create a wildcard SSL cert for  ``` *.<team>.ext.azure.com ```. Internal teams can create SSL certs for the DogFood environment using the SSL Administration Web page that is located at [http://ssladmin](http://ssladmin). 
 
 Production certs must follow your organization’s PROD cert process. 

 **NOTE**: Do not use the SSL Admin site for production certs.

* * *

<a name="frequently-asked-questions-faqs-for-debugging-extensions-loading-different-versions-of-an-extension"></a>
### Loading different versions of an extension

***How do I load different versions of an extension?***

Understanding which extension configuration to modify is located at [portalfx-extensions-configuration-overview.md#(#configuration-file-locations-and-structure](portalfx-extensions-configuration-overview.md#(#configuration-file-locations-and-structure).

* * * 

<a name="frequently-asked-questions-faqs-for-debugging-extensions-checking-the-version-of-a-loaded-extension"></a>
### Checking the version of a loaded extension

***I have set ApplicationContext.Version for my extension, how do I check what version of my extension is currently loaded in shell ?***

1.  Navigate to the Portal where your extension is hosted or side loaded.
1. Press F12 in the browser and select the console tab.
1. Set the current frame dropdown to that of your extension.  If it's not obvious, for example, if the extension is running in a web worker, select one of the values in the dropdown and run MsPortalFx.getEnvironmentValue("`<extensionName>`") to determine the context.
1. In the console type `fx.environment.version` and click enter to see the version of the extension on the client, as in the following image.

    ![alt-text](../media/top-extensions-debugging/select-extension-iframe.png "Select extension iframe")

1. In addition, any requests that are made to the extension, including **Ajax** calls, should also return the version on the server in the response, as in the following image.

    ![alt-text](../media/top-extensions-debugging/response-headers-show-version.png "Response Headers from extension show version")

  **NOTE**: There  can be a difference in the `fx.environment.version` on the client and the version in the `x-ms-version` returned from the server.  This can occur when the user starts a session and the extension is updated/deployed while the session is still active.

* * *

<a name="frequently-asked-questions-faqs-for-debugging-extensions-onboarding-faq"></a>
### Onboarding FAQ

***Where are the onboarding FAQs for Sparta (ARM/CSM-RP)?***

The SharePoint Sparta Onboarding FAQ is located at [http://sharepoint/sites/AzureUX/Sparta/SpartaWiki/Sparta%20Onboarding%20FAQ.aspx](http://sharepoint/sites/AzureUX/Sparta/SpartaWiki/Sparta%20Onboarding%20FAQ.aspx).

* * *

 ### Compile on Save

**What is Compile on Save ?**

Compile on Save is an option in VS **TypeScript** Project Properties that allows the developer to compile  `.ts` files when they are saved to disk. To use it, make sure that **TypeScript** 2.3.3 was installed on your machine. The version can be verified by executing the following  command.

```bash
$>tsc -version
```
Then, verify that when a **TypeScript** file is saved, that the following text is displayed in the bottom left corner of the **Visual Studio** application.

![alt-text](../media/portalfx-ide-setup/ide-setup.png "CompileOnSaveVisualStudio")

 * * *
 
<a name="frequently-asked-questions-faqs-for-debugging-extensions-other-debugging-questions"></a>
### Other debugging questions

***How can I ask questions about debugging ?***

You can ask questions on Stackoverflow with the tag [ibiza](https://stackoverflow.microsoft.com/questions/tagged/ibiza).



<a name="frequently-asked-questions-performance"></a>
## Performance

<a name="frequently-asked-questions-frequently-asked-questions"></a>
## Frequently asked questions

* [Telemetry](#telemetry)

* [Alerting](#alerting)

* [Performance](#performance)

* [Reliability](#reliability)

* [Create](#create)

* * *

<a name="frequently-asked-questions-telemetry"></a>
## Telemetry

<a name="frequently-asked-questions-alerting"></a>
## Alerting

<a name="frequently-asked-questions-performance"></a>
## Performance

<a name="frequently-asked-questions-performance-extension-scores-are-above-the-bar"></a>
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
        * If there is only one part, or if the part is not a `<TemplateBlade>`, then migrate the part to use the  no-pdl template as specified in  [top-blades-templateblade.md](top-blades-templateblade.md).
        * If there are more than three parts, consider refactoring or removing some of them so that fewer parts need to be displayed.
    * Optimize the Blades's `constructor` and `OnInputsSet` methods.
    * Remove obsolete bundles, as specified in  [https://aka.ms/portalfx/obsoletebundles](https://aka.ms/portalfx/obsoletebundles).
    * Use  the Portal's ARM token, if possible. Verify whether the extension can use the Portal's ARM token and if so, follow the instructions in the document  located at    to install it.
    * Change the extension to use the hosting service, as specified in [top-extensions-hosting-service.md](top-extensions-hosting-service.md).
       * Wrap any **AJAX** calls with custom telemetry to ensure that they are not waiting on the result of the call.   Also, ensure that **AJAX** is called using the batch api.
    * Reduce the revealed times for parts on the blade.
    * Check for waterfalling or serialized bundle requests, as described in [portalfx-extensions-bp-performance.md#coding-best-practices](portalfx-extensions-bp-performance.md#coding-best-practices).  If any waterfalls exist within the extension, ensure you have the proper bundling hinting in place, as specified in [top-extensions-debugging.md#toggling-optimizations](top-extensions-debugging.md#toggling-optimizations).

* * *

<a name="frequently-asked-questions-performance-my-wxp-score-is-below-the-bar"></a>
### My WxP score is below the bar

***How do I identify which pieces of the extension are not performant?***

DESCRIPTION: 

The PowerBi dashboard that is located at [http://aka.ms/portalfx/dashboard/extensionperf](http://aka.ms/portalfx/dashboard/extensionperf) displays the WxP impact for each individual blade. It may not display information at the level of granularity that immediately points to the problem.

SOLUTION:

If the extension is drastically under the bar, it is  likely that a high-usage blade is not meeting the performance bar.  If the extension is nearly meeting the  bar, then it is likely that a low-usage blade is the one that is not meeting the bar.

* * * 

<a name="frequently-asked-questions-performance-azure-performance-office-hours"></a>
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

<a name="frequently-asked-questions-reliability"></a>
## Reliability

<a name="frequently-asked-questions-reliability-extension-scores-are-below-the-reliability-bar"></a>
### Extension scores are below the reliability bar

***What do I do to improve the reliability scores for my extension?***


DESCRIPTION:

 When I visited the Extension performance/reliability report that is located at [http://aka.ms/portalfx/dashboard/extensionperf](http://aka.ms/portalfx/dashboard/extensionperf), the scores for my extension were below acceptable levels.

SOLUTION: 

Run the following query.


The query will return a summary of all the events which your extension failed to load. Then, address the highest impacting issues, per occurence or number of affected users.



The query returns a list of errorStates and errors.  For greater details you can use the `any_sessionId` to investigate further.

The errorStates and errors are described in [portalfx-extensions-status-codes.md](portalfx-extensions-status-codes.md).

<a name="frequently-asked-questions-create"></a>
## Create


<a name="frequently-asked-questions-testing"></a>
## Testing

<a name="frequently-asked-questions-frequently-asked-questions"></a>
## Frequently asked questions

<!-- TODO:  FAQ Format is ###Link, ***title***, Description, Solution, 3 Asterisks -->

<a name="frequently-asked-questions-frequently-asked-questions-cannot-create-new-vs-project"></a>
### Cannot create new VS project

***Cannot find the Node Tools for VS***

Description: When I try to create a new project in Visual Studio, I get an error: `Could not install package 'PortalFx.NodeJS8 10.0.0.125`.  The command line that was used was `File > New > Project > Visual C# > Azure Portal`.

 You are trying to install this package into a project that targets `.NETFramework,Version=v4.6.1`, but the package does not contain assembly references or content files that are compatible with that framework.

Solution: Install the `Node Tools for Visual Studio` that is located at [https://github.com/Microsoft/nodejstools/releases/tag/v1.3.1](https://github.com/Microsoft/nodejstools/releases/tag/v1.3.1).

<!-- TODO:  FAQ Format is ###Link, ***title***, Description, Solution, 3 Asterisks -->

<a name="frequently-asked-questions-frequently-asked-questions-overriding-default-stubs"></a>
### Overriding default stubs

***How do I override the default stubs the unit test harness provides out of the box?***

Description:

Solution: Use the `Harness.init` function and supply an options object of type `InitializationOptions` with your own stub(s) that will override the default stub that is provided by the unit test framework.

The following is an example.

```cs
import * as harness from "msportalfx-ut/Harness";

...

const options : harness.InitializationOptions = { 
    getUserInfo: sinon.stub().returns(Q({
            email: "ibizaems@microsoft.com",
            isOrgId: false,
            givenName: "givenName",
            surname: "surName",
            directoryId: "00000000-0000-0000-0000-000000000000",
            directoryName: "directoryName",
            uniqueDirectoryName: "uniqueDirectoryName",
            domainName: "domainName"
        })),
        ...
};

harness.init(options);

...
```



***

<a name="frequently-asked-questions-frequently-asked-questions-mocha-test-harness"></a>
### Mocha test harness

***Simple html test harness for running mocha tests***

Description: Even though it is not that useful for gated CI, some teams prefer to have a simple `index.html` for debugging their tests in the browser rather than using the **karma** Debug view.

Solution: If you would like this alternative approach use the following.

<html>

<head>
  <meta charset="utf-8">
  <title>Mocha Tests</title>
  <link href="./node_modules/mocha/mocha.css" rel="stylesheet" />
</head>

<body>
  <div id="mocha"></div>

  <!-- mocha prereq -->
  <script type="text/javascript" charset="utf-8" src="./node_modules/mocha/mocha.js"></script>
  <script type="text/javascript" charset="utf-8" src="./node_modules/chai/chai.js"></script>
  <script src="./node_modules/msportalfx-ut/lib/FxScripts.js"></script>
  <script src="./_generated/Ext/ExtensionStringResourcesRequireConfig.js"></script>
  <script src="./test-main.js"></script>
</body>
</html>

***

<a name="frequently-asked-questions-frequently-asked-questions-using-microsoft-portal-tools-targets"></a>
### Using Microsoft.Portal.Tools.targets

***I am still using Microsoft.Portal.Tools.targets rather than Microsoft.Portal.Tools.V2.targets***

Description: How do I upgrade from `Microsoft.Portal.Tools.targets` to `Microsoft.Portal.Tools.V2.targets`?

Solution: Ideally you should move to ***V2.targets*** to benefit from the dev productivity it will bring to your dev/test inner loop. Migration only takes about an hour. See  [https://aka.ms/portalfx/cloudbuild](https://aka.ms/portalfx/cloudbuild) for details. If you can't migrate to v2, update the following:

1. Update your `../Extension/Extension.csproj` file.

    ```
    xml
    <PropertyGroup>
        <TypeScriptGeneratesDeclarations>true</TypeScriptGeneratesDeclarations>
    </PropertyGroup>
    ```

1. The `./package.json` file.
Update the script named `prereq` to be the following:

    ```
    "prereq": "npm run init && gulp --gulpfile=./node_modules/msportalfx-ut/gulpfile.js --cwd ./"
    ```

1. The `./msportalfx-ut.config.js` file

    ```
        "ExtensionTypingsFiles": "../Extension/**/*.d.ts",
        "ResourcesResxRootDirectory": "../Extension/Client"
    ```

1. The `./tsconfig.json` file.

    ```
    {
        "compileOnSave": true,
        "compilerOptions": {

    ...
            "paths": {
                "msportalfx-ut/*": [
                    "./node_modules/msportalfx-ut/lib/*"
                ],
                "*": [
                    "./_generated/Ext/typings/Client/*",
                    "./node_modules/@types/*/index"
                ]
            }
    ...

        },
    ...
        "include": [
            "./_generated/Ext/typings/Definitions/*",
            "test/**/*"
        ]
    }
    ```

1. The `./karma.conf.js` file.

    ```
    ... 

    files: [
        ...,

        { pattern: "Extension/Output/Content/Scripts**/*.js", included: false },
        
        ...
    ],

    ...

    preprocessors: {
        "./Extension/Client/**/*.js": "coverage"
    }
    ```

1. The `./test-main.js` file
    ```
    rjs = require.config({
    ...,
        "_generated": "../Extension/Client/_generated",
        "Resource": "../Extension/Client/Resource",
        "Shared": "../Extension/Client/Shared"
    ...
    ```
***

<a name="frequently-asked-questions-frequently-asked-questions-cannot-use-internal-registry"></a>
### Cannot use internal registry

***I can't use the internal npm registry***

Description: When I try to use the internal npm registry https://msazure.pkgs.visualstudio.com/_packaging/AzurePortalNpmRegistry/npm/registry/  the screen stays blank. It does not display a sad cloud or some other "not found" message.

Solution:

***

<a name="frequently-asked-questions-frequently-asked-questions-extension-will-not-authenticate"></a>
### Extension will not authenticate

***I can't authenticate***

Description:  When I     , the extension receives the following error message.

Solution: Try the following:

If you receive auth errors against the internal NPM feed see the "Connect to feed" instructions that are located at [https://msazure.visualstudio.com/One/Azure%20Portal/_packaging?feed=AzurePortalNpmRegistry&_a=feed](https://msazure.visualstudio.com/One/Azure%20Portal/_packaging?feed=AzurePortalNpmRegistry&_a=feed). 

If you are not a member of any of the Groups on https://msazure.visualstudio.com/One/Azure%20Portal/_packaging?feed=AzurePortalNpmRegistry&_a=settings&view=permissions reach out to nickha.
<a href="mailto:nickha@microsoft.com?subject=Azure Portal Permissions&body=Hello, I am not a member of any of the groups that are listed in the AzurePortalNpmRegistry.">nickha@microsoft.com</a>.

***

<a name="frequently-asked-questions-frequently-asked-questions-build-nodes-are-disconnected"></a>
### Build nodes are disconnected

***My build nodes are completely disconnected from the internet***

Description:
<!-- TODO: Where did they go and how can you tell they are disconnected?  -->

Solution: You can commit your version of `msportalfx-ut.zip` into your repo and install it directly using the following relative file path syntax in the `package.json` file.
<!-- TODO: Determine whether this is the right file for the line. -->

`"msportalfx-ut": "file:../externals/msportalfx-ut-5.0.302.someversion.tgz",`.

***

<a name="frequently-asked-questions-frequently-asked-questions-corext-environments"></a>
### Corext Environments

Build environments which are constructed using Corext will need to manually specify where to locate the Unit Test Framework **NuGet** package. This **NuGet** package will be expanded at `CxCache`, which is not the default location.  Consequently, you need to update the `CoreXT` config and then run  `npm packages.json` in order to point to the correct location.

If you are executing the default instructions on your CoreXT environment, it may display the following error.

`npm ERR! enoent ENOENT: no such file or directory, stat 'C:\...\ExtensionName\packages\Microsoft.Portal.TestFramework.UnitTest.5.0.302.979\msportalfx-ut-5.302.979.tgz'`

This error indicates that the dev environment cannot find the expanded NuGet package for the Unit Test Framework. To make the dev environment aware of the package, perform the following steps.

1. Update the repository's `corext.config` file that is located in the `\<ExtensionRepoName>\.corext` folder by adding the following to the end of the `<generator>` section.

    ```xml
    <!-- Unit Test Framework -->
    <package id="Microsoft.Portal.TestFramework.UnitTest" />
    ```

1. Update the `packages.config` file that is located in the `\<ExtensionRepoName>\src\<ExtensionName>\` folder by adding the following to the `<packages>` section.

    ```xml
    <package id="Microsoft.Portal.TestFramework.UnitTest" version="<version>" targetFramework="net45" />
    ```

    where
    
    **version**:  Matches the version of the Portal SDK you are using for your extension and also matches the version of the `"Microsoft.Portal.Framework"` package in your `packages.config.*` file. An example value of the version parameter is "5.0.302.1016". The version number also matches the `"Microsoft.Portal.Framework"` package in the `packages.config.*` file.

1. Update the Unit Test `package.json` file that is located in the `<ExtensionRepoName>\src\<ExtensionName>.UnitTests\` folder by removing the `msportalfx-ut` package from the dependencies if it is listed.
    
    Update the script's `init` command to the following:

    `"init": "npm install --no-optional && npm install %PkgMicrosoft_Portal_TestFramework_UnitTest%\\msportalfx-ut-5.302.1016.tgz --no-save",`

    **NOTE:** The version listed above matches the version of the Portal SDK you are using for your extension and also matches the `"Microsoft.Portal.Framework"` package in the  `packages.config` file.

1. Run the following commands to finish the setup.

    * Run Corext Init - From the root of your repository run: `init`
    * Run the Npm install - From your Unit Test directory run: `npm run init`


<!--
<a name="frequently-asked-questions-telemetry-and-alerting"></a>
## Telemetry and alerting
<a name="frequently-asked-questions-experimentation-and-flighting"></a>
## Experimentation and flighting
<a name="frequently-asked-questions-localization-globalization"></a>
## Localization / Globalization
-->

<a name="frequently-asked-questions-accessibility"></a>
## Accessibility

<a name="frequently-asked-questions-frequently-asked-questions"></a>
## Frequently asked questions

<a name="frequently-asked-questions-frequently-asked-questions-"></a>
### 

* * * 

<!--
<a name="frequently-asked-questions-deploying-your-extension"></a>
## Deploying your extension
-->

<a name="frequently-asked-questions-deployment-using-the-ibiza-hosting-service"></a>
## Deployment using the Ibiza hosting service



<a name="frequently-asked-questions-frequently-asked-questions"></a>
## Frequently asked questions

<!-- TODO:  FAQ Format is ###Link, ***title***, Description, Solution, 3 Asterisks -->


<a name="frequently-asked-questions-frequently-asked-questions-content-unbundler-throws-aggregate-exception"></a>
### Content Unbundler throws aggregate exception

***Content Unbundler throws an Aggregate Exception during build.***

This usually happens when the build output generated by content unbundler is different from expected format.  The solution is as follows.

1. Verify build output directory is called **bin**
1. Verify you can point IIS to **bin** directory and load extension

For more information, see [top-extensions-hosting-service-basic.md#prerequisites-for-onboarding-hosting-service](top-extensions-hosting-service-basic.md#prerequisites-for-onboarding-hosting-service).

* * *

<a name="frequently-asked-questions-frequently-asked-questions-finding-old-ux-after-deployment"></a>
### Finding old UX After Deployment

***Some customers of my extension are finding the old UX even after deploying the latest package. Is there a bug in hosting service ?***

No this is not a bug. All clients will not get the new version as soon as it gets deployed. The new version is only served when the customer refreshes the Portal. We have seen customers that keep the Portal open for long periods of time. In such scenarios, when customer loads the extension they are going to get the old version that has been cached.
We have seen scenarios where customers did not refresh the Portal for 2 weeks. 

* * * 

<a name="frequently-asked-questions-frequently-asked-questions-friendly-name-support"></a>
### Friendly name support

***When will support for friendly names become available ?***

Azure support for friendly names became available in SDK release 5.0.302.834.

* * *

<a name="frequently-asked-questions-frequently-asked-questions-how-extensions-are-served"></a>
### How extensions are served

***How does hosting service serve my extension?***

The runtime component of the hosting service is hosted inside an Azure Cloud Service. When an extension onboards, a publicly accessible endpoint is provided by the extension developer which will contain the contents that the hosting service should serve. For the hosting service to pick them up, it will look for a file called `config.json` that has a specific schema described below. 

The hosting service will download the config file, and look into it to figure out which zip files it needs to download. There can be multiple versions of the extension referenced in the `config.json` file. The hosting service will download them and unpack them on the local disk. After it has successfully downloaded and expanded all versions of the extension referenced in `config.json`, it will write `config.json` to disk.

For performance reasons, once a version is downloaded, it will not be downloaded again. 

* * * 

<a name="frequently-asked-questions-frequently-asked-questions-output-zip-file-incorrectly-named"></a>
### Output zip file incorrectly named

***When I build my project, the output zip is called HostingSvc.zip instead of \<some version>.zip.***

The primary cause of this issue is that your `web.config` appSetting for **IsDevelopmentMode** is `true`.  It needs to be set to `false`.  Most do this using a `web.Release.config` transform. For example,

```xml
    <?xml version="1.0" encoding="utf-8"?>

    <!-- For more information on using web.config transformation visit http://go.microsoft.com/fwlink/?LinkId=125889 -->

    <configuration xmlns:xdt="http://schemas.microsoft.com/XML-Document-Transform">
      <appSettings>
        <!-- dont forget to ensure the Key is correct for your specific extension -->
        <add key="Microsoft.Portal.Extensions.Monitoring.ApplicationConfiguration.IsDevelopmentMode" value="false" xdt:Transform="SetAttributes" xdt:Locator="Match(key)"/>
      </appSettings>
    </configuration>

```

* * * 

<a name="frequently-asked-questions-frequently-asked-questions-rollout-time-for-stages"></a>
### Rollout time for stages

***How much time does hosting service take to rollout a new version of extension to the relevant stage?*** 

The hosting service takes about 5 minutes to publish the latest version to all data centers.

* * *


<a name="frequently-asked-questions-frequently-asked-questions-sas-tokens"></a>
### SAS Tokens

***Can I provide a SAS token instead of keyvault for EV2 to access the storage account ?***

The current rolloutspec generated by **ContentUnbundler** only provides support for using keyvault. If you would like to use SAS tokens, please submit a request on [UserVoice](https://aka.ms/portalfx/uservoice)

* * *

<a name="frequently-asked-questions-frequently-asked-questions-speed-up-test-cycles"></a>
### Speed up test cycles

***My local build is slow. How can I speed up the dev/test cycles ?***

The default F5 experience for extension development remains unchanged however with the addition of the **ContentUnbundler** target some teams prefer to optimize to only run it on official builds or when they set a flag to force it to run.  The following example demonstrates how the Azure Scheduler extension is doing this within **CoreXT**.

```xml
    <PropertyGroup>
        <ForceUnbundler>false</ForceUnbundler>
    </PropertyGroup>
    <Import Project="$(PkgMicrosoft_Portal_Tools_ContentUnbundler)\build\Microsoft.Portal.Tools.ContentUnbundler.targets" 
            Condition="'$(IsOfficialBuild)' == 'true' Or '$(ForceUnbundler)' == 'true'" />
```

* * * 

<a name="frequently-asked-questions-frequently-asked-questions-storage-account-registration"></a>
### Storage account registration

***Do I need to register a new storage account everytime I need to upload zip file ?***

No. Registering a storage account with the hosting service is one-time process, as specified in . This allows the hosting service to find the latest version of your extension.

* * * 

<a name="frequently-asked-questions-frequently-asked-questions-zip-file-replaced-in-storage-account"></a>
### Zip file replaced in storage account

***What happens if instead of publishing new version to my storage account I replace the zip file ?***

Hosting service will only serve the new versions of zip file. If you replace version `1.0.0.0.zip` with a new version of `1.0.0.0.zip`, then hosting service will not detect.
It is required that you publish new zip file with a different version number, for example `2.0.0.0.zip`, and update `config.json` to reflect that hosting service should service new version of extension.

Sample config.json for version 2.0.0.0

```json
    {
        "$version": "3",
        "stage1": "2.0.0.0",
        "stage2": "2.0.0.0",
        "stage3": "2.0.0.0",
        "stage4": "2.0.0.0",
        "stage5": "2.0.0.0",
    }
```
**NOTE**: This samples depicts that all stages are serving version 2.0.0.0.

* * * 

<a name="frequently-asked-questions-frequently-asked-questions-other-hosting-service-questions"></a>
### Other hosting service questions

***How can I ask questions about hosting service ?***

You can ask questions on Stackoverflow with the tag [ibiza-deployment](https://stackoverflow.microsoft.com/questions/tagged/ibiza-deployment).

* * * 

<a name="frequently-asked-questions-frequently-asked-questions-cdn-paths-and-versioning"></a>
### CDN Paths and Versioning

***Cannot find paths with versioning***

DESCRIPTION:  

I am not seeing paths with versioning during debug.

SOLUTION:

Ensure `IsDevelopmentMode` in the `*.config` file  is set to `false`.

* * *

<!--
<a name="frequently-asked-questions-custom-extension-deployment-infrastructure"></a>
## Custom extension deployment infrastructure
-->

<a name="frequently-asked-questions-legacy-features"></a>
## Legacy features

<a name="frequently-asked-questions-frequently-asked-questions"></a>
## Frequently asked questions

<a name="frequently-asked-questions-frequently-asked-questions-"></a>
### 

* * * 

<a name="frequently-asked-questions-frequently-asked-questions"></a>
## Frequently asked questions

<a name="frequently-asked-questions-frequently-asked-questions-discard-change-pop-up-always-displayed"></a>
### Discard change pop-up always displayed

***Q: My users see the 'discard change?' pop-up, even when they've made no changes on my Form Blade. What's wrong?*** 

The EditScope `root` property returns an object or array that includes uses of Knockout observables (`KnockoutObservable<T>` and `KnockoutObservableArray<T>`). Any observable located within the EditScope is designed to be modified/updated only by the user, via Form fields that are bound to EditScope observables. Importantly, these EditScope observables were not designed to be modified directly from extension TypeScript code. If extension code modifies an observable during the Form/Blade initialization process, the EditScope will record this as a user edit, and this accidental edit will trigger the `discard changes` pop-up when the user tries to close the associated Blade.

SOLUTION:
Rather than initializing the EditScope by programmatically modifying/updating EditScope observables, use these alternative techniques:
* If the extension uses a `ParameterProvider` component to manage its EditScope, initialize the EditScope data in the `mapIncomingData[Async]` callback supplied to ParameterProvider.
* If the extension uses an EditScopeCache component to manage its EditScope, initialize the EditScope data in the `supplyNewData` and `supplyExistingData` callbacks supplied to EditScopeCache.
* If neither of the above techniques suits the scenario, the `editScope.resetValue()` method can be used to set a new/initial value for an EditScope observable in a way that *is not recorded as a user edit* (although this only works for observables storing primitive-typed values).  
  
* * *

<a name="frequently-asked-questions-frequently-asked-questions-editscope-location"></a>
### EditScope Location

***Q: I need to integrate my Form with an EditScope. Where do I get the EditScope?*** 

**NOTE**:  EditScopes are becoming obsolete.  It is recommended that extensions and forms be developed without edit scopes, as specified in [top-extensions-controls.md](top-extensions-controls.md).

SOLUTION: Integrate forms with `EditScopes` varies according to the UX design. Developers can choose between using a `ParameterProvider` component or `EditScopeCache` component as follows:

* Use `ParameterProvider` for the following scenario:
    * **Pop-up/dialog-like form** - The blade uses an ActionBar with an 'Ok'-like button that commits user edits. Typically, when the user commits the edits, the blade is implicitly closed, like a conventional UI pop-up/dialog. The blade uses `parameterProvider.editScope` to access the loaded/initialized EditScope.

* Use `EditScopeCache` for the following scenarios:
    * **Save/Revert blade** - There are 'Save' and 'Revert changes' commands in the CommandBar of the blade. Typically, these commands keep the blade open so the user can perform successive edit and save cycles without closing and reopening the form. 

    * **Document editing** - In the document-editing scenario, the user can make edits to a single EditScope/Form model across multiple parent-child blades. The parent blade sends its `inputs.editScopeId` input to any child blade that edits the same model as the parent Blade. The child blade uses this `inputs.editScopeId` in its call to `editScopeView.fetchForExistingData(editScopeId)` to fetch the EditScope of the parent Blade. 

* * *
  
<a name="frequently-asked-questions-frequently-asked-questions-what-is-an-editscopeaccessor"></a>
### What is an EditScopeAccessor?

***Q: Form fields have two constructor overloads, which should I use? What is an EditScopeAccessor?*** 

SOLUTION: For more information about EditScopeAccessors, see [top-legacy-editscopes.md#the-editscopeaccessor](top-legacy-editscopes.md#the-editscopeaccessor).

* * * 

<a name="frequently-asked-questions-frequently-asked-questions-type-metadata"></a>
### Type metadata
<!-- TODO:  Move this back to the TypeScript  document -->
***Q: When do I need to worry about type metadata for my EditScope?***

SOLUTION: For many of the most common Form scenarios, there is no need to describe the EditScope/Form model in terms of type metadata. Typically, supplying type metadata is the way to turn on advanced FX behavior, in the same way that .NET developers apply custom attributes to .NET types to tailor .NET FX behavior for each customized types. 

For more information about type metadata, see [portalfx-data-typemetadata.md](portalfx-data-typemetadata.md).

 For EditScope and Forms, extensions supply type metadata for the following scenarios.

 * Editable grid
 
    Specified in [top-legacy-editscopes.md#editScope-entity-arrays](top-legacy-editscopes.md#editScope-entity-arrays).

 * Opting out of edit tracking 

    Specified in [top-legacy-editscopes.md#the-trackedits-property](top-legacy-editscopes.md#the-trackedits-property).


* * *

<a name="frequently-asked-questions-frequently-asked-questions-keeping-editscope-from-tracking-changes"></a>
### Keeping EditScope from tracking changes

***Q: Some of my Form data is not editable. How do I keep EditScope from tracking changes for this data?***

SOLUTION: For more information about configuring an EditScope by using type metadata, see [top-legacy-editscopes.md#the-trackedits-property](top-legacy-editscopes.md#the-trackedits-property).
  
* * *

<a name="frequently-asked-questions-frequently-asked-questions-key-value-pairs"></a>
### Key-value pairs

***Q: My Form data is just key/value pairs. How do I model a Dictionary/StringMap in EditScope? Why can't I just use a JavaScript object like a property bag?***

DESCRIPTION:  The  Azure Portal FX instantiates an object/array and returns it to the extension to render the UI. Like all data models and `ViewMmodels`, any subsequent mutation of that object/array should be performed by changing/mutating **Knockout** observables. Portal controls and **Knockout** **HTML** template rendering both subscribe to these observables and re-render them only when these observables change value.

This poses a challenge to the common `JavaScript` programming technique of treating a `JavaScript` object as a property bag of key-value pairs. If an extension only adds or removes keys from a datamodel or a `ViewModel` object, the Portal will not be aware of these changes. `EditScope` will not recognize these changes as user edits and therefore such adds/removes will put `EditScope` edit-tracking in an inconsistent state.

SOLUTION:  An extension can model a Dictionary/StringMap/property bag for an `EditScope` by instantiating an  observable array of key/value-pairs, like `KnockoutObservableArray<{ key: string; value: TValue; }>`. 

The users can edit the contents of the  Dictionary/StringMap/property bag by using an editable grid. The editable grid can only be bound to an `EditScope` 'entity' array. This allows the extension to describe the array of key/value-pairs as an 'entity' array.

For more information about how to develop type metadata to use the array with the editable grid, see [top-legacy-editscopes.md#the-getEntityArrayWithEdits-method](top-legacy-editscopes.md#the-getEntityArrayWithEdits-method).

* * *

