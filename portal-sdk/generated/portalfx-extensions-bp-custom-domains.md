<a name="best-practices"></a>
## Best Practices

<a name="best-practices-using-portalcontext-trustedauthorityhost-properly"></a>
### Using PortalContext.TrustedAuthorityHost properly

Do not use PortalContext.TrustedAuthorityHost directly, as in the following example. 

```cs
if (PortalContext.TrustedAuthorityHost.startsWith("contoso"))
{
    // We're in contoso.portal.azure.com, contoso-df.portal.azure.com, contoso.onestb.cloudapp.net etc
    ...
}
```

This is an anti-pattern for several reasons. The code becomes peppered with Cloud specific 'if' blocks that are hard to test, maintain, and find. This increases in complexity as the number of supported Clouds increases. Also, if another cloud that requires any of this logic comes online, the code has to be updated. Instead, use domain-based configuration to create a setting that varies by `PortalContext.TrustedAuthorityHost`, which is available at run time and returns the host name under which the extension was loaded.

<a name="best-practices-dynamic-pdl-changes"></a>
### Dynamic PDL changes

Never change the PDL that your extension serves based on the host of the caller, or based on feature flags that change based on callers.

1. The Shell caches the PDL on behalf of the client, and the same PDL bundle is delivered to all community clouds.

1. When the Shell directly requests the PDL from each extension, it does so on its own behalf and not on behalf of any specific user. In such cases, `PortalContext.TrustedAuthorityHost` is a constant.

1. Changing the default feature flags that are sent to the extension requires Shell config changes and redeployment.
