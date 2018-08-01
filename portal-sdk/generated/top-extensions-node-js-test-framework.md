<a name="overview"></a>
## Overview

<!-- TODO: Compare doc against list of items to update in 
https://stackoverflow.microsoft.com/questions/82011/msportalfx-test-documentation-issues
-->
There are many different ways to test an extension.

* In the development environment, you can test from Visual Studio or from the command line. 

* In the Windows Azure Engineering System (WAES), you can use the procedures that are described in [http://aka.ms/WAES](http://aka.ms/WAES). 

* If you run **mocha** in **Visual Studio** with the `--debug-brk` flag, you can press F5 and the project will attach to a debugger.

* There are instructions that describe how to set up test run parallelization in **Jenkins**.

* You can use The **MsPortalFx-Test** framework that runs tests against the Microsoft Azure Portal. 

**MsPortalFx-Test** is an end-to-end test framework that runs tests against the Microsoft Azure Portal. It tests extension interactions with user behavior, moreso than extension interactions with the Portal.  Its open source contribution model focuses on partner needs instead of internal Portal needs. It is distributed independently from the SDK to allow developers to develop tests in the same language as the extension.

The test framework interacts with the Portal as a user would, and helps developers make performant and robust extensions when they decrease breaking changes to partner team CI.

<a name="overview-general-architecture"></a>
### General Architecture

**MsPortalFx-Test** is arranged into three layers of abstraction. The names of the layers may not be consistent in all instances, but the general idea is the same.  There may also be some future refactoring to easily differentiate between the layers.

1. Controls layer

    The controls layer contains the basic controls used in the Portal, like blades, checkboxes, textboxes, and others.  It is not used directly by tests in most cases, because it is mainly for composing the action layer and the  test layers. It is built on webdriver primitives and there is little or no retry logic.  

 1. Actions layer

    The actions layer performs an action and verifies whether it was successful. It can retry the action if necessary. It is  used in writing tests like `portal.openBrowseBlade`. It is built upon the controls layer.

1. Test layer

    The test layer contains wrappers that are used for testing common functionality. It is built upon the action and control layers, and is used in writing business-case tests or other forms of suite-test functionality, like `parts.canPinAllBladeParts`. It can re-run the test if necessary, and throws an exception if the test or verification fails.

The following table contains several topics that are associated with running  **MsPortalFx-Test** tests.

| Document | Description |
| -------- | ----------- |
| [portalfx-extensions-msportalfx-install-and-test.md](portalfx-extensions-msportalfx-install-and-test.md) | Installation and Visual Studio Testing |
| [portalfx-extensions-msportalfx-browse-blade.md](portalfx-extensions-msportalfx-browse-blade.md) |  Write a browse blade test |
| [portalfx-extensions-msportalfx-resource.md](portalfx-extensions-msportalfx-resource.md) | Create and test a resource |
| [portalfx-extensions-msportalfx-cloudtest-create-browse.md](portalfx-extensions-msportalfx-cloudtest-create-browse.md) | Running tests in cloudtest.  Create and Browse testing |
| | |

When your testing is complete, you can send a pull request by using the procedures specified in [top-extensions-publishing.md](top-extensions-publishing.md).

If you have questions, you can send an email to <a href="mailto:ibizadiscuss@microsoft.com">ibizadiscuss@microsoft.com</a>.



<a name="msportalfx-test"></a>
## MSPortalFx-test

* [More Examples](#more-examples)

* [Running a test in cloudtest](#running-a-test-in-cloudtest)

* [Check test results](#check-test-results)

<a name="msportalfx-test-more-examples"></a>
### More Examples

Examples and test scripts are located at [https://github.com/Azure/msportalfx-test/tree/master/test](https://github.com/Azure/msportalfx-test/tree/master/test), and in various folders located at  [https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx), including `src/SDK/AcceptanceTests/Extensions/SamplesExtension/Tests`.

If you do not have access to the AzureUX-PortalFx dashboard, you can enlist by following the instructions specified in [top-onboarding.md](top-onboarding.md). 

 
<a name="blades"></a>
## Blades

Topics about blade navigation are the following.

* [Common portal blades](#common-portal-blades)

* [Locating an open blade](#locating-an-open-blade)

* [Dialogs](#dialogs)

* [Blade navigation](#blade-navigation)

* * * 

<a name="blades-common-portal-blades"></a>
### Common portal blades

There are several types of Portal blades that can be opened programmatically. There are also several API's available to make testing a common functionality within browse such as context menu commands and column picking functionality. 

* [Open the browse blade from your resource](#open-the-browse-blade-from-your-resource)

* [Open the resource summary blade](#open-the-resource-summary-blade)

* [Navigate to the spec picker blade](#navigate-to-the-spec-picker-blade)

* [Navigate to the Settings blade](#navigate-to-the-settings-blade)

* [Navigate to the Properties Blade](#navigate-to-the-properties-blade)

* [Navigate to the QuickStart blade](#navigate-to-the-quickstart-blade)

* [Navigate to the user access blade](#navigate-to-the-user-access-blade)

* [The Move Resource Blade](#the-move-resource-blade)

* * *

<a name="blades-common-portal-blades-open-the-browse-blade-from-your-resource"></a>
#### Open the browse blade from your resource

To open/navigate to the Browse blade from resource type you can use `portal.openBrowseBlade`.  The returned promise will resolve with the browse blade. 

```ts
import testFx = require('MsPortalFx-Test');
...

        return testFx.portal.openBrowseBlade(resourceProvider, resourceType, resourceBladeTitle, 20000)
            .then((blade) => blade.filterItems(resourceName))
...
```

<a name="blades-common-portal-blades-open-the-resource-summary-blade"></a>
#### Open the resource summary blade

Use the `portal.openResourceBlade` method to open or navigate to the Resource Summary blade for a specific resource.  The returned promise will resolve with the Resource summary blade for the specified resource, as in the following example.

```ts
import testFx = require('MsPortalFx-Test');
...

        return testSupport.armClient.createResourceGroup(resourceGroupName, locationId)
            .then((result) => testFx.portal.openResourceBlade(result.resourceGroup.id, result.resourceGroup.name, 70000))
            .then(() => resourceBlade.clickCommand(extensionResources.deleteLabel))
...
```

<a name="blades-common-portal-blades-navigate-to-the-spec-picker-blade"></a>
#### Navigate to the spec picker blade

The `SpecPickerBlade` can be used to select or change the current spec of a resource.  The following example demonstrates how to navigate to the spec picker for a specific resource, then changes the selected spec.

```ts
//1. imports
import testFx = require('MsPortalFx-Test');
import SpecPickerBlade = testFx.Parts.SpecPickerBlade;


        const pricingTierBlade = testFx.portal.blade({ title: extensionResources.samplesExtensionStrings.PricingTierBlade.title });
        let pricingTierPart: PricingTierPart;
//2. Open navigate blade and select the pricing tier part.  
// Note if navigating to a resourceblade use testFx.portal.openResourceBlade and blade.element
        return testFx.portal.navigateToUriFragment("blade/SamplesExtension/PricingTierV3Blade", 15000).then(() => {
            return pricingTierBlade.waitUntilBladeAndAllTilesLoaded();
        }).then(() => {
            pricingTierPart = testFx.portal.element(PricingTierPart);
            return pricingTierPart.click();
        }).then(() => {
 //3. get a reference to the picker blade and pick a spec 
            var pickerBlade = testFx.portal.blade({ bladeType: SpecPickerBlade, title: extensionResources.choosePricingTier});
            return pickerBlade.pickSpec(extensionResources.M);
        }).then(() => {
        
```

<a name="blades-common-portal-blades-navigate-to-the-settings-blade"></a>
#### Navigate to the settings blade

Navigation to the `SettingsBlade` is performed by using the `ResourceSummaryPart` on a resource summary blade. The following demonstrates how to navigate to a settings blade and click on a setting.

```ts
import testFx = require('MsPortalFx-Test');
...
//1. model your resource summary blade which contains a resource summary part

import Blade = testFx.Blades.Blade;
import ResourceSummaryPart = testFx.Parts.ResourceSummaryPart;

class SummaryBlade extends Blade {
    public essentialsPart = this.element(ResourceSummaryPart);
    public rolesAndInstancesPart = this.part({ innerText: resources.rolesAndInstances });
    public estimatedSpendPart = this.part({ innerText: resources.estimatedSpend });
}
...
//2. navigate to the quickstart and click a link
...
        const settingsBlade = testFx.portal.blade({ bladeType: testFx.Blades.SettingsBlade });
        return testSupport.armClient.createResourceGroup(resourceGroups[0], locationId)
            .then((result) => testFx.portal.openResourceBlade(result.resourceGroup.id, result.resourceGroup.name, 70000))
            //click on the settings hotspot to open the settings blade
             //blades#navigateClick
            .then((blade) => blade.asType(SummaryBlade).essentialsPart.settingsHotSpot.click())
            .then(() => settingsBlade.clickSetting(PortalFxResources.properties))
            .then(() => testFx.portal.wait(until.isPresent(testFx.portal.element(testFx.Blades.PropertiesBlade))));//blades#navigateClick
        
...
```

<a name="blades-common-portal-blades-navigate-to-the-properties-blade"></a>
#### Navigate to the properties blade

Navigation to the `PropertiesBlade` is performed by using the resource summary blade. The following demonstrates how to navigate to the properties blade.

```ts
import testFx = require('MsPortalFx-Test');
...
//2. navigate to the properties blade from the resource blade and check the value of one of the properties

                return testFx.portal.openResourceBlade(resourceId, resourceName, 70000);
            })
            .then(() => testFx.portal.blade({ bladeType: SummaryBlade })
                .essentialsPart.settingsHotSpot.click())
            .then(() => testFx.portal.blade({ bladeType: testFx.Blades.SettingsBlade })
                .clickSetting(PortalFxResources.properties))
            .then(() => {
                const expectedPropertiesCount = 6;
                return testFx.portal.wait(() => {
                    return propertiesBlade.properties.count().then((count) => {
                        return count === expectedPropertiesCount;
                    });
                }, null, testFx.Utils.String.format("Expected to have {0} properties in the Properties blade.", expectedPropertiesCount));
            }).then(() => propertiesBlade.property({ name: PortalFxResources.nameLabel }).value.getText())
            .then((nameProperty) => assert.equal(nameProperty, resourceName, testFx.Utils.String.format("Expected the value for the 'NAME' property to be '{0}' but found '{1}'.", resourceName, nameProperty)));
...
```

<a name="blades-common-portal-blades-navigate-to-the-quickstart-blade"></a>
#### Navigate to the quickstart blade

The `Portal.navigateToUriFragment` method allows an extension to navigate directly into a `QuickStartBlade` for a resource by using a deep link.
   
```ts
import testFx = require('MsPortalFx-Test');
...

        const resourceName = resourcePrefix + guid.newGuid();
        const createOptions = {
            name: resourceName,
            resourceGroup: resourceGroupName,
            location: locationId,
            resourceProvider: resourceProvider,
            resourceType: resourceType,
            resourceProviderApiVersion: resourceProviderApiVersion,
            properties: {
                displacement: "600cc",
                model: "type1",
                status: 0
            }
        };
        return testSupport.armClient.createResource(createOptions)
            //form deep link to the quickstart blade
            .then((resourceId) => {
                return testFx.portal.navigateToUriFragment(`blade/SamplesExtension/EngineQuickStartBlade/id/${encodeURIComponent(resourceId)}`)
                    .then(() =>
                        testFx.portal.wait(ExpectedConditions.isPresent(testFx.portal.blade({ title: resourceId, bladeType: QuickStartBlade }))));
```

Deep-linking is fast, but it does not validate that the user can actually navigate to a `QuickStartBlade` by using a `ResourceSummaryPart` on a resource summary blade.  The following code demonstrates how to verify that the user can navigate to the blade.

```ts
import testFx = require('MsPortalFx-Test');
...
//1. model your resource summary blade which contains a resource summary part

import Blade = testFx.Blades.Blade;
import ResourceSummaryPart = testFx.Parts.ResourceSummaryPart;

class SummaryBlade extends Blade {
    public essentialsPart = this.element(ResourceSummaryPart);
    public rolesAndInstancesPart = this.part({ innerText: resources.rolesAndInstances });
    public estimatedSpendPart = this.part({ innerText: resources.estimatedSpend });
}

...
//2. navigate to the quickstart and click a link

        const summaryBlade = testFx.portal.blade({ title: resourceGroupName, bladeType: SummaryBlade });

        return testFx.portal.openResourceBlade(resourceGroupId, resourceGroupName, 70000)
            //click to open the quickstart blade
            .then(() => summaryBlade.essentialsPart.quickStartHotSpot.click())
            .then(() => summaryBlade.essentialsPart.quickStartHotSpot.isSelected())
            .then((isSelected) => assert.equal(isSelected, true))
            .then(() => testFx.portal.wait(testFx.until.isPresent(testFx.portal.blade({ title: resourceGroupName, bladeType: QuickStartBlade }))))
            .then((result) => assert.equal(result, true));
...
```

<a name="blades-common-portal-blades-navigate-to-the-user-access-blade"></a>
#### Navigate to the user access blade

The `Portal.navigateToUriFragment` method allows an extension to navigate directly into the user access blade that is associated with a resource by using  a deep link.
   
```ts
import testFx = require('MsPortalFx-Test');
...

        const resourceName = resourcePrefix + guid.newGuid();
        const createOptions = {
            name: resourceName,
            resourceGroup: resourceGroupName,
            location: locationId,
            resourceProvider: resourceProvider,
            resourceType: resourceType,
            resourceProviderApiVersion: resourceProviderApiVersion,
            properties: {
                displacement: "600cc",
                model: "type2",
                status: 0
            }
        };

        return testSupport.armClient.createResource(createOptions)
            //form deep link to the quickstart blade
            .then((resourceId) => testFx.portal.navigateToUriFragment(`blade/Microsoft_Azure_AD/UserAssignmentsBlade/scope/${resourceId}`, timeouts.defaultLongTimeout))
            .then(() => testFx.portal.wait(ExpectedConditions.isPresent(testFx.portal.element(testFx.Blades.UsersBlade))));
```

Deep-linking is fast, but it does not validate that the user can actually navigate to a `UsersBlade ` by using a `ResourceSummaryPart` on a resource summary blade.  The following code demonstrates how to verify that the user can navigate to the blade.

```ts
import testFx = require('MsPortalFx-Test');
...
//1. model your resource summary blade which contains a resource summary part

import Blade = testFx.Blades.Blade;
import ResourceSummaryPart = testFx.Parts.ResourceSummaryPart;

class SummaryBlade extends Blade {
    public essentialsPart = this.element(ResourceSummaryPart);
    public rolesAndInstancesPart = this.part({ innerText: resources.rolesAndInstances });
    public estimatedSpendPart = this.part({ innerText: resources.estimatedSpend });
}

...
//2. navigate to the quickstart and click a link

        const summaryBlade = testFx.portal.blade({ title: resourceGroupName, bladeType: SummaryBlade });

        return testFx.portal.openResourceBlade(resourceGroupId, resourceGroupName, 70000)
            //click to open the user access blade
            .then(() => summaryBlade.essentialsPart.accessHotSpot.click())
            .then(() => summaryBlade.essentialsPart.accessHotSpot.isSelected())
            .then((isSelected) => assert.equal(isSelected, true))
            .then(() => testFx.portal.wait(ExpectedConditions.isPresent(testFx.portal.element(UsersBlade)), 90000))
            .then((result) => assert.equal(result, true));
...
```

<a name="blades-common-portal-blades-the-move-resource-blade"></a>
#### The move resource blade

The `MoveResourcesBlade` is used to move resources from one resource group to a new resource group.  The `portal.startMoveResource` method provides a simple abstraction that will initiate the move of an existing resource to a new resource group.  The following example demonstrates how to initiate the move and then wait on successful notification of completion.
  
```ts
import testFx = require('MsPortalFx-Test');
...
    
            return testFx.portal.startMoveResource(
                {
                    resourceId: resourceId,
                    targetResourceGroup: newResourceGroup,
                    createNewGroup: true,
                    subscriptionName: subscriptionName,
                    timeout: 120000
                });
            }).then(() => {
            return testFx.portal.element(NotificationsMenu).waitForNewNotification(portalFxResources.movingResourcesComplete, null, 5 * 60 * 1000);
```

<a name="blades-locating-an-open-blade"></a>
### Locating an open blade

The `testfx.portal.blade` method can be used to locate an already opened blade.

*  Locate an already opened blade by its  title, as in the following example.

    ```ts
    
        const resourceBlade = testFx.portal.blade({ title: resourceGroupName });
    ```  
 
* Locate an already opened blade by using its  blade type and its predefined locator, as in the following example.

    ```ts
    
        const settingsBlade = testFx.portal.blade({ bladeType: testFx.Blades.SettingsBlade });
        
    ```

<a name="blades-dialogs"></a>
### Dialogs

Some blades commands create dialogs that typically require the user to acknowledge something. The `Blade` class exposes a `dialog` function that can be used to locate the dialog on the specified blade, and to perform actions against it. 

The following example demonstrates how to:

* Get a reference to a dialog by its title

* Find a field within the dialog and send information to it by using the `sendKeys` method

* Click on a button in a dialog

```ts
import testFx = require('MsPortalFx-Test');
...

        const samplesBlade = testFx.portal.blade({ title: "Samples", bladeType: SamplesBlade });
        return testFx.portal.goHome(20000).then(() => {
            return testFx.portal.navigateToUriFragment("blade/SamplesExtension/SamplesBlade");
        }).then(() => {
            return samplesBlade.openSample(extensionResources.samplesExtensionStrings.SamplesBlade.bladeWithToolbar);
        }).then((blade) => {
            return blade.clickCommand(extensionResources.samplesExtensionStrings.BladeWithToolbar.commands.save);
            }).then((blade) => {
            //get a reference to a dialog by title
            let dialog = blade.dialog({ title: extensionResources.samplesExtensionStrings.BladeWithToolbar.bladeDialogs.saveFile });
            //sending keys to a field in a dialog
            return dialog.field(testFx.Controls.TextField, { label: extensionResources.samplesExtensionStrings.BladeWithToolbar.bladeDialogs.filename })
                .sendKeys("Something goes here")
                //clicking a button within a dialog
                .then(() => dialog.clickButton(extensionResources.ok));
            });
```

<a name="blades-blade-navigation"></a>
### Blade navigation

There are several approaches that can be used to  navigate to blades within `msportalfx-test`.

* Use a deep link to the blade using the `portal.navigateToUriFragment` function, as in the following example.

    ```ts
    import testFx = require('MsPortalFx-Test');
    ...
    
        const resourceName = resourcePrefix + guid.newGuid();
        const createOptions = {
            name: resourceName,
            resourceGroup: resourceGroupName,
            location: locationId,
            resourceProvider: resourceProvider,
            resourceType: resourceType,
            resourceProviderApiVersion: resourceProviderApiVersion,
            properties: {
                displacement: "600cc",
                model: "type1",
                status: 0
            }
        };
        return testSupport.armClient.createResource(createOptions)
            //form deep link to the quickstart blade
            .then((resourceId) => {
                return testFx.portal.navigateToUriFragment(`blade/SamplesExtension/EngineQuickStartBlade/id/${encodeURIComponent(resourceId)}`)
                    .then(() =>
                        testFx.portal.wait(ExpectedConditions.isPresent(testFx.portal.blade({ title: resourceId, bladeType: QuickStartBlade }))));
    ```

* Click on another ux component that opens the blade, as in the following example.

    ```ts
    import testFx = require('MsPortalFx-Test');
    ...
    
            .then((blade) => blade.asType(SummaryBlade).essentialsPart.settingsHotSpot.click())
            .then(() => settingsBlade.clickSetting(PortalFxResources.properties))
            .then(() => testFx.portal.wait(until.isPresent(testFx.portal.element(testFx.Blades.PropertiesBlade))));
    ```

* Use `portal.open*` functions that open blades like create, browse and resource summary blades. For more information, see [Opening common portal blades](#common-portal-blades).

* Use the `portal.search` function to locate and open browse and resource blades, as in the following example.

    ```ts
    import testFx = require('MsPortalFx-Test');
    ...
    
        const subscriptionsBlade = testFx.portal.blade({ title: testSupport.subscription });
        
        testFx.portal.portalContext.features.push({ name: "feature.resourcemenu", value: "true" });
        return testFx.portal.goHome().then(() => {
            return testFx.portal.search(testSupport.subscription);
        }).then((results) => {
            return testFx.portal.wait<SearchResult>(() => {
                var result = results[0];
                return result.title.getText().then((title) => {
                    return title === testSupport.subscription ? result : null;
                });
            });
        }).then((result) => {
            return result.click();
        }).then(() => {
            return testFx.portal.wait(until.isPresent(subscriptionsBlade));
        }); 
    ```


 
<a name="parts"></a>
## Parts

<a name="parts-how-to-get-the-reference-to-a-part-on-a-blade"></a>
### How to get the reference to a part on a blade

If it is a specific part, like the essentials for example:

```
	let thePart = blade.element(testFx.Parts.ResourceSummaryPart);
```

For a more generic part:
```
	let thePart = blade.part({innerText: "some part text"});
``` 

To get a handle of this part using something else than simple text you can also do this:

```
	let thePart = blade.element(By.Classname("myPartClass")).AsType(testFx.Parts.Part);
```

<a name="parts-collectionpart"></a>
### CollectionPart

The following example demonstrates how to:

- get a reference to the collection part using `blade.element(...)`. 
- get the rollup count using `collectionPart.getRollupCount()`
- get the rollup count lable using `collectionPart.getRollupLabel()`
- get the grid rows using `collectionPart.grid.rows`

```ts

    it("Can get rollup count, rollup label and grid", () => {
        const collectionBlade = testFx.portal.blade({ title: "Collection" });

        return testFx.portal.navigateToUriFragment("blade/SamplesExtension/CollectionPartIntrinsicInstructions")
            .then(() => testFx.portal.wait(() => collectionBlade.waitUntilBladeAndAllTilesLoaded()))
            .then(() => collectionBlade.element(testFx.Parts.CollectionPart))
            .then((collectionPart) => {
                return collectionPart.getRollupCount()
                    .then((rollupCount) => assert.equal(4, rollupCount, "expected rollupcount to be 4"))
                    .then(() => collectionPart.getRollupLabel())
                    .then((label) => assert.equal(extensionResources.samplesExtensionStrings.Robots, label, "expected rollupLabel is Robots"))
                    .then(() => collectionPart.grid.rows.count())
                    .then((count) => assert.ok(count > 0, "expect the grid to have rows"));
            });
    });
```

Note if you have multiple collection parts you may want to use `blade.part(...)` to search by text.

<a name="parts-collectionpart-grid"></a>
#### Grid

<a name="parts-collectionpart-grid-finding-a-row-within-a-grid"></a>
##### Finding a row within a grid

The following demonstrates how to use `Grid.findRow` to:

- find a `GridRow` with the given text at the specified index
- get the text from all cells within the row using `GridRow.cells.getText`

```ts
                
                return grid.findRow({ text: "John", cellIndex: 0 })
                    .then((row) => row.cells.getText())
                    .then((texts) => texts.length > 2 && texts[0] === "John" && texts[1] === "333");
                
```

<a name="parts-collectionpart-createcomboboxfield"></a>
#### CreateComboBoxField

use this for modeling the resouce group `CreateComboBoxField` on create blades.

- use `selectOption(...)` to chose an existing resource group
- use `setCreateValue(...)` and `getCreateValue(...)` to get and check the value of the create new field respectively 

```ts

        return testFx.portal.goHome(40000).then(() => {
            //1. get a reference to the create blade
            return testFx.portal.openGalleryCreateBlade(
                galleryPackageName,              //the gallery package name e.g "Microsoft.CloudService"
                bladeTitle, //the title of the blade e.g "Cloud Services"
                timeouts.defaultLongTimeout             //an optional timeout to wait on the blade
            )
        }).then((blade: testFx.Blades.CreateBlade) => {
            //2. find the CreateComboBoxField
            var resourceGroup = blade.element(CreateComboBoxField);
            //3. set the value of the Create New text field for the resource group
            return resourceGroup.setCreateValue("NewResourceGroup")
                .then(() =>
                    resourceGroup.getCreateValue()
                ).then((value) =>
                    assert.equal("NewResourceGroup", value, "Set resource group name")
                ).then(() =>
                    resourceGroup.selectOption("NewResourceGroup_4")
                ).then(() =>
                    resourceGroup.getDropdownValue()
                ).then((value) =>
                    assert.equal("NewResourceGroup_4", value, "Set resource group dropdown")
                );
        });
        
```

<a name="parts-collectionpart-editor"></a>
#### Editor

<a name="parts-collectionpart-editor-can-read-and-write-content"></a>
##### Can read and write content

The following example demonstrates how to:

- use `read(...)` to read the content
- use `empty(...)` to empty the content
- use `sendKeys(...)` to write the content

```ts

        let editorBlade: EditorBlade;
        let editor: Editor;
        
        return BladeOpener.openSamplesExtensionBlade(
            editorBladeTitle,
            editorUriFragment,
            EditorBlade,
            10000)
            .then((blade: EditorBlade) => {
                editorBlade = blade;
                editor = blade.editor;
                return editor.read();
            })
            .then((content) => assert.equal(content, expectedContent, "expectedContent is not matching"))
            .then(() => editor.empty())
            .then(() => editor.sendKeys("document."))
            .then(() => testFx.portal.wait(() => editor.isIntellisenseUp().then((isUp: boolean) => isUp)))
            .then(() => {
                let saveButton = By.css(`.azc-button[data-bind="pcControl: saveButton"]`);
                return editorBlade.element(saveButton).click();
            })
            .then(() => testFx.portal.wait(() => editor.read().then((content) => content === "document.")))
            .then(() => editor.workerIFramesCount())
            .then((count) => assert.equal(count, 0, "We did not find the expected number of iframes in the portal.  It is likely that the editor is failing to start web workers and is falling back to creating new iframes"));
        
```

<a name="parts-collectionpart-essentials"></a>
#### essentials


<a name="parts-collectionpart-essentials-essentials-tests"></a>
##### Essentials tests

The following example demonstrates how to:

- use `countItems(...)` to count the number of all items. (MultiLine Item is counted as one)
- use `isDisabled(...)` to get a value that determines whether the essentials is disabled
- use `hasViewAll(...)` to get a value that determines whether the essentials has ViewAll button or not
- use `getViewAllButton(...)` to get a PortalElement of the essentials' viewAll button
- use `getItemByLabelText(...)` to get an EssentialsItem that is found by its label text
- use `getPropertyElementByValue(...)` to get a PortalELement of matching property value
- use `getExpandedState(...)` to get a value that determines the essentials' expanded state
- use `setExpandedState(...)` to set the essentials' expanded state
- use `getExpander(...)` to get the Expander element
- use `getProperties(...)` to get an array of properties
- use `getLabelText(...)` to get the item label text
- use `hasMoveResource(...)` to get whether the item has move resource blade or not
- use `getLabelId(...)` to get the item label id
- use `getSide(...)` to get the item's side

```ts

        let essentialsBlade: EssentialsBlade;
        let essentials: Essentials;

        return BladeOpener.openSamplesExtensionBlade(
            essentialsBladeTitle,
            essentialsUriFragment,
            EssentialsBlade,
            waitTime)
            .then((blade) => blade.waitUntilLoaded(waitTime).then(() => blade))
            .then((blade: EssentialsBlade) => {
                essentialsBlade = blade;
                essentials = blade.essentials;
                return Q.all<any>([
                    essentials.countItems(),
                    essentials.getExpandedState(),
                    essentials.hasViewAll()
                ]);
            })
            .then((values: any[]) => {
                // Essentials item count, expanded state and viewAll button state check
                assert.equal(values[0], 10, "Essentials has 10 items at the beginning");
                assert.ok(values[1], "Essentials should be expanded by default");
                assert.ok(values[2], "Essentials has the ViewAll button at the beginning");
                essentials.getViewAllButton().click();
            })
            .then(() => essentials.countItems())
            .then((count: number) => {
                // Essentials item count after click ViewAll button
                assert.equal(count, 12, "Essentials has 12 items after adding dynamic properties");
                // Item label and properties check
                return Q.all([
                    itemAssertionHelper(essentials, {
                        label: "Resource group",
                        hasMoveResource: true,
                        side: "left",
                        properties: [
                            { type: EssentialsItemPropertyType.Function, value: "snowtraxpsx600" }
                        ]
                    }),
                    itemAssertionHelper(essentials, {
                        label: "Multi-line Item",
                        hasMoveResource: false,
                        side: "right",
                        properties: [
                            { type: EssentialsItemPropertyType.Text, value: "sample string value" },
                            { type: EssentialsItemPropertyType.Link, value: "Bing.com" }
                        ]
                    }),
                    itemAssertionHelper(essentials, {
                        label: "Status",
                        hasMoveResource: false,
                        side: "left",
                        properties: [
                            { type: EssentialsItemPropertyType.Text, value: "--" }
                        ]
                    })
                ]);
            })
            .then(() => essentials.getPropertyElementByValue("status will be changed")
                .then((propElement: testFx.PortalElement) =>  propElement.click()))
                // Item label and properties check after clicking "status will be changed"
                .then(() => itemAssertionHelper(essentials, {
                    label: "Status",
                    hasMoveResource: false,
                    side: "left",
                    properties: [
                        { type: EssentialsItemPropertyType.Text, value: "1 times clicked!" }
                    ]
                }))
            .then(() => essentials.getPropertyElementByValue("snowtraxpsx600")
                .then((propElement: testFx.PortalElement) =>  propElement.click()))
                // Item label and properties check after clicking "snowtraxpsx600"
                .then(() => itemAssertionHelper(essentials, {
                    label: "Status",
                    hasMoveResource: false,
                    side: "left",
                    properties: [
                        { type: EssentialsItemPropertyType.Text, value: "Resource group window is opened" }
                    ]
                }))
            .then(() => essentials.getExpander().click())
            .then(() => Q.all<any>([
                essentials.getExpandedState(),
                essentials.items.isDisplayed()
            ]))
            .then((values: any) => {
                // check expander state and items' visibilities after closing expander
                assert.ok(!values[0], "expander should be closed");
                values[1].forEach((state: boolean) => {
                    assert.ok(!state, "items should be invisible");
                });
                return essentials.getExpander().click()
                    .then(() => Q.all<any>([
                    essentials.getExpandedState(),
                    essentials.items.isDisplayed()
                ]));
            })
            .then((values: any) => {
                // check expander state and items' visibilities after opening expander
                assert.ok(values[0], "expander should be opened");
                values[1].forEach((state: boolean) => {
                    assert.ok(state, "items should be visible");
                });
            });
        
```


 ### Command

<a name="parts-action-bar"></a>
### Action Bar

<a name="parts-delete"></a>
### Delete

<a name="parts-styling-layout-regression-detection"></a>
### Styling / layout regression detection

To detect styling or layout regressions in your tests, use the `portal.detectStylingRegression` function.

    ```ts
    import testFx = require('MsPortalFx-Test');
    ...
    it("Can do action X", () => {    
        // Your test goes here, dummy test follows...
        return testFx.portal.goHome().then(() => {
            return testFx.portal.detectStylingRegression("MyExtension/Home");
        });
    });
    ```
    
The function will upload a screenshot to the "cicss" container of the storage account with the name, key, subscription id and resource group you will provide; 

Put the following values into your config.json:

```
    "CSS_REGRESSION_STORAGE_ACCOUNT_NAME":"myaccountname",
    "CSS_REGRESSION_STORAGE_ACCOUNT_SUBSCRIPTIONID":"mysubscriptionid",
    "CSS_REGRESSION_STORAGE_ACCOUNT_RESOURCE_GROUP":"mygresourcegroupname",
    "CSS_REGRESSION_STORAGE_ACCOUNT_KEY":"myaccountkey",
```

Put the storage account key into Windows Credential Manager using cmdkey i.e

```
    cmdkey /generic:CSS_REGRESSION_STORAGE_ACCOUNT_KEY /user:myaccountname /pass:myaccountkey
```

The screenshot will then be compared with a Last Known Good screenshot and, if different, a diff html file will be produced and uploaded to your storage account.
The link to that html file will be in the failed test's error message and includes a powershell script download to promote the Latest screenshot to Last Known Good.
The initial Last Known Good file is the screenshot taken when there was no Last Known Good screenshot to compare it to; i.e. to seed your test, just run it once.
    
For reference, here's the signature of the `portal.detectStylingRegression` function.
    
    ```ts
    ...
    
    /**
     * Takes a browser screenshot and verifies that it does not differ from LKG screenshot;
     * contains an assert that will fail on screenshot mismatch
     * @param uniqueID Test-specific unique screenshot identifier, e.g. "MyExtension/ResourceGroupTagsTest"
     * @returns Promise resolved once styling regression detection is done (so you can chain on it)
     */
    public detectStylingRegression(uniqueID: string): Q.Promise<void> {
        
    ```


<a name="parts-locators"></a>
### Locators

<a name="parts-consuming-updates"></a>
### Consuming Updates

<a name="parts-code-coverage"></a>
### Code Coverage

<a name="parts-code-coverage-interop-how-to-run-net-code-from-your-tests"></a>
#### Interop, how to run .NET code from your tests
edge.js



 
<a name="parts-mocking"></a>
### Mocking

<a name="parts-mocking-how-to-show-mock-data-into-the-portal"></a>
#### How to show mock data into the Portal

The [MsPortalFx-Mock](https://www.npmjs.com/package/msportalfx-mock) package provides a framework for showing mock data in the portal. It come with builtin support for mocking ARM data.

<a name="parts-mocking-how-to-show-mock-data-into-the-portal-mocking-arm"></a>
##### Mocking ARM

Mock data including providers, subscriptions, resource groups and resources can be defined in JSON object and used to initialize the ArmManager.

```ts

import { ArmProxy } from "MsPortalFx-Mock/lib/src/ArmProxy/ArmProxy";
import { ArmManager } from "MsPortalFx-Mock/lib/src/ArmProxy/ArmManager";

...

const mockData: ArmManager.MockData = {
    providers: [
        {
            namespace: "Providers.Test",
            resourceTypes: [
                {
                    resourceType: "type1",
                    locations: ["WestUS"],
                    apiVersions: ["2014-04-01"]
                },
                {
                    resourceType: "type2",
                    locations: ["East US", "East US 2", "North Central US"],
                    apiVersions: ["2014-04-01"]
                }
            ]
        }
    ],
    subscriptions: [
        {
            subscriptionId: "sub1",
            displayName: "Test sub 1",
            state: "Active",
            subscriptionPolicies: {
                locationPlacementId: "Public_2014-09-01",
                quotaId: "FreeTrial_2014-09-01"
            },
            resourceGroups: [
                {
                    name: "sub1rg1",
                    location: "WestUS",
                    tags: {
                        "env": "prod",
                        "ver": "4.6"
                    },
                    properties: {
                        lockState: "Unlocked",
                        provisioningState: "Succeeded",
                    },
                    resources: [
                        {
                            name: "sub1rg1r1",
                            location: "WestUS",
                            tags: {
                                "env": "prod"
                            },
                            type: "providers.test/type1",
                            kind: null,
                            nestedResources: [
                                {
                                    name: "nr1",
                                    tags: {},
                                    type: "nested"
                                }
                            ]
                        }
                    ]
                },
                {
                    name: "sub1rg2",
                    location: "WestUS",
                    tags: {
                        "env": "prod",
                        "ver": "4.6"
                    },
                    properties: {
                        lockState: "Unlocked",
                        provisioningState: "Succeeded",
                    },
                    resources: [
                        {
                            name: "sub1rg2r1",
                            location: "WestUS",
                            tags: {
                                "env": "prod"
                            },
                            type: "providers.test/type2",
                            kind: null
                        }
                    ]
                }
            ]
        }
    ]
};

...

    let armManager = new ArmManager.Manager();
    armManager.initializeMockData(mockData);
    
```

The ArmProxy needs to initialized at the beginning of your tests with the ArmManager. The ArmProxy supports two modes for showing data 1) mock ONLY and 2) mock + actual.

You will need to initialize the portalContext->patches to the local server address setup by the proxy.

```ts

        return ArmProxy.create(nconf.get("armEndpoint"), 5000, armManager, null, true).then(proxy => {
            armProxy = proxy;
            testFx.portal.portalContext.patches = [proxy.patchAddress];
        });
        
```

The proxy can be disposed at the end of your tests.
```ts

        return testFx.portal.quit().then(() => ArmProxy.dispose(armProxy));
        
```


 
<a name="contributing"></a>
## Contributing

To enlist a contribution, use the following code.

`git clone https://github.com/azure/msportalfx-test.git`

Use Visual Studio or Visual Studio Code to build the source, as in the following code.

`Run ./scripts/Setup.cmd`

To setup the tests you need the following.

1. Create a dedicated test subscription that is used for tests only

1. Locate a user that has access to the test subscription only

1. Create an  AAD Application and service principal with access, as in the following code.

    ```powershell 
        msportalfx-test\scripts\Create-AdAppAndServicePrincipal.ps1 
            -TenantId "someguid" 
            -SubscriptionId "someguid" 
            -ADAppName "some ap name" 
            -ADAppHomePage "https://somehomepage" 
            -ADAppIdentifierUris "https://someidentiferuris" 
            -ADAppPassword $someAdAppPassword 
            -SPRoleDefinitionName "Reader" 
    ```

1. Run `setup.cmd` in the portal repo, or run run `powershell.exe -ExecutionPolicy Unrestricted -file "%~dp0\Setup-OneCloud.ps1" -DeveloperType Shell %*`. You will use the details of the created service principal in the next steps.  

**NOTE**: Store the password for the following procedures in **KeyVault**,  the secret store, or some other safe location. It is not retrieveable by using the commandlets. 

1. Open **test\config.json** and enter appropriate values for:

    ```
    "aadAuthorityUrl": "https://login.windows.net/TENANT_ID_HERE",
    "aadClientId": "AAD_CLIENT_ID_HERE",
    "subscriptionId": "SUBSCRIPION_ID_HERE",
    "subscriptionName": "SUBSCRIPTION_NAME_HERE",
    ```

1. The account that corresponds to the specified credentials should have at least contributor access to the subscription specified in the **config.json** file. The account must be a Live Id account. It cannot be an account that requires two factor authentication (like most @microsoft.com accounts). 

1. Install the Portal SDK from [http://aka.ms/portalfx/download](http://aka.ms/portalfx/download), then open Visual Studio and create a new Portal Extension from File --> New Project --> Azure Portal --> Azure Portal Extension. Name this project **LocalExtension** so that the extension itself is named LocalExtension, which is what many of the tests expect. Then click CTRL+F5 to host the extension in IIS Express.

1. The *Can Find Grid Row* and the *Can Choose A Spec* tests require special configuration described in the tests themselves.

1. Many of the tests currently rely on the CloudService extension. 

<!-- TODO: Determine whether the dependency has been removed."We are working to remove this dependency." -->

For more information about AAD Applications and Service Principals, see [https://aka.ms/portalfx/serviceprincipal](https://aka.ms/portalfx/serviceprincipal).  

 
<a name="running-test-scenarios"></a>
## Running Test Scenarios

Open a command prompt in this directory and run:

```
	npm install --no-optional
	npm test
```

For more information, see [https://stackoverflow.com/questions/20164398/how-does-npm-test-work](https://stackoverflow.com/questions/20164398/how-does-npm-test-work).

<!-- TODO:  The following is copied from the Stackoverflow article.  Retain the pieces that are not redundant.  -->

<a name="running-test-scenarios-how-to-use-npm-test-functions"></a>
### How to use npm test functions

***How does “npm test” work?***

DESCRIPTION: 
I always thought that the `npm test` command launched what I would write in `package.json` inside the scripts: `{ test: ...}` section. So, I have this piece of config in `package.json`.

```
"scripts": {
  "start": "node index.js",
  "test": "mocha tests/spec.js"
}
```

When I try to run tests with  `npm test`, I get the following error.

```
module.js:340
    throw err;
          ^
Error: Cannot find module 'commander'
```

But everything runs when I type `mocha tests/spec.js`. 

Also, I've tried to install `commander` and I get  an error `Cannot find module 'glob'`. After installing **glob**, the error changes to `Error: Cannot find module '../'`.

So, why am I getting these errors, and why is everything OK when running `mocha tests/spec.js`?

SOLUTION: You may also have two versions of **mocha** installed: one globally (npm install -g mocha) and one locally. The local install may be broken, but it can be fixed by removing it and reinstalling it with `--save-dev`, as in the following example.

```
rm -rf node_modules/mocha
npm install --save-dev mocha
```

That should provide a working local copy of mocha with all its dependencies, including **commander**. Make sure to add **commander** to your `package.json`.  It calls the command specified in the `scripts.test` property of `package.json`, but it also sets up certain environment variables, such as PATH so you can refer to commands that only exist within your `node_modules` directory, but are not installed globally.

When you run a script through npm, either as `npm run-script <name>` or with a defined shortcut like  `npm test` or `npm start`, the command needs to locate the test script in your file system. The test script is located in the current package directory's `bin` directory. The npm commands will prepend the current package directory's `bin` directory to the front of your path. For your package that's probably `./node_modules/.bin/`, which contains the link to your package's **mocha** executable script.

<a name="running-test-scenarios-generate-internal-documentation"></a>
### Generate internal documentation

<!-- TODO:  Determine whether this sentence is accurate.  If not, 
1)  Is there any documentation to generate
2)  Where will it be located after it is generated
3)  Are there any reminders while the code is being created that this 
    documentation should exist
-->

If there is documentation that should accompany your code, it should be generated  in a manner that includes it into the `.azpkg` file. This documentation is separate from the Azure documentation that is located at [http://aka.ms/portalfx/docs](http://aka.ms/portalfx/docs).

You can generate the documentation in one of two ways.

* Run the `docs` script from `package.json` to ensure that all docs are up to date as part of the packaging process.  Use the following command.

    ```
    npm pack
    ```

* While you are authoring docs, you may want to check that your composition or jsdoc for API ref is generating as expected.   Use the following command.

    ```
    npm run docs
    ```

    The output of the composed `TEMPLATE.md` file will be written to the `./README.md` file, and the generated API reference from your jsdocs will be written to `/docs/apiref.md`.
