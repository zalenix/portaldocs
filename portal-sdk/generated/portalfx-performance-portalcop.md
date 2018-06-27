<a name="portalcop"></a>
## PortalCop

The Portal Framework team has a tool named **PortalCop** that helps reduce code size and remove redundant RESX entries.

<a name="portalcop-installing-portalcop"></a>
### Installing PortalCop

The tool can be installed by running the following command in the NuGet Package Manager Console.

```
Install-Package PortalFx.PortalCop -Source https://msazure.pkgs.visualstudio.com/DefaultCollection/_packaging/Official/nuget/v3/index.json -Version 1.0.0.339
```

The tool can also be installed by running the following command in a Windows command prompt.

```
nuget install PortalFx.PortalCop -Source https://msazure.pkgs.visualstudio.com/DefaultCollection/_packaging/Official/nuget/v3/index.json -Version 1.0.0.339
```

<a name="portalcop-running-portalcop"></a>
### Running PortalCop

<a name="portalcop-running-portalcop-namespace-mode"></a>
#### Namespace mode

The **PortalCop** tool has a namespace mode that is used in code minification. 
 
```
   portalcop Namespace
```

**NOTE**: Do not run this mode in your codebase if If you do not use AMD.

If there are nested namespaces in the code, for example A.B.C.D, the minifier only reduces the top level name, and leaves all the remaining names uncompressed.

For example, if the code uses `MsPortalFx.Base.Utilities.SomeFunction();` it will be minified as `a.Base.Utilities.SomeFunction();`.

While implementing an extension with the Framework, namespaces that are imported can achieve better minification.  For example, the following namespace is imported into code
```
   import FxUtilities = MsPortalFx.Base.Utilities;
```

It yields a better minified version, as in the following example.
```
   FxUtilities.SomeFunction(); -> a.SomeFunction();
```

In the Namespace mode, the **PortalCop** tool normalizes imports to the Fx naming convention. It will not collide with any predefined names you defined. This tool can achieve as much as a 10% code reduction in most of the Shell codebase.

**NOTE**: Review the changes to minification after running the tool.  The tool does string mapping instead of syntax-based replacement, so you may want to be wary of string content changes.

<a name="portalcop-running-portalcop-resx-mode"></a>
#### Resx mode

The **PortalCop** tool has a resx mode that is used to reduce code size and save on localization costs by finding unused/redundant `resx` strings. To list unused strings, use the following command.
```
   portalcop Resx
```
   
To list and clean *.resx files, use the following command.
```
    portalcop Resx AutoRemove
```

Constraints on using the resx mode are as follows.

* The tool may incorrectly flag resources as being unused if the extension uses strings in unexpected formats.  For example, if the extension tries to dynamically read from resx based on string values, as in the following code.

```
Utils.getResourceString(ClientResources.DeploymentSlots, slot)));
export function getResourceString(resources: any, value: string): string {
        var key = value && value.length ? value.substr(0, 1).toLowerCase() + value.substr(1) : value;
        return resources[key] || value;
}
```

* You should review the changes after running the tool and make sure that they are valid.
* If using the AutoRemove option, you need to use  **VisualStudio** to regenerate the `Designer.cs` files by opening the RESX files.
* If there are scenarios that the tool incorrectly identifies as unused, please report them to 
<a href="mailto:ibizafxpm@microsoft.com?subject=PortalCop incorrectly identifies Scenario as unused">ibizafxpm@microsoft.com</a>.
