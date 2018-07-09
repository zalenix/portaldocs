
# Deployment

## Overview

The Azure Portal uses a decentralized model of deployment that consists of several components that work together to provide the end-to-end experience. Having a presence in all geographic locations improves performance by allowing extensions to use servers that are geographically close to the users, thereby reducing latency and improving the overall experience. Extensions encounter much higher latencies and reliability issues when servers are not geo-located with their users. For more information, see [portalfx-performance-overview.md](portalfx-performance-overview.md).

On any day, multiple bug fixes, new features, and API changes may be deployed to the Portal production environment. When a new version of the Portal, the corresponding version of the SDK is automatically released to the Download Center located at [http://aka.ms/portalfx/downloads](http://aka.ms/portalfx/downloads). It also contains the change log for releases and a log of breaking changes.

The Portal architecture and configuration for one extension are described in the following image.

![alt-text](../media/portalfx-custom-extensions-deployment/deployment.png "Portal / Extension architecture")

The Portal is deployed to all public Azure regions as described in [http://azure.microsoft.com/regions](http://azure.microsoft.com/regions).
 
## Deploy the extension

When you developed an extension, you may have used the procedures specified in 
[top-extensions-getting-started.md](top-extensions-getting-started.md) and [top-extensions-getting-started.md#develop-the-extension](top-extensions-getting-started.md#develop-the-extension). When you feel that you are ready to deploy the extension, you should doublecheck against the following list to ensure that none of the coordination and development steps have been omitted.

1. Review the development phases that are located at [top-extensions-developmentPhases.md](top-extensions-developmentPhases.md) to understand how development is related to production-ready metrics criteria.

1. Review the environments that are specified in [portalfx-extensions-branches.md](portalfx-extensions-branches.md) to understand the environments in which the developer can test an extension.

1. Review the production-ready metrics that are specified in [top-extensions-production-ready-metrics.md](top-extensions-production-ready-metrics.md) to validate that the extension is ready for deployment.

1. Prepare for extension runtime compatibility

	* For extensions that use SDK builds older than 5.0.302.258

	Extensions are guaranteed 90 days of runtime backward compatibility after deployment. This means that an extension that  is compiled against an  SDK that is older than 5.0.302.258  will be valid for 90 days. After that time, 	the extension must be upgraded to continue functioning in production.

	* For extensions that use SDK build 5.0.302.258 and more recent
	
	Extensions are guaranteed 120 days of runtime backward compatibility after deployment. This means that an extension that is compiled against the SDK build version 5.0.302.258, or more recent, will be valid for 120 days. After that time, the extension must be upgraded to continue functioning in production.

1. Execute the following process so that the specific work required for the Azure Fundamental tenets appears in Service360, as specified in [Azure Fundamentals](https://microsoft.sharepoint.com/teams/WAG/EngSys/Shared%20Documents/Argon/Azure%20Fundamentals%20Proposal/Azure%20Fundamentals%20Proposal.docx?d=wf5b821bc31c44042adb55ebf4d8b408d). 

    * Add the service to ServiceTree, which is located at [https://servicetree.msftcloudes.com](https://servicetree.msftcloudes.com)

    * Make the service be "Active" in ServiceTree

    * Complete metadata in ServiceTree to enable the automation for various Service360 Action Items

    * Complete the Action Items identified in Service360, which is located at [http://aka.ms/s360](http://aka.ms/s360)

1. Make the extension ready for the Extension Hosting Service, as specified in [top-extensions-hosting-service.md](top-extensions-hosting-service.md).

1. Request to deploy the extension to the Production environment, as specified in [top-extensions-publishing.md](top-extensions-publishing.md).

1. Integrate the extension into the Marketplace. 

    In the following images, each icon in the Azure Portal Marketplace is referred to as a Gallery item. Gallery items take the form of a file with the .azpkg extension. This is a  zip file which contains all assets for the gallery item: icons, screenshots, descriptions.

    ![alt-text](../media/portalfx-extensions-onboarding/azurePortalMarketPlace.png "Azure Portal Marketplace")

    * **PROD:** The Marketplace team accepts fully finished .azkpg files from your team and uploads them to Production to onboard the gallery package. Reach out to <a href="mailto:1store@microsoft.com?subject=Marketplace Onboarding Request&body=Hello, I would like to onboard the attached package to the production environment. The .azkpg package is named <packageName>. ">1store</a> with the zip file to have them install it.
    
    * **DOGFOOD:** Use AzureGallery.exe to upload items to DOGFOOD using the following command:

      ```AzureGallery.exe upload -p ..\path\to\package.azpkg -h [optional hide key]```

         In order to use the gallery loader, there are some values to set in the AzureGallery.exe.config file. For more information, see the Gallery Item Specifications document that is located at      [https://github.com/Azure/portaldocs/blob/master/gallery-sdk/generated/index-gallery.md#gallery-item-specificiations](https://github.com/Azure/portaldocs/blob/master/gallery-sdk/generated/index-gallery.md#gallery-item-specificiations).  

         For more dev/test scenarios, see [https://github.com/Azure/portaldocs/blob/master/gallery-sdk/generated/index-gallery.md#gallery-package-development-and-debugging-testing-in-production](https://github.com/Azure/portaldocs/blob/master/gallery-sdk/generated/index-gallery.md#gallery-package-development-and-debugging-testing-in-production).

1. Performance-tune extension extension controllers to all regions

	Each extension is responsible for deploying its controllers and setting up load-balancing across the regions in which it is deployed. Extensions should deploy controllers across all regions in an active-active configuration and use a technology to direct extension traffic to the servers that are closest to the user. For example, the Traffic Manager that is described at  [http://aka.ms/portalfx/trafficmanager](http://aka.ms/portalfx/trafficmanager) relies on configuration profiles to determine the best route for global traffic for your extension.  Deploying an extension with a "Performance" profile as specified in [http://aka.ms/portalfx/trafficmanagerrouting](http://aka.ms/portalfx/trafficmanagerrouting) will give users the best experience, especially if the extension communicates with an RP that is also deployed across regions.
	 
	**NOTE**: ARM is deployed in every region, which reduces network latency by containing traffic for a user entirely within one region. 

 	For more information about the Content Delivery Network, see  [http://aka.ms/portalfx/cdnoverview/](http://aka.ms/portalfx/cdnoverview).

	For more information about Gallery Item Hidekeys and the Azure Portal, see [top-extensions-flags.md#shell-feature-flags](top-extensions-flags.md#shell-feature-flags).

### Resiliency and failover

A Content Delivery Network (CDN) should be included as part of your solution when  extension content is primarily static, and all of its controller access is performed by ARM by using CORS.  However, if the CDN goes down, the increase in latency by falling back to a different server location may result in a negative impact to your users.

If your extension server uses controllers, there is some flexibility in how they are used. Typically,  messages across long distances suffer more from latency than throughput. For example, total network latency is not as noticeable for one long steady stream of data as it is for many small individual requests for status on many storage accounts. This is because the steady stream of data that is a file upload would be more of a "delay expected" moment that is infrequent, whereas the status messages are needed right away and very often. Consequently, for file uploads, the extension would benefit from fewer servers that are strategically placed, but for messages, the extension benefits from working with more servers that are geolocated with your clients.

<!-- TODO:  add "hotfix" info here for when developers need to walk their code into the 4 environments instead of waiting for the automated processes.-->