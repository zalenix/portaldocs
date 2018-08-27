
<a name="overview"></a>
## Overview

The Resource Browse pattern provides resource discovery and management across resource groups. It allows users to view lists of resources of a single resource type, or multiple resource types, across regions, locations, and subscriptions.  The resource browse page, or the Browse blade, is typically the entry point into an Azure service.

The `All resources` service, as in the following example, is one of the most used services because it enables you to browse across all Azure resource types in a single list.  
  
![alt-text](../media/top-extensions-resources/allResources.png "All resources – unfiltered")
  
Resource browse provides easy filtering, searching, sorting and grouping within the list.  The user can perform bulk actions to take action on selected resources directly from the list.  Selecting a resource from the browse experience will invoke the Resource Manage experience.

Some examples are as follows.

* All Resources for the RC portal are located at   [http://aka.ms/portalfx/allRCResources](http://aka.ms/portalfx/allRCResources)

* All Virtual Machines for the RC portal are located at  [http://aka.ms/portalfx/allRCVirtualMachines](http://aka.ms/portalfx/allRCVirtualMachines)

Resource facets can be collapsed, as in the following example, to allow more space for columns in the resource grid.

![alt-text](../media/top-extensions-resources/noFacets.png "Resource screen with facet pane collapsed")

 Resources can also be filtered, so that only the ones most relevant to the current task are displayed. In the following image, resources are filtered by resource type and by location.
 
![alt-text](../media/top-extensions-resources/filtered.png "Filtered Resources")

<a name="browse-pattern-behaviors"></a>
## Browse pattern behaviors

The Resource Browse pattern is a fullscreen experience, as in the following image.

Some key items that are displayed are as follows.
•	Title
•	Toolbar for actions
•	Filter panel
•	Search
•	Sort
•	Pagination
•	# of records
•	Grid
•	Drill in links
•	Per-row actions with “…”

<a name="browse-pattern-behaviors-title"></a>
### Title

The title is typically a descriptive plural noun that reflects the items in the grid.  It does not change to reflect any filtering, searching or sorting. Some examples are: `All resources`, `Virtual machines`, and `Storage accounts`. 

Remember to include the display name, including singular and plural forms, in addition to uppercase and lowercase variants for the resource, as specified in [portalfx-extensions-assets.md#define-the-asset-type](portalfx-extensions-assets.md#define-the-asset-type).

<a name="browse-pattern-behaviors-toolbar"></a>
### Toolbar

The toolbar contains actions that operate against the grid, add and delete resources as well as resource-specific actions for a limited set of resource types. An example toolbar is in the following image.

  
![alt-text](../media/top-extensions-resources/toolbar.png "Toolbar")
  
The recommended actions for the toolbar are as follows.

* Add
    Invokes the Resource Create experience for the resource types displayed in the "new" resource blade.  Uses the `Add command` SDK as specified in [top-extensions-browse.md#the-add-command](top-extensions-browse.md#the-add-command).

* Edit columns

        Change the columns in the grid. An example is in the following image.
  
        ![alt-text](../media/top-extensions-resources/edit.png "Toolbar")
  
* Refresh

    Repopulate the grid with fresh data

* Assign tags

    Assign tags to the selected grid items.  The option is disabled until grid items are selected.

* Delete
    Delete the selected grid items.  The option is disabled until grid items are selected.

Actions can be added on a per-row basis using context menu commands as specified in [top-extensions-browse.md#add-context-menu-commands](top-extensions-browse.md#add-context-menu-commands).
