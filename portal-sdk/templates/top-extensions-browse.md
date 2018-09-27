
## Building browse experiences

The primary ways to launch tools and services within the portal are the Favorites in the left navigation panel and the Browse menu. New services start in the Browse menu, but the default favorites are determined by C+E leadership. The list can be updated based on those metrics or the number of favorites surpasses other defaults.
 
There are 3 ways that an extension can be surfaced in Browse.

* No-code Browse for ARM resources

    "No-code" Browse automatically queries ARM for resources of a specific type and displays them in a paged grid. No-code Browse requires that an asset blade accepts a single `Id` input property, and that the asset id is the resource id instead of an object. The developer should define an asset type in PDL, specify the resource type, and specify the API version that the Hubs extension will use to call ARM for the resource type, as in the following example.

    ```xml
    <AssetType Name="Book" ... >
    <Browse Type="ResourceType" />
    <ResourceType ResourceTypeName="Microsoft.Press/books" ApiVersion="2016-01-01" />
    </AssetType>
    ```

    Then, the extension specifies  that the resource should be visible in the Browse hub, as in the following image.

    ![alt-text](../media/portalfx-browse/nocode.png "No-code Browse grid")

* Browse service for assets 

    The Browse service API provides support for assets and other custom data, whether that is located at ARM or another source.

    **NOTE:** The Browse service API has been replaced with the Browse v2 API, which starts with no-code.

    The UI for browse are implemented as part of the Shell. This means that extensions will accept a request for a browse, reason about the browse criteria, and return a list of results. Extensions opt into this functionality by creating an asset type and defining a browse service.
    
* Custom blades

    If the extension will not have a list of resources and only needs only a single custom blade for Browse, the developer can define an asset type with a `Browse` type of `AssetTypeBlade`. This tells Browse to launch the blade that is associated with the asset type. The asset type does not refer to an instance of a resource in this case. This is most common for services that are only provisioned once per directory. In this case, the `PluralDisplayName` is used in the Browse menu, but the other display names are ignored. It is reasonable to set them to the same value.

    ```xml
    <AssetType
        Name="CompanyLibrary"
        BladeName="CompanyLibraryBlade"
        PluralDisplayName="..."
        ... >
    <Browse Type="AssetTypeBlade" />
    </AssetType>
    ```


For more information about upgrading to the most recent Browse API, see  [portalfx-browse-upgrade.md](portalfx-browse-upgrade.md).

For more information about using assets in the Browse features, see  [portalfx-assets.md](portalfx-assets.md).

For more information about testing the browse feature in an extension, see [msportalfx-test-scenarios-browse.md](msportalfx-test-scenarios-browse.md). 

### The Add command

To allow developers to create new resources from Browse, the asset type can be associated with a Marketplace item or category, as in the following example.

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

The Browse blade launches the Marketplace item, if specified; otherwise, it launches the Marketplace category blade for the specific menu item id. For example, `gallery/virtualMachines/recommended` is the id for the menu item that can be reached by `Virtual machines > Recommended`. To determine the right Marketplace category, reach out to the <a href="mailto:1store?subject=Marketplace%20menu%20item%20id">Marketplace team</a>. If neither the Marketplace item nor the Marketplace category blade is specified, the Add command will not be available.

### Customize columns

By default, no-code Browse only shows the resource name, group, location, and subscription. 

1. To customize the columns, add a `ViewModel` to the `AssetType` to specify that the extension has a custom Browse configuration.

    ```xml
    <AssetType Name="Book" ViewModel="BookViewModel" ... >
    <Browse Type="ResourceType" UseCustomConfig="true" />
    <ResourceType ResourceTypeName="Microsoft.Press/books" ApiVersion="2016-01-01" />
    </AssetType>
    ```

1. Now, create the asset `ViewModel` class that implements the `getBrowseConfig()` function, as in the following code.

    ```ts
    class BookViewModel implements ExtensionDefinition.ViewModels.ResourceTypes.BookViewModel.Contract {

        public getBrowseConfig(): PromiseV<MsPortalFx.Assets.BrowseConfig> {
            ...
        }
    }
    ```

    The `getBrowseConfig()` function provides the following configuration options for the Browse blade.

    <!--TODO: Determine whether this has been impletemented yet.  -->

    **columns**: A list of custom columns that can be selected for display 

    **defaultColumns**: The default list of column ids.

    **properties**: Additional properties that are used by formatted columns, like  HTML formatting.

1. Specify all of the custom columns that can be made available to customers using `BrowseConfig.columns`. The Browse feature shares the list of standard ARM columns, in addition to these columns, with users and allows them to choose which columns they want to see.

    To specify which columns to show by default, save the column ids to `BrowseConfig.defaultColumns`. If columns require additional data, like HTML-formatted columns that include two or more properties, save the additional property names to `BrowseConfig.properties`.  Do not save the `itemKey`. The Browse feature will initialize the grid with  the properties for supplemental data to ensure the grid will be updated properly, as in the following example.
    
    <!-- TODO: Determine whether this should be a sample, and if not, what playground-style feature should replace it.  -->

    ```ts
    class BookViewModel implements ExtensionDefinition.ViewModels.ResourceTypes.BookViewModel.Contract {

        public getBrowseConfig(): PromiseV<MsPortalFx.Assets.BrowseConfig> {
            return Q.resolve({
                // columns the user will be able to choose to display (coming soon)
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

                // default columns to show -- name always first, subscription always last
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

    **NOTE**: In this example, the genre column renders two properties: genre and subgenre. Consequently, "subgenre" is added to the array of additional properties to ensure it gets rendered properly in the grid.

1. Compile and run the extension. The columns should be displayed in the Browse blade. 

### Provide supplemental data

Occasionally, extensions need to display data that is in addition to the standard resource columns. 
Streaming the data significantly improves performance.  The extension should opt in to streaming and supplemental data by specifying it in the PDL file, as in the following example.

    ```xml
    <AssetType Name="Book" ViewModel="BookViewModel" ... >
    <Browse Type="ResourceType" UseSupplementalData="true" />
    <ResourceType ResourceTypeName="Microsoft.Press/books" ApiVersion="2016-01-01" />
    </AssetType>
    ```

The extension should also implement the `supplementalDataStream` property and `getSupplementalData()` function on the asset `ViewModel`, as in the following example.

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

After the Browse blade retrieves the first page of resources from ARM, it calls the `getSupplementalData()` method with the resource ids that were retrieved from ARM, in addition to the column ids that are currently displayed in the grid. The extension should then retrieve only the properties required to populate columns for the specified resource ids. 

**NOTE**: **Do not query all properties for all resources!**

<!-- TODO: The subscriptions API is being deprecated once Browse v2 and Create v3 are complete. Determine whether the subscriptions API still exists, and if not, what the alternatives are. -->

**NOTE:** The subscriptions API is being deprecated. Extensions will no longer have a full list of all subscriptions, and therefore are required to use the streaming data approach that is in the following example.  

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

If some of the supplemental properties are not being saved to the grid, double-check that the property names are either listed as the `itemKey` for a column or have been specified in `BrowseConfig.properties`. Unknown properties cannot be saved to the grid.

<!-- TODO: Determine whether this is a contradiction, because earlier in the document it said not to save the `itemKey`. -->

The Browse feature displays a loading indicator,  based on whether or not it has received data.  Pre-initializing data will inform the grid that loading has completed. Instead, the extension should leave cells empty when they are initially  displayed.

### Add context menu commands

Context menu commands in the Browse feature take a single `id` input parameter that is the resource id of the specified command or command group. To specify commands, add the name of the command group that was defined in the PDL file to the Browse configuration, as in the following example.

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

If different commands should be exposed based on other metadata, the command group can be specified in `SupplementalData.contextMenu` in the same way.

### Adding an informational message link

If the extension should display an informational message or link above the list of resources, add an `infoBox` to the Browse configuration, as in the following example.

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

### Defining an Asset Type permalink-asset-type-non-arm

Asset types provide a way for the Shell to understand high level objects in the extension. They are the Portal's way of understanding the capabilities of a given object.  Currently, it defines services for Browse, Create, and Notfications.

The Asset Type is defined in the PDL file, and opts in to various services and capabilities that it supports. An example of browse can be found in the samples under `<dir>\Client\V1\Hubs\Browse\Browse.pdl`.

```xml
<AssetType Name="Robot"
           Text="Extension.Resources.Strings.robotAssetName"
           Icon="Extension.Resouces.Icons.robotIcon"
           BladeName="RobotBlade"
           PartName="RobotPart">
    <Browse ServiceViewModel="RobotBrowseService" />
    <GridColumns ServiceViewModel="RobotGridColumnsService" />
</AssetType>
```

The elements in the xml are as follows.

**Name**: Identifier used for the asset type.

**Text**: JavaScript literal that stores the human-readable name for the asset, as specified in `<dir>\Client\Shared\SharedArea.ts`.

**IconUri**: JavaScript literal that stores the URI to the icon for the given asset.

**BladeName**: A reference to the blade that is opened when this asset is selected in a list.

**PartName**: A reference to the part that will represent the asset on the startboard.

**Browse ServiceViewModel**:  A class that provides browse services.

**GridColumn ServiceViewModel**: A class that provides grid columns services when displaying assets in browse or in resource lists.

An example of each of these classes is located at `<dir>\Client\V1\Hubs\Browse\`. 

### Implementing a Grid Column provider

Working with the grid in the API is the same as defining any other grid schema. To allow the Shell to render the UI for the assets, it needs to be aware of the objects that will be returned. Specifically, the Shell requires a list of columns, and the properties on the asset objects that map to those columns.

<!--TODO: Determine whether it makes more sense to use the sammple in the samples extension than the  literal. -->
A reference implementation is located at `<dir>\Client\V1\Hubs\Browse\Services\RobotGridColumnsService.ts`, and in the following code.

  {"gitdown": "include-file", "file": "../Samples/SamplesExtension/Extension/Client/V1/Hubs/Browse/Services/RobotGridColumnsService.ts"}

```ts
module SamplesExtension.Hubs {
    /**
     * Represents the grid columns service used by the robot asset type.
     */
    export class RobotGridColumnsService implements MsPortalFx.Services.GridColumns {
        /**
         * See interface.
         */
        public includeAssetIcon: boolean;

        /**
         * See interface.
         */
        public columns: MsPortalFx.ViewModels.Controls.Lists.Grid.Column[];

        /**
         * Initialize a new instance of the robot grid columns service.
         *
         * @param initialValue Initial state for the service.
         * @param context Data context for the service.
         */
        constructor(initialValue: any, dataContext: DataContext) {
            var usage = <MsPortalFx.Services.GridColumnsUsage>initialValue;

            // We ignore the usage for this asset type (always show same columns).

            // Return that the system should include the asset icon column along with the other columns for the
            // collection grid.
            this.includeAssetIcon = true;
            this.columns = [
                {
                    id: "name",
                    name: ko.observable<string>(SamplesExtension.Resources.Strings.robotNameColumn),
                    itemKey: "name"
                },
                {
                    id: "status",
                    name: ko.observable<string>(SamplesExtension.Resources.Strings.robotStatusColumn),
                    itemKey: "status"
                },
                {
                    id: "model",
                    name: ko.observable<string>(SamplesExtension.Resources.Strings.robotModelColumn),
                    itemKey: "model"
                },
                {
                    id: "manufacturer",
                    name: ko.observable<string>(SamplesExtension.Resources.Strings.robotManufacturerColumn),
                    itemKey: "manufacturer"
                },
                {
                    id: "os",
                    name: ko.observable<string>(SamplesExtension.Resources.Strings.robotOSColumn),
                    itemKey: "os"
                }
            ];
        }
    }
}
```

### Implementing a Browse provider

The Browse feature provides a simple way to navigate assets in the Portal. Implementing the Browse feature  is as easy as defining an asset type, adding a grid column service, and writing the browse service. 

The workflow for browse is as follows:

1. The user requests a list of assets.

1. The Shell creates a new browse service ViewModel.

1. The browse service returns an initially empty observable array that contains the results.

1. The browse service asks its server data source for an updated list of assets.

1. The list is kept up to date by using `MsPortalFx.Data.Loader` polling.

1. When the user closes the browse blade, the `canceled` property on the service is set to `true`.

1. The `ViewModel` is disposed.

A full reference implementation is located at `<dir>\Client\Hubs\Browse\Services\RobotBrowseService.ts`, and in the following code.

```ts
module SamplesExtension.Hubs {
    /**
     * Represents the browse service used by the robot asset type.
     */
    export class RobotBrowseService implements MsPortalFx.Services.BrowseOperation {
        /**
         * The result set which will contain the results of the browse as they come in.
         */
        public results: KnockoutObservableArray<any>;

        /**
         * This will be set to true to signal the browse operation that it should be canceled.
         */
        public canceled: KnockoutObservable<boolean>;

        /**
         * Initialize a new instance of the robot browse service.
         *
         * @param initialValue Initial state for the service.
         * @param context Data context for the service.
         */
        constructor(initialValue: any, context: DataContext) {
            var criteria = <MsPortalFx.Services.BrowseCriteria>initialValue,
                canceledSubscription: KnockoutSubscription<boolean>,
                dataSubscription: KnockoutSubscription<Robot[]>,
                dataSet = context.robotData.robotsDataSet,
                dataSetName = RobotData.robotsDataSetName;

            this.canceled = ko.observable<boolean>(false);
            this.results = ko.observableArray<any>();

            // Go to the data class and force a refresh of available robots from the server
            MsPortalFx.Data.Loader.forceRefresh(dataSetName).then(() => {
                // This is the mapper to watch a data set and publish mapped changes to the result set.
                dataSubscription = MsPortalFx.Services.DataSetAssetExpansionMapper.connectDataSet<Robot>(
                    dataSet.data, this.results, mapRobotToAssetDetails);
            });

            canceledSubscription = this.canceled.subscribe((canceled) => {
                // disconnect
                this.results = null;
                if (canceledSubscription !== null) {
                    canceledSubscription.dispose();
                    canceledSubscription = null;
                }
                if (dataSubscription !== null) {
                    dataSubscription.dispose();
                    dataSubscription = null;
                }
            });
        }
    }
}
```

{"gitdown": "include-file", "file": "../templates/portalfx-browse-migration.md"}

