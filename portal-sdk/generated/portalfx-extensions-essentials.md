
<a name="essentials-panel"></a>
## Essentials panel

The Essentials panel at the top of a resource blade presents key information about the resource.  It contains the most common information customers need for a resource, and provides a consistent UX for presenting platform capabilities, as in the following image.

![alt-text](../media/portalfx-essentials/essentials.png "Essentials panel")

The Essentials panel shows basic properties for the current resource. It also shows common platform capabilities like the ones in the following list.

* Resource group
* Settings
* Quickstart
* Users & Roles
* Tags
* Keys

Providing this information and access to core functionality greatly improves the consistency of the Portal and extensions that use it.

<a name="essentials-panel-adding-an-essentials-panel"></a>
### Adding an essentials panel

**NOTE**: In this discussion, `<dir>` is the `SamplesExtension\Extension\` directory, and  `<dirParent>`  is the `SamplesExtension\` directory, based on where the samples were installed when the developer set up the SDK. 

The Essentials panel is used only on resource blades, which are the initial blade launched from the Resource Browse experience.  Specify  the `<ResourceSummary>` in PDL for the blade, as in the following code and in the sample located at `<dir>\Client\ResourceTypes\Engine\Engine.pdl`.

```xml
<Blade Name="EngineBlade">
    <Blade.Parameters>
        <Parameter Name="id" Type="Key" />
    </Blade.Parameters>
    <ResourceSummary Name="EngineBladeResourceSummary"
                     ViewModel="EngineResourceSummaryViewModel"
                     ResourceIdSource="{BladeParameter Name=id}"
                     ItemCount="4" />
    ...
</Blade>
```

The properties of the Essentials panel are as follows.

**ViewModel**: Should inherit from `MsPortalFx.ViewModels.Parts.ResourceSummary.ViewModel2`.  This view model follows the typical part `ViewModel` pattern and enables setting up of the properties and common services. It  replaces the non-responsive, deprecated `MsPortalFx.ViewModels.Parts.ResourceSummary.ViewModel` class.  Do not use the old `ViewModel` class, as support for it will be removed from the framework in the future. A sample `ViewModel` is in the code located at `<dir>\Client\ResourceTypes\Engine\ViewModels\EngineResourceSummaryViewModel.ts`.

**ResourceIdSource**: The resource uri that the blade will use to interact with Azure Resource Manager. 

**ItemCount**: The maximum number of properties the panel can contain. If the value is too small, the Essentials panel may appear vertically clipped.

<a name="essentials-panel-builtin-properties"></a>
### Builtin properties

To make the Essentials panel display responsively, the Portal populates the properties in the left column.  It displays the rendered panel immediately after those properties are loaded, allowing the user to interact with the panel before it is completely rendered.  The remaining properties load incrementally, and display a "---" loading indicator while they load.

Extensions can interact with the left column to support responsiveness with the following properties.

* **'Resource group'**: With the `MsPortalFx.ViewModels.Parts.ResourceSummary.Options.noResourceGroup` option, extensions can opt-out of the 'Resource group' property.  This is useful for tenant-only services.

* **'Status' property**: The `MsPortalFx.ViewModels.Parts.ResourceSummary.Options2.status` option controls the 'Status' property.  Supplying a value of `null` will hide the 'Status' property. To show the 'Status' property, which is preferable, extensions supply both a `value` and an `isLoading` observable, the latter of which controls a loading indicator.  Typically, the `isLoading` observable comes from the `loading` property on the `EntityView` or `QueryView` used to load data for the Essentials panel, as in the following code.

    ```ts
    // Status property
    let statusValue = ko.computed(lifetime, () => {
        let status = engineView.item() && engineView.item().status();
        switch (status) {
            case EngineData.EngineStatus.Running:
                return ClientResources.engineStatusRunning;
            case EngineData.EngineStatus.OilLow:
                return ClientResources.engineStatusLowOil;
            case EngineData.EngineStatus.Seized:
                return ClientResources.engineStatusSeized;
        }
        return "unhandled status: {0}".format(status);
    });
    let engineView = this._engineView;
    let statusIsLoading = engineView.loading;  // A loading indicator is shown while the Engine data is loading.

    return <MsPortalFx.ViewModels.Parts.ResourceSummary.Options2>{
        getQuickStartSelection: getQuickStartSelection,
        getSettingsSelection: getAllSettingsSelection,
        getKeysSelection: getKeysSelection,
        collapsed: false,
        status: {
            value: statusValue,
            isLoading: statusIsLoading
        },
        staticProperties: properties
    };
    ```

<a name="essentials-panel-static-properties"></a>
### Static Properties

The extension populates properties in the right column of the Essentials panel. 

The most responsive user experience can be attained by using static properties. That is, the names, visibility and placement of these properties do not vary between instances of the resource. Static properties are displayed at the top of the right column.

For such static properties, the extension supplies these by using the `MsPortalFx.ViewModels.Parts.ResourceSummary.Options2.staticProperties` option.  Notice that such properties are constructed with an `isLoading` observable which controls the "---" loading indicator for the property.  Typically, this is the `loading` property of an `EntityView` or `QueryView` with which the extension loads its Essentials data, as in the following example.

```ts
let engineView = this._engineView;
let properties: MsPortalFx.ViewModels.Parts.Properties.Property[] = [];

// Open blade property
properties.push(new MsPortalFx.ViewModels.Parts.Properties.OpenBladeProperty({
    label: ClientResources.engineNamePropertyLabel,
    displayValue: ko.computed(lifetime, () => {
        return engineView.item() && engineView.item().name();
    }),
    bladeSelection: this._bladeSelection,
    isLoading: engineView.loading  // A loading indicator is shown while the Engine data is loading.
}));

// Text property
properties.push(new MsPortalFx.ViewModels.Parts.Properties.TextProperty({
    label: ClientResources.engineModelPropertyLabel,
    value: ko.computed(lifetime, () => {
        return engineView.item() && engineView.item().model();
    }),
    isLoading: engineView.loading  // A loading indicator is shown while the Engine data is loading.
}));

// Link property
properties.push(new MsPortalFx.ViewModels.Parts.Properties.LinkProperty({
    label: ClientResources.sponsorLinkPropertyLabel,
    value: ko.observable(ClientResources.microsoftUri),
    displayValue: ko.observable(ClientResources.microsoft),
    isLoading: ko.observable(false)  // The displayed value is a static string (not loaded asynchronously).
}));

return <MsPortalFx.ViewModels.Parts.ResourceSummary.Options2>{
    getQuickStartSelection: getQuickStartSelection,
    getSettingsSelection: getAllSettingsSelection,
    getKeysSelection: getKeysSelection,
    collapsed: false,
    status: ...,
    staticProperties: properties
};
```

<a name="essentials-panel-dynamic-properties"></a>
### Dynamic Properties

In some cases, the extension only knows to add additional properties once it has examined the loaded resource data. Once the data has loaded, the extension adds these properties dynamically to the Essentials panel. Dynamic properties are displayed at the bottom of the right column of the Essentials panel by adding them to the already-rendered Essentials panel.  

**Note**:  Static properties should be used wherever possible, because they are rendered with "---" loading indicators while their values load.

 Extensions can add dynamic properties to the Essentials panel by using the `MsPortalFx.ViewModels.Parts.ResourceSummary.ViewModel2.setDynamicProperties` method, as in the following code.

<!--TODO:  Validate how this works if onInputSet is being replaced. -->

```ts
public onInputsSet(inputs: Def.InputsContract, settings: Def.SettingsContract): MsPortalFx.Base.Promise {

    return super.onInputsSet(inputs, settings).then(() => {
        return this._engineView.fetch(inputs.resourceId).then(() => {

            // Show some dynamic, purely data-driven properties based on the loaded Engine.
            let engine = this._engineView.item();
            this._updateDynamicProperties(engine);
        });
    });
}

private _updateDynamicProperties(engine: SamplesExtension.DataModels.Engine): void {
    // Create properties based on some aspect of the loaded Engine.
    let useLinkProperty = engine.displacement().indexOf("600") >= 0;
    let dynamicProperty: MsPortalFx.ViewModels.Parts.Properties.Property;
    if (useLinkProperty) {
        dynamicProperty = new MsPortalFx.ViewModels.Parts.Properties.LinkProperty({
            label: ClientResources.engineDisplacementPropertyLabel,
            value: ko.observable(ClientResources.microsoftUri),
            displayValue: engine.displacement
        });
    } else {
        dynamicProperty = new MsPortalFx.ViewModels.Parts.Properties.TextProperty({
            label: ClientResources.engineDisplacementPropertyLabel,
            value: engine.displacement
        });
    }

    this.setDynamicProperties([ dynamicProperty ]);
}
```

<a name="essentials-panel-customizing-the-layout-of-properties"></a>
### Customizing the layout of properties

In certain advanced scenarios, the extension may need to customize the layout of properties beyond just defining the right column properties.  This is not recommended for most scenarios, as per-extension customization can easily violate the guidelines located at [#guidelines-for-essentials](#guidelines-for-essentials).  For those scenarios where it is necessary to customize more than the defaults, this can be done using the `MsPortalFx.ViewModels.Parts.ResourceSummary.Options2.layout` option.  Here, the extension can control which properties are shown, in addition to property ordering and placement in the left and right columns.  For more information, see the relevant doc comments in `MsPortalFx.d.ts`.

<a name="essentials-panel-customizing-the-layout-of-properties-guidelines-for-essentials"></a>
#### Guidelines for essentials

Essentials are a high-level snapshot of a resource. The Essentials pane contains the most important resource properties, along with links to other locations in the portal. The content in the Essentials pane is divided into two columns: the left column shows 5 properties similar to the Browse view, while the right column shows 5 properties specific to the resource. Extensions decide what properties to show in the right column, and whether they're static or dynamic.

![alt-text](../media/portalfx-ux-essentials/Essentials.PNG "essentials part image")

Properties **can** contain links, and can open blades containing related resources (for example, resource group, subscription, hosting plan, etc). The links can also point to external sites. Properties **can't** open blades that collect information.

Everything that appears in the Essentials pane should also be accessible in <strong>Settings</strong>.

<a name="essentials-panel-customizing-the-layout-of-properties-ordering-guidelines"></a>
#### Ordering guidelines

**Left column**

1. Resource group
1. Status
1. Location
1. Subscription name (as a link to a child blade)
1. Subscription ID

**Right column**

Up to 5 key domain-specific properties in the following order (<span style="color:#ff0000;font-size:large;">*</span><span style="color:#ff0000;"> = required</span>):</p>
 
* URL [link to site in a new tab] <span style="color:#ff0000;font-size:large;"><strong>*</strong></span>
* Web hosting plan [link to hosting plan blade] <span style="color:#ff0000;font-size:large;"><strong>*</strong></span>
 
Choose from the following options to complete the list:



- If no continuous deployment, no linked database, no IP SSL then add:

	- FTP/Deployment username [text]
	- FTP hostname [text]
	- FTPS hostname [text]

- If no continuous deployment but with 1+ linked database(s), then add:

	- Linked database [link to blade]
	- FTP/Deployment username [text]
	- FTP hostname [text]

- If no continuous deployment but with 1+ IP SSL binding(s), then add:

	- Virtual IP address
	- FTP/Deployment username [text]
	- FTP hostname [text]

- If using a local Git continuous deployment, then add:

	- 	Git/Deployment username [text]
	- 	Git clone URL [text]
	- 	FTP hostname [text]

- If using team project continuous deployment, then add:

	- Team project [link to team project blade]
	- FTP/Deployment username [text]
	- FTP hostname

- If using 3rd party continuous deployment, then add:

	- Git clone URL (or Hg equivalent) [text]
	- Git/Deployment username [text]
	- Project URL (or the folder if using Dropbox) [link to project in a new tab]

<a name="essentials-panel-settings"></a>
### Settings

![Settings](../media/portalfx-essentials/settings.png)

Settings in the portal should be discoverable in a consistent fashion. Each resource blade should expose a link to a `<azurefx:SettingListBlade>` blade via the first command, and via the all settings link in the essentials panel:

```ts
var getAllSettingsSelection: MsPortalFx.ViewModels.Parts.ResourceSummary.GetDynamicBladeSelection = (inputs: Def.InputsContract) => {
    return <MsPortalFx.ViewModels.DynamicBladeSelection> {
        detailBlade: ExtensionDefinition.BladeNames.engineAllSettingsBlade,
        detailBladeInputs: {
            id: inputs.resourceId
        }
    }
};
```

For convenience, the `Settings` blade automatically opens whenever a corresponding resource blade is opened.

<a name="essentials-panel-quick-start"></a>
### Quick start

![Quick start](../media/portalfx-essentials/quickstart.png)

The quick start provides a common design for helping users get started with your resources. The quick start blade must be built for each extension, using the `<azurefx:QuickStartBlade>`

```ts
var getQuickStartSelection: MsPortalFx.ViewModels.Parts.ResourceSummary.GetDynamicBladeSelection = (inputs: Def.InputsContract) => {
    return <MsPortalFx.ViewModels.DynamicBladeSelection> {
        detailBlade: ExtensionDefinition.BladeNames.engineQuickStartBlade,
        detailBladeInputs: {
            id: inputs.resourceId
        }
    }
};
```

<a name="essentials-panel-users-and-roles"></a>
### Users and roles

Resources support simple role based access via Azure Active Directory. Most resources support simple users & roles out of the box.

![Users & Roles](../media/portalfx-essentials/rbac.png)

<a name="essentials-panel-tags"></a>
### Tags

Tags provide a simple way for developers to organize their resources with lightweight key/value pairs. Most resources support tags out of the box.

![alt-text](../media/portalfx-essentials/tags.png "Tags")
