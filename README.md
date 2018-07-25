# Azure portal extension documentation

This is the home page for all documentation related to onboarding, developing, operating, and anything else to do with owning an Azure portal extension.

Couldn't find what you needed? [Ask about the docs on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-missing-docs).

## Onboarding a new extension

* [Overview / Get started](/portal-sdk/generated/top-onboarding.md)

* [Steps that do not involve the Ibiza team](/portal-sdk/generated/top-extensions-onboarding-with-related-teams.md)

* [Manage cloud/environment specific configuration](/portal-sdk/generated/top-extensions-configuration.md)

* [Production-ready metrics](/portal-sdk/generated/top-extensions-production-ready-metrics.md)

Kickoff the onboarding experience by sending mail to <a href="mailto:ibiza-onboarding-kick@microsoft.com?subject=Kickoff Meeting Request&body=My team would like to meet with you to learn about the Azure onboarding process.">Azure Onboarding Team</a>.

## Azure portal architecture

Learn how the framework is structured and how it is designed to run in multiple clouds / environments.

* [Architecture overview](/portal-sdk/generated/top-extensions-architecture.md)

* [Authentication](/portal-sdk/generated/top-extensions-authentication.md)

## What's new

* [No-PDL blades and parts](http://top-whats-new#no-pdl.md) - *Reduces the number of files and concepts to build UI*

* [Forms without edit scope](/portal-sdk/generated/top-editscopeless-forms.md) - *More intuitive APIs for building forms*

* [EditableGrid V2](http://top-level/editable-grid.md) - *Improved APIs designed to work with new forms*

* [Extension availability alerts](http://top-level/availibility-alerts.md) - *Get notified if your extension goes down*

* [Actionable notifications](http://top-level/availibility-alerts.md) - *Point users to well known next steps*

* [EV2 support for the Extension Hosting Service](http://top-level/hosting-service#ev2.md) - *Nuff said*

* [Multi-Column for the Essentials control](/portal-sdk/generated/) - *Better use of screen real estate*

* [TreeView improvements](/portal-sdk/generated/) - *Checkboxes, commands, and Load More / Virtualization*

## Development guide

### Getting started

Azure portal extension development is supported on the Microsoft Windows 8, Windows Server 2012 R2, and Windows 10.

* [Downloads](/portal-sdk/generated/downloads.md)

* [Release notes](/portal-sdk/generated/release-notes.md)

* [Breaking changes](/portal-sdk/generated/breaking-changes.md)

* [Install the SDK](/portal-sdk/generated/top-extensions-install-software.md)

* [How to update portal Nuget packages](/portal-sdk/generated/top-extensions-nuget.md)

* [Develop extensions](/portal-sdk/generated/top-extensions-getting-started.md)

* [SDK Update policy and alerts](/portal-sdk/generated/top-extensions-getting-started.md#maintain-development-environment)

* [Run the extension locally (a.k.a. sideloading)](/portal-sdk/generated/top-extensions-sideloading.md)

[Ask an SDK setup question on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-sdkupdate)

### Samples

Samples show how to do many common development tasks. 

* [Samples](/portal-sdk/generated/top-extensions-samples.md)

### Blades

The primary UI building block is a called a blade. A blade is like a page. It generally takes up the full screen, has a presence in the portal breadcrumb, and has an 'X' button to close it.

* [Overview](/portal-sdk/generated/top-extensions-blades.md)

* [TemplateBlade](/portal-sdk/generated/top-blades-template.md)

* [MenuBlade](/portal-sdk/generated/top-blades-menu.md)

* [ResourceMenuBlade](/portal-sdk/generated/top-blades-resourcemenu.md)

* [FrameBlade](/portal-sdk/generated/top-blades-frame.md)

* [Open and close blades programmatically](/portal-sdk/generated/top-blades-opening-and-closing.md)

* [Advanced TemplateBlade topics](/portal-sdk/generated/top-blades-advanced.md)

* [Blade settings](/portal-sdk/generated/top-blades-settings.md)

* [Blade with tiles](/portal-sdk/generated/top-blades-legacy.md)

[Ask a question about blades on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-blades-parts)

### Parts

If you want your experience to have a presence on Azure dashboards then you will want to build parts (a.k.a. tiles).

* [Develop parts](/portal-sdk/generated/top-extensions-parts.md)

[Ask a question about parts on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-blades-parts)

### Building UI with HTML templates and Fx controls

Any template based UI in the portal (e.g. template blades or template parts can make use of a rich controls library maintained by the Ibiza team.

* [Controls overview](/portal-sdk/generated/top-extensions-controls.md)

* [Controls playground](/portal-sdk/generated/top-extensions-controls.md#the-controls-playground)

[Ask a controls related question on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-controls)

### Styling and theming

When using HTML and framework controls you have some control over styling. These documents walk through the relevant topics.

 [Styling and theming](/portal-sdk/generated/top-extensions-style-guide.md)

* [HTML, CSS, and SVG sanitization](/portal-sdk/generated/top-style-guide-html-css-sanitization.md)

* [Add custom CSS](/portal-sdk/generated/top-style-guide-custom-css.md)

* [Layout classes](/portal-sdk/generated/top-style-guide-layout.md)

* [Theming](/portal-sdk/generated/top-style-guide-theming.md)

* [Typography](/portal-sdk/generated/top-style-guide-typography.md)

* [Iconography](/portal-sdk/generated/top-style-guide-iconography.md)

### Forms

Many experiences require the user to enter data into a form. The Ibiza controls library provides support for forms. It also provides a TypeScript based section model that lets you build your form in code without expressing all the fields in an html template.

* [Develop forms](/portal-sdk/generated/top-extensions-forms.md)

[Ask a forms related question on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-forms)

### Common scenarios and integration points

* [Blades that create or provision resources and services](/portal-sdk/generated/top-extensions-create.md)

* [Add your resource or service into the Browse menu](/portal-sdk/generated/top-extensions-browse.md)

* [Common UX for Azure Resource Manager (ARM) based services](/portal-sdk/generated/top-extensions-arm.md)

[Ask about browse integration on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-browse)

[Ask about create scenarios on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-create)

### Other UI concepts

* [Context panes](/portal-sdk/generated/top-extensions-context-panes.md)

* [Dialogs](/portal-sdk/generated/top-extensions-dialogs.md)

* [Notifications](/portal-sdk/generated/top-extensions-notifications.md)

### Loading and managing data

Because your extension is Web code, you can make **AJAX** calls to various services to load data into your UI. The framework provides a data library you can use to manage this data.

* [Call Azure Resource Manager (ARM) and other endpoints](/portal-sdk/generated/top-extensions-data-ajax.md)

* [Legacy data management features](/portal-sdk/generated/top-legacy-data.md)

[Ask about data management on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-data-caching)

### Advanced development topics

* [Memory management (LifetimeManager)](/portal-sdk/generated/top-extensions-data-lifetime.md) 

* [Sharing blades and parts across extensions](/portal-sdk/generated/top-extensions-sharing-blades-and-parts.md)

* [Custom domains (e.g. aad.portal.azure.com)](/portal-sdk/generated/top-extensions-custom-domains.md)

## Debugging

* [Use developer mode](/portal-sdk/generated/top-extensions-hosting-service-procedures.md#update-isdevelopmentmode-flag)

* [Use debug mode](/portal-sdk/generated/top-extensions-debugging.md#debug-mode)

* [Debug extension load failures](/portal-sdk/generated/top-extensions-debugging.md#debug-extension-load-failures)

* [Debug console errors](/portal-sdk/generated/top-extensions-debugging.md#debug-console-errors)

* [Debug javascript](/portal-sdk/generated/top-extensions-debugging.md#debug-javascript)

* [Debug knockout](/portal-sdk/generated/top-extensions-debugging.md#debug-knockout)

* [Debug the data stack](/portal-sdk/generated/top-extensions-debugging.md#debug-the-data-stack)

## Performance

* [Performance profiling](/portal-sdk/generated/top-extensions-performance-profiling.md)

## Testing

The Ibiza team provides limited testing support. Due to resource constraints the C# and Node.js framework is open source. This is so that partners can unblock themselves in case the Ibiza team cannot make requested improvements as quickly as you might expect.

* [Unit testing support](/portal-sdk/generated/top-extensions-unit-test.md)

* [C# test framework (Open source)](/portal-sdk/generated/top-extensions-csharp-test-framework.md)

* [Node.js test framework (Open source)](/portal-sdk/generated/top-extensions-node-js-test-framework.md)

[Ask a test-related question on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-test)

## Telemetry and alerting

The Ibiza team collects standard telemetry for generic actions like blade opening and commmand execution. It also collects performance, reliability, and user feedback information that facilitate the operation of your extension. You can also write your own events via the telemetry system. Ibiza supports alerting for common operations scenarios.

* [Portal telemetry overview](/portal-sdk/generated/)

* [Getting access to raw portal telemetry data](/portal-sdk/generated/)

* [Consuming telemetry via pre-built Power BI dashboards](/portal-sdk/generated/)

* [Performance and reliability monitoring / alerting](/portal-sdk/generated/)

* [Collecting feedback from your users](/portal-sdk/generated/)

* [Set up and verify telemetry logging from your extension](/portal-sdk/generated/)

[Ask about telemetry on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-telemetry)

[Ask about performance and reliability on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-performance)

## Experimentation and flighting

It is common for teams to want to experiment with new capabilities. We offer two framework features that make this possible.

* [Flighting a new version of your extension in MPAC](/portal-sdk/generated/top-extensions-flighting.md)

* [Feature flags to enable or disable individual features within an environment](/portal-sdk/generated/top-extensions-flags.md)

## Localization and globalization

The Azure portal supports multiple languages and locales. You will need to localize your content.

* [Localization overview and supported languages](/portal-sdk/generated/top-extensions-localization-globalization.md)

* [Setting up localization for your extension](/portal-sdk/generated/top-extensions-localization-globalization.md#localizing-your-extension)

* [Setting up localization for your gallery package](/portal-sdk/generated/top-extensions-localization-globalization.md#marketplace)

* [Testing localization with side-loading](/portal-sdk/generated/top-extensions-sideloading.md)

* [Formatting numbers, currencies and dates](/portal-sdk/generated/top-extensions-localization-globalization.md#globalization-api)

[Ask about localization / globalization on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-localization-global)

## Accessibility

The Azure portal strives to meet high accessibility standards to ensure the product is accessible to to users of all levels of ability. There is regular testing and a process with SLAs for getting issues addressed quickly.

* [Accessibility guidelines](/portal-sdk/generated/top-extensions-accessibility.md)

* [Accessibility testing and SLAs](/portal-sdk/generated/top-extensions-accessibility.md#accessibility-planning)

[Ask about accessibility on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-accessibility)

## Deploying your extension

<!--
* [Deploy your extension](/portal-sdk/generated/top-extensions-deployment.md)
-->

Learn how to deploy your extension to the various clouds and environments.
* [Extension registration, environments, clouds and Ibiza team SLAs](/portal-sdk/generated/top-extensions-publishing.md)

* [Moving an extension from private preview to public preview to GA](/portal-sdk/generated/top-extensions-developmentPhases.md)

[Ask a deployment question on Stackoverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-deployment)

### Deployment using the Extension Hosting Service

The Ibiza team provides and operates a common Extension Hosting Service that makes it easy to get your bits into a globally distributed system without having to manage your own infrastructure.

* [Extension Hosting Service overview](/portal-sdk/generated/top-extensions-hosting-service.md)

* [Onboarding your extension to the Extension Hosting Service](/portal-sdk/generated/top-extensions-hosting-service-procedures.md)

* [Validating extension registration with the Extension Hosting Service](/portal-sdk/generated/)

* [Versioning your extension](/portal-sdk/generated/top-extensions-versioning.md)

* [Deploying your extension using Express V2 and the Extension Hosting Service](/portal-sdk/generated/top-extensions-hosting-service-advanced.md)

* [SLA for registering an extension with the Extension Hosting Service](/portal-sdk/generated/top-extensions-svc-lvl-agreements.md)

### Custom extension deployment infrastructure

You should strive to use the Extension Hosting Service. If for some reason this is not possible then [learn how to build a custom extension deployment infrastructure](/portal-sdk/generated/top-extensions-custom-deployment.md).

## Legacy features

These features are supported, but have had no recent investment. No additional investment is planned. There are modern capabilities that should be used instead if you are developing new features.

* [PDL-based programming](/portal-sdk/generated/top-legacy-blades-template-pdl.md)

* [Legacy parts](/portal-sdk/generated/top-legacy-parts.md)

* [Legacy data management feature](/portal-sdk/generated/top-legacy-data.md)

* [Controls in the MsPortalFx namespace](/portal-sdk/generated/top-extensions-samples-controls-deprecated.md)

* [EditScope](/portal-sdk/generated/top-legacy-editscopes.md)

## Additional resources

The documents are combinations from all the previous topics. Consequently, there may be some repetition.

* [Best practices](/portal-sdk/generated/top-extensions-bp.md)

* [Frequently asked questions](/portal-sdk/generated/top-extensions-faq.md)

* [Glossary](/portal-sdk/generated/top-extensions-glossary.md)

# Marketplace/Gallery developer resources

1. [Gallery overview](/gallery-sdk/generated/index-gallery.md#gallery-overview)

1. [Gallery item specifications](/gallery-sdk/generated/index-gallery.md#gallery-item-specificiations)

1. [Gallery item metadata](/gallery-sdk/generated/index-gallery.md#gallery-item-metadata)

1. [Gallery item field to UI element mappings](/gallery-sdk/generated/index-gallery.md#gallery-item-field-to-ui-element-mappings)

1. [Gallery package development and debugging](/gallery-sdk/generated/index-gallery.md#gallery-package-development-and-debugging)

1. [Legacy OneBox development approach](/gallery-sdk/generated/index-gallery.md#legacy-onebox-development-approach)

1. [Using the "Add to Resource" blade](/gallery-sdk/generated/index-gallery.md#using-the-add-to-resource-blade)

1. [Your icon tile for the Azure store](/gallery-sdk/generated/index-gallery.md#your-icon-tile-for-the-azure-store)

1. [Developer tooling and productivity](/gallery-sdk/generated/index-gallery.md#developer-tooling-and-productivity)

1. [Gallery frequently asked questions](/gallery-sdk/generated/index-gallery.md#gallery-frequently-asked-questions)

