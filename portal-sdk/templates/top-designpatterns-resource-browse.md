# Resource Browse 
The resource browse pattern provides resource discovery and management across multiple resource types in multiple subscriptions/resource groups.

# Context
Customers have many resources of many different types in Azure.

# Problem
Customers need a way to see a list of resources, interact with that list to filter/sort, perform actions on items in the list and navigate to the details for an item in the list.

# Solution
The resource browse pattern is used to view lists of resources of a single resource type or multiple resource types across regions, locations, subscriptions and resource groups. The resource browse page is often the entry point into an Azure service. The All resources service in Azure is one of the most used services because it enables you to browse across all Azure resource types in a single list. Resource browse provides easy filtering, searching, sorting and grouping within the list. Bulk actions against the items in the list enables taking action on resources directly from the list. Selecting a resource from the browse experience will invoke the resource manage experience.


## Also known as 

-   Resource list

-   Browse
  

# Examples 

## Example images

## Example uses
These Azure resources are good examples of this design pattern 

-   [All resources](https://rc.portal.azure.com/#blade/HubsExtension/ArtBrowseBlade/resourceType/Microsoft.Resources%2Fresources)

-   [Virtual Machines](https://rc.portal.azure.com/#blade/HubsExtension/Resources/resourceType/Microsoft.Compute%2FVirtualMachines) 

![Resource browse example](../media/top-designpatterns-resource-browse/Resource-browse-2.png "Resource browse example")


# Use when
You are building an extension to manage a set of resources

## Anatomy  
The resource browse pattern is fullscreen experience that usually contains:
 
![Resource browse anatomy](../media/top-designpatterns-resource-browse/ResBrowse_1_Anatomy.png "Resource browse anatomy")

1. Toolbar
2. Search
3. Filtering
4. Record count
5. All components of the grid pattern 

## Behavior 

### Title
The title of a browse page is generally a descriptive, plural noun that reflects the items on the grid. The title does not change to reflect any filtering, searching or sorting. Examples: “All resources”, “Virtual machines”, “Storage accounts”.

### Toolbar commands
The toolbar contains actions that operate against a grid, i.e. add and delete a resource, as well as resource-specific actions (for a limited set of resource types). 
There are two sets of actions on the toolbar. The first set is applicable to for all items on the grid or generic page level actions like ‘Add’, Refresh’. The second set separated by a pipe is enabled only when one or more resource items are selected on the grid. 
The recommended actions for the toolbar are:
* Add invokes the resource create experience
* Edit columns changes the columns in the grid
* Refresh repopulates the grid with fresh data
* Assign tags enables tagging for the selected grid items
* Delete will permanently remove the selected grid items

### Filtering
The filter panel contains properties that are common across all resource types displayed in the grid.
Coming soon: Additional sets of filters pertaining to each selected resource type will be available in the filter panel. This allows for narrowing down results based on attributes related to a resource type. For example, filter a virtual machine based on IP address, location and availability set.
### Grid content
By default, browse shows the resource name, resource group, location and subscription. We recommend you choose key resource properties to display as columns so that your customer can differentiate the resources in the grid. You can specify default columns and available columns that user can add using the Edit columns command. 

You can also group the content of the grid by resource type, subscription, resource group or location. This would switch the contents to a grouped grid. Read more on the grid pattern page.
### Leveraging the context menu
Actions can be performed on a specific resource using context menu commands.
### Empty state
When the resource list has no items to display, provide the user with information on how to get started, i.e help links. The icon, message and link come from your asset definition.


## Do 

* Include some common columns in your grid: Name, location and subscription
* Include key columns for the specific resource types
* Include an empty message/link to explain the value of your resource
* Do define keywords for your asset so your service will be more discoverable  

## Don't 

* Don’t offer a resource browse experience that doesn’t have any resource-specific properties.    

# Related design patterns

* Grid [top-designpatterns-page-grid.md](top-designpatterns-page-grid.md)
* Full screen [top-designpatterns-page-fullscreen.md](top-designpatterns-page-fullscreen.md)
* Resource Create [top-designpatterns-resource-create.md](top-designpatterns-resource-create.md)
* Resource Manage [top-designpatterns-resource-manage.md](top-designpatterns-resource-manage.md)

# Research and usability

# Telemetry

# For developers 

## Tips and tricks 

* Set your icon - AssetType icon Icon=”{Resource CommonImages.snowmobile, Module=V1/ResourceTypes/Common/CommonLogos}”
* Set your desription for use in empty browse - AssetType description Description=”{Resource AssetTypeNames.Snowmobile.linkTitle, Module=ClientResources}”
* Empty message/link - AssetType link <Link Title=”{Resource AssetTypeNames.Snowmobile.linkTitle, Mobile=ClientResources}” Uri=”http://www.bing.com”/>


## Related documentation

* Assets [portalfx-assets.md](portalfx-assets.md)
* Building browse experiences (portalfx-browse.md)
* Add command (portalfx-browse.md#add-command)
* Customizing columns (portalfx-browse.md#add-command)
* Context menu commands (portalfx-browse.md#adding-context-menu-commands)
* Empty state messaging (portalfx-assets.md#assets-defining-your-asset-type)

