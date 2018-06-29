
<a name="status-codes-and-error-messages"></a>
## Status Codes and Error Messages

Status codes or error messages that are encountered while developing an extension may be dependent on the type of extension that is being created, or the development phase in which the message is encountered.  Terms that are encountered in the error messages may be defined in the [Glossary](portalfx-extensions-glossary-status-codes.md).
<!-- TODO:  Find at least one status code for each of these conditions. -->

<a name="status-codes-and-error-messages-console-error-messages"></a>
### Console Error Messages

***Console error messages in F12 developer tools***

Some console and HTTP error messages are located at [https://msdn.microsoft.com/en-us/library/dn423949](https://msdn.microsoft.com/en-us/library/dn423949).

* * *

<a name="status-codes-and-error-messages-unknown-entity-typed-object-array"></a>
### UNKNOWN ENTITY-TYPED OBJECT ARRAY

***Error: "Entity-typed object/array is not known to this edit scope..."***

DESCRIPTION: After an `EditScope` is initialized and loaded, entities can be introduced and removed from the `EditScope` only by using `EditScope` APIs. Unfortunately, extensions cannot make an observable change to add or remove 'entity' objects from the `EditScope`. If an extension tries to make an observable change that introduces an 'entity' object into the EditScope, they will encounter this error. For any object residing in the `EditScope`, merely adding and removing keys cannot be detected by `EditScope` or by the FX at large and, consequently, edits cannot be tracked. When an extension attempts to add or remove keys from an `EditScope` object, this puts the `EditScope` edit-tracking in an inconsistent state.

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

<a name="status-codes-and-error-messages-form-improperly-allows-edits"></a>
### Form improperly allows edits

*** Error: Form should not allow edits until an EditScope is loaded***

ERROR:

This error is commonly the result of making an observable change to `EditScope` data that is not due to the user making edits in the UI.   For example, establishing default values by writing to `EditScope` observables when a viewModel is initializing might cause this error.

SOLUTION: 

Extensions should use the `mapIncomingDataForEditScope` option when instantiating `ParameterProvider`, in order to establish initial values in the `EditScope`.

* * *

<a name="status-codes-and-error-messages-err_connection_reset"></a>
### ERR_CONNECTION_RESET

***Cannot load `localhost` Ibiza extension with ERR_CONNECTION_RESET***

ERROR: The Storage Area Network (SAN) is missing in the certificate.

SOLUTION: [https://stackoverflow.microsoft.com/questions/48581/cannot-load-localhost-ibiza-extension-with-err-connection-reset/49595#49595](https://stackoverflow.microsoft.com/questions/48581/cannot-load-localhost-ibiza-extension-with-err-connection-reset/49595#49595)

* * * 

<a name="status-codes-and-error-messages-err_insecure_response"></a>
### ERR_INSECURE_RESPONSE

ERR_INSECURE_RESPONSE in the browser console

***My Extension fails to sideload and I get an ERR_INSECURE_RESPONSE in the browser console***.
   
![alt-text](../media/portalfx-productiontest/errinsecureresponse.png "ERR_INSECURE_RESPONSE Log")

ERROR: the browser is trying to load the extension but the SSL certificate from localhost is not trusted.

SOLUTION: Install and trust the certificate.

* * *

<a name="status-codes-and-error-messages-failed-to-initialize"></a>
### Failed To Initialize

ERROR: The extension failed to initialize. One or more calls to methods on the extension's entry point class failing.

SOLUTION: Scan all the relevant error messages during the timeframe of the failure. These errors should have information about what exactly failed while trying to initialize the extension, e.g. the initialize endpoint, the getDefinition endpoint, etc.

* * * 

<a name="status-codes-and-error-messages-first-response-not-received"></a>
### First Response Not Received

ERROR: The shell loaded the extension URL obtained from the config into an IFrame; however there wasn't any response from the extension.

SOLUTION: 

1. Verify that the extension is correctly hosted and accessible from the browser.

1. The extension should have code injected in the  `layout.cshtml` which includes a postMessage call. Verify that this code gets executed.

* * * 

<a name="status-codes-and-error-messages-invalid-definition"></a>
### Invalid Definition

ERROR: The definition that was received from an extension had validation errors.

SOLUTION: Scan the error logs for all the validation errors in the extension definition and fix them.

* * * 



<a name="status-codes-and-error-messages-invalid-extension-name"></a>
### Invalid Extension Name

ERROR: The name of the extension as specified in the `extensions.json` configuration file doesn't match the name of the extension in the extension manifest.

SOLUTION: Verify what the correct name of the extension should be, and if the name in config is incorrect, update it.

If the name in the manifest is incorrect, contact the relevant extension team to update the  `<Extension>` tag in the PDL file with the right extension name and recompile.

* * * 

<a name="status-codes-and-error-messages-invalid-indicate-loaded"></a>
### Invalid Indicate Loaded

ERROR: The manifest for an extension was received at an invalid time. e.g. if the manifest was already obtained or the extension was already loaded.

SOLUTION: Report this issue to the framework team for investigation.

* * * 

<a name="status-codes-and-error-messages-invalid-manifest"></a>
### Invalid Manifest

ERROR: The manifest that was received from an extension had validation errors.

SOLUTION: Scan the error logs for all the validation errors in the extension manifest and fix them.

* * * 

<a name="status-codes-and-error-messages-manifest-not-received"></a>
### Manifest Not Received

ERROR: The bootstrap logic was completed, however the extension did not return a manifest to the shell. The shell waits for a period of time (currently 40 seconds as of 2014/10/06) and then times out.

SOLUTION:
1. Verify that the extension is correctly hosted and accessible from the browser.

1. If the extension is using AMD modules, verify that the `manifest.js` file is accessible from the browser. Under default settings it should be present at `/Content/Scripts/_generated/manifest.js`.


* * * 

<a name="status-codes-and-error-messages-server-error-404"></a>
### Server Error 404

ERROR: 404, Not Found.

DESCRIPTION: The Portal's built-in data layer automatically detects HTTP 404 responses from **AJAX** calls, in order to cover the most common scenarios.  When a part depends on data and a 404 has been detected, Ibiza automatically makes the part non-interactive and displays a message of 'Not Found'.  The effect is that in most "not found" scenarios, extensions will display the more accurate 'Not found' message instead of the sad cloud UX that is reserved for unexpected errors.

This distinction allows the Portal telemetry system to differentiate between bugs and deleted assets when parts  fail to render.

SOLUTION: Extensions should allow the Portal to handle 404 responses by default. However, there are exceptions where this behavior may not be the best action.  In those cases, the extension can opt out of automatic 404 handling by setting the `showNotFoundErrors` flag to `false` when creating the extension's `dataViews`. The following code makes 404s result in rejected promises, which allows individual extensions to apply special handling.

```js
this._dataView = dataContext.createView(container, { interceptNotFound: false });
```

**NOTE**: Instances of 'Not Found' do not count against a part's reliability KPI.



<a name="status-codes-and-error-messages-internal-server-error-500"></a>
### Internal Server Error 500

ERROR: Received 500, Internal Server Error when loading the extension. The extension logs the message "*Unable to find AMD modules '_generated/Manifest'*".

SOLUTION:

1. Make sure the **JavaScript** files are embedded as resources in the extension assembly. To see embedded resources, open the assembly in Reflector or some similar tool and explore resources. It should display `<YourExtensionNamespace>/Content/ … /_generated/Manifest.js` and with similar resources, although the dots and slashes are interchangeable. 

1. If those resources are embedded, make sure the assembly contains the following attribute.

    `[assembly: AllowEmbeddedContent("<YourExtensionNamespace>")]` 
    
    This indicates that the **JavaScript** is an embedded resource with this prefix.

* * *

<a name="status-codes-and-error-messages-portal-error-520"></a>
### Portal Error 520

***The Portal encountered a part it cannot render***

ERROR: The Portal displays a 520 error, as in the following image.

![alt-text](../media/portalfx-debugging/failure.png "Portal Error Message")

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

<a name="status-codes-and-error-messages-sandboxed-iframe-security"></a>
### Sandboxed iframe security

***Error: 'Security of a sandboxed iframe is potentially compromised by allowing script and same origin access'.***
 
The Azure Portal should frame the extension URL, as specified in [top-extensions-getting-started.md](top-extensions-getting-started.md) and [portalfx-extensions-key-components.md](portalfx-extensions-key-components.md).  Also see [#console-error-messages](#console-error-messages).

* * *

<a name="status-codes-and-error-messages-timed-out"></a>
### Timed Out

ERROR: The extension failed to load after the predefined timeout, which is currently 40 seconds.

SOLUTION: Scan the errors to see if there are any other relevant error messages during the time frame of the failure.

* * * 

<a name="status-codes-and-error-messages-too-many-bootgets"></a>
### Too Many BootGets

ERROR: The extension tried to send the bootGet message to request for Fx scripts multiple times. The error should specify the number of times it refreshed before the extension was disabled.

SOLUTION:  Scan the errors to see if there are any other relevant error messages during the time frame of the failure.

* * * 

<a name="status-codes-and-error-messages-too-many-refreshes"></a>
### Too Many Refreshes

ERROR: The extension tried  to reload itself within the IFrame multiple times. The error should specify the number of times it refreshed before the extension was disabled.

SOLUTION: Scan the errors to see if there are any other relevant error messages during the time frame of the failure.

* * * 
