* [Getting started with the Portal SDK](#getting-started-with-the-portal-sdk)
    * [Marketplace Gallery Integration and Create Experience](#getting-started-with-the-portal-sdk-marketplace-gallery-integration-and-create-experience)
    * [Browse](#getting-started-with-the-portal-sdk-browse)
    * [Resource Menu Blade](#getting-started-with-the-portal-sdk-resource-menu-blade)
    * [V1 versus V2 in the samples extension](#getting-started-with-the-portal-sdk-v1-versus-v2-in-the-samples-extension)
    * [Hello World for blades](#getting-started-with-the-portal-sdk-hello-world-for-blades)
    * [Next Steps](#getting-started-with-the-portal-sdk-next-steps)
    * [Questions?](#getting-started-with-the-portal-sdk-questions)


<a name="getting-started-with-the-portal-sdk"></a>
## Getting started with the Portal SDK

The information you requested has moved to [top-extensions-install-software.md](top-extensions-install-software.md).

<a name="getting-started-with-the-portal-sdk-marketplace-gallery-integration-and-create-experience"></a>
### Marketplace Gallery Integration and Create Experience

If you plan on selling things (like resources) in the portal then you probably want to integrate into the marketplace.  The marketplace offers users a consistent way to browse and search the set of curated items that they can purchase (or create).

You integrate into the marketplace by building and publishing a package to the marketplace service.  This section will walk you through the basics of the marketplace.

In your running portal, go to the marketplace by clicking __+New__ and then __See all__.

![Launch Marketplace](../media/portalfx-overview/marketplace-launch.png)

Then click the __Local Development__ category. A marketplace item will appear that matches the name you selected when creating your project.  The code to define the gallery package is located in the __GalleryPackages__ directory.

![Local Development](../media/portalfx-overview/marketplace-local-development.png)

Click the gallery item to launch the item details blade. 

![gallery item details](../media/portalfx-overview/gallery-item-details.png)

The gallery package includes all the categorization, text, and images that you've seen so far.  The code for all of this is located in the __GalleryPackages__ folder.

When you click the __Create__ button the portal will open the blade that is defined in __GalleryPackages/Create/UIDefinition.json__. 

![Reference to create blade](../media/portalfx-overview/ui-definition-create-blade.png)

The project template has implemented a basic create form that asks the user to specify the common Azure Resource properties.

![Create blade screenshot](../media/portalfx-overview/create-blade-screenshot.png)

The code that implements the create blade is located in __Client/Resource/Create__.  Note that the name "CreateBlade" in the __Create.pdl__ file matches the name in the __UIDefinition.json__ file.

![Create blade code](../media/portalfx-overview/create-blade.png)

Fill out the create form and click create to actually create a resource.

For more information on creating gallery packages and create forms see the [gallery documentation](/gallery-sdk/generated/index-gallery.md#Marketplace-Gallery-Integration-and-Create-Experience).

<a name="getting-started-with-the-portal-sdk-browse"></a>
### Browse

The portal exposes a common navigation experience, called 'Browse', that gives end users a list of all the different services and resource types offered by the portal.

You probably want your assets to be exposed in the navigation system. This section provides an overview.

In the running portal you can navigate to __Browse -> My Resources__ to see your extension's browse experience.  
  
![Browse My Resources](../media/portalfx-overview/browse-my-resources.png)

If you have completed the marketplace and create tutorial above then you should see an item in the list.

![Browse My Resources List](../media/portalfx-overview/browse-my-resources-list.png)

The code for the browse implementation is located in __Client/Browse__.  You can replace the __Microsoft.PortalSdk/rootResources__ resource type name with your production Resource Provider (RP) type and your resources will show in the list on your next F5.

![Browse Code](../media/portalfx-overview/browse-code.png)

For more information on the browse experience see the [Browse documentation](#getting-started-with-the-portal-sdk-browse).

<a name="getting-started-with-the-portal-sdk-resource-menu-blade"></a>
### Resource Menu Blade

The information you requested has moved to [top-blades-resourcemenu.md](top-blades-resourcemenu.md).

<a name="getting-started-with-the-portal-sdk-hello-world-for-blades"></a>
### Hello World for blades

Blades are the main unit of UX that can be built using the SDK. They are basically pages that can be loaded in the portal.

To create a blade add a single file to your project in `$ProjectRoot\Client\<Area>\<Blade>.ts` where `<Area>` is a logically named area of your choosing and `<Blade>` is the name of your blade. An area is basically a folder.  Name it however it makes sense for your team.

If you are defining a new area then you must add a file directly in the area folder called `<Area>Area.ts` where `<Area>` is your area name.  The contents of that file should be:

```
export class DataContext {
}
```

Your blade file has a few required parts.  At the top you will have some import statements.

```
import * as TemplateBlade from "Fx/Composition/TemplateBlade";
import { DataContext } from "./<Area>Area"; // todo - put your area name here
```

The next step is to add the template blade decorator.  This lets the framework discover your blade.  It is also where you define the html template.

This template shows a simple text data-binding (corresponding data-binding code is below).

```
@TemplateBlade.Decorator({
    htmlTemplate: `<div data-bind='text: helloWorldMessage'></div>`
})
export class <Name> // todo - put your blade name here
{
}
```

Next we'll implement the class. In this simple case we'll just set the title, subtitle, and bind the string 'Hello world!' to the UI.

```
export class <Name> // todo - put your blade name here
{
    public title = "My blade title";
    public subtitle = "My blade subtitle";
    public context: TemplateBlade.Context<void, DataContext>; // there are useful framework APIs that hang off of here
    public helloWorldMessage = ko.observable("Hello world!"); // this is bound to the template above

    public onInitialize()
    {
       // run any initialization code you need here
       return Q();   // if you load data then return a loading promise here
    }
}
```

That's it. After you compile your blade you can test it out by deep linking using this format:

`<PORTAL URI>#blade/<YOUR EXTENSION NAME>/<YOUR BLADE NAME>`

<a name="getting-started-with-the-portal-sdk-next-steps"></a>
### Next Steps

Read more about [testing in production](portalfx-testinprod.md).

Next Steps: To debug issues loading an extension in the portal, go through the [Debugging extension failures](portalfx-debugging-extension-load-failures.md) guide.

<a name="getting-started-with-the-portal-sdk-questions"></a>
### Questions?

Ask questions on: [https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza](https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza).
