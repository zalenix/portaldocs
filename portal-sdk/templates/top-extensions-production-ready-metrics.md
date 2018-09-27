## Production Ready Metrics and Quality Metrics
      
The Portal team has established standard quality metrics that help you determine if your extension is ready to be made available to the general public (public preview or GA). You are expected to meet this criteria before shipping and maintain high quality over time.

The metrics are reported as part of an executive summary every Friday. Extensions that fail to meet the criteria are flagged in the report and may be asked to come to the regular executive product syncs to discuss their quality issues. This document discusses production-ready metrics for the following topics.

* [Performance](#performance)
* [Reliability](#reliability)
* [Usability](#usability)
* [Accessibility](#accessibility)
* [Localization](#localization)
* [Create Success Rate](#create-success-rate)
* [Resource move](#resource-move)

The following table contains links to more information about each topic as appropriate.

| Document | Purpose |
| -------- | ------- |
|  Power BI Dashboard for Performance and Reliability | [http://aka.ms/portalfx/dashboard/extensionperf](http://aka.ms/portalfx/dashboard/extensionperf) |
| Power BI Dashboard for Success Rates | [https://aka.ms/portalfx/successrates](https://aka.ms/portalfx/successrates) |
| Power BI Dashboard for Status | [http://aka.ms/portalfx/resourcemove/dashboard](http://aka.ms/portalfx/resourcemove/dashboard) |
| Performance Query |     [https://aka.ms/portalfx/perfsignoff](https://aka.ms/portalfx/perfsignoff) |
| Performance Checklist | [portalfx-performance-overview.md](portalfx-performance-overview.md) |
| Telemetry Access  | [top-extensions-telemetry.md](top-extensions-telemetry.md) |
| Best practices |     [portalfx-extensions-bp-performance.md](portalfx-extensions-bp-performance.md) |
| Stackoverflow  |    [portalfx-stackoverflow.md](portalfx-stackoverflow.md) |

###	Performance

**BladeFullReady** is the time it takes a blade to fully load. Your blades should load faster than 4 seconds at the 95th percentile.

You should see at least 100 loads of the UX (extension/blade/tiles) to get a reliable signal. If you cannot generate that traffic authentically in the expected timeframe, please hold a bug bash to increase the traffic. Also ensure that the  URL for the extension does not include the `feature.canmodifyextensions` flag.

You can calculate the performance and reliability of an extension by running the query that is located at [https://aka.ms/portalfx/perfsignoff](https://aka.ms/portalfx/perfsignoff). It is also included in the following code.

```json
// First parameter startDate
// Second parameter timeSpan
// Third parameter includeTestTraffic - set this to `false` if you are already in public preview
GetExtensionPerfReliability(now(),7d,true) 
| where extension == "<extensionName>"

```

where 

`<extensionName>`, without the angle brackets, is  replaced with the unique name of the extension as defined in the `extension.pdl` file.

If any of the performance computations are below the bar, please investigate and resolve the related issues.

There is also a Power BI Dashboard that displays computations only for genuine traffic, and it is located at [http://aka.ms/portalfx/dashboard/extensionperf](http://aka.ms/portalfx/dashboard/extensionperf).

###	Reliability

Every extension meets the reliability Service Level Agreement (SLA) of loading successfully at least 99% of the time.This applies to extension loads, blade loads, and part loads. This should be met previousw to enabling the extension in the production environment; however, extensions must be enabled in MPAC in order to start tracking reliability. Meeting the reliability bar is a requirement for public preview or GA.

MPAC and PROD reliability are included in weekly status emails and each team is expected to investigate regressions.

We require at least 100 loads of the UX (extension/blade/tiles) to get a signal. If you cannot generate that traffic authentically in the expected timeframe, please hold a bug bash to increase traffic.  Also ensure that the  URL for the extension does not include the `feature.canmodifyextensions` flag.

To calculate the performance and reliability of your extension, use the query located at [https://aka.ms/portalfx/perfsignoff](https://aka.ms/portalfx/perfsignoff). It is also in the following code.
    
```json 
    // First parameter startDate
    // Second parameter timeSpan
    // Third parameter includeTestTraffic - set this to `false` if you are already in public preview
    GetExtensionPerfReliability(now(),7d,true) 
    | where extension == "<extensionName>"
```

where 

`<extensionName>`, without the angle brackets, is  replaced with the unique name of the extension as defined in the `extension.pdl` file.

If any of the reliability computations are below the bar, please investigate and resolve the related issues.

###	Usability

Each service or extension defines the critical P0 scenarios for their business. The extension is tested using these usability scenarios, with at least ten participants. A success rate of 80% and an experience score of 80% are required for a passing usability score.

If you do not have access to a user research team, then please contact the <a href="mailto:ibiza-onboarding@microsoft.com?subject=Need%20User%20Research%20Team">Portal team</a> for assistance.

###	Accessibility

The accessibility bar is similar to the usability bar, and every service must meet the accessibility standards that are tested in their critical P0 scenarios. C+E teams should work with the core C + E accessibility team. 
    
**NOTE**: Accessibility, like security review, is a blocking requirement.

For more information about accessibility, see [top-extensions-accessibility.md](top-extensions-accessibility.md).
    
### Localization

Nearly 70% of Azure users are from outside of the United States. Therefore, it is important to make Azure a globalized product. There are a few requirements under the "Internationalization" criteria that your service is required to support.  This is the same set of languages that are supported by Azure Portal for GA. For more information about internationalization requirements, see [http://aka.ms/azureintlrequirements](http://aka.ms/azureintlrequirements). For onboarding localization, please reach out to Bruno Lewin and the Internationalization team at <a href="mailto:ibiza-interntnl@microsoft.com?subject=Onboarding%20localization">Internationalization team</a>.

###	Create Success Rate
    
The user's ability to purchase or create Azure resources is a critical scenario for the product. Users fill out a form to create a resource, then the form content passes validation, and they click the Create button. When a user gets to this point, the create operation should succeed at least 99% of the time.
     
Extensions and Resource Providers (RPs) are responsible for validating all inputs to ensure the Create is not submitted unless that Create will be successful. This applies to all services.

Services that use ARM template deployment and other ARM-based services should also validate resource provider registration, permissions, and deployment to avoid common issues and improve extension success rates. 
  
You can measure your current success rates on create blades that are live running queries on the dashboard located at [https://aka.ms/portalfx/successrates](https://aka.ms/portalfx/successrates).

For more information about creating success, see [top-extensions-create.md#validation](top-extensions-create.md#validation).

## Resource move

ARM-based services allow customers to move resources between subscriptions and resource groups. You should support this in the UX.

For more information on resource moves, see [portalfx-resourcemove.md](portalfx-resourcemove.md).
