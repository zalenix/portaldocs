<a name="introduction"></a>
# Introduction

The '`Az`' solution described in this document was developed to be the Azure Portal's best attempt to enable teams to:

* Easily rehost already-built/deployed web UI in the Azure Portal
* Render web UI in the Azure Portal without an Azure Portal extension, saving the corresponding run-time perf cost for extension-loading
* Choose to forego Ibiza Controls and to develop their web UI in terms of hand-picked FX/OSS alternatives

'`Az`' is a "develop web UI in a child IFrame" solution available for Azure Portal, improving upon previous solutions like the PDL '`<AppBlade>`' tag and the no-PDL '`@FrameBlade.Decorator()`' and '`@FramePart.Decorator()`' TypeScript decorators in a couple significant ways:
* With '`Az`', there has been a focus to reduce FX-attributable perf cost to an absolute minimum, putting partner teams in exclusive control over their Blade/Part rendering perf.
* Only where absolutely necessary (for perf, for security) does '`Az`' introduce Ibiza-specific steps beyond conventional, modern web UI development, imposing minimal constraints on how you choose to develop your web UI.

Here, you develop your Blade or Part as a standard webpage that the Azure Portal will load in a child IFrame.  You pick your favorite OSS/FX support.  You choose your own hosting solution (and you can use Ibiza's hosting service, if you'd like).

From a 10,000-foot view, there is a single additional step you take when developing your Blade or Part UI as a standard HTML webpage.  With this solution, we require that you load a single '`Az`' script into your webpage and call the '`Az.initialized()`' API to signal to the Azure Portal that your rendering is complete.

```typescript

import Az = require("Az");

```

    // ...

```typescript

Az.initialized();

```

This '`Az`' script is a new, [UMD](https://github.com/umdjs/umd) module that provides a minimal **hosting API** for your Blade and Part UI.  You'll load this new library into your HTML page from a URL passed as part of the IFrame '`src`' URL.  You'll obtain TypeScript type definitions for the new '`Az`' API via the '`@types/Az`' NPM package (TODO: Add links throughout to NPM packages).

The API itself resembles the 'container' API exposed to classic Blades and Parts and includes: authentication tokens, theming, Blade-opening/navigation, CommandBar, Dialogs, etc.  You can explore the breadth of these APIs in [this sample page](https://df.onecloud.azure-test.net/#blade/SampleAzExtension/SampleBlade).

Although this new '`Az`' API is quite rich, only the '`Az.initialized()`' function must be used.  All other APIs are optional and can be used selectively to integrate more deeply with the Azure Portal.

<a name="step-by-step-integration"></a>
# Step-by-step integration

<a name="step-by-step-integration-integration-scenarios"></a>
## Integration scenarios

There are two common integration scenarios to which '`Az`' can be applied:

1. "I've been asked to integrate my **already-deployed web UI** into Azure Portal. I **have no Azure Portal extension**."
2. "I already **have an Azure Portal extension**. I want to develop new Blades / Parts in IFrames (to eliminate extension-loading cost, to choose my own OSS support)

The integration steps below vary slightly between these scenarios, as noted inline.

<a name="step-by-step-integration-locally-developing-and-testing-your-blade-or-part"></a>
## Locally developing and testing your Blade or Part

There are a couple simple steps required to quickly develop an HTML page that you can see rendered as a Blade or Part in the Azure Portal.

<a name="step-by-step-integration-locally-developing-and-testing-your-blade-or-part-step-a-return-an-html-page-for-your-blade-part"></a>
### <strong>Step A</strong> - Return an HTML page for your Blade / Part

First, you'll make additions to your site to return an HTML page for the Blade or Part that you wish to integrate into the Azure Portal.  For cases like scenario #1, this HTML page can be a simple Blade/Part-specific wrapper around already-built/deployed configuration of ReactJS components (for instance).  The Azure Portal will load the HTML page into a child IFrame with a '`src`' URL of the form:

`<EXTENSION_URL>/azblade/<BLADE_OR_PART_NAME>.html#<BLADE_OR_PART_PARAMETERS>`

where:
* `<EXTENSION_URL>` - The URL for your site.  During development, this is typically a '`localhost`' URL of your locally-hosted site (see "Test your new Blade / Part" [below](#step-c---test-your-new-blade---part)).  Once deployed, this URL will be registered in the Azure Portal's extensions.json file (see "Register your site's URL" [below](#step-e---register-your-site-s-url---1-only-)).
* `<BLADE_OR_PART_NAME>` - A name of your choosing that identifies the Blade or Part for which you're rendering UI.
* `<BLADE_OR_PART_PARAMETERS>` - Parameters passed "by the caller" of the Blade or Part.  For Blades, the caller is some other TypeScript code using the FX Blade-opening APIs (and supplying Blade parameters) or the user employing a deep-link URL (that includes encoded Blade parameters) to your Blade.  For Parts, the caller is TypeScript code using the FX Part-pinning APIs (and supplying Part parameters) or the user interacting with "Tile Gallery" UI (and supplying parameters for a newly-added Part).

Such a Blade can be opened programmatically from TypeScript/JavaScript like so:

```typescript

container.openBlade(new BladeReference(
    "SampleBlade",
    "SampleAzExtension",
    {
        parameters: {
            fruit: "apple",
            color: "red",
        },
        onClosed: (reason, data) => {
            if (reason === BladeClosedReason.ChildClosedSelf && data && data.someReturnedData) {
                this.previouslyReturnedValue(data.someReturnedData.toString());
            }
            log.debug("AzBlade closed.");
        },
    }));
    }

```

...and the associated IFrame's '`src`' URL for this very Blade (simplified for illustration) would be:

`https://df.onecloud.azure-test.net/SampleAzExtension/azblade/SampleBlade#fruit/apple/color/red`

<a name="initialize-az"></a>
As for the HTML page itself, you'll make simple Ibiza-specific additions to download and initialize the '`Az`' hosting library.  The additions are illustrated here (using the '`ejs`' JavaScript templating library):

```xml

<script type="text/javascript">window.azPortalTrustedOrigin = "<%- trustedPortalOrigin %>";</script>
<script type="text/javascript" src="<%= azScriptUrl %>"></script>

```

Here:
- '`trustedPortalOrigin`' is the origin of the Azure Portal site that is loading this HTML page into an IFrame.  Only messages from this origin will be intercepted and processed by the '`Az`' library running in your IFrame.  This '`trustedPortalOrigin`' value should be extracted from the '`trustedAuthority`' query parameter from the request for this page (and validated as described [later](#step-d---secure-your-blade---part-html-pages)).
- '`azScriptUrl`' is the URL from which the '`Az`' JavaScript library will be loaded.  This '`azScriptUrl`' value should be extracted from the '`azscript`' query parameter from the request for this page (and validated as described [later](#step-d---secure-your-blade---part-html-pages)).

<a name="step-by-step-integration-locally-developing-and-testing-your-blade-or-part-step-b-in-your-html-page-render-your-ui"></a>
### <strong>Step B</strong> - In your HTML page, render your UI

Now, in your HTML page, you'll (typically) evaluate JavaScript that renders the UI of your Blade or Part using your choice of UI FX/library (like ReactJS, AngularJS, etc.).  When your UI is fully-rendered, you must call '`Az.initialized()`'.  This signals to the Azure Portal to:
- Remove loading indicators for your Blade / Part
- Record standard load-time telemetry for the Blade / Part

Beyond '`Az.initialied()`', the '`Az`' library contains APIs that allow for deeper integration with the Azure Portal.  TypeScript definitions for these APIs (including JSDOC comments, Intellisense support) are included in the '`@types\Az`' NPM package included as part of the SDK.  You can explore the breadth of these APIs in [this sample page](https://df.onecloud.azure-test.net/#blade/SampleAzExtension/SampleBlade).

<a name="step-by-step-integration-locally-developing-and-testing-your-blade-or-part-step-c-test-your-new-blade-part"></a>
### <strong>Step C</strong> - Test your new Blade / Part

Now, you're ready to view and debug your Blade / Part as integrated into the Azure Portal.  If you're already familiar with ["test in prod" features](./top-extensions-production-testing.md) of the Azure Portal, you'll see that loading your Blade / Part into the Azure Portal to view and debug is straightforward.

From the browser's address bar, you can supply:

    https://df.onecloud.azure-test.net/?feature.canmodifyextensions=true#blade/SampleAzExtension/SampleBlade&testExtensions={"SampleAzExtension":{"uri":"https://localhost:4409","azExtension":true}}

or, alternatively, you can register your site via your browser's debug console, to simplify the deep-link URL to your new Blade:

    MsPortalImpl.Extension.registerTestExtension({
        name: "SampleAzExtension",
        uri: "https://localhost:4409",
        azExtension: true
    });
    
    https://df.onecloud.azure-test.net/?feature.canmodifyextensions=true#blade/SampleAzExtension/SampleBlade

Here, you would replace:
* '`SampleAzExtension`' with your extension name
* '`SampleBlade`' with your Blade name
* '`https://localhost:4409`' with the localhost URL where your site is hosted locally

<a name="step-by-step-integration-round-out-your-blade-or-part-for-deployment"></a>
## Round out your Blade or Part for deployment

<a name="step-by-step-integration-round-out-your-blade-or-part-for-deployment-step-d-secure-your-blade-part-html-pages"></a>
### <strong>Step D</strong> - Secure your Blade / Part HTML pages

[Above](#initialize-az), you saw how the '`trustedAuthority`' and '`azscript`' query parameters are used to initialize the '`Az`' library in your Blade / Part HTML page.  These query parameters should be validated before your HTML page proceeds to load data and render UI.

In scenario #1 (integrating already built/hosted UI), this validation is best done on your web server, gating the response to the HTTP request for your HTML page.  In scenario #2 (building new Blades / Parts into an existing extension), this validation will commonly be done in the HTML page itself (JavaScript evaluated in the browser), since the HTML page will typically be hosted as a static file by the Ibiza hosting service (with no opportunity to run validation code on the server).  Regardless of whether the validation is done client- or server-side, the validation itself is the same.

The '`trustedAuthority`' and '`azscript`' query parameters should be validated to be relative to the Portal origin where your site is expected to show UI.  Typically, this validation varies per-environment for your site.  For instance, your production environment should accept URLs from the 'portal.azure.com' origin.  Your PPE environment might accept URLs only from 'df.onecloud.azure-test.net' (the Azure Portal dogfood environment).  This might resemble:

```typescript

// Ensure the Az script is loaded only from the Azure Portal (and isn't some untrusted script).
const azScriptUrl = req.query && req.query["azscript"];
if (!isUrlOnTrustedAzurePortalDomain(azScriptUrl, isDevelopmentMode)) {
    return renderError();
}

// Validate that 'trustedAuthority' is an Azure Portal domain.
const trustedAuthorityParam = req.query && req.query["trustedAuthority"];
if (!isUrlOnTrustedAzurePortalDomain(trustedAuthorityParam, isDevelopmentMode)) {
    return renderError();
}

```

As an additional security measure, the HTTP response for your HTML page should include the ['`Content-Security-Policy`' response header](https://en.wikipedia.org/wiki/Content_Security_Policy).  This might resemble:

```typescript

// Return CSP (https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) allowing only the Azure Portal
// and the site itself to frame this page (or IFrames nested within the page).
const siteOrigin = `${req.protocol}://${req.get("host")}`;
res.set("Content-Security-Policy", `frame-ancestors ${trustedAuthorityParam} siteOrigin`);

```

This response header causes the browser to reject this HTML page unless loaded into a parent IFrame on the specified trusted domain.

If you are hosting your own Blade / Part HTML file (typical scenario #1), you'll make changes to your web server to set the CSP response header.  If your HTML files are hosted by the Ibiza hosting service (typical of scenario #2), the hosting service itself will set this CSP response header (with no step required by your team).

<a name="step-by-step-integration-round-out-your-blade-or-part-for-deployment-step-e-register-your-site-s-url-1-only"></a>
### <strong>Step E</strong> - Register your site&#39;s URL (#1 only)

If you're hosting your own web UI and have no Azure Portal extension, you'll need to register your site with the Azure Portal (in its various environments).  Here, you'll make additions to the Azure Portal 'extensions.json' like so:

    {
      "name": "YourExtensionName",
      "uri": "https://yoursite.com",
      "azExtension": true
    }

...where you'll replace '`YourExtensioneName`' and '`https://yoursite.com`' accordingly.  The '`azExtension: true`' property indicates that this "extension" is to be treated differently, meaning that its UI metadata will be loaded via '`/azextension.json`' described next.

<a name="step-by-step-integration-round-out-your-blade-or-part-for-deployment-step-f-return-json-metadata-about-your-ui-1-only"></a>
### <strong>Step F</strong> - Return JSON metadata about your UI (#1 only)

The Azure Portal requires metadata about your UI and its entry points.  Return this metadata as a JSON response to requests for '`/azextension.json`' from your site.  The shape of the JSON response is described by TypeScript type definitions in the '`@types\AzExtension`' NPM package.  The JSON should contain:

- `version` - The string-typed version for your site's current deployment. This value will be included in your IFrame's '`src`' URL, enabling optimal browser caching of your Blade's / Part's static resources (your HTML page, JavaScript bundles, SVGs, etc).
- `sdkVersion` - TypeScript definition files for '`Az`' and '`AzExtension`' are distributed as NPM packages.  This '`sdkVersion`' value is the version of the NPM package(s) you're using.  The Ibiza team uses the SDK version string you supply here to communicate future breaking API changes to your team.  If you use the TypeScript definitions from the '`@types\azextension`' NPM to validate your server TypeScript code, you'll find these TypeScript types force you to include the correct '`sdkVersion`' here.
- `localized` - A map from locale ids (for instance, 'en') to localized static resources (see the '`@types\AzExtension`' NPM package for details).

<a name="step-by-step-integration-round-out-your-blade-or-part-for-deployment-step-g-make-your-html-page-debuggable"></a>
### <strong>Step G</strong> - Make your HTML page debuggable

This is an optional step (a manual step for scenario #1, automatic via hosting service in scenario #2) that makes your Blades and Parts easily debuggable with browser debug tools.  The Azure Portal's '`clientOptimizations`' query parameter can be used to control bundling and minification of JavaScript bundles as they're loaded into the browser.  This functionality can work for the JavaScript bundles used in your Blade / Part HTML pages too.  If you are hosting your own Blade / Part HTML pages, you should sample the '`clientOptimizations`' query parameter passed in the IFrame '`src`' URL and return scripts accordingly:

* '`true`' (default if '`clientOptimizations`' is not supplied) - Scripts should be bundled and minified
* '`false`' - Scripts should not be bundled or minified
* '`bundle`' - Scripts should only be bundled but not minified

In scenario #2, where Blades and Parts are typically hosted by Ibiza's hosting service, this treatment of '`clientOptimizations`' is built-in.  In scenario #1, you will have to integrate '`clientOptimizations`' with your site's bundling/minification abilities.

<a name="reference"></a>
# Reference
<a name="reference-query-parameters"></a>
## Query parameters
The IFrame '`src`' URL for your Blade's/Part's HTML page will contain the following query parameters, along with their intended use:
* '`azscript`' - The Azure Portal URL from which your HTML page should load the '`Az`' JavaScript bundle.  See [here](#initialize-az) for more details.
* '`trustedAuthority`' - The HTTP origin of the Azure Portal that is loading your HTML page in an IFrame.  See [here](#initialize-az) for more details.
* '`clientOptimizations`' - An indication of whether JavaScript bundles should be bundled and minified.  See [here](#step-g---make-your-html-page-debuggable) for more details.
* '`version`' - The version string that your site returns as the '`version`' property on the response to the '`/azextension.json`' request of your site (see [here](#step-f---return-json-metadata-about-your-ui---1-only-)).  For optimal browser caching of static resources related to your Blades / Parts, your static resources (JavaScript bundles, SVGs, etc) can be named according to the '`version`' value.
* '`l`' - The locale for any strings, images shown in your Blade/Part UI.

<a name="wrap-up"></a>
# Wrap-up

Feedback always welcome.
Post to [internal StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-az) with questions and difficulties.
