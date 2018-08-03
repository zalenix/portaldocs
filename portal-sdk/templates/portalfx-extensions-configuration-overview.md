## Overview

You must register and configure your extension with the Ibiza team for your extension to be available in the Portal. We rely on you to manage your own configuration in the Portal repository. For internal partners, this is done by using pull requests, as specified in [top-extensions-publishing.md](top-extensions-publishing.md). External partners use the procedures that are located in [top-third-party-onboarding.md](top-third-party-onboarding.md).

External partners should also read this guide to understand the capabilities that Portal can provide for extensions by using configuration. However, external partner requests should be submitted by sending an email to <a href="mailto:ibizafxpm@microsoft.com?subject=&lt;Onboarding Request ID&gt; [number] Add [extensionName] extension to the Portal&body=Extension name: [Company]_[BrandOrSuite]_[ProductOrComponent] %0D %0D URLs: %0D %0D PROD:  main.[extensionName].ext.contoso.com %0D %0D Contact info: %0D %0D Business Contacts:%0D %0D Dev leads: %0D %0D PROD on-call email: %0D %0D">ibizafxpm@microsoft.com</a> instead of using the internal sites that are in this document. For more information for external partners, see [top-third-party-onboarding.md](top-third-party-onboarding.md).

The following links describe what a configuration file is and how to use it in different situations.

[Configuration file locations and structure](#configuration-file-locations-and-structure)

[Extension stamps and safe deployment](#extension-stamps-and-safe-deployment)

### Configuration file locations and structure

The extension configuration files contain information for all extensions registered in the Azure Portal. They are located in the Portal repository in the `src/RDPackages/OneCloud/` directory that is located at [https://aka.ms/portalfx/onecloud](https://aka.ms/portalfx/onecloud).

The configuration file for each environment that the Portal supports is in the following format.
 
 `Extensions.<EnvironmentName>.json`
 
where 

**EnvironmentName**: the name of the environment in which the extension configuration file will be located.  For example, ```Extensions.Prod.json``` contains the configuration for all extensions in the Production environment, and  `Extensions.dogfood.json` contains the configuration for all extensions in the Dogfood environment.

The following code is a typical extension configuration file.

```json
{
     name: "Microsoft_Azure_Demo",
     uri: "//demo.hosting.portal.azure.net/demo",
     uriFormat: "//demo.hosting.portal.azure.net/demo/{0}",
     feedbackEmail: "azureux-demo@microsoft.com",
     cacheability: "manifest",
     disabled: false,
}
```

Its options are as follows.

* **name**:  Required. The name for the extension, as specified in the `Client\extension.pdl` file of the extension project.
    
    <!--TODO: for more information about the extension.pdl file, see ...  although the pdl file is related, it is really a separate subject -->

  Typically, the ```extension.pdl``` file looks like the following.
    ```json
      <?xml version="1.0" encoding="utf-8" ?>
      <Definition xmlns="http://schemas.microsoft.com/aux/2013/pdl">
      <Extension Name="Microsoft_Azure_Demo" Version="1.0" EntryPointModulePath="Program"/>
      </Definition>
    ```
  The only option that the file contains that is relevant to extensions is as follows.

  **Extension Name**:  the name of the extension in the following format:  ```<Company>_<BrandOrSuite>_<ProductOrComponent>```

    Examples:  ```Contoso_Azure_<extensionName>``` , ```Nod_Publishers_Azure_<extensionName> ```

  If the extension is in preview mode then the preview tag should also be added, as in the following example. 

    ```<Extension Name="Microsoft_Azure_Demo" Version="1.0" Preview="true" EntryPointModulePath="Program"/>```
 
* **uri**: Required. The uniform resource identifier for the extension. This consists of the uri of the provider, followed by a forward slash, followed by the directory or path that contains the extension. 
   
   * Hosting service uri
 
      The following example contains the ```uri``` for an extension that is hosted by an extension hosting service.
    
      ```json
      uri: "//demo.hosting.portal.azure.net/demo",
      ```

      In the preceding example,  ```demo.hosting.portal.azure.net``` is the address of the provider and the second occurrence of ```demo``` is the directory or path that contains the extension.
   
   * Custom Deployment Hosting uri

      The following example contains the ```uri``` for teams who own their own custom deployments.
    
      ```json
      uri: "//main.demo.ext.azure.com",
      ```

      In the preceding example, ```main.demo.ext.azure.com```  is the address of the provider of the extension.

      **NOTE**: For extensions that are not using the hosting service, we recommend that the `uri` follow the standard CNAME pattern, as specified in [portalfx-extensions-cnames.md](portalfx-extensions-cnames.md). 

  When the user loads the extension in the Portal, it is loaded from the `uri` specified in the extension configuration. To update the ```uri```, send a pull request as specified in [top-extensions-publishing.md](top-extensions-publishing.md). Additional extension configurations can be loaded by specifying the configuration name in the  `uri` and specifying the feature flag `feature.canmodifystamps=true`. For more information about feature flags, see [top-extensions-flags.md](top-extensions-flags.md).

* **uriFormat**: Required. The `uri` for the extension, followed by a forward slash, followed by a parameter marker that specifies the environment from which to load the extension.
    
  * Hosting service uriFormat

    The following code contains the `uriFormat` for an extension that is hosted by a hosting service.
    
    ```json
      uriFormat: "//demo.hosting.portal.azure.net/demo/{0}",
    ```

    In the preceding example,  ```demo.hosting.portal.azure.net``` is the address of the extension, ```demo``` is the name of the directory or path that contains the extension, and ``` {0} ``` is the parameter marker that will contain the value to substitute into the name string. The substitution specifies the environment from which to load the extension.

  * Custom deployment Hosting uriFormat

    The following code describes the ```uriFormat``` parameter for extensions that have not yet onboarded a hosting service.

    ```json
      uri: "//main.demo.ext.azure.com",
      uriFormat: "//{0}.demo.ext.azure.com",
    ```

    In the preceding example, ```main.demo.ext.azure.com``` is the address of the provider,  ```demo.ext.azure.com``` is the address of the extension, and ``` {0} ``` is the parameter marker that will contain the value to substitute into the name string. The substitution specifies the environment from which to load the extension. For example, if the parameter contains a value of "perf", then the uriFormat would be     ```uriFormat: "//perf.demo.ext.azure.com",```.

      **NOTE**: We recommend that the `uriFormat` follow  the standard CNAME pattern, as specified in  [portalfx-extensions-cnames.md](portalfx-extensions-cnames.md). 

  To update the `uriFormat`, send a pull request as specified in [top-extensions-publishing.md](top-extensions-publishing.md).
    
* **feedbackEmail**: Required. This is an email-based feedback mechanism. The Azure team directs extension feedback to this email when the extension is configured in its environment. When internal users visit ms.portal.azure.com they see a special **send feedback** button.  Whenever a user clicks that button while on one of your blades, the feedback is directed to this email.  To update the feedback email, send a pull request as specified in [top-extensions-publishing.md](top-extensions-publishing.md).

* **cacheability**: Required. Enables caching of the extension on your extension server or on the client. The default value is "manifest".
      
  If custom deployment is being used, then you will need to do some work before the value of the `cacheability` attribute can be set to ```manifest```. Otherwise, the extension will reduce the performance of Azure Portal.

  **NOTE**: Setting the value of the `cacheability` attribute to `manifest` is a requirement for registering the extension into the Portal.  For assistance with caching, send a pull request as specified in [top-extensions-publishing.md](top-extensions-publishing.md).
    
  For more information about caching, see [portalfx-performance-caching-homepage.md](portalfx-performance-caching-homepage.md).

* **disabled**: Optional. Registers the extension configuration into the Portal in hidden mode.  A value of  `true` disables an extension, and a value of `false` enables the extension for display. The default value is `false`. Ideally you would not disable your extension. Even if you want to hide your UX for a private preview or testing then there are ways to do this from within the extension, as specified in [top-extensions-developmentPhases.md](top-extensions-developmentPhases.md). To temporarily enable a disabled extension in private preview for this test session only, add an extension override in the Portal URL, as in the following example.
  
  ```
	https://portal.azure.com?Microsoft_Azure_Demo=true
  ```
  where `Microsoft_Azure_Demo` is the name of the extension as registered with the Portal.

  Conversely, the extension can temporarily be disabled for a session by changing this configuration attribute to a value of `false`. The extension cannot be temporarily enabled or disabled in the production environment.
  
  For more information about enabling and disabling extensions, see [portalfx-extensions-configuration-procedure.md#managing-the-configuration-of-the-extension](portalfx-extensions-configuration-procedure.md#managing-the-configuration-of-the-extension).  

  **NOTE**: If you disable your extension, you will need to add a future pull request to enable it later.  To get those changes deployed in a timely fashion and plan accordingly, see the [top-extensions-svc-lvl-agreements.md](top-extensions-svc-lvl-agreements.md).

* **flightUris**: Optional.  The uri concatenated to a friendly name in order to flight traffic to another stamp, as in the following example.  

  `//demo.hosting.portal.azure.net/demo/MPACFlight`

  For more information about MPAC flighting, see [portalfx-flighting.md#mpac-flighting](portalfx-flighting.md#mpac-flighting).
 
 <!--TODO: Update portalfx-extensions-migrate-existing-to-extensioncontrollerbase.md when it is determined that this flag should be here and/or in the feature flags document. -->
 
 * **scriptoptimze**: Leverage the performance optimizations in the base controller. A value of `true`  , whereas a value of `false` .

 For more information about loading extension configuration files, see [top-extensions-sideloading.md#loading-customized-extensions](top-extensions-sideloading.md#loading-customized-extensions).

### Extension stamps and safe deployment

The Azure Portal uses five different extension configuration files to manage the extension configuration. Because the hosting service provides a mechanism for deploying extensions using safe deployment practices, the Portal will load the version of the extension that is based on the region from where the customer is accessing the Portal. For more details, see the Hosting Service documentation located at [top-extensions-hosting-service.md](top-extensions-hosting-service.md).

If the custom deployment registration format is used, then the Portal will always serve the stamp that is registered in the ```uri```. For more informaton about mapping the extension configurations to the correct Portal environment, see [portalfx-extensions-cnames.md](portalfx-extensions-cnames.md).

Additional configurations can be accessed by using the ```uriFormat``` parameter that is specified in the extension config file.

To use a secondary configuration, specify the `feature.canmodifystamps` flag, and add a parameter that matches the name of the extension as registered in the Portal, as in the following example.

```json
name: "Microsoft_Azure_Demo",
uri: "//main.demo.ext.azure.com",
uriFormat: "//{0}.demo.ext.azure.com",
. . .
https://portal.azure.com?feature.canmodifystamps=true&Microsoft_Azure_Demo=perf 
```

 The Portal  will replace the ```{0}``` in the ```uriFormat``` string with ```perf```, and attempt to load the ```Microsoft_Azure_Demo``` extension from the ```https://perf.demo.ext.azure.com``` URL. The Portal always uses the  HTTPS protocol.

To override the configuration, specify the flag ```feature.canmodifystamps=true ```.  To specify an extension that is located in a specific stage, or that is associated with a specific build, use  `feature.canmodifystamps=true&<extensionName>=<StageName_Or_BuildNumber>`, where

**extensionName**: the name of the extension

 **StageName_Or_BuildNumber**:   The stage name or build number that is deployed to a specific stage, for example, stagename `stage1` or   `1d0d8d31` for  BuildNumber of 1.0.8.31. 
 
 **NOTE**: The dots in the build number are replaced with the letter "d".
 