
<a name="resource-tags"></a>
## Resource Tags

 In the Preview Portal, resource groups allow you to manage related resources as a single unit, which is even more valuable when used  with [role-based access control](portalfx-permissions.md). Now, you can tag resources with name/value pairs to categorize and view resources across resource groups and, within the Portal, across subscriptions. Subscriptions are the only way in the Azure Portal to organize and group resources.

To get started, open any resource in the Preview Portal, click the tag icon in Essentials to add or remove tags for that resource, and click the tag to view all resources and resource groups with the same tag. You can pin the tag blade to the Startboard to access it quickly and easily, or use the Browse Hub to navigate to any tags across all your subscriptions. You can also manage tags by using the ARM Tags REST API reference located at [http://aka.ms/portalfx/ARMreference](http://aka.ms/portalfx/ARMreference). The following image demonstrates how easy to categorize and organize resources by using tags.

![alt-text](../media/portalfx-tags/tags.png "Tags make it easy to categorize and organize resources")

For more information about resource groups, see [http://aka.ms/portalfx/resourcegroups](http://aka.ms/portalfx/resourcegroups).

For more information about managing tags using Azure PowerShell, see [http://aka.ms/portalfx/managingtags](http://aka.ms/portalfx/managingtags).

For more information about tags, see [http://aka.ms/portalfx/usetags](http://aka.ms/portalfx/usetags).

**NOTE:** The Tags blade uses an HTTP PATCH operation to save tags to your resource provider (RP) using the last API version defined in your RP manifest for that resource type. To use an explicit API version, include it in the resource id you specify in the part/blade (e.g. /subscriptions/###/resourceGroups/xxx/providers/Microsoft.Cache/redis/xxx?api-version=2015-01-01).
