<a name="portal-extension-configuration"></a>
# Portal Extension Configuration

<!-- document headers are in the individual documents -->


The page you requested moved to [top-extensions-configuration.md](top-extensions-configuration.md).

<a name="portal-extension-configuration-process-details"></a>
## Process Details

To add an extension to the Portal, send a pull request, as specified in [top-extensions-publishing.md](top-extensions-publishing.md). 

To enable an extension, remove the `disabled` parameter from the json file that contains the description of the extension.

![alt-text](../media/portalfx-extensions-configuration/json-file.png "Updated Json File")

 The pull request allows you to compare the current file and the proposed proposed changes to ensure that the enabling of the extension is correct previous to creating the pull request, as in the following example.

![alt-text](../media/portalfx-extensions-configuration/json-comparison.png "Json File Comparison")

An example of a pull request that puts the extension immediately into the enabled state is located at [https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx/pullrequest/909233?_a=overview](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx/pullrequest/909233?_a=overview).

An example of a pull request that enables the `HDInsight` extension in the Mooncake environment and increases the extension test is located at [https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx/commit/062ccb2ed5c5a8a086877e2d61dd6009242f17fc?refName=refs%2Fheads%2Fdev](https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx/commit/062ccb2ed5c5a8a086877e2d61dd6009242f17fc?refName=refs%2Fheads%2Fdev).

The following is an example of a pull request for registering a `Scheduler` extension in the Fairfax environment.
[https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx/commit/459608f61d5c36864affafe6eb9d230655f67a29?refName=refs%2Fheads%2Fdev](https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx/commit/459608f61d5c36864affafe6eb9d230655f67a29?refName=refs%2Fheads%2Fdev).

<a name="portal-extension-configuration-process-details-service-level-agreements-for-deployment"></a>
### Service Level Agreements for deployment

As per the safe deployment mandate, all the configuration changes are treated as code changes. Consequently, they use similar deployment processes.

All changes that are checked in to the dev branch will be deployed in the following order: Dogfood -> RC -> MPAC -> PROD-> National Clouds (BlackForest, FairFax, and Mooncake). The table located at in [top-extensions-svc-lvl-agreements.md](top-extensions-svc-lvl-agreements.md) specifies the amount of time allowed to complete the deployment.

<a name="portal-extension-configuration-process-details-expediting-deployment"></a>
### Expediting deployment

To deploy expedited changes, developers can send a pull request for each branch in the Portal repository, i.e., Dogfood, MPAC and Production. How to send the pull request is specified in  [top-extensions-publishing.md](top-extensions-publishing.md).

Typically, all pull requests are for the Dev branch. When a pull request for an environment is marked as complete, the specified commit can be cherry-picked from that environment and included in a pull request for the next branch. The dev branch is followed by the **Dogfood** branch, which in turn is followed by the **MPAC** branch and finally the production branch.

If the pull request is not sent in the specified order, or if the commit message is changed, then unit test failure may occur. In this case, the changes that are associated with the extension will be reverted without notice.

The SLA for deploying configuration changes to all regions in the Production Environment is in the table specified in [top-extensions-svc-lvl-agreements.md](top-extensions-svc-lvl-agreements.md).

As per the safe deployment mandate, deployment to production environment is performed in stages, where each stage is a logical grouping of regions. There are five stages in the production environment. There is a 24-hour wait period between promoting the build from one batch to another. This implies that the minimum time to deploy a change in all regions in Production branch is five days. 

<a name="portal-extension-configuration-process-details-receiving-notifications-when-changes-are-deployed"></a>
### Receiving notifications when changes are deployed

After the commit has been associated with a workitem, the developer will receive a notification when the config change is deployed to each region.

When the development team wants to subscribe to these changes, ask them to make a comment on the workitem. After they have made changes, they will start receiving the notifications.

<a name="portal-extension-configuration-frequently-asked-questions"></a>
## Frequently asked questions

<a name="portal-extension-configuration-frequently-asked-questions-ssl-certs"></a>
### SSL certs

***How do I use SSL certs?***

Instructions are located at [portalfx-extensions-faq-debugging.md#sslCerts](portalfx-extensions-faq-debugging.md#sslCerts).

* * *

<a name="portal-extension-configuration-frequently-asked-questions-loading-different-versions-of-an-extension"></a>
### Loading different versions of an extension

***How do I load different versions of an extension?***

Understanding which extension configuration to modify is located at [portalfx-extensions-configuration-overview.md#understanding-which-extension-configuration-to-modify](portalfx-extensions-configuration-overview.md#understanding-which-extension-configuration-to-modify).




<a name="portal-extension-configuration-glossary"></a>
## Glossary

This section contains a glossary of terms and acronyms that are used in this document. For common computing terms, see [https://techterms.com/](https://techterms.com/). For common acronyms, see [https://www.acronymfinder.com](https://www.acronymfinder.com).

<!-- TODO:  Determine the difference between a branch, a region, and an environment. If they are not  completely interchangeable, then we can standardize usage. -->

| Term                     | Meaning |
| ---                      | --- |
| BF                       | Black Forest |
| branch | A collection of code in a content management system. |
| branch | The five Azure environments  in which extensions are run.  They are: Blackforest, Dogfood, FairFax, Mooncake, and the Production Release Candidate(s). |
| build verification test  | A subset of regression testing, this is a set of non-exhaustive tests that verify whether the most important application functions work. Its results are used to determine whether a build is stable enough to proceed with further testing. |
| BVT                      | Build Verification Test |
| cherry-pick              | Apply the changes introduced by an existing GitHub commit. |
| CDN                      | Content Delivery Network |
| CNAME                    | Canonical Name record. A type of resource record in the Domain Name System (DNS) that specifies that a domain name is an alias for another domain (the 'canonical' domain). | 
| DF                       | Dogfood |
| DIY                      | Do It Yourself |
| environment              | A configuration of computers in which extensions can be run. For example, environments are Blackforest, Dogfood, Mooncake, and Production.  | 
| feature flag             | A switch that allows a user to turn on or off specific functionalities of an extension. Flags are  passed from the Portal to extensions and their controllers, and are used as an alternative to maintaining multiple source-code branches in order to hide, enable or disable a feature during run time. Most, but not all, feature flags are made available by using the syntax `feature.<featureName> = true`.   |
| FF                       | Fairfax |
| flighting                | The process of directing Internet traffic to various editions of an extension, as specified by stamps that represent different stages or regions, or by friendly names. |
| GA                       | Global Availability |
| iframe                   | An inline frame, used to embed another document within the current HTML document. |
| MC                       | Mooncake |
| MPAC                     | ms.portal.azure.com, the Azure Portal instance for internal Microsoft customers.  | 
| PCV1                     | Parameter Collector V1 |
| PCV2                     | Parameter Collector V2 |
| PDL                      | Program Design Language |
| preview                  | The development phase that is used by the developer and a small audience to validate the functionality of an extension. |
| PROD                     | Production |
| region                   | The area in the world that that is served by a specific localization site. | 
| RC                       | Release Candidate environment, used to deploy daily builds of the Azure Portal. There is no user traffic in this environment. |
| RP                       | Resource Provider |
| SLA                      | Service Level Agreement |
| smoke test               | see build verification test  |
| SSL                      | Secure Socket Layer |
| stakeholder              | A person, group or organization that has interest or concern in an organization. Stakeholders can affect or be affected by the organization's actions, objectives and policies. |
| stamp                    | An instance of a service in a region. Every extension can deploy one or more extension editions based on testing requirements. The main extension is used for production and is the only one that the Portal will load by default. Also known as configuration or configuration file.   | 
| URI                      | Universal Resource Identifier  | 
| URL                      | Uniform Resource Locator |


  