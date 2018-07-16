# Setting up for Azure Portal Development

## Get started

The following procedure specifies how to set up a developer computer for Azure extension development.
   
1. Install the pre-requisites as documented in [top-extensions-install-software.md](top-extensions-install-software.md).

1. Build an empty extension, as specified in [portalfx-extensions-create-first-extension.md](portalfx-extensions-create-first-extension.md).

1. Build a Hello World extension, as specified in [portalfx-extensions-create-first-extension.md](portalfx-extensions-create-first-extension.md).

1. Samples are part of the downloaded SDK, and the  DOGFOOD (DF) environment displays working copies of the samples. Browse through the samples that are located at [top-extensions-samples.md](top-extensions-samples.md) to explore live examples of APIs.

For more information about key components of an extension, see [portalfx-extensions-key-components.md](portalfx-extensions-key-components.md).

For more information about building extensions with TypeScript decorators, watch the video that is located at [https://aka.ms/portalfx/typescriptdecorators](https://aka.ms/portalfx/typescriptdecorators).

## Develop the extension

1. Build the extension and sideload it for local testing. Sideloading allows the testing and debugging of the extension locally against any environment. This is the preferred method of testing. For more information about sideloading, see [top-extensions-sideloading.md](top-extensions-sideloading.md). 

1. Complete the development and unit testing of the extension. For more information on debugging, see [top-extensions-debugging.md](top-extensions-debugging.md) and [top-extensions-sideloading.md](top-extensions-sideloading.md).

1. Address the production-ready metrics criteria to meet previous to moving the extension to the next development phase. The production-ready metrics are located at [top-extensions-production-ready-metrics.md](top-extensions-production-ready-metrics.md).

1. Create configuration files for the extension as specified in [portalfx-extensions-configuration-overview.md](portalfx-extensions-configuration-overview.md).

## Exploit extensibility

One of the great things about the Azure portal is the ability for multiple services to blend together to form a cohesive user experience.  In many cases, extensions will want to share parts, share data, and kick off actions. There are a few examples where this is useful:

- The [Azure Websites](https://azure.microsoft.com/en-us/services/websites/) browse blade includes a part from [Visual Studio Team Services](https://www.visualstudio.com/team-services), as specified in [top-extensions-sharing-blades-and-parts.md](top-extensions-sharing-blades-and-parts.md), which sets up continuous deployment between a source code repository and a web site.

![alt-text](../media/portalfx-parts/part-sharing.png "Setting up continuous deployment with part sharing")

- After configuring continuous deployment, the Visual Studio Online extension informs the Azure Websites extension it is complete with an RPC callback.

To start learning more about parts, see [top-extensions-sharing-blades-and-parts.md](top-extensions-sharing-blades-and-parts.md). 

## Maintain development environment

Developers need to keep their development environments current while they are implementing extensions.  They should occasionally revisit the software that was installed as specified in [top-extensions-install-software.md](top-extensions-install-software.md) to ensure that their development platforms use the most recent software that is compatible with Azure Development.  For example, [http://aka.ms/portalfx/downloads](http://aka.ms/portalfx/downloads) specifies the most recent edition of the Azure Portal SDK.


 <!--TODO: Determine whether there  is a more direct way to make the following link:
    [/gallery-sdk/generated/gallery-items.md#Gallery Item Specificiations](/gallery-sdk/generated/gallery-items.md#gallery-item-specificiations) -->

    
 <!--TODO: Determine whether there  is a more direct way to make the following link:
    [/gallery-sdk/generated/index-gallery.md#gallery-package-development-and-debugging-testing-in-production](gallery-sdk/generated/index-gallery.md#gallery-package-development-and-debugging-testing-in-production)
    -->

{"gitdown": "include-file", "file": "../templates/portalfx-extensions-faq-getting-started.md"}

<!--
gitdown": "include-file", "file": "../templates/portalfx-extensions-glossary-getting-started.md"}
-->