
<a name="deprecated-controls"></a>
## Deprecated controls

For the most part, Controls in the MsPortalFx namespace are deprecated.  The main reason this is happening is that the MsPortalFx namespace is not AMD, and thus is not as performant.  A side benefit of needing to rewrite the apis is to clean up and unify all of the control creation/initialization patterns.

The new creation patterns can be found in [top-extensions-controls.md](top-extensions-controls.md).

For backwards compatibility purposes, MsPortalFx namespace viewmodels will be provided until the classes are officially deprecated.  Samples for all of these controls can be found under \Client\V1\Controls in the samples extension.  The Azure Portal team will not be adding any new features to these viewmodels.

**NOTE:** While most controls have been migrated to the new pattern, there are a few that require a bit more api cleanup before they can be exposed publicly in the SDK.  Rather than wait for everything to be complete, the Portal team decided to make the Fx/Controls modules available when thre was  a reasonable number of controls using newer AMD apis.  Please continue to use the grid, tree, list, toolbar, and file download controls in the MsPortalFx namespace until the new SDK is available.  Any other controls should be instantiated using the Fx/Controls modules.
