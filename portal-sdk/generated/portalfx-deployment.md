
<a name="deployment"></a>
# Deployment

<a name="deployment-overview"></a>
## Overview

The Azure Portal uses a decentralized model of deployment that consists of several components that work together to provide the end-to-end experience.  Deploying an extension means that users can mange their experience by using servers that are geographically close to them, thereby reducing latency and improving the overall experience. 

The Portal is deployed continuously. On any day, multiple bug fixes, new features, and API changes may be deployed to production. When a new version of the Portal is deployed to production, the corresponding version of the SDK is automatically released to the download center located at [http://aka.ms/portalfx/downloads](http://aka.ms/portalfx/downloads). The download center contains the change log for releases, including bug fixes, new features, and a log of breaking changes.

The Portal architecture and configuration for one extension are described in the following image.

![alt-text](../media/portalfx-custom-extensions-deployment/deployment.png "Portal / Extension architecture")

The Portal is deployed to all public Azure regions as described in [http://azure.microsoft.com/regions](http://azure.microsoft.com/regions). It is load-balanced geographically by using the Azure Traffic Manager "Performance" profile. For more information about Azure Traffic Manager, see the Introduction located at [https://azure.microsoft.com/en-us/documentation/articles/traffic-manager-overview/](https://azure.microsoft.com/en-us/documentation/articles/traffic-manager-overview/).  Also see the Traffic Manager routing methods that are described  at [https://docs.microsoft.com/en-us/azure/traffic-manager/traffic-manager-routing-methods](https://docs.microsoft.com/en-us/azure/traffic-manager/traffic-manager-routing-methods). For more information about the Content Delivery Network, see  [https://azure.microsoft.com/en-us/documentation/articles/cdn-overview/](https://azure.microsoft.com/en-us/documentation/articles/cdn-overview/).
 
Extension components are  deployed to the following separate endpoints.

| Endpoint                     | Description                                                                              |
| ---------------------------- | ---------------------------------------------------------------------------------------- |
| Portal                       | The web application that hosts the shell                                                 |
| Extension                    | A web application that is loaded by the Portal                                           |
| Azure Resource Manager (ARM) | The public API for Azure that accepts calls from the Portal, Azure SDK, and command line |
| Resource providers           | Provides resource-specific APIs for management operations, like read, write, or delete   |
| Content Delivery Network     | Provides static images, scripts, and stylesheets                                         |

However, if your team wants to manage the user experience themselves, you may want more information about custom deployment of extensions, as described in  [top-extensions-custom-deployment.md](top-extensions-custom-deployment.md).

<a name="deployment-deploying-an-extension"></a>
## Deploying an extension

To deploy an extension, use the following steps.

1. Enable or disable extensions that are onboarding to Ibiza

	For more information about onboarding custom extensions to the Azure Portal, see [portalfx-extensions-configuration-overview.md](portalfx-extensions-configuration-overview.md).

	For more information about Gallery Item Hidekeys and the Azure Portal, see [top-extensions-flags.md#shell-feature-flags](top-extensions-flags.md#shell-feature-flags).

	To permanently enable an extension when it is ready for general use, please reach out to 
     <a href="mailto:ibizafxpm@microsoft.com?subject=Extension Ready for general use&body=Hello, I would like to permanently enable an extension.">the Portal team</a>.

1. Decide on the Extension "stamps"
	
	Every extension can deploy one or more "stamps" based on their testing requirements. The stamp is a combination of the version of the extension and the stage on which it will be located.  For more information about extension stamps, see [portalfx-extensions-configuration-overview.md#extension-stamps-and-safe-deployment](portalfx-extensions-configuration-overview.md#extension-stamps-and-safe-deployment) and [top-extensions-hosting-service-procedures.md#upload-safe-deployment-config](top-extensions-hosting-service-procedures.md#upload-safe-deployment-config).

1. Prepare for extension runtime compatibility

	Extensions do not need to be recompiled and redeployed with every release of the SDK. To upgrade an extension, the developer can download the latest version of the SDK, fix any breaking compile-time changes, and redeploy the extension.

	* For extensions that use SDK builds older than 5.0.302.258
	
	Extensions are guaranteed 90 days of runtime backward compatibility after deployment. This means that an extension that  is compiled against an  SDK that is older than 5.0.302.258  will be valid for 90 days. After that time, 	the extension must be upgraded to continue functioning in production.
	
	* For extensions that use SDK build 5.0.302.258 and more recent
	
	Extensions are guaranteed 120 days of runtime backward compatibility after deployment. This means that an extension that is compiled against the SDK build version 5.0.302.258, or more recent, will be valid for 120 days. After that time, the extension must be upgraded to continue functioning in production.

1.  Deploy the extension by using the Extension Hosting Service

	For more information, see [top-extensions-hosting-service.md](top-extensions-hosting-service.md).

1. Performance-tune the extension by deploying extension controllers to all regions

	Each extension is responsible for deploying their controllers and setting up load-balancing across whatever regions that it uses.

	We recommend that extensions deploy controllers broadly across all regions in an active-active configuration and use a technology, such as [Azure Traffic Manager](https://azure.microsoft.com/en-us/documentation/articles/traffic-manager-overview/)
	with a "Performance" profile, to direct the extension  to the server closest to the user. This will give users the best experience, especially if the extension communicates with an RP that is also deployed across regions. ARM is deployed in every region, therefore traffic for a user will stay entirely within one region, which reduces network latency.

<a name="deployment-deploying-an-extension-resiliency-and-failover"></a>
### Resiliency and failover

Having a presence in all geographic locations is important for extension performance. Extensions encounter much higher latencies and reliability issues when servers are not geo-located with their users. For more information, see [portalfx-performance-overview.md](portalfx-performance-overview.md).

It is best practice to set up servers in every region for your extensions. If the extension content is primarily static, and all of its controller access is performed by ARM by using  CORS, then a CDN should be included as part of your solution. However, if the CDN goes down, the increase in latency by falling back to a different server location may result in a negative impact to your users.

If your extension server uses controllers, there is some flexibility in how they are used. Typically,  messages across long distances suffer more from latency than throughput. For example, total network latency is not as noticeable for one long steady stream of data as it is for many small individual requests for status on many storage accounts. This is because the steady stream of data that is a file upload would be more of a "delay expected" moment that is infrequent, whereas the status messages are needed right away and very often. For file uploads, the extension would benefit from fewer servers that are strategically placed, but for messages, the extension benefits from working with more servers that are geolocated with your clients.

<!-- TODO:  add "hotfix" info here for when developers need to walk their code into the 4 environments instead of waiting for the automated processes.-->

