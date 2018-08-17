
## Azure Resources

The Azure framework has several features that make it easier to implement user experiences (UX) that are consistent across all resource types.  Most of these features are included in your subscription, as specified in the Asset model located at [portalfx-assets.md](portalfx-assets.md). The majority of the topics that are located in [http://aka.ms/portaldocs](http://aka.ms/portaldocs) specify how to build these types of extensions.

* [Browse](top-extensions-browse.md) 

    Integrates your resource type into the Portal's main resource menu.

* [Resource Menu](top-blades-resourcemenu.md) 

    Provides a base implementation of a menu blade that automatically injects standard resource features like RBAC, locks, or audit logs,into the menu.

* Search

    Azure resources are automatically integrated into the Portal global search. Global search is implemented by querying ARM APIs.

* [Tile Gallery Integration](portalfx-ux-tile-gallery.md) 

    Displays your resource tiles in the Portal  tile gallery.

The following Portal capabilities require the use of ARM resources.

* Server side notifications

 These are provided by the Azure event service, which only supports Azure resources.

* Shared dashboards

 Requires an Azure subscription.

* No-code browse 

    No-code browse leverages ARM to reduce the amount of code.  You can still implement the browse experience, as specified in [top-extensions-browse.md#building-browse-experiences](top-extensions-browse.md#building-browse-experiences), but it requires writing more code.

  The next few sections describe non-Azure-resource-based extensions, which are less common than extensions that manage resources using the Azure Resource Manager.
  
## Non-Azure Resources

This document describes a general strategy for designing extensions that do not act as a front end for a standard Azure Resource Provider. It also describes which capabilities are not available to these types of extensions.

**NOTE**:   Given the complexity associated with the `<Blade>` model, extension authors are encouraged to develop Non-Azure resource extensions by using template blades as specified in [top-blades-template.md](top-blades-template.md).  If you are using the legacy `<Blade>` model, then more information is available in [top-blades-legacy.md](top-blades-legacy.md).
Non-Azure resource based extensions cannot use the following framework features:

* Marketplace integration

    You do not need to have an Azure resource provider to integrate an extension with the Marketplace and the Portal's create flows.

    For more information, see [top-extensions-create.md](top-extensions-create.md).

* Browse 

    The Browse experience, as specified in [top-extensions-browse.md](top-extensions-browse.md), can serve as a user's main entry point to your non-resource extension or service.     If your service exposes a single top-level list of entities, like Accounts or Workspaces, then use the asset model as specified in [top-extensions-browse.md#defining-an-asset-type-permalink-asset-type-non-arm](top-extensions-browse.md#defining-an-asset-type-permalink-asset-type-non-arm) to define browsable assets even though they might not be Azure resources.   If your service exposes  many top level capabilities, use the custom browse option as specified in [top-extensions-browse.md#building-browse-experiences](top-extensions-browse.md#building-browse-experiences).

    **NOTE**:  It is  highly recommended that you use a menu blade as specified in [top-blades-menu.md](top-blades-menu.md) to expose your service's capabilities. For a sample demonstration of this pattern in production, see the Azure Security Center that is located at [https://portal.azure.com/#blade/Microsoft_Azure_Security/SecurityMenuBlade](https://portal.azure.com/#blade/Microsoft_Azure_Security/SecurityMenuBlade).
    
    <!-- Determine whether the menu blade is highly recommended for both scenarios. -->
    
* Menu blades

    Menu blades, as specified in [top-blades-menu.md](top-blades-menu.md), can be used to build blades that display a menu on the left and content on the right.  The look and feel of these blades is exactly like the Azure resource menu blades, except that there is no automatic injection of items. 

* Dashboard integration

    You can contribute tiles to the dashboard by using the tile gallery, as specified in [portalfx-ux-tile-gallery.md](portalfx-ux-tile-gallery.md), even if your service is not Azure based. These non-Azure tiles are displayed in the 'General' pivot, as opposed to other pivots that support only Azure resources. The dashboard-sharing feature requires an Azure subscription.  Users without subscriptions can have multiple, private dashboards.
