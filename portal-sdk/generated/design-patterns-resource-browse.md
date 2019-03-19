# Browse Resources
The browse resources pattern provides resource discovery and management of multiple resources spanning multiple subscriptions and resource groups.

<a name="context"></a>
## Context
When managing Azure resources, users want to locate resources in a list, perform operations against items in the list and navigate to a specific resource.

<a name="problem"></a>
## Problem
Users want to see a list of resources, perform actions on items in the list, and navigate to the details for a specific resource.  When the user has no resources of that type, the user wants guidance on the value of the resource, links to any supplemental docs and a button to create a resource instance.

<a name="solution"></a>
## Solution
The browse resources pattern shows resources by displaying key resource properties in a grid view. browse resources provides easy filtering, searching, sorting and grouping within the list. The user can perform bulk actions on selected resources directly from the list. Selecting a resource from the browse experience opens the resource to invoke the `manage a resource` experience.


<a name="solution-also-known-as"></a>
### Also known as

-   Resource list
-   Browse
-   Resource browse
  
<a name="examples"></a>
## Examples

<a name="examples-example-images"></a>
### Example images
<div style="max-width:800px">
<img alttext="browse resources example" src="../media/design-patterns-resource-browse/resource-browse-1.png"  />
</div>

<a name="examples-example-uses"></a>
### Example uses
These Azure resources are good examples of this design pattern 

<ul>
<li>Browse <a href="https://rc.portal.azure.com/#blade/HubsExtension/ArtBrowseBlade/resourceType/Microsoft.Resources%2Fresources" target="_blank">all resources</a></li>
<li>Browse <a href="https://rc.portal.azure.com/#blade/HubsExtension/Resources/resourceType/Microsoft.Compute%2FVirtualMachines" target="_blank">virtual machines</a></li>
</ul>

<a name="use-when"></a>
## Use when
Showing a list of Azure resources

<a name="anatomy"></a>
## Anatomy
<!-- TODO UX get latest screenshot, ensure it has all elements of anatomy -->
<div style="max-width:800px">
<img alttext="browse resources anatomy" src="../media/design-patterns-resource-browse/resource-browse-anatomy.png"/>
</div>

The browse resources pattern is full screen experience that usually contains:
1. Toolbar
2. Search
3. Record count
4. Filtering
5. All components of the grid pattern 

<a name="behavior"></a>
## Behavior

<a name="behavior-title"></a>
### Title
The title of a browse page is generally a descriptive, plural noun that reflects the items on the grid. Examples: “All resources”, “Virtual machines”, “Storage accounts”.

<a name="behavior-toolbar-commands"></a>
### Toolbar commands
The toolbar for the browse pattern contains actions that operate against a grid, i.e. 'Add' or 'Delete' a resource, as well as resource-specific actions (for a limited set of resource types). 
There are two sets of actions on the toolbar. The first set of actions do not require a grid row selection and operate at the page level, for exampple **Add**, **Edit columns** and **Refresh**. The second set, separated by a pipe, is enabled only when one or more resource items are selected on the grid. 

<div style="max-width:800px">
<img alttext="browse resources toolbar" src="../media/design-patterns-resource-browse/resource-browse-toolbar.png"/>

The recommended actions for the browse resources toolbar are:
* **Add** invokes the resource create experience
* **Edit columns** changes the columns in the grid
* **Refresh** repopulates the grid with fresh data
* `|` separator for the row-level actions
* **Assign tags** enables tagging for the selected grid items
* **Delete** will permanently remove the selected grid items from Azure

<a name="behavior-filtering"></a>
### Filtering
The filter panel contains properties that are common across all resource types displayed in the grid.
Coming soon: Additional sets of filters pertaining to each selected resource type will be available in the filter panel. This allows for narrowing down results based on attributes related to a resource type. For example, filter a virtual machine based on IP address, location and availability set.

<a name="behavior-grid-content"></a>
### Grid content
By default, browse shows the `resource name`, `resource group`, `location`(aka region) and `subscription`. We recommend you choose key resource properties to display as columns so that the user can differentiate between resources in the grid. You can specify default columns and available columns that the user can add using the 'Edit columns' command. 

You can also group the content of the grid by resource type, subscription, resource group or location. This would reorganize the list items into groups. Read more on the grid pattern page [design-patterns-page-grid.md](design-patterns-page-grid.md).

<a name="behavior-leveraging-the-context-menu"></a>
### Leveraging the context menu
Actions can be performed on a specific resource using context menu commands. Read more on the `grid design pattern`.

<a name="behavior-leveraging-the-context-menu-empty-state"></a>
#### Empty state
When the resource list has no items to display, provide the user with information on how to get started, i.e help links. The icon, message and link come from your asset definition.
<div style="max-width:800px">
<img alttext="Empty state" src="../media/design-patterns-resource-browse/resource-browse-NoResources.png"/>

<a name="do"></a>
## Do
<!-- TODO UX verify whether Name is a good column header -->
- Include some common columns in your grid: `Name`, `location` and `subscription`

- Include key resource properties as columns for the specific resource types

- Include an empty message/link to explain the value of your resource

- Do define keywords for your asset so your service will be more discoverable  


<a name="don-t"></a>
## Don&#39;t

- Don’t offer a browse resources experience that doesn’t have any resource-specific properties    

<a name="related-design-guidelines"></a>
## Related design guidelines

* Grid [design-patterns-page-grid.md](design-patterns-page-grid.md)
* Full screen [design-patterns-page-fullscreen.md](design-patterns-page-fullscreen.md)
* Create a Resource [design-patterns-resource-create.md](design-patterns-resource-create.md)
* Manage a Resource [design-patterns-resource-manage.md](design-patterns-resource-manage.md)
* Design guidelines [top-design.md](top-design.md)

<a name="research-and-usability"></a>
## Research and usability
The browse resources pattern has been tested extensively.

[Browse - updated filter design](https://hits.microsoft.com/study/6009787)

View [all browse resources research](https://hits.microsoft.com/search?q=browse%20filter&filter=entityType%20!%3D%20Resource__entityType!%3DStudy%20Observation&inField=Id,Title,Summary,CreatedBy,UpdatedBy,EntityType,StudySummaries,StudyTitles,QuestionSummaries,QuestionTitles,InsightSummaries,InsightTitles,RecommendationSummaries,RecommendationTitles,CollectionSummaries,CollectionTitles,SupplementalContents,PointOfContact,Researchers,Teams,Methods,TaggedProducts,Products,UserTypes,ResearchPrograms,MarketSegments,TaggedFormFactors,FormFactors,ResearchAreas,Topics,RecommendationType,Industries,ResearchGroup)

<a name="telemetry"></a>
## Telemetry

* Browse frequency by resource type over last 28 days [View report](https://aka.ms/portalfx/fundamentals/browsetelemetry)

<a name="for-developers"></a>
# For developers
Developers can use the following information to get started implementing this pattern

<a name="for-developers-tips-and-tricks"></a>
## Tips and tricks

* Set your icon - `AssetType` icon Icon=”{Resource CommonImages.snowmobile, Module=V1/ResourceTypes/Common/CommonLogos}”
* Set your desription for use in empty browse - `AssetType` description Description=”{Resource AssetTypeNames.Snowmobile.linkTitle, Module=ClientResources}”
* Empty message/link - `AssetType` link <Link Title=”{Resource AssetTypeNames.Snowmobile.linkTitle, Mobile=ClientResources}” Uri=”http://www.bing.com”/>


<a name="for-developers-related-documentation"></a>
## Related documentation

<!-- TODO Fixup links when new browse publishes -->
* Building browse experiences [top-extensions-browse.md](top-extensions-browse.md)
    * Add command [portalfx-browse.md#add-command](portalfx-browse.md#add-command)
    * Customizing columns [portalfx-browse.md#add-command](portalfx-browse.md#add-command)
    * Context menu commands [portalfx-browse.md#adding-context-menu-commands](portalfx-browse.md#adding-context-menu-commands)
* Assets [portalfx-assets.md](portalfx-assets.md)
    * Empty state messaging [portalfx-assets.md#assets-defining-your-asset-type](portalfx-assets.md#assets-defining-your-asset-type)

