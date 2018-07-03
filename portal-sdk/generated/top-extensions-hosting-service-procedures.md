
<a name="checklist-for-onboarding-hosting-service"></a>
## Checklist for onboarding hosting service

There are two different ways to onboard an extension to a hosting service. If your extension has never been hosted, and it should be onboarded to the hosting service, use the procedures named [initial onboarding to the hosting service](#initial-onboarding-to-the-hosting-service).
If your extension was previously hosted, and is being migrated from DIY legacy deployment to a hosting service, use the procedure named [converting from custom deployment to a hosting service](#converting-from-custom-deployment-to-a-hosting-service).

<a name="checklist-for-onboarding-hosting-service-initial-onboarding-to-the-hosting-service"></a>
### Initial onboarding to the hosting service

The procedure for onboarding to the hosting service is as follows. Click on the link for an in-depth discussion of each step.
1. [Update IsDevelopmentMode](#update-isdevelopmentmode-flag) 
1. [Install ContentUnbundler](#install-contentunbundler) 
1. [Verify the version number](#verify-the-version-number)
1. [Provide environment-specific configuration files](#provide-environment-specific-configuration-files)
1. [Execute Content Unbundler](#execute-content-unbundler)
1. [Upload safe deployment config](#upload-safe-deployment-config)
1. [Register the extension](#register-the-extension)

<a name="checklist-for-onboarding-hosting-service-update-isdevelopmentmode-flag"></a>
### Update IsDevelopmentMode flag

The **Content Unbundler** tool requires setting the development mode to `false` to assign the correct build version to the zip file. If the name of the zip file generated is `HostingSvc.zip` instead of `<BUILD_VERSION>.zip,` then `IsDevelopmentMode` is probably set to `true`.

Update the **IsDevelopmentMode** flag in the `web.config` file to false, as in the following example.
```xml
    <add key="Microsoft.Portal.Extensions.<extensionName>.ApplicationConfiguration.IsDevelopmentMode" value="false"/>
```

The following example updates the **IsDevelopmentMode** flag for a monitoring extension.

```xml
    <add key="Microsoft.Portal.Extensions.MonitoringExtension.ApplicationConfiguration.IsDevelopmentMode" value="false"/>
```

If the **IsDevelopmentMode** flag setting should be reserved for release builds only, use a `web.Release.config` transform, as specified in [http://go.microsoft.com/fwlink/?LinkId=125889](http://go.microsoft.com/fwlink/?LinkId=125889).
 
<a name="checklist-for-onboarding-hosting-service-install-contentunbundler"></a>
### Install ContentUnbundler

**Microsoft.Portal.Tools.ContentUnbundler** provides a **Content Unbundler** tool that can be run against the extension assemblies to extract static content and bundles. 

* If you installed the **Content Unbundler** tool by using **Visual Studio**, **NuGet Package Manager** or `NuGet.exe`, it will automatically add the following target.

```xml
<Import Project="$(PkgMicrosoft_Portal_Tools_ContentUnbundler)\build\Microsoft.Portal.Tools.ContentUnbundler.targets" />
```

* If you are using **CoreXT** global `packages.config`, the previous target should be added to the `.csproj` file manually.

<a name="checklist-for-onboarding-hosting-service-verify-the-version-number"></a>
### Verify the version number

The zip file generated during the build should be named `<BUILD_VERSION>.zip`, where <BUILD_VERSION> is the current version number. For more information about version numbers, see [top-extensions-versioning.md](top-extensions-versioning.md).

* CoreXT extensions

    Display the version number of the build.
    In this example, the computer displays the following build version.

    ```cs
    $>set CURRENT_BUILD_VERSION
    CURRENT_BUILD_VERSION=5.0.0.440
    ```

* Non-CoreXT extensions

    There are multiple build systems used by various teams. After you have determined which build version is used by your team, please send a pull request to help other extension developers. The pull request is located at [https://aka.ms/portalfx/pullrequest](https://aka.ms/portalfx/pullrequest).

    If the extension build does not have a version number, the `AssemblyInfo.cs` file in the **Visual Studio** project can be edited to set the build version to 1.0.0.0.  If the file does not exist, add it in the same folder as the one that contains the `<extensionName>.csproj` and `web.config` files. The process is as follows.

    1. Add new file **AssemblyInfo.cs**.

    ```xml <Compile Include="AssemblyInfo.cs" /> ```

    1. Update **AssemblyInfo.cs** content

    ```cs
    //-----------------------------------------------------------------------------
    // Copyright (c) Microsoft Corporation.  All rights reserved.
    //-----------------------------------------------------------------------------

    using Microsoft.Portal.Framework;

    [assembly: AllowEmbeddedContent("Microsoft.Portal.Extensions.<extensionName>")]
    [assembly: System.Reflection.AssemblyFileVersion("1.0.0.0")]
    ```

    **NOTE**: `Microsoft.Portal.Extensions.<extensionName>` specifies the fully qualified name of the extension. The build version is hard-coded to 1.0.0.0.
 
<a name="provide-environment-specific-configuration-files"></a>
## Provide environment-specific configuration files

Environment configuration files serve two purposes.

* They [override settings](#overriding-settings) for the target environment 
* They [allow the extension to load](#loading-in-the-target-environment) in the target environment


<a name="provide-environment-specific-configuration-files-overriding-settings"></a>
#### Overriding settings

The content of the configuration file is a json object with key/value pairs for settings to be overridden.  If there are no settings to override, the file should contain an empty json object. 

The settings for the Portal framework are in the format of `Microsoft.Azure.<extensionName>.<settingName>`, where `settingName`, without the angle brackets, is the name of the setting. The framework will propagate the setting to the client in the format of `<settingName>`. For example, the `web.config` file that contains this setting would resemble the following.

```xml
<add key="Microsoft.Azure.<extensionName>.<settingName>" value="myValue" />
```

The equivalent configuration file would resemble the following.

```json
{
    "settingName": "myValue"      
}
```

<a name="provide-environment-specific-configuration-files-loading-in-the-target-environment"></a>
#### Loading in the target environment

In order to load the extension in a specific environment, the  configuration file should be an embedded resource in the `Content\Config\*` directory of the **Visual Studio** project, as in the following example.

![alt-text](../media/portalfx-extensions-hosting-service/contentConfig.png  "Trace Event Parameters")

If the file is not set as an `EmbeddedResource` in the EmbeddedContentMetadata.txt file, it will not be included in the output that gets generated by the **Content Unbundler** tool. 

The files are named using the following convention:

`<host>.<domain>.json`

where

**host**: Optional. The environment that is associated with the domain. Values are  `ms` and `rc`. When this node is omitted, the dot that precedes the domain name is also omitted.

**domain**: Contains the value `portal.azure.com`.


The following are examples for each environment.

1. Dogfood 

    The configuration file is named  `df.onecloud.azure-test.net.json`, as in the following example.

        ```xml
        <EmbeddedResource Include="Content\Config\df.onecloud.azure-test.net.json" />
        ```

1. Production

    The production environment uses three extension configurations, as in the following table.

    | Environment | Configuration       |
    | ----------- | ------------------- |
    | RC          | rc.portal.azure.com |
    | MPAC        | ms.portal.azure.com |
    | PROD        | portal.azure.com    |

  `portal.azure.com.json` is enough to serve all production environments. If an environment requires a config value that is different from other environments, then an additional environment configuration can be added, for example,  `ms.portal.azure.com.json`.

    ```xml
    <EmbeddedResource Include="Content\Config\portal.azure.com.json" />
    <EmbeddedResource Include="Content\Config\rc.portal.azure.com.json" />
    <EmbeddedResource Include="Content\Config\ms.portal.azure.com.json" />
    ```

1. Mooncake 
        
    The configuration file is named  `portal.azure.cn.json`, as in the following example.

    ```xml
    <EmbeddedResource Include="Content\Config\portal.azure.cn.json" />
    ```

1. Blackforest

    The configuration file is named `portal.microsoftazure.de.json`, as in the following example.

    ```xml
    <EmbeddedResource Include="Content\Config\portal.microsoftazure.de.json" />
    ```

1. FairFax 

    The configuration file name is named `portal.azure.us.json`, as in the following example.

    ```xml
    <EmbeddedResource Include="Content\Config\portal.azure.us.json" />
    ```
<a name="provide-environment-specific-configuration-files-execute-content-unbundler-to-generate-zip-file"></a>
### Execute Content Unbundler to generate zip file

When the extension project is built, the **Content Unbundler** tool generates a folder and a zip file that are named the same as the extension version. The folder contains all content required to serve the extension.

You can override any of the default configuration parameters for the build environment.

* **ContentUnbundlerSourceDirectory**: This contains the path of the build output directory that contains the `web.config` file and the /bin directory. The default value is `$(OutputPath)`.

* **ContentUnbundlerOutputDirectory**: This contains the path of the output directory in which the **Content Unbundler** will place the unbundled content.  It will create a folder named `HostingSvc`. The default value is `$(OutputPath)`.

* **ContentUnbundlerRunAfterTargets**: This is used to sequence when the RunContentUnbundler target will run.  The value of this property is used to set the `AfterTargets` property of the RunContentUnbundler.  The default value is `AfterBuild`. 

* **ContentUnbundlerExtensionRoutePrefix**: This contains the prefix name of the extension that is supplied as part of onboarding to the extension host. This will also be used in creating the extension host name. For example, if the `ContentUnbundlerExtensionRoutePrefix` is set to "myextension", then the host name will be `myextension.hosting.portal.azure.net`.

* **ContentUnbundlerZipOutput**: Zips the unbundled output that can be used for deployment. A value of `true` zips the output, whereas a value of `false`  does not create a .zip file. Defaults to `false`.   

The following examples are customized configuration files.

* CoreXT extension configuration

    The following example is the customized configuration for a **CoreXT**  extension named "scheduler". 

```xml
<PropertyGroup>
    <ContentUnbundlerSourceDirectory>$(WebProjectOutputDir.Trim('\'))</ContentUnbundlerSourceDirectory>
    <ContentUnbundlerOutputDirectory>$(BinariesBuildTypeArchDirectory)\HostingSvc</ContentUnbundlerOutputDirectory>
    <ContentUnbundlerExtensionRoutePrefix>scheduler</ContentUnbundlerExtensionRoutePrefix>
    <ContentUnbundlerZipOutput>true</ContentUnbundlerZipOutput>
</PropertyGroup>
```

* Non-CoreXT extension configuration

    Outside of CoreXT, the default settings in the `targets` file should work for most cases. The only property that needs to be overridden is **ContentUnbundlerExtensionRoutePrefix**, as in the following example.

```xml
<PropertyGroup>
    <ContentUnbundlerExtensionRoutePrefix>scheduler</ContentUnbundlerExtensionRoutePrefix>
</PropertyGroup>
```

<a name="provide-environment-specific-configuration-files-upload-safe-deployment-config"></a>
### Upload safe deployment config

<!-- TODO:  Determine all of the contents of the storage account.  Also determine where else the zip file is discussed. -->
<!-- Then remove the following sentence: 
In addition to the zip files, the hosting service expects a config file to be located in the storage account. 
-->

Safe deployment practices require that extensions are rolled out to all data centers in a staged manner. The out-of-the-box hosting service provides the capability to deploy an extension in five stages, where each stage corresponds to one of five locations, or data centers.  The stages are as follows.

* Public Cloud

1. **stage1**: "centraluseuap"
1. **stage2**: "westcentralus"
1. **stage3**: "southcentralus"
1. **stage4**: "westus"
1. **stage5**: "*"

* FairFax

1. **stage1**: "usgovcentral"
1.  **stage2**: "*"

* Mooncake

1. **stage1**: "chinanorth"
1.  **stage2**: "*"

* Blackforest

1. **stage1**: "germanynortheast"
1. **stage2**: "*"


<!-- TODO:  Determine whether an extension can use the "stageDefinition" and "$sequence" parameters, or if they are reserved for hosting service use -->

When a user requests an extension in the Azure Portal, the Portal will determine which version to load, based on the datacenter that is nearest to the user's geographical location.

The config file specifies the versions of the extension that the hosting service will download, process and serve. It is authored by the developer as part of creating the extension.  The config file is located in the storage account, and its name is  `config.json`.  The file name is case sensitive, as are the names of the properties that it contains, as in the following example.

```json
{
    "$version": "3",
    "stage1": "1.0.0.5",
    "stage2": "1.0.0.4",
    "stage3": "1.0.0.3",
    "stage4": "1.0.0.2",
    "stage5": "1.0.0.1",
    "<friendlyName>": "2.0.0.0"
}
```

**$version**:  Required attribute. This is the version of the current `config.json` schema. The hosting service requires extension developers to use the latest version, which is 3.

**stage(1-5)**: Required attributes. A valid version number for the extension.  The version number is associated with the datacenter that has the same stage number.

* In this example, based on the preceding `config.json` file, if a user in the Central US region requests to load `Microsoft_Azure_<extensionName>`, then the hosting service will load the stage 1 version for the user, which is version 1.0.0.5. However, if a user in Singapore loads the extension, then the hosting service will load the stage 5 version, which is 1.0.0.1.

**friendlyName**: Optional. A unique name, without the angle brackets, that is assigned to a specific build version for sideloading. There is no limit to the number of friendly names can be provided by the developer for development and testing.

<!-- TODO: are friendly names separated by commas? -->
For more information about testing extensions with stages in configuration files, see [top-extensions-hosting-service-scenarios.md#deploying-a-new-version-to-a-stage](top-extensions-hosting-service-scenarios.md#deploying-a-new-version-to-a-stage).

<a name="provide-environment-specific-configuration-files-register-the-extension"></a>
### Register the extension

<!-- TODO:  determine how to make a public endpoint in order to copy the build files to it. -->

Extensions should publish the extracted deployment artifacts that are generated during the build to a public read only accessible  storage account. This means copying the zip files for the build, along with the `config.json` file, to a blob container that is publicly accessible.

1. The extension should have two storage accounts, one for the Dogfood environment and one for the production environment. An example of a Dogfood environment endpoint is `https://mybizaextensiondf.blob.core.windows.net/<extensionName>`. An example of a PROD environment endpoint is `https://mybizaextensionprod.blob.core.windows.net/<extensionName>`.

1. Make sure that all the zip files and the config.json file are at the same level in the blob container.

1. After these files are available on a public endpoint, file a request to register the public endpoint.  The link is located at   [https://aka.ms/extension-hosting-service/onboarding](https://aka.ms/extension-hosting-service/onboarding). To onboard the extension, please provide following information in the request. 

    * **Extension Name**: The name of the extension, as specified in the  `extension.pdl` file.

    * **Dogfood storage account**:  The public read-only endpoint that serves zip files for the Dogfood environment.

    * **Prod storage account**: The public read-only endpoint that serves zip files for the production environment.


<a name="provide-environment-specific-configuration-files-converting-from-custom-deployment-to-a-hosting-service"></a>
### Converting from custom deployment to a hosting service

To minimize the probability of regression, use the following procedure to migrate an extension from custom  deployment to a hosting service. For more information about custom deployment, see [top-extensions-custom-deployment.md](top-extensions-custom-deployment.md).


1. Change the uri format to use a hosting service in the PROD environment

   An example of a pull request for modifying the `uriFormat` parameter is located at [https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx/commit/c22b81463cab1d0c6b2c1abc803bc25fb2836aad?refName=refs%2Fheads%2Fdev](https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx/commit/c22b81463cab1d0c6b2c1abc803bc25fb2836aad?refName=refs%2Fheads%2Fdev).

1. Flight changes in MPAC

    An example of a pull request for a flighting extension in MPAC is located at [https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx/commit/be95cabcf7098c45927e3bb7aff9b5e0f65de341?refName=refs%2Fheads%2Fdev](https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx/commit/be95cabcf7098c45927e3bb7aff9b5e0f65de341?refName=refs%2Fheads%2Fdev).

1. Enable 100% traffic in MPAC and PROD
  
    An example of a pull request that enables 100% traffic without flighting for `MicrosoftAzureClassicStorageExtension`, and 100% traffic with flighting for `Microsoft_Azure_Storage` is located at [https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx/commit/b81b415411f54ad83f93d43d37bcad097949a4e3?refName=refs%2Fheads%2Fdev&discussionId=-1&_a=summary&fullScreen=false](https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx/commit/b81b415411f54ad83f93d43d37bcad097949a4e3?refName=refs%2Fheads%2Fdev&discussionId=-1&_a=summary&fullScreen=false). 

1. Enable flighting in MPAC

    The Azure Portal provides the ability to flight the MPAC customers to multiple editions of an extension. Traffic will be equally distributed between all registered configurations, or stamps.  An example of a pull request is located at [https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx/commit/be95cabcf7098c45927e3bb7aff9b5e0f65de341?refName=refs%2Fheads%2Fdev](https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx/commit/be95cabcf7098c45927e3bb7aff9b5e0f65de341?refName=refs%2Fheads%2Fdev).
        
    * Hosting service `extension.pdl` file

        To flight traffic to multiple stamps, register other stamps in `flightUri`. For example, the friendly name `MPACFlight` is used to flight traffic to another edition of an extension, as in the following example.

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
    * Legacy deployment `extension.pdl` file

        Custom deployment can also flight traffic to multiple extension editions, as in the following example.

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
