## Essentials control

The essentials control is used for showing resource information with multiple properties.
First 5 items in left pane of the essentials are obtained by calling Azure Resource Manager APIs with given resource id.
More items can be specified in constructor or can be added dynamically later in both left and right panes.
It has flexibility to customize layout of properties in a column, to show properties for non-ARM resources, to responsively redistribute properties into 1 or 3+ columns when the Blade width shrinks or expands.
When there are more than 5 items in any panes, only first 5 items in each panes will be shown and rest of the items can be revealed when **See more** is clicked.

![Essentials][essentials-sample]

<a name="essentialsOptions"></a>
### Options
- [Default](#defaultEssentials) (Most common use case)
- [Custom Layout](#customLayoutEssentials)
- [Non-Resource](#nonResourceEssentials)

<a name="essentialsTypes"></a>
### Types
- [Properties](#essentialsProperties)
- [Items](#essentialsItems)

<a name="essentialsFeatures"></a>
### Features
- [Resource Blade Open/Close Callbacks](#essentialsCallbacks)
- [Add Dynamic Properties](#essentialsDynamicProps)
- [Responsive Columns](#responsiveEssentials)

<br><br>

---

<br>

<a name="essentialsProperties"></a>
### Types

#### Type of Properties

##### Text
```typescript
{
    label: "Sample Label",
    value: "Sample Value"
}
```
##### Link
```typescript
{
    label: "Sample Label",
    value: "Bing.com",
    onClick: new ClickableLink(ko.observable("http://www.bing.com"))
}
```
##### CustomLink
```typescript
{
    label: "Sample Label",
    value: "Click to do something",
    onClick: () => {
        something();
    }
}
```

##### [Built-In](#builtInProperties)
<br>
<a name="builtInProperties"></a>
#### Built-In Properties

```typescript
/**
 * Built-In properties those can be obtained from resource data.
 */
const enum BuiltInType {
    /**
     * Built-in resource group property.
     */
    ResourceGroup = 1,

    /**
     * Built-in status property.
     */
    Status,

    /**
     * Built-in location property.
     */
    Location,

    /**
     * Built-in subscription name property.
     */
    SubscriptionName,

    /**
     * Built-in subscription id property.
     */
    SubscriptionId
}
```
<br>
<a name="essentialsItems"></a>
### Type of Items
#### Item
  A label with a property
```typescript
{
	label: "Sample Label",
    value: "Sample Value"
}
```

#### Multi-line Item
A label with multiple [properties](#essentialsProperties)
```typescript
{
    label: "Sample Label",
    lines: [
    	{
            value: "text only"
        },
        {
            value: "Bing.com",
            onClick: new ClickableLink(ko.observable("http://www.bing.com"))
        }
    ]
}
```

### Options
<a name="defaultEssentials"></a>
#### Default

To use the essentials, compose a template blade that hosts the essentials control, then use it from your extension.

You can control the behavior of the essentials via initialization [options](#essentialsOptions) and provided [feature](#essentialsFeatures) functions.

**Step 1**: Setup `Settings` interface for preserving `expanded` state for Essentials. `Decorator`s for set `TemplateBlade` and access to the blade settings.

`\Client\V2\Controls\Essentials\EssentialsDefaultBlade.ts`

{"gitdown":"include-section","file":"../Samples/SamplesExtension/Extension/Client/V2/Controls/Essentials/EssentialsDefaultBlade.ts","section":"essentials#setupBladeDefault"}

**Step 2**: Configurations for Read/Write `expanded` state in the blade settings and initialize the essentials control.

`\Client\V2\Controls\Essentials\EssentialsDefaultBlade.ts`

{"gitdown":"include-section","file":"../Samples/SamplesExtension/Extension/Client/V2/Controls/Essentials/EssentialsDefaultBlade.ts","section":"essentials#startBladeDefault"}

**Step 3**: Define the `_initializeControl` that initializes the essentials control.

`\Client\V2\Controls\Essentials\EssentialsDefaultBlade.ts`

{"gitdown":"include-section","file":"../Samples/SamplesExtension/Extension/Client/V2/Controls/Essentials/EssentialsDefaultBlade.ts","section":"essentials#initControlDefault"}

<a name="customLayoutEssentials"></a>
#### Custom Layout

To use the essentials, compose a template blade that hosts the essentials control, then use it from your extension.

Custom layout essentials allows you to change layout orders of built-in properties and any other properties freely.

You can control the behavior of the essentials via initialization [options](#essentialsOptions) and provided [feature](#essentialsFeatures) functions.

**Step 1**: Setup `Settings` interface for preserving `expanded` state for Essentials. `Decorator`s for set `TemplateBlade` and access to the blade settings.

`\Client\V2\Controls\Essentials\EssentialsCustomLayoutBlade.ts`

{"gitdown":"include-section","file":"../Samples/SamplesExtension/Extension/Client/V2/Controls/Essentials/EssentialsCustomLayoutBlade.ts","section":"essentials#setupBladeCustomLayout"}

**Step 2**: Configurations for Read/Write `expanded` state in the blade settings and initialize the essentials control.

`\Client\V2\Controls\Essentials\EssentialsCustomLayoutBlade.ts`

{"gitdown":"include-section","file":"../Samples/SamplesExtension/Extension/Client/V2/Controls/Essentials/EssentialsCustomLayoutBlade.ts","section":"essentials#startBladeCustomLayout"}

**Step 3**: Define the `_initializeControl` that initializes the essentials control.

`\Client\V2\Controls\Essentials\EssentialsCustomLayoutBlade.ts`

{"gitdown":"include-section","file":"../Samples/SamplesExtension/Extension/Client/V2/Controls/Essentials/EssentialsCustomLayoutBlade.ts","section":"essentials#initControlCustomLayout"}

<a name="nonResourceEssentials"></a>
#### Non-Resource

To use the essentials, compose a template blade that hosts the essentials control, then use it from your extension.

Non-resource essentials allows you to use the essentials without a resource id. You change layout orders of all properties freely.

You can control the behavior of the essentials via initialization [options](#essentialsOptions) and provided [feature](#essentialsFeatures) functions.

**Step 1**: Setup `Settings` interface for preserving `expanded` state for Essentials. `Decorator`s for set `TemplateBlade` and access to the blade settings.

`\Client\V2\Controls\Essentials\EssentialsNonResourceBlade.ts`

{"gitdown":"include-section","file":"../Samples/SamplesExtension/Extension/Client/V2/Controls/Essentials/EssentialsNonResourceBlade.ts","section":"essentials#setupBladeNonResource"}

**Step 2**: Configurations for Read/Write `expanded` state in the blade settings and initialize the essentials control.

`\Client\V2\Controls\Essentials\EssentialsNonResourceBlade.ts`

{"gitdown":"include-section","file":"../Samples/SamplesExtension/Extension/Client/V2/Controls/Essentials/EssentialsNonResourceBlade.ts","section":"essentials#startBladeNonResource"}

**Step 3**: Define the `_initializeControl` that initializes the essentials control.

`\Client\V2\Controls\Essentials\EssentialsNonResourceBlade.ts`

{"gitdown":"include-section","file":"../Samples/SamplesExtension/Extension/Client/V2/Controls/Essentials/EssentialsNonResourceBlade.ts","section":"essentials#initControlNonResource"}

### Features

<a name="essentialsCallbacks"></a>
#### Resource Blade Open/Close Callbacks

Resource blade open/close callback functions are provided and can be used for logging telemetry or some other needed tasks.

Note that this feature is not available in `NonResource` essentials.

`\Client\V2\Controls\Essentials\EssentialsDefaultBlade.ts`

{"gitdown":"include-section","file":"../Samples/SamplesExtension/Extension/Client/V2/Controls/Essentials/EssentialsDefaultBlade.ts","section":"essentials#bladeCallbacks"}

<a name="essentialsDynamicProps"></a>
#### Add Dynamic Properties

`\Client\V2\Controls\Essentials\EssentialsDefaultBlade.ts`

{"gitdown":"include-section","file":"../Samples/SamplesExtension/Extension/Client/V2/Controls/Essentials/EssentialsDefaultBlade.ts","section":"essentials#addDynamicProps"}

As the above code shows, the sample AJAX response contains 4 properties. First 2 items are added to left pane and last 2 items are added to right pane.

<a name="responsiveEssentials"></a>
#### Responsive Columns

`\Client\V2\Controls\Essentials\EssentialsResponsiveBlade.ts`

{"gitdown":"include-section","file":"../Samples/SamplesExtension/Extension/Client/V2/Controls/Essentials/EssentialsResponsiveBlade.ts","section":"essentials#responsive"}

The optional `boolean` property `responsiveColumns` can be specified to `true` to use responsive columns feature.

`Small` sized blade will contain single column and full screen will contain multiple number of columns depends on the blade's width.

[essentials-sample]: ../media/portalfx-controls/essentials.png
