<a name="parts-and-components"></a>
## Parts and Components

This document describes functions within the `msportalfx-test` suite that are used to test items other than forms, resources, and blades.

<!-- Determine how much of this can be replaced with the controls playground, or whether the playground can be used to build tests.  -->
<a name="parts-and-components-action-bar"></a>
### Action Bar

This section was never written.

<a name="parts-and-components-command"></a>
### Command
 
This section was never written.

<a name="parts-and-components-delete"></a>
### Delete

This section was never written.

<a name="parts-and-components-detect-styling-or-layout-regression"></a>
### Detect Styling or layout regression

To detect styling or layout regressions while testing your extension, use the `portal.detectStylingRegression` function, as in the following example.

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

The function uploads a screenshot to the `cicss` container of the storage account with the name, key, subscription id and resource group that you specify, as in the following sample
 `config.json` file.

```
    "CSS_REGRESSION_STORAGE_ACCOUNT_NAME":"myaccountname",
    "CSS_REGRESSION_STORAGE_ACCOUNT_SUBSCRIPTIONID":"mysubscriptionid",
    "CSS_REGRESSION_STORAGE_ACCOUNT_RESOURCE_GROUP":"mygresourcegroupname",
    "CSS_REGRESSION_STORAGE_ACCOUNT_KEY":"myaccountkey",
```

The storage account key is entered into **Windows Credential Manager** by using the `cmdkey` command, as in the following code.

```
    cmdkey /generic:CSS_REGRESSION_STORAGE_ACCOUNT_KEY /user:myaccountname /pass:myaccountkey
```

The screenshot will then be compared with a Last Known Good screenshot.  If there are dfferences, a diff `html` file will be produced and uploaded to your storage account.
The link to the `html` file will be in the failed test's error message that is associated with the failed test.  It includes a **PowerShell** script download that can be used to promote the Latest screenshot to Last Known Good.

The initial Last Known Good file is the screenshot that was taken when there was no Last Known Good screenshot for  comparison.  You can run the `portal.detectStylingRegression` function once to seed your test. For example, the following is the signature of the `portal.detectStylingRegression` function.
    
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

<a name="parts-and-components-locators"></a>
### Locators

This section was never written.

<a name="parts-and-components-consuming-updates"></a>
### Consuming Updates

This section was never written.

<a name="parts-and-components-code-coverage"></a>
### Code Coverage

This section was never written.

<a name="parts-and-components-interoperability"></a>
### Interoperability

<!-- TODO:  Determine whether the following sentence is accurate.  All that was here originally was "edge.js" and the title. -->

You can run .NET code from your tests by using the `edge.js` script.

<a name="parts"></a>
## Parts

<a name="parts-how-to-get-a-reference-to-a-part-on-a-blade"></a>
### How to get a reference to a part on a blade

You extension can get a reference or a handle to a part on a blade if it is a specific part.  For example, your extension can declare a handle that references the essentials, as in the following code. 

```
	let thePart = blade.element(testFx.Parts.ResourceSummaryPart);
```

A reference to a more generic part might resemble the following code.
```
	let thePart = blade.part({innerText: "some part text"});
``` 

The following code gets a handle to this part by using classname and type. 

```
	let thePart = blade.element(By.Classname("myPartClass")).AsType(testFx.Parts.Part);
```

<a name="parts-collectionpart"></a>
### CollectionPart

The following code demonstrates how to:

* Get a reference to the collection part by using the `blade.element(...)` method

* Get the rollup count by using the `collectionPart.getRollupCount()` method

* Get the rollup count label by using the `collectionPart.getRollupLabel()` method

* Get the grid rows by using the `collectionPart.grid.rows` method

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

**NOTE**: If the extension has multiple collection parts, you may want to use the `blade.part(...)` method to search by text.

<a name="grid"></a>
## Grid

<a name="grid-finding-a-row-within-a-grid"></a>
### Finding a row within a grid

The following demonstrates how to use `Grid.findRow` to find a `GridRow` that contains the specified text at a specific index. It also gets the text from all cells within the row by using the `GridRow.cells.getText` method.

<!-- TODO: Determine whether the next sentence is accurate. -->

It returns the row of text that it located if the row  contains more than 2 columns.

<!-- TODO:  Determine why texts[1] should contain  "333").  -->

```ts
                
                return grid.findRow({ text: "John", cellIndex: 0 })
                    .then((row) => row.cells.getText())
                    .then((texts) => texts.length > 2 && texts[0] === "John" && texts[1] === "333");
                
```

<a name="grid-createcomboboxfield"></a>
### CreateComboBoxField

The following code uses a `CreateComboBoxField`  resource group that is located on a Create blade as a model for a new  resource group. It performs the following steps.

* Use the `selectOption(...)` methods to choose an existing resource group

* Use the `setCreateValue(...)` and `getCreateValue(...)` methods to get and check the value of the create new field respectively 

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

<a name="editor"></a>
## Editor

The following example demonstrates how to use the Editor to read, write, and empty content. It writes content to a document by using the `sendKeys(...)` function. It clicks the Save button on the Editor blade, then verifies whether the Editor blade created the new document. 

<!--TODO:  Determine whether this is the Editor object that is obsolete -->

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

<a name="essentials-tests"></a>
## Essentials tests

The following example uses most of the methods in the Essentials object.  It demonstrates how to:

* use `countItems(...)` to count the number of all items. A multiLine Item is counted as one item.

* Use `isDisabled(...)` to get a value that determines whether the essentials is disabled

* Use `hasViewAll(...)` to get a value that determines whether the essentials contains the  ViewAll button

* Use `getViewAllButton(...)` to get a PortalElement of the essentials' viewAll button

* Use `getItemByLabelText(...)` to get an EssentialsItem that is found by its label text

* Use `getPropertyElementByValue(...)` to get a PortalElement of matching property value

* Use `getExpandedState(...)` to get a value that determines the essentials' expanded state

* Use `setExpandedState(...)` to set the essentials' expanded state

* Use `getExpander(...)` to get the Expander element

* Use `getProperties(...)` to get an array of properties

* Use `getLabelText(...)` to get the item label text

* Use `hasMoveResource(...)` to get whether the item contains a move resource blade

* Use `getLabelId(...)` to get the item label id

* Use `getSide(...)` to get the item's side

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
