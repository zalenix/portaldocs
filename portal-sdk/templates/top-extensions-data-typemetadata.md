
## Type metadata

In this discussion, `<dir>` is the `SamplesExtension\Extension\` directory and  `<dirParent>`  is the `SamplesExtension\` directory. Links to the Dogfood environment are working copies of the samples that were made available with the SDK.

When performing merge operations, the DataSet library needs to be aware of the data model schema. For example, in the Website extension described in [portalfx-data-masterdetailsbrowse.md](portalfx-data-masterdetailsbrowse.md), we want to know which property defines the primary key of a Website object. The information that describes the object and all of its properties is known as type metadata. 

Type metadata can be manually coded using existing libraries. However, for developers using C#, we provide two features that make this easier.

* Generation of type metadata from C# to TypeScript at build time
* Generation of TypeScript model interfaces from C# model objects

These features allow developers to write your model objects only once in C#, and then let the compiler generate interfaces and data for use at runtime.

The data model objects for type metadata generation are stored in a .NET project that is separate from the extension project. 

The `SamplesExtension.DataModels` project included in the SDK uses `Microsoft.Portal.TypeMetadata` to generate 
representations of objects that are used by the resource types. The class library project used to generate models requires the following dependencies.

* System.ComponentModel.DataAnnotations
* System.ComponentModel.Composition
* Microsoft.Portal.TypeMetadata

The `Microsoft.Portal.TypeMetadata` library is located at `%programfiles(x86)%\Microsoft SDKs\PortalSDK\Libraries\Microsoft.Portal.TypeMetadata.dll`.

1. At the top of any C# file that uses the `TypeMetadataModel` annotation, the following namespaces must be imported.

* `System.ComponentModel.DataAnnotations`
* `Microsoft.Portal.TypeMetadata`

1.  For an example of a model class which generates **TypeScript**, open the following sample.

```cs
// \SamplesExtension.DataModels\Robot.cs

using System.ComponentModel.DataAnnotations;
using Microsoft.Portal.TypeMetadata;

namespace Microsoft.Portal.Extensions.SamplesExtension.DataModels
{
    /// <summary>
    /// Representation of a robot used by the browse sample.
    /// </summary>
    [TypeMetadataModel(typeof(Robot), "SamplesExtension.DataModels")]
    public class Robot
    {
        /// <summary>
        /// Gets or sets the name of the robot.
        /// </summary>
        [Key]
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the status of the robot.
        /// </summary>
        public string Status { get; set; }

        /// <summary>
        /// Gets or sets the model of the robot.
        /// </summary>
        public string Model { get; set; }

        /// <summary>
        /// Gets or sets the manufacturer of the robot.
        /// </summary>
        public string Manufacturer { get; set; }

        /// <summary>
        /// Gets or sets the Operating System of the robot.
        /// </summary>
        public string Os { get; set; }
    }
}
```

In the sample above, the `TypeMetadataModel` data attribute designates this class as one which should be included in the type generation. The first parameter specifies the type that is being targeted, which is  the same as the class that is being  decorated. The second attribute provides the `TypeScript` namespace for the model-generated object. If the  namespace is not specified, the .NET namespace of the model object is used. The `key` attribute on the `name` field specifies that the `name` property is the primary key field of the object. This is required when performing merge operations from data sets and edit scopes, as specified in [portalfx-data-refreshingdata.md](portalfx-data-refreshingdata.md).

### Setting options

The TypeScript interface generation and metadata generation are both controlled by using  properties in your extension's csproj file. 
By default, the generated files are placed in the `\Client\_generated` directory. They should be explicitly included in the csproj for the extension. The `SamplesExtension.DataModels` project is already configured to generate models. 

The following changes are required for the project, depending upon the SDK version.

 * From Release 4.15 forward, reference the  DataModels project and ensure your datamodels are marked with the appropriate `TypeMetadataModel` attribute.

 * Versions previous to 4.15 need to add this capability to another .NET project. Include the following code in the extension csproj file.

    `SamplesExtension.csproj`

```xml
<ItemGroup>
    <GenerateInterfacesDataModelAssembly
        Include="..\SamplesExtension.DataModels\bin\$(Configuration)\Microsoft.Portal.Extensions.SamplesExtension.DataModels.dll" />
</ItemGroup>
```

The addition of `GenerateInterfaces` to the existing `CompileDependsOn` element ensures that the `GenerateInterfaces`         target is executed with the appropriate settings. The `AssemblyPaths` property notes the path on disk where the model        project assembly will be placed during a build.

### Using the generated models

Make sure that the generated TypeScript files are included in the csproj. The easiest way to include new models in your extension project is to the select the "Show All Files" option in the Solution Explorer of Visual Studio. Right click on the `\Client\_generated` directory in the solution explorer and choose "Include in Project". Inside of the `\Client\_generated` folder you will find a file named by the fully qualified namespace of the interface. In many cases, you'll want to instantiate an instance of the given type. One way to accomplish this is to create a TypeScript class which implements the generated interface. However, this defeats the point of automatically generating the interface. The framework provides a method which allows generating an instance of a given interface:

```ts
MsPortalFx.Data.Metadata.createEmptyObject(SamplesExtension.DataModels.RobotType)
```

### Non-generated type metadata

Optionally, you may choose to write your own metadata to describe model objects. This is only recommended if not using a .NET project to generate metadata at compile time. In place of using the generated metadata, you can set the `type` attribute of your `DataSet` to `blogPostMetadata`. The follow snippet manually describes a blog post model:

```ts
var blogPostMetadata: MsPortalFx.Data.Metadata.Metadata = {
    name: "Post"
    idProperties: ["id"],
    properties: {
        "id": null,
        "post": null,
        "comments": { itemType: "Comment", isArray: true },
    }
};

var commentMetadata: MsPortalFx.Data.Metadata.Metadata = {
    name: "Comment"
    properties: {
        "name": null,
        "post": null,
        "date": null,
    }
};

MsPortalFx.Data.Metadata.setTypeMetadata("Post", blogPostMetadata);
MsPortalFx.Data.Metadata.setTypeMetadata("Comment", commentMetadata);
```

* The `name` property refers to the type name of the model object.
* The `idProperties` property refers to one of the properties defined below that acts as the primary key for the object.
* The `properties` object contains a property for each property on the model object.
* The `itemType` property allows for nesting complex object types, and refers to a registered name of a metadata object. (see `setTypeMetadata`).
* The `isArray` property informs the shell that the `comments` property will be an array of comment objects.

The `setTypeMetadata()` method will register your metadata with the system, making it available in the data APIs.


## Data atomization

Atomization fulfills two main goals: 

1. It enables several data views to be bound to one data entity, thus presenting a smooth and  consistent experience to the user.  In this instance, two views that represent the same asset are always in sync. 
1. It minimizes memory trace.

Atomization can be switched only for entities, which have globally unique IDs (per type) in  the  metadata system. In this case, a third attribute can be added to its `TypeMetadataModel` attribute in C#, as in the following example.

```cs

[TypeMetadataModel(typeof(Robot), "SamplesExtension.DataModels", true /* Safe to unify entity as Robot IDs are globally unique. */)]

```

The Atomization attribute is set to 'off' by default. The Atomization attribute is not inherited and has to be set to `true` for all types that should be atomized. 
In the simplest case, all entities within an extension will use the same atomization context, which defaults to one.
In this discussion, `<dir>` is the `SamplesExtension\Extension\` directory and  `<dirParent>`  is the `SamplesExtension\` directory. Links to the Dogfood environment are working copies of the samples that were made available with the SDK.

It is possible to select a different atomization context for a given cache object, as in the following example.

```cs

var cache = new MsPortalFx.Data.QueryCache<ModelType, QueryType>({
    ...
    atomizationOptions: {
        atomizationContextId: "string-id"
    }
    ...
});

```

