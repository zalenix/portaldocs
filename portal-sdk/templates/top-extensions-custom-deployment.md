
## Custom extension deployment infrastructure

Developers that intend to deploy extensions by using legacy or Do-It-Yourself (DIY) deployments need to be aware that they are responsible for the following.
1. Deploying to all regions
1. Deploying the service to every new data center
1. Infrastructure tasks such as MDS setup, upgrade, Security pack upgrade and other tasks
1. If you are planning to use CDN to serve the extension UI and the CDN goes down, the fallback will be not be pleasing to your users.
1. Setting up persistent storage so that users do not see reliability drops during extension deployment
1. Setting up the infrastructure to rollback if there are live-site issues
1. Signing up for on-call and live site rotations for deployment infrastructure.
1. Developers are also responsible for deploying both the UI and the controller, in addition to setting up load-balancing across the appropriate regions for each extension.

<!--TODO:  Determine which Ibiza team is best represented by the word "we". -->
We recommend that extensions use a CDN, such as Azure CDN, to move the most commonly-downloaded resources as close as possible to the end user. 
Typically, it is best to set up servers in every region, although there is some flexibility. If the extension content is primarily static and all of its controller access is conducted by ARM by using CORS, then CDN works well.  However, when the CDN goes down, then the fallback will be not pleasing to your users.

We also recommend that extensions deploy broadly across all regions in an active-active configuration and use a technology with a "Performance" profile, such as the Azure Traffic Manager that is located at [https://azure.microsoft.com/en-us/documentation/articles/traffic-manager-overview](https://azure.microsoft.com/en-us/documentation/articles/traffic-manager-overview), to direct the user to the server closest to them. This will give users the best experience, especially if the extension communicates with a resource provider that is also deployed broadly across regions. Because ARM is deployed in every region, that traffic for a user will stay entirely within one region, therefore reducing latency.

For more information about using Azure CDN with extensions, see [portalfx-cdn.md#configuring-your-extension](portalfx-cdn.md#configuring-your-extension).

<!--
gitdown": "include-file", "file": "../templates/portalfx-extensions-glossary-custom-deployment.md"}
-->