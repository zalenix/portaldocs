
## Common hosting service scenarios

<!-- TODO: Determine whether these should be Best Practices instead of common scenarios -->

Hosting service scenarios are based on varying the content of the `config` file.  To load your extension in the Portal, it must be registered in the Portal configuration. If the extension is loaded in the Portal from the hosting service, then there are no changes required to sideload it. 

For more information about updating the extension configuration, see [portalfx-extensions-configuration-overview.md](portalfx-extensions-configuration-overview.md). For more information about sideloading, see [top-extensions-sideloading.md](top-extensions-sideloading.md). 
 
### New extensions

If the extension does not exist in the Portal yet, register it into the Portal in the disabled state. The following json files contain registrations for various environments.

* Dogfood environment registration that is stored in  `Extensions.dogfood.json`

```json
{
    "name": "<extensionName>",
    "uri": "//hosting.onecloud.azure-test.net/<extensionDirectory>",
    "uriFormat": "//hosting.onecloud.azure-test.net/<extensionDirectory>/{0}",
    "disabled": true,
    ...
},
```

* PROD environment registration that is stored in  `Extensions.prod.json`,  i.e. RC, MPAC and Prod environments

```json
{
    "name": "<extensionName>",
    "uri": "//<extensionDirectory>.hosting.portal.azure.net/<extensionDirectory>",
    "uriFormat": "//<extensionDirectory>.hosting.portal.azure.net/<extensionDirectory>/{0}",
    "disabled": true,
    ...
},
```
### Existing extensions

If the extension is already registered in the Portal, but is in the process of being migrated to the hosting service, update the **uriFormat** in the `config` file.  The following json files contain example registrations for various environments.

* Dogfood environment registration that is stored in  `Extensions.dogfood.json`

```json
{
    "name": "<extensionName>",
    "uri": "//df.<extensionDirectory>.onecloud-ext.azure-test.net",
    "uriFormat": "//hosting.onecloud.azure-test.net/<extensionDirectory>/{0}",
    "disabled": true,
    ...
},
```

* PROD environment

  Registration for `Extensions.prod.json`,  i.e. RC, MPAC and Prod environments

```json
{
    "name": "<extensionName>",
    "uri": "//main.<extensionDirectory>.ext.azure.com",
    "uriFormat": "//<extensionDirectory>.hosting.portal.azure.net/<extensionDirectory>/{0}",
    "disabled": true,
    ...
},
```

### Sideloading

The hosting service allows developers to sideload any version of the extension that is deployed to the hosting service. To sideload a version, add a friendly name to the `config.json` file. Extension developers can leverage any number of friendly names for development and testing. The sideloaded extension can be invoked by using the following query string.

`https://portal.azure.com?feature.canmodifystamps=true&<extensionName>=<friendlyName>`

where 

**https://portal.azure.com**: The name of the Portal in this example.

**feature.canmodifystamps=true**: Required for sideloading.

**extensionName**: The unique name of the extension, without the angle brackets, as defined in the `extension.pdl` file.

**friendlyName**: A unique name, without the angle brackets, that is assigned to a specific build version for sideloading. 

### Sideloading with friendly names for testing

Developers can use the sideload url and friendly names to load different   versions of an extension. The following example is a `config.json` file that specifies the friendly name "test" for version 3.0.0.0 of an extension.

```json
    {
        "$version": "3",
        "stage1": "1.0.0.5",
        "stage2": "1.0.0.4",
        "stage3": "1.0.0.3",
        "stage4": "1.0.0.2",
        "stage5": "1.0.0.1",
        "test": "3.0.0.0"
    }
```

The test version of the extension will be invoked with the following query string.

`https://portal.azure.com?feature.canmodifystamps=true&<extensionName>=test`

<!-- TODO: are friendly names separated by commas? -->

### Deploying a new version to a stage

If you are using safe deployment, you can rollout a new version of an extension to a specific stage by updating the stage in the `config.json` file.   
* The version to be published is in the storage account
  - Just update the stage in `config.json` to this version.

* The version to be published is not in the storage account 
  - Update the stage in `config.json` to this version.
  - Push the zip file that is associated with the version to the storage account that is registered with hosting service.

**NOTE:** Publishing a version to a stage in safe deployment does not require a build or deployment.

The versions available in the hosting service are located at the following URLs.

| Environment | URL                                                     |
| ---         | ---                                                     |
| Dogfood     | https://hosting.onecloud.azure-test.net/api/diagnostics |
| MPAC        | https://ms.hosting.portal.azure.net/api/diagnostics     |
| PROD        | https://hosting.portal.azure.net/api/diagnostics        |
