
<a name="overview"></a>
## Overview

Parts, also known as tiles, are a framework feature that integrates the UI of an extension on dashboards.  Parts were more prevalent on blades, but this older pattern is being obsoleted by TemplateBlades that do not contain parts. For more information about template blades, see [top-blades-template.md](top-blades-template.md).

Intrinsic parts are composed of existing controls in the portal, and provide patterns for solving common patterns in the portal.

Many of the intrinsics can be found in the playground located at [https://aka.ms/portalfx/playground](https://aka.ms/portalfx/playground).

The remainder of them can be located in the working copy located at  [https://aka.ms/portalfx/samples/#blade/SamplesExtension/IntrinsicPartsIndexBlade](https://aka.ms/portalfx/samples/#blade/SamplesExtension/IntrinsicPartsIndexBlade).

The following sections cover these topics.

* [Traditional Blades versus Template Blades](#traditional-parts-and-template-blades)

* [Displaying data by using intrinsic parts](#displaying-data-by-using-intrinsic-parts)

* [Custom parts](#custom-parts)

* [Integrating parts into the part gallery](#integrating-parts-into-the-part-gallery)

* [Defining the sizing behavior](#defining-the-sizing-behavior)

* [Per user part settings](#per-user-part-settings)

* [The 'no data' message](#the-"no-data"-message)

* [Pinning parts](#pinning-parts)

* * * 

<a name="overview-traditional-parts-and-template-blades"></a>
### Traditional parts and template blades

Previously, Ibiza blades contained customizable parts, or tiles, that served as the main way for users to navigate the UI. However, the UI's were difficult to navigate, caused excessive navigation, caused excessive horizontal scrolling, and were not very performant.

Newer UI experiences combine traditional menu blades with TemplateBlades to display features and content.

There are still many cases where extensions may display rich monitoring experiences or at-a-glance data. To support those cases, Ibiza now supports multiple, shareable dashboards that were once known as the single start board.

It is highly recommended that developers who still need to build parts should build them for use on dashboards, instead of blades.

<a name="overview-displaying-data-by-using-intrinsic-parts"></a>
### Displaying data by using intrinsic parts

Built-in parts, also known as intrinsic parts, let extension developers create parts that contain pre-defined views and interaction patterns, but lets them plug in their own data.

**NOTE**: In this discussion, `<dir>` is the `SamplesExtension\Extension\` directory, and  `<dirParent>`  is the `SamplesExtension\` directory, based on where the samples were installed when the developer set up the SDK. If there is a working copy of the sample in the Dogfood environment, it is also included.

The following example of a Button part contains an icon and a label that navigates to a blade when the user clicks it. The three files used for the button part example are the following.

*  `<dir>\Client\V1\Parts\Intrinsic\ButtonPart\ViewModels\ButtonPartIntrinsicInstructionsPartViewModel.ts`

* `<dir>\Client\V1\Parts\Intrinsic\ButtonPart\ButtonPartIntrinsicInstructions.pdl`

* `<dir>\Client\V1\Parts\Intrinsic\ViewModels\ButtonPartViewModel.ts`

A working copy of the sample is located at [http://aka.ms/portalfx/samples#blade/SamplesExtension/ButtonPartIntrinsicInstructions/selectedItem/ButtonPartIntrinsicInstructions/selectedValue/ButtonPartIntrinsicInstructions](http://aka.ms/portalfx/samples#blade/SamplesExtension/ButtonPartIntrinsicInstructions/selectedItem/ButtonPartIntrinsicInstructions/selectedValue/ButtonPartIntrinsicInstructions).

The following procedure demonstrates how to use a button part.

1. Declare the part in the global `<Definition>` section of the PDL for the extension, as in the following example.

  ```xml

<!-- Name - Give your part a unique name -->
<!-- PartKind - This is where you declare that you're using a built in part type -->
<!-- ViewModel A pointer to the view model type that will customize the view (label, icon, etc) -->
<!-- InitialSize - The initial size of the part, in this case 2 X 1 (Small) -->
<Part Name="ButtonPartSmall" 
      PartKind="Button"
      ViewModel="{ViewModel Name=ButtonPartViewModel, Module=./Intrinsic/ViewModels/ButtonPartViewModel}"
      InitialSize="Small" />

```

1. The ViewModel that is associated with the pdl will plug data into the part. The ViewModel is located at `<dir>\Client\V1\Parts\Intrinsic\ViewModels\ButtonPartViewModel.ts`  For this step, the data is just the label and icon, but for more data-oriented parts, the data can be gathered from a server, like a resource provider. The ViewModel is in the following code.

 ```typescript

/**
* This sample uses the base class implementation. You can also implement the
* interface MsPortalFx.ViewModels.ButtonPartContract.
*/
export class ButtonPartViewModel extends MsPortalFx.ViewModels.ButtonPart {

   /**
    * Initialize the part.
    */
   constructor(container: MsPortalFx.ViewModels.PartContainerContract, initialState: any, dataContext: DataContext) {
       super();
       this.title(ClientResources.AssetTypeNames.Robot.singular);
       this.shortTitle(ClientResources.AssetTypeNames.Robot.singular);
       this.description(ClientResources.robotDescription);
       this.icon(CommonImages.robot);

       container.assetName(ClientResources.robotManufacturerBotsAreUs);
   }
}

```

For more information about built-in parts, see [portalfx-parts-intrinsic.md](portalfx-parts-intrinsic.md)

<a name="overview-custom-parts"></a>
### Custom parts

Unlike intrinsic parts, custom parts use `html` templates that are bound to the view model. The developer defines the look and feel in addition to the data loading for the part. Templates also can use other controls that are provided by the framework, as specified in [top-extensions-controls.md](top-extensions-controls.md).

The following is an example of a custom part. The three files used for the custom part example are the following.

* `<dir>\Client\V1\Parts\Custom\CustomParts.pdl`

* `<dir>\Client\V1\Parts\Custom\Templates\ExampleCustomPart.html`

* `<dir>\Client\V1\Parts\Custom\ViewModels\ExampleCustomPartViewModel.ts`

A working copy is located at [http://aka.ms/portalfx/samples#blade/SamplesExtension/SDKMenuBlade/custompart](http://aka.ms/portalfx/samples#blade/SamplesExtension/SDKMenuBlade/custompart).

The following procedure demonstrates how to use a custom part.

1. Declare the part in the global `<Definition>` section of the PDL for the extension, as in the following example.

   ```xml

<CustomPart Name="ExampleCustomPart"
            ViewModel="{ViewModel Name=ExampleCustomPartViewModel, Module=./Custom/ViewModels/ExampleCustomPartViewModel}"
            Template="{Html Source='Templates\\ExampleCustomPart.html'}"
            InitialSize="Large">
  <StyleSheet Source="{Css Source='Styles\\ExampleStyles.css'}" />
</CustomPart>

```

1. The pdl points to the html template.

  ```xml

<h3>This is a custom part</h3>

<p>
Number of clicks: <strong data-bind="text: numberOfClicks"></strong>
</p>

<div data-bind="visible: allowMoreClicks">
<button data-bind="click: increaseClickCount">Click me</button>
</div>

<div class="ext-too-many-clicks-box" data-bind="visible: !allowMoreClicks()">
That's too many clicks!
<button data-bind="click: resetClickCount">Reset</button>
</div>

<ul data-bind="foreach: myButtons">
<li>    
    <button data-bind="text: displayName, click: $parent.buttonClickHandler"></button>
    Number of clicks: <strong data-bind="text: clicked"></strong>
</li>
</ul>

```

1. The HTML template is bound to the following ViewModel by using **Knockout**, which is also referred to in the pdl.

  ```typescript

/**
* Example view model for a custom part
*/
export class ExampleCustomPartViewModel {

   // Public properties bound to the UI in the part's template
   public numberOfClicks = ko.observable(0);
   public allowMoreClicks = ko.pureComputed(() => {
       return this.numberOfClicks() < 3;
   });

   /**
    * Constructs an instance of the custom part view model.
    */
   constructor(container: MsPortalFx.ViewModels.PartContainerContract, initialState: any, dataContext: PartsArea.DataContext) {
   }

   public increaseClickCount(): void {
       const currentCount = this.numberOfClicks();
       this.numberOfClicks(currentCount + 1);
   }

   public resetClickCount(): void {
       this.numberOfClicks(0);
   }

   public myButtons = ko.observableArray([
       {
           displayName: ko.observable("First button"),
           clicked: ko.observable(0),
       },
       {
           displayName: ko.observable("Second button"),
           clicked: ko.observable(0),
       },
   ]);

   public buttonClickHandler = () => {
       this.numberOfClicks(this.numberOfClicks() + 1);
   }
}

```

### Integrating parts into the part gallery

Tiles are added to dashboards by using the part gallery, which is also known as the tile gallery.  The tile gallery is displayed  when the **Edit Dashboard** command is clicked, or when parts on the dashboard are rearranged or resized.

To register a part with the gallery, you need to add the `PartGalleryInfo` tag inside the `<Part>` or `<CustomPart>` tag, as in the file located at `<dir>\Client/V1/Parts/TileGallery/TileGallery.pdl` and in the following code.

   ```xml

<PartGalleryInfo
  Title="{Resource generalGalleryPartTitle, Module=ClientResources}"
  Category="{Resource partGalleryCategorySample, Module=ClientResources}"
  Thumbnail="{Svg Type=Favorite}"
  AutoConfigSelectablePath="configOnDropSelectable"/>

```

The **Title**, **Category**, and **Thumbnail** parts are reasonably intuitive.

Some tile experiences require that parts are configured when they are dropped from the tile gallery. The **AutoConfigSelectablePath** property performs this task for parts that have this requirement.
 
  <!-- TODO: Determine whether the following sentence is more appropriate.
   The **AutoConfigSelectablePath** property set a requirement to configure parts when they are dropped from the tile gallery.
   for parts that have this requirement.
  -->
 
 The following is the path to a selectable that is located inside the ViewMmodel and is immediately set to `true` by the Framework when the part is dropped on a dashboard. The selectable can be configured to open a context blade for configuration. The  example located at `<dir>/Client/V1/Parts/TileGallery/ViewModels/GeneralGalleryPart.ts` demonstrates how this type of selectable is configured. The example code is in the following code. 

   ```typescript

// Configure the HotSpot's Selectable so it will be implicitly activated when the user drops this Part on a Dashboard.
const bladeSelection: FxViewModels.DynamicBladeSelection = {
    detailBlade: ExtensionDefinition.BladeNames.pdlGeneralGalleryPartConfigurationBlade,
    detailBladeInputs: {},
};
const hotSpotSelectable = new FxViewModels.Selectable({
    selectedValue: bladeSelection,
});
hotSpotSelectable.getDefaultSelection = () => {
    return Q(bladeSelection);
};
this.configureHotSpot.selectable = hotSpotSelectable;
this.configOnDropSelectable = hotSpotSelectable;

// Create a ParameterCollector that will open the configure Blade to modify 'configuration' -- this Part's Configuration.
const configuration = container.activateConfiguration<Inputs, Def.SettingsContract>();
const collector = new FxViewModels.ParameterCollector<PartConfiguration>(container, {
    selectable: hotSpotSelectable,

    // The Parts Configuration values are sent to the Provider Blade to be edited by the user.
    supplyInitialData: configuration.getValues.bind(configuration),

    // The edited Configuration values are returned from the Provider Blade and updated in this Part.
    // Any edits will cause 'onInputsSet' to be called again, since this is the method where the Part receives a new, consistent
    // set of inputs/settings.
    receiveResult: configuration.updateValues.bind(configuration),
});

// This Selectable must be dynamically registered due to a PDL compiler bug that rejects any <BladeAction> that opens a
// <ContextBlade> from a HotSpot.
container.registerSelectable(
    container,
    "GeneralGalleryPartConfigSelectable",
    hotSpotSelectable,
    {
        openInContextPane: true,
        parameterCollector: collector,
    });
  
```

If the part that is being developed is associated with an Ibiza asset like an ARM resource, then it should be associated with an asset type and have a single input definition whose `IsAssetId` property is `true`.  If this is not the case then the part will appear in the **General** category of the part gallery.
 
### Defining the sizing behavior

There is a significant amount of flexibility when sizing extension tiles. All size options are included in the `<CustomPart>` tag in the PDL file located at `<dir>\Client/V1/Parts/PartSizes/PartSizes.pdl`.

A working copy is located at [http://aka.ms/portalfx/samples#blade/SamplesExtension/SDKMenuBlade/partsizes](http://aka.ms/portalfx/samples#blade/SamplesExtension/SDKMenuBlade/partsizes).

1. The following part supports only the large, standard size.

    <!-- determine why this section stops the gitHub build.-->

    ```xml

<CustomPart Name="LargePart"
            ViewModel="{ViewModel Name=PartSizesLargePartViewModel, Module=./PartSizes/ViewModels/PartSizesViewModels}"
            Template="{Html Source='Templates\\SizeAwarePart.html'}"
            InitialSize="Large">

```

1. The following part supports multiple, standard sizes.

    <!-- determine why this section stops the gitHub build.-->

    ```xml

<CustomPart Name="MiniPart"
            ViewModel="{ViewModel Name=PartSizesMiniPartViewModel, Module=./PartSizes/ViewModels/PartSizesViewModels}"
            Template="{Html Source='Templates\\SizeAwarePart.html'}"
            InitialSize="Mini">
  <CustomPart.SupportedSizes>
    <PartSize>Mini</PartSize>
    <PartSize>Normal</PartSize>
  </CustomPart.SupportedSizes>
</CustomPart>

```

1. The following part defaults to an arbitrary size, and can be resized by the user.  The Framework automatically adds a drag handle to this part because of the value `ResizeMode="User"`.

    ```xml

<CustomPart Name="CustomSizeUserResizePart"
            ViewModel="{ViewModel Name=PartSizesCustomSizeUserResizePartViewModel, Module=./PartSizes/ViewModels/PartSizesViewModels}"
            Template="{Html Source='Templates\\SizeAwarePart.html'}"
            InitialSize="Custom"
            InitialWidth="5"
            InitialHeight="2"
            ResizeMode="User">
</CustomPart>

```

1. The following part defaults to an arbitrary size, and can be resized programatically.  

     ```xml

<CustomPart Name="CustomSizeProgrammaticResizePart"
            ViewModel="{ViewModel Name=PartSizesCustomSizeProgrammaticResizePartViewModel, Module=./PartSizes/ViewModels/PartSizesViewModels}"
            Template="{Html Source='Templates\\SizeAwareResizablePart.html'}"
            InitialSize="Custom"
            InitialWidth="6"
            InitialHeight="3"
            ResizeMode="Programmatic">
  <CustomPart.SupportedSizes>
    <PartSize>Tall</PartSize>
    <PartSize>Mini</PartSize>
    <PartSize>Wide</PartSize>
    <PartSize>Large</PartSize>
  </CustomPart.SupportedSizes>
</CustomPart>

```

1. The following code demonstrates  how to programatically resize the part from within the associated ViewModel.  The parameters are specified in grid units instead of pixels. The code is located at `<dir>\Client\V1\Parts\PartSizes\ViewModels\PartSizesViewModels.ts`.


      ```typescript

onClick: () => {
    container.resizeTo(resizeA.width, resizeA.height);
},
        });

        
```

<a name="overview-per-user-part-settings"></a>
### Per user part settings

Extensions can read and write settings that are saved whenever the user saves a dashboard.  Private dashboards are located in the Ibiza user settings service.  Shared dashboards are stored in ARM as Azure resources inside the **MS.Portal** resource provider.

The dashboard is saved as a `JSON` document that contains the list of parts on the dashboard, in addition to their sizes, positions, and settings.  It also contains dashboard-level settings like the time range that is shared by many monitoring charts.

The following example located at `<dir>/Client/V1/Parts/TileGallery/TileGallery.pdl` demonstrates the use of the `<CustomPart.PartSettings>` tag to declare settings in the PDL file. It is also in the following code.

   ```xml

<CustomPart.Settings>
  <Setting Property="colorSettingValue" />
  <Setting Property="fontSettingValue" />
</CustomPart.Settings>

```

The following is the TypeScript code that reads and writes settings. It is also located at `<dir>Client/V1/Parts/TileGallery/ViewModels/GeneralGalleryPart.ts`.

   ```typescript

import ClientResources = require("ClientResources");
import PartsArea = require("../../PartsArea");
import ExtensionDefinition = require("../../../../_generated/ExtensionDefinition");
import Def = ExtensionDefinition.ViewModels.V1$Parts.GeneralGalleryPart;

export = Main;

module Main {
"use strict";

import FxViewModels = MsPortalFx.ViewModels;
import PartContainerContract = FxViewModels.PartContainerContract;
import FxConfiguration = MsPortalFx.Composition.Configuration;
import TimeUnit = FxConfiguration.TimeUnit;

// We have to explicitly define our Inputs contract here rather than use Def.InputsContract since there is a PDL
// compiler bug where <Part.InputDefinitions> are not represented on Def.InputsContract.
export interface Inputs {
    timeRange: FxConfiguration.TimeRange;
    otherParameter: string;
}

// We have to use this over Def.Settings because Def.Settings includes an old 'content' property that is no longer
// important to the Part Configuration design re: Part Settings.
export type Settings = Def.Settings$content$0;

// This will be used by the GeneralGalleryPartConfigurationPart too.
export type PartConfiguration = FxConfiguration.Part.ValuesWithMetadata<Inputs, Settings>;

export enum BackgroundColor {
    Default,
    Blue,
    Green,
    Yellow,
}

export enum FontStyle {
    Default,
    Muted,
    AllCaps,
}

export class GeneralGalleryPart implements Def.Contract {
    public configOnDropSelectable: FxViewModels.Selectable<FxViewModels.DynamicBladeSelection>;
    public configureHotSpot: FxViewModels.Controls.HotSpot.ViewModel;

    public timeRange = ko.observable<string>();
    public otherParameter = ko.observable<string>();
    public css: KnockoutObservableBase<any>;  // For the 'css' binding in the corresponding HTML template.
    public location: string;

    // These are required by the portal presently.  Re: Part Settings, the Part below works exclusively in terms of
    // 'configuration.updateValues' to update settings values and 'onInputsSet(..., settings)' to receive settings values.
    public colorSettingValue = ko.observable<BackgroundColor>();
    public fontSettingValue = ko.observable<FontStyle>();

    // These store the raw color and font style values supplied to the Part.
    private _colorSetting = ko.observable<BackgroundColor>();
    private _fontSetting = ko.observable<FontStyle>();

    constructor(container: PartContainerContract, initialState: any, context: PartsArea.DataContext) {

        container.partTitle(ClientResources.generalGalleryPartTitle);

        // Create the HotSpot control that the user will click.
        this.configureHotSpot = new FxViewModels.Controls.HotSpot.ViewModel(container);
        this.configureHotSpot.clickableDuringCustomize = true;
        //parts#PartGalleryConfigOnDropDoc
        // Configure the HotSpot's Selectable so it will be implicitly activated when the user drops this Part on a Dashboard.
        const bladeSelection: FxViewModels.DynamicBladeSelection = {
            detailBlade: ExtensionDefinition.BladeNames.pdlGeneralGalleryPartConfigurationBlade,
            detailBladeInputs: {},
        };
        const hotSpotSelectable = new FxViewModels.Selectable({
            selectedValue: bladeSelection,
        });
        hotSpotSelectable.getDefaultSelection = () => {
            return Q(bladeSelection);
        };
        this.configureHotSpot.selectable = hotSpotSelectable;
        this.configOnDropSelectable = hotSpotSelectable;

        // Create a ParameterCollector that will open the configure Blade to modify 'configuration' -- this Part's Configuration.
        const configuration = container.activateConfiguration<Inputs, Def.SettingsContract>();
        const collector = new FxViewModels.ParameterCollector<PartConfiguration>(container, {
            selectable: hotSpotSelectable,

            // The Parts Configuration values are sent to the Provider Blade to be edited by the user.
            supplyInitialData: configuration.getValues.bind(configuration),

            // The edited Configuration values are returned from the Provider Blade and updated in this Part.
            // Any edits will cause 'onInputsSet' to be called again, since this is the method where the Part receives a new, consistent
            // set of inputs/settings.
            receiveResult: configuration.updateValues.bind(configuration),
        });

        // This Selectable must be dynamically registered due to a PDL compiler bug that rejects any <BladeAction> that opens a
        // <ContextBlade> from a HotSpot.
        container.registerSelectable(
            container,
            "GeneralGalleryPartConfigSelectable",
            hotSpotSelectable,
            {
                openInContextPane: true,
                parameterCollector: collector,
            });
          //parts#PartGalleryConfigOnDropDoc
        // For fringe cases, this illustrates how the Part can understand whether it is located on a Dashboard or a Blade.
        // Importantly, the Part behavior shouldn't change between Dashboard and Blade.
        this.location = container.location === FxViewModels.PartLocation.Dashboard ?
            ClientResources.generalGalleryPartDashboardLocation :
            ClientResources.generalGalleryPartBladeLocation;

        // Data-driven styling for the Part.
        this.css = ko.computed(container, () => {
            const colorSetting = this._colorSetting();
            const fontSetting = this._fontSetting();
            return {
                "msportalfx-bgcolor-h2": colorSetting === BackgroundColor.Blue,
                "msportalfx-bgcolor-i2": colorSetting === BackgroundColor.Green,
                "msportalfx-bgcolor-j2": colorSetting === BackgroundColor.Yellow,
                "msportalfx-text-muted-50": fontSetting === FontStyle.Muted,
                "msportalfx-text-header-small": fontSetting === FontStyle.AllCaps,
            };
        });
    }

    public onInputsSet(inputs: Inputs, settings: Def.SettingsContract): MsPortalFx.Base.Promise {

        // Any changes to the Part's Configuration values (see 'updateValues' above) will cause 'onInputsSet' to be called with the
        // new inputs/settings values.
        this.timeRange(inputs.timeRange ? timeRangeToString(inputs.timeRange) : ClientResources.generalGalleryPartNone);
        this.otherParameter(inputs.otherParameter || ClientResources.generalGalleryPartNone);
        this._colorSetting(settings && settings.content && settings.content.colorSettingValue || BackgroundColor.Default);
        this._fontSetting(settings && settings.content && settings.content.fontSettingValue || FontStyle.Default);

        return null;
    }
}

function timeRangeToString(timeRange: FxConfiguration.TimeRange): string {
    if (timeRange.relative) {
        const duration = timeRange.relative.duration;
        const plural = duration > 1;
        let timeUnit: string;
        switch (timeRange.relative.timeUnit) {
            case TimeUnit.Minute:
                timeUnit = plural ? ClientResources.timeUnitMinutes : ClientResources.timeUnitMinute;
                break;
            case TimeUnit.Hour:
                timeUnit = plural ? ClientResources.timeUnitHours : ClientResources.timeUnitHour;
                break;
            case TimeUnit.Day:
                timeUnit = plural ? ClientResources.timeUnitDays : ClientResources.timeUnitDay;
                break;
            case TimeUnit.Week:
                timeUnit = plural ? ClientResources.timeUnitWeeks : ClientResources.timeUnitWeek;
                break;
            case TimeUnit.Month:
                timeUnit = plural ? ClientResources.timeUnitMonths : ClientResources.timeUnitMonth;
                break;
            case TimeUnit.Year:
                timeUnit = plural ? ClientResources.timeUnitYears : ClientResources.timeUnitYear;
                break;
        }
        return "{0} {1} {2}".format(ClientResources.timeRangeLast, duration, timeUnit);
    } else {
        return "{0} - {1}".format(timeRange.absolute.from, timeRange.absolute.to);
    }
}
}

```

<a name="overview-the-no-data-message"></a>
### The &quot;no data&quot; message

Sometimes parts are displayed for which no data is available. For example, an extension may display a prototype 'deployment history' that contains sample data, previous to the time when the user  enables  deployments for the extension. To support this, part `container` objects use the `noDataMessage` property.

The following example populates the part with sample data and set `noDataMessage` to a non-empty string.

```ts
container.noDataMessage("Enable deployments to see your history");
```

In this example, the part is grayed-out and is non-interactive. The message is displayed on top of the part. To remove the message, set the `noDataMessage` value back to `null`. 

This feature informs the user that the feature exists, although no data is available yet. If the extension needs to disable a part while the  data is loading, it should return a promise from the  `onInputsSet` method or use the `container.operations` queue.

<a name="overview-pinning-parts"></a>
### Pinning parts

By default, all blades and parts are 'pinnable'.  Pinning a part creates a copy of that part on the [dashboard](portalfx-ui-concepts.md#ui-concepts-the-dashboard).  The part on the dashboard provides a shortcut for users, allowing them to get their most used blades, as in the following example.

![alt-text](../media/portalfx-ui-concepts/dashboard.png "Dashboard")

All parts are pinnable by default, at little or no cost to the developer.  Part settings are copied to the new part, and the current size is maintained.  The new part is a complete copy of the original part, and can be independently configured, resized, or moved around on the dashboard. 

When a part is pinned or moved to another blade, a new ViewModel for that part is created.  This ViewModel will have the exact same contract.  The inputs to the part are stored in the Portal's cloud settings, and replayed onto the part when the dashboard loads.  For example, the robots part in this sample takes a single input named `id`, which comes from the blade.  When the part is pinned to the dashboard, the blade will obviously not be available, therefore the `id` of the part is stored in persistent storage. The  `id` of the part is in the pdl file located at `<dir>\SamplesExtension\Extension\Client\Hubs\Browse\Browse.pdl`, and it is also in the following code.

```xml
<CustomPart Name="RobotSummary"
            ViewModel="{ViewModel Name=RobotSummaryViewModel, Module=./Browse/ViewModels/RobotSummaryViewModel}"
            Template="{Html Source='Templates\\Robot.html'}"
            InitialSize="FullWidthFitHeight"
            AssetType="Robot"
            AssetIdProperty="name">
  <CustomPart.Properties>
    <Property Name="name"
              Source="{BladeParameter Name=id}" />
  </CustomPart.Properties>
</CustomPart>
```

Model data is not sent in bindings because the extension is required to store specific types of data in persistent storage. The only objects that should be sent as bindings between the extension and the various parts are the keys and ids that are used to load data from a back end server.   If data that specifies the robot changes, like  the name, those changes should be reflected in the part.  This provides the 'live tile' feel of the Portal, and ensures that the part data is not stale.

For more information about keys and data loading in the Portal, see [top-legacy-data.md](top-legacy-data.md).

<a name="overview-preventing-pinning"></a>
### Preventing pinning

In some cases, a part should not be pinnable.  Some instances are as follows.

* The part is showing an editable form
* The part is not performant enough to run persistently
* The part should not be displayed in a constrained UX
* The part has no value when pinned

Parts are not individually flagged as not being pinnable.  Rather, a blade that contains those parts is `locked`, as in the sample located at `<dir>\SamplesExtension\Extension\Client\extension.pdl` and in the following code.

```xml
<Blade Name="SamplesBlade"
       ViewModel="SamplesBladeViewModel"
       Pinnable="True"
       Locked="True">
```

**NOTE**:  All parts in the previous `SamplesBlade` will not provide the ability to be pinned.  However, the blade itself can still be pinned, as specified in [portalfx-blades-pinning.md](portalfx-blades-pinning.md).

For more information, about sharing parts, see [portalfx-extensibility-pde.md](portalfx-extensibility-pde.md).


