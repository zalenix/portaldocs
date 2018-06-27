
<a name="blades"></a>
# Blades

<a name="blades-overview"></a>
## Overview

Blades are the main UI container in the Portal. They are equivalent to `windows` or `pages` in other UX frameworks.  A blade typically takes up the full screen, has a presence in the Portal breadcrumb, and has an 'X' button to close it. The `TemplateBlade` is the recommended development model, which typically contains an import statement, an HTML template for the UI, and a ViewModel that contains the logic that binds to the HTML template. However, a few other development models are supported.     

The following is a list of different types of blades.

| Type                          | Document           | Description |
| ----------------------------- | ---- | ---- |
| TemplateBlade                 | [top-blades-template.md](top-blades-template.md) | Creating any Portal blade. This is the main and recommended authoring model for UI in the Portal. (Recommended) |
| MenuBlade                     | [top-blades-menublade.md](top-blades-menublade.md) | Displays a vertical menu at the left of a blade.      |
| Resource MenuBlade       |   [top-blades-resourcemenu.md](top-blades-resourcemenu.md)  | A specialized version of MenuBlade that adds support for standard Azure resource features.  | 
| Context Blades     |   [top-extensions-context-panes.md](top-extensions-context-panes.md)  | A specialized version of Blade that does not scroll horizontally.   | 
| Blade Settings | [top-blades-settings.md](top-blades-settings.md) | Settings that  standardize key interaction patterns across resources. | 
| FrameBlades       | [top-blades-frameblades.md](top-blades-frameblades.md)  | Provides an IFrame to host the UI. Be advised that if you go this route you get great power and responsibility. You will own the DOM, which means you can build any UI you can dream up. You cannot use Ibiza controls meaning you will have an increased responsibility in terms of accessibility, consistency, and theming.  |
| Opening and Closing Blades    | [top-blades-opening-and-closing.md](top-blades-opening-and-closing.md) | Opening and closing blades, within an extension and from a separate extension.  |
| Advanced TemplateBlade Topics    | [top-blades-advanced.md](top-blades-advanced.md) | More blade development techniques.  |
| Blade with tiles   | [top-blades-legacy.md](top-blades-legacy.md)  |  Legacy authoring model. Deprecated due to its complexity. | 


 
<a name="blades-best-practices"></a>
## Best Practices

Following these best practices usually results in the best performance. Portal development patterns or architectures that are recommended based on customer feedback and usability studies are categorized by the type of blade.

* [Best Practices for All blades](#best-practices-for-all-blades)

* [Best Practices for Create blades](#best-practices-for-create-blades)

* [Best Practices for Menu blades](#best-practices-for-menu-blades)

* [Best Practices for Resource List blades](#best-practices-for-resource-list-blades)
	
<a name="blades-best-practices-best-practices-for-all-blades"></a>
### Best Practices for All blades

These patterns are recommended for every extension.

* Never change the name of a blade or a part. These are unique identifiers that appear in links that users may bookmark, and they are used to locate your blade when a user pins it to the dashboard. Changing the name can break aspects of the user experience.

  * You can safely change the title (displayed in the UI) of the blade.

* Limit blade `parameters` updates to the addition of parameters that are marked in **TypeScript** as optional. Removing, renaming, or adding required parameters will cause breaks if other extensions are pointing to your blade, or if previously pinned tiles are not configured to send those parameters.

* Never remove parameters from their `Parameters` type.  Instead, ignore them if they are no longer needed.

* Use standard `<a href="#">` tags when adding `fxclick` to open child blades to make the links accessible.

* Do not use `<div>` tags when adding `fxClick` to open child blades. The <div>` tags require apply additional HTML attributes to make the links accessible.

* Do not use the **Knockout** `click` data-binding to open child Blades. The `fxClick` data-binding was developed specifically to handle asynchronous click communication between the Portal Shell IFrame and the  extension's IFrame.

* Do not call any of the `container.open*` methods from within an `fxclick handler`.  If the extension calls them, then the `ext-msportalfx-activated` class will be automatically added to the html element that was clicked. The class will be automatically removed when the child blade is closed.

* Avoid observables when possible

  The values in non-observables are much more performant than the values in observables.  Specifying a string instead of a `KnockoutObservable<string>`, os specifying a boolean instead of a `KnockoutObservable<boolean>` will improve performance. The benefit for each operation is small, but when a blade makes tens or hundreds of values, it adds up.
  
* Name `ViewModel` properties properly

  Make sure the only data that the proxied observables layer copies to the Shell is the data that is needed in the extension iFrame. The Shell displays a warning when specific types of objects are being sent to the shell, for example, `editScopes`, but it can not guard against everything. 

  Extension developers should occasionally review the data model to ensure that only the needed data is public.  The names of private members begin with an underscore, so that proxied observables are made aware by the naming convention that the members are private and therefore should not be sent to the shell.

<a name="blades-best-practices-best-practices-for-create-blades"></a>
### Best Practices for Create blades

Best practices for create blades cover common scenarios that will save time and avoid deployment failures.

* All Create blades should be a single blade. Instead of wizards or picker blades, extensions should use form sections and dropdowns.

* The subscription, resource group, and location picker blades have been deprecated.  Subscription-based resources should use the built-in subscription, resource group, location, and pricing dropdowns instead.

* Every service should expose a way to get scripts to automate provisioning. Automation options should include **CLI**, **PowerShell**, **.NET**, **Java**, **NodeJs**, **Python**, **Ruby**, **PHP**, and **REST**, in that order. ARM-based services that use template deployment are opted in by default.

<a name="blades-best-practices-best-practices-for-menu-blades"></a>
### Best Practices for Menu blades

Services should use the Menu blade instead of the Settings blade. ARM resources should opt in to the resource menu for a simpler, streamlined menu.

Extensions should migrate to the `ResourceMenu` for all of their resources.


<a name="blades-best-practices-best-practices-for-resource-list-blades"></a>
### Best Practices for Resource List blades

  Resource List blades are also known as Browse blades.

  Browse blades should contain an "Add" command to help customers create new resources quickly. They should also contain Context menu commands in the "..." menu for each row. And, they should show all resource properties in the Column Chooser.

  For more information, see the Asset documentation located at [portalfx-assets.md](portalfx-assets.md).



 ## Frequently asked questions

<a name="blades-best-practices-when-to-make-properties-observable"></a>
### When to make properties observable

*** Why not make every property observable just in case you want to update it later?***

SOLUTION: Performance. Using an observable string instead of a string increases the size of the `ViewModel`.  It also means that the proxied observable layer has to do extra work to connect listeners to the observable if it is ever updated. Both factors reduce the blade reveal performance - for no benefit when the observable is never updated. Extensions should use non-observable values wherever possible. However, there are still many framework Viewmodels that accept only observable values, therefore the extension may provide an observable even though it will never be updated.

* * *


 ## Glossary

This section contains a glossary of terms and acronyms that are used in this document. For common computing terms, see [https://techterms.com/](https://techterms.com/). For common acronyms, see [https://www.acronymfinder.com](https://www.acronymfinder.com).

| Term                              | Meaning |
| ---                               | --- |
| Deep linking |  Updates the portal URL when a blade is opened, which gives the user a URL that directly navigates to the new blade. |
| DOM | Document Object Model |
| PDE | Portal Definition Export | 
| proxied observable layer | The `ViewModel` that contains the blade.  It will exist in the separate iframe that communicates with the Portal shell iframe `ViewModel`.  |
| RBAC | Role based access. Azure resources support simple role-based access through the Azure Active Directory. | 

