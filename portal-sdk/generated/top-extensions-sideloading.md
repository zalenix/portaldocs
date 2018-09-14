
<a name="sideloading-an-extension"></a>
# Sideloading an Extension

<a name="sideloading-an-extension-overview"></a>
## Overview
   
Sideloading allows the testing and debugging of extensions locally against any environment. When unit-testing the extension, the developer can instruct the Portal to load the extension for a specific user session from any source other than the `uri` that is registered in the Portal. During standard Portal use, the Portal web application loads the extension from a URL that is part of the Portal's configuration, as specified in the environment configuration file(s) for the extension. Sideloading helps the developer validate that the extension is ready for standard Portal use in private preview or public preview mode. Sideloading allows the developer to include hotfixes, customize the extension for different environments, or test a new extension.  It can also be used to test an existing extension on a developer's machine with production credentials, in addition to private preview and some forms of usability testing.

Extensions can be loaded on a per-user basis on production deployments.  The different types of deployment for testing are in the following image.

![alt-text](../media/portalfx-extensions-sideloading/sideloading.png "Testing Extensions Versions in Separate Locations")

Sideloading is useful when testing multiple versions of an extension, or determining which features should remain in various editions of an extension. For example, an English-language extension may have other UX editions that include localization for various languages, each of which may ship separately when the extension is deployed or geodistributed. The sideloaded extension can be loaded using a query string, or it can be loaded programmatically with the `registerTestExtension` method, which is the preferred method of testing.

Sideloading is performed on the local host by using [query strings](#query-strings), or it can be performed in any environment by [registering with the registerTestExtension API](#registering-with-the-registertestextension-api).

For more information about extension and Portal architecture, see [top-extensions-architecture.md](top-extensions-architecture.md).

For more information about testing extensions in the hosting service, see  [top-extensions-hosting-service-scenarios.md#sideloading](top-extensions-hosting-service-scenarios.md#sideloading). 

* * *

<a name="sideloading-an-extension-overview-query-strings"></a>
### Query strings

The main difference between sideloading and testing in production is whether the test can use a query string. The query string can only be used if the extension is on the localhost. There are also special types of testing like hotfixes or working with multiple names or friendly names while hosting.

The following is the syntax of a query string that can be used to load an extension by using the address bar in the browser.

```<protocol>://<environment>/?feature.canmodifyextensions=true#?testExtensions={"<extensionName>":"<protocol>://<endpoint>:<portNumber>"[,<settings>]}```

or 

```<protocol>://<environment>/?feature.canmodifyextensions=true#?testExtensions={"<extensionName>":"<protocol>://<uri>/"}```

where

**protocol**: Matches the protocol of the shell into which the extension is loaded, without the angle brackets.  It can have a value of `HTTPS`.  If the value is not  `HTTPS`, the browser will not allow the extension to communicate and the extension will not sideload.  If you have not trusted the certificate that **IIS Express** uses for localhost, the extension will fail to side load. For more information, see [portalfx-extensions-faq-sideloading.md#extension-will-not-sideload](portalfx-extensions-faq-sideloading.md#extension-will-not-sideload).

**environment**: Portal environment in which to load the extension. Portal environments are `portal.azure.com`, `rc.portal.azure.com`, `mpac.portal.azure.com`, and `df.onecloud.azure-test.net`.

**feature.canmodifyextensions**: Required to support loading untrusted extensions for security purposes.  This feature flag grants permission to the Portal to load extensions from URLs other than the ones that are typically used by customers.  It triggers an additional Portal UI that indicates that the Portal is running with untrusted extensions. This feature flag has a value of `true`.  For more information about feature flags, see [top-extensions-flags.md](top-extensions-flags.md).

**testExtensions**: Contains the name of the extension, and the environment in which the extension is located. It specifies the intent to load the extension `<extensionName>` from the `localhost:<portNumber>` into the current session of the Portal.

**extensionName**: Matches the name of the extension, without the angle brackets, as specified in the `<Extension>` element  in the  `extension.pdl` file.  For more information about the configuration file, see [portalfx-extensions-configuration-overview.md](portalfx-extensions-configuration-overview.md).

**endpoint**: The localhost, or the computer on which the extension is being developed. The endpoint, or the computer that is being used for testing the extension. The extension endpoint when using a host other than `localhost` may also be the server where the extension will be hosted.

**settings**: Optional. Boolean value that registers the extension in the Portal for a specific timeframe. A value of `true` means that the registered extension will run only for the current browser session.  A value of `false` means that the registered extension is valid across browser sessions. This state is saved in the browser's local storage. The default value is `false`.

**uri**: Defines the extension endpoint. If there is a port number associated with the extension, it can be appended to the `uri` by separating it from the `uri` by a colon. The uri is formatted as  `"https://<serverName>:<portNumber>"`, where 

**serverName**: The server where the extension will be hosted.

**portNumber**: The port number wher the extension is hosted on the endpoint that serves the extension, as in the following example: ```https://DemoServer:59344/```. 

The following complete URL and query string was built using the previous syntax.  It can be used to sideload the extension named "Microsoft_Azure_Demo" onto the localhost for testing. It also instructs the Portal to load from port 44300". It registers the extension only for the current user session.  

```?feature.canmodifyextensions=true#?testExtensions={"Microsoft_Azure_Demo":"https://localhost:44300/",true}```

### Registering with the registerTestExtension API

Registering an extension with the registerTestExtension API works in all cases. However, an extension can only be sideloaded using a query string on a localhost machine.

The developer may want to programmatically register a deployed extension with JavaScript and then reload the Portal. This step is optional. Using the `registerTestExtension` API for programmatic changes allows the developer to register an extension from `localhost`, or register an extension from a custom environment. 

Custom extensions that are used for testing can be loaded into the Portal by using feature flags. The `uriFormat` parameter, in conjunction with the `uri` parameter, can increase the number of extension editions that can be loaded in various Portal environments. These parameters are located in the `extensions.<EnvironmentName>.json` file, in conjunction with the `Client\extension.pdl` file. The edition of the extension that is loaded can be changed by modifying the `uri` and `uriFormat` parameters instead of using  **endpoint** and **portNumber** in the query string. 

To load an extension, extension developers can leverage the following approach.

<!-- TODO: Determine whether the registerTestExtension API can be used with the hosting service . If the registerTestExtension API allows use of a hosting service, find the example code so that the following sentence can be  re-included into the document:
  or load an extension from a custom environment using a hosting service.
 -->

 1. Sign in to a production account at [https://portal.azure.com?feature.canmodifyextensions=true](https://portal.azure.com?feature.canmodifyextensions=true)

1. Click **F12** to open the Developer Tools in the browser
  
1. Run one of the following commands in the browser console to register a custom extension.

    ```ts
    // use this command if the changes should persist 
    //  until the user resets the settings or
    //  executes MsPortalImpl.Extension.unregisterTestExtension("<extensionName>")
    //
    MsPortalImpl.Extension.registerTestExtension({ 
      name: "<extensionName>", 
      uri: "<protocol>://<endpoint>:<portNumber>" }
    );
 
    // use this command if the extension should be registered 
    //   only for the current Portal load
    //
    MsPortalImpl.Extension.registerTestExtension({
      name: "<extensionName>",
      uri: "<protocol>://<endpoint>:<portNumber>" }, 
      <settings>);
    ```

where

1. Reload the portal by navigating to [https://portal.azure.com?feature.canmodifyextensions=true&clientOptimizations=false](https://portal.azure.com?feature.canmodifyextensions=true&clientOptimizations=false).

1. Select the registered extension from the dashboard. Use the following code snippet to load the extension programmatically and register it in User Settings.

  ```ts
    MsPortalImpl.Extension.registerTestExtension({ name: "<extensionName>", uri: "https://<serverName>:<portNumber>" });
  ```

  Or, use the following code to registers the extension only for the current browser session.

 ```ts
   MsPortalImpl.Extension.registerTestExtension({ name:  "<extensionName>", uri: "https://<serverName>:<portNumber>"}, true);
```

  The extension that was registered will be saved to User Settings, and will be available in future sessions. When the Portal is used in this mode, it displays a banner that indicates that the state of the configured extensions has been changed, as in the following image.

  ![alt-text](../media/portalfx-productiontest/localExtensions.png "Local extensions")

For information about debugging switches or feature flags, see  [top-extensions-flags.md](top-extensions-flags.md).

For information about regular debugging and testing, see [top-extensions-debugging.md](top-extensions-debugging.md). 

For more information on loading, see [top-extensions-csharp-test-framework.md#creating-the-test-project](top-extensions-csharp-test-framework.md#creating-the-test-project). 

<a name="sideloading-an-extension-unregistering-test-extensions"></a>
## Unregistering test extensions

When testing is completed, the developer can run the `unregisterTestExtension` method in the Developer Tools Console to reset the user settings and unregister the extension, as in the following example.

```ts
  MsPortalImpl.Extension.unregisterTestExtension("<extensionName>");
```

<a name="sideloading-an-extension-completing-the-extension-test"></a>
## Completing the extension test

When all steps are complete, the developer can submit a pull request to enable the extension, as specified in [top-extensions-publishing.md](top-extensions-publishing.md). When the extension is enabled, users will be able to access it in all environments, as specified in [top-extensions-developmentPhases.md](top-extensions-developmentPhases.md).

<a name="sideloading-an-extension-common-uses-for-custom-extensions"></a>
## Common uses for custom extensions

There are several scenarios in which a developer might test various ideas for an extension by using  different editions. Three of them are as follows. 

1. Running automated tests

    Automated tests that run against a production environment should be marked as test/synthetic traffic. Use one of the following options to accomplish this.

   1. Add the `TestTraffic` phrase to the `userAgentString` field. Replace `TeamName` and `Component` in the following example with the appropriate values, without the angle brackets.

      ```TestTraffic-<TeamName>-<Component>  ```

   1. Set the query string parameter to `feature.UserType=test`.  This setting excludes test traffic from our reports.

1. Running regression tests

   Regression tests and build verification tests only verify that the new extension runs, without performing extensive code coverage checks. For example, they may be used to validate that interfaces connect, which is not the same as testing the validity of the data or processes that use the interface.  They may also exercise only specific functionality within the extension.
  
1. Obsolete script bundles

    If the extension uses deprecated features that have been moved to obsolete script bundles, then the ```obsoleteBundlesBitmask``` flag should be specified, as in the following example.

    ```
      MsPortalImpl.Extension.registerTestExtension({
          name: "extensionName",
          uri: "https://<endpoint>:<portNumber>",
          obsoleteBundlesBitmask: 1 // or the relevant value as appropriate.
      });
    ```

    The current list of obsoleted bundles is in the following table.

    | Definition file | Flag  |  Bundle description | 
    | ---             | ---   | --- |
    | Obsolete0.d.ts  | 1     | Parameter collector V1/V2 |
    | Obsolete1.d.ts  | 2     | CsmTopology control | 

    For example, if parameter collector V1/V2 is used, then the `obsoleteBundlesBitmask` flag should have a value of  1. If the extension uses both parameter collector V1/V2 and CsmTopology control, specify 3 (1 + 2).

    **NOTE**:  If the extension uses obsolete bundles, there may be a performance penalty when it is loaded.  Its performance can be  improved by migrating away from these dependencies, i.e. PCV1, PCV2 and  `CsmTopology` control. For more information about improving extension performance, see [portalfx-extensions-configuration-procedure.md#pcv1-and-pcv2-removal](portalfx-extensions-configuration-procedure.md#pcv1-and-pcv2-removal).

    For more information about obsolete bundles and obsolete script bundles, see [portalfx-extension-reference-obsolete-bundle.md](portalfx-extension-reference-obsolete-bundle.md).


<a name="sideloading-an-extension-best-practices"></a>
## Best Practices
   
***What is the best environment for sideloading during initial testing?***

 The FAQs for debugging extensions is located at [portalfx-extensions-faq-hosting-service.md](portalfx-extensions-faq-hosting-service.md).

* * *

<a name="sideloading-an-extension-best-practices-onebox-stb-is-not-available"></a>
### Onebox-stb is not available

Onebox-stb has been deprecated. Please do not use it. Instead, migrate extensions to sideloading. For help on migration, send an email to  <a href="mailto:ibiza-onboarding@microsoft.com?subject=Help on Migration">ibiza-onboarding@microsoft.com</a>.

* * * 

<a name="sideloading-an-extension-frequently-asked-questions"></a>
## Frequently asked questions

***Where are the FAQ's for normal debugging?***

The FAQs for debugging extensions is located at [portalfx-extensions-faq-debugging.md](portalfx-extensions-faq-debugging.md).

* * *

<a name="sideloading-an-extension-frequently-asked-questions-sandboxed-iframe-security"></a>
### Sandboxed iframe security

*** I get an error 'Security of a sandboxed iframe is potentially compromised by allowing script and same origin access'. How do I fix this? ***

You need to allow the Azure Portal to frame your extension URL. For more information, [click here](portalfx-creating-extensions.md).

* * *

<a name="sideloading-an-extension-frequently-asked-questions-extension-will-not-sideload"></a>
### Extension will not sideload

*** My Extension fails to side load and I get an ERR_INSECURE_RESPONSE in the browser console ***

![ERR_INSECURE_RESPONSE](../media/portalfx-productiontest/errinsecureresponse.png)

In this case the browser is trying to load the extension but the SSL certificate from localhost is not trusted the solution is to install/trust the certificate.

Please checkout the stackoverflow post: [https://stackoverflow.microsoft.com/questions/15194/ibiza-extension-unable-to-load-insecure](https://stackoverflow.microsoft.com/questions/15194/ibiza-extension-unable-to-load-insecure)

Items that are specifically status codes or error messages can be located in [portalfx-extensions-status-codes.md](portalfx-extensions-status-codes.md).

* * *

<a name="sideloading-an-extension-frequently-asked-questions-sideloading-in-chrome"></a>
### Sideloading in Chrome

***Ibiza sideloading in Chrome fails to load parts***
    
Enable the `allow-insecure-localhost` flag, as described in [https://stackoverflow.microsoft.com/questions/45109/ibiza-sideloading-in-chrome-fails-to-load-parts](https://stackoverflow.microsoft.com/questions/45109/ibiza-sideloading-in-chrome-fails-to-load-parts)

* * *

<a name="sideloading-an-extension-frequently-asked-questions-sideloading-in-chrome-sideloading-gallery-packages"></a>
#### Sideloading gallery packages

***Trouble sideloading gallery packages***

SOLUTION:  Some troubleshooting steps are located at [https://stackoverflow.microsoft.com/questions/12136/trouble-side-loading-gallery-packages](https://stackoverflow.microsoft.com/questions/12136/trouble-side-loading-gallery-packages)

* * *

<a name="sideloading-an-extension-frequently-asked-questions-sideloading-in-chrome-sideloading-friendly-names"></a>
#### Sideloading friendly names

***Sideloading friendly names is not working in the Dogfood environment***

In order for Portal to load a test version of an extension, i.e., load without using the PROD configuration, developers can append the feature flag `feature.canmodifystamps`. The following example uses the sideload url to load the "test" version of extension.

`https://portal.azure.com?feature.canmodifystamps=true&<extensionName>=test`

The parameter `feature.canmodifystamps=true` is required for side-loading, and 
 **extensionName**, without the angle brackets, is replaced with the unique name of extension as defined in the `extension.pdl` file. For more information, see [https://stackoverflow.microsoft.com/questions/64951/extension-hosting-service-side-loading-friendlynames-not-working-in-dogfood](https://stackoverflow.microsoft.com/questions/64951/extension-hosting-service-side-loading-friendlynames-not-working-in-dogfood).

* * *

<a name="sideloading-an-extension-frequently-asked-questions-other-testing-questions"></a>
### Other testing questions

***How can I ask questions about testing ?***

You can ask questions on Stackoverflow with the tag [ibiza-test](https://stackoverflow.microsoft.com/questions/tagged/ibiza-test).


<a name="sideloading-an-extension-status-codes-and-error-messages"></a>
## Status Codes and Error Messages

Status codes or error messages that are encountered while developing or supporting an extension may be dependent on the type of extension that is being created, or the development phase in which the message is encountered.  Terms that are encountered in the error messages may be defined in the [Glossary](top-extensions-glossary.md).

<!-- TODO:  Find at least one status code for each of these conditions. -->

The following errors may be encountered during different phases of extension development and maintenance.  Error states that are specific to performance are located at [#error-states](#error-states). 

<a name="sideloading-an-extension-status-codes-and-error-messages-console-error-messages"></a>
### Console Error Messages

***Console error messages in F12 developer tools***

Some console and HTTP error messages are located at [https://msdn.microsoft.com/en-us/library/dn423949](https://msdn.microsoft.com/en-us/library/dn423949).

* * *

<a name="sideloading-an-extension-status-codes-and-error-messages-err_connection_reset"></a>
### ERR_CONNECTION_RESET

***Cannot load `localhost` Ibiza extension with ERR_CONNECTION_RESET***

ERROR: The Storage Area Network (SAN) is missing in the certificate.

SOLUTION: [https://stackoverflow.microsoft.com/questions/48581/cannot-load-localhost-ibiza-extension-with-err-connection-reset/49595#49595](https://stackoverflow.microsoft.com/questions/48581/cannot-load-localhost-ibiza-extension-with-err-connection-reset/49595#49595)

* * * 

<a name="sideloading-an-extension-status-codes-and-error-messages-err_insecure_response"></a>
### ERR_INSECURE_RESPONSE

ERR_INSECURE_RESPONSE in the browser console

***My Extension fails to sideload and I get an ERR_INSECURE_RESPONSE in the browser console***.
   
![alt-text](../media/portalfx-productiontest/errinsecureresponse.png "ERR_INSECURE_RESPONSE Log")

ERROR: the browser is trying to load the extension but the SSL certificate from localhost is not trusted.

SOLUTION: Install and trust the certificate.

* * *

<a name="sideloading-an-extension-status-codes-and-error-messages-failed-to-initialize"></a>
### Failed To Initialize

ERROR: The extension failed to initialize. One or more calls to methods on the extension's entry point class failing.

SOLUTION: Look for the error code and if it is present, view the call stack in the  message to get more details. Scan all the relevant error messages in the events table during the timeframe of the failure. These errors should have information about what exactly failed while trying to initialize the extension, for example, the initialize endpoint or the getDefinition endpoint.

* * * 

<a name="sideloading-an-extension-status-codes-and-error-messages-first-response-not-received"></a>
### First Response Not Received

ERROR: The shell loaded the extension URL obtained from the config into an IFrame; however there wasn't any response from the extension.

SOLUTION: 

1. Verify that the extension is correctly hosted and accessible from the browser.

1. The extension should have code injected in the  `layout.cshtml` which includes a postMessage call. Verify that this code gets executed.

Otherwise, use the following steps.

1. Scan the events table to see if there are any other relevant error messages during the time frame of the alert. 

1. Open the extension URL directly in the browser - it should show the default page for the extension. 

1. Open the dev tools network tab in your browser and try opening the extension URL by appending the following query string parameter `sessionId=testSessionId`. This should open a blank page and all requests in the network tab should be 200 or 300 level responses with no failures. If there is a server error in the extension, it will be displayed with a call stack if it is available. In case the failures are from a CDN domain, check if the same URL is accessible from the extension domain. If so, the CDN might be corrupt/out of sync. In this case, flushing the CDN would mitigate the issue. |

* * * 

<a name="sideloading-an-extension-status-codes-and-error-messages-form-improperly-allows-edits"></a>
### Form improperly allows edits

***Form should not allow edits until an EditScope is loaded.***

ERROR:

This error is commonly the result of making an observable change to `EditScope` data that is not due to the user making edits in the UI.   For example, establishing default values by writing to `EditScope` observables when a viewModel is initializing might cause this error.

SOLUTION: 

Extensions should use the `mapIncomingDataForEditScope` option when instantiating `ParameterProvider`, in order to establish initial values in the `EditScope`.

* * *

<a name="sideloading-an-extension-status-codes-and-error-messages-invalid-definition"></a>
### Invalid Definition

ERROR: The definition that was received from an extension had validation errors.

SOLUTION: Scan the error logs for all the validation errors in the extension definition and fix them.

* * * 

<a name="sideloading-an-extension-status-codes-and-error-messages-invalid-extension-name"></a>
### Invalid Extension Name

ERROR: The name of the extension as specified in the `extensions.json` configuration file doesn't match the name of the extension in the extension manifest.

SOLUTION: Verify what the correct name of the extension should be, and if the name in config is incorrect, update it.

If the name in the manifest is still incorrect, contact the relevant extension team to update the  `<Extension>` tag in their PDL file with the right extension name and recompile.

* * * 

<a name="sideloading-an-extension-status-codes-and-error-messages-invalid-indicate-loaded"></a>
### Invalid Indicate Loaded

ERROR: The manifest for an extension was received at an invalid time. e.g. if the manifest was already obtained or the extension was already loaded.

SOLUTION: Report this issue to the framework team for investigation.

* * * 

<a name="sideloading-an-extension-status-codes-and-error-messages-invalid-manifest"></a>
### Invalid Manifest

ERROR: The manifest that was received from an extension had validation errors. 

SOLUTION: Scan the error logs for all the validation errors in the extension manifest and fix them.

* * * 

<a name="sideloading-an-extension-status-codes-and-error-messages-internal-server-error-500"></a>
### Internal Server Error 500

ERROR: Received 500, Internal Server Error when loading the extension. The extension logs the message "*Unable to find AMD modules '_generated/Manifest'*".

SOLUTION:

1. Make sure the **JavaScript** files are embedded as resources in the extension assembly. To see embedded resources, open the assembly in Reflector or some similar tool and explore resources. It should display `<YourExtensionNamespace>/Content/ … /_generated/Manifest.js` and with similar resources, although the dots and slashes are interchangeable. 

1. If those resources are embedded, make sure the assembly contains the following attribute.

    `[assembly: AllowEmbeddedContent("<YourExtensionNamespace>")]` 
    
    This indicates that the **JavaScript** is an embedded resource with this prefix.

* * *

<a name="sideloading-an-extension-status-codes-and-error-messages-manifest-not-received"></a>
### Manifest Not Received

ERROR: The bootstrap logic was completed, however the extension did not return a manifest to the shell. The shell waits for a period of time, approximately 40 seconds, and then times out.

SOLUTION:

1. Verify that the extension is correctly hosted and accessible from the browser.

1. If the extension is using AMD modules, verify that the `manifest.js` file is accessible from the browser. Under default settings it should be present at `/Content/Scripts/_generated/manifest.js`.

1. Open the dev tools network tab in your browser and try opening the extension URL, appending the following query string parameter `sessionId=testSessionId`. This should open a blank page and all requests in the network tab should be 200 or 300 level responses, with no failures. If there is a server error in the extension, the browser  will display  the error and a call stack if available. 

1. If the failures are from a CDN domain, determine whether the same URL is accessible from the extension domain.  If so, the CDN might be corrupt or out of sync. In this case, flushing the CDN would mitigate the issue. 

1. Scan the events table to see if there are any other relevant error messages during the time frame of the alert.

* * * 

<a name="sideloading-an-extension-status-codes-and-error-messages-portal-error-520"></a>
### Portal Error 520

***The Portal encountered a part it cannot render***

ERROR: The Portal displays a 520 error, as in the following image.

![alt-text](../media/top-legacy-parts/failure.png "Portal Error Message")

The Web server is returning an unknown error. 

SOLUTION: Use the following troubleshooting steps.

* Check the browser console, and look for errors that describe the error condition in more detail. 
* Click on the failed part. With some types of errors, this will add a stack trace to the browser console.
* Double check the Knockout template for correct syntax.
* Ensure that all variables that are used in the template are public properties on the corresponding view model class.
* Reset the desktop state.
* Enable first chance exceptions in the JavaScript debugger.
* Set break points inside the viewModel constructor to ensure no errors are thrown.

* * *

<a name="sideloading-an-extension-status-codes-and-error-messages-server-error-404"></a>
### Server Error 404

ERROR: 404, Not Found.

DESCRIPTION: The Portal's built-in data layer automatically detects HTTP 404 responses from **AJAX** calls, in order to cover the most common scenarios.  When a part depends on data and a 404 has been detected, Ibiza automatically makes the part non-interactive and displays a message of 'Not Found'.  The effect is that in most "not found" scenarios, extensions will display the more accurate 'Not found' message instead of the sad cloud UX that is reserved for unexpected errors.

This distinction allows the Portal telemetry system to differentiate between bugs and deleted assets when parts  fail to render.

SOLUTION: Extensions should allow the Portal to handle 404 responses by default. However, there are exceptions where this behavior may not be the best action.  In those cases, the extension can opt out of automatic 404 handling by setting the `showNotFoundErrors` flag to `false` when creating the extension's `dataViews`. The following code makes 404s result in rejected promises, which allows individual extensions to apply special handling.

```js
this._dataView = dataContext.createView(container, { interceptNotFound: false });
```

**NOTE**: Instances of 'Not Found' do not count against a part's reliability KPI.

* * * 

<a name="sideloading-an-extension-status-codes-and-error-messages-sandboxed-iframe-security"></a>
### Sandboxed iframe security

***Error: 'Security of a sandboxed iframe is potentially compromised by allowing script and same origin access'.***
 
The Azure Portal should frame the extension URL, as specified in [top-extensions-getting-started.md](top-extensions-getting-started.md) and [portalfx-extensions-key-components.md](portalfx-extensions-key-components.md).  Also see [#console-error-messages](#console-error-messages).

* * *

<a name="sideloading-an-extension-status-codes-and-error-messages-timed-out"></a>
### Timed Out

ERROR: The extension failed to load after the predefined timeout, which is currently 40 seconds.

SOLUTION: Scan the events table or the errors to see if there are any other relevant error messages during the time frame of the failure.  Also, analyze the error messages to try to deduce whether the problem is on the extension side or the shell. If the issue is with the extension, look at CPU utilization of the cloud service instances. High CPU utilization might explain why clients are timing out when requesting resources from the server. |

* * * 

<a name="sideloading-an-extension-status-codes-and-error-messages-too-many-bootgets"></a>
### Too Many BootGets

ERROR: The extension tried to send the bootGet message to request for Portal scripts multiple times. The error should specify the number of times it refreshed before the extension was disabled.

SOLUTION:  Scan the errors to see if there are any other relevant error messages during the time frame of the failure.

* * * 

<a name="sideloading-an-extension-status-codes-and-error-messages-too-many-refreshes"></a>
### Too Many Refreshes

ERROR: The extension tried  to reload itself within the IFrame multiple times. The error should specify the number of times it refreshed before the extension was disabled.

SOLUTION: Scan the errors to see if there are any other relevant error messages during the time frame of the failure.

* * * 

<a name="sideloading-an-extension-status-codes-and-error-messages-unknown-entity-typed-object-array"></a>
### UNKNOWN ENTITY-TYPED OBJECT ARRAY

***Error: "Entity-typed object/array is not known to this edit scope..."***

DESCRIPTION: After an `EditScope` is initialized and loaded, entities can be introduced and removed from the `EditScope` only by using `EditScope` APIs. Unfortunately, extensions cannot make an observable change to add or remove 'entity' objects from the `EditScope`. If an extension tries to make an observable change that introduces an 'entity' object into the EditScope, they will encounter this error. For any object residing in the `EditScope`, merely adding and removing keys cannot be detected by `EditScope` or by the Portal at large and, consequently, edits cannot be tracked. When an extension attempts to add or remove keys from an `EditScope` object, this puts the `EditScope` edit-tracking in an inconsistent state.

SOLUTION: To correctly add or remove 'entity' objects, use the API's that are specified in 
[top-legacy-editscopes.md#editScope-entity-arrays](top-legacy-editscopes.md#editScope-entity-arrays).
 It is good practice to use only observable changes and `EditScope` APIs to mutate/change the EditScope/Form model.   A partial list is as follows.

* `applyArrayAsEdits`: This API accepts a new array of 'entity' objects. The `EditScope` will diff this new array against the existing `EditScope` array items, determine which 'entity' objects are created/updated/deleted, and then records the corresponding user edits.

* `getCreated/addCreated`: Addes new, 'created' entity objects to an `EditScope`.

* `markForDelete`: Marks 'entity'  objects in an `EditScope`  for deletion.

DESCRIPTION: Often, extensions encounter this error because the data is modeled  as 'entities' binding with an editable grid in a `ParameterProvider` Blade as specified in [top-legacy-editscopes.md#editScope-entity-arrays](top-legacy-editscopes.md#editScope-entity-arrays).  The error may also be encountered when applying the array edits in a corresponding `ParameterCollector` Blade. 

SOLUTION:  Here are two schemes that can be used to avoid this error.

* Use the `applyArrayAsEdits` to commit array edits to an `EditScope`.

* Define type metadata for this array twice. One copy is for array items typed as 'entities', and is used to edit the data in an editable grid. The other copy is for array items typed as not 'entities', and is used to commit data to an `EditScope` in the `ParameterCollector` blade.  
  
* * *

<a name="sideloading-an-extension-error-states"></a>
## Error states

* [Alerting](#alerting-error-states)

* [Create](#create-error-states)

* [Performance](#performance-error-states)

* [Reliability](#reliability-error-states)

* [Telemetry](#telemetry-error-states)

<a name="sideloading-an-extension-alerting-error-states"></a>
## Alerting error states

<a name="sideloading-an-extension-create-error-states"></a>
## Create error states

<a name="sideloading-an-extension-performance-error-states"></a>
## Performance error states

<a name="sideloading-an-extension-reliability-error-states"></a>
## Reliability error states

Reliability error states are categorized  by extension, by blade, and by part. Errors that may be encountered in locations other than the Extension performance/reliability report that is located at [http://aka.ms/portalfx/dashboard/extensionperf](http://aka.ms/portalfx/dashboard/extensionperf) are  listed alphabetically within this document, located at [portalfx-extensions-status-codes.md](portalfx-extensions-status-codes.md).

<a name="sideloading-an-extension-reliability-error-states-extension-error-states"></a>
### Extension Error States

Correlate the error state with the action items to see the guided next steps.

| Error state  | Meaning | Action items |
| ------------ | ---------- | ------------ |
|  HomePageTimedOut |  The index page failed to load within the max time period  |  // Need steps to action on |
|   MaxRetryAttemptsExceeded | This a collation of the above events |   Inspect the sample message and follow appropriate step above |

<a name="sideloading-an-extension-reliability-error-states-blade-error-states"></a>
### Blade Error States

Correlate the error state with the action items to see the guided next steps.

| Error reason | Meaning | Action items |
| ------------ | ---------- | ------------ |
| ErrorInitializing | The Portal failed to initialize the blade due to an invalid definition. | Verify the PDL definition of the given blade. Verify the source opening the blade is sending the correct parameters. Review the **Kusto** ClientEvents table for   correlating events before the blade failure. |
|  ErrorLoadingExtension | The extension failed to load and therefore the blade was unable to load.   | Refer to the guidance provided for extension reliability  |
|  ErrorLoadingDefinition |     The Portal  was unable to retrieve the blade defintion from the Extension.   |       Review the **Kusto** ClientEvents table for   correlating events before the blade failure  |
| ErrorLoadingExtensionAndDefinition |            The Portal was unable to retrieve the blade definition from the Extension. |             Review the **Kusto** ClientEvents table for   correlating events before the blade failure |
| ErrorUnrecoverable |              The Portal failed to restore the blade during journey restoration because of an unexpected error. |         This should not occur, but if it does, file a shell bug using the site located at [http://aka.ms/portalfx/shellbug](http://aka.ms/portalfx/shellbug). |

<a name="sideloading-an-extension-reliability-error-states-part-error-states"></a>
### Part Error States

Correlate the error state with the action items to see the guided next steps.

| Error reason | Meaning | Action items |
| ------------ | ---------- | ------------ |
| TransitionedToErrorState  |         The part was unable to load and failed through its initialization or OnInputsSet  |          Consult the any_details column, there should be sample message explaining explicitly what the issue was. Commonly this is a nullRef. |
|      ErrorLocatingPartDefinition |    The Portal  was unable to determine the part definition. |   The likely cause of this is the extension has removed the part entirely from the PDL, this is not the guided pattern.             See deprecating parts for the explicit guidance. __NEED LINK__ |
|  ErrorAcquiringViewModel |  The Portal was unable to retrieve the part `ViewModel` from the Extension. |        You can correlate the start of thesample message with one of the below for common explanations. <br> *        ETIMEOUT - This may be caused by a flooding of the RPC layer. <br> *                      Script error - Dependent on the exact message, this may be due to timeouts/latency issues/connection problems. <br> *   Load timeout for modules - This may be caused by a slow or loss of connection. <br> *    description: - This is generic bucket, here the message will define the issue further. For example if there were null references<br>              For all the above if enough information was not provided via the message explore the raw events function or reference a sample session in            the ClientEvents kusto table as there should be correlating events before the failure.             |
|        ErrorLoadingControl |  The Portal  was unable to retrieve the control module. |  Reach out to the Ibiza team as specified in [portalfx-stackoverflow.md](portalfx-stackoverflow.md) if you see a large amount of these issues. |
|  ErrorCreatingWidget |   The Portal failed to create the widget. |   Check the sample message this is indicate the explicit reason why it failed, this was probably a ScriptError or failure to load the module. |
|  OldInputsNotHandled |        In this case a user has a pinned representation of a old version of the tile. The extension author has changed the inputs in a breaking fashion. | If this happens you need follow the guided pattern. __NEED LINK__ |

<a name="sideloading-an-extension-telemetry-error-states"></a>
## Telemetry error states

