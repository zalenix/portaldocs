
# Azure portal extension development documentation

<details>
  <summary>1. Getting Started</summary>

Azure portal extension development is supported on the Microsoft Windows 8, Windows Server 2012 R2, and Windows 10.


### 1.1 Installation

* [Option 1 - MSI Installer](/portal-sdk/generated/downloads.md)
* [Option 2 - Nuget packages](portalfx-nuget-overview.md)

### 1.2 Getting Set up in an IDE - *Typescript version / Compile on save*

* [Visual Studio](portalfx-ide-setup.md) *(with Extension project template)*
* VS Code (Coming Soon....)
* [Need Help with setup?](https://stackoverflow.microsoft.com/questions/tagged/ibiza-sdkupdate)

### 1.3 Running and Debugging Hello World Extension

* [Architecture Overview](portalfx-howitworks.md)
* [Creating your first extension from project template](top-extensions-getting-started.md)
* [Building a Hello World Blade](top-extensions-getting-started.md#adding-a-blade)
* [Side-loading your extension in a portal environment](portalfx-testinprod.md#testing-in-production)
* [Debugging](portalfx-debugging.md#debugging)
* Add a text box to your Hello World Blade
* Dock button at the bottom of your blade
* Add Menu Bar to your Blade
* Open Blade from your Hello World Blade
* Open Context pane from your Hello World Blade


### 1.4 Extension development resources

* [Start Onboarding]
* Subscribe to announcements
* [Update your team's contact information]
* [Samples Extension](portalfx-sample-extensions.md)
* [Understand what it takes to build great extension](portalfx-onboarding-exitcriteria.md#exit-criteria-quality-metrics)
* [Need Help with onboarding?](https://stackoverflow.microsoft.com/questions/tagged/ibiza-onboarding)

### 1.4 Deploying your extension

* [Deploy your extension using hosting service](portalfx-extension-hosting-service.md)
* [Register your extension with hosting service]
* [Validating extension registeration with hosting service]
* [SLA for registering extension with hosting service]
* [Need Help with hosting service?](https://stackoverflow.microsoft.com/questions/tagged/ibiza-deployment)

### 1.5 Registering your extension

* [Understanding how registeration works](portalfx-extension-onboarding-developer-guide.md)
* [Register your extension in disabled mode in Dogfood]
* [Register your extension in disabled mode in Public cloud]
* [Register your extension in disabled mode in Mooncake]
* [Register your extension in disabled mode in Blackforest]
* [Register your extension in disabled mode in FairFax]
* [SLA for registering your extension]
* [Reducing SLA for registering your extension]
* [Need Help with hosting service?](https://stackoverflow.microsoft.com/questions/tagged/ibiza-onboarding)

### 1.6 Enabling extension for Public Preview/ GA

* [Understand the crtieria for Public Preview in public cloud](portalfx-onboarding-exitcriteria.md#exit-criteria-quality-metrics)
* [Enable your extension in Dogfood]
* [Enable your extension in Public cloud]
* [Updating extension configuraiton for national clouds](portalfx-deployment-sovereign.md)
* [Enable your extension in Mooncake]
* [Enable your extension in Blackforest]
* [Enable your extension in FairFax]
* [SLA for enabling your extension]
* [Reducing SLA for enabling your extension]
* [Need Help with enabling your extension ?](https://stackoverflow.microsoft.com/questions/tagged/ibiza-onboarding)
</details>

<details>
  <summary>2. What's new</summary>

* [No-PDL Blades](portalfx-no-pdl-programming.md#defining-blades-and-parts-using-typescript-decorators-aka-no-pdl) - *Reduces the number of files and concepts to build UI*
* [Forms without edit scope](portalfx-editscopeless-forms.md) - *More intuitive APIs for building forms*
* Editable Grid V2 - *Improved APIs designed to work with new forms*
* [Extension Avialability Alerts] (portalfx-telemetry-alerting.md#alerting) - *Get notified if your extension goes down*
* Actionable Notifications - *Point users to well known next steps*
* [EV2 support for the Extension Hosting Service](portalfx-extension-hosting-service-advanced.md#advanced-section) - *Nuff said*
* [Multi-Column for Essentials Controls](portalfx-controls-essentials.md) - *Better use of screen real estate*
* TreeView improvements - *Checkboxes, commands, and Load More / Virtualization*
</details>


<details>
  <summary>3. Upgrading from previous versions of SDK and test framework</summary>

## Upgrading Extension to use latest version of SDK
* [Upgrade policy](portalfx-deploy.md#3-understand-extension-runtime-compatibility)
* SDK Update alerts(Coming Soon....)
* [Updating the NuGet packages](portalfx-nuget-overview.md)
* Updating the C# test framework
* Updating the msportalfx-test framework
</details>

<details>
  <summary>4. Understanding your extension configuration</summary>

## Basic Configuration(Coming soon..)
* [Side-loding environment]
* [Developer mode]
* [Telemetry]
* [Any other options ??]

## Extension Configuration(Coming soon..)
* [Extension Definition]
* [ConfigurationSettings]
* [ConfigurationSettings]
* [CustomApplicationContext]
* [Controllers]
* [Gallery package]

</details>

<details>
  <summary>5.  Versioning, Packaging and Deploying for different environments</summary>

* [Versioning your extension](portalfx-extension-versioning.md)
* [Deploying an extension ](portalfx-extension-hosting-service.md#extension-hosting-service)
* [In the public cloud](portalfx-extension-onboarding-developer-guide.md)
* [Improving extension reliability/ Adding peristent caching](portalfx-extension-persistent-caching-of-scripts.md)
* Domain Configuration
    * [When to use dynamic configuration](portalfx-domain-based-configuration.md#domain-based-configuration)
    * [How to use dynamic configuration](portalfx-domain-based-configuration-pattern.md#expected-design-pattern)
    * [Configuration](portalfx-dictionaryconfiguration.md)
    * [Sample for accessing dynamic configuration](portalfx-domain-based-configuration-example.md)
</details>

<details>
  <summary>6. Extension Lifecycle</summary>

## [Extensions]
* [What is an extension?](portalfx-howitworks.md#how-extensions-work)
* [Ui Concepts](portalfx-ui-concepts.md#ui-concepts)
* [Extension lifecycle](portalfx-howitworks.md#how-the-portal-works)
* Cross-extension UX integration


## Extension lifecycle
* [Program.ts / entry point]
* [Extension.pdl]
* [Is there some thing that executes when we unload the extension??]
* [Performance implications of referencing another extension]
* [ When is extension loaded / unloaded]
</details>

<details>
  <summary>7. Developing your extension</summary>


##  Blades and Parts
* [Introduction](portalfx-ui-concepts.md#ui-concepts)

#### Common Scenarios
* [Create Blades](portalfx-create.md)
* [Context Pane]
* [Full-screen Blades]
* [Settings Blades]
* [FrameBlade/AppBlade]
* [Pinnable Blades]
* [Adding part to Part/Tile Gallery]
* [Invoking Blade/Part reuse across extensions]
* [Shairing Blade/Part across extensions]

### Blades

#### [Type of Blades](portalfx-blades.md#blades)
* [TemplateBlade]
* [FrameBlade (and legacy <AppBlade>)]
* [MenuBlade]
* [Resource Menu Blade]
* [Context Pane]


* How/when are Blades/Parts invoked?  How can I get my Blade/Part in front of more users?
* [Blades]
    * [Use 'container.openBlade(...)' to open my Blade](portalfx-blades-opening.md)
    * [Work with other teams to have other extensions call 'container.openBlade(...)' to open my Blade](portalfx-blades-opening.md#importing-the-pde-file)
    * Associate my Blade with an <AssetType> so it is opened from Browse
    * [Add my Blade as an entry in a Resource Blade or a Menu Blade]
        * [No-PDL](portalfx-no-pdl-programming.md#building-a-menu-blade-using-decorators)
        * [PDL](portalfx-blades-menublade.md)
* [Parts]
    * Make my Blades pinnable using @Blade.Pinnable.Decorator/onPin
    * Call Fx/Pinner/pinParts from some Blade
        ◊ …even encourage partner extensions to do so
    * Add 'galleryMetadata' to my Part to make it available to users in the Part Gallery
* [FAQ]
    * When should I make my Blade pinnable?

### Component model
* Lifecycle
* What is a Blade's/Part's API?  How is it invoked?
* How / when to go the IFrame route?
 
### [Blade/Part reuse across extensions]
    * [Making Blades/Parts reusable by other extensions](portalfx-extension-sharing-pde.md)
    * [Reusing Blades/Parts from other extensions](portalfx-integrating-with-other-extensions.md)
    * [RPC](portalfx-rpc.md#remote-procedure-calls-rpc)  // TODO: Find Home
            
#### Developing my Blade
* [Reference "TemplateBlade/Blade" doc re: developing content for my Blade
* [Reference "Common features / behavior for Blades and Parts"
* [Reference to sections of common Blade/Part features/behaviors
* [Title/subtitle/icon]
    * Include icon in FAQ and cross-reference here
* ['container' APIs (like 'openBlade')
    * How you to choose your Container type for legacy PDL Blades?
* [CommandBar / Toolbar](portalfx-blades.md#adding-commands-to-a-templateblade)
* [Dialogs]
    * Reference "developing content area" doc
* [StatusBar]
* [Unauthorized]
* [NoData]
* ["form" API]

### [Parts]((portalfx-parts.md#parts-aka-tiles)
* [Types of Parts])
    * [TemplatePart]
    * [FramePart]
    * [ButtonPart]
    * [Legacy PDL intrinsic Parts](portalfx-parts.md#how-to-use-one-of-the-built-in-parts-to-expose-your-data-in-pre-built-views)
#### Scenarios
    * [Building a Part Gallery Part](portalfx-parts.md#how-to-integrate-your-part-into-the-part-gallery)
    * [Retiring a Part](portalfx-parts-how-to-retire.md)
    * [Redirecting a Part](portalfx-parts.md#removing-a-part-from-a-blades-default-layout)
#### Developing my Part
    * [Reference "Common features / behavior for Blades and Parts"]
    * [Title/subtitle/icon]
    * [Activation ('onClick')]
    * ['container' APIs (like 'openBlade')]
    
### HTML template + Knockout + Controls
    * Include "why no access to DOM?"

</details>

<details>
  <summary>8. Data Layer</summary>

* [Area](portalfx-data.md#organizing-your-extension-source-code-into-areas)
* Making Ajax calls to ARM and ARM APIs
    * [Authentication](portalfx-authentication.md#calling-arm)
    * [GET calls to ARM](portalfx-data.md#making-authenticated-ajax-calls)
* [Making Ajax calls to servies other than ARM](portalfx-authentication.md#calling-other-services)
* [Data Context](portalfx-data.md#shared-data-access-using-datacontext)
* [Data Views](portalfx-data.md#using-dataviews)
* [Data Cache](portalfx-data.md#using-datacache-to-load-and-cache-data)
    * [GET calls to ARM with Data Cache](portalfx-data.md#querying-for-data)
    * [Controlling the AJAX calls for Data Cache](portalfx-data.md#loading-data)
    * [Optimizing redundant calls](portalfx-data.md#loading-data)
    * [Auto-refreshing client data](portalfx-data-refreshingdata.md#auto-refreshing-client-side-data-aka-polling)
    * [Shaping and filtering data](portalfx-data-projections.md) // TODO: Find better name
    * [Master Detail](portalfx-data.md#working-with-data)
    * [Adressing Data Merge Failures](portalfx-data.md#data-merging)
    * [Legacy accessing C# model objects](portalfx-data-typemetadata.md#type-metadata)
    * [Legacy Data Atomization](portalfx-data-atomization.md#data-atomization)
</details>

<details>
  <summary>9. Control Libraries</summary>

## [Controls](portalfx-controls.md)

* [Azue Storage Controls]
* [Button]
* [Checkbox]
* [Console](portalfx-controls-console.md)
* [Copyable Label]
* [Chart](portalfx-controls-chart.md)
* [Date Picker]
* [Date Polyfills]
* [Date Time Picker](portalfx-controls-datetimepicker.md)
* [Date Time Range Picker](portalfx-controls-datetimerangepicker.md)
* [Day Picker]
* [Diff Editor]
* [Editor](portalfx-controls-editor.md)
* [Docked Ballon]
* [Donut](portalfx-controls-donut.md)
* [Dropdown](portalfx-controls-dropdown.md)
    * [Migration](portalfx-controls-dropdown-migration.md)
    * [Loading Indicator](portalfx-editscopeless-forms.md#using-the-loading-indicator-for-dropdown)
* [Duration Picker]
* [Essentials](portalfx-controls-essentials.md)
* [File Download]
* [File Upload]
* [Gallery]
* [Gauges]
* [Graph](portalfx-controls-graph-nuget.md)
* [Infobox]
* [Legend]
* [List View]
* [Tree View]
* [Toolbar](portalfx-controls-toolbar.md)
* [Log Stream]
* [Map]
* [Markdown]
* [Menu]
* [Monitor Chart](portalfx-controls-monitor-chart.md)
* [Textbox](portalfx-controls-textbox.md)
    * [Textbox]
    * [Numeric Textbox]
    * [Multiline Textbox]
    * [Password Box]
    * [TextBlock]
    * [TextBlock]
* [Option Picker]
* [OAuth Button]
* [Progress Bar]
* [Query Builder]
* [Search Box]
* [Search Box]
* [Sliders]
    * [Sliders]
    * [Custom Sliders]
    * [Range Sliders]
    * [Custom Range Sliders]
* [Grid](portalfx-controls-grid.md)
    * [Data Virtualization](portalfx-data-virtualizedgriddata.md)
* [Editable Grid]
* [Spec Picker Blade](portalfx-extension-pricing-tier.md)
* [Subscription Dropdown](portalfx-create.md#subscriptions-dropdown-1)
* [Resource Group dropdown](portalfx-create.md#resource-groups-legacy-dropdown)
* [Location dropdown](portalfx-create.md#locations-legacy-dropdown)
* [Pricing Dropdown](portalfx-create.md#pricing-dropdown)

## Forms

* [Building UI for Form](portalfx-forms.md#laying-out-your-ui-on-the-blade)
* [Submit Style UI]
    * [Save/ Cancel Button](portalfx-editscopeless-forms.md#other-css-classes-that-can-be-useful)
    * [Legacy Action Bar](portalfx-fxcontrols-editscope-forms.md)
* [Prompt user to Save/Discard changes](portalfx-editscopeless-forms.md#customizing-alert-on-form-close)
* [EditScopeless Forms](portalfx-editscopeless-forms.md)
* [Legacy Editscope based Forms](portalfx-forms.md)
* [Using Editscopeless controls in EditScoped Forms](portalfx-fxcontrols-editscope-forms.md)

## Advanced Styling

</details>


<details>
  <summary>10. Memory Management</summary>

## [Extension memory management / Lifetime manager](portalfx-data-lifetime.md#lifetime-manager)
* Content:
    * [Relate this to Blade/Part lifecycle]
    * [What are child lifetimes?]
    * [Why do all ctors/factories require 'lifetimeManager']
        * [Controls]
        * [KO factories]
        * [EntityView/QueryView]

</details>

    


