
## Overview 

The Portal uses an internal provider for authentication and authorization. The built-in cloud authentication provider uses Azure Active Directory (AAD), which also supports Microsoft Account users. If your extension needs to differentiate between AAD and MSA users, see [Accessing claims from your server](#accessing-claims-from-your-server). If you are working on first-party extensions, but you are not sure that your extension scenarios comply with Azure terms and conditions, you may want to reach out to <a href="mailto:ibiza-lca@microsoft.com?subject=Compliance with Azure Terms and Conditions">ibiza-lca@microsoft.com</a>.

During sign-in, the Portal obtains a token that contains claims that identify the signed-in user. The Portal also retrieves directories and subscriptions to which the user has access.

**NOTE:** Users can sign in without a subscription. Extensions must gracefully handle this case and return zero assets when queried.

The extension can call ARM from the client or from the extension server. The extension can also call external  services from the client or from the extension server.

Calling external services involves AAD Onboarding.  The onboarding process can take five or six  weeks, so if your extension needs to invoke services other than ARM, you should reach out to the Azure Portal team early in the design phase, as specified in [top-extensions-onboarding-with-related-teams.md](top-extensions-onboarding-with-related-teams.md).

**NOTE**: Only first-party extensions can call alternate resources. Third party extensions use an encrypted token that cannot be decrypted by services other than ARM, therefore they cannot call alternate resources.

* [Signing in](#signing-in)

* [Calling ARM from the client](#calling-arm-from-the-client)

* [Calling ARM from the server](#calling-arm-from-the-server)

* [Calling external resources](#calling-external-resources)

* [Accessing claims](#accessing-claims)

* * *

## Signing in

The following is the signin process that is performed by the Portal.

1. User browses to the Portal.

1. The Portal redirects to AAD to sign in. Sample redirection code is located at [AAD Login v1 authorize endpoint](https://msazure.visualstudio.com/DefaultCollection/One/One%20(Empty%20Default)/_git/AzureUX-PortalFx?path=%2Fsrc%2FStbPortal%2FWebsite%2FAadAuthentication%2FProviders%2FAuthorizeActionProvider.cs&version=GBproduction&line=69&lineEnd=69&lineStartColumn=16&lineEndColumn=64&lineStyle=plain).

1. AAD redirects to the `portal.azure.com/signin` with an id_token. The audience of the id_token is the Azure Portal app.

1. The Portal server exchanges this code for an access token, as specified in [http://aka.ms/portalfx/PortalAuthenticationClient](http://aka.ms/portalfx/PortalAuthenticationClient). This refresh token is returned to the browser, as part of the Portal Shell UI and is stored in memory.

1. When the user triggers the loading of the extension, the extension home page is downloaded from the location in the extension configuration, as specified in [portalfx-extensions-configuration-overview.md](portalfx-extensions-configuration-overview.md). This provides information required by the Shell to bootstrap the extension UI.

1. When an extension asks for a token, it makes a request to the Portal DelegationToken controller endpoint. This endpoint requires the refresh token that was just acquired, in addition to the extension name and the resource name that the extension requested. This endpoint returns access tokens to the browser, as in the sample code located at  [http://aka.ms/portalfx/DelegationTokenProvider](http://aka.ms/portalfx/DelegationTokenProvider). 

    * Sample request:
        ```
        "extensionName":"Microsoft_AAD_IAM",
        "resourceName":"self",
        "tenant":"9e4917cd-bd32-4371-b1c8-82b5d610f2e2",
        "portalAuthorization":"MIIF…."
        ```

    * Sample response:
        ```
        "value":{
        "authHeader":"Bearer eyJ0...",
        "authorizationHeader":"Bearer ...",
        "expiresInMs":3299000,
        "refreshToken":"MIIF...",
        "error":null,
        "errorMessage":null
        },
        "portalAuthorization":"MIIF..."
        ```

    **NOTE**: Tokens are cached in memory on the server, as described in [http://aka.ms/portalfx/DelegationTokenProvider](http://aka.ms/portalfx/DelegationTokenProvider). In this example, the `resourceName:self` indicates that this extension only calls itself from the client.

1. Now the extension's client side can call server side API's, or call external services directly. 

    * Server side API 

        The extension's server-side code can exchange its current access token for another access token that allows it to use resources, as described in [http://aka.ms/portalfx/onbehalfof](http://aka.ms/portalfx/onbehalfof). The developer manages the permissions and dependencies for the extension by registering the application and coordinating with AAD Onboarding, as specified in [portalfx-extensions-onboarding-aad.md](portalfx-extensions-onboarding-aad.md). In the sample code located at [http://aka.ms/portalfx/TokenBasedAuthenticationClient](http://aka.ms/portalfx/TokenBasedAuthenticationClient), a registered  extension's server side code exchanges its access token for an access token for AAD Graph. 

    *  Direct external services call

        The PortalFx's client side `ajax` wrapper makes the `DelegationToken` call to get a token for the specified resource. In this case, the PortalFx team creates the app registration for the extension and manages permissions for the API's as specified in the extension configuration during onboarding with PortalFx.




1. The Portal gets a list of directories that the user can  access from ARM.
1. The Portal gets a list of subscriptions that the user can access from ARM.
1. The Portal signs the user into the last-used directory, the home directory for AAD accounts, or the first directory it gets from ARM for MSA accounts.
1. Finally, the Portal loads the Startboard and all extensions.

**NOTE**: Cookies are not used for authentication.

For more information about OIDC flow, see [https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-protocols-openid-connect-code](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-protocols-openid-connect-code).

## Calling ARM from the client

Your extension should use cross-origin resource sharing (CORS) for all non-aggregated, non-orchestrated calls. If you need to call multiple sources for a single piece of UI, you should use a server API to orchestrate and aggregate those calls.

Use the built-in `ajax()` function to communicate from the extension client to call any extension server API. This function will attach a token targeted at ARM that is specific to your extension for the HTTP header. 

**NOTE**: Do not use `jQuery.ajax()` because it will not properly authorize your requests. If you have a scenario that is not supported by `ajax()`, you can use the `getAuthorizationToken()` function to obtain a token and manually attach it to your request.

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

## Calling external resources

Only Ibiza has the authority to mint tokens. To call external resources, extension developers need to request the creation of the AAD and register the extension resources with Ibiza for the appropriate environment, as specified in [top-onboarding.md#register-the-extension-with-the-portal-product-configuration](top-onboarding.md#register-the-extension-with-the-portal-product-configuration). 

The following example enables `Contoso_Extension`, a sample extension that queries Graph APIs from the client.

1. The extension owner creates an RDTask that is located at [http://aka.ms/portalfx/newextension](http://aka.ms/portalfx/newextension).  This is part of the process that onboards the AAD application with the Portal, as specified in [portalfx-extensions-onboarding-aad.md](portalfx-extensions-onboarding-aad.md).

1. The AAD Onboarding Website is located at [https://aadonboardingsite.cloudapp.net/RegisterApp](https://aadonboardingsite.cloudapp.net/RegisterApp). After the Ibiza team creates the app, you can reach out to <a href="mailto:aadonboarding@microsoft.com?subject=Expediting the Onboarding of a new Extension">aadonboarding@microsoft.com</a> to expedite the process.

1. Submit the RDTask to register the AAD application into the Portal's extension configuration. This step can be done simultaneously with the previous step.

    * The client-side `resourceAccess` configuration for the extension in Portal would look something like the following code.

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

    * The server-side configuration would resemble the following code.

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

      The following code adds a parameter to `ajax` calls so that the extension can exchange tokens. In this instance, the token goes to the resourceName `self` for later exchange.

        ```cs
            MsPortalFx.Base.Net2.ajax({
                uri: "MyController/MyAction",
                setAuthorizationHeader: { resourceName: "self" }
            }).then((myData) => {
                // do work with data
            });
        ```

    *  The controller configuration would resemble the following code.

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

1. After the configuration changes are deployed in the requested environment, like Dogfood, PPE, or PROD, the extension can request tokens for the graph resource using any of its data APIs, as in the following code.

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
## Accessing claims

Tokens received from AAD contain a set of claims that are formatted as key-value pairs.  They contain information about the user, and they are only available to extensions that comply with the Azure privacy policy that is located at [https://www.microsoft.com/en-us/TrustCenter/Privacy/default.aspx](https://www.microsoft.com/en-us/TrustCenter/Privacy/default.aspx).

Extensions that are not covered by this policy, like the ones that share PII with third-parties, do not have access to the token or its claims, because Microsoft can be sued for abuse or misuse of PII as specified in the  privacy policy. These  exceptions need to be approved by reaching out to <a href="mailto:ibiza-lca@microsoft.com?subject=Personally-identifiable Information Policy">ibiza-lca@microsoft.com</a>.

### Accessing claims from the client

Extensions that have access to claims can use the `getUserInfo()` API to retrieve common claims from the client.

**NOTE**: Secondary claims, like name and email, may not always be available and cannot be guaranteed. Token claims may change over time as AAD evolves. Call the `Graph` to get required user information instead of extracting claims yourself. Do not make hard dependencies on claims.

The following code retrieves common claims from the client.

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

### Accessing claims from the extension server

<!-- TODO:  This aka.ms link was previously (http://msdn.microsoft.com/library/system.web.httpcontext.user.aspx). the new link seems to be the one in the aka.ms link.  Determine whether this was the intent. -->

While not recommended, the token used to communicate with your server also contains claims that can be read from the
server by using the ASP.NET claims API specified in [http://msdn.microsoft.com/en-us/library/ee517271.aspx](http://msdn.microsoft.com/en-us/library/ee517271.aspx). To simplify development, the `HttpContext.User` property specified in [http://aka.ms/portalfx/httpContextUser](http://aka.ms/portalfx/httpContextUser) has been augmented with the most commonly used claims.

The extension can use the ASP.NET claims API to read additional claims from the token. Due to size constraints, additional information required by an extension cannot be added to the token. Instead, the extension can obtain it from the AAD Graph API that is specified in [http://aka.ms/portalfx/AADGraphAPI](http://aka.ms/portalfx/AADGraphAPI). 

1.  Reference the following assemblies:

* Microsoft.Portal.AadCore.dll

* System.IdentityModel.Tokens.Jwt.dll

1.  Add the following to your **web.config** file:

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

1. Use [HttpContext.User](http://msdn.microsoft.com/library/system.web.httpcontext.user.aspx) to retrieve the common claims:

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

For more information about default claims that are provided by AAD, see the "Azure AD token reference" article located at [http://aka.ms/portalfx/tokensandclaims](http://aka.ms/portalfx/tokensandclaims).

 {"gitdown": "include-file", "file": "../templates/portalfx-extensions-faq-authentication.md"}

<!--
 gitdown": "include-file", "file": "../templates/portalfx-extensions-glossary-authentication.md"}
 -->
