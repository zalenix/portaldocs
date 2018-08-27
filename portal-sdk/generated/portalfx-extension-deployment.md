<a name="deploy"></a>
# Deploy
* [Deploy](#deploy)
    * [Overview](#deploy-overview)
        * [Portal](#deploy-overview-portal)
        * [Portal deployment schedule](#deploy-overview-portal-deployment-schedule)
    * [Before deploying your extension](#deploy-before-deploying-your-extension)
        * [(1) For extensions onboarding Ibiza: Enable/disable extensions](#deploy-before-deploying-your-extension-1-for-extensions-onboarding-ibiza-enable-disable-extensions)
        * [(2) Extension "stamps"](#deploy-before-deploying-your-extension-2-extension-stamps)
        * [(3) Understand extension runtime compatibility](#deploy-before-deploying-your-extension-3-understand-extension-runtime-compatibility)
    * [Deploying extension UI](#deploy-deploying-extension-ui)
    * [Deploying extension controllers](#deploy-deploying-extension-controllers)
    * [Legacy/DIY deployments](#deploy-legacy-diy-deployments)
    * [Resiliency and failover](#deploy-resiliency-and-failover)
    * [Extension Hosting Service](#deploy-extension-hosting-service)
    * [Why use extension hosting service](#deploy-why-use-extension-hosting-service)
    * [30-sec Overview](#deploy-30-sec-overview)
        * [Prerequisites for onboarding hosting service for all extensions](#deploy-30-sec-overview-prerequisites-for-onboarding-hosting-service-for-all-extensions)
        * [Prerequisites for onboarding hosting service for extensions with server-side code (or Controllers)](#deploy-30-sec-overview-prerequisites-for-onboarding-hosting-service-for-extensions-with-server-side-code-or-controllers)
        * [Step-by-Step Onboarding](#deploy-30-sec-overview-step-by-step-onboarding)
        * [Other common scenarions](#deploy-30-sec-overview-other-common-scenarions)
        * [Deploying a new version of extension](#deploy-30-sec-overview-deploying-a-new-version-of-extension)
        * [Monitoring and Logging](#deploy-30-sec-overview-monitoring-and-logging)
        * [FAQ](#deploy-30-sec-overview-faq)
    * [Logging](#deploy-logging)
    * [Monitoring](#deploy-monitoring)
    * [National/sovereign clouds](#deploy-national-sovereign-clouds)
        * [Overview](#deploy-national-sovereign-clouds-overview)
    * [Per-cloud information](#deploy-per-cloud-information)
        * [Common gotchas](#deploy-per-cloud-information-common-gotchas)


<a name="deploy-overview"></a>
## Overview

The Azure Portal uses a decentralized model of deployment that consists of several components that work together to
provide the end-to-end experience, each deployed to separate endpoints:

- **Portal** \- web application that hosts the shell
- **Extensions** \- each extension is a web application that is loaded by the portal
- **ARM** \- public API for Azure that accepts calls from the portal, Azure SDK, and command line
- **Resource providers** \- provide resource-specific APIs for management operations (e.g. read, write, delete)

![Portal / Extension architecture][deployment-architecture]

<a name="deploy-overview-portal"></a>
### Portal

The portal is deployed to all [public Azure regions](http://azure.microsoft.com/regions) and uses geographical
load-balancing via Azure Traffic Manager (using the "Performance" profile).
(For more information about Azure Traffic Manager, see their
[introduction](https://azure.microsoft.com/en-us/documentation/articles/traffic-manager-overview/).)

Deploying in this fashion means that users can take advantage of a server closer to them, reducing latency and improving
the overall experience of using the portal.

The portal also takes advantage of the [Azure CDN](https://azure.microsoft.com/en-us/documentation/articles/cdn-overview/)
for static resources (images, scripts, etc.). This shifts the location of the most-downloaded files even closer to the user.

<a name="deploy-overview-portal-deployment-schedule"></a>
### Portal deployment schedule

The portal is deployed continuously. On any given day, multiple bug fixes, new features, and API changes may be deployed
to production. When a new version of the portal is deployed to production, the corresponding version of the SDK is
automatically released to the [download center](/portal-sdk/generated/downloads.md). The download center contains the change log for the given
release, including bug fixes, new features, and a log of breaking changes.

<a name="deploy-before-deploying-your-extension"></a>
## Before deploying your extension

1. For extensions onboarding Ibiza: Enable/disable extensions
1. Extension "stamps"
1. Understand extension runtime compatibility

<a name="deploy-before-deploying-your-extension-1-for-extensions-onboarding-ibiza-enable-disable-extensions"></a>
### (1) For extensions onboarding Ibiza: Enable/disable extensions

New extensions are disabled by default. This will hide the extension from users (it won't show up in the portal at all)
until it's ready for general use.

To temporarily enable a disabled extension (for your session only), add an extension override in the portal URL:
`https://portal.azure.com?Microsoft_Azure_DevTestLab=true` (where `Microsoft_Azure_DevTestLab` is the name of the
extension as registered with the portal). Conversely, you can temporarily disable an extension by setting it to `false`.

You can use temporary enablement in conjunction with a Gallery Item Hidekey (if you have one) to also temporarily show
your item in the "Create New" experience while your extension is enabled. Just combine the parameters. Following the
previous example, if your hidekey is `DevTestLabHidden`, then you can combine it with the above to produce a single URL
to enable both the extension and the Gallery item:
`https://portal.azure.com?Microsoft_Azure_DevTestLab=true&microsoft_azure_marketplace_ItemHideKey=DevTestLabHidden`.

To permanently enable an extension (e.g. if it's ready for general use), please contact the portal team.

<a name="deploy-before-deploying-your-extension-2-extension-stamps"></a>
### (2) Extension &quot;stamps&quot;

Every extension can deploy one or more "stamps" based on their testing requirements. In Azure parlance, a "stamp" is an
instance of a service in a region. The "main" stamp is used for production and is the only one the portal will be
configured for. Additional stamps can be accessed using a URI format specified in extension config.

For example, this might be an extension configuration:

```json
{
    name: "Microsoft_Azure_DevTestLab",
    uri: "//main.devtest.ext.azure.com",
    uriFormat: "//{0}.devtest.ext.azure.com"
}
```

When users go to the portal, it will load the `Microsoft_Azure_DevTestLab` extension from the URL
`https://main.devtest.ext.azure.com` (the portal always uses HTTPS).

To use a secondary, test stamp, specify the `feature.canmodifystamps` flag in addition to a parameter matching the name
of your extension as registered in the portal. For instance,
`https://portal.azure.com?feature.canmodifystamps=true&Microsoft_Azure_DevTestLab=perf` would replace the `{0}` in the
`uriFormat` string with `perf` and attempt to load the extension from there (making the extension URL
`https://perf.devtest.ext.azure.com`). Note that you must specify the flag `feature.canmodifystamps=true` in order to
override the stamp.

<a name="deploy-before-deploying-your-extension-3-understand-extension-runtime-compatibility"></a>
### (3) Understand extension runtime compatibility

Extensions do not need to be recompiled and redeployed with every release of the SDK.

**For SDK build 5.0.302.258 and later**
Extensions are guaranteed 120 days of *runtime* backward compatibility after deployment. This means that an extension
which is compiled against the build version 5.0.302.258 and later of the SDK will be valid for 120 days - at which point
the extension must be upgraded to continue functioning in production.

**For SDK build older than 5.0.302.258**
Extensions are guaranteed 90 days of *runtime* backward compatibility after deployment. This means that an extension
which is compiled against the build version older than 5.0.302.258 of the SDK will be valid for 90 days - at which point
the extension must be upgraded to continue functioning in production.

To upgrade an extension, the extension author must download the latest version of the SDK, fix any breaking compile-time
changes, and redeploy the extension.

<a name="deploy-deploying-extension-ui"></a>
## Deploying extension UI

[Deploying through Extension Hosting Service](portalfx-extension-hosting-service.md)

<a name="deploy-deploying-extension-controllers"></a>
## Deploying extension controllers

Each extension is responsible for deploying their controllers and setting up load-balancing across whatever regions
make sense.

We recommend that extensions deploy controllers broadly across all regions in an active-active configuration and use a
technology, such as [Azure Traffic Manager](https://azure.microsoft.com/en-us/documentation/articles/traffic-manager-overview/)
with a "Performance" profile, to direct the user to the server closest to them. This will give users the best
experience, especially if the extension communicates with an RP that is also deployed broadly across regions. (Since ARM
is deployed in every region, this means that that traffic for a user will stay entirely within one region, reducing
latency.)

<a name="deploy-legacy-diy-deployments"></a>
## Legacy/DIY deployments

If you choose to deploy extension UI through legacy / DIY deployments, make sure you understand that

1.	You will be responsible for deploying to all regions
1.	You will be responsible for deploying service to every new data center
1.	You will be responsible for MDS setup, upgrade, Security pack upgrade and other infrastructure tasks
1.	If you are planning to use CDN to serve extension UI then understand that when CDN goes down (and they do) then the fallback will be not pleasing to your users.
1.	You will be responsible for setting up Persistent storage so that users do not see reliability drop during extension deployment
1.	You will be responsible for setting up infrastructure to rollback in case of live-site issues
1.	You are signing up for on-call / live site rotation for deployment infrastructure.

Each extension is responsible for deploying both UI and Controllers as well as setting up load-balancing across whatever regions make sense.
In general, it is best to set up servers in every region. That said, there is some flexibility. If your content is primarily static and all of your controller access is ARM via CORS then CDN can work well. *** The caveat is that when the CDN goes down (and they do) then the fallback will be not pleasing to your users. ***

We recommend that extensions deploy  broadly across all regions in an active-active configuration and use a technology, such as [Azure Traffic Manager](https://azure.microsoft.com/en-us/documentation/articles/traffic-manager-overview/) with a "Performance" profile, to direct the user to the server closest to them. This will give users the best experience, especially if the extension communicates with an RP that is also deployed broadly across regions. (Since ARM is deployed in every region, this means that that traffic for a user will stay entirely within one region, reducing latency.)

We also recommend that extensions use a CDN, such as Azure CDN, to move the most commonly-downloaded resources as close to the end user as possible. For more information about using Azure CDN with extensions, see [Configuring CDN and understanding Extension Versioning](portalfx-cdn.md).

<a name="deploy-resiliency-and-failover"></a>
## Resiliency and failover

Having a presence in all geographies is important for good performance.
We see much higher latencies and reliability issues when servers are not geo-located with their users.
(For more tips, see the [performance page](portalfx-performance.md).)

In order to deploy to all regions:

1.	Use [Extension Hosting Service](portalfx-extension-hosting-service.md) to deploy UI
1.	Deploy Controllers to all regions

In general, it is best to set up servers in every region.
That said, there is some flexibility.
If your content is primarily static and all of your controller access is ARM via CORS then CDN can work well.
***The caveat is that when the CDN goes down (and they do) then the fallback will be not pleasing to your users.***

If you have controllers in your extension server, it depends on how they are used.
Usually messages across long distances suffer more from latency than throughput.
This means if you have a steady stream of data, such as uploading a file, the distance isn’t as noticeable as when you have lots of messages, such as individual calls to get status on lots of storage accounts.
In this example the upload step would be more of a "delay expected" moment that is infrequent where the status messages are needed right away and very often.
In the first case, you can probably get away with fewer servers, but in the second case geo-locating them will be very important.

[deployment-architecture]: ../media/portalfx-deployment/deployment.png

* [Deploy](#deploy)
    * [Overview](#deploy-overview)
        * [Portal](#deploy-overview-portal)
        * [Portal deployment schedule](#deploy-overview-portal-deployment-schedule)
    * [Before deploying your extension](#deploy-before-deploying-your-extension)
        * [(1) For extensions onboarding Ibiza: Enable/disable extensions](#deploy-before-deploying-your-extension-1-for-extensions-onboarding-ibiza-enable-disable-extensions)
        * [(2) Extension "stamps"](#deploy-before-deploying-your-extension-2-extension-stamps)
        * [(3) Understand extension runtime compatibility](#deploy-before-deploying-your-extension-3-understand-extension-runtime-compatibility)
    * [Deploying extension UI](#deploy-deploying-extension-ui)
    * [Deploying extension controllers](#deploy-deploying-extension-controllers)
    * [Legacy/DIY deployments](#deploy-legacy-diy-deployments)
    * [Resiliency and failover](#deploy-resiliency-and-failover)
    * [Extension Hosting Service](#deploy-extension-hosting-service)
    * [Why use extension hosting service](#deploy-why-use-extension-hosting-service)
    * [30-sec Overview](#deploy-30-sec-overview)
        * [Prerequisites for onboarding hosting service for all extensions](#deploy-30-sec-overview-prerequisites-for-onboarding-hosting-service-for-all-extensions)
        * [Prerequisites for onboarding hosting service for extensions with server-side code (or Controllers)](#deploy-30-sec-overview-prerequisites-for-onboarding-hosting-service-for-extensions-with-server-side-code-or-controllers)
        * [Step-by-Step Onboarding](#deploy-30-sec-overview-step-by-step-onboarding)
        * [Other common scenarions](#deploy-30-sec-overview-other-common-scenarions)
        * [Deploying a new version of extension](#deploy-30-sec-overview-deploying-a-new-version-of-extension)
        * [Monitoring and Logging](#deploy-30-sec-overview-monitoring-and-logging)
        * [FAQ](#deploy-30-sec-overview-faq)
    * [Logging](#deploy-logging)
    * [Monitoring](#deploy-monitoring)
    * [National/sovereign clouds](#deploy-national-sovereign-clouds)
        * [Overview](#deploy-national-sovereign-clouds-overview)
    * [Per-cloud information](#deploy-per-cloud-information)
        * [Common gotchas](#deploy-per-cloud-information-common-gotchas)


<a name="deploy-extension-hosting-service"></a>
## Extension Hosting Service

Teams deploying UI for extensions with the classic cloud service model typically have to invest significant time upfront to onboard to MDS, setup compliant deployments across all data centers, configure cdn, storage and implement caching optimizations in their extension.
The process of setting up and maintaining this infrastructure can be high. By leveraging the extension hosting service, extension developers can host their extension UI in all data centers without investing heavily in the deployment infrastructure.
This is the primary reason more than 50% of the extensions have decided to migrate from legacy DIY deployment to extension hosting service.


<a name="deploy-why-use-extension-hosting-service"></a>
## Why use extension hosting service

1. Simple Deployments and hosting out of the box that
    1. Safe Deployment
    1. Geodistributes the extension to all data centers
    1. CDN configured
    1. Use portal's MDS so no need to onboard to MDS
    1. Persistent caching, index page caching, manifest caching and all other optimizations that are implemented along the way.
1. Enhanced Monitoring
    1. Removes need for on call rotation for hosting specific issues as portal is now hosting. On call still required for dev code livesite issues
    1. We will provide full visibility into the health and activity for your extension
1. Reduced COGS
    1. No hosting COGS
    1. Reduced development cost – focus on building the domain specifics of your extension rather than spending time on figuring out deployment

<a name="deploy-why-use-extension-hosting-service-can-i-use-hosting-service-if-my-extension-has-server-side-code-or-controllers"></a>
#### Can I use hosting service if my extension has Server-Side Code (or Controllers) ?

Yes. In fact you can supplement your legacy DIY deployment infrastructure to use hosting service and deploy UI in safe-deploy compliant way.

1. In most cases Controllers are legacy and it is easy to get rid of Controllers. One advantage of getting rid of controllers is that all your clients such as Ibiza and powershell will now have consistent experience.
    In order to get rid of controllers you can follow either of these approach:
    1.	If the functionality is already available from another service
    1.	By Hosting serverside code within existing RP

1. If getting rid of Controllers is not a short terms task, you can deploy UI through hosting service by modifying the relative controller URLs used in client code to absolute URLS. Here is a sample Pull-request for cloud services extension: https://msazure.visualstudio.com/One/_git/AzureUX-CloudServices/commit/ac183c0ec197de7c7fd3e1eee1f7b41eb5f2dc8b

Post this code change, you can deploy the as a server-only service that will be behind Traffic Manager.

<a name="deploy-30-sec-overview"></a>
## 30-sec Overview

This section provides a quick 30-sec overview of how you deploy extension using hosting service

1. You integrate content unbundler, a tool shipped with framework, as part of your build. This tool generates a zip that has all the static files in your extension.
1. You upload zip file generated in Step #1 to a public read-only storage account owned by your team.
1. Hosting service polls the storage account, detects the new version and downloads the zip file in each data center within 5 minutes and starts serving the new version to customers around the world.

<a name="deploy-30-sec-overview-prerequisites-for-onboarding-hosting-service-for-all-extensions"></a>
### Prerequisites for onboarding hosting service for all extensions

1. **SDK Version**
    To generate the zip file during build process from your extension use Portal SDK 5.0.302.454 or above

    **NOTE**: If your team plans to use EV2 for uploading zip file to storage account, we recommend using Portal SDK 5.0.302.817 or above. We have recently some new features that makes it easier to use EV2 with hosting service.

2. **Build Output Format**
    1. Verify build output directory is called **bin**
    1. Verify you can point IIS to **bin** directory and load extension

<a name="deploy-30-sec-overview-prerequisites-for-onboarding-hosting-service-for-extensions-with-server-side-code-or-controllers"></a>
### Prerequisites for onboarding hosting service for extensions with server-side code (or Controllers)
    
    Modify the relative controller URLs to absolute URLS. The Controllers will deploy a new server-only service that will be behind Traffic Manager.

    Since this process is typically same across all extension you can leverage the pull-request for cloud services extension : https://msazure.visualstudio.com/One/_git/AzureUX-CloudServices/commit/ac183c0ec197de7c7fd3e1eee1f7b41eb5f2dc8b

<a name="deploy-30-sec-overview-step-by-step-onboarding"></a>
### Step-by-Step Onboarding

<a name="deploy-30-sec-overview-step-by-step-onboarding-step-1-update-isdevelopmentmode-to-false"></a>
#### Step 1: Update IsDevelopmentMode to false

Content unbundler requires  development mode be set to false to assign correct build version to the zip file.

Update IsDevelopmentMode in web.config to false.
```xml
    <add key="Microsoft.Portal.Extensions.<YourExtension>.ApplicationConfiguration.IsDevelopmentMode" value="false"/>
```

Here is an example of For example, monitoring extension

```xml
    <add key="Microsoft.Portal.Extensions.MonitoringExtension.ApplicationConfiguration.IsDevelopmentMode" value="false"/>
```

If you wish to achieve this only on release builds a [web.Release.config transform](http://go.microsoft.com/fwlink/?LinkId=125889) can be used.


<a name="deploy-30-sec-overview-step-by-step-onboarding-step-2-install-microsoft-portal-tools-contentunbundler-and-import-targets"></a>
#### Step 2: Install Microsoft.Portal.Tools.ContentUnbundler and import targets

Microsoft.Portal.Tools.ContentUnbundler provides content unbundler tool that can be run against the extension assemblies to extract static content and bundles. 

a. If you installed via Visual Studio, NuGet package manager or NuGet.exe it will automatically add the following target. 
b. If you are using CoreXT global packages.config you will have to add the target to your .csproj manually 

```xml
<Import Project="$(PkgMicrosoft_Portal_Tools_ContentUnbundler)\build\Microsoft.Portal.Tools.ContentUnbundler.targets" />
```

<a name="deploy-30-sec-overview-step-by-step-onboarding-step-3-verify-if-your-build-has-a-version-number-set"></a>
#### Step 3: Verify if your build has a version number set

The zip file generated during the build should be named as BUILD_VERSION.zip, where BUILD_VERSION is the current version number of your build.


**For extensions using CoreXT**

Executing following command will prompt the version number
```
$>set CURRENT_BUILD_VERSION
```

In my case this prompts:

```
CURRENT_BUILD_VERSION=5.0.0.440
```

**For extensions using non-CoreXT**

There are multiple build systems used by teams. We think you understand your build system better than us. 
Once you have identified how to identify build version for your build system, feel free to send a PR to help other extension developers. 

** If your build does not have a version set **

If your build does not have a version number, you can add AssemblyInfo.cs to you project with following content. This will set the build version to 1.0.0.0

**NOTE**: Microsoft.Portal.Extensions.<YourExtension> here specifies the fully qualified name of **your** extension. Also, in this scenario the build version is hard-coded to 1.0.0.0

1. Add new file **AssemblyInfo.cs**

```xml
<Compile Include="AssemblyInfo.cs" />
```

2. Update **AssemblyInfo.cs** content

```cs
//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
//-----------------------------------------------------------------------------

using Microsoft.Portal.Framework;

[assembly: AllowEmbeddedContent("Microsoft.Portal.Extensions.<YourExtension>")]
[assembly: System.Reflection.AssemblyFileVersion("1.0.0.0")]
```

<a name="deploy-30-sec-overview-step-by-step-onboarding-step-4-environment-specific-configuration-files"></a>
#### Step 4:  <strong>Environment specific configuration files</strong>

In order to load your extension in a specific environments you will need to provide environment specific configuraiton file as an embedded resource in Content\Config\* directory. Here are example for each environment: 

**NOTE**
* The files need to be placed under **\Content\Config\**
* The file should be set as en EmbeddedResource, otherwise the file will not be included in the output that gets generated by the content unbundler.
* The files need to be named with the following convention: &lt;host&gt;.&lt;domain&gt;.json (e.g. portal.azure.com.json, ms.portal.azure.com.json)

For now, just add this empty file as embedded resource:
1. Dogfood: 
        Configuration file name should be df.onecloud.azure-test.net.json. 
```xml
<EmbeddedResource Include="Content\Config\df.onecloud.azure-test.net.json" />
```

1. Production: 
        Configuration file name should be portal.azure.com.json. 
```xml
<EmbeddedResource Include="Content\Config\portal.azure.com.json" />
```
	Production environment has 3 stamps
        1. RC   **rc.portal.azure.com**
        1. MPAC **ms.portal.azure.com**
        1. PROD **portal.azure.com**

    One single configuration file is enough for all three stamps.

1. Mooncake (portal.azure.cn): 
     Configuration file name should be portal.azure.cn.json
```xml
<EmbeddedResource Include="Content\Config\portal.azure.cn.json" />
```     

1. Blackforest (portal.microsoftazure.de)
     Configration file name should be portal.microsoftazure.de.json
```xml
<EmbeddedResource Include="Content\Config\portal.microsoftazure.de.json" />
```          

1. Fairfax (portal.azure.us)
    Configuration file name should be portal.azure.us.json
```xml
<EmbeddedResource Include="Content\Config\portal.azure.us.json" />
```          

Environment configuration files server 2 purposes:

* Make the extension available in target environment
* Override settings for target environment. If there are no settings that needs to be overridden, the file should contain an empty json object. 


* The file content is a json object with key/value pairs for settings to be overriden. 

Updating content of config file:


The portal framework expects the settings to be in the format of Microsoft.Azure.MyExtension.MySetting. The framework will propagate setting to the client in the format of mySetting. So to be able to provide a value for this setting, the web.config file should be something like

```xml
<add key="Microsoft.Azure.MyExtension.MySetting" value="myValue" />
```

The equivalent configuration file would like like:

```json
{
    "mySetting": "myValue"      
}
```

<a name="deploy-30-sec-overview-step-by-step-onboarding-step-5-execute-content-unbundler-as-part-of-build-to-generate-zip-file"></a>
#### Step 5: Execute content unbundler as part of build to generate zip file

The tool will generate a folder and a zip file with a name same as the extension version. The folder will contain all content required to serve the extension.

**Build configuration**
Override any of the default configuration items for your build environment

* _ContentUnbundlerSourceDirectory_: Defaults to $(OutputPath). This needs to be set to the directory of the build output of your web project that contains your web.config and /bin dir  
* _ContentUnbundlerOutputDirectory_: Defaults to $(OutputPath). This is the output directory content unbundler will place the unbundled content, under this directory ContentUnbundler will create a folder name HostingSvc.
* _ContentUnbundlerRunAfterTargets_: Defaults to AfterBuild. This is used to sequence when the RunContentUnbundler target will run.  The value of this property will be used to set the RunContentUnbundler targets AfterTargets property. 
* _ContentUnbundlerExtensionRoutePrefix_: The prefix name of your extension e.g scheduler that is supplied as part of onboarding to the extension host.
* _ContentUnbundlerZipOutput_: Defaults to false. set to true to zip the unbunduled output that can be used for deployment.
    
For example this is the customized configuration for scheduler extension in CoreXT

```xml
  <PropertyGroup>
    <ContentUnbundlerSourceDirectory>$(WebProjectOutputDir.Trim('\'))</ContentUnbundlerSourceDirectory>
    <ContentUnbundlerOutputDirectory>$(BinariesBuildTypeArchDirectory)\HostingSvc</ContentUnbundlerOutputDirectory>
    <ContentUnbundlerExtensionRoutePrefix>scheduler</ContentUnbundlerExtensionRoutePrefix>
    <ContentUnbundlerZipOutput>true</ContentUnbundlerZipOutput>
  </PropertyGroup>
```
Outside of CoreXT, the default settings in the targets file should work for most cases. The only property that needs to be overriden is ContentUnbundlerExtensionRoutePrefix 

```xml
  <PropertyGroup>
    <ContentUnbundlerExtensionRoutePrefix>scheduler</ContentUnbundlerExtensionRoutePrefix>
  </PropertyGroup>
```
<a name="deploy-30-sec-overview-step-by-step-onboarding-step-6-upload-safe-deployment-config"></a>
#### Step 6: Upload safe deployment config

You will need to author this file. 

1. Property names in the config.json are case sensitive.
2. File name config.json is case sensitive.

In addition to the zip files, the hosting service expects a config file in the storage account. This config file is used to specify the versions that hosting service needs to download, process and serve.
The file should be called config.json and should have the below structure:

```json
{
    "$version": "3",
    "stage1": "1.0.0.5",
    "stage2": "1.0.0.4",
    "stage3": "1.0.0.3",
    "stage4": "1.0.0.2",
    "stage5": "1.0.0.1",
    "friendName": "2.0.0.0"
}
```

**$version**:  This is a mandatory attribute and should always be defined in config.json. This is the version of the current config.json schema. Hosting service requires extension developers to use the latest version i.e. 3. 

**stage(1-5)**: stage(1-5) are mandatory attributes and should always be defined in config.json with a valid version number assosciated with it.

Safe deployment requires extensions should be rolled out to all data centers in a staged manner. Out of the box hosting service provides extension the capability to rollout extension in 5 stages.
From extension developer's point of view the stages correspond to Datacenters:
    "stage1": "centraluseuap"
    "stage2": "westcentralus"
    "stage3": "southcentralus"
    "stage4": "westus"
    "stage5": "*"

This essentially means that if a user request the extension to be loaded in portal. Then based on the nearest data center portal will decide which version of extension to load.
For example, based on the above mentioned config.json if a user from Central US region requests to load Microsoft_Azue_MyExtension then hosting service will load the stage 1 version i.e. 1.0.0.5 to the user.
However, if a user from Singapoer loads the extension then the user will be served 1.0.0.1 of the extension.


<a name="deploy-30-sec-overview-step-by-step-onboarding-step-7-registering-your-extension-with-hosting-service"></a>
#### Step 7: Registering your extension with hosting service

Extensions that intend to use extension hosting service should publish the extracted deployment artifacts (zip file) that are generated during the build along with config.json to a public endpoint. 
Make sure that all the zip files and config.json are at the same level.

Once you have these files available on a public endpoint, file a request to register this endpoint using the following [link](https://aka.ms/extension-hosting-service/onboarding).

To onboard the extenion, please provide following information in RDTask:

1. Extension Name: 
<Your extension name defined in extension.pdl> 
For example, Microsoft_Azure_Test

2. Public read-only endpoint for Dogfood: 
<Storage account that will be used to serve zip files for Dogfood> 
For example, https://mybizaextensiondf.blob.core.windows.net/extension

3. Public read-only endpoint for PROD:
<Storage account that will be used to serve zip files for PROD> 
For example, https://mybizaextensionprod.blob.core.windows.net/extension

Please submit your onboarding request [here](https://aka.ms/extension-hosting-service/onboarding)

Here is the SLA for onboarding

| Environment     | SLA     |
|-----------------|---------|
| **DOGFOOD**     | 5 days  |
| **MPAC**        | 7 days  |
| **PROD**        | 12 days |
| **BLACKFOREST** | 15 days |
| **FAIRFAX**     | 15 days |
| **MOONCAKE**    | 15 days |

**NOTE:** SLA is in Business days

<a name="deploy-30-sec-overview-other-common-scenarions"></a>
### Other common scenarions

1. Using friendly names for side-loading the extension in Portal from hosting service

**Prerequisites** 

To load your extension in Portal it must be registered in portal config. More details on updating the portal config are [here](https://aka.ms/portalfx/config)

i. **If the extension does not exist yet, register it in the Portal as disabled**

Sample extension registeration for Extensions.dogfood.json i.e. Dogfood environment
```json
{
    "name": "My_Extension_Name",
    "uri": "//hosting.onecloud.azure-test.net/myextension",
    "uriFormat": "//hosting.onecloud.azure-test.net/myextension/{0}",
    "disabled": true,
    ...
},
```

Sample extension registeration for Extensions.prod.json i.e. RC, MPAC and Prod environment
```json
{
    "name": "My_Extension_Name",
    "uri": "//myextension.hosting.portal.azure.net/myextension",
    "uriFormat": "//myextension.hosting.portal.azure.net/myextension/{0}",
    "disabled": true,
    ...
},
```

ii. **If the extension is already registered but is in the process of being migrated to the hosting service, update the uriFormat in the portal**

Sample extension registeration for Extensions.dogfood.json i.e. Dogfood environment
```json
{
    "name": "My_Extension_Name",
    "uri": "//df.myextension.onecloud-ext.azure-test.net",
    "uriFormat": "//hosting.onecloud.azure-test.net/myextension/{0}",
    "disabled": true,
    ...
},
```

Sample extension registeration for Extensions.prod.json i.e. RC, MPAC and Prod environment
```json
{
    "name": "My_Extension_Name",
    "uri": "//main.myextension.ext.azure.com",
    "uriFormat": "//myextension.hosting.portal.azure.net/myextension/{0}",
    "disabled": true,
    ...
},
```

iii. **If the extension is loaded in potal from hosting service then there are no changes required to be able to side-load it.**

**Side-loading**
Hosting service allows extension developers to side-load any version of extension deployed to hosting service.

In order to side-load a specifc version
1. Add a friendly name to config.json. Friendly name is a unique name assigned to a specific build version. Here is a config.json with friendly name "test" for version 3.0.0.0

**Sample config.json**

```json
    {
        "$version": "3",
        "stage1": "1.0.0.5",
        "stage2": "1.0.0.4",
        "stage3": "1.0.0.3",
        "stage4": "1.0.0.2",
        "stage5": "1.0.0.1",
        "test": "3.0.0.0"
    }
```

2. Use the side-load url to load "test" version of extension
https://portal.azure.com?feature.canmodifystamps=true&<MY_EXTENSION_NAME>=test

i. feature.canmodifystamps=true is required for side-loading
ii **Replace** <MY_EXTENSION_NAME> with unique name of extension defined in extension.pdl

**Friendly Names** is an optional property and can be leveraged for development and testing by extension developers. Extension developers can provide any number of friendly names.

<a name="deploy-30-sec-overview-deploying-a-new-version-of-extension"></a>
### Deploying a new version of extension

If you are using safe deployment then it is likely that you want to rollout a new version to a specific stage.

**NOTE:** Publishing a version to specific stage in safe deployment does not require a build or deployment

1. If the version to be published is not in the storage account 
    * Push the <version>.zip file to storage account registered with hosting service
    * Update specific stage in config.json to this verion
1. If the version to be published is in the storage account 
    * Update specific stage in config.json to this verion

<a name="deploy-30-sec-overview-deploying-a-new-version-of-extension-hosting-service-diagnostics"></a>
#### Hosting Service diagnostics
The versions available in the Hosting Service can be seen by going to the following URL:
 
| Environment   | Hosting service                                               | 
|---------------|---------------------------------------------------------------| 
| Dogfood       | https://hosting.onecloud.azure-test.net/api/diagnostics       | 
| MPAC          | https://ms.hosting.portal.azure.net/api/diagnostics          | 
| PROD          | https://hosting.portal.azure.net/api/diagnostics              | 
| Mooncake      | https://hosting.azureportal.chinacloudapi.cn/api/diagnostics  | 
| Blackforest   | https://hosting.azure-api.de/api/diagnostics                  | 
| Fairfax       | https://hosting.azureportal.usgovcloudapi.net/api/diagnostics | 


<a name="deploy-30-sec-overview-monitoring-and-logging"></a>
### Monitoring and Logging

**Logging**
 The portal provides a way for extensions to log to MDS using a feature that can be enabled in the extension.

 More information about the portal logging feature can be found here [https://auxdocs.azurewebsites.net/en-us/documentation/articles/portalfx-telemetry-logging](https://auxdocs.azurewebsites.net/en-us/documentation/articles/portalfx-telemetry-logging)

 The logs generated by the extension when this feature is enabled can be found in a couple of tables in the portal's MDS account

**Trace Events**

>https://ailoganalyticsportal-privatecluster.cloudapp.net/clusters/Azportal/databases/AzurePortal?query=ExtEvents%7Cwhere+PreciseTimeStamp%3Eago(10m)

>ExtEvents | where PreciseTimeStamp >ago(10m)

**Telemetry Events**


>https://ailoganalyticsportal-privatecluster.cloudapp.net/clusters/Azportal/databases/AzurePortal?query=ExtTelemetry%7Cwhere+PreciseTimeStamp%3Eago(10m)

>ExtTelemetry | where PreciseTimeStamp >ago(10m)

**Monitoring**
 There are two categories of issues that needs to be monitored for each extension and that partners can act on.

 * Portal loading and running the extension

    The portal already has alerts setup to notify extensions of when it fails to load the extension for any reason. More work is being done to monitor other issues like blade load failures and part load failures.

 * Hosting Service downloading and service the extension

    The hosting service will ping the endpoint where it expects to find the extension bits every minute. It will then download any new configurations and verions it finds. If it fails to download or process the downloaded files it log these as errors in its own MDS tables.
    We are working on setting up alerts and monitors for such issues. Currently we get notified if any errors or warnings are generated by the hosting service. 
    You can access the logs of the hosting service using the below link
    https://jarvis-west.dc.ad.msft.net/53731DA4

<a name="deploy-30-sec-overview-faq"></a>
### FAQ

1. When I build my project the output zip is called HostingSvc.zip rater then <some version>.zip

The primary cause of this issue is that your web.config appSetting for IsDevelopmentMode is true.  It needs to be set to `false`, most do this using a web.Release.config transform. For example

```xml
    <?xml version="1.0" encoding="utf-8"?>

    <!-- For more information on using web.config transformation visit http://go.microsoft.com/fwlink/?LinkId=125889 -->

    <configuration xmlns:xdt="http://schemas.microsoft.com/XML-Document-Transform">
      <appSettings>
        <!-- dont forget to ensure the Key is correct for your specific extension -->
        <add key="Microsoft.Portal.Extensions.Monitoring.ApplicationConfiguration.IsDevelopmentMode" value="false" xdt:Transform="SetAttributes" xdt:Locator="Match(key)"/>
      </appSettings>
    </configuration>

```

2. How does hosting service serve my extension?  

The runtime component of the hosting service is hosted inside an Azure Cloud Service. When an extension onboards, a publicly accessible endpoint is provided by the extension developer which will contain the contents that the hosting service should serve. For the hosting service to pick them up, it will look for a file called config.json that has a specific schema described below. 
The hosting service will download the config file, look into it to figure out which zip files it needs to download. There can be multiple versions of the extension referenced in config.json. The hosting service will download them and unpack them on the local disk. After it has successfully downloaded and expanded all versions of the extension referenced in config.json, it will write config.json to disk.
For performance reasons, once a version is downloaded, it will not be downloaded again. 

3. How much time does hosting service takes to rollout a new version of extension to the relevant stage? 

Hosting service takes about 5 minutes to publsh the latest version to all DCs.

4. Some customers of my extension are hitting the old UX even after deploying the latest package. Is there a bug in hosting service ?

No this is not a bug. All clients will not get the new version as soon as it gets deployed. The new version is only served when the customer refreshs the portal. We have seen customers that keep the portal open for long periods of time. In such scenarios, when customer loads the extension they are going to get the old version that has been cached.
We have seen scenarios where customers did not refresh the portal for 2 weeks. 

5. My local build is slow ? How can I speed up the dev/test cycles ?

The default F5 experience for extension development remains unchanged however with the addition of the ContentUnbundler target some teams perfer to optimize to only run it on official builds or when they set a flag to force it to run.  The following example demonstrates how the Azure Scheduler extension is doing this within CoreXT.

```xml
    <PropertyGroup>
        <ForceUnbundler>false</ForceUnbundler>
    </PropertyGroup>
    <Import Project="$(PkgMicrosoft_Portal_Tools_ContentUnbundler)\build\Microsoft.Portal.Tools.ContentUnbundler.targets" 
            Condition="'$(IsOfficialBuild)' == 'true' Or '$(ForceUnbundler)' == 'true'" />
```

6. Content Unbundler throws an Aggregate Exception during build ?

This usually happens when the build output generated by content unbundler is different from expected format. Please refer to rrerequisites. More specifically following:
    1. Verify build output directory is called **bin**
    1. Verify you can point IIS to **bin** directory and load extension

7. Content Unbundler throws an Aggregate Exception during build ?

This usually happens when the build output generated by content unbundler is different from expected format. Please refer to rrerequisites. More specifically following:
    1. Verify build output directory is called **bin**
    1. Verify you can point IIS to **bin** directory and load extension


8. What happens if instead of publishing new version to my storage account I replace the zip file ?

Hosting service will only serve the new versions of zip file. If you replace version 1.0.0.0.zip with a new version of 1.0.0.0.zip then hosting service will not detect.
It is required that you publish new zip file with a different version number. For example 2.0.0.0.zip and update config.json to reflect that hosting service should service new version of extension.

Sample config.json for version 2.0.0.0

```json
    {
        "$version": "3",
        "stage1": "2.0.0.0",
        "stage2": "2.0.0.0",
        "stage3": "2.0.0.0",
        "stage4": "2.0.0.0",
        "stage5": "2.0.0.0",
    }
```
**NOTE:** This samples depicts that all stages are serving version 2.0.0

9. Do I need to register a new storage account everytime I need to upload zip file ?

No. Registering storage account with hosting service is one-time process. This enabled hosting service to know where to get the latest version of your extension

10. How can I ask questions about hosting service ?

You can ask questions on Stackoverflow with the tag [ibiza-deployment](https://stackoverflow.microsoft.com/questions/tagged/ibiza-deployment).

<a name="deploy-logging"></a>
## Logging
 The portal provides a way for extensions to log to MDS using a feature that can be enabled in the extension.

 More information about the portal logging feature can be found here [https://auxdocs.azurewebsites.net/en-us/documentation/articles/portalfx-telemetry-logging](https://auxdocs.azurewebsites.net/en-us/documentation/articles/portalfx-telemetry-logging)

 The logs generated by the extension when this feature is enabled can be found in a couple of tables in the portal's MDS account

Trace Events

>https://ailoganalyticsportal-privatecluster.cloudapp.net/clusters/Azportal/databases/AzurePortal?query=ExtEvents%7Cwhere+PreciseTimeStamp%3Eago(10m)

>ExtEvents | where PreciseTimeStamp >ago(10m)

Telemetry Events


>https://ailoganalyticsportal-privatecluster.cloudapp.net/clusters/Azportal/databases/AzurePortal?query=ExtTelemetry%7Cwhere+PreciseTimeStamp%3Eago(10m)

>ExtTelemetry | where PreciseTimeStamp >ago(10m)

<a name="deploy-monitoring"></a>
## Monitoring
 There are two categories of issues that needs to be monitored for each extension and that partners can act on.

 * Portal loading and running the extension

    The portal already has alerts setup to notify extensions of when it fails to load the extension for any reason. More work is being done to monitor other issues like blade load failures and part load failures.

 * Hosting Service downloading and service the extension

    The hosting service will ping the endpoint where it expects to find the extension bits every minute. It will then download any new configurations and verions it finds. If it fails to download or process the downloaded files it log these as errors in its own MDS tables.
    We are working on setting up alerts and monitors for such issues. Currently we get notified if any errors or warnings are generated by the hosting service. 
    You can access the logs of the hosting service using the below link
    https://jarvis-west.dc.ad.msft.net/53731DA4

<properties pageTitle="Deployments" description="Deployments" services="portalfx" documentationCenter="portalfx" authors="flanakin,spaoliello" />

<a name="deploy-national-sovereign-clouds"></a>
## National/sovereign clouds
<a name="deploy-national-sovereign-clouds-overview"></a>
### Overview

Sovereign clouds (aka "national clouds") are instances of Azure restricted to a particular group of users. This group may consist of one geopolitical boundary (e.g. country) or legal boundary (e.g. public sector).

To get started in a sovereign cloud, talk to the Azure Global Ecosystems team or use the link to their wikis below.

<a name="deploy-per-cloud-information"></a>
## Per-cloud information

| Cloud          | Portal domain            | Extension domain        | More information |
|----------------|--------------------------|-------------------------|------------------|
| (Public Azure) | portal.azure.com         | *.ext.azure.com         |       (N/A)      |
| Blackforest    | portal.microsoftazure.de | *.ext.microsoftazure.de | [Blackforest wiki](http://aka.ms/blackforest) |
| Mooncake       | portal.azure.cn          | *.ext.azure.cn          | [Mooncake wiki](http://aka.ms/mooncake/)    |
| Fairfax        | portal.azure.us          | *.ext.azure.us          | [Fairfax wiki](http://aka.ms/fairfax/)     |

*Note that information on the domains and URLs for each cloud (e.g. what the URL for ARM/AAD is) is contained on each cloud's wiki under a page called "Endpoints".*


<a name="deploy-per-cloud-information-common-gotchas"></a>
### Common gotchas

<a name="deploy-per-cloud-information-common-gotchas-allowedparentframe"></a>
#### AllowedParentFrame
When you deploy your extension to a different cloud, you must explicitly allow the portal in that cloud to load your extension.
This is controlled in your config. Look for a setting called `Microsoft.Portal.Framework.FrameworkConfiguration.AllowedParentFrame`. It should be a JSON array of domains that can load your extension (i.e. list of portal domains for a given cloud).

E.g. for Blackforest you might have this in your CSCFG:
```
<add key="Microsoft.Portal.Framework.FrameworkConfiguration.AllowedParentFrame" value="['portal.microsoftazure.de']" />
```

If you don't set it correctly, the browser will refuse to load your extension with an error in the console similar to `Refused to display (extension URL) in a frame because an ancestor violates the following Content Security Policy directive: (some frame-ancestors URL)`

