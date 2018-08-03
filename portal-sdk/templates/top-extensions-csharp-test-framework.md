
# C# Portal Test Framework

## Overview

The C# test framework is a UI test framework built on top of the Selenium Webdriver C# bindings that are described in [https://www.seleniumhq.org/projects/webdriver](https://www.seleniumhq.org/projects/webdriver/).  Its primary goal is testing UI interactions in the Azure Portal.  

The C# test framework provides the following.

* A base for writing UI based Selenium Webdriver tests.

* A suite of helpers for logging into, navigating, and manipulating controls, blades, and parts in the Portal

This document discusses the following topics.
* [Writing Tests](#writing-tests)
* [Creating the Test Project](#creating-the-test-project)
* [Testing Parts and Blades](#testing-parts-and-blades)
* [Entering Data into Forms](#entering-data-into-forms)
* [Testing Commands](#testing-commands)
* [Taking Screenshots while Testing](#taking-screenshots-while-testing)
* [Contributing to CSharp Typescript Test Framework](#contributing-to-csharp-typescript-test-framework)

* * *

## Writing Tests

### Prerequisites

Prerequisites for using the C# test framework are as follows.

* Nuget (https://www.nuget.org/) and [top-extensions-nuget.md](top-extensions-nuget.md)

* .NET Framework 4.5 or higher

* Visual Studio 2015 or higher, as specified in [top-extensions-install-software.md](top-extensions-install-software.md)

* Understanding of the C# programming language

### Getting Started

The C# Test framework is distributed as a NuGet package that is available in the Azure Official NuGet  feed [https://msazure.visualstudio.com/DefaultCollection/One/_packaging?feed=Official](https://msazure.visualstudio.com/DefaultCollection/One/_packaging?feed=Official).  There are two primary packages.

1. Microsoft.Portal.TestFramework

    It is located at [https://msazure.visualstudio.com/DefaultCollection/One/_Packaging?feed=Official&package=Microsoft.Portal.TestFramework&protocolType=NuGet&_a=package](https://msazure.visualstudio.com/DefaultCollection/One/_Packaging?feed=Official&package=Microsoft.Portal.TestFramework&protocolType=NuGet&_a=package)

1. Microsoft.Portal.TestFramework.Csharp

    It is located at [https://msazure.visualstudio.com/DefaultCollection/One/_packaging?feed=Official&package=Microsoft.Portal.TestFramework.CSharp&protocolType=NuGet&_a=package](https://msazure.visualstudio.com/DefaultCollection/One/_packaging?feed=Official&package=Microsoft.Portal.TestFramework.CSharp&protocolType=NuGet&_a=package)

    If you are just getting started, it is recommended to use the `Microsoft.Portal.TestFramework` NuGet package because it contains the necessary dependencies.  For more details about the two packages see [#understanding-the-differences-between-the-frameworks](#understanding-the-differences-between-the-frameworks).

### Understanding the differences between the frameworks 

There are some differences between the  `Microsoft.Portal.TestFramework` and `Microsoft.Portal.TestFramework.Csharp`.

The `Microsoft.Portal.TestFramework.CSharp` package contains the core test framework DLLs.  It is updated with the latest code as the Portal is being developed and may contain fixes for test issues that were found after release.  It may also contain code that is not compatible with the deployed version of the Portal.

The `Microsoft.Portal.TestFramework` contains a reference to the `Microsoft.Portal.TestFramework.Csharp` package in addition to dependencies that are required for the C# test framework to run upon initial installation. 

**NOTE**: Some external dependencies may require separate downloads, such as ChromeDriver, which match the version of Chrome.

## Creating the Test Project

To create a test project that can use the Portal Test Framework, use the following steps.

1. Create a new **Visual Studio** Unit Test Project.

1. Install the NuGet Package Microsoft.Portal.TestFramework from [https://msazure.visualstudio.com/DefaultCollection/One/_apps/hub/ms.feed.feed-hub?feedName=Official&protocolType=NuGet&packageName=microsoft.portal.testframework](https://msazure.visualstudio.com/DefaultCollection/One/_apps/hub/ms.feed.feed-hub?feedName=Official&protocolType=NuGet&packageName=microsoft.portal.testframework).

1. If your test cases use the Azure Marketplace, also install the Microsoft.Portal.TestFramework.MarketplaceUtilities package from [https://msazure.visualstudio.com/DefaultCollection/One/_apps/hub/ms.feed.feed-hub?feedName=Official&protocolType=NuGet&packageName=microsoft.portal.testframework.marketplaceutilities](https://msazure.visualstudio.com/DefaultCollection/One/_apps/hub/ms.feed.feed-hub?feedName=Official&protocolType=NuGet&packageName=microsoft.portal.testframework.marketplaceutilities), which contains Selenium classes for elements in the Azure Marketplace.

1. Add an `app.config` file to your test project and define the basic Test Framework settings under appSettings, as in the following example.

{"gitdown": "include-section", "file": "../samples/SampleCSTestsFiles/app.config", "section": "config#appSettings"}

5. Add a new Unit Test class and start writing your test case.

### Navigating to the Portal

To navigate to the Portal, the extension supplies the Portal's URI.  We recommend setting the value in the `app.config` file as shown in [Creating the Test Project](#creating-the-test-project).  After the extension has the Portal uri, it can use the **WebDriverFactory.Create** method to create an instance of the `WebDriver` object and then use the **PortalAuthentication** class to login and navigate to the Portal in the browser, as in the following example.

   {"gitdown": "include-section", "file": "../samples/SampleCSTestsFiles/NavigateToPortalTest.cs", "section": "config#navigateToPortal"}

**NOTE**: Multi-factor authentication (MFA) is not supported.  You must use an account that does not require MFA. To get an unprotected account, please see [https://aka.ms/portalfx/testaccounts](https://aka.ms/portalfx/testaccounts).  If you have any issues with the accounts, you should contact the Identity Division at [https://aka.ms/portalfx/identitydivision](https://aka.ms/portalfx/identitydivision).

For more information about handling credentials, see [#managing-authentication-credentials](#managing-authentication-credentials).

### Sideloading An Extension

The Portal provides options for side loading your extension for testing. To side load your extension you need to set the appropriate query strings and execute the `registerTestExtension` function. An example of side loading a deployed extension can be seen below. For more information, see [Sideloading an Extension](top-extensions-sideloading.md).

{"gitdown": "include-section", "file": "../samples/SampleCSTestsFiles/NavigateToPortalTest.cs", "section": "config#sideLoadingExtension"}

Finally, you should dispose the `WebDriver` to cleanup, as in the following example.

{"gitdown": "include-section", "file": "../samples/SampleCSTestsFiles/NavigateToPortalTest.cs", "section": "config#dispose"}

### Managing authentication credentials 

While the test framework does not provide any support for managing login credentials, the following are some recommendations.

1.  If you are in the Azure org, please see the Azure Security guidelines that are located at [https://aka.ms/portalfx/securityguidelines](https://aka.ms/portalfx/securityguidelines)

1.  Do not store your credentials in the test code.

1.  Do not check in your credentials into your repository.

1.  Some possibilities for storing login credentials include:

   * Using the Windows Credential Store.

   * Using Azure Key Vault.

### Full Sample Code

The following code demonstrates navigating to the Portal for testing.

```

{"gitdown": "include-file", "file": "../samples/SampleCSTestsFiles/NavigateToPortalTest.cs"}
```

## Testing Parts and Blades

An extension can find parts on the StartBoard by using the **Portal.StartBoard.FindSinglePartByTitle** method, after you have an instance of the Portal object. The method will give you a an instance of the Part class that you can use to perform actions on the part, like clicking on it.  In the following example, the button whose name is "Samples" is clicked. 

```cs
var portal = this.NavigateToPortal();

string samplesTitle = "Samples";

var samplesPart = portal.StartBoard.FindSinglePartByTitle<ButtonPart>(samplesTitle);
samplesPart.Click();
```

You can find blades in a similar way using the **Portal.FindSingleBladeByTitle** method. You can then find parts within the blade using the **Blade.FindSinglePartByTitle** method, as in the following example.

```cs
var blade = portal.FindSingleBladeByTitle(samplesTitle);

string sampleName = "Notifications";

blade.FindSinglePartByTitle(sampleName).Click();

blade = portal.FindSingleBladeByTitle(sampleName);
```

If you need to find parts based on different conditions, you can use the `FindElement` or `FindElements` methods on any web element, as in the following example.

```cs
var errorPart = webDriver.WaitUntil(() => blade.FindElements<Part>()
                                               .FirstOrDefault(p => p.Text.Contains("Send Error")),
									"Could not find a part with a Send Error text.");
```

**NOTE**: The **WebDriver.WaitUntil** method is a general and recommended mechanism to ask the **WebDriver** to retry an operation until a condition succeeds. In this instance, the test case waits by polling continually until it finds a part in the blade that contains text that includes the 'Send Error' string. When the part is found, it is returned to the `errorPart` variable; otherwise, if it is not found before the default timeout of 10 seconds, the  method throws an exception that uses the text specified in the last parameter. For more information, see [portalfx-extensions-bp-csharp-test.md#testing-best-practices](portalfx-extensions-bp-csharp-test.md#testing-best-practices). 

Classic Selenium **WebDriver** syntax can also be used to find any element based on a **By** selector. For example, the following code finds a single button element within the found part.

```cs
webDriver.WaitUntil(() => errorPart.FindElement(By.TagName("button")),
					"Could not find the button.")
	     .Click();
```
For more information, see [portalfx-extensions-bp-csharp-test.md](portalfx-extensions-bp-csharp-test.md).

### Full example

```cs
using System;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Portal.TestFramework.Core;
using Microsoft.Selenium.Utilities;
using OpenQA.Selenium;
using Microsoft.Portal.TestFramework.Core.Shell;

namespace SamplesExtensionTests
{
    [TestClass]
    public class PartsAndBlades
    {
        private const string ExtensionUrl = "http://localhost:11998";
        private const string ExtensionWebSitePath = @"d:\Users\julioct\Documents\PortalSDK\FrameworkPortal\Extensions\SamplesExtension\Extension";
        private static IWebDriver webDriver;
        private static PortalServer portalServer;
        private static WebServer extensionServer;

        [TestInitialize]
        public void TestInitialize()
        {
            extensionServer = new WebServer(new Uri(ExtensionUrl), ExtensionWebSitePath);
            if (extensionServer.IsHostedByTestFramework)
            {
                extensionServer.Start();
            }

            portalServer = PortalServer.Create();

            if (portalServer.IsHostedByTestFramework)
            {
                portalServer.RegisterExtension("Samples", new Uri(extensionServer.Uri));
                portalServer.Start();
            }

            webDriver = WebDriverFactory.Create();
            webDriver.Url = "about:blank";
            portalServer.ClearUserSettings();
        }

        [TestMethod]
        public void CanFindPartsAndBlades()
        {
            var portal = this.NavigateToPortal();

            string samplesTitle = "Samples";

            var samplesPart = portal.StartBoard.FindSinglePartByTitle<ButtonPart>(samplesTitle);
            samplesPart.Click();

            var blade = portal.FindSingleBladeByTitle(samplesTitle);

            string sampleName = "Notifications";

            blade.FindSinglePartByTitle(sampleName).Click();

            blade = portal.FindSingleBladeByTitle(sampleName);

            var errorPart = webDriver.WaitUntil(() => blade.FindElements<Part>()
														   .FirstOrDefault(p => p.Text.Contains("Send Error")),
												"Could not find a part with a 'Send Error' text.");

            webDriver.WaitUntil(() => errorPart.FindElement(By.TagName("button")),
								"Could not find the button.")
					 .Click();
        }

        [TestCleanup]
        public void TestCleanup()
        {
            webDriver.Dispose();
            portalServer.Dispose();
            extensionServer.Dispose();
        }
    }
}

```

## Entering Data into Forms

Forms are typically used to wrap textboxes, dropdowns and other types of input.  The test framework provides helpers to find a form and then find specific input fields in the form by the field label or fieldName.  The primary way to find form fields is to use the **FindField** method of the **FormSection** class, as in the following example.

1. The extension locates the form, as in the following code. In this example, the form contains two fields: a TextBox field and a Selector field.

    ```cs
    var portal = this.NavigateToPortal();

    portal.StartBoard.FindSinglePartByTitle<ButtonPart>("New Contact").Click();

    string contactName = "John Doe";

    string subscriptionName = "Portal Subscription 2";
    var blade = portal.FindSingleBladeByTitle("Basic Information");
    var form = webDriver.WaitUntil(() => blade.FindElement<FormSection>(), "Could not find the form.");
    ```

1.  The form has 2 fields, a TextBox field and a Selector field. The following example supports validations. The user can enter text in the contactName `TextBox` field and wait until it is marked as Edited and Valid.

    ```cs
    string fieldName = "contactName";
    var field = webDriver.WaitUntil(() => form.FindField<Textbox>(fieldName),
                                    string.Format("Could not find the {0} textbox.", fieldName));
    field.Value = contactName + Keys.Tab;
    webDriver.WaitUntil(() => field.IsEdited && field.IsValid,
                        string.Format("The {0} field did not pass validations.", fieldName));
    ```

1. Find the Selector field and click it to open the associated picker blade.

    ```cs
    fieldName = "subscriptionField";
    form.FindField<Selector>(fieldName).Click();
    ```

1.  Select an item from the picker's grid and click the OK button to send the selection back to the form.

    ```cs
    blade = portal.FindSingleBladeByTitle("Select Subscription");

    var grid = webDriver.WaitUntil(blade.FindElement<Grid>, "Could not find the grid in the blade.");
    GridRow row = grid.SelectRow(subscriptionName);

    PickerActionBar pickerActionBar = webDriver.WaitUntil(() => blade.FindElement<PickerActionBar>(),
                                                        "Could not find the picker action bar.");
    webDriver.WaitUntil(() => pickerActionBar.OkButton.IsEnabled,
                        "Expected the OK Button of the Picker Action Bar to be enabled after selecting an item in the picker list.");
    pickerActionBar.ClickOk();
    ```

1. Click the Create button to complete the form and then look for a blade with the title of the created Contact to verify that it was created successfully.

    ```cs
    blade = portal.FindSingleBladeByTitle("Basic Information");

    CreateActionBar createActionBar = webDriver.WaitUntil(() => blade.FindElement<CreateActionBar>(),
                                                        "Could not find the create action bar.");
    createActionBar.ClickOk();

    portal.FindSingleBladeByTitle(contactName);
    ```

### Full Example

The entire example is in the following code.

<!-- Determine whether this is in the SDK or in the controls playground, or in the dogfood samples. -->

```cs
using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Portal.TestFramework.Core;
using Microsoft.Selenium.Utilities;
using OpenQA.Selenium;
using Microsoft.Portal.TestFramework.Core.Shell;
using Microsoft.Portal.TestFramework.Core.Controls;

namespace SamplesExtensionTests
{
    [TestClass]
    public class Create
    {
        private const string SamplesExtensionUrl = "http://localhost:11997";
        private const string SamplesExtensionWebSitePath = @"d:\Users\julioct\Documents\PortalSDK\FrameworkPortal\Extensions\SamplesExtension\Extension";
        private const string HubsExtensionUrl = "http://localhost:11998";
        private const string HubsExtensionWebSitePath = @"d:\Users\julioct\Documents\PortalSDK\FrameworkPortal\Extensions\HubsExtension";
        private static IWebDriver webDriver;
        private static PortalServer portalServer;
        private static WebServer samplesExtensionServer;
        private static WebServer hubsExtensionServer;

        [TestInitialize]
        public void TestInitialize()
        {
            hubsExtensionServer = new WebServer(new Uri(HubsExtensionUrl), HubsExtensionWebSitePath);
            if (hubsExtensionServer.IsHostedByTestFramework)
            {
                hubsExtensionServer.Start();
            }

            samplesExtensionServer = new WebServer(new Uri(SamplesExtensionUrl), SamplesExtensionWebSitePath);
            if (samplesExtensionServer.IsHostedByTestFramework)
            {
                samplesExtensionServer.Start();
            }

            portalServer = PortalServer.Create();

            if (portalServer.IsHostedByTestFramework)
            {
                portalServer.RegisterExtension("Hubs", new Uri(hubsExtensionServer.Uri));
                portalServer.RegisterExtension("Samples", new Uri(samplesExtensionServer.Uri));
                portalServer.Start();
            }

            webDriver = WebDriverFactory.Create();
            webDriver.Url = "about:blank";
            portalServer.ClearUserSettings();
        }

        [TestMethod]
        public void CanCreateContact()
        {
            var portal = this.NavigateToPortal();

            // Open and find the Create Form
            portal.StartBoard.FindSinglePartByTitle<ButtonPart>("New Contact").Click();

            string contactName = "John Doe";
            string subscriptionName = "Portal Subscription 2";

            var blade = portal.FindSingleBladeByTitle("Basic Information");
            var form = webDriver.WaitUntil(() => blade.FindElement<FormSection>(), "Could not find the form.");

            // Fill a textbox field
            string fieldName = "contactName";
            var field = webDriver.WaitUntil(() => form.FindField<Textbox>(fieldName),
                                            string.Format("Could not find the {0} textbox.", fieldName));
            field.Value = contactName + Keys.Tab;
            webDriver.WaitUntil(() => field.IsEdited && field.IsValid,
                                string.Format("The {0} field did not pass validations.", fieldName));

            // Open a picker from a selector field and select an item
            fieldName = "subscriptionField";
            form.FindField<Selector>(fieldName).Click();

            blade = portal.FindSingleBladeByTitle("Select Subscription");

            var grid = webDriver.WaitUntil(blade.FindElement<Grid>, "Could not find the grid in the blade.");
            GridRow row = grid.SelectRow(subscriptionName);

            PickerActionBar pickerActionBar = webDriver.WaitUntil(() => blade.FindElement<PickerActionBar>(),
                                                                "Could not find the picker action bar.");
            webDriver.WaitUntil(() => pickerActionBar.OkButton.IsEnabled,
                                "Expected the OK Button of the Picker Action Bar to be enabled after selecting an item in the picker list.");
            pickerActionBar.ClickOk();

            // Click the Create button
            blade = portal.FindSingleBladeByTitle("Basic Information");

            CreateActionBar createActionBar = webDriver.WaitUntil(() => blade.FindElement<CreateActionBar>(),
                                                                "Could not find the create action bar.");
            createActionBar.ClickOk();

            // There should be an open blade with 'John Doe' as its title
            portal.FindSingleBladeByTitle(contactName);
        }

        [TestCleanup]
        public void TestCleanup()
        {
            webDriver.Dispose();
            portalServer.Dispose();
            samplesExtensionServer.Dispose();
            hubsExtensionServer.Dispose();
        }
    }
}
```

## Testing Commands

The Test Framework provides objects to interact with commands both from the command bar and context menus.

### To use commands from the command bar

Use the **Blade.FindCommandBar** method to get an instance of the Command Bar and then the **CommandBar.FindCommandBarItem** method to find the relevant command, as in the following example.

```cs
var blade = portal.FindSingleBladeByTitle(contactName);

CommandBar commandBar = blade.FindCommandBar();

var command = commandBar.FindCommandBarItem("DELETE");
```

After the  `Click()` method on the command is called, the extension may display a messageBox to show a message to the user. The extension can interact with the messageBox using the **CommandBar.FindMessageBox** method and the **MessageBox.ClickButton** method, as in the following example.

```cs
command.Click();

commandBar.FindMessageBox("Delete contact").ClickButton("Yes");
webDriver.WaitUntil(() => !commandBar.HasMessageBox, "There is still a message box in the command bar.");
```

### To use commands from context menus

Use the following steps to use Selenium's **Actions** class to perform a contextual click on the desired web element.

1. Find a grid row that has a context menu to open.

    ```cs
    var portal = this.NavigateToPortal();

    string contactName = "Jane Doe";
    string subscriptionName = "Portal Subscription 2";

    this.ProvisionContact(contactName, subscriptionName, portal);

    portal.StartBoard.FindSinglePartByTitle("Contacts").Click();
    var blade = portal.FindSingleBladeByTitle("Contacts List");
    var grid = webDriver.WaitUntil(() => blade.FindElement<Grid>(), "Could not find the grid.");
    GridRow row = webDriver.WaitUntil(() => grid.FindRow(contactName), "Could not find the contact row.");
    ```

1. Open the context menu.

    ```cs
    Actions actions = new Actions(webDriver);
    actions.ContextClick(row);
    actions.Perform();
    ```

1. Find the context menu and use the **ContextMenu.FindContextMenuItemByText** method to find the actual command to click.

    ```cs
    ContextMenuItem menuItem = webDriver.WaitUntil(() => webDriver.FindElement<ContextMenu>(),
                                                "Could not find the context menu.")
                                        .FindContextMenuItemByText("Delete");
    ```

1. Deal with the message box to verify that this Contact was deleted.

    ```cs
    menuItem.Click();

    portal.FindMessageBox("Delete contact").ClickButton("Yes");

    webDriver.WaitUntil(() => !portal.HasMessageBox, "There is still a message box in the Portal.");

    portal.StartBoard.FindSinglePartByTitle("Deleted");
    ```

### Full example

The entire example is in the following code.

```cs
using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Portal.TestFramework.Core;
using Microsoft.Selenium.Utilities;
using OpenQA.Selenium;
using Microsoft.Portal.TestFramework.Core.Shell;
using Microsoft.Portal.TestFramework.Core.Controls;
using OpenQA.Selenium.Interactions;

namespace SamplesExtensionTests
{
    [TestClass]
    public class Commands
    {
        private const string SamplesExtensionUrl = "http://localhost:11997";
        private const string SamplesExtensionWebSitePath = @"d:\Users\julioct\Documents\PortalSDK\FrameworkPortal\Extensions\SamplesExtension\Extension";
        private const string HubsExtensionUrl = "http://localhost:11998";
        private const string HubsExtensionWebSitePath = @"d:\Users\julioct\Documents\PortalSDK\FrameworkPortal\Extensions\HubsExtension";
        private static IWebDriver webDriver;
        private static PortalServer portalServer;
        private static WebServer samplesExtensionServer;
        private static WebServer hubsExtensionServer;

        [TestInitialize]
        public void TestInitialize()
        {
            hubsExtensionServer = new WebServer(new Uri(HubsExtensionUrl), HubsExtensionWebSitePath);
            if (hubsExtensionServer.IsHostedByTestFramework)
            {
                hubsExtensionServer.Start();
            }

            samplesExtensionServer = new WebServer(new Uri(SamplesExtensionUrl), SamplesExtensionWebSitePath);
            if (samplesExtensionServer.IsHostedByTestFramework)
            {
                samplesExtensionServer.Start();
            }

            portalServer = PortalServer.Create();

            if (portalServer.IsHostedByTestFramework)
            {
                portalServer.RegisterExtension("Hubs", new Uri(hubsExtensionServer.Uri));
                portalServer.RegisterExtension("Samples", new Uri(samplesExtensionServer.Uri));
                portalServer.Start();
            }

            webDriver = WebDriverFactory.Create();
            webDriver.Url = "about:blank";
            portalServer.ClearUserSettings();
        }

        [TestMethod]
        public void CanDeleteContactFromBlade()
        {
            var portal = this.NavigateToPortal();

            string contactName = "John Doe";
            string subscriptionName = "Portal Subscription 2";

            this.ProvisionContact(contactName, subscriptionName, portal);

            var blade = portal.FindSingleBladeByTitle(contactName);

            CommandBar commandBar = blade.FindCommandBar();

            var command = commandBar.FindCommandBarItem("DELETE");
            command.Click();

            commandBar.FindMessageBox("Delete contact").ClickButton("Yes");
            webDriver.WaitUntil(() => !commandBar.HasMessageBox,
								"There is still a message box in the command bar.");

            portal.StartBoard.FindSinglePartByTitle("Deleted");
        }

        [TestMethod]
        public void CanDeleteContactFromGrid()
        {
            var portal = this.NavigateToPortal();

            string contactName = "Jane Doe";
            string subscriptionName = "Portal Subscription 2";

            this.ProvisionContact(contactName, subscriptionName, portal);

            portal.StartBoard.FindSinglePartByTitle("Contacts").Click();
            var blade = portal.FindSingleBladeByTitle("Contacts List");
            var grid = webDriver.WaitUntil(() => blade.FindElement<Grid>(), "Could not find the grid.");
            GridRow row = webDriver.WaitUntil(() => grid.FindRow(contactName), "Could not find the contact row.");

            Actions actions = new Actions(webDriver);
            actions.ContextClick(row);
            actions.Perform();

            ContextMenuItem menuItem = webDriver.WaitUntil(() => webDriver.FindElement<ContextMenu>(),
                                                           "Could not find the context menu.")
                                                .FindContextMenuItemByText("Delete");
            menuItem.Click();

            portal.FindMessageBox("Delete contact").ClickButton("Yes");

            webDriver.WaitUntil(() => !portal.HasMessageBox, "There is still a message box in the Portal.");

            portal.StartBoard.FindSinglePartByTitle("Deleted");
        }

        [TestCleanup]
        public void TestCleanup()
        {
            webDriver.Dispose();
            portalServer.Dispose();
            samplesExtensionServer.Dispose();
            hubsExtensionServer.Dispose();
        }

        private void ProvisionContact(string contactName, string subscriptionName, Portal portal)
        {
            // Open and find the Create Form
            portal.StartBoard.FindSinglePartByTitle<ButtonPart>("New Contact").Click();

            var blade = portal.FindSingleBladeByTitle("Basic Information");
            var form = webDriver.WaitUntil(() => blade.FindElement<FormSection>(), "Could not find the form.");

            // Fill a textbox field
            string fieldName = "contactName";
            var field = webDriver.WaitUntil(() => form.FindField<Textbox>(fieldName),
											string.Format("Could not find the {0} textbox.", fieldName));
            field.Value = contactName + Keys.Tab;
            webDriver.WaitUntil(() => field.IsEdited && field.IsValid,
								string.Format("The {0} field did not pass validations.", fieldName));

            // Open a picker from a selector field and select an item
            fieldName = "subscriptionField";
            form.FindField<Selector>(fieldName).Click();

            blade = portal.FindSingleBladeByTitle("Select Subscription");

            var grid = webDriver.WaitUntil(blade.FindElement<Grid>, "Could not find the grid in the blade.");
            GridRow row = grid.SelectRow(subscriptionName);

            PickerActionBar pickerActionBar = webDriver.WaitUntil(() => blade.FindElement<PickerActionBar>(),
																  "Could not find the picker action bar.");
            webDriver.WaitUntil(() => pickerActionBar.OkButton.IsEnabled,
								"Expected the OK Button of the Picker Action Bar to be enabled after selecting an item in the picker list.");
            pickerActionBar.ClickOk();

            // Click the Create button
            blade = portal.FindSingleBladeByTitle("Basic Information");

            CreateActionBar createActionBar = webDriver.WaitUntil(() => blade.FindElement<CreateActionBar>(),
																  "Could not find the create action bar.");
            createActionBar.ClickOk();

            // There should be an open blade with 'John Doe' as its title
            portal.FindSingleBladeByTitle(contactName);
        }
    }
}

```


## Taking Screenshots while Testing

The Test Framework provides built-in support for taking screenshots from test cases. You can use the **WebDriver.TakeScreenshot** method to take the screenshot and save it as a PNG file to the local disk. You can do this at any point within the test case, but a typical approach is to do use the method in the test `CleanUp` method when the outcome of the test case is not "Passed" or if an assertion fails, as in the following example.

```cs
[TestCleanup]
public void TestCleanup()
{
    if (TestContext.CurrentTestOutcome != UnitTestOutcome.Passed && webDriver != null)
    {
        TestContext.AddResultFile(webDriver.TakeScreenshot(TestContext.TestRunResultsDirectory,
														   TestContext.TestName));
    }

    webDriver.Dispose();
    portalServer.Dispose();
    samplesExtensionServer.Dispose();
}
```

### Full example

The following example contains all the code for the test.

```cs
using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Portal.TestFramework.Core;
using Microsoft.Selenium.Utilities;
using OpenQA.Selenium;
using Microsoft.Portal.TestFramework.Core.Shell;

namespace SamplesExtensionTests
{
    [TestClass]
    public class Screenshots
    {
        public TestContext TestContext { get; set; }

        private const string SamplesExtensionUrl = "http://localhost:11997";
        private const string SamplesExtensionWebSitePath = @"d:\Users\julioct\Documents\PortalSDK\FrameworkPortal\Extensions\SamplesExtension\Extension";
        private static IWebDriver webDriver;
        private static PortalServer portalServer;
        private static WebServer samplesExtensionServer;

        [TestInitialize]
        public void TestInitialize()
        {
            samplesExtensionServer = new WebServer(new Uri(SamplesExtensionUrl), SamplesExtensionWebSitePath);
            if (samplesExtensionServer.IsHostedByTestFramework)
            {
                samplesExtensionServer.Start();
            }

            portalServer = PortalServer.Create();

            if (portalServer.IsHostedByTestFramework)
            {
                portalServer.RegisterExtension("Samples", new Uri(samplesExtensionServer.Uri));
                portalServer.Start();
            }

            webDriver = WebDriverFactory.Create();
            webDriver.Url = "about:blank";
            portalServer.ClearUserSettings();
        }

        [TestMethod]
        public void CanFindSamplesPart()
        {
            var portal = this.NavigateToPortal();

            // Intentional mistake. There is no part with this title in the StartBoard,
            // so the call to FindSinglePartByTitle will fail
            string samplesTitle = "The Samples";

            var samplesPart = portal.StartBoard.FindSinglePartByTitle<ButtonPart>(samplesTitle);
            samplesPart.Click();
        }

        [TestCleanup]
        public void TestCleanup()
        {
            if (TestContext.CurrentTestOutcome != UnitTestOutcome.Passed && webDriver != null)
            {
                TestContext.AddResultFile(webDriver.TakeScreenshot(TestContext.TestRunResultsDirectory,
																   TestContext.TestName));
            }

            webDriver.Dispose();
            portalServer.Dispose();
            samplesExtensionServer.Dispose();
        }
    }
}
```

### Loading a subset of extensions

There are some instances during test where you may want to only load your extension or a subset of extensions within the Portal. You can do this using the `feature.DisableExtensions` feature flag.
Usage is as follows.

```
?feature.DisableExtensions=true&HubsExtension=true&Microsoft_Azure_Support=true&MyOtherExtension=true
```

*  This will make every extension disabled by default.
*  This will enable hubs, which are used by most developers 
*  This will enable the specific extension you want to test.
*  You can add multiple extensions,  like the` HubsExtension=true and MyOtherExtension=true` if you want to test other extensions.

### Disabling a specific extension

If you want to disable a single extension, you can use the `canmodifyextensions` feature flag as in the following code.

`?feature.canmodifyextensions=true&ExtensionNameToDisable=false`

For example, if you want to turn off an old extension and turn on a new one, you can use the following code. 

```
?feature.canmodifyextensions=true&MyOldExtension=false&MyNewExtension=true
```

{"gitdown": "include-file", "file": "../templates/portalfx-csharp-test-publish.md"}

{"gitdown": "include-file", "file": "../templates/portalfx-extensions-bp-csharp-test.md"}

<!--
gitdown": "include-file", "file": "../templates/portalfx-extensions-glossary-testing.md"}
-->
