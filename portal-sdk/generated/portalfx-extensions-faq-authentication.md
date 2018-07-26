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