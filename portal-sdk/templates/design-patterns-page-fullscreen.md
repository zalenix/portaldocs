# Page Full screen 
Use navigation patterns for the portal that fill the screen and behave like most websites.

# Context
As users navigate the portal, they expect a common web interaction experience. 

# Problem
Earlier portal designs used narrow blades that stacked to the right into horizontally scrolling "journeys" as the user navigated.  These stacked blades often resulted in existing blades being partially displayed which made it hard for the user to know where to look and orient where in the portal they were.  Horizontal scrolling is also more foreign than the common vertical scrolling of long web pages.  

Users have made it very clear they don’t like horizontal scrolling – in large part because it doesn’t match how they expect to interact with websites.   

# Solution
In 2017 Azure moved from narrow blades to full page experiences and have introduced dialogs and context panes to further avoid unnecessary context switches.

## Also known as 

-   Avoid horizontal scrolling
-   Avoid context switches

# Examples

## Example images 

<div style="max-width:800px">
<img alttext="Full screen sample" src="../media/designpatterns-page-fullscreen/Full-screen-1.png"  />
</div>
## Example uses
These Azure resources are good examples of this design pattern 

* Creating a VM - [Free account virtual machine](https://rc.portal.azure.com/#create/microsoft.freeaccountvirtualmachine)
* Browsing all resources - [All resources](https://rc.portal.azure.com/#blade/HubsExtension/ArtBrowseBlade/resourceType/Microsoft.Resources%2Fresources)
* Virtual Machine 

# Use when
Full screen is a foundation of any page in the Azure portal. All resources are built upon full screen experiences.


## Anatomy  
A full screen page usually contains:

<div style="max-width:800px">
<img alttext="Full screen anotomy" src="../media/designpatterns-page-fullscreen/FS_1_Anatomy.png"  />
</div>

1. Menu
2. Toolbar
3. Content area
4. Context pane
5. Dialog

## Behavior 
The current blade should occupy the available screen space and any subsequent user interactions should seek to minimize navigating the user.  This would involve using a Dialog or Context pane for user interaction.

### Maximized blades 
All Browse views and Menu blades open full screen by default.

### Origin snapping 
In the event a child blade would overflow the current available screen real estate, the newly opened blade snaps to the left of the screen, moving all other blades out of view

### Navigation and back stack 
Even though previous blades are no longer visible, the user can traverse to an earlier blade from their current journey.
<div style="max-width:200px">
<img alttext="Breadcrumb" src="../media/designpatterns-page-fullscreen/FS_2_Breadcrumbs@2x-400x126.png" />
</div>
Use the portal breadcrumbs or the browser back button

<div style="max-width:200px">
<img alttext="Close blade" src="../media/designpatterns-page-fullscreen/FS_3_X@2x-400x126.png" />
</div>
Use the Close button in the right corner


## Do 

* Keep input fields at a max width of 265px
* Use context panes in favor of narrow blades for user input or displaying summary information  

## Don't 

* Blades shouldn’t open at a specified size, instead the page should open as “maximized” (`InitialDisplayState="Maximized"`)
* When linking to a site outside of Azure, such as documentation, don’t open the page in the same browser window. It should open in an new tab.

# Related design patterns

* Resource Create [designpatterns-resource-create.md](designpatterns-resource-create.md)
* Resource Browse [designpatterns-resource-browse.md](designpatterns-resource-browse.md)
* Resource Manage [designpatterns-resource-manage.md](designpatterns-resource-manage.md)
* Design patterns [top-design.md](top-design.md)

# Research and usability

Research history and retrospective for Azure Portal Full Screen
[Full screen history and retrospective](https://microsoft.sharepoint.com/:p:/r/teams/azureteams/aapt/azureux/portalfx/_layouts/15/Doc.aspx?sourcedoc=%7B78bf3a97-2ccc-4920-886d-ce508980c3d8%7D&action=default)

# Telemetry
Coming soon

# For developers 
Developers can use the following information to get started implementing this pattern

## Tips and tricks 

* Set a max-width on your content in the CSS (blade/part templates) OR set initial DisplayState=“normal” in a blade’s PDL. 

## Related documentation

* Blade [top-extensions-blades.md](top-extensions-blades.md)
* Context Pane [top-extensions-context-panes.md](top-extensions-context-panes.md)
* Dialog [top-extensions-dialogs.md](top-extensions-dialogs.md)
