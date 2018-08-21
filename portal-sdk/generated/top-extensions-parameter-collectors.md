
<a name="parameter-collection"></a>
# Parameter Collection

<a name="parameter-collection-overview"></a>
## Overview

The Parameter Collection Framework provides the platform and building blocks for user experiences that collect data from the user. The sequence of UI elements consists of forms, wizards, pickers, buttons, commands, and other elements,  and are referred to as parameter collection flows. The framework simplifies the development of flows and enables  developers to focus on extension business logic.

Parameter collection is a dialog process between two entities.  The collector asks the provider a question and expects it to return some data. The provider can also behave as a collector if it collects data from a third entity, and so on. The following diagram illustrates this process.

![alt-text](../media/portalfx-parameter-collection-overview/collectorsAndProviders.png "Parameter Collectors and Providers")

This series of dialogs can also be perceived as a tree, where the root node is the initial point where the dialog starts.  The root node can  behave only as a collector.  Leaf nodes can  behave only as providers that return data up the tree to the appropriate collector. Inner nodes are both collectors and providers, because they request data from other providers, and return it to  the collector that requested the data. Parameter Collection framework simplifies the internal communication between these pieces.

There are three roles in the Parameter Collection Framework.  The primary roles of collector and provider have already been described. The role of provisioner is a secondary role. If a UI element provisions a  specific  action, then its `ViewModel` has a provisioner role. You can implement custom provisioning logic, or you can leverage the default Framework logic if the provisioning action creates resources by using ARM, as specified in   [http://aka.ms/portalfx/gallerycreate](http://aka.ms/portalfx/gallerycreate).

A `ViewModel` can play more than one role. Depending on the UI element, specific roles are either optional or required. You will define the roles that the `ViewModel`  and its UI element can play, and develop the logic that will be executed when the UI element is performing that role. 

The framework provides interfaces, base classes, and blade templates to simplify implementation. It includes classes for forms, wizards, pickers, buttons, commands, and other items that the `ViewModel` will extend. The framework also includes PDL templates that correspond to each object that the extension will display on the UI. To implement any of the roles, create a class that extends the corresponding interface, and send an instance of that role implementation to the base class in your constructor.

<!-- TODO: Determine whether the following sections were ever written.   -->

<a name="parameter-collection-more-details"></a>
## More details
* *Inputs and Outputs:* More details about inputs, outputs and communication between the UI elements.
* *Role Implementation:* More details about how to implement roles.
* *Base Classes:* More details about base classes and PDL templates.
* PCv2 (Obsolete), located at [portalfx-parameter-collection-v2.md](portalfx-parameter-collection-v2.md).



<a name="parameter-collection-parameter-collection-procedures"></a>
## Parameter collection procedures

Implementing a parameter collection flow requires two distinct components.

* [Parameter Collector](#parameter-collector)
    
    Opens a child blade, sends initial data to it, and may later receive completed data from the child blade.

* [Parameter Provider](#parameter-provider)

    Receives parameters from its parent blade, then sends a result object to the parent blade and closes the child blade when the user clicks on an action bar.

The following scenario demonstrates code that specifies a  `ParameterCollector` and the associated `ParameterProvider`.

**NOTE**: In this discussion, `<dir>` is the `SamplesExtension\Extension\` directory, and  `<dirParent>`  is the `SamplesExtension\` directory, based on where the samples were installed when the developer set up the SDK. 

<a name="parameter-collection-parameter-collection-procedures-parameter-collector"></a>
### Parameter collector

<!-- TODO: Determine how data is sent if the EditScope is being deprecated. -->

Parameter collectors use the `openBlade` APIs to open provider blades.  They send provider configuraton and initial data, and receive back the results from a parameter provider blade by configuring the compiler-generated blade reference.

To open a parameter provider blade, perform the following steps.

1. Import the compiler generated blade reference, as in the following code.

    ```ts
    import { ParameterProviderAsTemplateBladeReference } from "../../../../_generated/BladeReferences";
    ```

1.  To send initial data to the provider and optionally receive a result, you can specify callbacks during the initialization of the provider blade reference.  Create a new instance of the blade reference and configure it for parameter collection, as in the following code.

    ```ts
            const providerReference = new ParameterProviderAsTemplateBladeReference<DataModels.ServerConfig, DataModels.ServerConfig>({
                supplyInitialData: () => {
                    return {
                        diskSpaceBytes: ko.observable(108 * 1024 * 1024 * 1024),
                        serverName: ko.observable(ClientResources.parameterProviderDefaultServerName)
                    };
                },
                receiveResult: (result) => {
                    // A realistic parameter collector command would commence some operation on
                    // receiving data. For this sample we have nothing particular to commence,
                    // so we just show a notification to demonstrate that data was received.
                    MsPortalFx.Hubs.Notifications.ClientNotification.publish({
                        title: ClientResources.parameterCollectorReceivedResultNotificationTitle,
                        description: ClientResources.parameterCollectorReceivedResultNotificationMessage.format(ko.toJS(result)),
                        status: MsPortalFx.Hubs.Notifications.NotificationStatus.Success
                    });
                }
            });
    ```

    The signatures of the options that can be sent to the `ParameterCollector` constructor are as follows.

    * **supplyInitialData? (): TResult**: A callback that sends the initial data for the parameter provider in the child blade each time it opens.  The object that is received by the parameter provider is a  deep clone of the value that you specify, instead of the original instance, because it is sent and sometimes stored in a serialized form.

        @return Initial data for the child blade.

    * **receiveResult? (result: TResult): void**: A callback to be invoked when the child blade sends a result and closes.

        @param result The result given by the child blade.

    * **supplyProviderConfig? (): any**: A callback that sends additional configuration options for the provider each time it opens. It is used to send non-editable data, for example configuring how a form will be displayed. 

        @return Arbitrary configuration options for the child blade.

    * **FormFieldValueAccessor?: FormFieldValueAccessors<TResult>**: Integrates a parameter collector with an `EditScope`. The collector sends the initial data to the provider from this `EditScope` property, and automatically inserts the provider's output into this `EditScope` property. Consequently, the  parameter collector behaves as an editor for the specified `EditScope` property.

    **NOTE**: If the extension uses the **FormFieldValueAccessor** option, then do not specify either the  **supplyInitialData** or the **receiveResult** options.

1. Invoke one of the four `openBlade` APIs as specified in [top-blades-opening-and-closing.md#open-blade-methods](top-blades-opening-and-closing.md#open-blade-methods). The methods are `openBlade`, `openBladeAsync`, `openContextBlade`, and `openContextBladeAsync`.

<a name="parameter-collection-parameter-collection-procedures-parameter-provider"></a>
### Parameter provider

Typically a parameter provider blade is opened in a either an `fxclick` handler or in an `onClick` callback, as in the following example.

```ts
    public onClick() {
        this._container.openBlade(providerReference);
    }
```

To define a parameter provider, locate the target blade in the `BladeAction` that previously contained a `ParameterCollector` property. Apply the `ParameterProvider` attribute to the `Part`, as in the following example.  

```xml
<Blade Name="ParameterProviderFormBlade" ViewModel="{...}">
	<Lens Name="ParameterProviderFormLens">
  		<CustomPart Name="ParameterProviderFormPart"
					ViewModel="..."
					Template="{Html Source='Templates\\ParameterProviderForm.html'}"
              		InitialSize="HeroWideFitHeight"
					ParameterProvider="true">
  		</CustomPart>
	</Lens>

	<ActionBar ActionBarKind="Create" />
</Blade>
```

The `ParameterProvider` property specifies that this part is a provider, and that a property named `parameterProvider` exists on the `ViewModel`.  This part receives initial data from the collector when it is provided, and returns a completed result.

In the `ViewModel` definition, the `parameterProvider` attribute is defined as a property of type `ParameterProvider<TResult, TEditScope>` on `ParameterProviderFormPartViewModel`. To ensure that the provider and the collector can exchange data, the `TResult` generic type on the provider matches the `TResult` generic type on the collector, as in the following code that specifies   a  `TResult` type named `ServerConfig` and  a `TEditScope` type named  `ServerFormData`.

**NOTE**: In this example, the types are structurally different, although in many scenarios `TResult` and `TEditScope` can be the same type.

```ts
export class ParameterProviderFormPartViewModel extends MsPortalFx.ViewModels.Forms.Form.ViewModel<ProviderModels.ServerConfig> {

    public parameterProvider: MsPortalFx.ViewModels.ParameterProvider<ProviderModels.ServerConfig, ProviderModels.ServerFormData>;

    constructor(container: MsPortalFx.ViewModels.PartContainerContract,
    			initialState: any,
    			dataContext: ParameterCollectionArea.DataContext) {
		...
    }
	...
}
```

<a name="parameter-collection-parameter-collection-procedures-parameter-provider-send-data-to-and-from-the-provider"></a>
#### Send data to and from the provider

Two required callbacks are specified in the constructor options when the `ParameterProvider` is initialized. They are **mapIncomingDataForEditScope** and **mapOutgoingDataForCollector**, and they map between the `TResult` and the `TEditScope`.  

* Data that the provider receives

    The data of type `ServerConfig (TResult)` that the collector sends to the  provider is mapped to type `ServerFormData (TEditScope)` for the form's `EditScope` by using callback **mapIncomingDataForEditScope**. 

* Data that the provider sends

    When the user clicks `Ok` on the `Create ActionBar` to close the provider blade, the **mapOutgoingDataForCollector** callback maps the form data of type `ServerFormData (TEditScope)` to the data of type `ServerConfig(TResult)`.  This allows the collector to receive the data in the  `receiveResult` callback.

Consequently, the `ParameterProvider` can  be initialized as follows.

```ts
export class ParameterProviderFormPartViewModel extends MsPortalFx.ViewModels.Forms.Form<ProviderModels.ServerConfig> {

    public parameterProvider: MsPortalFx.ViewModels.ParameterProvider<ProviderModels.ServerConfig, ProviderModels.ServerFormData>;

    constructor(container: MsPortalFx.ViewModels.PartContainerContract,
    			initialState: any,
    			dataContext: ParameterCollectionArea.DataContext) {

        super(container);

        this.parameterProvider = new MsPortalFx.ViewModels.ParameterProvider<ProviderModels.ServerConfig, ProviderModels.ServerFormData>(container, {
            mapIncomingDataForEditScope: (incoming: ProviderModels.ServerConfig): ProviderModels.ServerFormData => {
                // Collectors are not required to supply complete initial data, so
                // providers must always fill in anything that is missing with defaults.
                incoming = incoming || <ProviderModels.ServerConfig>{};
                incoming.serverName = incoming.serverName || ko.observable("");
                incoming.diskSpaceBytes = incoming.diskSpaceBytes || ko.observable(defaultDiskSpace);

                return {
                    serverIdentifier: incoming.serverName,
                    fixedStorageGigabytes: ko.observable(incoming.diskSpaceBytes() / bytesPerGigabyte)
                };
            },

            mapOutgoingDataForCollector: (outgoing: ProviderModels.ServerFormData): ProviderModels.ServerConfig => {
                return {
                    serverName: outgoing.serverIdentifier,
                    diskSpaceBytes: ko.observable(outgoing.fixedStorageGigabytes() * bytesPerGigabyte)
                };
            }
        });

        // Use the form to edit the edit scope set up by the provider
        this.editScope = this.parameterProvider.editScope;

        this.serverIdentifierTextBox = new MsPortalFx.ViewModels.Forms.TextBox(container, this, "serverIdentifier");
        this.fixedStorageSlider = new MsPortalFx.ViewModels.Forms.Slider(container, this, "fixedStorageGigabytes", { min: ko.observable(50), max: ko.observable(1000) });
    }

    public serverIdentifierTextBox: MsPortalFx.ViewModels.Forms.TextBox;
    public fixedStorageSlider: MsPortalFx.ViewModels.Forms.Slider;
}

```

The signatures of the options that can be sent to the `ParameterProvider` constructor are as follows.

* **mapIncomingDataForEditScope?(dataFromCollector: TResult): TEditScope**: A required callback that contains the initial data for the provider's `EditScope`. This callback  accounts for the possibility that  the collector might send incomplete information, or send no information,  by returning the complete initial state for the `EditScope`.

    @param dataFromCollector The incoming initial data from the collector, or null if the collector did not send any data.

    @return the requested initial `EditScope` data.

* **mapIncomingDataForEditScopeAsync?(dataFromCollector: TResult): Base.PromiseV<TEditScope>**: A required, asynchronous callback that contains the initial data for the provider's `EditScope`. This callback accounts for the possibility  that  the collector might send incomplete information, or send no information, by returning the complete initial state for the `EditScope`.

    @param dataFromCollector The incoming initial data from the collector, or null if the collector did not send any data.

    @return The requested initial `EditScope` data.

* **editScopeMetadataType?: string**: The metadata type that corresponds to the `TResult` generic parameter. This is used to configure the `EditScope`.

* **mapOutgoingDataForCollector(editScopeData: TEditScope): TResult**:     A mapping function that converts outgoing data from the provider's `EditScope` into the format to send to the colector.

    Note that the object received by the parameter collector will be a deep clone of the value you give, rather than the original instance, because it is passed in a serialized form.

    @param editScopeData The data currently held by the parameter provider.
    @return The data that should be returned to the calling parameter collector.


* **commitResult? (editScopeData: TEditScope): void**: 	A callback invoked when the user dismisses the provider. If you need to begin a provisioning operation that adds a startboard part and collapses the current journey, you can do so in this callback. You should not commence any other server-side operation from this callback, because the blade will have closed before it completes, so the user would not be able to see the result.

	@param editScopeData The data stored in the provider's `EditScope`.

You can specify the `commitResult` callback for scenarios that invoke a provisioning operation that adds a startboard part and collapses the current journey when the provider is dismissed.


The full source of this ParameterProvider implementation can be found within the SamplesExtension under SamplesExtension\Extension\Client\ParameterCollection\ParameterProviders.

<a name="parameter-collection-implementing-a-parameter-collector-using-pdl-not-recommended"></a>
## Implementing a Parameter Collector using PDL (not recommended)

To define a Parameter Collector the 'ParameterCollector' attribute is applied in PDL to the BladeAction that is responsible for launching your parameter provider blade

```xml
<Lens Name="PartLens">
  <Part PartKind="Button"
        Name="ParameterCollectorButton"
        ViewModel="{ViewModel Name=CollectorButtonViewModel,
        	Module=./CollectorAsButtonPart/ViewModels/CollectorButtonViewModel}" >

    <BladeAction Blade="ParameterProviderFormBlade"
    			 ParameterCollector="serverConfigCollector" />

  </Part>
</Lens>
```

Here the ParameterCollector property indicates which model property is responsible for sending initial data and receiving back a completed result. This attribute may only be used when the target blade contains a part marked with the 'ParameterProvider' attribute. Note that you can also specify additional BladeInput parameters if required.

Continuing with this example serverConfigCollector now needs to be defined as a property of type ParameterCollector<TResult> on CollectorButtonViewModel. So that the ParameterCollector and ParameterProvider can exchange data the TResult generic type must match the TResult generic type used on the parameter provider model.  In this scenario we're define a simple model called ServerConfig and declare our property:


```ts
export class CollectorButtonViewModel extends MsPortalFx.ViewModels.ButtonPart {

    public serverConfigCollector: MsPortalFx.ViewModels.ParameterCollector<ProviderModels.ServerConfig>;

    constructor(container: MsPortalFx.ViewModels.PartContainerContract,
    			initialState: any,
    			dataContext: ParameterCollectionArea.DataContext) {
		...
    }
}

```

To send initial data to the provider and optionally receive a result back you can specify callbacks during initialization of the ParameterCollector.

```ts
export class CollectorButtonViewModel extends MsPortalFx.ViewModels.ButtonPart {

    public serverConfigCollector: MsPortalFx.ViewModels.ParameterCollector<ProviderModels.ServerConfig>;

    constructor(container: MsPortalFx.ViewModels.PartContainerContract,
    			initialState: any,
    			dataContext: ParameterCollectionArea.DataContext) {

        super();

        this.serverConfigCollector = new MsPortalFx.ViewModels.ParameterCollector<ProviderModels.ServerConfig>(container, {
            supplyInitialData: () => {
                return {
                    diskSpaceBytes: ko.observable(108 * 1024 * 1024 * 1024),
                    serverName: ko.observable(ClientResources.parameterProviderDefaultServerName)
                };
            },
            receiveResult: (result: ProviderModels.ServerConfig) => {
                // A realistic parameter collector command would commence some operation on
                // receiving data. For this sample we have nothing particular to commence,
                // so we just show a notification to demonstrate that data was received.
                MsPortalFx.UI.NotificationManager
                    .create(ExtensionDefinition.NotificationDefinitions.ParameterCollectorReceivedResultNotification.name)
                    .raise(ExtensionDefinition.NotificationDefinitions.ParameterCollectorReceivedResultNotification.succeeded, null, ko.toJS(result));
            }
        });

        this.title(ClientResources.openProviderBlade);
    }
}
```

The complete list of supported options that can be sent to the ParameterCollector constructor are defined  with the following signatures:

- **supplyInitialData? (): TResult**

    A callback that sends initial data for the parameter provider in the child blade each time it opens.

    Note that the object received by the parameter provider will be a
    deep clone of the value you give, rather than the original instance,
    because it is passed (and sometimes stored) in a serialized form.
    @return Initial data for the child blade.

- **receiveResult? (result: TResult): void**

	A callback to be invoked when the child blade sends a result and closes.
	@param result The result given by the child blade.


- **selectable?: Selectable<any>**

	The selectable associated with the same <BladeAction> as this parameter collector. The parameter collector will send initial data to the child blade when this becomes selected.

	If not specified, this defaults to container.selectable (so it works with selectable parts without configuration).


- **supplyProviderConfig? (): any**

	A callback that sends additional configuration options for the provider each time it opens. You can use this to pass non-editable data, for example configuring how a form will be displayed. @return Arbitrary configuration options for the child blade.

- **FormFieldValueAccessor?: FormFieldValueAccessors<TResult>**

	Provides an easy way to integrate a parameter collector with an EditScope.

	The collector sends initial data to the provider from this `EditScope` property, and will automatically insert the provider's output into this `EditScope` property. The net result is that your parameter collector will act as an editor for the specified `EditScope` property.

	If you specify this option, do not also specify either `supplyInitialData` or `receiveResult`.

The full source of this ParameterCollector implementation is located at 
`<dir>\Client\ParameterCollection\CollectorAsButtonPart`.

Related Documentation: ARM Provisioning API [top-extensions-resource-manager.md](top-extensions-resource-manager.md).
