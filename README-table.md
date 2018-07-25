# Azure portal extension documentation

This is the home page for all documentation related to onboarding, developing, operating, and anything else to do with owning an Azure portal extension.   

Couldn't find what you needed? [Ask about the docs on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-missing-docs).

### Onboarding a new extension

| Name | Location | Purpose |
| ---- | -------- | ------- |
| Overview | [/portal-sdk/generated/ top-onboarding.md](/portal-sdk/generated/top-onboarding.md) | Getting your team ready to develop extensions | 
| Steps that do not involve the Ibiza team | [/portal-sdk/generated/ top-extensions-onboarding-with-related-teams.md](/portal-sdk/generated/top-extensions-onboarding-with-related-teams.md) | Coordinating with other teams to deploy an extension  |
| Manage cloud/environment specific configuration | [/portal-sdk/generated/ top-extensions-configuration.md](/portal-sdk/generated/top-extensions-configuration.md) | Configuring an extension to run in  various environments  |
| Production-ready metrics | [/portal-sdk/generated/ top-extensions-production-ready-metrics.md](/portal-sdk/generated/top-extensions-production-ready-metrics.md) | Criteria for  moving an extension from one preview to another |
| Partner request process | [/portal-sdk/generated/ top-extensions-partner-request.md](/portal-sdk/generated/top-extensions-partner-request.md) | How to request new features from the Ibiza team |

Kickoff the onboarding experience by sending mail to <a href="mailto:ibiza-onboarding-kick@microsoft.com?subject=Kickoff Meeting Request&body=My team would like to meet with you to learn about the Azure onboarding process.">Azure Onboarding Team</a>.

### Azure portal architecture

Learn how the framework is structured and how it is designed to run in multiple clouds / environments.

| Name | Location | Purpose |
| ---- | -------- | ------- |
| Architecture overview | [/portal-sdk/generated/ top-extensions-architecture.md](/portal-sdk/generated/top-extensions-architecture.md) | Describes the components of the Azure Portal  and their interrelationships |

### What's new

| Name | Location | Purpose |
| ---- | -------- | ------- |
| No-PDL blades and parts | http://top-whats-new #no-pdl.md | Reduces the number of files and concepts to build UI |
| Forms without edit scope | [/portal-sdk/generated/ top-editscopeless-forms.md](/portal-sdk/generated/top-editscopeless-forms.md) | More intuitive APIs for building forms |
| EditableGrid V2 | /portal-sdk/generated | Improved APIs designed to work with new forms |
| Extension availability alerts |  /portal-sdk/generated  | Get notified if your extension goes down |
| Actionable notifications |availibility-alerts.md | Point users to well known next steps |
| EV2 support for the Extension Hosting Service | [/portal-sdk/generated/ top-extensions-hosting-service-advanced.md](/portal-sdk/generated/top-extensions-hosting-service-advanced.md) | Nuff said |
| Multi-Column for the Essentials control | /portal-sdk/generated/ | Better use of screen real estate |
| TreeView improvements | /portal-sdk/generated/ | Checkboxes, commands, and Load More / Virtualization |

### Development guide

#### Getting started

Azure portal extension development is supported on the Microsoft Windows 8, Windows Server 2012 R2, and Windows 10.

| Name | Location | Purpose |
| ---- | -------- | ------- |
| Downloads | [/portal-sdk/generated/ downloads.md](/portal-sdk/generated/downloads.md) | Download a specific release |
| Release notes | [/portal-sdk/generated/ release-notes.md](/portal-sdk/generated/release-notes.md) | Summary of recent changes to the Azure SDK |
| Breaking changes | [/portal-sdk/generated/ breaking-changes.md](/portal-sdk/generated/breaking-changes.md) | SDK editions that are associated with bugs, workarounds or fixes |
| Install the SDK | [/portal-sdk/generated/ top-extensions-install-software.md](/portal-sdk/generated/top-extensions-install-software.md) | Initializing the computer for Azure extension development |
| How to update portal Nuget packages |  [/portal-sdk/generated/ top-extensions-nuget.md](/portal-sdk/generated/top-extensions-nuget.md) | A list of Nuget packages and how to install them  |
| Developing extensions |  [/portal-sdk/generated/ top-extensions-getting-started.md](/portal-sdk/generated/top-extensions-getting-started.md) | From empty form factor to a functional extension |
| SDK Update policy and alerts |  [/portal-sdk/generated/ top-extensions-getting-started.md #maintain-development-environment](/portal-sdk/generated/top-extensions-getting-started.md#maintain-development-environment) | Keeping your computer current for extension development |
| Sideloading  | [/portal-sdk/generated/ top-extensions-sideloading.md](/portal-sdk/generated/top-extensions-sideloading.md)  | Running the extension locally | 

[Ask an SDK setup question on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-sdkupdate) 

#### Samples

Samples show how to do many common development tasks. 

| Name    | Location | Purpose |
| ------- | -------- | ------- |
| Samples | [/portal-sdk/generated/ top-extensions-samples.md](/portal-sdk/generated/top-extensions-samples.md) | Working copies of samples in the Dogfood environment | 

#### Blades

The primary UI building block is a called a blade. A blade is like a page. It generally takes up the full screen, has a presence in the portal breadcrumb, and has an 'X' button to close it.

| Name     | Location | Purpose |
| -------- | -------- | ------- |
| Overview | [/portal-sdk/generated/ top-extensions-blades.md](/portal-sdk/generated/top-extensions-blades.md) | Quick overview of blades  | 
| TemplateBlade | [/portal-sdk/generated/ top-blades-procedure.md](/portal-sdk/generated/top-blades-procedure.md) | How to build a basic blade |
| MenuBlade | [/portal-sdk/generated/ top-blades-menublade.md](/portal-sdk/generated/top-blades-menublade.md) | Menu on the left side of the screen |
| ResourceMenuBlade | [/portal-sdk/generated/ top-blades-resourcemenu.md](/portal-sdk/generated/top-blades-resourcemenu.md) | Readily available Azure resource menu items |
| FrameBlade | [/portal-sdk/generated/ top-blades-frameblades.md](/portal-sdk/generated/top-blades-frameblades.md) |  Rehost an existing extension in an IFrame |
| Opening and closing blades programmatically | [/portal-sdk/generated/ top-blades-opening-and-closing.md](/portal-sdk/generated/top-blades-opening-and-closing.md) | How to open and close blades using container APIs |
| Advanced TemplateBlade topics | [/portal-sdk/generated/ top-blades-advanced.md](/portal-sdk/generated/top-blades-advanced.md) |  Deep linking, blade pinning, and other topics |
| Blade settings | [/portal-sdk/generated/ top-blades-settings.md](/portal-sdk/generated/top-blades-settings.md) | Blade settings that are managed by the Framework |
| Blade with tiles | [/portal-sdk/generated/ top-blades-legacy.md](/portal-sdk/generated/top-blades-legacy.md) | Creating blades with PDL | 

[Ask a question about blades on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-blades-parts)

#### Parts

If you want your experience to have a presence on Azure dashboards then you will want to build parts (a.k.a. tiles).

| Name          | Location | Purpose |
| ------------- | -------- | ------- |
| Develop parts | [/portal-sdk/generated/ top-extensions-parts.md](/portal-sdk/generated/top-extensions-parts.md)  | A framework feature that integrates the UI of an extension on dashboards |

[Ask a question about parts on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-blades-parts)

#### Building UI with HTML templates and Fx controls

Any template based UI in the portal (e.g. template blades or template parts can make use of a rich controls library maintained by the Ibiza team.

| Name                | Location | Purpose |
| ------------------- | -------- | ------- |
| Controls overview   | [/portal-sdk/generated/ top-extensions-controls.md](/portal-sdk/generated/top-extensions-controls.md)  | The building blocks that allow users to view, edit, and analyze data |
| Controls playground | [/portal-sdk/generated/ top-extensions-controls-playground.md](/portal-sdk/generated/top-extensions-controls-playground.md) | Provides a space where developers can experiment with controls |

[Ask a controls related question on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-controls)

#### Styling and theming

When using HTML and framework controls you have some control over styling. These documents walk through the relevant topics.

| Name                            | Location | Purpose |
| ------------------------------- | -------- | ------- |
| Styling and theming             | [/portal-sdk/generated/ top-extensions-style-guide.md](/portal-sdk/generated/top-extensions-style-guide.md) |  Styles and Themes for your extension |
| HTML, CSS, and SVG sanitization | [/portal-sdk/generated/ top-style-guide-html-css-sanitization.md](/portal-sdk/generated/top-style-guide-html-css-sanitization.md) | Filtering elements that have a negative impact rendering or performance |
| Adding custom CSS | [/portal-sdk/generated/ top-style-guide-custom-css.md](/portal-sdk/generated/top-style-guide-custom-css.md) | Add a new CSS file to the extension to specify custom styles |
| Layout classes | [/portal-sdk/generated/ portalfx-blades-layout.md](/portal-sdk/generated/portalfx-blades-layout.md) | CSS and HTML layout for blades |
| Theming | [/portal-sdk/generated/ top-style-guide-theming.md](/portal-sdk/generated/top-style-guide-theming.md) | Base colors that can vary based on user-chosen themes |
| Typography | [/portal-sdk/generated/ top-style-guide-typography.md](/portal-sdk/generated/top-style-guide-typography.md) | Formation of letters and words in fonts that are consistent across extensions and display content effectively  |
| Iconography | [/portal-sdk/generated/ top-style-guide-iconography.md](/portal-sdk/generated/top-style-guide-iconography.md) |  Custom SVG files,  Color Palettes, and the icon library in the Azure SDK |

#### Forms

Many experiences require the user to enter data into a form. The Ibiza controls library provides support for forms. It also provides a TypeScript based section model that lets you build your form in code without expressing all the fields in an html template.

| Name             | Location | Purpose |
| ---------------- | -------- | ------- |
| Developing forms | [/portal-sdk/generated/ top-extensions-forms.md](/portal-sdk/generated/top-extensions-forms.md) | Form controls are a subset of controls that allow users to input information. |

[Ask a forms related question on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-forms)

#### Common scenarios and integration points

| Name                            | Location | Purpose |
| ------------------------------- | -------- | ------- |
| The Create Blade | [/portal-sdk/generated/ top-extensions-create.md](/portal-sdk/generated/top-extensions-create.md) | Blades that create or provision resources and services |
| The Browse Blade | [/portal-sdk/generated/ top-extensions-browse.md](/portal-sdk/generated/top-extensions-browse.md) | Adding your resource or service into the Browse menu |
| Common UX for Azure Resource Manager (ARM) based services | /portal-sdk/generated/ | |

[Ask about browse integration on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-browse)

[Ask about create scenarios on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-create)

#### Other UI concepts

| Name                            | Location | Purpose |
| ------------------------------- | -------- | ------- |
| Context panes | [/portal-sdk/generated/ top-extensions-context-panes.md](/portal-sdk/generated/top-extensions-context-panes.md)  | Panes that overlay the current content instead of scrolling the screen horizontally. |
| Dialogs | [/portal-sdk/generated/ top-extensions-dialogs.md](/portal-sdk/generated/top-extensions-dialogs.md)  | Lightweight alternative to context blades |
| Notifications | [/portal-sdk/generated/ top-extensions-notifications.md](/portal-sdk/generated/top-extensions-notifications.md) | Context-sensitive warnings, errors, and other information |
| Communication between blades | [/portal-sdk/generated/ parameters-and-collectors](/portal-sdk/generated/parameters-and-collectors) | |

#### Loading and managing data

Since your extension is just web code, you can make **AJAX** calls to various services to load data into your UI. The framework provides a data library you can use to manage this data.

| Name                            | Location | Purpose |
| ------------------------------- | -------- | ------- |
| Call Azure Resource Manager (ARM) and other endpoints) | [/portal-sdk/generated/ top-extensions-data-ajax.md](/portal-sdk/generated/top-extensions-data-ajax.md) | Making Ajax calls from the client to the server |
| More Ajax  | /portal-sdk/generated/ | Ajax all up, ajax calls with batch flags set  |
| Legacy data management features | [/portal-sdk/generated/ top-legacy-data.md](/portal-sdk/generated/top-legacy-data.md) | QueryCache and the master view, in association with EntityCache and the detail view |

[Ask about data management on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-data-caching)

#### Advanced development topics

| Name                                | Location | Purpose |
| ----------------------------------- | -------- | ------- |
| Memory management (LifetimeManager) | [/portal-sdk/generated/ top-extensions-data-lifetime.md](/portal-sdk/generated/top-extensions-data-lifetime.md) | Disposing of child resources previous to the closing of the parent blade |
| Sharing blades and parts across extensions | [/portal-sdk/generated/ top-extensions-sharing-blades-and-parts.md](/portal-sdk/generated/top-extensions-sharing-blades-and-parts.md) | Making your extension available to other teams |
| Custom domains (e.g. aad.portal.azure.com) | [/portal-sdk/generated/ top-extensions-custom-domains.md](/portal-sdk/generated/top-extensions-custom-domains.md) | Domain-based configuration for third-party and other extensions  |

### Debugging

| Name                            | Location | Purpose |
| ------------------------------- | -------- | ------- |
| Using developer mode | [/portal-sdk/generated/ top-extensions-hosting-service-procedures.md #update-isdevelopmentmode-flag](/portal-sdk/generated/top-extensions-hosting-service-procedures.md#update-isdevelopmentmode-flag)  | Setting a released extension for development testing |
| Using debug mode | [/portal-sdk/generated/ top-extensions-debugging.md #the-debug-tool](/portal-sdk/generated/top-extensions-debugging.md#the-debug-tool)  | F12 tools in your browser |
| Debug extension load failures | [/portal-sdk/generated/ top-extensions-debugging.md #debug-extension-load-failures](/portal-sdk/generated/top-extensions-debugging.md#debug-extension-load-failures)  | What to do when your extension does not load  |
| Debugging console errors | [/portal-sdk/generated/ top-extensions-debugging.md #debug-console-errors](/portal-sdk/generated/top-extensions-debugging.md#debug-console-errors) | Errors that are written to the browser developer console log |
| Debugging javascript | [/portal-sdk/generated/ top-extensions-debugging.md #debug-javascript](/portal-sdk/generated/top-extensions-debugging.md#debug-javascript)  | Extension source code files |
| Debugging knockout | [/portal-sdk/generated/ top-extensions-debugging.md #debug-knockout](/portal-sdk/generated/top-extensions-debugging.md#debug-knockout)  | The ViewModel and Knockout code |
| Debugging the data stack | [/portal-sdk/generated/ top-extensions-debugging.md #debug-the-data-stack](/portal-sdk/generated/top-extensions-debugging.md#debug-the-data-stack) | Browser data for the current testing session |

### Performance

| Name                            | Location | Purpose |
| ------------------------------- | -------- | ------- |
| Performance profiling | [/portal-sdk/generated/ top-extensions-performance-profiling.md](/portal-sdk/generated/top-extensions-performance-profiling.md) | How to make your extension more performant |

### Testing

The Ibiza team provides limited testing support. Due to resource constraints the C# and Node.js framework is open source. This is so that partners can unblock themselves in case the Ibiza team cannot make requested improvements as quickly as you might expect.

| Name                            | Location | Purpose |
| ------------------------------- | -------- | ------- |
| Unit testing support | [/portal-sdk/generated/ top-extensions-unit-test.md](/portal-sdk/generated/top-extensions-unit-test.md) | Creating a unit test for your extension |
| C# test framework (Open source) | [/portal-sdk/generated/ top-extensions-csharp-test-framework.md](/portal-sdk/generated/top-extensions-csharp-test-framework.md) | A framework for UI-based Selenium Webdriver tests |
| Node.js test framework (Open source) | [/portal-sdk/generated/ top-extensions-msportalfx-test.md](/portal-sdk/generated/top-extensions-msportalfx-test.md) | An end-to-end test framework that tests extension interactions with user behavior |

[Ask a test-related question on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-test)

### Telemetry and alerting

The Ibiza team collects standard telemetry for generic actions like blade opening and commmand execution. It also collects performance, reliability, and user feedback information that facilitate the operation of your extension. You can also write your own events via the telemetry system. Ibiza supports alerting for common operations scenarios.

| Name                            | Location | Purpose |
| ------------------------------- | -------- | ------- |
| Portal telemetry overview | /portal-sdk/generated/ | |
| Getting access to raw portal telemetry data | /portal-sdk/generated/ | |
| Consuming telemetry via pre-built Power BI dashboards | /portal-sdk/generated/ | |
| Performance and reliability monitoring / alerting | /portal-sdk/generated/ | |
| Collecting feedback from your users | /portal-sdk/generated/ | |
| Set up and verify telemetry logging from your extension | /portal-sdk/generated/ | |

[Ask about telemetry on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-telemetry)

[Ask about performance and reliability on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-performance)

### Experimentation and flighting

It is common for teams to want to experiment with new capabilities. We offer two framework features that make this possible.

| Name                            | Location | Purpose |
| ------------------------------- | -------- | ------- |
| Flighting a new version of your extension in MPAC | [/portal-sdk/generated/ top-extensions-flighting.md)](/portal-sdk/generated/top-extensions-flighting.md) | Testing control group/experiment group versions of an extension previous to production deployment |
| Feature flags to enable or disable individual features within an environment | [/portal-sdk/generated/ top-extensions-flags.md](/portal-sdk/generated/top-extensions-flags.md) | Query string flags that modify the run-time behavior of extensions for interacting with the Portal, or controlling and diagnosing extension behavior |

### Localization and globalization

The Azure portal supports multiple languages and locales. You will need to localize your content.

| Name                                             | Location | Purpose |
| ------------------------------------------------ | -------- | ------- |
| Localization overview and supported languages    | [/portal-sdk/generated/ top-extensions-localization-globalization.md #understanding-localization](/portal-sdk/generated/top-extensions-localization-globalization.md#understanding-localization) | |
| Setting up localization for your extension       | [](/portal-sdk/generated/) | |
| Setting up localization for your gallery package | [](/portal-sdk/generated/) | |
| Testing localization with side-loading           | [/portal-sdk/generated/ top-extensions-sideloading.md](/portal-sdk/generated/top-extensions-sideloading.md) | |
| Formatting numbers, currencies and dates         | [/portal-sdk/generated/ top-extensions-localization-globalization.md #globalization-api](/portal-sdk/generated/top-extensions-localization-globalization.md#globalization-api) | |

[Ask about localization / globalization on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-localization-global)

### Accessibility

The Azure Portal strives to meet high accessibility standards to ensure the product is accessible to users of all levels of ability. There is regular testing and a process with SLAs for getting issues addressed quickly.

| Name                            | Location | Purpose |
| ------------------------------- | -------- | ------- |
| Accessibility guidelines | [/portal-sdk/generated/ top-extensions-accessibility.md](/portal-sdk/generated/top-extensions-accessibility.md) | |
| Accessibility testing and SLAs | [/portal-sdk/generated/ top-extensions-accessibility.md #accessibility-planning](/portal-sdk/generated/top-extensions-accessibility.md#accessibility-planning) | How to report bugs to the Accessibility Team |

[Ask about accessibility on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-accessibility)

### Deploying your extension

Learn how to deploy your extension to the various clouds and environments.

| Name                            | Location | Purpose |
| ------------------------------- | -------- | ------- |
| Extension registration, environments and Ibiza team SLAs | [/portal-sdk/generated/ top-extensions-publishing.md](/portal-sdk/generated/top-extensions-publishing.md) | Dogfood, Production, and clouds (Mooncake, BlackForest, Fairfax) | 
| Going from private preview to public preview to GA | [/portal-sdk/generated/ top-extensions-developmentPhases.md](/portal-sdk/generated/top-extensions-developmentPhases.md) | Development phases of an extension  |
| Deploying your extension | [/portal-sdk/generated/ portal-sdk/generated/top-extensions-deployment.md](/portal-sdk/generated/portal-sdk/generated/top-extensions-deployment.md) | Developer checklist for extension deployment and tuning  |

[Ask a deployment question on Stackoverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-deployment)

#### Deployment using the Extension Hosting Service

The Ibiza team provides and operates a common Extension Hosting Service that makes it easy to get your bits into a globally distributed system without having to manage your own infrastructure.

| Name                     | Location | Purpose |
| ------------------------ | -------- | ------- |
| Hosting Service overview | [/portal-sdk/generated/ top-extensions-hosting-service.md](/portal-sdk/generated/top-extensions-hosting-service.md) | |
| Onboarding your extension to the Extension Hosting Service | [/portal-sdk/generated/ top-extensions-hosting-service-procedures.md](/portal-sdk/generated/top-extensions-hosting-service-procedures.md) | |
| Validating extension registration with the Extension Hosting Service | [/portal-sdk/generated/ top-extensions-hosting-service-procedures.md #register-the-extension](/portal-sdk/generated/top-extensions-hosting-service-procedures.md#register-the-extension) | |
| Versioning your extension | [/portal-sdk/generated/ top-extensions-versioning.md](/portal-sdk/generated/top-extensions-versioning.md) | |
| Deploying your extension using Express V2 and the Extension Hosting Service | [/portal-sdk/generated/ top-extensions-hosting-service-advanced.md](/portal-sdk/generated/top-extensions-hosting-service-advanced.md)| |
| SLA for registering an extension with the Extension Hosting Service | [/portal-sdk/generated/ top-extensions-svc-lvl-agreements.md](/portal-sdk/generated/top-extensions-svc-lvl-agreements.md) | |

#### Custom extension deployment infrastructure

You should strive to use the Extension Hosting Service. If for some reason this is not possible then [learn how to build a custom extension deployment infrastructure](/portal-sdk/generated/top-extensions-custom-deployment.md).

| Name                          | Location | Purpose |
| ----------------------------- | -------- | ------- |
| Legacy Do-It-Yourself Hosting | [/portal-sdk/generated/ top-extensions-custom-deployment.md](/portal-sdk/generated/top-extensions-custom-deployment.md) | How to build a custom extension deployment infrastructure |

### Legacy features

These features are supported, but have had no recent investment. No additional investment is planned. There are modern capabilities that should be used instead if you are developing new features.

| Name                            | Location | Purpose |
| ------------------------------- | -------- | ------- |
| PDL-based programming | [/portal-sdk/generated/ top-legacy-blades-template-pdl.md](/portal-sdk/generated/top-legacy-blades-template-pdl.md)  | |
| Legacy parts | [/portal-sdk/generated/ top-legacy-parts.md](/portal-sdk/generated/top-legacy-parts.md) | |
| Legacy data management feature | [/portal-sdk/generated/ top-legacy-data.md](/portal-sdk/generated/top-legacy-data.md) | |
| Controls in the MsPortalFx namespace | [/portal-sdk/generated/ top-extensions-samples-controls-deprecated.md](/portal-sdk/generated/top-extensions-samples-controls-deprecated.md) | A list of deprecated controls and the replacements to use during migration to more performant extensions. |
| EditScope | [/portal-sdk/generated/ top-legacy-editscopes.md](/portal-sdk/generated/top-legacy-editscopes.md) | |

### Additional resources

The documents are combinations from all the previous topics. Consequently, there may be some repetition.

| Name                            | Location | Purpose |
| ------------------------------- | -------- | ------- |
| Best practices | [(/portal-sdk/generated/ top-extensions-bp.md](/portal-sdk/generated/top-extensions-bp.md) | Great ideas for coding extensions that are in addition to the topic document. | |
| Frequently asked questions | [/portal-sdk/generated/ top-extensions-faq.md](/portal-sdk/generated/top-extensions-faq.md) | Stackoverflow discussions that are worth including in the Ibiza library |
| Glossary | [/portal-sdk/generated/ top-extensions-glossary.md](/portal-sdk/generated/top-extensions-glossary.md) | Terms that are not defined in standard computing or acronym dictionaries |

## Marketplace/Gallery developer resources

1. [Gallery overview](/gallery-sdk/generated/index-gallery.md#gallery-overview)

1. [Gallery item specifications](/gallery-sdk/generated/index-gallery.md#gallery-item-specificiations)

1. [Gallery item metadata](/gallery-sdk/generated/index-gallery.md#gallery-item-metadata)

1. [Gallery item field to UI element mappings](/gallery-sdk/generated/index-gallery.md#gallery-item-field-to-ui-element-mappings)

1. [Gallery package development and debugging](/gallery-sdk/generated/index-gallery.md#gallery-package-development-and-debugging)

1. [Legacy OneBox development approach](/gallery-sdk/generated/index-gallery.md#legacy-onebox-development-approach)

1. [Using the Add to Resource Blade](/gallery-sdk/generated/index-gallery.md#using-the-add-to-resource-blade)

1. [Your icon tile for the Azure store](/gallery-sdk/generated/index-gallery.md#your-icon-tile-for-the-azure-store)

1. [Developer tooling and productivity](/gallery-sdk/generated/index-gallery.md#developer-tooling-and-productivity)

1. [Gallery frequently asked questions](/gallery-sdk/generated/index-gallery.md#gallery-frequently-asked-questions)