# Browse

The Favorites in the left nav and the 'All services' menu are the primary ways to launch tools and services within the portal. The default favorites are determined by C+E leadership based on the highest grossing services with the most engaged customers. New services will start in the 'All services' menu and, based on those metrics or the number of favorites surpasses other defaults, the list can be updated.

## Building browse experiences

There are 2 ways you can be surfaced in Browse:

1. [Browse](#building-browse-experiences-browse-for-arm-resources) for ARM resources
1. [Custom blade](#building-browse-experiences-custom-blade) if you have a single instance and not a list of resources

### Browse for ARM resources

ARM Browse automatically queries ARM for resources of a specific type and displays them in a paged grid.

Simply;

1. Define an asset type in PDL
1. Specify the resource type
1. Indicate that it should be visible in Browse
1. Specify the API version that hubs extension should use to call ARM for the resource type.

That's it, you can see an example of that below

```xml
<AssetType Name="Book" ... >
  <Browse Type="ResourceType" />
  <ResourceType ResourceTypeName="Microsoft.Press/books" ApiVersion="2016-01-01" />
</AssetType>
```

![No-code Browse grid](../media/portalfx-browse/nocode.png)

ARM Browse requires the following:

* Asset blade must accept a single `Id` input property
* Asset id must be the resource id (not an object)

#### Handling ARM kinds

If the resource you wish to expose does not have kinds then please skip to the next topic.

ARM has the capability for a resource to define kinds, in some cases you may want to
treat those kinds separately in the portal.

To define a kind for your asset, you need to declare the kind as a child of the `Asset` within PDL.
Firstly you will need to specify a default kind, this kind inherits the blade/part defined in the Asset.
The default kind is identified with `IsDefault="true"`.

If your resource exposes multiple kinds you can declare them as siblings of the default kind.

Exposing your kind within the 'All services' menu will require your kind/asset to be curated within the Portal Framework. The framework also offers ways for grouping kinds together when browsing to those kinds.
There are two options you can use group your kinds:

1. KindGroup
    * This will define a separate `KindGroup` within your extensions definition which can be used as a way to define a single view for mulitple kinds while also keeping the individual kind view.
1. MergedKind
    * Similar to `KindGroup` `MergedKind`s will group various kinds together and present them in a single view, except `MergedKind` forces any instance of the individual kinds to be viewed as the merged view.

```xml
<!--
    This asset type represents a watch instance.

    An asset type represents an asset object in the system independent of other objects in the system.
    It represents a singular class of objects distinctively but without connection to other objects.

    This asset type includes a resource type which represents a watch instance in the resource map.

    A resource type represents an asset specifically in a resource map where the connections between
    objects is important.  It represents a way to map resources in a resource map to the underlying
    assets in the system.

    It includes the resource map icons which are used in the resource map control.

    Watch is an "abstract" asset type, there is no such thing as a "watch", the default
    watch type is a "apple" watch.  Other specializations are based on function.
  -->
  <AssetType Name="Watch"
             ViewModel="{ViewModel Name=WatchViewModel, Module=./Watch/AssetType/Watch}"
             CompositeDisplayName="{Resource AssetTypeNames.Watch, Module=ClientResources}"
             Icon="{Svg IsLogo=true, File=../../Svg/Watches/generic.svg}"
             BladeName="AppleWatchBlade"
             PartName="AppleWatchTile"
             UseResourceMenu="true"
             MarketplaceItemId="Microsoft/watch">
    <Browse Type="ResourceType"
            UseCustomConfig="true"
            UseSupplementalData="true" />
    <ResourceType ResourceTypeName="Microsoft.Test/watches"
                  ApiVersion="2017-04-01">
      <Kind Name="apple"
            IsDefault="true"
            CompositeDisplayName="{Resource AssetTypeNames.Watch.Apple, Module=ClientResources}"
            Icon="{Svg IsLogo=true, File=../../Svg/Watches/apple.svg}" />
      <Kind Name="lg"
            CompositeDisplayName="{Resource AssetTypeNames.Watch.LG, Module=ClientResources}"
            Icon="{Svg IsLogo=true, File=../../Svg/Watches/lg.svg}"
            BladeName="LgWatchBlade"
            PartName="LgWatchTile" />
      <Kind Name="samsung"
            CompositeDisplayName="{Resource AssetTypeNames.Watch.Samsung, Module=ClientResources}"
            Icon="{Svg IsLogo=true, File=../../Svg/Watches/samsung.svg}"
            BladeName="SamsungWatchBlade"
            PartName="SamsungWatchTile" />
      <Kind Name="fitbit"
            CompositeDisplayName="{Resource AssetTypeNames.Watch.Fitbit, Module=ClientResources}"
            Icon="{Svg IsLogo=true, File=../../Svg/Watches/fitbit.svg}"
            BladeName="FitbitWatchBlade"
            PartName="FitbitWatchTile" />
      <!--
        The 'android' kind group wraps the lg and samsung kinds into a single kind. The 'android' kind is an abstract
        kind. There should never be a watch with the kind set to 'android'. Instead it's used to group kinds into
        a single list. However, 'lg' watches and be seen separately, same with 'samsung' watches. The 'android' kind
        will be emitted to the manifest as a kind.
      -->
      <KindGroup Name="android"
            CompositeDisplayName="{Resource AssetTypeNames.Watch.Android, Module=ClientResources}"
            Icon="{Svg IsLogo=true, File=../../Svg/Watches/android.svg}">
        <KindReference KindName="lg" />
        <KindReference KindName="samsung" />
      </KindGroup>
      <!--
        The 'garmin-merged' kind has two merged kinds, 'garmin' and 'garmin2'. The 'garmin-merged' kind is not a real
        kind and is not emitted to the manifest as a kind, it is organizational only.
      -->
      <MergedKind Name="garmin-merged">
        <Kind Name="garmin"
              CompositeDisplayName="{Resource AssetTypeNames.Watch.Garmin, Module=ClientResources}"
              Icon="{Svg IsLogo=true, File=../../Svg/Watches/garmin.svg}"
              BladeName="GarminWatchBlade"
              PartName="GarminWatchTile" />
        <Kind Name="garmin2"
              CompositeDisplayName="{Resource AssetTypeNames.Watch.Garmin2, Module=ClientResources}"
              Icon="{Svg IsLogo=true, File=../../Svg/Watches/garmin2.svg}"
              BladeName="Garmin2WatchBlade"
              PartName="Garmin2WatchTile" />
      </MergedKind>
    </ResourceType>
  </AssetType>
```

#### Add command

To allow people to create new resources from Browse, you can associate your asset type with a Marketplace item or category:

```xml
<AssetType
    Name="Book"
    MarketplaceItemId="Microsoft.Book"
    MarketplaceMenuItemId="menu/submenu"
    ...>
  <Browse Type="ResourceType" />
  <ResourceType ResourceTypeName="Microsoft.Press/books" ApiVersion="2016-01-01" />
</AssetType>
```

The Browse blade will launch the Marketplace item, if specified; otherwise, it will launch the Marketplace category blade for the specific menu item id (e.g. `gallery/virtualMachines/recommended` for Virtual machines > Recommended). To determine the right Marketplace category, contact the <a href="mailto:1store?subject=Marketplace menu item id">Marketplace team</a>. If neither is specified, the Add command won't be available.

#### Customizing columns

By default, ARM Browse only shows the resource name, group, location, and subscription. To customize the columns, add a view-model to the `AssetType` and indicate that you have custom Browse config:

```xml
<AssetType Name="Book" ViewModel="BookViewModel" ... >
  <Browse Type="ResourceType" UseCustomConfig="true" />
  <ResourceType ResourceTypeName="Microsoft.Press/books" ApiVersion="2016-01-01" />
</AssetType>
```

Now, create the asset view-model class that implements the `getBrowseConfig()` function:

```ts
class BookViewModel implements ExtensionDefinition.ViewModels.ResourceTypes.BookViewModel.Contract {

    public getBrowseConfig(): PromiseV<MsPortalFx.Assets.BrowseConfig> {
        ...
    }
}
```

The `getBrowseConfig()` function provides the following configuration options for your Browse blade:

* **`columns`** - List of custom columns the user will be able to choose to display
* **`defaultColumns`** - List of column ids that will be used by default
* **`properties`** - Additional properties used by formatted columns (e.g. HTML formatting)

Start by specifying all possible custom columns you want to make available to customers using `BrowseConfig.columns`. Browse will share the list of standard ARM columns and any custom columns you define with users and let them choose which columns they want to see.

To specify which columns to show by default, save the column ids to `BrowseConfig.defaultColumns`. If any columns require additional data, like HTML-formatted columns that include 2 or more properties, save the additional property names (not the `itemKey`) to `BrowseConfig.properties`. Browse needs to initialize the grid with all the properties you'll use for supplemental data to ensure the grid will be updated properly.

```ts
class BookViewModel implements ExtensionDefinition.ViewModels.ResourceTypes.BookViewModel.Contract {

    public getBrowseConfig(): PromiseV<MsPortalFx.Assets.BrowseConfig> {
        return Q.resolve({
            // columns the user will be able to choose to display
            columns: [
                {
                    id: "author",
                    name: ko.observable<string>(ClientResources.author),
                    itemKey: "author"
                },
                {
                    id: "genre",
                    name: ko.observable<string>(ClientResources.genre),
                    itemKey: "genre",
                    format: MsPortalFx.ViewModels.Controls.Lists.Grid.Format.HtmlBindings,
                    formatOptions: {
                        htmlBindingsTemplate: "<div data-bind='text: genre'></div> (<div data-bind='text: subgenre'></div>)"
                    }
                }
            ],

            // default columns to show -- name is always first
            defaultColumns: [
                ResourceColumns.resourceGroup,
                "author",
                "genre"
            ],

            // additional properties used to support the available columns
            properties: [
                "subgenre"
            ]
        });
    }
}
```

Notice that the genre column actually renders 2 properties: genre and subgenre. Because of this, we need to add "subgenre" to the array of additional properties to ensure it gets rendered properly to the grid.

At this point, you should be able to compile and see your columns show up in your Browse blade. Of course, you still need to populate your supplemental data. Let's do that now...

#### Providing supplemental data

In order to specify supplemental data to display on top of the standard resource columns, you'll need to opt in to specifying supplemental data in PDL:

```xml
<AssetType Name="Book" ViewModel="BookViewModel" ... >
  <Browse Type="ResourceType" UseSupplementalData="true" />
  <ResourceType ResourceTypeName="Microsoft.Press/books" ApiVersion="2016-01-01" />
</AssetType>
```

You'll also need to implement the `supplementalDataStream` property and `getSupplementalData()` function on your asset view-model:

```ts
class BookViewModel implements ExtensionDefinition.ViewModels.ResourceTypes.BookViewModel.Contract {

    public supplementalDataStream = ko.observableArray<MsPortalFx.Assets.SupplementalData>([]);

    public getBrowseConfig(): PromiseV<MsPortalFx.Assets.BrowseConfig> {
        ...
    }

    public getSupplementalData(resourceIds: string[], columns: string[]): Promise {
        ...
    }
}
```

After the Browse blade retrieves the first page of resources from ARM, it will call `getSupplementalData()` with the batch of resource ids retrieved from ARM as well as the column ids currently being displayed in the grid. You'll then retrieve *only* the properties required to populate those columns for *only* the specified resource ids. **Do not query all properties for all resources!**

```ts
class BookViewModel implements ExtensionDefinition.ViewModels.ResourceTypes.BookViewModel.Contract {

    private _container: MsPortalFx.ViewModels.ContainerContract;
    private _dataContext: any;
    private _view: any;

    constructor(container: MsPortalFx.ViewModels.ContainerContract, initialState: any, dataContext: ResourceTypesArea.DataContext) {
        this._container = container;
        this._dataContext = dataContext;
    }

    ...

    public getSupplementalData(resourceIds: string[], columns: string[]): Promise {
        // NOTE: Do not create the view in the constructor. Initialize here to create only when needed.
        this._view = this._view || this._dataContext.bookQuery.createView(this._container);

        // connect the view to the supplemental data stream
        MsPortalFx.Assets.SupplementalDataStreamHelper.ConnectView(
            this._container,
            view,
            this.supplementalDataStream,
            (book: Book) => {
                return resourceIds.some((resourceId) => {
                    return ResourceTypesService.compareResourceId(resourceId, book.id());
                });
            },
            (book: Book) => {
                // save the resource id so Browse knows which row to update
                var data = <MsPortalFx.Assets.SupplementalData>{ resourceId: book.id() };

                // only save author if column is visible
                if (columns.indexOf("author") !== -1) {
                    data.author = robot.author();
                }

                // if the genre column is visible, also add the subgenre property
                if (columns.indexOf("genre") !== -1) {
                    data.genre = robot.genre;
                    data.subgenre = robot.subgenre;
                }

                return data;
            });

        // send resource ids to a controller and aggregate data into one client request
        return view.fetch({ resourceIds: resourceIds });
    }
}
```

**NOTE:** If you notice that some of the supplemental properties aren't being saved to the grid, double-check that the property names are either listed as the `itemKey` for a column or have been specified in `BrowseConfig.properties`. Unknown properties won't be saved to the grid.

**NOTE:** **Do not pre-initialize data.** Browse will show a loading indicator based on whether or not it's received data. If you initialize any supplemental data, this will inform the grid that loading has completed. Instead, leave cells empty when first displaying them.

Now, you should have supplemental data getting populated. Great! Let's add context menu commands...

### Adding context menu commands

Context menu commands in Browse must take a single `id` input parameter that is the resource id of the specific resource. To specify commands, add the name of the command group defined in PDL to Browse config:

```xml
<CommandGroup Name="BrowseBookCommands">
  ...
</CommandGroup>
```

```ts
class BookViewModel implements ExtensionDefinition.ViewModels.ResourceTypes.BookViewModel.Contract {

    public getBrowseConfig(): PromiseV<MsPortalFx.Assets.BrowseConfig> {
        return Q.resolve({
            // NOTE: Extension (commandGroupOwner) only required if from another extension
            contextMenu: {
                commandGroup: "BrowseBookCommands",
                commandGroupOwner: "<extension name>"
            },
            ...
        });
    }

    ...
}
```

If you need to expose different commands based on some other metadata, you can also specify the the command group in `SupplementalData.contextMenu` in the same way.

#### Adding an informational message/link

If you need to display an informational message and/or link above the list of resources, add an `infoBox` to your Browse config:

```ts
class BookViewModel implements ExtensionDefinition.ViewModels.ResourceTypes.BookViewModel.Contract {

    public getBrowseConfig(): PromiseV<MsPortalFx.Assets.BrowseConfig> {
        return Q.resolve({
            infoBox: {
                image: MsPortalFx.Base.Images.Info(),
                text: resx.browseBookInfoBoxText,

                // optionally specify a blade to launch when the infobox is clicked
                blade: <MsPortalFx.ViewModels.DynamicBladeSelection>{
                    detailBlade: "BookInfoBlade",
                    detailBladeInputs: null
                },

                // ...or link to an external web page
                uri: "http://microsoftpress.com"

                // NOTE: Blade is preferred over link, if both are specified.
            },
            ...
        });
    }

    ...
}
```

### Custom blade

If you don't have a list of resources and simply need to add a custom blade to Browse, you can define an asset type with a `Browse` type of `AssetTypeBlade`. This tells Browse to launch the blade associated with the asset type. Note that the asset type doesn't actually refer to an instance of a resource in this case. This is most common for services that are only provisioned once per directory or horizontal services (Cost Management, Monitoring, Azure Advisor etc...). In this case, the `PluralDisplayName` is used in the 'All services' menu, but the other display names are ignored. Feel free to set them to the same value.

```xml
<AssetType
    Name="CompanyLibrary"
    BladeName="CompanyLibraryBlade"
    PluralDisplayName="..."
    ... >
  <Browse Type="AssetTypeBlade" />
</AssetType>
```

## Curating browse assets

When adding a new 'Asset' to your extension and exposing it through the 'All services' menu, by default it will be grouped in the 'Other' category.
In order to get your 'Asset' correctly categorized you will need to make a request to the Portal Framework to curate your 'Asset'.

For the portal to correct curate your 'Asset' we will need the 'ExtensionName' and 'AssetName' as defined in your extension.

Please contact [ibizafxpm@microsoft.com](mailto:ibizafxpm@microsoft.com) with the following template:

* Subject: 'Browse curation requestion - YourAssetName'
* Body:
  * 'ExtensioName - YourExtensionName'
  * 'AssetName - YourAssetName'
  * 'KindName - YourKindName' (If applicable)
  * 'Category - DesiredCategory'
  * 'Portal environment - portal.azure.com (etc...)'