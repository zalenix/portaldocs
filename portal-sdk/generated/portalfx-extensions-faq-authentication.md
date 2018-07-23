<a name="faqs-for-authentication"></a>
## FAQs for Authentication

   <!-- TODO:  FAQ Format is ###Link, ***title***, Description, Solution, 3 Asterisks -->

<a name="faqs-for-authentication-get-subscription-list"></a>
### Get subscription list

***How do I get the list of subscriptions? Or just those selected by a user?***

SOLUTION: Call the `MsPortalFx.Azure.getAllSubscriptions()` or `MsPortalFx.Azure.getSelectedSubscriptions()` APIs. For more information, see   [portalfx-subscriptions.md](portalfx-subscriptions.md).

* * *

<a name="faqs-for-authentication-session-expiration"></a>
### Session expiration

***When do authenticated sessions expire?***

SOLUTION: The Portal does not automatically log users out after a period of inactivity; it only logs a user out when the user's AAD-issued authentication token expires. Otherwise, all subsequent operations would fail.

This typically happens after a few hours of usage, maybe eight to 24 hours based on the type of account. It may also happen if the token was not refreshed or renewed for a period of time, which is typically one hour.

**NOTE**: If the browser is in a situation where it cannot connect to the network for more than an hour, typically, the user is logged out.

* * *

<a name="faqs-for-authentication-enable-local-portal-authentication"></a>
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