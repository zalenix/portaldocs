
<a name="nuget-packages"></a>
# NuGet Packages

The Azure Portal SDK ships framework assemblies, tools, test framework and extension [PDE](portalfx-extensions-glossary-onboarding.md) files as NuGet packages. It also provides the capability to ship extensions as NuGet packages. This allows extensions to invoke blades and parts from other extensions at runtime. For more information about sharing  extensions as NuGet packages, see [portalfx-pde-publish.md](portalfx-pde-publish.md).

<a name="nuget-packages-configure-nuget-package-sources-for-development"></a>
## Configure NuGet package sources for development

In order to download the NuGet packages as part of an extension, developers can choose between CoreXT compatible package sources or consume the packages installed locally by the MSI. Choose a configuration that applies to your extension development context.

<a name="nuget-packages-configure-nuget-package-sources-for-development-microsoft-internal-nuget-feed"></a>
### Microsoft Internal NuGet Feed

Portal SDK NuGet packages are published to the Microsoft internal NuGet feed located at [https://aka.ms/portalfx/nugetfeed](https://aka.ms/portalfx/nugetfeed).  Depending on your internal build system, the configuration of how to consume this feed will vary.  For the latest guidance on consuming the feed within your build system, consult your build system's documentation. For those using 1ES systems, see the NuGet in 1ES guide located at [https://www.1eswiki.com/wiki/NuGet_in_1ES](https://www.1eswiki.com/wiki/NuGet_in_1ES).

You can also [browse the feed in VSTS](https://msazure.visualstudio.com/One/Azure%20Portal/_packaging?feed=Official%40Local&_a=feed).

<a name="nuget-packages-configure-nuget-package-sources-for-development-getting-the-nuget-packages-externally"></a>
### Getting the NuGet packages externally

PortalSDK NuGet packages are only published to Microsoft internal NuGet feeds.  If you do not have access to those feeds such as the one mentioned above you will need use those NuGet packages that are included in the Azure Portal SDK.  This is the recommended path for  [third party extension developers](portalfx-extensions-glossary-onboarding.md).

Installing the Portal SDK MSI will unpack the NuGet packages to a default location of `C:\Program Files (x86)\Microsoft SDKs\PortalSDK\packages` and will setup a NuGet package source named PortalSDK that points to that location.  Any subsequent actions performed in **Visual Studio** or the **NuGet** command line will also search the new local PortalSDK feed in program files for Portal-related NuGet packages.

<a name="nuget-packages-updating-your-extension-to-a-newer-version-of-the-sdk"></a>
## Updating your extension to a newer version of the SDK

External partners can download and install the NuGet packages when they install and use **Visual Studio 2015**. For more information, see [portalfx-extensions-getting-started-procedure.md](portalfx-extensions-getting-started-procedure.md). The packages that are installed are located in the `C:\Program Files (x86)\Microsoft SDKs\PortalSDK\Packages` directory.

<a name="nuget-packages-updating-your-extension-to-a-newer-version-of-the-sdk-update-your-nuget-packages"></a>
### Update your NuGet Packages

* In Visual Studio
1. Install the latest version of the Portal SDK MSI, as specified in [downloads.md](/portal-sdk/generated/downloads.md).
1. In Visual Studio open your Solution and select `Tools > NuGet Package Manager > Manage NuGet packages for Solution…`.
1. Select all `Microsoft.Portal.*` NuGet packages.
1. Click `Update`.
1. Build and fix any breaking changes, as described in [Breaking changes](/portal-sdk/generated/breaking-changes.md).

* In CoreXT
1. Find the latest SDK version number from the SDK downloads document located at [/portal-sdk/generated/downloads.md](/portal-sdk/generated/downloads.md).

1. Update your `package.config` to the latest version of the SDK.

1. Run `init.cmd`.

    **NOTE**: Your $(Pkg*) references in your `csproj` file  should automatically update to point at the newest restored NuGet.

1. Copy over `/Content` files to get latest `*.d.ts` and `*.pde` files.

    **NOTE**:  CoreXT does not copy content files. Typically, internal teams use either a `<Target />` or a `NuGetContentRestore` task to rehydrate the Content files from their CxCache.

1. Build and fix any breaking changes.

