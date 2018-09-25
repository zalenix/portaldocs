
## Overview
   
Side loading lets you run a local development version of your extension against the production portal on a per user basis. This is the recommended approach for your dev / test loop. 

## Quick Reference by Example

* Sideload single extension from localhost

	`https://portal.azure.com/?feature.canmodifyextensions=true#?testExtensions={"Microsoft_Azure_Demo":"https://localhost:44300/"}`

* Sideload multiple extensions from localhost

	`https://portal.azure.com/?feature.canmodifyextensions=true#?testExtensions={"Microsoft_Azure_Demo":"https://localhost:44300/","Microsoft_Azure_AnotherExtension":"https://localhost:44301/" }`

* Sideload extension that is deployed on hosting service in friendly name or stage

	`https://portal.azure.com?feature.canmodifystamps&Microsoft_Azure_Demo=friendlyname`

* Sideload extension running on, or mapped to, domain other than localhost

  ```typescript

    MsPortalImpl.Extension.registerTestExtension({ 
      name: "Microsoft_Azure_Demo", 
      uri: "https://someotherdomain.com:44301 " }
  );
  ```

## Sideloading step by step

### Step 1 

Register the extension for side loading using one of the following two methods.

* If the extension is running on localhost. This is the recommended and most common method of sideloading an extension.

	The query string and fragment can only be used if the extension is on the localhost and is served over SSL.  

	Skip to [Step 2](#step-2-accept-the-allow-dialog) if the Azure Portal Extension project template for **Visual Studio** was used to scaffold the initial extension. The scaffolded extension will automatically compose a side-loading query string and fragment when running the web project.  

	To manually compose your query string and fragment, continue as follows.

	The following is the syntax of a query string that can be used to load an extension by using the address bar in the browser.

	`https://<environment>/?feature.canmodifyextensions=true#?testExtensions={"<extensionName>":"https://localhost:<portNumber>"}`

	where

	* **environment**: Portal environment in which to load the extension. Portal environments are `portal.azure.com`, `rc.portal.azure.com`, `mpac.portal.azure.com`, and `df.onecloud.azure-test.net`.

	* **feature.canmodifyextensions**: set to true to support loading untrusted extensions.  This feature flag grants permission to the Portal to load extensions from URLs other than the ones that are typically used by customers. It triggers an additional Portal UI that indicates that the Portal is running with untrusted extensions.

	* **extensionName**: Matches the name of the extension, without the angle brackets, as specified in the `<Extension>` element in the `extension.pdl` file.

	* **portNumber**: Optional. The port number where the extension is hosted on the endpoint that serves the extension, as in the following example: `https://localhost:44300/`

	Example

	The following complete URL was built using the previous syntax to sideload the extension named "Microsoft_Azure_Demo" into `portal.azure.com`, to run on localhost port 44300. It registers the extension only for the current user session.

	`https://portal.azure.com/?feature.canmodifyextensions=true#?testExtensions={"Microsoft_Azure_Demo":"https://localhost:44300/"}`

	On occasion your changes may span multiple extensions. The following demonstrates how to sideload multiple extensions running on localhost.

	`https://portal.azure.com/?feature.canmodifyextensions=true#?testExtensions={"Microsoft_Azure_Demo":"https://localhost:44300/","Microsoft_Azure_AnotherExtension":"https://localhost:44301/" }`

* If the extension is deployed using a friendly name in Hosting Service.

	Format

	`https://portal.azure.com?feature.canmodifystamps&<extensionName>=<friendlyNameOrStage>`

	Example

	The following example loads the version of `Microsoft_Azure_Demo` that was deployed to the hosting service using the friendly name "somenewfeature".

	`https://portal.azure.com?feature.canmodifystamps&Microsoft_Azure_Demo=somenewfeature`

	For more information about testing extensions in the hosting service, see [top-extensions-hosting-service.md#friendly-names-and-sideloading](top-extensions-hosting-service.md#friendly-names-and-sideloading).

### Step 2 Accept the allow dialog 

Click on the `Allow` button to sideload the extension, as in the following image.

![alt-text](../media/top-extensions-sideloading/allowDialog.png "Untrusted extension")
	
### Step 3 Verify that the extension side loaded 

Press  `ctl+alt+d` and click "Open Debug Hub". Locate the name of the sideloaded extension in the Debug pane.

### Step 4 Test and debug your extension

For general information about debugging and testing, see [top-extensions-debugging.md](top-extensions-debugging.md).

For information about debugging switches or feature flags, see [top-extensions-flags.md](top-extensions-flags.md).

### Step 5 Restore default configuration

If you used the `registerTestExtension` method, restore the original extension configuration for your user by clicking the "Restore default configuration", as in the following image.
	
 
![alt-text](../media/top-extensions-sideloading/restoreConfiguration.png "Default configuration")
	
To do this programmatically, run the following from the browser's Developer Tools console.

`MsPortalImpl.Extension.unregisterTestExtension ("<extensionName>");`
	 
Example 
 
`MsPortalImpl.Extension.unregisterTestExtension ("Microsoft_Azure_Demo");`
 

 {"gitdown": "include-file", "file": "../templates/portalfx-extensions-faq-sideloading.md"}

