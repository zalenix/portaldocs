
# Versioning for extensions

## Overview

The Portal shell relies on environment versioning for making runtime decisions. Consequently, an edition of the extension can be stamped at compile time while being moved to the environment. Some examples are as follows.

* Invalidating cached manifests
* Invalidating static content that is served indirectly via CDN, or directly from an extension

By default, the value of the version is populated based on the version attributes that are located in the extension assembly.

First the runtime tries to find the `AssemblyInformationalVersionAttribute` attribute to retrieve the value. If this attribute is not defined in the assembly, then the runtime searches for the `AssemblyFileVersion` attribute and gets the value from this attribute.

The version of the extension can be checked by typing `window.fx.environment.version` in the browser console from the extension frame.

Developers should ensure that the version number is correctly updated on every build during the assembly process. The assembly version is added to the assembly by specifying the assembly level attribute as in the following example. 

```cs
[assembly: System.Reflection.AssemblyFileVersion("5.0.0.56")]
[assembly: System.Reflection.AssemblyInformationalVersionAttribute("5.0.0.56 (COMPUTER.150701-1627)")]
```

<!--TODO: Determine the expansion for the acronym MEF. -->

Developers can also override this behavior by deriving from the `ApplicationContext` class,  MEF-exporting the derived class as `[Export(typeof(ApplicationContext))]`, and overriding the `get` method for the `Version` property on the class. 

**NOTE**:  Ensure that the overridden `get` method returns a constant value for a specific build.

After configured content can be served directly from the extension, or by CDN if configured, the      can use  a URL segment such as `/Content/<Version>`, for example, `/Content/**5.0.0.56**/Scripts`, or `Content/**5.0.0.56**/Images`.

For more information about assembly version attributes, see [https://aka.ms/assemblyversion](https://aka.ms/assemblyversion).

For more information about additional version information for an assembly manifest, see [https://aka.ms/assemblyinformationalversion](https://aka.ms/assemblyinformationalversion).

<!--TODO: Determine whether the folloiwing link is internal only, or if there is another link that is available to all developers. -->
For more information about MSBuild properties, see [https://aka.ms/buildproperties](https://aka.ms/buildproperties).

### Implications of changing the version

Developers should not introduce breaking changes into the server code. For example, it is possible to create an incompatibility between client and server code. Instead, a compatible version of the previous code should remain on the server for a few days, and the old version should be monitored to ensure that customers and browsers are no longer accessing it. 

When all users have switched to the newer version of the code, probably by refreshing the portal, the previous version can be deleted. This is  accomplished by making new controllers and methods instead of making breaking changes to existing ones. 

When breaking changes occur, the browser will probably display a broken experience until the portal is reloaded. You can contact the portal team  at <a href="mailto:ibiza-onboarding@microsoft.com?subject=Breaking Change">ibiza-onboarding@microsoft.com</a> to find a way to resolve or circumvent this issue.

### PDL Versioning

Two build settings have been added to allow a specific edition of the extension  to be stamped at build time. They are `ExtensionVersion` and `ExtensionDescription`.

The following is a `*.csproj` file that uses the two build settings for an extension.

```xml
<PropertyGroup>
  <ExtensionVersion>1.0.0.0</ExtensionVersion>
  <ExtensionDescription>This extension build configuration is $(Configuration)</ExtensionDescription>
</PropertyGroup>
```

### Content Versioning

In order for the shell to provide browser caching, the recommendation is for all content in the  directory to be an embedded resource. The exception to this recommendation is `svg` files. The `getContentUri` API works with embedded resources and enables content versioning so that content gets cached for a specific build.

The following example displays a .

```xml
<EmbeddedResource Include="Content\SamplesExtension\Scripts\MsPortalFxDocs.js" />
```

### Selecting extensions for portals

Each `web.config` that is associated with an extension includes an `AllowedParentFrame` app setting that specifies the list of trusted hosts that can load the extension iframe. In production, this should be set to `['portal.azure.com']` explicitly; however, for debugging purposes, it  can also be set to `['*']` to allow other clients, as in the following example.

```xml
// production 
<add key="Microsoft.Portal.Framework.FrameworkConfiguration.AllowedParentFrame" value="['portal.azure.com']" />

// test 
<add key="Microsoft.Portal.Framework.FrameworkConfiguration.AllowedParentFrame" value="['*']" />
```

   
<!-- required Glossary document. -->
<!--
{"gitdown": "include-file", "file": "portalfx-extensions-glossary-versioning.md"}
-->