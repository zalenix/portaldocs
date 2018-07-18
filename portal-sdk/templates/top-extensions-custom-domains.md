# Custom Domains

## Domain based configuration

Domain-based configuration allows the Portal and Extensions to dynamically obtain settings based on the URL that was used to access the Portal. For example, accessing the Portal by using the `contoso.portal.azure.com` URL, as opposed to accessing the Portal by using the `portal.azure.com` URL, would display  different values for domain-based settings.

While domain based configuration is not technically required in order to support national clouds, there is great overlap between settings that are changed for community clouds. It is often easier to store settings such as a links over to domain based configuration. Settings such as ARM endpoints would not normally be candidates for domain-based configuration.

Additionally, domain-based configuration includes support for expanding links from link redirection / shortener services such as Microsoft's FwLink and `aka.ms` services.

**NOTE**: Domain-based configuration is based on the domain host address of the Shell, instead  of the Extension. Extensions do not need to support additional host names themselves in order to take advantage of domain-based configuration.

For more information about when to use domain-based configuration settings instead of vanilla configuration settings, please see [#expected-design-pattern](#expected-design-pattern).

The Shell provides two APIs to support domain based configuration:

### MsPortalFx.Settings.getSharedSettings()

Selected values from Shell are exposed through an RPC call so that:
 1. Extensions do not all have to hold their own copy of commonly defined values, such as the support URL, and 
 1. Changes to these shared settings do not require simultaneous redeployment of extensions.
 
The first call by the extension to this API results in an RPC call from the extension to Shell. After that, the results are served from a cache.
 
The `MsPortalFx.Settings.getSharedSettings()` API returns the following structure (defined in src\SDK\Framework\TypeScript\MsPortalFx\SharedSettings.d.ts). 
At the time of writing (1/26/2016), the root of this object is empty (reserved for future use) except for a links property containing the following settings:

**Links collection:**
Element Name          |Description
----------------------|-----------
accountsPortal        |Link to the Accounts portal.
classicPortal         |Link to the Classic portal.
createSupportRequest  |Link to the create support request UI.
giveFeedback          |Link to the feedback UI.
helpAndSupport        |Link to the help and support UI.
learnRelatedResources |Link to the learn related resources help topic.
manageSupportRequests |Link to the manage support request UI.
privacyAndTerms       |Link to the privacyAndTerms UI.
resourceGroupOverview |Link to resource groups overview.

**Notes:**

1. Links can be full URLs (i.e. external links), a URL fragment (i.e. blade link), or `String.Empty` (feature is not supported for that
   user / tenant / environment). It is the consumer's job to support all three formats if they take a dependency.

1. Links are automatically expanded according to the user's domain, tenant, and language preferences.
 
 
### TrustedAuthorityHost

Server-side `PortalContext.TrustedAuthorityHost` returns the host name under which the extension was loaded. For example, if 
Extension A may need to know if it's being called from portal.azure.com or Contoso.azure.com. In the first case TrustedAuthorityHost 
will be portal.azure.com and in the second, contoso.azure.com. 
 
**NOTE:** If the extension needs to change its configuration based on the domain of the caller, the recommended pattern is to use 
domain based configuration (which is designed specifically for this sort of work) rather than coding directly against values returned  by PortalContext.TrustedAuthorityHost.


<tags ms.service="portalfx"
      ms.workload="portalfx"
      ms.tgt_pltfrm="portalfx"
      ms.devlang="portalfx"
      ms.topic="get-started-article"
      ms.date="05/02/2016"
      ms.author="dbrankin" />

## Expected design pattern

The partner identifies the functionality that needs to change based on domain. If the change is only required at the 
deployment level (i.e. national clouds, such as China, Germany, Government, etc) normal config should be 
used with no dynamic tests at runtime. Examples of configuration falling into this category are things like ARM and RP URLs, 
AAD client application IDs, etc.

If on the other hand the same deployment has to support multiple domains (i.e. community clouds, such as Fujitsu A5),
domain based configuration should be used, with the selection being based on the Trusted Authority for the caller.

For those that wish to jump ahead, this [example](portalfx-domain-based-configuration-example.md) 
shows all the code required to wire up domain based configuration server side. Additional code is required to push values 
down to the browser, and the recommended pattern for this is covered below.

## Built in support
See also [Shell RPC call](portalfx-domain-based-configuration.md) and
[PortalContext.TrustedAuthorityHost](portalfx-domain-based-configuration.md)

## Expected design pattern
Partners (extension authors) are of free to do what they want with respect to domain based configuration, but the following is the
pattern recommend we recommend and best support.

The partner identifies the functionality that needs to change based on domain. If the change is only required at the deployment level
(e.g. Global vs China vs Germany vs Govenment) normal config should be used with no dynamic tests at runtime. Examples of
configuration falling into this category are things like ARM and RP URLs, AAD client application IDs, etc.

If on the other hand the same deployment has to support multiple domains (e.g. Global supporting Fujitsu A5),
domain based configuration should be used, with the selection being based on the Trusted Authority for the caller.

## Domain based configuration
Once the partner has identified their configuration, they create a supporting `DictionaryConfiguration` class as per the
[DictionaryConfiguration documentation](portalfx-dictionaryconfiguration.md). The dictionary key will
be the `TrustedAuthorityHost` (i.e. the host name the Shell was loaded under), which is available at run time via `PortalContext`.

By convention, we append `DomainBasedConfiguration` to the end of the class name (`ErrorApplicationDomainBasedConfiguration`,
`HubsDomainBasedConfiguration`, (portal) `WebsiteDomainBasedConfiguration`, etc). However, this is purely a convention and is
not enforced (or required).

This [example](portalfx-domain-based-configuration-example.md) shows all the code required to wire up
domain based configuration.

## Exporting domain based configuration values to the client
See [How to expose config settings for consumption in the client](portalfx-load-configuration.md) for an
overview of exposing config settings to the client.

In many cases, the domain based configuration is needed in client side TypeScript. While the extension developer is free to do this any
 way they want, we recommend the following for extensions following our recommended practices / templates:

1. In ExtensionExtensionDefinition.cs, add your configuration class to your ImportContructor and save it away for later use

2. Override `IReadOnlyDictionary&lt;string, object&gt; GetExtensionConfiguration(PortalRequestContext context)` 
and use this to extend the environmental object being returned to the client. For example:

```cs
    public override IReadOnlyDictionary<string, object> GetExtensionConfiguration(PortalRequestContext context)
    {
        var extensionConfig = base.GetExtensionConfiguration(context);
        var settings = this.myConfig.GetSettings(context.TrustedAuthorityHost, CultureInfo.CurrentUICulture);

        var mergedConfig = new Dictionary<string, object>()
        {
            {"links", settings.Links},
            {"someSetting", settings.someSetting},
        };

        mergedConfig.AddRange(extensionConfig);

    return mergedConfig;
}
```

3. Update `ExtensionFxEnvironment.d.ts` to include TypeScript definitions for the new values you are downloading to the client.


## Anti-patterns

### Do not use PortalContext.TrustedAuthorityHost directly
Do not write code like this:

```cs
if (PortalContext.TrustedAuthorityHost.startsWith("contoso"))
{
    // We're in contoso.portal.azure.com, contoso-df.portal.azure.com, contoso.onestb.cloudapp.net etc
    ...
}
```

This is an anti-pattern for several reasons:

1. The code becomes peppered with Cloud specific 'if' blocks that are hard to test, maintain, and find. This increases in complexity
   as the number of supported Clouds increases.

1. If another cloud comes online requiring some (or all) of the same logic, the code has to be updated.

Instead, use the domain based configuration to create a setting that varies by PortalContext.TrustedAuthorityHost.

### Do not change PDL on the fly / by Feature Flag
Never change the PDL your extension severs up based on the host of the caller or a feature flag that changes between callers. 

1. The Shell caches your PDL on behalf of the client and the same PDL bundle is delivered to all community clouds. 

1. When the Shell directly requests the PDL from each extension, it does so on its own behalf and not on behalf of any specific user. 
   In such cases, PortalContext.TrustedAuthorityHost is a constant.

1. Changing the default feature flags sent to the extension requires Shell config changes and redeployment.


<tags ms.service="portalfx"
      ms.workload="portalfx"
      ms.tgt_pltfrm="portalfx"
      ms.devlang="portalfx"
      ms.topic="get-started-article"
      ms.date="05/02/2016"
      ms.author="dbrankin" />

## Domain based configuration example & sample code

### Example consumption

```cs
[ImportingConstructor]
public MyConsumingClass(PortalContext portalContext, MyConfiguration myConfiguration)
{
    this.portalContext = portalContext;
    this.myConfiguration = myConfiguration;
}
...
public void DoSomthing()
{
    var settings = this.myConfiguration.Get(this.portalContext.TrustedAuthorityHost, CultureInfo.CurrentUICulture);
    if (settings.ShowPricing) {...};
    string expandedUrl = settings.GettingStarted;
}
```

### Example configuration and settings classes

```cs
namespace Microsoft.MyExtension.Configuration
{
    [Export]
    public class MyConfiguration : DictionaryConfiguration<MySettings>
    {
    }

    /// <summary>Configuration that can vary by the domain by which the user accesses the portal (or some other string)</summary>
    public class MySettings
    {
        [JsonProperty]
        public string LinkTemplate { get; private set; }
 
        [JsonProperty]
        public MyLinks Links { get; private set; }
 
        [JsonProperty]
        public bool ShowPricing{ get; private set; }
    }

    /// <summary>Links don't have to be a separate class, I just like to group them separately to other settings</summary>
    public class MyLinks
    {
        [JsonProperty, Link]
        public string GettingStarted { get; private set; }
 
        [JsonProperty, Link]
        public string Support { get; private set; }
  
        [JsonProperty, Link]
        public string TermsAndConditions { get; private set; }
    }
}
```

### Corresponding example config settings
This example supports a deployment returning different run-time configuration values for the above settings class depending on whether the portal was accessed through
portal.azure.com, example.microsoft.com, fujitsu.portal.azure.com, or hostfileoverride.com.

With a config block like this:

```xml
<add key="Microsoft.MyExtension.Configuration.MyConfiguration.Settings" value="{
    'default': {
        'linkTemplate': 'https://go.microsoft.com/fwLink/?LinkID={linkId}&amp;clcid=0x{lcid}',
        'links': {
            'gettingStarted': '111111',
            'support': '#create/Microsoft.Support',
            'termsAndConditions': 'https://microsoft.com',
        },
        'ShowPricing': true,
    },
    'fujitsu.portal.azure.com' : {
        'links': {
            'gettingStarted': '222222',
            'support': '',
            'termsAndConditions': 'https://fujitsu.com',
        },
        'ShowPricing': false,
    },
    'example.microsoft.com': {
        'ShowPricing': false,
    }
    }"/>
```

then a call like this:

```cs
    var config = this.myConfiguration.Get(this.portalContext.TrustedAuthorityHost, CultureInfo.CurrentUICulture);
``` 

would give these results:

URL user used to access the portal|User's culture|config.showPricing|config.links.gettingStarted|config.links.support|config.links.termsAndConditions
----------------------------------|--------------|------------------|---------------------------|--------------------|-------------------------------
portal.azure.com        |en-us  |true |https://go.microsoft.com/fwLink/?LinkID=111111&clcid=0x409|#create/Microsoft.Support|https://microsoft.com
portal.azure.com        |zh-hans|true |https://go.microsoft.com/fwLink/?LinkID=111111&clcid=0x4|#create/Microsoft.Support|https://microsoft.com
fujitsu.portal.azure.com|en-us  |false|https://go.microsoft.com/fwLink/?LinkID=222222&clcid=0x409||https://fujitsu.com
example.micrtosoft.com  |en-us  |false|https://go.microsoft.com/fwLink/?LinkID=111111&clcid=0x409|#create/Microsoft.Support|https://microsoft.com
hostFileOverride.com    |en-us  |true |https://go.microsoft.com/fwLink/?LinkID=111111&clcid=0x409|#create/Microsoft.Support|https://microsoft.com
 
***Note:** Only the URL the portal is accessed through matters. The URL the extension is accessed through does not change.



