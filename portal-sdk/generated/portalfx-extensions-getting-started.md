<a name="setting-up-for-azure-portal-development"></a>
# Setting up for Azure Portal Development

<a name="setting-up-for-azure-portal-development-getting-started"></a>
## Getting Started

The following procedure specifies how to set up a developer computer for Azure extension development.
   
1. Install the pre-requisites as documented in [top-extensions-install-software.md](top-extensions-install-software.md).

1. Build an empty extension, as specified in [portalfx-extensions-create-blank-procedure.md](portalfx-extensions-create-blank-procedure.md).

1. Build a Hello World extension, as specified in [portalfx-extensions-helloWorld.md](portalfx-extensions-helloWorld.md).

1. Samples are part of the downloaded SDK, and the  DOGFOOD (DF) environment displays working copies of the samples. Browse through the samples that are located at [top-extensions-samples.md](top-extensions-samples.md) to explore live examples of APIs.

For more information about key components of an extension, see [portalfx-extensions-key-components.md](portalfx-extensions-key-components.md).

For more information about building extensions with TypeScript decorators, watch the video that is located at [https://aka.ms/portalfx/typescriptdecorators](https://aka.ms/portalfx/typescriptdecorators).

<a name="setting-up-for-azure-portal-development-develop-the-extension"></a>
## Develop the extension

1. Build the extension and sideload it for local testing. Sideloading allows the testing and debugging of the extension locally against any environment. This is the preferred method of testing. For more information about sideloading, see [top-extensions-sideloading.md](top-extensions-sideloading.md). 

1. Complete the development and unit testing of the extension. For more information on debugging, see [top-extensions-debugging.md](top-extensions-debugging.md) and [top-extensions-production-testing.md](top-extensions-production-testing.md).

1. Address the production-ready metrics criteria to meet previous to moving the extension to the next development phase. The production-ready metrics are located at [top-extensions-production-ready-metrics.md](top-extensions-production-ready-metrics.md).

1. Create configuration files for the extension as specified in [portalfx-extensions-configuration-overview.md](portalfx-extensions-configuration-overview.md).




<a name="extension-extensibility"></a>
# Extension Extensibility

One of the great things about the Azure portal is the ability for multiple services to blend together to form a cohesive user experience.  In many cases, extensions will want to share parts, share data, and kick off actions. There are a few examples where this is useful:

- The [Azure Websites](https://azure.microsoft.com/en-us/services/websites/) browse blade [includes a part](portalfx-extension-sharing-pde.md) from [Visual Studio Team Services](https://www.visualstudio.com/team-services) which sets up continuous deployment between a source code repository and a web site.

![alt-text](../media/portalfx-parts/part-sharing.png "Setting up continuous deployment with part sharing")

- After configuring continuous deployment, the Visual Studio Online extension informs the Azure Websites extension it is complete with an RPC callback.

To start learning more about parts, see [top-extensions-sharing-blades-and-parts](top-extensions-sharing-blades-and-parts). 


<a name="extension-extensibility-deploy-the-extension"></a>
## Deploy the extension

1. Review the development phases that are located at [top-extensions-developmentPhases.md](top-extensions-developmentPhases.md) to understand how development is related to production-ready metrics criteria.

1. Review the environments that are specified in [portalfx-extensions-branches.md](portalfx-extensions-branches.md) to understand the environments in which the developer can test an extension.

1. Review the production-ready metrics that are specified in [top-extensions-production-ready-metrics.md](top-extensions-production-ready-metrics.md) to validate that the extension is ready for deployment.

1. When you are confident that the development of the extension is complete, execute the following process so that the specific work required for the Azure Fundamental tenets appears in Service360, as specified in [Azure Fundamentals](https://microsoft.sharepoint.com/teams/WAG/EngSys/Shared%20Documents/Argon/Azure%20Fundamentals%20Proposal/Azure%20Fundamentals%20Proposal.docx?d=wf5b821bc31c44042adb55ebf4d8b408d). 

    * Add the service to ServiceTree, which is located at [https://servicetree.msftcloudes.com](https://servicetree.msftcloudes.com)
    * Make the service be "Active" in ServiceTree
    * Complete metadata in ServiceTree to enable the automation for various Service360 Action Items
    * Complete the Action Items identified in Service360, which is located at [http://aka.ms/s360](http://aka.ms/s360)

1.  Request to deploy the extension to the Production environment, as specified in [top-extensions-publishing.md](top-extensions-publishing.md).

1. Integrate the extension into the Marketplace. 

    In the following images, each icon in the Azure Portal Marketplace is referred to as a Gallery item. Gallery items take the form of a file with the .azpkg extension. This is a  zip file which contains all assets for the gallery item: icons, screenshots, descriptions.

    ![alt-text](../media/portalfx-extensions-onboarding/azurePortalMarketPlace.png "Azure Portal Marketplace")

    * **PROD:** The Marketplace team accepts fully finished .azkpg files from your team and uploads them to Production to onboard the gallery package. Reach out to <a href="mailto:1store@microsoft.com?subject=Marketplace Onboarding Request&body=Hello, I would like to onboard the attached package to the production environment. The .azkpg package is named <packageName>. ">1store</a> with the zip file to have them install it.
    
    * **DOGFOOD:** Use AzureGallery.exe to upload items to DOGFOOD using the following command:

      ```AzureGallery.exe upload -p ..\path\to\package.azpkg -h [optional hide key]```

         In order to use the gallery loader, there are some values to set in the AzureGallery.exe.config file. For more information, see the Gallery Item Specifications document that is located at      [https://github.com/Azure/portaldocs/blob/master/gallery-sdk/generated/index-gallery.md#gallery-item-specificiations](https://github.com/Azure/portaldocs/blob/master/gallery-sdk/generated/index-gallery.md#gallery-item-specificiations).  

         For more dev/test scenarios, see [https://github.com/Azure/portaldocs/blob/master/gallery-sdk/generated/index-gallery.md#gallery-package-development-and-debugging-testing-in-production](https://github.com/Azure/portaldocs/blob/master/gallery-sdk/generated/index-gallery.md#gallery-package-development-and-debugging-testing-in-production).


 <!--TODO: Determine whether there  is a more direct way to make the following link:
    [/gallery-sdk/generated/gallery-items.md#Gallery Item Specificiations](/gallery-sdk/generated/gallery-items.md#gallery-item-specificiations) -->

    
 <!--TODO: Determine whether there  is a more direct way to make the following link:
    [/gallery-sdk/generated/index-gallery.md#gallery-package-development-and-debugging-testing-in-production](gallery-sdk/generated/index-gallery.md#gallery-package-development-and-debugging-testing-in-production)
    -->


<a name="extension-extensibility-frequently-asked-questions"></a>
## Frequently Asked Questions

   <!-- TODO:  FAQ Format is ###Link, ***title***, Description, Solution, 3 Asterisks -->

<a name="extension-extensibility-frequently-asked-questions-getting-started"></a>
### Getting Started

***Q: I want to create a new extension. How do I start?***

SOLUTION: To contribute an extension to the Portal, you can build an extension in its own source tree instead of cloning the a Portal repository.

You can write an extension by following the instructions in using the [portalfx-extensions-create-blank-procedure.md](portalfx-extensions-create-blank-procedure.md), deploy it to your own machine, and load it into the Portal at runtime.

When you are ready to register the extension in the preview or production environments, make sure you have the right environment as specified in  [top-extensions-developmentPhases.md](top-extensions-developmentPhases.md). Then publish it to the environment as specified in [top-extensions-publishing.md](top-extensions-publishing.md).

For more information about Portal architecture, see [top-extensions-architecture.md](top-extensions-architecture.md).

<a name="extension-extensibility-frequently-asked-questions-getting-help"></a>
### Getting Help

***Q: I'm stuck. Where can I find help?***

SOLUTION: There are a few ways to get help.

* Read the documentation located at [https://github.com/Azure/portaldocs/tree/master/portal-sdk/](https://github.com/Azure/portaldocs/tree/master/portal-sdk/).

* Read and experiment with the samples that are shipped with the SDK. They are located at `\My Documents\PortalSDK\FrameworkPortal\Extensions\SamplesExtension`   directory. If there is a working copy of the sample in the Dogfood environment, it is located at [http://aka.ms/portalfx/samples](http://aka.ms/portalfx/samples). Sections, tabs, and other controls can be found in the playground located at [https://aka.ms/portalfx/playground](https://aka.ms/portalfx/playground).

* Read the debugging guide located at [top-extensions-debugging.md](top-extensions-debugging.md).

* If you are unable to find an answer, reach out to the Ibiza team at  [Stackoverflow Ibiza](https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza).  For a list of topics and stackoverflow tags, see [portalfx-stackoverflow.md](portalfx-stackoverflow.md).


<a name="extension-extensibility-frequently-asked-questions-broswer-support"></a>
### Broswer Support

***Q: Which browsers are supported?***

SOLUTION: Currently the Portal supports the latest version of Edge, Firefox, Chrome, and Safari, and it also supports Internet Explorer Version 11.

<a name="extension-extensibility-frequently-asked-questions-blade-commands"></a>
### Blade Commands

***Q: How do I show different commands for a blade based on the parameters passed to that blade?***

SOLUTION:

This is not possible with PDL-based Commands, but is possible with TypeScript-based commands.
The **Toolbar** APIs allow an extension to call `commandBar.setItems([...])` to supply the list of commands at run-time. For more information, see `<dir>\Client\V1\Blades\Toolbar\Toolbar.pdl`, where  `<dir>` is the `SamplesExtension\Extension\` directory, based on where the samples were installed when the developer set up the SDK.



 
<a name="extension-extensibility-glossary"></a>
## Glossary

This section contains a glossary of terms and acronyms that are used in this document. For common computing terms, see [https://techterms.com/](https://techterms.com/). For common acronyms, see [https://www.acronymfinder.com](https://www.acronymfinder.com).

| Term              | Meaning |
| ---               | --- |
| Azure Portal SDK  | Software Development Kit for developing Azure Portal extensions. |
| CDN               | Content Delivery Network |
| IIS Express       | Internet Information Services. A Web server for hosting anything on the Web. |
| localhost         | A hostname that means this computer or this host.  |
| sideload          | The process of transferring data between two local devices, or between the development platform and the local host. Also side load, side-load. |  