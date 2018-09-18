<a name="frequently-asked-questions"></a>
## Frequently asked questions


<!-- TODO:  FAQ Format is ###Link, ***title***, Description, Solution, 3 Asterisks -->

<a name="when-sideloading-via-the-query-string-or-fragment-or-via-f5-the-tab-with-the-portal-never-shows-up"></a>
## When sideloading via the query string or fragment or via F5 the tab with the portal never shows up.

SOLUTION: 

Check that your browser's popup blocker is not blocking the second tab from being loaded.

* * *

<a name="when-sideloading-via-the-query-string-or-fragment-or-via-f5-the-tab-with-the-portal-never-shows-up-extension-will-not-sideload"></a>
### Extension will not sideload

*** My Extension fails to side load and I get an ERR_INSECURE_RESPONSE in the browser console ***

![ERR_INSECURE_RESPONSE](../media/portalfx-productiontest/errinsecureresponse.png)

In this case the browser is trying to load the extension but the SSL certificate from localhost is not trusted.

SOLUTION:

Install/trust the certificate.

Please checkout the stackoverflow post: [https://stackoverflow.microsoft.com/questions/15194/ibiza-extension-unable-to-load-insecure](https://stackoverflow.microsoft.com/questions/15194/ibiza-extension-unable-to-load-insecure)

Items that are specifically status codes or error messages can be located in [portalfx-extensions-status-codes.md](portalfx-extensions-status-codes.md).

* * *

<a name="when-sideloading-via-the-query-string-or-fragment-or-via-f5-the-tab-with-the-portal-never-shows-up-sandboxed-iframe-security"></a>
### Sandboxed iframe security

*** I get an error 'Security of a sandboxed iframe is potentially compromised by allowing script and same origin access'. How do I fix this? ***

You need to allow the Azure Portal to frame your extension URL. For more information, [click here](portalfx-creating-extensions.md).

* * *


<a name="when-sideloading-via-the-query-string-or-fragment-or-via-f5-the-tab-with-the-portal-never-shows-up-sideloading-in-chrome"></a>
### Sideloading in Chrome

***Ibiza sideloading in Chrome fails to load parts***
    
Enable the `allow-insecure-localhost` flag, as described in [https://stackoverflow.microsoft.com/questions/45109/ibiza-sideloading-in-chrome-fails-to-load-parts](https://stackoverflow.microsoft.com/questions/45109/ibiza-sideloading-in-chrome-fails-to-load-parts)

* * *

<a name="where-are-the-faq-s-for-general-extension-debugging"></a>
## Where are the FAQ&#39;s for general extension debugging?

The FAQs for debugging extensions is located at portalfx-extensions-faq-debugging.md.

* * *

<a name="are-gallery-packages-sideloaded"></a>
## Are gallery packages sideloaded?

When configured correctly gallery packages from the extension running on localhost are sideloaded and made available in the portal at  `+ Create a resource >  see all > Local Development`  if your gallery packages are not showing up there see [https://github.com/Azure/portaldocs/blob/master/gallery-sdk/generated/index-gallery.md#gallery-package-development-and-debugging](https://github.com/Azure/portaldocs/blob/master/gallery-sdk/generated/index-gallery.md#gallery-package-development-and-debugging).

* * *

<a name="how-do-i-mark-automated-tests-as-test-synthetic-traffic-so-that-it-does-not-show-up-in-reporting"></a>
## How do I mark automated tests as test/synthetic traffic so that it does not show up in reporting

Automated tests that run against a production environment should be marked as test/synthetic traffic. Use one of the following options to accomplish this.

1. Add the TestTraffic phrase to the userAgentString field. Replace TeamName and Component in the following example with the appropriate values, without the angle brackets.
TestTraffic-<TeamName>-<Component>

1. Set the query string parameter to feature.UserType=test. This setting excludes test traffic from our reports.

* * *

 ## Can I sideload into onestb?

Onebox-stb has been deprecated. Please do not use it. Instead sideload directly into df, mpac or production.

* * *

<a name="how-can-i-side-load-my-extension-with-obsolete-bundles"></a>
## How can I side load my extension with obsolete bundles?

See [https://aka.ms/portalfx/obsoletebundles](https://aka.ms/portalfx/obsoletebundles).

* * *