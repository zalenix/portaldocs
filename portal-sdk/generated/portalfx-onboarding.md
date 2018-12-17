<a name="azure-portal-onboarding"></a>
# Azure Portal Onboarding

<a name="azure-portal-onboarding-start-onboarding"></a>
## Start Onboarding

* For onboarding a **first-party extension** i.e. an extension  in Azure Portal, please email with following information to:

Stakeholders: [Leon Welicki, Adam Abdelhamed, Amit Modi](mailto:ibiza-onboading-kick@microsoft.com?subject=Azure%20portal%20onboarding)

    * Is your service targeting public Azure, on-prem, or both?
    * Service name
    * VP, PM, and engineering owners
    * Timelines (preview, GA)
    * Summary of the service and target scenarios

* For onboarding a **third-party extension** i.e. you are an external partner, please email with following information to:

Stakeholders: [Leon Welicki, Adam Abdelhamed](mailto:ibiza-onboading-kick@microsoft.com?subject=Azure%20portal%20onboarding)

    * Is your service targeting public Azure, on-prem, or both?
    * Service name
    * Summary of the service and target scenarios

Most extensions have been successful by setting up early design review with Azure portal team. This gives extension owners an opportunity to understand how they can leverage Azure portal's Design guidelines in their extension.

feasible.
<a name="azure-portal-onboarding-subscribe-to-announcements"></a>
## Subscribe to announcements

Extension developers and program managers can stay upto date on product roadmap , latest features and workshop announcements by subscribing  to follwing DLs:

* PMs should join [ibizapartners-pm](http://igroup/join/ibizapartners-pm)
* Devs should join [ibizapartners-dev](http://igroup/join/ibizapartners-dev)
* To learn about upcoming breaking changes, join [ibizabreak](http://igroup/join/ibizabreak)

<a name="azure-portal-onboarding-ask-questions-on-stackoverflow-ms-https-stackoverflow-microsoft-com"></a>
## Ask questions on <a href="https://stackoverflow.microsoft.com">Stackoverflow@MS</a>

Join the extension developer community on [Stackoverflow@MS](https://stackoverflow.microsoft.com)  and let us know if you have any questions. Don't forget to tag questions with "ibiza" or [related](portalfx-stackoverflow.md) tags.

<a name="azure-portal-onboarding-learn-from-samples"></a>
## Learn from Samples

1. Explore samples in Dogfood environment:

We understand that the best way to learn extension development is by looking at the code so Azure portal team ships samples that extension developers can leverage .

First-party extension developers i.e. Microsoft employees have access to Dogfood environment so they can browse thorugh the [samples](http://aka.ms/portalfx/samples#blade/SamplesExtension/SDKBlade) in DOGFOOD environment.

Both First-party and Third-party extension developers can install and run samples extension on their local machine.


7. **[Side-load your extension for local testing](/portal-sdk/generated/index-portalfx-extension-development.md#debugging-testing-in-production)**

   Side-loading allows you to test and debug your extension locally against any environment. This is the preferred method of testing.

9. **Marketplace integration**

   At a high level, each icon you see in the Azure Portal Marketplace is referred to as a Gallery item. Gallery items
   take the form of a file with the .azpkg extension. You can think of this file as a zip which contains all assets for
   your gallery item: icons, screenshots, descriptions.

   **PROD**: The Marketplace team accepts fully finished .azkpg files from your team and performs upload to Production <a HREF="mailto:1store@microsoft.com?subject=Marketplace Onboarding Request&body=Attach your *.azpkg to this email, fill in the replacements and send.%0A%0AHi 1store, I would like to onboard the attached package to Prod. %0A%0AIn addition to the Marketplace I &lt;do/don't&gt; want to be included in the '+' New flyout experience">Click to request 1store onboarding</a> your gallery package.

   **DOGFOOD**: Use AzureGallery.exe to upload items to DOGFOOD using the following command:

   `AzureGallery.exe upload -p ..\path\to\package.azpkg -h [optional hide key]`

   In order to use the gallery loader you will need to set some values in the AzureGallery.exe.config file for details see [AzureGallery.exe docs](../../gallery-sdk/generated/index-gallery.md#gallery-item-specificiations). For dev/test scenarios see [Test In Prod](../../gallery-sdk/generated/index-gallery.md##gallery-package-development-and-debugging-testing-in-production)

1. **Recommended patterns**

   The following patterns are recommended for every extension based on customer feedback and usability studies, but are
   not required:

   - **Menu blade**

     All services should use the menu blade instead of the Settings blade. ARM resources should opt in to the resource
     menu for a simpler, streamlined menu.

     See also:
     - [#ibiza-blades-parts on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-blades-parts) for menu blade questions
     - [#ibiza-resources on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-resources) for resource menu questions
     - [Ask a menu blade question](https://stackoverflow.microsoft.com/questions/ask?tags=ibiza-blades-parts)
     - [Ask a resource menu question](https://stackoverflow.microsoft.com/questions/ask?tags=ibiza-resources)

   - **Activity logs** (Stakeholder: [Rajesh Ramabathiran](mailto:ibiza-activity-logs@microsoft.com))

      Activity/event/operation/audit logs should be available from the menu for all services. Subscription-based
      resources (not just tracked resources) get this for free when implementing the resource menu. All other services
      should add the equivalent experience for their service.

   - **Create blades**

     All Create blades should be a single blade. **Do not use wizards or picker blades.** Use form sections and
     dropdowns. Subscription-based resources should use the built-in subscription, resource group, location, and
     pricing dropdowns; especially in Create blades. These each cover common scenarios that will save time and avoid
     deployment failures. The subscription, resource group, and location picker blades have been deprecated.

     Every service should also expose a way to get scripts to automate provisioning. Automation options should include
     CLI, PowerShell, .NET, Java, Node, Python, Ruby, PHP, and REST (in that order). ARM-based services that use
     template deployment are opted in by default.

     See also:
     - [Create documentation](/portal-sdk/generated/index-portalfx-extension-development.md#common-scenarios-building-create-experiences)
     - [#ibiza-create on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-create)
     - [Ask a question](https://stackoverflow.microsoft.com/questions/ask?tags=ibiza-create)

   - **Browse (resource list) blades**

      All Browse blades should have:
      - "Add" command to help customers create new resources quickly
      - Context menu commands in the "..." menu for each row
      - Show all resource properties in the column chooser

      See also:
      - [Browse documentation](portalfx-browse.md)
      - [Asset documentation](portalfx-assets.md)
      - [#ibiza-browse on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-browse)
      - [Ask a question](https://stackoverflow.microsoft.com/questions/ask?tags=ibiza-browse)

   - **Export template / RP schema**

     ARM RPs must provide a schema for all tracked and nested resource types to ensure they support the export template
     capability. Export template is enabled by default from the resource menu.

     See also:
     - [RP schema documentation](http://aka.ms/rpschema)

0. **Register your extension**

   Once your service name is finalized, request to have your extension registered in all environments. Once deployed to
   DOGFOOD (aka DF), contact the Fx team to request that it be enabled (if applicable). Your extension will be enabled
   in production once all exit criteria have been met.

   Extension names must use standard extension name format: `Company_BrandOrSuite_ProductOrComponent` 
   (e.g. `Contoso_Azure_{extension}` or `Microsoft_Azure_{extension}`). Set the extension name in `extension.pdl` as
   follows:

   `<Extension Name="Company_BrandOrSuite_ProductOrComponent" Preview="true">`

   Extension URLs must use a standard CNAME pattern. Create CNAMEs using
   [Microsoft's DNS](http://msinterface/form.aspx?ID=4260) (use any Azure property as the identity).

   | Environment     | URL |
   | --------------- | ----- |
   | **DOGFOOD**     | `df.{extension}.onecloud-ext.azure-test.net` |
   | **PROD**        | `main.{extension}.ext.azure.com` |
   | **BLACKFOREST** | `main.{extension}.ext.microsoftazure.de` |
   | **FAIRFAX**     | `main.{extension}.ext.azure.us` |
   | **MOONCAKE**    | `main.{extension}.ext.azure.cn` |

   Use a wildcard SSL cert for each environment to simplify maintenance (e.g. `*.{extension}.onecloud-ext.azure-test.net`
   or `*.{extension}.ext.azure.com`). If your team is building separate, independent extensions, you can also use
   `{extension}.{team}.ext.azure.com` and create a wildcard SSL cert for `*.{team}.ext.azure.com` to simplify overall
   management. Internal teams can create SSL certs for DF using [http://ssladmin](http://ssladmin). Production certs
   must follow your organizations PROD cert process -- **do not use SSL Admin for production certs**.

   **NOTE** : Registering an extension in Portal requires deployment so it can take almost 10 days. Please plan accordingly.

   [Request to register your extension (internal only)](https://aka.ms/portalfx/newextension) and email the work item id
   to [ibizafxpm](mailto:ibizafxpm@microsoft.com?subject=Register%20extension). You'll automatically be notified when the
   configuration change is pushed to PROD. External teams can
   <a href="mailto:ibizafxpm@microsoft.com?subject=[Onboarding Request] Add &lt;Name&gt; extension to the portal&body=Extension name:  Company_[BrandOrSuite_]ProductOrComponent (e.g. Contoso_SomeSku_SomeProduct or Contoso_SomeProduct)%0A%0AURLs  (must adhere to pattern)%0APROD-- main.&lt;extension&gt;.ext.contoso.com%0A%0AContact info%0ABusiness Contacts:_________%0ADev leads: _________%0APROD on-call email: _________%0A">submit their request via email</a>.

1. **[Exit criteria + quality metrics](portalfx-onboarding-exitcriteria.md)**

   Every extension must meet required exit criteria / quality metrics before it will be enabled.

For any other questions, don’t hesitate to ask us on [https://stackoverflow.microsoft.com](https://stackoverflow.microsoft.com).
