
<a name="overview"></a>
## Overview

The Portal uses an internal provider for authentication and authorization. The built-in cloud authentication provider uses Azure Active Directory (AAD), which also supports Microsoft Account users. If your extension needs to differentiate between AAD and MSA users, see [Accessing claims from your server](#accessing-claims-from-your-server). If you are working on first-party extensions, but you are not sure that your extension scenarios comply with Azure terms and conditions, you may want to reach out to <a href="mailto:ibiza-lca@microsoft.com?subject=Compliance with Azure Terms and Conditions">ibiza-lca@microsoft.com</a>.

During sign-in, the Portal obtains a token that contains claims that identify the signed-in user. The Portal also retrieves directories and subscriptions to which the user has access.

**NOTE:** Users can sign in without a subscription. Extensions must gracefully handle this case and return zero assets when queried.

The extension can call ARM from the client or from the extension server. The extension can also call alternate services from the client or from the extension server.

* [Signing in](#signing-in)

* [Calling ARM from the client](#calling-arm-from-the-client)

* [Calling ARM from the server](#calling-arm-from-the-server)

* [Calling alternate resources](#calling-alternate-resources)

* [Accessing claims](#accessing-claims)

<a name="signing-in"></a>
## Signing in

The following is the signin process that is performed by the Portal.

1. User browses to the Portal.
1. The Portal redirects to AAD to sign in.
1. AAD redirects to the Portal with a token.
1. The Portal gets a list of directories that the user can  access from ARM.
1. The Portal gets a list of subscriptions that the user can access from ARM.
1. The Portal signs the user into the last-used directory, the home directory for AAD accounts, or the first directory it gets from ARM for MSA accounts.
1. Finally, the Portal loads the Startboard and all extensions.

* * *

<a name="calling-arm-from-the-client"></a>
## Calling ARM from the client

Your extension should use cross-origin resource sharing (CORS) for all non-aggregated, non-orchestrated calls. If you need to call multiple sources for a single piece of UI, you should use a server API to orchestrate and aggregate those calls.

Use the built-in `ajax()` function to communicate from the extension client to call any extension server API. This function will attach a token targeted at ARM that is specific to your extension for the HTTP header. 

**NOTE**: Do not use `jQuery.ajax()` because it will not properly authorize your requests. If you have a scenario that is not supported by `ajax()`, you can use the `getAuthorizationToken()` function to obtain a token and manually attach it to your request.

<a name="calling-arm-from-the-server"></a>
## Calling ARM from the server

Use the `WebApiClient` class to call ARM from your extension server. This class attaches a token to the request on your behalf, in a manner similar to the client `ajax()` function.  The following code attaches a token that is targeted at ARM.

```cs
    Uri arm = new Uri("https://management.azure.com/...");  // arm endpoint
    using (var client = new Microsoft.Portal.Framework.ClientProxy.WebApiClient())
    {
        // ConfigureAwait(false) is recommended to not forcibly resume on the same thread it started on
        // var data = await client.GetAsync<...>(arm).ConfigureAwait(false);
    }
```

<a name="calling-alternate-resources"></a>
## Calling alternate resources

Calling alternate services involves AAD Onboarding.  The onboarding process can take five or six  weeks, so if your extension needs to invoke services other than ARM, you should reach out to the Azure Portal team early in the design phase, as specified in [top-extensions-onboarding-with-related-teams.md](top-extensions-onboarding-with-related-teams.md).

**NOTE**: Only first-party extensions can call alternate resources. Third party extensions use an encrypted token that cannot be decrypted by services other than ARM, therefore they cannot call alternate resources.

<a name="calling-alternate-resources-from-client"></a>
### From client

Only ibiza has the authority to mint tokens. To call external resources, extension developers need to request the creation of the AAD and register the extension resources with Ibiza, as specified in [top-onboarding.md#register-the-extension-with-the-portal-product-configuration](top-onboarding.md#register-the-extension-with-the-portal-product-configuration). 

The following example enables `Contoso_Extension`, a sample extension, that can query Graph APIs from the client.

1. The extension owner submits an RDTask that is located at [http://aka.ms/portalfx/newextension](http://aka.ms/portalfx/newextension).  This is part of the process that onboards the AAD application with the Portal, as specified in [portalfx-extensions-onboarding-aad.md](portalfx-extensions-onboarding-aad.md).

1. After the Ibiza team creates the app in [AAD onboarding app](https://aadonboardingsite.cloudapp.net/) you can reach out to 

<a href="mailto:aadonboarding@microsoft.com?subject=Expediting the Onboarding of a new Extension ">aadonboarding@microsoft.com</a>.
 [AAD Onboarding Team](mailto:aadonboarding@microsoft.com) to expedite the process.

1. Submit [RDTask](http://aka.ms/portalfx/newextension) to register the AAD Applciation created in Step 1 into the Portal's extension config. This step can be done in parallel to Step 2.
   In this case the resourceAccess config for your extension in Portal would look something like the following:

    ```json
    {
        "name": "Contoso_Extension",
        "uri": "//stamp2.extension.contoso.com/Home",
        "uriFormat": "//{0}.extension.contoso.com/Home",
        "feedbackEmail": "extension.admin@contoso.com",
        "resourceAccess": [{
            "name": "",
            "resource": "https://management.core.windows.net/"
            }, {
            "name": "graph",
            "resource": "https://graph.windows.net"
            }]
    }
    ```
1. Once the config changes are deployed in the requested (i.e. Dogfood/ PPE/ PROD) envirnonment then the extension will be able to request tokens for the graph resource using any of its data APIs

    ```ts
    MsPortalFx.Base.Security.getAuthorizationToken({ resourceName: "graph" });

    MsPortalFx.Base.Net.ajax({
        setAuthorizationHeader: { resourceName: "graph" }
    });

    new MsPortalFx.ViewModels.Controls.FileDownload.ViewModel(
        container,
        {
            context: ko.observable(new FileDownload.Context({
                ...
                addDefaultAuthorizationToken: {
                    resourceName: "graph"
                },
                ...
            })),
        });

    new MsPortalFx.ViewModels.FileDownloadCommand({
        authorizationOptions: {
            resourceName: "graph"
        }
    });
    ```

<a name="calling-alternate-resources-from-controller-or-server-side"></a>
### From Controller or Server-Side

In this scenario, extensions request a token targeted to the extension. Then the extension exchanges the token by calling AAD to communicate with alternate resources.

The workflow in this case will be a little different from the one we described on the client side:


1. To query graph API's, an extension author needs to create AAD application on [https://aadonboardingsite.cloudapp.net/](https://aadonboardingsite.cloudapp.net/). AAD Onboarding can take 5-6 weeks so we recommend extension developers to think about this scenarios early in the design phase.
1. Once you have created the app you can reach out to  [aadonboarding@microsoft.com](aadonboarding@microsoft.com) to expedite the process.
1. Once you have the App Id submit [RDTask](http://aka.ms/portalfx/newextension) to register the AAD Applciation created in Step 1 into the Portal's extension config. This step can be done in parallel to Step 2.
   In this case the resourceAccess config for your extension in Portal would look something like the following:

```json
   {
        "name": "Contoso_Extension",
        "name": "Contoso_Extension",
        "uri": "//stamp2.extension.contoso.com/Home",
        "uriFormat": "//{0}.extension.contoso.com/Home",
        "resourceAccess": [{
            "name": "",
            "resource": "https://management.core.windows.net/"
        }, {
            "name": "self",
            "resource": "1a123abc-1234-1a2b-ab01-01ab01a1a1ab"
        }]
    }
```

Sample code for exchanging toke:

Add an extra parameter to ajax calls (setAuthorizationHeader = { resourceName: "self" }

Which means give me a token to myself and I will exchange that token later

```cs
    MsPortalFx.Base.Net2.ajax({
        uri: "MyController/MyAction",
        setAuthorizationHeader: { resourceName: "self" }
    }).then((myData) => {
        // do work with data
    });
```

Controller code.

```cs
    // Get the token passed to the controller
    var portalAuthorizationHeader = PortalRequestContext.Current.GetCorrelationData<AuthorizationCorrelationProvider>();
    if (portalAuthorizationHeader == null) {
        // This should never happen, the auth module should have returned 401 if there wasn't a valid header present
        throw new HttpException(401, "Unauthorized");
    }

    // Exchange it for the token that should pass to downstream services
    var exchangedAuthorizationHeader = GetExchangedToken(portalAuthorizationHeader, intuneClientId, intuneClientCert, "https://graph.windows.net/");

    // Call downstream service with exchanged header
    var headers = new NameValueCollection();
    headers.Add("Authorization", exchangedAuthorizationHeader);
    webApiClient.GetAsync(uri, "MyOperation", headers);

    // Helper method to exchange tokens
    string GetExchangedToken(string portalAuthorizationHeader, string clientId, X509Certificate2 clientCertificate, string resource) {

        // proof that the intune extension is making the token request
        var clientAssertion = new ClientAssertionCertificate(clientId, clientCertificate);

        // proof that the request originated from the portal and is on behalf of a valid user
        var accessToken = GetAccessTokenFromAuthorizationHeader(portalAuthorizationHeader);
        var userAssertion = new UserAssertion(accessToken, "urn:ietf:params:oauth:grant-type:jwt-bearer");

        // the actual token exchange
        var exchangedToken = authContext.AcquireToken(resource, clientAssertion, userAssertion);

        return exchangedToken.GetAuthorizationHeader();
    }

    string GetAccessTokenFromAuthorizationHeader(string authorizationHeader) {
        // The header will be in the form "Bearer ey��MZ"
        // The access token in the last part of the header
        var separator = new char[] { ' ' };
        var accessToken = authorizationHeader.Split(separator, StringSplitOptions.RemoveEmptyEntries).LastOrDefault();

        return accessToken;
    }
```

<a name="accessing-claims"></a>
## Accessing claims

Tokens received from AAD contain a set of claims (key/value pairs) with information about user, including
personally-identifiable information (PII). Note that PII will only be available to extension who fall under the
[Azure privacy policy](https://www.microsoft.com/en-us/TrustCenter/Privacy/default.aspx). Extensions that don't fall under this policy
(e.g. share PII with third-parties) will not have access to the token or its claims. This is due to the fact that
Microsoft can be sued for abuse/misuse of PII as outlined by the privacy policy. Any exceptions need to be approved by
[Ibiza LCA](mailto:ibiza-lca@microsoft.com).

<a name="accessing-claims-accessing-claims-from-the-client"></a>
### Accessing claims from the client

Extensions that do have access to claims can use the `getUserInfo()` API to retrieve common claims from the client. Note
that secondary claims, like name and email, may not always be available and cannot be guarranteed. Token claims may
change over time as AAD evolves. Do not make hard dependencies on claims and never extract claims yourself. Instead,
call Graph to get required user information.

```ts
MsPortalFx.Base.Security.getUserInfo() : PromiseV<MsPortalFx.Base.Security.UserInfo>

interface UserInfo {
    email: string;          // Guest accounts not homed in the current directory will have a UPN and not a valid email address
    givenName: string;      // Name may be empty if not provided in the token
    surname: string;        // Name may be empty if not provided in the token
    directoryId: string;
    directoryName: string;  // Directory name may be empty if calling Graph fails
    domainName: string;     // Directory domain may be empty if calling Graph fails
}
```

<a name="accessing-claims-accessing-claims-from-your-server"></a>
### Accessing claims from your server
While not recommended, the token used to communicate with your server also contains claims that can be read from the
server using the [ASP.NET claims API](http://msdn.microsoft.com/en-us/library/ee517271.aspx). To simplify development,
the [HttpContext.User](http://msdn.microsoft.com/library/system.web.httpcontext.user.aspx) has been augmented with the
most commonly used claims.

First, reference the following assemblies:

* Microsoft.Portal.AadCore.dll
* System.IdentityModel.Tokens.Jwt.dll

Second, add the following to your **web.config** file:

<!-- INTERNAL NOTE: copy settings from src\StbPortal\Extensions\AzureHubsExtension\Web.config -->

```xml
<!-- deny anonymous users -->
<system.web>
    <authorization>
      <deny users="?" />
    </authorization>
</system.web>

<!-- allow the home page which serves the extension source -->
<!-- TODO: This loads your extension from ~/Index; change path to fit your needs -->
<location path="Index">
  <system.web>
    <authorization>
      <allow users="*" />
    </authorization>
  </system.web>
</location>

<!-- allow images and scripts -->
<location path="Content">
  <system.web>
    <authorization>
      <allow users="*" />
    </authorization>
  </system.web>
</location>
<location path="Scripts">
  <system.web>
    <authorization>
      <allow users="*" />
    </authorization>
  </system.web>
</location>

<configuration>
  <appSettings>
    <!-- For test, use authority="https://login.windows-ppe.net/" -->
    <!-- For PROD, use authority="https://login.windows.net/" -->
    <add key="Microsoft.Portal.Security.AzureActiveDirectory.AadAuthenticationConfiguration.Authority"
         value="https://login.windows-ppe.net/" />
    <add key="Microsoft.Portal.Security.AzureActiveDirectory.AadAuthenticationConfiguration.TenantId"
         value="common" />
    <add key="Microsoft.Portal.Security.AzureActiveDirectory.AadAuthenticationConfiguration.AllowedAudiences"
         value="['https://management.core.windows.net/']" />
    <add key="Microsoft.Portal.Security.AzureActiveDirectory.AadAuthenticationConfiguration.MinValidationCertUpdateInterval"
         value="PT05M" />
    <add key="Microsoft.Portal.Security.AzureActiveDirectory.AadAuthenticationConfiguration.MaxValidationCertUpdateInterval"
         value="PT24H" />
    <add key="Microsoft.Portal.Security.AzureActiveDirectory.AadAuthenticationConfiguration.ForwardDecryptedAuthorizationTokens"
         value="false" />
  </appSettings>
</configuration>
```

Lastly, use [HttpContext.User](http://msdn.microsoft.com/library/system.web.httpcontext.user.aspx) to retrieve the common claims:

```cs
// use IPortalIdentity for email and tenant id
// NOTE: Do not rely on IPortalIdentity.FirstName and LastName properties; they aren't consistenty populated
var portalUser = HttpContext.User.Identity as Microsoft.Portal.Framework.IPortalIdentity;
// portalUser.EmailAddress;
// portalUser.TenantId;

// use IAadIdentity (implements IPortalIdentity) for user id
// and to determine if the user is an MSA or AAD account
var aadUser = portalUser as Microsoft.WindowsAzure.Management.AadAuthentication.IAadIdentity;
if (aadUser != null)
{
    // aadUser.ObjectId;
    // aadUser.PrincipalId;
    // aadUser.IsOrgId
}
```

If you require additional claims, use the [ASP.NET claims API](http://msdn.microsoft.com/en-us/library/ee517271.aspx) to read the desired claims from the token. The [Supported token and claim types](http://msdn.microsoft.com/en-us/library/windowsazure/dn195587.aspx#BKMK_JWT) article on MSDN covers the default claims provided by AAD.

Due to token size constraints, additional information cannot be added to the token. Instead, any additional information required by an extension must be obtained from [AAD Graph API](http://msdn.microsoft.com/en-us/library/windowsazure/hh974482.aspx).

 ## FAQs for Authentication

   <!-- TODO:  FAQ Format is ###Link, ***title***, Description, Solution, 3 Asterisks -->

<a name="accessing-claims-get-subscription-list"></a>
### Get subscription list

***How do I get the list of subscriptions? Or just those selected by a user?***

SOLUTION: Call the `MsPortalFx.Azure.getAllSubscriptions()` or `MsPortalFx.Azure.getSelectedSubscriptions()` APIs. For more information, see   [portalfx-subscriptions.md](portalfx-subscriptions.md).

* * *

<a name="accessing-claims-session-expiration"></a>
### Session expiration

***When do authenticated sessions expire?***

SOLUTION: The Portal does not automatically log users out after a period of inactivity; it only logs a user out when the user's AAD-issued authentication token expires. Otherwise, all subsequent operations would fail.

This typically happens after a few hours of usage, maybe eight to 24 hours based on the type of account. It may also happen if the token was not refreshed or renewed for a period of time, which is typically one hour.

**NOTE**: If the browser is in a situation where it cannot connect to the network for more than an hour, typically, the user is logged out.

* * *

<a name="accessing-claims-enable-local-portal-authentication"></a>
### Enable local portal authentication

***How is local portal authentication enabled?***

Authentication is not configured in the local Portal by default, which simplifies extension development. Use the following steps to enable authentication.

1. Install Internet Information Services (IIS) by following the instructions located at [http://msdn.microsoft.com/en-us/library/ms181052%28v=vs.80%29.aspx] (http://msdn.microsoft.com/en-us/library/ms181052%28v=vs.80%29.aspx) Do not use **IIS Express**.

1. Install the URL Rewrite module for IIS that is located at [http://www.iis.net/downloads/microsoft/url-rewrite](http://www.iis.net/downloads/microsoft/url-rewrite), which  enables Web administrators to create rules for implementing memorable URLs.

1. Install the the most current version of the Azure SDK that is available from [/portal-sdk/generated/downloads.md](/portal-sdk/generated/downloads.md). Other relevant downloads are available at [http://www.windowsazure.com/en-us/downloads](http://www.windowsazure.com/en-us/downloads).

1. Create a new IIS site that can be accessed at [http://onestb.cloudapp.net/](http://onestb.cloudapp.net/). This site is located in the following folder: `%programfiles(x86)%\Microsoft SDKs\PortalSDK\StbPortal` and is configured to use the CURRENT test environment, which includes AAD-PPE and MSA-PROD.  This site is created by executing the `%programfiles(x86)%\Microsoft SDKs\PortalSDK\Tools\Setup-OneCloud.cmd` script. To change environments to either NEXT or DOGFOOD, update the `web.config`` files for the Portal, Hubs extension, and the Billing extension. Each extension has environment configuration at the top to simplify switching environments.

**NOTE:** The `http://onestb.cloudapp.net/` URL is configured within AAD and cannot be changed. A new hosts file entry was added to support loopback.
<!-- TODO:  Determine whether this still works, because onestb has been deprecated. If it still works, what site does it create?  -->

* * *

<!--
 gitdown": "include-file", "file": "../templates/portalfx-extensions-glossary-authentication.md"}
 -->
