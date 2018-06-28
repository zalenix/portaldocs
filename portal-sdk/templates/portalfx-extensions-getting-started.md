# Setting up for Azure Portal Development

## Getting Started

The following procedure specifies how to set up a developer computer for Azure extension development.
   
1. Install the pre-requisites as documented in [top-extensions-install-software.md](top-extensions-install-software.md).

1. Build an empty extension, as specified in [portalfx-extensions-create-blank-procedure.md](portalfx-extensions-create-blank-procedure.md).

1. Build a Hello World extension, as specified in [portalfx-extensions-helloWorld.md](portalfx-extensions-helloWorld.md).

1. Samples are part of the downloaded SDK, and the  DOGFOOD (DF) environment displays working copies of the samples. Browse through the samples that are located at [top-extensions-samples.md](top-extensions-samples.md) to explore live examples of APIs.

For more information about key components of an extension, see [portalfx-extensions-key-components.md](portalfx-extensions-key-components.md).

For more information about building extensions with TypeScript decorators, watch the video that is located at [https://aka.ms/portalfx/typescriptdecorators](https://aka.ms/portalfx/typescriptdecorators).

## Develop the extension

1. Build the extension and sideload it for local testing. Sideloading allows the testing and debugging of the extension locally against any environment. This is the preferred method of testing. For more information about sideloading, see [top-extensions-sideloading.md](top-extensions-sideloading.md). 

1. Complete the development and unit testing of the extension. For more information on debugging, see [top-extensions-debugging.md](top-extensions-debugging.md) and [top-extensions-production-testing.md](top-extensions-production-testing.md).

1. Address the production-ready metrics criteria to meet previous to moving the extension to the next development phase. The production-ready metrics are located at [top-extensions-production-ready-metrics.md](top-extensions-production-ready-metrics.md).

1. Create configuration files for the extension as specified in [portalfx-extensions-configuration-overview.md](portalfx-extensions-configuration-overview.md).




# Extension Extensibility

One of the great things about the Azure portal is the ability for multiple services to blend together to form a cohesive user experience.  In many cases, extensions will want to share parts, share data, and kick off actions. There are a few examples where this is useful:

- The [Azure Websites](https://azure.microsoft.com/en-us/services/websites/) browse blade [includes a part](portalfx-extension-sharing-pde.md) from [Visual Studio Team Services](https://www.visualstudio.com/team-services) which sets up continuous deployment between a source code repository and a web site.

![alt-text](../media/portalfx-parts/part-sharing.png "Setting up continuous deployment with part sharing")

- After configuring continuous deployment, the Visual Studio Online extension informs the Azure Websites extension it is complete with an RPC callback.

To start learning more about parts, see [top-extensions-sharing-blades-and-parts](top-extensions-sharing-blades-and-parts). 


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

{"gitdown": "include-file", "file": "../templates/portalfx-extensions-faq-getting-started.md"}

{"gitdown": "include-file", "file": "../templates/portalfx-extensions-glossary-getting-started.md"}