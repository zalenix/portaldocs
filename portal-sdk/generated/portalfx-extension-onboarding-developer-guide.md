Please read this documentaiton, if you are looking for information on following scenarios:

1. Onboarding / Registering a new extension in the portal
2. Moving from legacy DIY deployment to Extension hosting service
3. Enable flighting in MPAC 
4. Performance Improvements : Manifest Caching
5. Performance Improvements : You have removed PCV1 and PCV2 Code from you extension
6. Updating the feedback email


**External Partners/ Third Party extension**

Please read the next section to understand the capabilties that Portal can provide for your extension through configuration.
    
You do not have access to repo, so please email us for any configuraiton changes: <a href="mailto:ibizafxpm@microsoft.com?subject=[Onboarding Request] Add &lt;Name&gt; extension to the portal&body=Extension name:  Company_[BrandOrSuite_]ProductOrComponent (e.g. Contoso_SomeSku_SomeProduct or Contoso_SomeProduct)%0A%0AURLs  (must adhere to pattern)%0APROD-- main.&lt;extension&gt;.ext.contoso.com%0A%0AContact info%0ABusiness Contacts:_________%0ADev leads: _________%0APROD on-call email: _________%0A">submit their request via email</a>.
    
**First Party extensions**

Once your service name is finalized, we recommend you to have your extension registered in all environments. 

It is important you read next section of the guide carefully as we rely on you manage your extension registration / configuration management in portal repository. 

Before we deep dive into how you can modify each attribute of configuration for above mentioned scenarios, lets understand the configuration:

Portal has a concept of extension configuration file that contains the configuration for all the extensions for a specific environment. For example, Extensions.Prod.json contains configuration for all extensions in Production.

<a name="understanding-the-extension-configuration-in-portal"></a>
## Understanding the extension configuration in Portal
   
This is typical configuraiton for an extension:

```json
{
     name: "Microsoft_Azure_Demo",
     uri: "//demo.hosting.portal.azure.net/demo",
     uriFormat: "//demo.hosting.portal.azure.net/demo/{0}",
     feedbackEmail: "azureux-demo@microsoft.com",
     disabled: true,
}
```
   
<a name="configuration"></a>
## Configuration

<a name="configuration-1-name"></a>
### >
<li>name:</li>
<

It is extension name that is specified in the Client\extension.pdl of your extension. 

Typically extension.pdl file looks like:
   
```xml
 <?xml version="1.0" encoding="utf-8" ?>
 <Definition xmlns="http://schemas.microsoft.com/aux/2013/pdl">
   <Extension Name="Microsoft_Azure_Demo" Version="1.0" EntryPointModulePath="Program"/>
 </Definition>
```

Extension names must use standard extension name format: `Company_BrandOrSuite_ProductOrComponent` (e.g. `Contoso_Azure_{extension}` or `Microsoft_Azure_{extension}`). 

If your extension is in preview mode then you also need to add the preview tag:

```
<Extension Name="Microsoft_Azure_Demo" Version="1.0" Preview="true" EntryPointModulePath="Program"/>
```

<a name="configuration-2-uri-uriformat"></a>
###  start="2">
<li>uri / uriFormat:</li>
<

Every extension can deploy one or more "stamps" based on their testing requirements. In Azure parlance, a "stamp" is an instance of a service in a region. 
The "main" stamp is used for production and is the only one that portal will be load by default. Additional stamps can be accessed using a URI format specified in extension config.
   
If you are using extension hosting service for deploying your extension, then the uri and uri format will look like:

```
 uri: "//demo.hosting.portal.azure.net/demo",
 uriFormat: "//demo.hosting.portal.azure.net/demo/{0}",
```

If you have not yet onboarded hosting service and your extension is  still using the old DIY deployment for deploying your extension, then the uri and uri format will look like:

```
 uri: "//main.demo.ext.azure.com",
 uriFormat: "//{0}.demo.ext.azure.com",
```

NOTE: Extension using legacy DIY URLs must use a standard CNAME pattern:
    
| Environment     | URL                                        |
|-----------------|--------------------------------------------|
| **DOGFOOD**     | df.{extension}.onecloud-ext.azure-test.net |
| **PROD**        | main.{extension}.ext.azure.com             |
| **BLACKFOREST** | main.{extension}.ext.microsoftazure.de     |
| **FAIRFAX**     | main.{extension}.ext.azure.us              |
| **MOONCAKE**    | main.{extension}.ext.azure.cn              |
   
   
**PROD** CNAME will be used for RC, MPAC, Preview and PROD environment.

Create **DOGFOOD/PROD** CNAMEs using [Microsoft's DNS](http://msinterface/form.aspx?ID=4260) (use any Azure property as the identity).

Create **National Cloud** CNAMEs using each cloud's process (search for "DNS" on their wiki pages for more info) 
- Fairfax
    - http://aka.ms/fairfax 
    - Open TFS item requesting adding a CNAME using the following template: [TFS request template](http://aka.ms/jnbgoi)
    - Example TFS request item of another hosting service extension: [Example](http://vstfrd:8080/Azure/Fairfax/_workitems#_a=edit&id=8798254&fullScreen=false)
- Blackforest
    - http://aka.ms/blackforest 
    - Open TFS item requesting adding a CNAME using the following template: [TFS request template](http://aka.ms/Cf2ciz)
    - Example TFS request item of another hosting service extension: [Example](http://vstfrd:8080/Azure/BlackForest/_workItems#id=8798256&fullScreen=false&_a=edit)
- Mooncake
    - http://aka.ms/mooncake
    - Follow the information on this page: [Creating CName/DNS Entry in Mooncake](http://sharepoint/sites/CIS/waps/WAPO/Creating%20CName%20DNS%20Entry%20in%20Mooncake.aspx)
    - Example TFS request item of another hosting service extension: [Example](http://vstfrd:8080/Azure/Mooncake/_workitems#_a=edit&id=8798258&fullScreen=false)


Since hosting service provides mechanism for extensions to deploy using safe deployment practice, portal will load the version of your extension based on the region from where the customer is accessing the portal. For more details please refer to the [Hosting Service documentation](portalfx-extension-hosting-service.md).

If you are using Legacy DIY deploment registeration format then the portal will always serve the stamp that is registered in uri. In our examples mentioned above, the portal will always serve main stamp of the extension.

To use a secondary, test stamp, specify the feature.canmodifystamps flag in addition to a parameter matching the name of your extension as registered in the portal. For instance, https://portal.azure.com?feature.canmodifystamps=true&Microsoft_Azure_Demo=perf 
would replace the {0} in the uriFormat string with perf and attempt to load the extension from there (making the extension URL https://perf.demo.ext.azure.com). Note that you must specify the flag feature.canmodifystamps=true in order to override the stamp.
   
<a name="configuration-3-feedbackemail"></a>
###  start="3">
<li>feedbackEmail:</li>
<

This is the email id where you you want all the feedback should be sent.

<a name="configuration-4-cacheability"></a>
###  start="4">
<li>Cacheability:</li>
<

If you are using hosting service, then you **don't need to worry** about this attribute. The default value of `cacheability` is `manifest`. 

```
cacheability: "manifest",
```
   
If you using the legacy DIY deployment, then you will need to do some work before you can set the cacheability to manifest or your extension will slow down the performance of Azure Portal.
Please read about [Client-Side caching](https://aka.ms/cacheability) to improve the performance of your extension before setting the value to none.
NOTE: Setting cacheability to **manifest** is a pre-requisite for Public Preview / GA. 

<a name="configuration-5-disabled"></a>
###  start="5">
<li>disabled:</li>
<
   
All extensions are registered as disabled i.e. they are in hidden mode. This is useful if you are not yet ready to host your extension for Public preview / GA.
Most partners use this capabiltiy to either test the extension or host it for private preview.

To temporarily enable a disabled extension (for your session only), add an extension override in the portal URL: https://portal.azure.com?Microsoft_Azure_Demo=true (where Microsoft_Azure_Demo is the name of the extension as registered with the portal). Conversely, you can temporarily disable an extension by setting it to false.

<a name="understanding-which-extension-configuration-to-modify"></a>
## Understanding which extension configuration to modify

Azure portal has 5 different extension configuration files to manage the extension configuration.

Here is a table that explains mapping of portal environment to extension configuration in portal repository:
   
| Environment     | URL                                               | Configuration File                                                                                                                                                               |
|-----------------|---------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|                 |                                                   | (in portal repo)                                                                                                                                                                 |
| **DOGFOOD**     | `df.{extension}.onecloud-ext.azure-test.net`      | [Extensions.dogfood.json](https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx?path=%2FRDPackages%2FOneCloud%2FExtensions.dogfood.json&version=GBdev&_a=contents) |
| **RC**          | `rc.{extension}.onecloud-ext.azure-test.net`      | [Extensions.prod.json](https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx?path=%2FRDPackages%2FOneCloud%2FExtensions.prod.json&version=GBdev&_a=contents) |                                                                                                                                                                                 |
| **MPAC**        | `ms.{extension}.onecloud-ext.azure-test.net`      | [Extensions.prod.json](https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx?path=%2FRDPackages%2FOneCloud%2FExtensions.prod.json&version=GBdev&_a=contents) |                                                                                                                                                                                |
| **Preview**     | `preview.{extension}.onecloud-ext.azure-test.net` | [Extensions.prod.json](https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx?path=%2FRDPackages%2FOneCloud%2FExtensions.prod.json&version=GBdev&_a=contents) |
| **PROD**        | `main.{extension}.ext.azure.com`                  | [Extensions.prod.json](https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx?path=%2FRDPackages%2FOneCloud%2FExtensions.prod.json&version=GBdev&_a=contents) |                                                                                                                                                                                 |
| **BLACKFOREST** | `main.{extension}.ext.microsoftazure.de`          | [Extensions.bf.json](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2FRDPackages%2FOneCloud%2FExtensions.bf.json&version=GBdev&_a=contents)                    |
| **FAIRFAX**     | `main.{extension}.ext.azure.us`                   | [Extensions.ff.json](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2FRDPackages%2FOneCloud%2FExtensions.ff.json&version=GBdev&_a=contents)                    |
| **MOONCAKE**    | `main.{extension}.ext.azure.cn`                   | [Extensions.mc.json](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2FRDPackages%2FOneCloud%2FExtensions.mc.json&version=GBdev&_a=contents)                    |


**NOTE** The RC, MPAC, Preview, and PROD environments all share the same `Extensions.prod.json` file for configuration; therefore you can only have one entry for your extension across all these environments.
The above table implies that to manage extension configuraiton in Dogfood, BlackForest, FairFax and MoonCake the extension developer will need to send the pull request for modifying Extensions.test.json, Extensions.bf.json, Extensions.ff.json and Extensions.mc.json.

<a name="understanding-scenarios-for-config-change"></a>
## Understanding scenarios for config change

<a name="understanding-scenarios-for-config-change-1-onboarding-registering-a-new-extension-in-the-portal-or-onboarding-registering-existing-extension-to-a-new-environment-in-the-portal"></a>
### >
<li>Onboarding / Registering a new extension in the portal (or Onboarding / Registering existing extension to a new environment in the portal)</li>
<
   
All new extensions should always be added to the portal configuration in disabled mode. Here is a sample pull request for registering a Scheduler extension in FairFax:
https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx/commit/459608f61d5c36864affafe6eb9d230655f67a29?refName=refs%2Fheads%2Fdev
   
<a name="understanding-scenarios-for-config-change-2-enabling-an-extension-in-the-portal"></a>
###  start="2">
<li>Enabling an extension in the portal</li>
<
   
Your extension can only be enabled in production once all exit criteria have been met.
Once you have recieved sign-off from all the stakeholder mentioned in exit criteria, please attach the email with workitem that you will use for sending pull request.
    
Enabling an extension requires two changes:
    
1. To enable the extension just remove the disables boolean attribute from the config. 
2. Update the enabled extension count in test

Here is a sample pull request for enabling HDInsight extension in Mooncake:
https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx/commit/062ccb2ed5c5a8a086877e2d61dd6009242f17fc?refName=refs%2Fheads%2Fdev
    

<a name="understanding-scenarios-for-config-change-3-moving-from-diy-deployment-to-extension-hosting-service"></a>
###  start="3">
<li>Moving from DIY deployment to Extension hosting service</li>
<

If your extension is migrating from DIY deploment to hosting service, we recommend using the following path to minimize the probability of regression.
    

<a name="understanding-scenarios-for-config-change-3-moving-from-diy-deployment-to-extension-hosting-service-1-change-the-uri-format-to-use-hosting-service-prod"></a>
#### >
<li>Change the uri format to use hosting service (PROD):</li>
<

Here is a sample pull request for modifying the uriFormat:
https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx/commit/c22b81463cab1d0c6b2c1abc803bc25fb2836aad?refName=refs%2Fheads%2Fdev

<a name="understanding-scenarios-for-config-change-3-moving-from-diy-deployment-to-extension-hosting-service-2-flight-changes-in-mpac"></a>
####  start="2">
<li>Flight changes in MPAC:</li>
<

Here is a sample pull request for flighting extension in MPAC:
https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx/commit/be95cabcf7098c45927e3bb7aff9b5e0f65de341?refName=refs%2Fheads%2Fdev

<a name="understanding-scenarios-for-config-change-3-moving-from-diy-deployment-to-extension-hosting-service-3-enable-100-traffic-in-mpac-and-prod"></a>
####  start="3">
<li>Enable 100% traffic in MPAC and PROD:</li>
<

Here is a sample pull request that shows enabling 100% traffic without flighting for MicrosoftAzureClassicStorageExtension and 100% traffic with flighting for Microsoft_Azure_Storage:
https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx/commit/b81b415411f54ad83f93d43d37bcad097949a4e3?refName=refs%2Fheads%2Fdev&discussionId=-1&_a=summary&fullScreen=false


<a name="understanding-scenarios-for-config-change-3-moving-from-diy-deployment-to-extension-hosting-service-4-enable-flighting-in-mpac"></a>
####  start="4">
<li>Enable flighting in MPAC</li>
<

Portal provides the ability to flight the MPAC customers to multiple stamps. Portal will districute the traffic equally between all the registeres stamps.
    
    
In case of hosting service:

To flight traffic to multiple stamps, register other stamps in flightUri. For example in this case MPAC flight (friendly name) is used to flight traffic to another stamp

```
{
  name: "Microsoft_Azure_Demo",
  uri: "//demo.hosting.portal.azure.net/demo",
  uriFormat: "//demo.hosting.portal.azure.net/demo/{0}",
  feedbackEmail: "azureux-demo@microsoft.com",
  flightUris: [
      "//demo.hosting.portal.azure.net/demo/MPACFlight",
  ],
}
```

In case of legacy deploment:
```
{
  name: "Microsoft_Azure_Demo",
  uri: "//main.demo.ext.azure.com",
  uriFormat: "//{0}.demo.ext.azure.com",
  feedbackEmail: "azureux-demo@microsoft.com",
  flightUris: [
      "//flight.demo.ext.azure.com",
  ],
}
```
Here is a sample pull request: https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx/commit/be95cabcf7098c45927e3bb7aff9b5e0f65de341?refName=refs%2Fheads%2Fdev

<a name="understanding-scenarios-for-config-change-3-moving-from-diy-deployment-to-extension-hosting-service-5-performance-improvements-manifest-caching"></a>
####  start="5">
<li>Performance Improvements : Manifest Caching</li>
<

  Work In Progress

<a name="understanding-scenarios-for-config-change-3-moving-from-diy-deployment-to-extension-hosting-service-6-performance-improvements-you-have-removed-pcv1-and-pcv2-code-from-you-extension"></a>
####  start="6">
<li>Performance Improvements : You have removed PCV1 and PCV2 Code from you extension</li>
<

  Work In Progress

<a name="understanding-scenarios-for-config-change-3-moving-from-diy-deployment-to-extension-hosting-service-7-updating-the-feedback-email"></a>
####  start="7">
<li>Updating the feedback email</li>
<

  Work In Progress

<a name="how-to-send-the-pull-request"></a>
## How to send the pull request

Before creating a pull request, create workitem so that you can assosciate the workitem with the commit.
Create a workitem for assosciating your changes to the commit:  https://aka.ms/portalfx/config/update
By assosciating the workitem with commit, you will get a notification when the configuration changes are deployed to each environment.

Make sure you have access to make changes to the portal framework repository by joining the Azure Portal Partner Contributors, project group 19668, by using the following link [https://myaccess](https://myaccess).

Portal repository has 4 main branches i.e. dev, dogfood, mpac and production. ** All the pull requests should be sent for Dev branch.** 

- git clone https://msazure.visualstudio.com/DefaultCollection/One/_git/AzureUX-PortalFx
- cd AzureUX-PortalFx\
- init.cmd
- git checkout dev
- cd RDPackages\OneCloud
- Modify extension configuration
- if enabling an extension then you need to update the enabled extension test count in %ROOT%\src\StbPortal\Website.Server.Tests\DeploymentSettingsTests.cs
    - if you're setting the disabled property to false
    - `disabled=false`
- git add <Modified_Files>
- git commit -m "#123456 Add/ Enable the extension"
- git fetch
- git checkout -b myalias/myhotfix origin/dev
- git cherry-pick hotfixcommithashfrommpac
- git push origin myalias/myhotfix
- cd %ROOT%\src\
- buildall
- testconfig   // This command will test if all the test cases passed. If any of the test cases fails, please verify your config again

** To ensure that changes you have made are correct and will not cause any live-site issues, we strongly recommend you wait for Ibiza team to sign-off and complete the PR.**

<a name="sla-for-deploying-the-configuration-changes"></a>
## SLA for deploying the configuration changes

As per the safe dedployment mandate, all the configuration changes are treated as code change. This implies that all configuration changhes will go through the same deployment process as code change. 

All changes checked-in to dev branch will be deployed in following order:

Dogfood -> RC -> MPAC -> PROD -> National Clouds (BF, FF and MC).

| Environment     | SLA     |
|-----------------|---------|
| **DOGFOOD**     | 5 days  |
| **RC**          | 10 days |
| **MPAC**        | 15 days |
| **PROD**        | 20 days |
| **BLACKFOREST** | 1 month |
| **FAIRFAX**     | 1 month |
| **MOONCAKE**    | 1 month |

<a name="expediting-the-deployment-of-configuration-changes"></a>
## Expediting the deployment of configuration changes

In order to expedite the deployment of changes, you will need to send the pull request for each branch in portal repository i.e. MPAC and Production.

** All the pull requests should be sent for Dev branch. Once the Pull request is marked as complete then you can cherry-pick the same commit from dev branch and send the pull request for MPAC branch. 
Once the MPAC Pull request is marked complete then you can cherry-pick the same commit from MPAC branch and send the pull request for for production branch. **

If the pull request is not sent in the above specified order or the commit message is chanegd then it will lead to unit Test failure. In case of test failure your changes will be reverted without any notice.

SLA for changes that are in PROD branch is:

| Environment     | SLA     |
|-----------------|---------|
| **PROD**        | 7 days  |
| **BLACKFOREST** | 10 days |
| **FAIRFAX**     | 10 days |
| **MOONCAKE**    | 10 days |

The above specified SLA is to deploy configuration changes to all regions in Production Environment. 

As per the safe deployment mandate, deployment to production environment will be done in stage. Each stage is a logical grouping of regions. There are 5 stages in production environment.
And, there is 24 hour wait period between promoting the build from one batch to another. This implies that minimum time to deploy a change in all regions in Production branch is 5 days.

<a name="recieving-notification-when-changes-are-deployed"></a>
## Recieving Notification when changes are deployed

Since you have assosciated your commit with a workitem, you will recieve the notification when the config change that you have submitted is deployed to each region.

In case other people, in your team want to suscribe to these changes, please ask them to make a comment on the workitem. Once they have made a change they will start recieving the notifications.

<a name="making-your-extension-visible-enabled-in-portal-on-a-specific-time"></a>
## Making your extension visible / enabled in portal on a specific time

Extensions now have the capability to enable their extension based on their schedule for announcement. We recommend you start this process asap. Once you have all pre-requisites in place you will be able to enable your extension on a specific time.

Since you are reading this article to enable your extension at a specific time. It is safe to assume that your extension's config has disabled attribute set to true.

For this section of documentation, I will assume we want to enable Microsoft_Azure_DemoExtension at 9:00am on 10th October 2020.

```json
  {
      "name": "Microsoft_Azure_DemoExtension",
      "uri": "//demo.hosting.portal.azure.net/demo",
      "uriFormat": "//demo-ms.hosting.portal.azure.net/demo/{0}",
      "feedbackEmail": "myextension@microsoft.com",
      "disabled": true,
  }
```

1. In your extension's code, an AssetType PDL is declared that specifies the entry point for your extension in Browse Menu in Azure Portal.

A typical AssetType information in the extension looks like the following:

```xml
  <AssetType Name="DemoAsset"
             PartName="DemoPartViewModel"
             BladeName="DemoOverviewBlade"
             ViewModel="{ViewModel Name=DemoAssetTypeViewModel, Module=./Browse/ViewModels/DemoAssetTypeViewModel}"
             PluralDisplayName="{Resource Provisioning.Resource.plural, Module=ClientResources}"
             SingularDisplayName="{Resource Provisioning.Resource.singular, Module=ClientResources}"
             LowerPluralDisplayName="{Resource Provisioning.Resource.lowerPlural, Module=ClientResources}"
             LowerSingularDisplayName="{Resource Provisioning.Resource.lowerSingular, Module=ClientResources}"
             Icon="{Resource Content.SVG.DPS.dps, Module=../_generated/Svg}"
             MarketplaceItemId="Microsoft.Demo"
             UseResourceMenu="true">
    <Browse Type="ResourceType"/>
    <ResourceType ResourceTypeName="Microsoft.Demo/Demos" ApiVersion="2017-08-21" />
  </AssetType>
```

Update the **Browse** in AssetType to include Private="True". By adding this attribute your extension is specifying that this particular asset should never be visible in Browse Menu.

The updated PDL would look like following:

```xml
  <AssetType Name="DemoAsset"
             PartName="DemoPartViewModel"
             BladeName="DemoOverviewBlade"
             ViewModel="{ViewModel Name=DemoAssetTypeViewModel, Module=./Browse/ViewModels/DemoAssetTypeViewModel}"
             PluralDisplayName="{Resource Provisioning.Resource.plural, Module=ClientResources}"
             SingularDisplayName="{Resource Provisioning.Resource.singular, Module=ClientResources}"
             LowerPluralDisplayName="{Resource Provisioning.Resource.lowerPlural, Module=ClientResources}"
             LowerSingularDisplayName="{Resource Provisioning.Resource.lowerSingular, Module=ClientResources}"
             Icon="{Resource Content.SVG.DPS.dps, Module=../_generated/Svg}"
             MarketplaceItemId="Microsoft.Demo"
             UseResourceMenu="true">
    <Browse Type="ResourceType" Private="true"/>
    <ResourceType ResourceTypeName="Microsoft.Demo/Demos" ApiVersion="2017-08-21" />
  </AssetType>
```

1. Side-load and test your extension:

Add the following feature flag to the url for portal to show the resource in Browse Menu:

```
  ?feature.showassettypes=<ExtensionName>_<AssetName>
```

For example,
```
  ?feature.showassettypes=Microsoft_Azure_DemoExtension_DemoAsset
```

In case of Demo Extension, we can load the resource in Browse menu using side-loading url:

```
https://portal.azure.com/?feature.canmodifyextensions=true&feature.showassettypes=Microsoft_Azure_DemoExtension_DemoAsset#?testExtensions={"DemoExtension":"https://localhost:44300/"}
```

If you have multiple private assetTypes you canside-load all of them by providing a comma-seperated list.

1. Once you have tested your extension, deploy the updated code of your extension to all regions

1. Once the updated Code is deployed to all regions. Follow the instructions to [enable your extension](portalfx-extension-onboarding-developer-guide.md#2-enabling-an-extension-in-the-portal)

1.Please read the [SLA for deploying extension configuration changes](portalfx-extension-onboarding-developer-guide.md#sla-for-deploying-the-configuration-changes) and process to [expedite deploying the extension configuration changes](portalfx-extension-onboarding-developer-guide.md#expediting-the-deployment-of-configuration-changes)

1. You now have all the power to enable your extension based on your schedule. Whenever you are ready to launch the Public preview of your extension, just **remove** the following from the Browse of your extension's AssetType pdl:

```xml
Private="true"
``` 

1. After deploying the updated code to all regions you will see your extension in portal.

<a name="frequently-asked-questions"></a>
## Frequently asked questions

Use a wildcard SSL cert for each environment to simplify maintenance (e.g. `*.{extension}.onecloud-ext.azure-test.net` or `*.{extension}.ext.azure.com`). If your team is building separate, independent extensions, you can also use
`{extension}.{team}.ext.azure.com` and create a wildcard SSL cert for `*.{team}.ext.azure.com` to simplify overall management. Internal teams can create SSL certs for DF using [http://ssladmin](http://ssladmin). Production certs
must follow your organizations PROD cert process -- **do not use SSL Admin for production certs**.

**NOTE** : Registering an extension in Portal requires deployment so it can take almost 10 days. Please plan accordingly.

   
