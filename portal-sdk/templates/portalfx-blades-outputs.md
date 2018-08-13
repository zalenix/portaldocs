
### Blade Outputs

In some cases, an extension sends information from the current blade back to the parent blade. Blades can define a list of output properties that flow back to the calling blade. A common use for this binding is to return data from a child blade back to a part.

![Typical use of blade outputs][part-settings]

**NOTE**: In this discussion, `<dir>` is the `SamplesExtension\Extension\` directory, and  `<dirParent>`  is the `SamplesExtension\` directory, based on where the samples were installed when the developer set up the SDK. 

In this example, the parent blade defines a `BladeAction` which passes an `id` property to the child blade. This will allow changes in the `ViewModel` on the child blade to flow back to the `ViewModel` on the parent blade, as in the example located at `<dir>\Client\V1\Bindings\OutputBindings\OutputBindings.pdl` and in the following code.

```xml
<CustomPart Name="ParentPart"
            ViewModel="{ViewModel Name=OutputBindingsParentPartViewModel,
                                  Module=./OutputBindings/ViewModels/OutputBindingsViewModels}"
            Template="{Html Source='Templates\\Parent.html'}">

  <BladeAction Blade="OutputBindingsChildBlade">
    <BladeOutput Parameter="currentNumber"
                 Target="currentNumber" />
  </BladeAction>
</CustomPart>
```
 
{"gitdown": "include-section", "file":"../Samples/SamplesExtension/Extension/Client/V1/Bindings/OutputBindings/OutputBindings.pdl", "section": "portalfx-blades-outputs#parent-part"}

<!-- 
gitdown": "include-file", "file":"../Samples/SamplesExtension/Extension/Client/V1/Bindings/OutputBindings/OutputBindings.pdl"}

-->

In the previous snippet, `OutputBindingsChildBlade` is opened with a `currentNumber` parameter.  The child blade sets the value on the output binding.  After that value is set, `onInputsSet` of the part is invoked, this time with a value named `currentNumber`.
