# Azure portal extension development documentation

This is the home page for all documentation related to onboarding, designing, developing, operating, and anything else to do with owning an Azure portal extension.

Couldn't find what you needed? [Ask about the docs on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-missing-docs).

## Onboarding a new extension

* [Overview / Get started](/azure/portal-sdk/portal-sdk/generated/top-onboarding)

* [Steps that do not involve the Ibiza team](/azure/portal-sdk/portal-sdk/generated/top-extensions-onboarding-with-related-teams)

* [Managing cloud/environment specific configuration](/azure/portal-sdk/portal-sdk/generated/top-extensions-configuration)

* [Production-ready metrics](/azure/portal-sdk/portal-sdk/generated/top-extensions-production-ready-metrics)

* [Partner feature request process](/azure/portal-sdk/portal-sdk/generated/top-extensions-partner-request)

Kickoff the onboarding experience by sending a mail to <a href="mailto:ibiza-onboarding@microsoft.com?subject=Kickoff Meeting Request&body=My team would like to meet with you to learn about the Azure onboarding process.">Azure Onboarding Team</a>.

## Azure portal architecture

Learn how the framework is structured and how it is designed to run in multiple clouds / environments.

* [Architecture overview](/azure/portal-sdk/portal-sdk/generated/top-extensions-architecture)

* [Authentication flow](/azure/portal-sdk/portal-sdk/generated/top-extensions-authentication-flow)

* [Authentication procedures](/azure/portal-sdk/portal-sdk/generated/top-extensions-authentication-procedures)

## Design guide  

Design patterns provide solutions for common Azure scenarios.  By leveraging these patterns, Azure teams will accelerate extension development and provide users with a familiar experience so that users can easily adopt new Azure services.  The design guide covers [design toolkits, style guidance](/azure/portal-sdk/portal-sdk/generated/top-design#design-toolkits-and-resources), [common page layouts](/azure/portal-sdk/portal-sdk/generated/top-design#page) and [the resource management pattern](/azure/portal-sdk/portal-sdk/generated/top-design#resource-management).

* [Design guide](/azure/portal-sdk/portal-sdk/generated/top-design)

## Development guide

### Getting started

Azure portal extension development is supported on Windows Server 2012 R2, and Windows 10.

* [Downloads](/azure/portal-sdk/portal-sdk/generated/downloads)

* [Release notes](/azure/portal-sdk/portal-sdk/generated/release-notes)

* [Breaking changes](/azure/portal-sdk/portal-sdk/generated/breaking-changes)

* [Install the SDK](/azure/portal-sdk/portal-sdk/generated/top-extensions-install-software)

* [Get started](/azure/portal-sdk/portal-sdk/generated/top-extensions-getting-started)

* [Updating the SDK](/azure/portal-sdk/portal-sdk/generated/top-extensions-packages#updating-your-extension-to-a-newer-version-of-the-sdk)

* [Running your extension locally (a.k.a. sideloading)](/azure/portal-sdk/portal-sdk/generated/top-extensions-sideloading)

[Ask an SDK setup question on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-sdkupdate)

### Samples

Samples show how to do many common development tasks. 

* [Samples](/azure/portal-sdk/portal-sdk/generated/top-extensions-samples)

### Blades

The primary UI building block is a called a blade. A blade is like a page. It generally takes up the full screen, has a presence in the portal breadcrumb, and has an 'X' button to close it.

* [Overview](/azure/portal-sdk/portal-sdk/generated/top-extensions-blades)

* [TemplateBlade](/azure/portal-sdk/portal-sdk/generated/top-blades-templateblade)

* [MenuBlade](/azure/portal-sdk/portal-sdk/generated/top-blades-menublade)

* [ResourceMenuBlade](/azure/portal-sdk/portal-sdk/generated/top-blades-resourcemenublade)

* [FrameBlade](/azure/portal-sdk/portal-sdk/generated/top-blades-frameblade)

* [Opening and closing blades programmatically](/azure/portal-sdk/portal-sdk/generated/top-blades-opening-and-closing)

* [Advanced TemplateBlade topics](/azure/portal-sdk/portal-sdk/generated/top-blades-advanced)

* [Blade with tiles](/azure/portal-sdk/portal-sdk/generated/top-blades-legacy)

[Ask a question about blades on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-blades-parts)

### Parts

If you want your experience to have a presence on Azure dashboards then you will want to build parts (a.k.a. tiles).

* [Developing parts](/azure/portal-sdk/portal-sdk/generated/top-extensions-parts)

[Ask a question about parts on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-blades-parts)

### Building UI with HTML templates and Fx controls

Any template based UI in the portal (e.g. template blades or template parts can make use of a rich controls library maintained by the Ibiza team.

* [Controls overview](/azure/portal-sdk/portal-sdk/generated/top-extensions-controls)

* [Controls playground](/azure/portal-sdk/portal-sdk/generated/top-extensions-controls#the-controls-playground)

[Ask a controls related question on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-controls)

### Forms

Many experiences require the user to enter data into a form. The Ibiza controls library provides support for forms. It also provides a TypeScript based section model that lets you build your form in code without expressing all the fields in an html template.

* [Develop forms](/azure/portal-sdk/portal-sdk/generated/top-extensions-forms)

[Ask a forms related question on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-forms)

### Common scenarios and integration points

* [Blades that create or provision resources and services](/azure/portal-sdk/portal-sdk/generated/top-extensions-create)

* [Add your resource or service into the 'All services' (browse) menu](/azure/portal-sdk/portal-sdk/generated/top-extensions-browse)

[Ask about browse integration on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-browse)

[Ask about create scenarios on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-create)

### Other UI concepts

* [Context panes](/azure/portal-sdk/portal-sdk/generated/top-extensions-context-panes)

* [Dialogs](/azure/portal-sdk/portal-sdk/generated/top-extensions-dialogs)

* [Notifications](/azure/portal-sdk/portal-sdk/generated/top-extensions-notifications)

### Loading and managing data

Because your extension is Web code, you can make **AJAX** calls to various services to load data into your UI. The framework provides a data library you can use to manage this data.

* [Making authenticated and batched calls to Azure Resource Manager (ARM) and other endpoints](/azure/portal-sdk/portal-sdk/generated/top-extensions-data-ajax)

* [Legacy data management features](/azure/portal-sdk/portal-sdk/generated/top-legacy-data)

[Ask about data management on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-data-caching)

### Advanced development topics

* [Memory management (LifetimeManager)](/azure/portal-sdk/portal-sdk/generated/top-extensions-lifetime) 

* [Sharing blades and parts across extensions](/azure/portal-sdk/portal-sdk/generated/top-extensions-sharing-blades-and-parts)

* [Custom domains (e.g. aad.portal.azure.com)](/azure/portal-sdk/portal-sdk/generated/top-extensions-custom-domains)

## Debugging

* [Using debug mode](/azure/portal-sdk/portal-sdk/generated/top-extensions-debugging#debug-mode)

* [Debugging extension load failures](/azure/portal-sdk/portal-sdk/generated/top-extensions-debugging#debug-extension-load-failures)

* [Debugging console errors](/azure/portal-sdk/portal-sdk/generated/top-extensions-debugging#debug-console-errors)

* [Debugging javascript](/azure/portal-sdk/portal-sdk/generated/top-extensions-debugging#debug-javascript)

* [Debugging knockout](/azure/portal-sdk/portal-sdk/generated/top-extensions-debugging#debug-knockout)

* [Debugging the data stack](/azure/portal-sdk/portal-sdk/generated/top-extensions-debugging#debug-the-data-stack)

## Performance

* [Performance profiling](/azure/portal-sdk/portal-sdk/generated/top-extensions-performance)

## Testing

The Ibiza team provides limited testing support. Due to resource constraints the C# and Node.js frameworks are open source, so that partners can unblock themselves if the Ibiza team cannot make requested improvements as quickly as you might expect.

* [Unit testing support](/azure/portal-sdk/portal-sdk/generated/top-extensions-unit-test)

* [C# test framework (Open source)](/azure/portal-sdk/portal-sdk/generated/top-extensions-csharp-test-framework)

* [Node.js test framework (Open source)](/azure/portal-sdk/portal-sdk/generated/top-extensions-node-js-test-framework)

[Ask a test-related question on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-test)

## Telemetry and alerting

The Ibiza team collects standard telemetry for generic actions like blade opening and command execution. We also collect performance, reliability, and user feedback information that facilitates the operation of your extension. You can also write your own events by using the telemetry system. Ibiza supports alerting for common operations scenarios.

* [Portal telemetry overview](/azure/portal-sdk/portal-sdk/generated/top-telemetry)

* [Set up and verify telemetry logging from your extension](/azure/portal-sdk/portal-sdk/generated/top-telemetry#logging-telemetry)

* [Getting access to raw portal telemetry data](/azure/portal-sdk/portal-sdk/generated/top-telemetry#viewing-telemetry)

* [Consuming telemetry via pre-built Power BI dashboards](/azure/portal-sdk/portal-sdk/generated/top-telemetry#power-bi-reports)

* [Performance and reliability monitoring](/azure/portal-sdk/portal-sdk/generated/top-telemetry-alerting)

[Ask about telemetry on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-telemetry)

[Ask about performance and reliability on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-performance)

## Experimentation and flighting

It is common for teams to want to experiment with new capabilities. We offer  framework features that make this possible.

* [Flighting a new version of your extension in MPAC](/azure/portal-sdk/portal-sdk/generated/top-extensions-flighting)

* [Feature flags to enable or disable individual features within an environment](/azure/portal-sdk/portal-sdk/generated/top-extensions-flags)

## Localization and globalization

The Azure portal supports multiple languages and locales. You will need to localize your content.

* [Localization overview and supported languages](/azure/portal-sdk/portal-sdk/generated/top-extensions-localization-globalization)

* [Setting up localization for your extension](/azure/portal-sdk/portal-sdk/generated/top-extensions-localization-globalization#localizing-build)

* [Setting up localization for your gallery package](/azure/portal-sdk/portal-sdk/generated/top-extensions-localization-globalization#marketplace)

* [Testing localization with side-loading](/azure/portal-sdk/portal-sdk/generated/top-extensions-localization-globalization#testing-localization)

* [Formatting numbers, currencies and dates](/azure/portal-sdk/portal-sdk/generated/top-extensions-localization-globalization#formatting-numbers-currencies-and-dates)

[Ask about localization / globalization on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-localization-global)

## Accessibility

The Azure Portal strives to meet high accessibility standards to ensure the product is accessible to to users of all levels of ability. There is regular testing and a process with SLAs for getting issues addressed quickly.

* [Accessibility guidelines](/azure/portal-sdk/portal-sdk/generated/top-extensions-accessibility)

* [Accessibility testing and SLAs](/azure/portal-sdk/portal-sdk/generated/top-extensions-accessibility#accessibility-planning)

[Ask about accessibility on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-accessibility)

## Deploying your extension

Learn how to deploy your extension to the various clouds and environments.
* [Extension registration, environments, clouds and Ibiza team SLAs](/azure/portal-sdk/portal-sdk/generated/top-extensions-publishing)

* [Moving an extension from private preview to public preview to GA](/azure/portal-sdk/portal-sdk/generated/top-extensions-developmentPhases)

[Ask a deployment question on Stackoverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-deployment)

### Deployment using the Extension Hosting Service

The Ibiza team provides and operates a common Extension Hosting Service that makes it easy to get your bits into a globally distributed system without having to manage your own infrastructure.

* [Extension Hosting Service overview](/azure/portal-sdk/portal-sdk/generated/top-extensions-hosting-service)

* [Onboarding your extension to the Extension Hosting Service](/azure/portal-sdk/portal-sdk/generated/top-extensions-hosting-service#step-by-step-onboarding)

* [Registring your extension with the Extension Hosting Service](/azure/portal-sdk/portal-sdk/generated/top-extensions-hosting-service#step-9-registering-your-extension-with-the-hosting-service)

* [Deploying a new version of an extension](/azure/portal-sdk/portal-sdk/generated/top-extensions-hosting-service#deploying-a-new-version-of-an-extension)

* [Deploying your extension using Express V2 and the Extension Hosting Service](/azure/portal-sdk/portal-sdk/generated/top-extensions-hosting-service-ev2)

* [SLA for registering an extension with the Extension Hosting Service](/azure/portal-sdk/portal-sdk/generated/top-extensions-svc-lvl-agreements)

### Custom extension deployment infrastructure

You should strive to use the Extension Hosting Service. If for some reason this is not possible then [learn how to build a custom extension deployment infrastructure](/azure/portal-sdk/portal-sdk/generated/top-extensions-custom-deployment).

## Legacy features

These features are supported, but have had no recent investment. No additional investment is planned. There are modern capabilities that should be used instead if you are developing new features.

* [PDL-based programming](/azure/portal-sdk/portal-sdk/generated/top-legacy-blades-template-pdl)

* [Legacy parts](/azure/portal-sdk/portal-sdk/generated/top-legacy-parts)

* [Legacy data management feature](/azure/portal-sdk/portal-sdk/generated/top-legacy-data)

* [Controls in the MsPortalFx namespace](/azure/portal-sdk/portal-sdk/generated/top-extensions-samples-controls-deprecated)

* [EditScope](/azure/portal-sdk/portal-sdk/generated/top-legacy-editscopes)

# Marketplace/Gallery developer resources

1. [Gallery overview](/azure/portal-sdk/gallery-sdk/generated/index-gallery#gallery-overview)

1. [Gallery item specifications](/azure/portal-sdk/gallery-sdk/generated/index-gallery#gallery-item-specificiations)

1. [Gallery item metadata](/azure/portal-sdk/gallery-sdk/generated/index-gallery#gallery-item-metadata)

1. [Gallery item field to UI element mappings](/azure/portal-sdk/gallery-sdk/generated/index-gallery#gallery-item-field-to-ui-element-mappings)

1. [Gallery package development and debugging](/azure/portal-sdk/gallery-sdk/generated/index-gallery#gallery-package-development-and-debugging)

1. [Legacy OneBox development approach](/azure/portal-sdk/gallery-sdk/generated/index-gallery#legacy-onebox-development-approach)

1. [Using the "Add to Resource" blade](/azure/portal-sdk/gallery-sdk/generated/index-gallery#using-the-add-to-resource-blade)

1. [Your icon tile for the Azure store](/azure/portal-sdk/gallery-sdk/generated/index-gallery#your-icon-tile-for-the-azure-store)

1. [Developer tooling and productivity](/azure/portal-sdk/gallery-sdk/generated/index-gallery#developer-tooling-and-productivity)

1. [Gallery frequently asked questions](/azure/portal-sdk/gallery-sdk/generated/index-gallery#gallery-frequently-asked-questions)
