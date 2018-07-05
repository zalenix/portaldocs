## Frequently asked questions

***Where are the FAQ's for normal debugging?***

The FAQs for debugging extensions is located at [portalfx-extensions-faq-debugging.md](portalfx-extensions-faq-debugging.md).

* * *

### Sandboxed iframe security

*** I get an error 'Security of a sandboxed iframe is potentially compromised by allowing script and same origin access'. How do I fix this? ***

You need to allow the Azure Portal to frame your extension URL. For more information, [click here](portalfx-creating-extensions.md).

* * *

### Extension will not sideload

*** My Extension fails to side load and I get an ERR_INSECURE_RESPONSE in the browser console ***

![ERR_INSECURE_RESPONSE](../media/portalfx-productiontest/errinsecureresponse.png)

In this case the browser is trying to load the extension but the SSL certificate from localhost is not trusted the solution is to install/trust the certificate.

Please checkout the stackoverflow post: [https://stackoverflow.microsoft.com/questions/15194/ibiza-extension-unable-to-load-insecure](https://stackoverflow.microsoft.com/questions/15194/ibiza-extension-unable-to-load-insecure)

Items that are specifically status codes or error messages can be located in [portalfx-extensions-status-codes.md](portalfx-extensions-status-codes.md).

* * *

### Sideloading in Chrome

***Ibiza sideloading in Chrome fails to load parts***
    
Enable the `allow-insecure-localhost` flag, as described in [https://stackoverflow.microsoft.com/questions/45109/ibiza-sideloading-in-chrome-fails-to-load-parts](https://stackoverflow.microsoft.com/questions/45109/ibiza-sideloading-in-chrome-fails-to-load-parts)

* * *

#### Sideloading gallery packages

***Trouble sideloading gallery packages***

SOLUTION:  Some troubleshooting steps are located at [https://stackoverflow.microsoft.com/questions/12136/trouble-side-loading-gallery-packages](https://stackoverflow.microsoft.com/questions/12136/trouble-side-loading-gallery-packages)

* * *

#### Sideloading friendly names

***Sideloading friendly names is not working in the Dogfood environment***

In order for Portal to load a test version of an extension, i.e., load without using the PROD configuration, developers can append the feature flag `feature.canmodifystamps`. The following example uses the sideload url to load the "test" version of extension.

`https://portal.azure.com?feature.canmodifystamps=true&<extensionName>=test`

The parameter `feature.canmodifystamps=true` is required for side-loading, and 
 **extensionName**, without the angle brackets, is replaced with the unique name of extension as defined in the `extension.pdl` file. For more information, see [https://stackoverflow.microsoft.com/questions/64951/extension-hosting-service-side-loading-friendlynames-not-working-in-dogfood](https://stackoverflow.microsoft.com/questions/64951/extension-hosting-service-side-loading-friendlynames-not-working-in-dogfood).

* * *

### Other testing questions

***How can I ask questions about testing ?***

You can ask questions on Stackoverflow with the tag [ibiza-test](https://stackoverflow.microsoft.com/questions/tagged/ibiza-test).