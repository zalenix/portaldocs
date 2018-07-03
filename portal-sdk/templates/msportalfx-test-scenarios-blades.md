
## Blades

Topics about blade navigation are the following.

* [Common portal blades](#common-portal-blades)

* [Locating an open blade](#locating-an-open-blade)

* [Dialogs](#dialogs)

* [Blade navigation](#blade-navigation)

* * * 

### Common portal blades

There are several types of Portal blades that can be opened programmatically. There are also several API's available to make testing a common functionality within browse such as context menu commands and column picking functionality. 

* [Open the create blade](#open-the-create-blade)

* [Open the browse blade from your resource](#open-the-browse-blade-from-your-resource)

* [Open the resource summary blade](#open-the-resource-summary-blade)

* [Navigate to the spec picker blade](#navigate-to-the-spec-picker-blade)

* [Navigate to the Settings blade](#navigate-to-the-settings-blade)

* [Navigate to the Properties Blade](#navigate-to-the-properties-blade)

* [Navigate to the QuickStart blade](#navigate-to-the-quickstart-blade)

* [Navigate to the user access blade](#navigate-to-the-user-access-blade)

* [The Move Resource Blade](#the-move-resource-blade)

* * *

#### Open the create blade

For more information about opening the create blade, see [msportalfx-test-scenarios-create.md#opening-the-create-blade-from-a-deployed-gallery-package](msportalfx-test-scenarios-create.md#opening-the-create-blade-from-a-deployed-gallery-package).

#### Open the browse blade from your resource

To open/navigate to the Browse blade from resource type you can use `portal.openBrowseBlade`.  The returned promise will resolve with the browse blade. 

```ts
import testFx = require('MsPortalFx-Test');
...

        return testFx.portal.openBrowseBlade(resourceProvider, resourceType, resourceBladeTitle, 20000)
            .then((blade) => blade.filterItems(resourceName))
...
```

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
