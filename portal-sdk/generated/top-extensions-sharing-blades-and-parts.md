
<a name="sharing-your-portal-definition-export-with-other-teams"></a>
# Sharing your Portal Definition Export with other teams

<a name="sharing-your-portal-definition-export-with-other-teams-overview"></a>
## Overview

Extensions can be used by other extensions within the Portal. There are extensions that the Ibiza team makes  available to developers, and other teams and developers are also encouraged to share extensions as appropriate.

Extensions and blades are shared by means of packaging them as NuGet packages that are  made available in the Visual Studio IDE and the CoreXT IDE,  although it is possible to access a NuGet package from other IDE's. 

An extension can refer to another extension's NuGet packages in order to invoke its blades or parts at runtime.

Shared blades are typically dedicated to a specific function, like billing, monitoring, or  . Using a shared blade standardizes functionality across extensions, and 
 improves blade performance within the Portal.
 
<a name="sharing-your-portal-definition-export-with-other-teams-basic-format-of-a-shared-blade"></a>
## Basic format of a shared blade

The PDL file contains the definition of the template blade. The following example contains a typical PDL file.

    ```xml
    <TemplateBlade
                Name="MyTemplateBlade"
                ViewModel="{ ViewModel Name=MyTemplateBladeViewModel, Module=./ViewModels/MyTemplateBladeViewModel }"
                InitialDisplayState="Maximized"
                Template="{ Html Source='Templates\\MyTemplateBlade.html' }">
    </TemplateBlade>
    ```
There are several options that are located in the PDL file. The following is a list of the most relevant parameters.

**Name**: Name of the blade. This name is used later to refer to this blade. 

**ViewModel**: Required field.  The ViewModel that is associated with this blade. 

**Template**: Required field.  The HTML template for the blade. 

**Size**: Optional field. The width of the blade. The default value is `Medium`. 

**InitialDisplayState**: Optional field.  Specifies whether the blade is opened maximized or not. The default value is `Normal`. 

**Style**: Optional field. Visual style for the blade. The default value is `Basic`. 

**Pinnable**: Optional field. Specifies whether the blade can be pinned or not. The default value is `false`.

**ParameterProvider**: Optional field. Specifies whether the blade provides parameters to other blades within the extension.   The default value is  `false`.

**Export**: Optional field.  Specifies whether this blade is exported from your extension and to be opened by other extensions. If this field is `true`, a strongly typed blade reference is created. 

For more information on the types of shared extensions, see the following list of PDE topics. 

| Type                        | Document                                                       | Description                                                                 |
| --------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Sharing Extensions          | [portalfx-pde-publish.md](portalfx-pde-publish.md)             | How to share a PDE with other teams.                                        |
| Content Delivery Network    | [portalfx-pde-cdn.md](portalfx-pde-cdn.md)                     | Storing images, scripts, and other files on globally geodistributed servers |
| The KeyVault picker blade   | [portalfx-pde-keyvault.md](portalfx-pde-keyvault.md)           | Unifies KeyVault selection and/or key/secret selection scenarios across the Portal. |
| The Select Member Blade     | [portalfx-pde-adrbac.md](portalfx-pde-adrbac.md)               | Unifies "member selection" scenarios across the Portal.                     |
| The Billing Blade           | [portalfx-pde-billing.md](portalfx-pde-billing.md)             |                                                                             | 
| The Hubs Extensions         | [portalfx-hubsextension-pde.md](portalfx-hubsextension-pde.md) | Provides the PricingTier, the ResourceTags, and other parts                 | 
| Azure Insights              | [portalfx-pde-azureinsights.md](portalfx-pde-azureinsights.md) | Activity logs and other tools that provide metadata about extension performance and maintenance. | 
| Azure Monitoring            | [portalfx-pde-monitoring.md](portalfx-pde-monitoring.md)       | azure-monitoring-usage-doc                                |

For more information about sharing pde's, see [top-extensions-nuget.md](top-extensions-nuget.md).

<a name="sharing-your-portal-definition-export-with-other-teams-the-pde-file"></a>
## The PDE File

Whenever a project is built, a PDE file is generated that is located inside of the `\Client\_generated` directory. The PDE file contains a list of the parts which are exposed in the global scope, along with a few other pieces of metadata, as in the following example.

```json
{
  "extension": "HubsExtension",
  "version": "1.0",
  "sdkVersion": "1.0.8889.122 (rd_auxweb_n_f1(tomcox).130919-1440)",
  "schemaVersion": "0.9.1.0",
  "assetTypes": [
    {
      "name": "TagsCollection",
      "permissions": []
    }
    ...
  ],
  "parts": [
    {
      "name": "ChangeLogPart",
      "inputs": []
    },
    ...
  ],
  "blades": [
    {
      "name": "TagCollectionBlade",
      "keyParameters": [],
      "inputs": [],
      "outputs": []
    },
    ...
  ]
}
```

To share parts, blades, or asset types with another extension, both extensions must be running in the same Portal. The sharing of parts occurs at runtime, which requires that both extensions be present within the shell for this technique to work.

<a name="sharing-your-portal-definition-export-with-other-teams-importing-the-pde-file"></a>
## Importing the PDE file

After the PDE file is generated, it should be added to the project of the extension that will  consume the  parts.  The process is as follows.

1. Add the PDE file to your project.
1. Make a manual change to the .csproj file. Change  the `<Content>` compile action to `<ExtensionReference>`. 
1. Right-click on the  project file, and choose 'Unload Project'. 
1. Right-click the project file again, and choose 'Edit'. 
1. Find the PDE file reference, and change the compile action as in the following example.

    ```xml
    <ExtensionReference Include="Client\References\HubsExtension.pde" />
    ```

1. Save the file, right-click on your project file, and choose 'Reload Project'.

<a name="sharing-your-portal-definition-export-with-other-teams-launching-blades-from-another-extension"></a>
## Launching blades from another extension

Typically, extensions launch blades from their own code by using  the `<BladeAction>` element.  However, in some cases, extensions  import  parts from other extensions, as specified in [portalfx-pde-publish.md](portalfx-pde-publish.md).  Using this technique, the source of the shared part controls launching of the blade.  

In other instances, extensions  can launch a blade from another extension by using a part from the current extension.  This is where `BladeReference` is useful.  To use a `BladeReference`, the current extension  imports the PDE from the other extension.  The other extension  explicitly flags its blades as exported, as in the following example.

```xml
<Blade
	Name="WebsiteBlade"
	Export="True"  .. />
```

<a name="sharing-your-portal-definition-export-with-other-teams-consuming-the-blade"></a>
## Consuming the blade

To launch the blade referenced by the PDE file, specify the extension in the `<BladeAction>` element, as in the sample located at `<dir>\Client\ResourceTypes\ResourceTypes.pdl` and in the following code.

```xml
<BladeAction Blade="{BladeReference ResourceMapBlade, ExtensionName=HubsExtension}">
  <BladeInput
      Source="assetOwner"
      Parameter="assetOwner" />
  <BladeInput
      Source="assetType"
      Parameter="assetType" />
  <BladeInput
      Source="assetId"
      Parameter="assetId" />
</BladeAction>
```

<a name="sharing-your-portal-definition-export-with-other-teams-remote-procedure-calls-rpc"></a>
## Remote Procedure Calls (RPC)

In some cases an extension needs to invoke a method on another extension, or provide methods for other extensions to invoke. This is supported by using a Remote Procedure Call (RPC) API.

<a name="sharing-your-portal-definition-export-with-other-teams-producer-api"></a>
## Producer API

To provide a method for invocation, you can create a new callback in `EntryPoint`.  The following code creates a RPC endpoint named `StringUpperCaseCallback`, takes a single string argument, and returns a transformed string.
The code is located in `<dir>\Client\Program.ts`, and is also in the following example.

```typescript

/*
 * Registers the RPC callbacks supported by this extension.  This
 * callback is used by the samples extension in the RPC sample.
 */
private registerCallbacks(): void {
    MsPortalFx.Services.Rpc.registerCallback("StringUpperCaseCallback", function (input: string): string {
        return input.toUpperCase();
    });

```

<a name="sharing-your-portal-definition-export-with-other-teams-producer-api-consumer-api"></a>
### Consumer API

The following code  asynchronously returns a result from the source. It accomplishes this by invoking the `MsPortalFx.Services.Rpc.invokeCallback` API, passing the extension endpoint, callback name, and any required arguments.
It is located at `<dir>\Client\V1\Extensibility\RPC\ViewModels\RpcCallbacksViewModels.ts` and in the following example.

```typescript

/**
 * This method will invoke a method on SamplesExtension (ideally a different extension than your own).  That method is
 * defined in Program.ts of SamplesExtension, and will be returned async.
 */
public invokeCallback() {
    const extensionId = "SamplesExtension",
        callbackName = "StringUpperCaseCallback",
        arg = (new Date()).toTimeString();

    // Reset UI
    this.result(ClientResources.rpcResultPending);

    // Make the async remote procedure call
    MsPortalFx.Services.Rpc.invokeCallback<string>(extensionId, callbackName, arg).then(
        (result) => {
            this.result(result);
        },
        (rpcError) => {
            this.result(ClientResources.rpcResultErrorFormatString.format(rpcError.error.toString(), rpcError.isClientError));
        });
}
}

```


**NOTE**: Extensions in the Portal  often need to be loaded into memory to perform an RPC call. It is often more predictable when both extensions are projecting UI.
