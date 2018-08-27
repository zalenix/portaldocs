<a name="web-workers"></a>
## Web workers

As you are already aware performance of the Portal is one of the bigger customer pain points and a major driver for dissatisfaction with NPS (Net promoter score).
 
We’ve been actively working with different teams on a one-on-one basis, whilst also trying to improve performance from the framework side.
 
One of the bigger opportunities we’ve been working towards is moving extensions into their own web workers. This will give extension’s their own separate thread to run which won’t be blocking or blocked on the main thread. As we move more and more extensions over to this model performance across the board should increase.

To read more about web workers see https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API.

Prewarming involves running your extension code in a same-origin webworker (same origin as the Portal). This drastically improves load times of your extension. The only prerequisite for onboarding is that you are on the hosting service (which you are).

The caveat is you are running in a webworker, which means you do not have to access to DOM APIs (things like document.*) etc. In order to onboard, your extension must be DOM free, which includes parts of jQuery that touch the DOM.

The other issue is that you are now running same-origin as the Portal, if you are trying to self build URIs using window.location your URIs will end up being relative to the Portal and fail. Additionally, your controllers and other ajax requests you might be making need to add portal to the list of domains that are allowed to call them. If you are making calls to third party services and they don’t support OPTIONS calls, then you may not be able to migrate. You can contact ibizaperfv@microsoft.com for help if you run into this issue.

Webworkers might also differ from Iframes in other subtle ways and expose bugs in your code and portal/framework code based on your particular scenario. Once your extension is live in a webworker, treat this as no different than running in a new browser. If something breaks you might need to do a hotfix or workaround (sometimes even if the issue is in a library/Fx component that previously worked). Obviously the portal/Fx teams goal is to also fix all those issues and make the webworker/Iframe development/runtime experience be as transparent to your code as possible. But this cannot be done 100% of the time and therefore we even expose msportalfx.iswebworker for your code to be able to react to differences.

With those two things in mind, to actually run your extension in a webworker, you should use the feature flag feature.prewarming=true,your_extension_name. This will force your extension to be run as a webworker. We recommend running through your entire test suite with this flag on. Also, make sure to step through and try this yourself by loading the portal in a browser and validating your core scenarios. Example: 

When you’ve validated your extension works in a webworker, and you are ready to onboard, please approve this PR and we will create a PR that modifies your extension’s portal config to move your extension onto prewarming. We will wait for two engineering approvals from your team on this PR before merging it into dogfood/rc (please add other folks who you would like to verify and sign off). We will then create a second PR for the merge into MPAC and wait for another two approvals before merging it into MPAC.


<a name="web-workers-how-to-test-opt-into-web-workers"></a>
### How to test/opt into web workers:

You can opt into this experience today via the below methods;
1. Test locally using [https://ms.portal.azure.com?feature.prewarming=true,your_extension_name](https://ms.portal.azure.com?feature.prewarming=true,your_extension_name)
1. Email the ibizaperfv@microsoft.com alias and request your extension be onboarded.
1. We will respond with a PR which updates your config, we require two engineering PR approvals for your team before we complete it.
1. This will enable your extension in our dogfood and rc environment
1. Once you have validated your extension there we will follow the above PR process again to merge to MPAC and then repeat for PROD.
