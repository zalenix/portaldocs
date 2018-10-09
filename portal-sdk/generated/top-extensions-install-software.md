<a name="install-software-for-extension-development"></a>
# Install Software for Extension Development

<!-- document headers are in the individual documents -->
<a name="install-software-for-extension-development-minimum-installation"></a>
## Minimum Installation

Install the following software. Your team should be aware of the most current download locations so that you can complete your own installs.

1. Windows 10, Windows Server 2012 R2, or the most recent edition of the client or server platform. Some downloads are located at the following sites.

    * Windows 10
    
      [https://www.microsoft.com/en-us/software-download/windows10](https://www.microsoft.com/en-us/software-download/windows10)

    * Windows Server 2012 R2

      [https://www.microsoft.com/en-us/download/details.aspx?id=41703](https://www.microsoft.com/en-us/download/details.aspx?id=41703)

1. Visual Studio 2015 update 3 that is located at [https://www.visualstudio.com/vs/older-downloads/](https://www.visualstudio.com/vs/older-downloads/). An SKU of Professional or greater is required.

1. TypeScript 2.3.3 for Visual Studio 2015 that is dated May 22, 2017. It is located at [http://download.microsoft.com/download/6/D/8/6D8381B0-03C1-4BD2-AE65-30FF0A4C62DA/2.3.3-TS-release-dev14update3-20170519.1/TypeScript_Dev14Full.exe](http://download.microsoft.com/download/6/D/8/6D8381B0-03C1-4BD2-AE65-30FF0A4C62DA/2.3.3-TS-release-dev14update3-20170519.1/TypeScript_Dev14Full.exe)

1. Node.js LTS 8.11.1 or later. It is located at 
[https://nodejs.org/dist/v8.11.1/node-v8.11.1-x64.msi](https://nodejs.org/dist/v8.11.1/node-v8.11.1-x64.msi).

1. Node tools that are located at [https://github.com/Microsoft/nodejstools/releases/tag/v1.3.1](https://github.com/Microsoft/nodejstools/releases/tag/v1.3.1)

1. Azure Portal SDK that is located at [http://aka.ms/portalfx/download](http://aka.ms/portalfx/download). Each version of the SDK is supported for 120 days. Extensions must upgrade to a newer version of the SDK within 120 days from the release of the SDK version they are currently using as runtime backward compatibility is not supported beyond that.

To validate that your dev machine is ready for Azure Portal Extension development, you can create and build a blank extension, as specified in [portalfx-extensions-create-blank-procedure.md](portalfx-extensions-create-blank-procedure.md).
