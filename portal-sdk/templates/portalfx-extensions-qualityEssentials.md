
## Quality Essentials
  
Compliance criteria and practices are defined in Quality Essentials throughout the development cycle. These ensure that services meet the Trusted Cloud commitments outlined in the Microsoft Azure Trust Center for our customers. These are required procedures for preview and Global Availability, and are to be revisited for every release cycle.

Nearly 70% of Azure users are from outside of the United States. Therefore, it is important to make Azure a globalized product. There are a few internationalization requirements that the extension or service is required to support. This is the same set of languages that are supported by Azure Portal for GA.

The customer has a different set of expectations for the extension in each phase. To meet customer expectations, we have compiled production-ready metrics for each phase. The development of an extension  can proceed to the next step when it meets the production-ready metrics for the current step. To meet customer expectations and continue to increase customer satisfaction, several quality metrics are tracked for every extension by the Get1CS team. An overview of Quality Essentials is located at [https://aka.ms/qualityessentials](https://aka.ms/qualityessentials). 

 The Azure team only tracks the production-ready metrics and localization requirements. There may be tools to install from the QE and 1CS sites that are part of the Quality Essentials process. Quality Essentials and 1CS provide access to manage the release policies and procedures for each extension. QE tracks the following policies.
* Accessibility
* Global readiness
* Global trade compliance
* License terms
* Open source software
* Privacy
* Security Development Lifecycle (SDL)
* Software integrity
 
Some of the procedures such as Accessibility, GB Certificate, Privacy, and Security are also measured in the Service Health Review Scorecard that is located at [https://aka.ms/shr](https://aka.ms/shr), and in the production-ready metrics for management review and tracking. 

These requirements apply to both the Portal fx and extensions. Since Fx provides the common infrastructure and UI controls that govern the data handling and UX, hence some of the compliance work for extensions would be identical across in Ibiza, and rationally be mitigated by the Framework. For example, Accessibility support on keyboard navigation and screen reader recognition, as well as the regional format and text support to meet globalization requirements, are implemented at the controls that Framework distributed.  The same is true for Security threat modeling, extension authentication to ARM, postMessage/RPC layer and UserSettings, etc. are handled by Framework. To minimize the duplicate efforts on those items, Fx provides some level of "blueprint" documentation that can be used as a reference for compliance procedures. You are still responsible to review the tools and submit the results for approval previous to shipping the extension. 

| Policy            | Location  | Fx coverage |
| ---               | ---       | --- |
| Accessibility     | [portalfx-accessibility.md](portalfx-accessibility.md) | Generic control supports on keyboard, focus handling, touch, screen reader, high contrast, and theming |
| Global Readiness  | [portalfx-localization-globalization.md](portalfx-localization-globalization.md) | Localizability, regional format, text support, China GB standard |
| Privacy           |  [top-extensions-authentication-flow.md](top-extensions-authentication-flow.md) | User settings data handling, encryption, and authentication |
| SDL               |  [https://microsoft.sharepoint.com/ teams/QualityEssentials/SitePages/ SDL_SecurityDevelopmentLifecycleOverview.aspx](https://microsoft.sharepoint.com/teams/QualityEssentials/SitePages/SDL_SecurityDevelopmentLifecycleOverview.aspx)         | Security Development Lifecycle Threat modeling |

For more information and any questions about Fx coverage, reach out to the Fx Coverage contact that is located in [portalfx-extensions-contacts.md](portalfx-extensions-contacts.md).