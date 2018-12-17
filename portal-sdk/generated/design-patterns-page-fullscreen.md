<a name="full-screen-pages"></a>
# Full screen pages
Use navigation patterns for the portal that fill the screen and behave like most websites.

<a name="full-screen-pages-context"></a>
## Context
As users navigate the portal, they expect a common web interaction experience. 

<a name="full-screen-pages-problem"></a>
## Problem
Earlier portal designs used narrow blades that stacked to the right into horizontally scrolling "journeys" as the user navigated.  These stacked blades often resulted in existing blades being partially displayed which made it hard for the user to know where to look and orient where in the portal they were.  Horizontal scrolling is also more foreign than the common vertical scrolling of long web pages.  

Users have made it very clear they don’t like horizontal scrolling – in large part because it doesn’t match how they expect to interact with websites.   

<a name="full-screen-pages-solution"></a>
## Solution
In 2017 Azure moved from narrow blades to full page experiences and have introduced dialogs and context panes to further avoid unnecessary context switches.

<a name="full-screen-pages-solution-also-known-as"></a>
### Also known as

-   Avoid horizontal scrolling
-   Avoid context switches

<a name="full-screen-pages-examples"></a>
## Examples

<a name="full-screen-pages-examples-example-images"></a>
### Example images

<div style="max-width:800px">
<img alttext="Full screen sample" src="../media/design-patterns-page-fullscreen/Full-screen-1.png"  />
</div>

<a name="full-screen-pages-examples-example-uses"></a>
### Example uses
These Azure resources are good examples of this design pattern 

* Creating a VM - [Free account virtual machine](https://rc.portal.azure.com/#create/microsoft.freeaccountvirtualmachine)
* Browsing all resources - [All resources](https://rc.portal.azure.com/#blade/HubsExtension/ArtBrowseBlade/resourceType/Microsoft.Resources%2Fresources)
* Virtual Machine 

<a name="full-screen-pages-use-when"></a>
## Use when
Full screen is a foundation of any page in the Azure portal. All resources are built upon full screen experiences.


<a name="full-screen-pages-anatomy"></a>
## Anatomy
A full screen page usually contains:

<div style="max-width:800px">
<img alttext="Full screen anotomy" src="../media/design-patterns-page-fullscreen/FS_1_Anatomy.png"  />
</div>

1. Menu
2. Toolbar
3. Content area
4. Context pane
5. Dialog
<!-- TODO UX - get screenshot for anatomy that includes Dialog -->

<a name="full-screen-pages-behavior"></a>
## Behavior
The current blade should occupy the available screen space and any subsequent user interactions should seek to minimize navigating the user.  This would involve using a Dialog or Context pane for user interaction.

<a name="full-screen-pages-behavior-maximized-blades"></a>
### Maximized blades
All Browse views and Menu blades open full screen by default.

<a name="full-screen-pages-behavior-origin-snapping"></a>
### Origin snapping
In the event a child blade would overflow the current available screen real estate, the newly opened blade snaps to the left of the screen, moving all other blades out of view

<a name="full-screen-pages-behavior-navigation-and-back-stack"></a>
### Navigation and back stack
Even though previous blades are no longer visible, the user can traverse to an earlier blade from their current journey.
<div style="max-width:200px">
<img alttext="Breadcrumb" src="../media/design-patterns-page-fullscreen/FS_2_Breadcrumbs@2x-400x126.png" />
</div>
Use the portal breadcrumbs or the browser back button

<div style="max-width:200px">
<img alttext="Close blade" src="../media/design-patterns-page-fullscreen/FS_3_X@2x-400x126.png" />
</div>
Use the Close button in the right corner


<a name="full-screen-pages-do"></a>
## Do

* Keep input fields at a max width of 265px
* Use context panes in favor of narrow blades for user input or displaying summary information  

<a name="full-screen-pages-don-t"></a>
## Don&#39;t

* Blades shouldn’t open at a specified size, instead the page should open as “maximized” (`InitialDisplayState="Maximized"`)
* When linking to a site outside of Azure, such as documentation, don’t open the page in the same browser window. It should open in an new tab.

<a name="full-screen-pages-related-design-guidelines"></a>
## Related design guidelines

* Create a Resource [design-patterns-resource-create.md](design-patterns-resource-create.md)
* Browse Resources [design-patterns-resource-browse.md](design-patterns-resource-browse.md)
* Manage a Resource [design-patterns-resource-manage.md](design-patterns-resource-manage.md)
* Design guidelines [top-design.md](top-design.md)

<a name="full-screen-pages-research-and-usability"></a>
## Research and usability

Research history and retrospective for Azure Portal Full Screen
[Full screen history and retrospective](https://microsoft.sharepoint.com/:p:/r/teams/azureteams/aapt/azureux/portalfx/_layouts/15/Doc.aspx?sourcedoc=%7B78bf3a97-2ccc-4920-886d-ce508980c3d8%7D&action=default)

<a name="full-screen-pages-telemetry"></a>
## Telemetry
Coming soon

<a name="for-developers"></a>
# For developers
Developers can use the following information to get started implementing this pattern

<a name="for-developers-tips-and-tricks"></a>
## Tips and tricks

* Set a max-width on your content in the CSS (blade/part templates) OR set initial DisplayState=“normal” in a blade’s PDL. 

<a name="for-developers-related-documentation"></a>
## Related documentation

* Blade [top-extensions-blades.md](top-extensions-blades.md)
* Context Pane [top-extensions-context-panes.md](top-extensions-context-panes.md)
* Dialog [top-extensions-dialogs.md](top-extensions-dialogs.md)
