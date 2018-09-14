
## Extension Hosting Service

Teams deploying UI for extensions with the classic cloud service model typically have to invest significant time upfront to onboard to MDS, setup compliant deployments across all data centers, configure cdn, storage and implement caching optimizations in their extension.
The process of setting up and maintaining this infrastructure can be high. By leveraging the extension hosting service, extension developers can host their extension UI in all data centers without investing heavily in the deployment infrastructure.
This is the primary reason more than 50% of the extensions have decided to migrate from legacy DIY deployment to extension hosting service.


## Why use extension hosting service

1. Simple Deployments and hosting out of the box that
    1. Safe Deployment
    1. Geodistributes the extension to all data centers
    1. Use portal's MDS so no need to onboard to MDS
    1. Persistent caching, index page caching, manifest caching and all other optimizations that are implemented along the way.
1. Enhanced Monitoring
    1. Removes need for on call rotation for hosting specific issues as portal is now hosting. On call still required for dev code livesite issues
    1. We will provide full visibility into the health and activity for your extension
1. Reduced COGS
    1. No hosting COGS
    1. Reduced development cost – focus on building the domain specifics of your extension rather than spending time on figuring out deployment

#### Can I use hosting service if my extension has Server-Side Code (or Controllers) ?

Yes. In fact you can supplement your legacy DIY deployment infrastructure to use hosting service and deploy UI in safe-deploy compliant way.

1. In most cases Controllers are legacy and it is easy to get rid of Controllers. One advantage of getting rid of controllers is that all your clients such as Ibiza and powershell will now have consistent experience.
    In order to get rid of controllers you can follow either of these approach:
    1.	If the functionality is already available from another service
    1.	By Hosting serverside code within existing RP

1. If getting rid of Controllers is not a short terms task, you can deploy UI through hosting service by modifying the relative controller URLs used in client code to absolute URLS. Here is a sample Pull-request for cloud services extension: https://msazure.visualstudio.com/One/_git/AzureUX-CloudServices/commit/ac183c0ec197de7c7fd3e1eee1f7b41eb5f2dc8b

Post this code change, you can deploy the as a server-only service that will be behind Traffic Manager.

## 30-sec Overview

This section provides a quick 30-sec overview of how you deploy extension using hosting service

1. You integrate content unbundler, a tool shipped with framework, as part of your build. This tool generates a zip that has all the static files in your extension.
1. You upload zip file generated in Step #1 to a public read-only storage account owned by your team.
1. Hosting service polls the storage account, detects the new version and downloads the zip file in each data center within 5 minutes and starts serving the new version to customers around the world.

### Prerequisites for onboarding hosting service for all extensions 

1. **SDK Version**
    To generate the zip file during build process from your extension use Portal SDK 5.0.302.454 or above

    **NOTE**: If your team plans to use EV2 for uploading zip file to storage account, we recommend using Portal SDK 5.0.302.817 or above. We have recently some new features that makes it easier to use EV2 with hosting service.

2. **Build Output Format**
    1. Verify build output directory is called **bin**
    1. Verify you can point IIS to **bin** directory and load extension

### Prerequisites for onboarding hosting service for extensions with server-side code (or Controllers)
    
Modify the relative controller URLs to absolute URLS. The Controllers will deploy a new server-only service that will be behind Traffic Manager.

Since this process is typically same across all extension you can leverage the pull-request for cloud services extension : [https://msazure.visualstudio.com/One/_git/AzureUX-CloudServices/commit/ac183c0ec197de7c7fd3e1eee1f7b41eb5f2dc8b](https://msazure.visualstudio.com/One/_git/AzureUX-CloudServices/commit/ac183c0ec197de7c7fd3e1eee1f7b41eb5f2dc8b)

### Step-by-Step Onboarding

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


#### Step 2: Install Microsoft.Portal.Tools.ContentUnbundler and import targets

Microsoft.Portal.Tools.ContentUnbundler provides content unbundler tool that can be run against the extension assemblies to extract static content and bundles. 

a. If you installed via Visual Studio, NuGet package manager or NuGet.exe it will automatically add the following target. 

b. If you are using CoreXT global packages.config you will have to add the target to your .csproj manually 

```xml
<Import Project="$(PkgMicrosoft_Portal_Tools_ContentUnbundler)\build\Microsoft.Portal.Tools.ContentUnbundler.targets" />
```

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

#### Step 4:  **Environment specific configuration files**

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

For example, if you have backend controllers that you would like to call from the client, you would add a property to your ApplicationConfiguration C# class that is called ControllerEndpoint.
You can find more information about propagating configuration to the client where [here] portalfx-load-configuration.md 
Once you do that, you can provide a value to that property for each cloud by adding the property name in camel casing to the environment specific config file.

```json
{
   "controllerEndpoint":"https://mycontrollerendpoint.mybackendhostname.net"
}
```

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

In addition to the 5 stages, you can add custom names to versions that you want to test but not serve to customers. We call them friendly names. You can define up tp a 100 friendly names in config.json. If more than 100 friendly names are defined in the config, the hosting service will fail to sync the extension and an IcM incident will be created against the owning team.

Friendly names should point to valid versions of your extension, and those versions should exist in the storage account.

Each of the properties defined in your config (stages and friendly names) get a unique url that you can use to access the version that it points to. For example, to load the version that is in stage1 above, the url would be
[https://myextension.hosting.portal.azure.net/myextension/stage1?l=en&trustedAuthority=portal.azure.com](https://myextension.hosting.portal.azure.net/myextension/stage1?l=en&trustedAuthority=portal.azure.com)

To load version 2.0.0.0 the url would be
[https://myextension.hosting.portal.azure.net/myextension/friendlyname?l=en&trustedAuthority=portal.azure.com](https://myextension.hosting.portal.azure.net/myextension/friendlyname?l=en&trustedAuthority=portal.azure.com)

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

For example, [https://mybizaextensiondf.blob.core.windows.net/extension](https://mybizaextensiondf.blob.core.windows.net/extension)

3. Public read-only endpoint for PROD:
<Storage account that will be used to serve zip files for PROD> 

For example, [https://mybizaextensionprod.blob.core.windows.net/extension](https://mybizaextensionprod.blob.core.windows.net/extension)

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
