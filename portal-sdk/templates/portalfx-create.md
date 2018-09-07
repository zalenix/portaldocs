{"gitdown": "contents"}

## Building create experiences

The Azure portal offers 3 ways to build a create form:

1. *[Deploy to Azure](portalfx-create-deploytoazure.md)*

    There are simple forms auto-generated from an ARM template with very basic controls and validation. Deploy to Azure is the quickest way to build a Create form and even integrate with the Marketplace, but is very limited in available validation and controls.

    Use [Deploy to Azure](portalfx-create-deploytoazure.md) for [community templates](https://azure.microsoft.com/documentation/templates) and simple forms.

2. *[Solution templates](https://github.com/Azure/azure-marketplace/wiki)*

    These are simple forms defined by a JSON document separate from the template. Solution templates can be used by any service, however there are some limitations on supported controls.

    Use [Solution templates](https://github.com/Azure/azure-marketplace/wiki) for IaaS-focused ARM templates.

3. *Custom create forms*

    These are fully customized forms built using TypeScript in an Azure portal extension. Most teams build custom create forms for full flexibility in the UI and validation. This requires developing an extension.

## Building custom create forms

### Create Marketplace package (aka Gallery package)
The Marketplace provides a categorized collection of packages which can be created in the portal. Publishing your package to the Marketplace is simple:

1. Create a package and publish it to the DF Marketplace yourself, if applicable. Learn more about [publishing packages to the Marketplace](../../gallery-sdk/generated/index-gallery.md).
1. Side-load your extension to test it locally.
1. Set a "hide key" before testing in production.
1. Send the package to the Marketplace team to publish it for production.
1. Notify the Marketplace team when you're ready to go live.

Note that the **+New** menu is curated and can change at any time based on C+E leadership business goals. Ensure documentation, demos, and tests use [Create from Browse](portalfx-browse.md) or [deep-links](portalfx-links.md) as the entry point.

![The +New menu][plus-new]

![The Marketplace][marketplace]

### Design for a single blade
All create experiences should be designed for a single blade. Start by building a template blade. Always prefer dropdowns over pickers (form fields that allow selecting items from a list in a child blade) and avoid using selectors (form fields that open child blades).

Email [ibizafxpm](mailto:ibizafxpm@microsoft.com?subject=Full-screen Create) if you have any questions about the current state of full-screen create experiences.

### Add a provider component
The [parameter collection framework](portalfx-parameter-collection-overview.md) is platform that enables you to build UX to collect data from the user. If you're not familiar with collectors and providers, now is a good time to read more about it.

In most cases, your blade will be launched from the Marketplace or a toolbar command (like Create from Browse). They will act as the collectors. Consequently, your blade will be expected to act as a provider. Here's what a provider looks like:

```ts
// Instantiate a parameter provider view model.
this.parameterProvider = new MsPortalFx.ViewModels.ParameterProvider<DataModel, DataModel>(container, {
    // This is where we receive the initial data defined in the UI definition file uploaded
    // with the gallery package. We'll use the data to seed the edit scope. This is the time
    // do do any necessary data transformations or account for incomplete inputs.
    mapIncomingDataForEditScope: (incoming) => {
        var dataModel: DataModel = {
            someProperty: ko.observable(incoming.someProperty || "")
        };
        return dataModel;
    },
    // This is where we transform the edit scope data to outputs. We're just returning the
    // data as it is, so no work needed here.
    mapOutgoingDataForCollector: (outgoing) => {
        return outgoing;
    }
});
```

### Add a provisioner component
A provisioner is another component in the [parameter collection framework](portalfx-parameter-collection-overview.md). If you're creating your resource by deploying a single template to ARM, you need to use an ARM provisioner. Otherwise, you need to use a regular provisioner to implement your custom deployment process.

1. ARM provisioning:
(Refer to the full EngineV3 sample to see the full create blade)

```ts
// Instantiate a ARM provisioner view model.
this.armProvisioner = new AzureResourceManager.Provisioner<DataModel>(container, initialState, {
    // This is where we supply the ARM provisioner with the template deployment options
    // required by the deployment operation.
    supplyTemplateDeploymentOptions: (data, mode) => {
        // Fill out the template deployment options.
        var templateDeploymentOptions: AzureResourceManager.TemplateDeploymentOptions = {
            subscriptionId: subscriptionId,
            resourceGroupName: resourceGroupName,
            resourceGroupLocation: resourceGroupLocation,
            parameters: {
                someProperty: data.someProperty()
            },
            deploymentName: galleryCreateOptions.deploymentName,
            resourceProviders: [resourceProvider],
            resourceId: resourceIdFormattedString,
            // For the deployment template, you can either pass a link to the template (the URI of the
            // template uploaded to the gallery service), or the actual JSON of the template (inline).
            // Since gallery package for this sample is on your local box (under Local Development),
            // we can't send ARM a link to template. We'll use inline JSON instead. This method returns
            // the exact same template as the one in the package. Once your gallery package is uploaded
            // to the gallery service, you can reference it as shown on the second line.
            templateJson: this._getTemplateJson(),
            // Or -> templateLinkUri: galleryCreateOptions.deploymentTemplateFileUris["TemplateName"],
        };
        return Q(templateDeploymentOptions);
    },

    // Optional -> supplyStartboardInfo: (data: DataModel) => ParameterCollection.StartboardInfo;
    // You can implement this callback if you want to supply different provisioning startboard
    // info. If not implemented, the provisioner will use the info defined in the UI definition
    // file in the gallery package. This is what we're doing here (preferable).

    // Supplying an action bar and a parameter provider allows for automatic provisioning.
    actionBar: this.actionBar,
    parameterProvider: this.parameterProvider,

    // Add create features such as opting in for ARM preflight validation. You can OR multiple
    // features together.
    createFeatures: CreateFeatures.EnableArmValidation
});
```

2. Custom provisioning:
(Refer to the full RobotV3 sample to see the full create blade)
```ts
// Instantiate a provisioner view model.
this.provisioner = new ParameterCollection.Provisioner<DataModel>(container, {
    // This is where we supply the provisioner with the provisioning operation.
    supplyProvisioningPromise: (data) => {
        return this._dataContext.createMyResource(data).then(() => {
            // Raise a notification, if needed.
            // MsPortalFx.UI.NotificationManager.create(...).raise(...);

            // Resolve the final promise with the container model for the startboard part.
            // This is an object that contains the inputs to that part.
            return {
                // In this case, the startboard has one input called "id" (which is also
                // the "startboardPartKeyId" on the startboardInfo object), and takes the
                // name of the robot as the value.
                id: data.someProperty()
            };
        });
    },

    // Implement this callback if you want to supply different provisioning startboard info.
    supplyStartboardInfo: (data) => {
        return robotStartboardInfo;
    },

    // Supplying an action bar and a parameter provider allows for automatic provisioning.
    actionBar: this.actionBar,
    parameterProvider: this.parameterProvider
});
```

### Build your form
Use built-in form fields, like TextField and DropDown, to build your form the way you want. Use the built-in EditScope integration to manage changes and warn customers if they leave the form.

```ts
// The parameter provider takes care of instantiating and initializing an edit scope for you,
// so all we need to do is point our form's edit scope to the parameter provider's edit scope.
this.editScope = this.parameterProvider.editScope;
```
Learn more about [building forms](portalfx-forms.md).

### Standard ARM fields
All ARM subscription resources require a subscription, resource group, location and pricing dropdown. The portal offers built-in controls for each of these. Refer to the EngineV3 Create sample (`SamplesExtension\Extension\Client\Create\EngineV3\ViewModels\CreateEngineBladeViewModel.ts`) for a working example.
### Setting the value
Each of these fields will retrieve values from the server and populate a dropdown with them. If you wish to set the value of these dropdowns, make sure to lookup the value from the `fetchedValues` array, and then set the `value` observable.
```ts
locationDropDown.value(locationDropDown.fetchedValues().first((value)=> value.name === "centralus"))
```

### Edit scopeless based accessible dropdowns
#### Subscriptions dropdown
```ts
import * as SubscriptionDropDown from "Fx/Controls/SubscriptionDropDown";
```
{"gitdown": "include-section", "file": "../Samples/VS/PT/Default/Extension/Client/Resource/Create/ViewModels/CreateBlade.ts", "section": "config#subscriptionDropDown"}

#### Resource groups dropdown
```ts
import * as ResourceGroupDropDown from "Fx/Controls/ResourceGroupDropDown";
```
{"gitdown": "include-section", "file": "../Samples/VS/PT/Default/Extension/Client/Resource/Create/ViewModels/CreateBlade.ts", "section": "config#resourceGroupDropDown"}
#### Locations dropdown
```ts
import * as LocationDropDown from "Fx/Controls/LocationDropDown";
```
{"gitdown": "include-section", "file": "../Samples/VS/PT/Default/Extension/Client/Resource/Create/ViewModels/CreateBlade.ts", "section": "config#locationDropDown"}

### ARM dropdown options
Each ARM dropdown can disable, hide, group, and sort.
 
#### Disable
This is the preferred method of disallowing the user to select a value from ARM. The disable callback will run for each fetched value from ARM. The return value of your callback will be a reason for why the value is disabled. If no reason is provided, then the value will not be disabled. This is to ensure the customer has information about why they can’t select an option, and reduces support calls.
{"gitdown": "include-section", "file": "../../../src/SDK/Framework.Tests/TypeScript/Tests/Controls/Forms/DropDown.Resource.test.ts", "section": "config#disable"}
When disabling, the values will be displayed in groups with the reason they are disabled as the group header. Disabled groups will be placed at the bottom of the dropdown list.
 
#### Hide
This is an alternative method of disallowing the user to select a value from ARM. The hide callback will run for each fetched value from ARM. The return value of your callback will return a boolean for if the value should be hidden. If you choose to hide, a message telling the user why some values are hidden is required.
{"gitdown": "include-section", "file": "../../../src/SDK/Framework.Tests/TypeScript/Tests/Controls/Forms/DropDown.Resource.test.ts", "section": "config#hide"}

##### Note on Hide
It's recommended to use the `disable` option so you can provide scenario-specific detail as to why a given dropdown value is disabled, and customers will be able to see that their specific desired value is not available. Disabling is preferable to hiding, as users often react negatively when they cannot visually locate their expected dropdown value.  In extreme cases, this can trigger incidents with your Blade.

#### Group
This is a way for you to group values in the dropdown. The group callback will take a value from the dropdown and return a display string for which group the value should be in. If no display string or an empty string is provided, then the value will default to the top level of the group dropdown.
 
If you want to sort the groups (not the values within the group), you can supply the 'sort' option, which should be a conventional comparator function that determines the sort order by returning a number greater or less than zero. It defaults to alphabetical sorting.
 
{"gitdown": "include-section", "file": "../../../src/SDK/Framework.Tests/TypeScript/Tests/Controls/Forms/DropDown.Resource.test.ts", "section": "config#group"}
 
If you both disable and group, values which are disabled will be placed under the disabled group rather than the grouping provided in this callback.
 
#### Sort
If you want to sort values in the dropdown, supply the 'sort' option, which should be a convention comparator function that returns a number greater or less than zero. It defaults to alphabetical based on the display string of the value.
 
{"gitdown": "include-section", "file": "../../../src/SDK/Framework.Tests/TypeScript/Tests/Controls/Forms/DropDown.Resource.test.ts", "section": "config#sort"}
 
If you sort and use disable or group functionality, this will sort inside of the groups provided.

### Edit scope based accessible dropdowns
### Migrating from legacy ARM dropdowns to Accessible versions
For scenarios where your Form is built in terms of EditScope, the FX now provides versions of the new, accessible ARM dropdowns that are drop-in replacements for old, non-accessible controls.  These have minimal API changes and are simple to integrate into existing Blades/Parts.

These dropdowns are, however, based on a new accessible control which no longer support the following options.

- `cssClass` - no alternative
- `dropDownWidth` - no alternative
- `filterOptions` - no alternative
- `hideValidationCheck` - no alternative
- `iconLookup` - no alternative
- `iconSize` - no alternative
- `infoBalloonContent` - no alternative
- `inputAlignment` - no alternative
- `labelPosition` - The `label` option accepts html
- `options` - no alternative
- `popupAlignment` - no alternative
- `showValidationMessagesBelowControl` - no alternative
- `subLabel` - The `label` option accepts html
- `subLabelPosition` - The `label` option accepts html
- `telemetryKeys` - no alternative
- `viewModelValueChangesAreClean` - no alternative
- `visible` - use the `visible` binding in your html template

#### Subscriptions dropdown
In your current EditScope-based form, your Subscription dropdown looks something like this:
```ts
import SubscriptionsDropDown = MsPortalFx.Azure.Subscriptions.DropDown;
// The subscriptions drop down.
var subscriptionsDropDownOptions: SubscriptionsDropDown.Options = {
    options: ko.observableArray([]),
    form: this,
    accessor: this.createEditScopeAccessor((data) => {
        return data.subscription;
    }),
    validations: ko.observableArray<MsPortalFx.ViewModels.Validation>([
        new MsPortalFx.ViewModels.RequiredValidation(ClientResources.selectSubscription)
    ]),
    // Providing a list of resource providers (NOT the resource types) makes sure that when
    // the deployment starts, the selected subscription has the necessary permissions to
    // register with the resource providers (if not already registered).
    // Example: Providers.Test, Microsoft.Compute, etc.
    resourceProviders: ko.observable([resourceProvider]),
    // Optional -> You can pass the gallery item to the subscriptions drop down, and the
    // the subscriptions will be filtered to the ones that can be used to create this
    // gallery item.
    filterByGalleryItem: this._galleryItem
};
this.subscriptionsDropDown = new SubscriptionsDropDown(container, subscriptionsDropDownOptions);
```

With the new, accessible Subscription dropdown, you'll change your code to look something like:
```ts
import * as SubscriptionDropDown from "FxObsolete/Controls/SubscriptionDropDown";
```
{"gitdown": "include-section", "file": "../../../src/SDK/AcceptanceTests/Extensions/SamplesExtension/Extension/Client/V1/Create/EngineV3/ViewModels/CreateEngineBladeViewModel.ts", "section": "config#subscriptionDropDown"}

#### Resource groups **legacy** dropdown
In your current EditScope-based form, your Resource Group dropdown looks something like this:
```ts
import ResourceGroupsDropDown = MsPortalFx.Azure.ResourceGroups.DropDown;
// The resource group drop down.
var resourceGroupsDropDownOptions: ResourceGroups.DropDown.Options = {
    options: ko.observableArray([]),
    form: this,
    accessor: this.createEditScopeAccessor((data) => {
        return data.resourceGroup;
    }),
    label: ko.observable<string>(ClientResources.resourceGroup),
    subscriptionIdObservable: this.subscriptionsDropDown.subscriptionId,
    validations: ko.observableArray<MsPortalFx.ViewModels.Validation>([
        new MsPortalFx.ViewModels.RequiredValidation(ClientResources.selectResourceGroup),
        new MsPortalFx.Azure.RequiredPermissionsValidator(requiredPermissionsCallback)
    ]),
    // This is no longer supported. Set the `value` option to initial desired value
    defaultNewValue: "NewResourceGroup",
    // Optional -> RBAC permission checks on the resource group. Here, we're making sure the
    // user can create an engine under the selected resource group, but you can add any actions
    // necessary to have permissions for on the resource group.
    requiredPermissions: ko.observable({
        actions: actions,
        // Optional -> You can supply a custom error message. The message will be formatted
        // with the list of actions (so you can have {0} in your message and it will be replaced
        // with the array of actions).
        message: ClientResources.enginePermissionCheckCustomValidationMessage.format(actions.toString())
    })
};
this.resourceGroupDropDown = new ResourceGroups.DropDown(container, resourceGroupsDropDownOptions);
```

With the new, accessible Resource Group dropdown, you'll change your code to look something like:
```ts
import * as ResourceGroupDropDown from "FxObsolete/Controls/ResourceGroupDropDown";
```
{"gitdown": "include-section", "file": "../../../src/SDK/AcceptanceTests/Extensions/SamplesExtension/Extension/Client/V1/Create/EngineV3/ViewModels/CreateEngineBladeViewModel.ts", "section": "config#resourceGroupDropDown"}

#### Locations **legacy** dropdown
In your current EditScope-based form, your Location dropdown looks something like this:
```ts
import LocationsDropDown = MsPortalFx.Azure.Locations.DropDown;
// The locations drop down.
var locationsDropDownOptions: LocationsDropDown.Options = {
    options: ko.observableArray([]),
    form: this,
    accessor: this.createEditScopeAccessor((data) => {
        return data.location;
    }),
    subscriptionIdObservable: this.LocationDropDown.subscriptionId,
    resourceTypesObservable: ko.observable([resourceType]),
    validations: ko.observableArray<MsPortalFx.ViewModels.Validation>([
        new MsPortalFx.ViewModels.RequiredValidation(ClientResources.selectLocation)
    ])
    // Optional -> This is no longer supported. Use the `disable` option (illustrated below).
    // filter: {
    //     allowedLocations: {
    //         locationNames: [ "centralus" ],
    //         disabledMessage: "This location is disabled for demo purporses (not in allowed locations)."
    //     },
    //     OR -> disallowedLocations: [{
    //         name: "westeurope",
    //         disabledMessage: "This location is disabled for demo purporses (disallowed location)."
    //     }]
    // }
};
```

With the new, accessible Location dropdown, you'll change your code to look something like:
```ts
import * as LocationDropDown from "FxObsolete/Controls/LocationDropDown";
```
{"gitdown": "include-section", "file": "../../../src/SDK/AcceptanceTests/Extensions/SamplesExtension/Extension/Client/V1/Create/EngineV3/ViewModels/CreateEngineBladeViewModel.ts", "section": "config#locationDropDown"}

#### Pricing dropdown
```ts
*`MsPortalFx.Azure.Pricing.DropDown`

import * as Specs from "Fx/Specs/DropDown";
```
{"gitdown": "include-section", "file": "../../../src/SDK/AcceptanceTests/Extensions/SamplesExtension/Extension/Client/V1/Create/EngineV3/ViewModels/CreateEngineBladeViewModel.ts", "section": "config#specDropDown"}

#### Additional/custom validation to the ARM fields
Sometimes you need to add extra validation on any of the previous ARM fields. For instance, you might want to check with you RP/backend to make sure that the selected location is available in certain cirqumstances. To do that, just add a custom validator like you would do with any regular form field. Exmaple:

```ts
// The locations drop down.
var locationCustomValidation = new MsPortalFx.ViewModels.CustomValidation(
    validationMessage,
    (value) => {
        return this._dataContext.validateLocation(value).then((isValid) => {
            // Resolve with undefined if 'value' is a valid selection and with an error message otherwise.
            return MsPortalFx.ViewModels.getValidationResult(!isValid && validationMessage || undefined);
        }, (error) => {
            // Make sure your custom validation never throws. Catch the error, log the unexpected failure
            // so you can investigate later, and fail open.
            logError(...);
            return MsPortalFx.ViewModels.getValidationResult();
        });
    });
var locationsDropDownOptions: LocationsDropDown.Options = {
    ...,
    validations: ko.observableArray<MsPortalFx.ViewModels.Validation>([
        new MsPortalFx.ViewModels.RequiredValidation(ClientResources.selectLocation),
        locationCustomValidation // Add your custom validation here.
    ])
    ...
};
this.locationsDropDown = new LocationsDropDown(container, locationsDropDownOptions);
```

#### Wizards
The Azure portal has a **legacy pattern** for wizard blades, however customer feedback and usability has proven the design
isn't ideal and shouldn't be used. Additionally, the wizard wasn't designed for
[Parameter Collector v3](portalfx-parameter-collection-getting-started.md), which leads to a more
complicated design and extended development time. The Portal Fx team is testing a new design for wizards to address
these issues and will notify teams once usability has been confirmed and APIs updated. Wizards are discouraged and will
not be supported.

Email [ibizafxpm](mailto:ibizafxpm@microsoft.com?subject=Create wizards + full screen) if you have any questions about
the current state of wizards and full-screen Create support.

### Validation
Create is our first chance to engage with and win customers and every hiccup puts us at risk of losing customers; specifically
new customers. As a business, we need to lead that engagement on a positive note by creating resources quickly and easily.
When a customer clicks the Create button, it should succeed. This includes all types of errors – from
using the wrong location to exceeding quotas  to unhandled exceptions in the backend. [Adding validation to your form fields](portalfx-forms-field-validation.md)
will help avoid failures and surface errors before deployment.

In an effort to resolve Create success regressions as early as possible, sev 2 [ICM](http://icm.ad.msft.net) (internal only)
incidents will be created and assigned to extension teams whenever the success rate
drops 5% or more for 50+ deployments over a rolling 24-hour period.

#### ARM template deployment validation
If your form uses the ARM provisioner, you need to opt in to deployment validation manually by adding
`CreateFeatures.EnableArmValidation` to the `HubsProvisioner<T>` options. Wizards are not currently supported; we are
working on a separate solution for wizards. Email [ibizafxpm](mailto:ibizafxpm@microsoft.com?subject=Create wizards + deployment validation)
if you have any questions about wizard support.

```ts
 this.armProvisioner = new HubsProvisioner.HubsProvisioner<DeployFromTemplateDataModel>(container, initialState, {
    supplyTemplateDeploymentOptions: this._supplyProvisioningPromise.bind(this),
    actionBar: this.actionBar,
    parameterProvider: this.parameterProvider,
    createFeatures: Arm.Provisioner.CreateFeatures.EnableArmValidation
});
```

Refer to the Engine V3 sample for a running example
- Client\Create\EngineV3\ViewModels\CreateEngineBladeViewModel.ts
- [http://aka.ms/portalfx/samples#create/microsoft.engine](http://aka.ms/portalfx/samples#create/microsoft.engine)

### Automation options
If your form uses the ARM provisioner, you will get an "Automation options" link in the action bar by default. This link
gets the same template that is sent to ARM and gives it to the user. This allows customers to automate the creation of
resources via CLI, PowerShell, and other supported tools/platforms. Wizards are not currently supported; we are working
on a separate solution for wizards.

Email [ibizafxpm](mailto:ibizafxpm@microsoft.com?subject=Create wizards + automation options)
if you have any questions about wizard support.

### Testing
Due to the importance of Create and how critical validation is, all Create forms should have automated testing to help
avoid regressions and ensure the highest possible quality for your customers. Refer to [testing guidance](portalfx-test.md)
for more information on building tests for your form.

### Feedback

When customers leave the Create blade before submitting the form, the portal asks for feedback. The feedback is stored
in the standard [telemetry](portalfx-telemetry.md) tables. Query for
`source == "FeedbackPane" and action == "CreateFeedback"` to get Create abandonment feedback.


### Telemetry

Refer to [Create telemetry](/portal-sdk/generated/index-portalfx-extension-monitor.md#portalfx-telemetry-create) for additional information on usage dashboards and queries.

### Troubleshooting

Refer to the [troublshooting guide](portalfx-create-troubleshooting.md) for additional debugging information.


### Additional topics

#### Initiating Create from other places
Some scenarios may require launching your Create experience from outside the +New menu or Marketplace. The following
are supported patterns:

* **From a command using the ParameterCollectorCommand** -- "Add Web Tests" command from the "Web Tests" blade for a web app
* **From a part using the SetupPart flow** -- "Continuous Deployment" setup from a web app blade

![Create originating from blade part][create-originating-from-blade-part]


[create-originating-from-blade-part]: ../media/portalfx-create/create-originating-from-blade-part.png
[plus-new]: ../media/portalfx-create/plus-new.png
[marketplace]: ../media/portalfx-ui-concepts/gallery.png
