
## Legacy TemplateBlades with PDL


### Disclaimer

Note that this document covers a legacy programming model -- PDL -- that should not be used when implementing new blades in the Azure portal. You should only need this document if you are maintaining an existing blade that was implemented using the PDL-based programming model.

### Overview

The `TemplateBlade` is the recommended way of authoring blades in Ibiza. It is the equivalent to windows or pages in other systems.

You can think of a TemplateBlade as an HTML page. Authoring template blades requires:
* an HTML template
* a ViewModel
* an optional CSS file
* a use of `<TemplateBlade>` in a corresponding PDL file, naming the HTML template filename and view model class, supplying additional `TemplateBlade` configuration.

What follows is a walk-through of creating a TemplateBlade.

* [Creating the TemplateBlade](#creating-the-templateblade)

* [Adding Controls](#adding-controls)

* [Supplying parameters to the TemplateBlade](#supplying-parameters-to-the-TemplateBlade)

* [Adding commands](#adding-commands)

* [Adding buttons](#adding-buttons)

* [Displaying a full screen blade](#displaying-a-full-screen-blade)

* [Displaying a loading indicator UX](#displaying-a-loading-indicator-ux)

* * * 

### Creating the TemplateBlade

Use the following three steps to create a template blade.

1. Add the blade definition to the PDL file, as in the following example.

    ```xml
    <TemplateBlade
                Name="MyTemplateBlade"
                ViewModel="{ ViewModel Name=MyTemplateBladeViewModel, Module=./ViewModels/MyTemplateBladeViewModel }"
                InitialDisplayState="Maximized"
                Template="{ Html Source='Templates\\MyTemplateBlade.html' }">
    </TemplateBlade>
    ```
    The PDL file can contain several options. The following is a list of the most relevant parameters.

    **Name**: Name of the blade. This name is used later to refer to this blade. 

    **ViewModel**: Required field.  The ViewModel that is associated with this blade. 

    **Template**: Required field.  The HTML template for the blade. 

    **Size**: Optional field. The width of the blade. The default value is `Medium`. 

    **InitialDisplayState**: Optional field.  Specifies whether the blade is opened maximized or not. The default value is `Normal`. 

    **Style**: Optional field. Visual style for the blade. The default value is `Basic`. 

    **Pinnable**: Optional field. Flag that specifies whether the blade can be pinned or not. The default value is `false`.

    **ParameterProvider**: Optional field. Flag that specifies whether the blade provides parameters to other objects. The default value is  `false`.

    **Export**: Optional field.  Flag that specifies whether this blade is exported in the extension so that it can be opened by other extensions. As a result, a strongly typed blade reference is created. 

1. Create a `ViewModel` TypeScript class. The following example demonstrates the `ViewModel` that is associated with the blade from the PDL file in the previous step. This model exposes two observable properties, but more complex behavior can be added as appropriate.

    ```js
    export class MyTemplateBladeViewModel extends MsPortalFx.ViewModels.Blade {

        public text: KnockoutObservable<string>;
        public url: KnockoutObservable<string>;

        constructor(container: MsPortalFx.ViewModels.ContainerContract, initialState: any, dataContext: any) {
            super();
            this.title("InfoBox");
            this.subtitle("InfoBox Playground");

            this.text = ko.observable<string>("Go to the Azure Portal");
            this.url = ko.observable<string>("http://portal.azure.com");
        }

        public onInputsSet(inputs: any): MsPortalFx.Base.Promise {
            return null;
        }
    }

    ```

1. Create a template for the blade using regular HTML and **Knockout**. The **Knockout** bindings are bound to the public properties in the `ViewModel` in the previous step. 

    ```html
    <div>This is an example template blade that shows a link.</div>

    <a data-bind="text: text, attr: { href: url }" target="_blank"></a>
    ```

For more information about **Knockout**, see [http://knockoutjs.com](http://knockoutjs.com/).

### Adding controls

Ibiza provides an extensive controls library that can be used in the HTML template. The following example uses the `InfoBox` control instead of a regular HTML link.

1. Change the link element in the HTML template to a control container.

    ```html
    <div>This is an example template blade that shows a link.</div>

    <div data-bind="pcControl:infoBox"></div>
    ```

1. Update the blade `ViewModel` to expose and instantiate the control ViewModel, as in the following code.

    ```javascript
    export class MyTemplateBladeViewModel extends MsPortalFx.ViewModels.Blade {

        // view-model for the infoBox control
        public infoBox: MsPortalFx.ViewModels.Controls.InfoBox.BaseViewModel;

        constructor(container: MsPortalFx.ViewModels.ContainerContract, initialState: any, dataContext: any) {
            super();
            this.title("InfoBox");
            this.subtitle("InfoBox Playground");

            // initialization of the InfoBox view-model
            this.infoBox = new MsPortalFx.ViewModels.Controls.InfoBox.LinkViewModel(container, {
                text: ko.observable<string>('Go to the Azure Portal'),
                image: ko.observable(MsPortalFx.Base.Images.Info()),
                clickableLink: ko.observable(MsPortalFx.ViewModels.Part.createClickableLinkViewModel(ko.observable<string>('http://portal.azure.com'))
            });
        }

        public onInputsSet(inputs: any): MsPortalFx.Base.Promise {
            return null;
        }
    }
    ```

1. This example uses the PDL file from the section named [#creating-the-templateblade](#creating-the-templateblade).

### Supplying parameters to the TemplateBlade

Blades can receive input parameters that are part of the signature for the blade. The following code adds an "id" input parameter to the template blade. It reuses the HTML template from the previous steps.

1. Include the parameters in the signature of the blade in the PDL definition.

    ```xml
    <TemplateBlade
                Name="MyTemplateBlade"
                ViewModel="{ ViewModel Name=MyTemplateBladeViewModel, Module=./ViewModels/MyTemplateBladeViewModel }"
                Template="{ Html Source='Templates\\MyTemplateBlade.html' }">
        <TemplateBlade.Parameters>
            <Parameter Name="id" />
        </TemplateBlade.Parameters>
    </TemplateBlade>
    ```

1. Define the signature in the ViewModel.

    ```javascript
    import Def = ExtensionDefinition.ViewModels.Resource.MyTemplateBladeViewModel;

    export class MyTemplateBladeViewModel extends MsPortalFx.ViewModels.Blade {

        // this property is part of the blade signature and is passed into onInputSet
        public id: KnockoutObservable<string>;

        public infoBox: MsPortalFx.ViewModels.Controls.InfoBox.BaseViewModel;

        constructor(container: MsPortalFx.ViewModels.ContainerContract, initialState: any, dataContext: any) {
            super();
            this.title("InfoBox");
            this.subtitle("InfoBox Playground");

            this.infoBox = new MsPortalFx.ViewModels.Controls.InfoBox.LinkViewModel(container, {
                text: ko.observable<string>('Go to the Azure Portal'),
                image: ko.observable(MsPortalFx.Base.Images.Info()),
                clickableLink: ko.observable(MsPortalFx.ViewModels.Part.createClickableLinkViewModel(ko.observable<string>('http://portal.azure.com'))
            });
        }

        public onInputsSet(inputs: Def.InputsContract): MsPortalFx.Base.Promise {
            // write the input property to the console
            console.log(inputs.id);
            return null;
        }
    }
    ```

### Adding commands

Commands are typically displayed at the top of the template blade. To add the commands,  add a toolbar to the `TemplateBlade`, and then define its contents in the `ViewModel`.

The working copy of the sample in the Dogfood environment is located at  [https://df.onecloud.azure-test.net/?SamplesExtension=true#blade/SamplesExtension/SDKMenuBlade/bladewithtoolbar](https://df.onecloud.azure-test.net/?SamplesExtension=true#blade/SamplesExtension/SDKMenuBlade/bladewithtoolbar).


1. Add a `CommmandBar` element to the PDL template.
    ```xml
    <TemplateBlade
                Name="MyTemplateBlade"
                ViewModel="{ ViewModel Name=MyTemplateBladeViewModel, Module=./ViewModels/MyTemplateBladeViewModel }"
                Template="{ Html Source='Templates\\MyTemplateBlade.html' }">
        <TemplateBlade.Parameters>
            <Parameter Name="id" />
        </TemplateBlade.Parameters>
        <CommandBar />
    </TemplateBlade>
    ```

1. Instantiate the `CommandBar` in the ViewModel, as in the following example.

    ```javascript
    import Def = ExtensionDefinition.ViewModels.Resource.MyTemplateBladeViewModel;

    export class MyTemplateBladeViewModel extends MsPortalFx.ViewModels.Blade {

        public id: KnockoutObservable<string>;
        public infoBox: MsPortalFx.ViewModels.Controls.InfoBox.BaseViewModel;

        // toolbar view-model
        public commandBar: MsPortalFx.ViewModels.Toolbars.ToolbarContract;

        constructor(container: MsPortalFx.ViewModels.ContainerContract, initialState: any, dataContext: any) {
            super();
            this.title("InfoBox");
            this.subtitle("InfoBox Playground");

            this.infoBox = new MsPortalFx.ViewModels.Controls.InfoBox.LinkViewModel(container, {
                text: ko.observable<string>('Go to the Azure Portal'),
                image: ko.observable(MsPortalFx.Base.Images.Info()),
                clickableLink: ko.observable(MsPortalFx.ViewModels.Part.createClickableLinkViewModel(ko.observable<string>('http://portal.azure.com'))
            });

            // initialize the toolbar
            var button = new Toolbars.OpenLinkButton("http://azure.com");
            button.label("azure.com");
            button.icon(MsPortalFx.Base.Images.Hyperlink());
            this.commandBar = new Toolbars.Toolbar(container);
            this.commandBar.setItems( [ button ] );
        }

        public onInputsSet(inputs: Def.InputsContract): MsPortalFx.Base.Promise {
            return null;
        }
    }
    ```

### Adding buttons 

Blades can display buttons that are docked at the base of the blade.  The following code demonstrates how to add buttons to the blade.

1. Add an `ActionBar` element in the PDL template. The `ActionBar` is docked to the bottom of the blade and contains buttons, as in the following example.

    ```xml
    <TemplateBlade
                Name="MyTemplateBlade"
                ViewModel="{ ViewModel Name=MyTemplateBladeViewModel, Module=./ViewModels/MyTemplateBladeViewModel }"
                Template="{ Html Source='Templates\\MyTemplateBlade.html' }">
        <TemplateBlade.Parameters>
            <Parameter Name="id" />
        </TemplateBlade.Parameters>
        <ActionBar ActionBarKind="Generic" />
    </TemplateBlade>
    ```

1. Instantiate the `ActionBar` in the ViewModel.

    ```javascript
        export class MyTemplateBladeViewModel extends MsPortalFx.ViewModels.Blade {

            public id: KnockoutObservable<string>;
            public infoBox: MsPortalFx.ViewModels.Controls.InfoBox.BaseViewModel;

            // define the actionBar view-demol
            public actionBar: MsPortalFx.ViewModels.ActionBars.GenericActionBar.ViewModel;

            constructor(container: MsPortalFx.ViewModels.ContainerContract, initialState: any, dataContext: any) {
                super();
                this.title("InfoBox");
                this.subtitle("InfoBox Playground");

                this.infoBox = new MsPortalFx.ViewModels.Controls.InfoBox.LinkViewModel(container, {
                    text: this.text,
                    image: ko.observable(MsPortalFx.Base.Images.Info()),
                    clickableLink: ko.observable(MsPortalFx.ViewModels.Part.createClickableLinkViewModel(this.url))
                });

          // initialize the ActionBar

                this.actionBar = new MsPortalFx.ViewModels.ActionBars.GenericActionBar.ViewModel(container);   
                this.actionBar.actionButtonClick = () => {
                    console.log("Clicked!!!");
                };
            }

            public onInputsSet(inputs: Def.InputsContract): MsPortalFx.Base.Promise {
                return null;
            }
        }
    ```

### Displaying a full screen blade

To open the blade using the full screen,  add `InitialState="Maximized"` to the PDL definition of the blade, as in the following code.

```xml
<TemplateBlade
            Name="MyTemplateBlade"
            ViewModel="{ ViewModel Name=MyTemplateBladeViewModel, Module=./ViewModels/MyTemplateBladeViewModel }"
            InitialDisplayState="Maximized"
            Template="{ Html Source='Templates\\MyTemplateBlade.html' }">
</TemplateBlade>
```

### Displaying a loading indicator UX 

Sometimes, interaction with a blade should be prevented while it is initializing. In those cases, a shield that contains a loading indicator UX is displayed in the blade to block the display. The shield can be fully transparent or opaque. The following code demonstrates how to set an opaque filter in the blade.

```javascript
constructor(container: FxCompositionBlade.Container, initialState: any, dataContext: BladesArea.DataContext) {
    super();

    var operation = Q.defer<any>();

    // display the shield while the operation promise is not resolved
    container.operations.add(operation.promise, { blockUi: true, shieldType: MsPortalFx.ViewModels.ShieldType.Opaque });

    // wait for 3 seconds and resolve the promise (which will remove the shield)
    window.setTimeout(() => { operation.resolve(); }, 3000);
}
```

The following code snippet demonstrates how to apply a filter on a timer.  The filter slowly changes from opaque to transparent. The sample is also located at `<dir>\Client\V1\Blades/Template/ViewModels/TemplateBladeViewModels.ts`.

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/V1/Blades/Template/ViewModels/TemplateBladeViewModels.ts", "section": "templateBlade#shield"}