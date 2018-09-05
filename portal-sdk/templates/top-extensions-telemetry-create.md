
## PowerBi dashboards

## Overview

The Create Flow PowerBi dashboard that is located at [needs link](needs link) gives you live access to your extension's create flow telemetry.

<!-- TODO: Validate that this security group is still needed to access the create flow dashboard. -->

To access to the Create Flow Dashbaord, you will need to join the Security Group 'Azure Portal Data' (auxdatapartners) by using the site located at [http://idwebelements/GroupManagement.aspx?Group=auxdatapartners&Operation=join](http://idwebelements/GroupManagement.aspx?Group=auxdatapartners&Operation=join).

All report-generating queries are performed against the **AzurePortal.AzPtlCosmos** database **ClientTelemetry** table. To become familiar with the table, you may want to review the PortalFx Telemetry - Kusto Databases  the document located at [portalfx-telemetry-getting-started.md](portalfx-telemetry-getting-started.md).

To run or create modified versions of the Kusto queries, you will need access to the  **Kusto** data tables. How to get setup using Kusto and getting access is explained in the document located at [portalfx-telemetry-getting-started.md](portalfx-telemetry-getting-started.md).

The following reports contain information that will help you tune the performance of your extension.

* [Create Flow reports](#create-flow-reports)

* [Error Distribution Reports](#error-distribution-reports)

For more information about telemetry, see [portalfx-telemetry.md](portalfx-telemetry.md).

For more information about **Kusto**, see [https://aka.ms/kusto](https://aka.ms/kusto).

## Create flow reports

There are several reports for the Create Flow.

* The Create Flow Funnel reports that are specified in [#create-flow-funnel-reports](#create-flow-funnel-reports) allows you to view live create flow telemetry, which is an overview of the blade's usage and deployment success numbers.

* The Create Flow Origin report that is specified in [#create-flow-origin-report](#create-flow-origin-report) provides an overview of link and launch data for the blade. 

* The Create Flow Errors Report that is specified in [#create-flow-errors-report](#create-flow-errors-report) contains information about create errors, billing issues, and cancellations for the blade.

### Create flow funnel reports

The Create Flow Funnel reports allow you to view live create flow telemetry, which is an overview of the blade's usage and deployment success numbers. The data fields in the report are as follows.

* **Create Flow Launched**: The number of times the blade was opened by users.

* **Deployment Started**: The number of times that a create was started by the blade.

* **Deployment Started %**: A percentage representing how often the opening of the blade being opened leads to a create being started. 

* **Deployment Succeeded**: The number of successful create deployements.

* **Deployment Succeeded %**: The percentage of creates that led to a successful deployment. Unsuccessful deployments would include cancellations and failures.

* **Old Create API**:  If this field contains the value `true`, the blade is using a deprecated Parameter Collector, as specified in [portalfx-extension-reference-obsolete-bundle.md](portalfx-extension-reference-obsolete-bundle.md).  This implies that its create telemetry may be undependable and is potentially inaccurate. You should  update the blade to use the new V3 Parameter Collector, as specified in  [portalfx-parameter-collection-getting-started.md](portalfx-parameter-collection-getting-started.md).  This code upgrade will set the value of the field to `false`.
       
* **Custom Deployment**:  If this field contains the value `true`, the create blade does not go through the official ARM Provisioner,  and therefore only receives limited telemetry reporting. If your experience's create deployments go through ARM  but you are not using ARM provisioning then see the Create Engine documentation located at [portalfx-create-engine-sample.md](portalfx-create-engine-sample.md).

The following four Kusto queries are used to retrieve create flow data to generate these numbers.

*  Create Flow Funnel 

    ```js
    let timeSpan = 30d;
    let startDate = GetStartDateForLastNDays(timeSpan);
    let endDate = GetEndDateForTimeSpanQueries();
    GetCreateFunnel(startDate, endDate)
    ```

* Create Flow Funnel By Resource Name

    ```js
    let timeSpan = 30d;
    let startDate = GetStartDateForLastNDays(timeSpan);
    let endDate = GetEndDateForTimeSpanQueries();
    GetCreateFunnelByResourceName(startDate, endDate)
    ```

* Create Flow Funnel Success Rate 

    ```js
    let timeSpan = 30d;
    let startDate = GetStartDateForLastNDays(timeSpan);
    let endDate = GetEndDateForTimeSpanQueries();
    GetCreateFunnelByDay(startDate, endDate)
    | extend DeploymentSucceededPerc = iff(DeploymentStarted == 0, 0.0, todouble(DeploymentSucceeded)/DeploymentStarted)
    | project Date, ExtensionName, CreateBladeName, DeploymentSucceededPerc 
    ```

* Create Flow Funnel Weekly Deployment Success 

    ```js
    let today = floor(now(),1d); 
    let fri= today - dayofweek(today) - 2d; 
    let sat = fri - 6d; 
    let startDate = sat-35d; 
    let endDate = fri; 
    GetCreateFunnelByDay(startDate, endDate) 
    | where Unsupported == 0 and CustomDeployment == 0 
    | extend startOfWeek = iff(dayofweek(Date) == 6d,Date , Date - dayofweek(Date) - 1d) 
    | summarize sum(CreateFlowLaunched), sum(DeploymentStartedWithExclusions), sum(DeploymentSucceeded) by startOfWeek, ExtensionName 
    | extend ["Deployment Success %"] = iff(sum_DeploymentStartedWithExclusions == 0, todouble(0), bin(todouble(sum_DeploymentSucceeded)/sum_DeploymentStartedWithExclusions*100 + 0.05, 0.1)) 
    | project startOfWeek, ["Extension"] = ExtensionName, ["Deployment Success %"]
    ```

### Create flow origin report

The Create flow origin report indicates which extensions are linking to the blade and which ones are launching the blade.

The data fields in the Create Flow Origin report are as follows.

* **Create Flow Launched**:  The number of times the blade was opened by users.
* **New (%)**:  The percentage representing how often the blade is opened from +New.
* **Browse (%)**:  The percentage representing how often the  blade is opened from Browse.
* **Marketplace (%)**:  The percentage representing how often the  blade is opened from the Marketplace.
* **DeepLink (%)**:  The percentage representing how often the  blade is opened from an internal or external link.

The following code can be used to generate these numbers.

* Create Flow Origins 
 
    ```js
    let timeSpan = 30d;
    let selectedData = 
    GetClientTelemetryByTimeSpan(timeSpan, false)
    | union (GetExtTelemetryByTimeSpan(timeSpan, false));

    selectedData
    | where Action == "CreateFlowLaunched"
    | extend 
        CreateBladeName = _GetCreateBladeNameFromData(Data, ActionModifier),
        ExtensionId = _GetCreateExtensionNameFromData(Data, ActionModifier),
        OriginFromMenuItemId = extractjson("$.menuItemId", Data, typeof(string)),
        DataContext = extractjson("$.context", Data, typeof(string))
    | extend OriginFromDataContext = extract('([^,"]*Blade[^,"]*)', 1, DataContext)
    | project CreateBladeName, ExtensionId, Origin = iff(OriginFromMenuItemId == "recentItems" or OriginFromMenuItemId == "deepLinking", OriginFromMenuItemId, OriginFromDataContext), DataContext 
    | extend Origin = iff(Origin == "", DataContext, Origin)
    | summarize CreateFlowLaunched = count() by ExtensionId, CreateBladeName, Origin
    | summarize 
        CreateFlowLaunched = sum(CreateFlowLaunched), 
        New = sum(iff(Origin contains "recentItems" or Origin contains "GalleryCreateMenuResultsListBlade", CreateFlowLaunched, 0)),
        Browse = sum(iff(Origin contains "BrowseResourceBlade", CreateFlowLaunched, 0)),
        Marketplace = sum(iff(Origin contains "GalleryItemDetailsBlade" or Origin contains "GalleryResultsListBlade" or Origin contains "GalleryHeroBanner", CreateFlowLaunched, 0)),
        DeepLink = sum(iff(Origin contains "deepLinking", CreateFlowLaunched, 0))
    by ExtensionId, CreateBladeName 
    | join kind = inner (ExtensionLookup | extend ExtensionId = Extension) on ExtensionId
    | project
        ["Extension Name"] = ExtensionName, 
        ["Create Blade Name"] = CreateBladeName, 
        ["Create Flow Launched"] = CreateFlowLaunched,
        ["+New"] = New,
        ["+New (%)"] = todouble(New) / CreateFlowLaunched,
        ["Browse"] = Browse,
        ["Browse (%)"] = todouble(Browse) / CreateFlowLaunched,
        ["Marketplace"] = Marketplace,
        ["Marketplace (%)"] = todouble(Marketplace) / CreateFlowLaunched,
        ["DeepLink"] = DeepLink,
        ["DeepLink (%)"] = todouble(DeepLink) / CreateFlowLaunched
    ```

### Create Flow Errors report

The Create Flow Errors report gives you an overview of create blade create errors, billing issues, and cancellations. The data fields in the report are as follows.

* **Deployment Cancelled Count**: The number of cancalled deployments.

* **Billing Error Count**: The number of deployments that resulted in the biling error "no credit card on file".

* **Total Errors Count**: The total number of deployments that resulted in a  failure or error.

* **Deployment Failed %**: The percentage of deployments that resulted in a failure or error.

* **Error Submitting Deployment Request %**: The percentage of failed deployments that were due to the error "Error Submitting Deployment Request".

* **Error Provisiong Resource Group %**: The percentage of failed deployments that were due to  the error "Error Provisiong Resource Group".

* **Error Registering Resource Providers %**: The percentage of failed deployments that were due to  the error "Error Registering Resource Providers".

* **Unknown Failure %**: The percentage of failed deployments that were due to  the error "Unknown Failure".

* **Deployment Request Failed %**: The percentage of failed deployments that were due to  the error "Deployment Request Failed".

* **Error Getting Deployment Status %**: The percentage of failed deployments that were due to  the error "Error Getting Deployment Status".

* **Deployment Status Unknown %**: The percentage of failed deployments that were due to  the error "Deployment Status Unknown".

* **Invalid Args %**: The percentage of failed deployments that were due to  the error "Invalid Args".

* **Old Create API**:  If this field contains the value `true`, the blade is using a deprecated Parameter Collector, as specified in [portalfx-extension-reference-obsolete-bundle.md](portalfx-extension-reference-obsolete-bundle.md).  This implies that its create telemetry may be undependable and is potentially inaccurate. You should  update the blade to use the new V3 Parameter Collector, as specified in  [portalfx-parameter-collection-getting-started.md](portalfx-parameter-collection-getting-started.md).  This code upgrade will set the value of the field to `false`.

* **Custom Deployment**:  If this field contains the value `true`, the create blade does not go through the official ARM Provisioner,  and therefore only receives limited telemetry reporting. If your experience's create deployments go through ARM  but you are not using ARM provisioning then see the Create Engine documentation located at [portalfx-create-engine-sample.md](portalfx-create-engine-sample.md).

The following code can be used to generate these numbers.

* Create Flow Errors 

    ```js
    let timeSpan = 30d;
    let startDate = GetStartDateForLastNDays(timeSpan);
    let endDate = GetEndDateForTimeSpanQueries();

    let errors = 
    (GetClientTelemetryByDateRange(startDate, endDate, false)
    | union (GetExtTelemetryByDateRange(startDate, endDate, false))
    | where Action == "ProvisioningEnded" and ActionModifier == "Failed" and isnotempty(Name))
    | union (_GetArmCreateEvents(startDate, endDate) | where ExecutionStatus in ("Failed", "Cancelled", "BillingError") and isnotempty(Name))
    | extend
        Date = bin(PreciseTimeStamp, 1d)
        | join kind = leftouter (
            _GetCreateBladesMapping(startDate, endDate)
            | project Date, Name, 
                ExtensionIdCurrent = ExtensionId, 
                CreateBladeNameCurrent = CreateBladeName, 
                UnsupportedCurrent = Unsupported, 
                CustomDeploymentCurrent = CustomDeployment
        ) on Date, Name 
        // Join again on previous day's mappings to cover case when mapping is not found in current day
        | join kind = leftouter (
            _GetCreateBladesMapping(startDate - 1d, endDate - 1d)
            | project Date, Name, 
                ExtensionIdPrev = ExtensionId, 
                CreateBladeNamePrev = CreateBladeName, 
                UnsupportedPrev = Unsupported, 
                CustomDeploymentPrev = CustomDeployment
            | extend Date = Date + 1d
        ) on Date, Name 
        // Use current day's mapping if available, otherwise, use previous day
        | extend 
            ExtensionId = iff(isnotempty(ExtensionIdCurrent), ExtensionIdCurrent, ExtensionIdPrev),
            CreateBladeName = iff(isnotempty(ExtensionIdCurrent), CreateBladeNameCurrent, CreateBladeNamePrev),
            Unsupported = iff(isnotempty(ExtensionIdCurrent), UnsupportedCurrent, UnsupportedPrev),
            CustomDeployment = iff(isnotempty(ExtensionIdCurrent), CustomDeploymentCurrent, CustomDeploymentPrev)
    | where isnotempty(ExtensionId) and isnotempty(CreateBladeName)
    | extend ExecutionStatus = iff(Action == "ProvisioningEnded", extractjson("$.provisioningStatus", Data, typeof(string)), ExecutionStatus);

    errors
    | summarize
        CustomDeploymentErrorsCount = count(Action == "ProvisioningEnded" and ActionModifier == "Failed"),
        // We exclude ProvisioningEnded events with ExecutionStatus in ("DeploymentFailed", "DeploymentCanceled") from ARMDeploymentErrorsCount as in this case, we get the number of deployments that failed or were cancelled from ARM.
        ARMDeploymentErrorsCount = count((Action startswith "CreateDeployment") or (Action == "ProvisioningEnded" and ExecutionStatus !in ("DeploymentFailed", "DeploymentCanceled")))
    by ExtensionId, CreateBladeName, Unsupported, CustomDeployment
    | join kind = inner (
        errors
        | summarize
            ARMFailed = count(Action startswith "CreateDeployment" and ExecutionStatus == "Failed"),
            ARMCancelled = count(Action startswith "CreateDeployment" and ExecutionStatus == "Cancelled"),
            ARMBillingError = count(Action startswith "CreateDeployment" and ExecutionStatus == "BillingError"),
            Failed = count(Action == "ProvisioningEnded" and ExecutionStatus == "DeploymentFailed"),
            Cancelled = count(Action == "ProvisioningEnded" and ExecutionStatus == "DeploymentCanceled"),
            ErrorSubmitting = count(Action == "ProvisioningEnded" and ExecutionStatus == "ErrorSubmittingDeploymentRequest"),
            ErrorProvisioning = count(Action == "ProvisioningEnded" and ExecutionStatus == "ErrorProvisioningResourceGroup"),
            ErrorRegistering = count(Action == "ProvisioningEnded" and ExecutionStatus == "ErrorRegisteringResourceProviders"),
            ErrorGettingStatus = count(Action == "ProvisioningEnded" and ExecutionStatus == "ErrorGettingDeploymentStatus"),
            InvalidArgs = count(Action == "ProvisioningEnded" and ExecutionStatus == "InvalidArgs"),
            UnknownFailure = count(Action == "ProvisioningEnded" and ExecutionStatus == "UnknownFailure"),
            RequestFailed = count(Action == "ProvisioningEnded" and ExecutionStatus == "DeploymentRequestFailed"),
            StatusUnknown = count(Action == "ProvisioningEnded" and ExecutionStatus == "DeploymentStatusUnknown")
        by ExtensionId, CreateBladeName, Unsupported, CustomDeployment)
    on ExtensionId, CreateBladeName, Unsupported, CustomDeployment
    | extend Failed = iff(CustomDeployment, Failed, ARMFailed)
    | extend Cancelled = iff(CustomDeployment, Cancelled, ARMCancelled)
    | extend BillingError = iff(CustomDeployment, 0, ARMBillingError)
    | extend TotalCount = iff(CustomDeployment, CustomDeploymentErrorsCount, ARMDeploymentErrorsCount) - Cancelled - BillingError
    | extend TotalCountDbl = todouble(TotalCount)
    | join kind = leftouter (ExtensionLookup | extend ExtensionId = Extension) on ExtensionId
    | project
        ["Extension Name"] = ExtensionName,
        ["Create Blade Name"] = CreateBladeName,
        ["Deployment Cancelled Count"] = Cancelled,
        ["Billing Error Count"] = BillingError,
        ["Total Errors Count"] = TotalCount,
        ["Deployment Failed %"] = iff(TotalCountDbl == 0.0, 0.0, Failed / TotalCountDbl),
        ["Error Submitting Deployment Request %"] = iff(TotalCountDbl == 0.0, 0.0, ErrorSubmitting / TotalCountDbl),
        ["Error Provisioning Resource Group %"] = iff(TotalCountDbl == 0.0, 0.0, ErrorProvisioning / TotalCountDbl),
        ["Error Registering Resource Providers %"] = iff(TotalCountDbl == 0.0, 0.0, ErrorRegistering / TotalCountDbl),
        ["Error Getting Deployment Status %"] = iff(TotalCountDbl == 0.0, 0.0, ErrorGettingStatus / TotalCountDbl),
        ["Invalid Args %"] = iff(TotalCountDbl == 0.0, 0.0, InvalidArgs / TotalCountDbl),
        ["Unknown Failure %"] = iff(TotalCountDbl == 0.0, 0.0, UnknownFailure / TotalCountDbl),
        ["Deployment Request Failed %"] = iff(TotalCountDbl == 0.0, 0.0, RequestFailed / TotalCountDbl),
        ["Deployment Status Unknown %"] = iff(TotalCountDbl == 0.0, 0.0, StatusUnknown / TotalCountDbl),
        ["Old Create API"] = Unsupported,
        ["Custom Deployment"] = CustomDeployment
    ```

## Error Distribution Reports 

The  Error Distribution reports give an overview of the errors that have occurred over the last week, including the progress from the previous week's errors. This is also known as Week or Week (WoW).

* Error Distribution

    The high level errors that occurred for all deployments in the last week.

* Error Distribution By Extension

    The number of create deployment errors that occurred  over the last week for  each extension.

* Error Distribution By Error Code

    The number of create deployment errors that occurred  over the last week for  each extension.

* Innermost Error Distribution

    Reviews  the 'innermost error' in error messages  for create deployment failures. Error messages are often nested as they they reach different points of provisioning and have different stages record the failure reason. Consequently, the 'innermost error' should be the original reason why a create deployment failed.

The following code can be used to generate these numbers.

* Create Error Distribution 

    ```js
    let today = floor(now(),1d);
    let sat = today - dayofweek(today) - 8d;
    let fri =  sat + 6d;
    ClientTelemetry
    | where PreciseTimeStamp >= sat and PreciseTimeStamp < fri + 1d
    | where Action == "ProvisioningEnded" and ActionModifier == "Failed"
    | extend provisioningStatus = extractjson("$.provisioningStatus", Data, typeof(string)),
    isCustomProvisioning = extractjson("$.isCustomProvisioning", Data, typeof(string)),
    oldCreateApi = extractjson("$.oldCreateApi", Data, typeof(string)),
    launchingContext = extract('"launchingContext"\\s?:\\s?{([^}]+)', 1, Data)
    | where isnotempty(launchingContext) and isempty(extract("^(\"telemetryId\":\"[^\"]*\")$", 1, launchingContext)) and oldCreateApi != "true" and isCustomProvisioning != "true" and provisioningStatus != "DeploymentCanceled"
    | where Data !contains "We could not find a credit card on file for your azure subscription." 
    | summarize ["Error Count"] = count() by ["Error"] = provisioningStatus
    | order by ["Error Count"] desc
    ```

* Create Error Distribution By Extension 

    ```js
    let today = floor(now(),1d);
    let sat = today - dayofweek(today) - 8d;
    let fri =  sat + 6d;
    ClientTelemetry
    | where PreciseTimeStamp >= sat and PreciseTimeStamp < fri + 1d
    | where Action == "ProvisioningEnded" and ActionModifier == "Failed"
    | extend provisioningStatus = extractjson("$.provisioningStatus", Data, typeof(string)),
    isCustomProvisioning = extractjson("$.isCustomProvisioning", Data, typeof(string)),
    oldCreateApi = extractjson("$.oldCreateApi", Data, typeof(string)),
    launchingContext = extract('"launchingContext"\\s?:\\s?{([^}]+)', 1, Data)
    | where isnotempty(launchingContext) and isempty(extract("^(\"telemetryId\":\"[^\"]*\")$", 1, launchingContext)) and oldCreateApi != "true" and isCustomProvisioning != "true" and provisioningStatus != "DeploymentCanceled"
    | where Data !contains "We could not find a credit card on file for your azure subscription." 
    | summarize ["Error Count"] = count() by Extension
    | order by ["Error Count"] desc
    ```

* Create Error Distribution By Error Code 

    ```js
    let today = floor(now(),1d);
    let sat = today - dayofweek(today) - 8d;
    let fri =  sat + 6d;
    ClientTelemetry
    | where PreciseTimeStamp >= sat and PreciseTimeStamp < fri + 1d
    | where Action == "ProvisioningEnded" and ActionModifier == "Failed"
    | extend provisioningStatus = extractjson("$.provisioningStatus", Data, typeof(string)),
    isCustomProvisioning = extractjson("$.isCustomProvisioning", Data, typeof(string)),
    oldCreateApi = extractjson("$.oldCreateApi", Data, typeof(string)),
    eCode = extractjson("$.details.code", Data, typeof(string)),
    launchingContext = extract('"launchingContext"\\s?:\\s?{([^}]+)', 1, Data)
    | where isnotempty(launchingContext) and isempty(extract("^(\"telemetryId\":\"[^\"]*\")$", 1, launchingContext)) and oldCreateApi != "true"
    | where provisioningStatus != "DeploymentFailed" and provisioningStatus != "DeploymentCanceled" and isCustomProvisioning != "true"
    | where Data !contains "We could not find a credit card on file for your azure subscription." 
    | summarize ["Error Count"] = count() by ["Error Code"] = eCode
    | order by ["Error Count"] desc 
    ```

* Create Innermost Error Distribution 

    ```js
    let today = floor(now(),1d);
    let sat = today - dayofweek(today) - 8d;
    let fri =  sat + 6d;
    ClientTelemetry
    | where PreciseTimeStamp >= sat and PreciseTimeStamp < fri+1d
    | where Action == "ProvisioningEnded" and ActionModifier == "Failed"
    | join kind = inner (ExtensionLookup | project Extension, ExtensionName) on Extension
    | where Data !contains "We could not find a credit card on file for your azure subscription."
    | extend datajson = parsejson(Data)
    | extend provisioningStatus = tostring(datajson.provisioningStatus), isCustomProvisioning = tostring(datajson.isCustomProvisioning), oldCreateApi = tostring(datajson.oldCreateApi), launchingContext = extract('"launchingContext"\\s?:\\s?{([^}]+)', 1, Data)
    | where isnotempty(launchingContext) and isempty(extract("^(\"telemetryId\":\"[^\"]*\")$", 1, launchingContext)) and oldCreateApi != "true" and isCustomProvisioning != "true" and provisioningStatus != "DeploymentCanceled"
    | extend code1 = tostring(datajson.details.code), statusCode = tostring(datajson.details.deploymentStatusCode), details = datajson.details.properties.error.details[0]
    | extend message= tostring(details.message), code2 = tostring(details.code)
    | extend messagejson = parsejson(message)
    | extend code3 = tostring(messagejson.code), code4 = tostring(messagejson.error.code), code5= tostring(messagejson.error.details[0].code)
    | extend errorCode1 = iff(code5 == "", code4, code5)
    | extend errorCode2 = iff(errorCode1 == "", code3, errorCode1)
    | extend errorCode3 = iff(errorCode2 == "", code2, errorCode2)
    | extend errorCode4 = iff(errorCode3 == "", code1, errorCode3)
    | extend errorCode5 = iff(errorCode4 == "", statusCode, errorCode4)
    | summarize ["ErrorCount"] = count() by ["Extension"] = ExtensionName, errorCode5
    | order by ErrorCount desc
    ```

## Troubleshooting Create Regressions and ICM alerts

Creates occur when a user tries to provision a resource using the Portal. The Create Flow Regressions alert is a bar that  is set on a blade-by-blade basis and can be adjusted as needed.  The goal of the alert is to generate awareness when the reliability of the Create experience  decreases.

The alert fires any time the success rate drops more than 5% below the bar, on average, over an hour.  MDM will send an alert each time this happens.  The developer should review **MDM** by selecting the link at the bottom of the ICM alert.  This will show a trend of how long the alert has been active and to what degree.

The numbers are the percentage of regression.  For example, if latest value is 10 it means the success rate has regressed by 10% below the bar.  Increasing numbers are a much bigger concern than one that spiked and then returned to normal levels.

The increase in regressions  can happen for a number of reasons. There are three basic types of create failures. 

1. The create was successfully sent to ARM, but ARM eventually reported Failure rather than Success or Cancel. Billing errors such as no credit card are considered canceled creates instead of failures.

1. The create request was not accepted by ARM for any reason.

1. This is a custom create where the *ProvisioningEnded* is either missing or reports an error.

The following table specifies queries that can be run to investigate errors and their causes.

| Name                     | Basic Query                                                            | Document Section |
| ------------------------ | ---------------------------------------------------------------------- | ---------------- |
| Alert                    | `CreateFlowRegressions(now())`                                         | [Alert query](#alert-query) |
| Alert Bar                | `_CreateFlowRegressionOverrides()`                                     | [Alert bar query](#alert-bar-query) |
| Regression Counts        | `GetCreateRegressionErrorCount(now(),"<extensionName>","<bladeName>")` | [Alert regression counts](#alert-regression-counts) |
| Regression Details       | `GetCreateRegressionDetails(now(),"<extensionName>","<bladeName>")`    | [Alert regression details](#alert-regression-details) |
| Regression Summaries     | `_CreateFlowRegressionsBase(now(),24h,50)`                             | [Alert regression summaries](#alert-regression-summaries) |
| All Creates              | `GetCreatesByDateRange(ago(1d),now())`                                 | [All creates](#all-creates) |
| All Creates with Details | `GetCreateDetailsByDateRange(ago(1d),now())`                           | [All create details](#all-creates-details) |

### Alert query 

The alert is generated whenever the regression is more than 5% from the bar. The query tracks the percentage over the last 24 hours, as measured against  the success bar. The query for the alert is as follows.

`CreateFlowRegressions(now())`

To run the query locally in **Kusto.Explorer**, use [http://aka.ms/portalfx/alertregression-local](http://aka.ms/portalfx/alertregression-local)

 To run the query in **Kusto.WebExplorer**, use [http://aka.ms/portalfx/alertregression](http://aka.ms/portalfx/alertregression). 

The following column names are specified by MDM. 

* **d_ExtensionName**: 

* **d_CreateBladeName**: 

* **m_CreateRegressionPercent**: The percentage of regression below the bar

* **m_CreateRegressionCount**: The number of creates over the last 24 hours

* **timestamp**: 


### Alert bar query

The bar is a value that is captured based on current performance.  This will be increased as the create becomes more reliable.  Extension developers occasionally receive reminders from the Ibiza team when it is reasonable to raise the bar on an extension. The query for the alert bar is as follows.

`_CreateFlowRegressionOverrides()`  

To run the query locally in **Kusto.Explorer**, use [http://aka.ms/portalfx/alertregressionbar-local](http://aka.ms/portalfx/alertregressionbar-local).

 To run the query in **Kusto.WebExplorer**, use [http://aka.ms/portalfx/alertregressionbar](http://aka.ms/portalfx/alertregressionbar). 

The results of the query are as follows.

* **Extension**:

* **CreateBladeName**:

* **Ignore**:  The specified extension is excluded from alerting when this is set to `true`.

* **Bar**: The expected success percentage.

* **NormalizedCount**: Reserved.

* **Reason**: Contains notes about why the bar was set.
    
### Alert regression counts
 
The Alert Regression Error Count function is used to identify the main error that is causing the increase in regression. The regression percentage is measured over the last 24 hours ending at the specified datetime.  There are **Kusto** queries that will allow you to view the errors in the percentage, and their frequency.  The query for the alert regression for a sample website extension and blade is as follows.
 
`GetCreateRegressionErrorCount(now(),"websitesextension","webhostingplancreateblade")` 

To run the query locally in **Kusto.Explorer**, use [http://aka.ms/portalfx/alertregressioncount-local](http://aka.ms/portalfx/alertregressioncount-local).

 To run the query in **Kusto.WebExplorer**, use [http://aka.ms/portalfx/alertregressioncount](http://aka.ms/portalfx/alertregressioncount). 
 
**NOTE**: This query is the same as the `GetCreateRegressionExtSummary` query, except it is by extension and by blade  instead of only by extension.

 Input parameters for the query are as follows.
 
* **End time**: The time span that is scanned for errors is 24 hours ending at this time.  The time range is 
 computed as this parameter minus  24 hours. 

* **Extension**: The extension whose errors are being reviewed. 

* **CreateBladeName**: The name of the create blade on which the errors occurred.

The results of the query are as follows.

* **extension**: The name of the specified extension.

* **CreateBladeName**: The name of the specified create blade.

* **ErrorCode**: The error code that specifies the type of error that occurred.

* **Hits**: The  number of times this error occurred.

### Alert regression details 

Once you have used `GetCreateRegressionErrorCount` to locate the main errors that are causing the increase in  regressions, you can locate their causes by drilling down into the data.  The following query uses the `websitesextension` extension as an example to display all of the failed creates with their error messages.

`GetCreateRegressionDetails(now(),"websitesextension","webhostingplancreateblade")`

To run the query locally in **Kusto.Explorer**, use [http://aka.ms/portalfx/alertregressiondetail-local](http://aka.ms/portalfx/alertregressiondetail-local)

To run the query in **Kusto.WebExplorer**, use [http://aka.ms/portalfx/alertregressiondetail](http://aka.ms/portalfx/alertregressiondetail). 
 

**NOTE**: This query is the same as the `GetCreateDetailsByDateRange` query, except it is by extension and blade instead of by date range.

Input parameters for the query are as follows.

* **Endtime**: The end time of the time span to scan for errors. Time range: [end time – 24 hours, end time]. 

* **Extension**: The extension that is being reviewed.

* **CreateBladeName**: The name of the create blade on which the errors occurred.

The results of the query are as follows.

* **extension**: The name of the extension. 

* **name**: The name of the resource that was being created. 

* **CreateBladeName**: The name of the create blade from which the create flow originated. 
 
* **status**: The resulting status of the create. Regressions are represented only by failed creates, so this should always be marked as "Failed". 

* **MessageCode**: This is typically the name of the error that occurred in a Failed status create flow. If the field is blank, then the information may be located in the **data** field, as specified in [#the-data-field](#the-data-field).

* **Message**: In the case of a Failed status create flow, this typically is the message of the error which occurred. This may provide context as to why the create flow failed.  If the field is blank, then the information may be located in the **data** field, as specified in [#the-data-field](#the-data-field). 

* **StartTime**: When the create was initiated. 

* **EndTime**: When the create completed. If the `EndTime` is the same as the `StartTime` then the create failed to be initiated correctly, or the information regarding its completion is lost. 

* **Duration**: The length in time of the create, from start to finish. If the duration is 00:00:00 then the create failed to be initiated correctly, or the information regarding its completion is lost. 

* **telemetryId**: The id of the create events that make up a create flow. 

* **userId**: Represents the user that initiated the create. 

* **sessionId**: Represents the sessions in which the create was initiated. 

* **CustomDeployment**: Boolean value that specified whether the create is a custom deployment and therefore was not initiated through the ARM provisioner.  

* **data**: Contains all of the in-depth information that describes the details of the create flow. The details are categorized by four life cycle events that specify the stage of the create flow, as specified in [#the-data-field](#the-data-field). 

#### The data field

Understanding the **data** field is crucial to debugging regression issues. The life cycle of the create flow for a standard ARM deployment is slightly different from a custom deployment that does not use the ARM provisioner. The create flow life cycle events are as follows.

1. When a create is initiated, a **ProvisioningStarted** event is logged.  

1. Once the request for that deployment is received and acknowledged by ARM, a **CreateDeploymentStart** event is logged. This event is not logged for custom deployments.

1. When the completion status of that deployment is available, a **CreateDeploymentEnd** event is logged.  This event is not logged for custom deployments.

1. Once the deployment is finished and the Portal has finished the create process, a **ProvisioningEnded** event is logged. 

The **data** field from the query contains all of the logged data from each create event.  Each event is represented by the following three fields.

* **action**: The action logged. Values are  `ProvisioningStarted`, `CreateDeploymentStart`, `CreateDeploymentEnd`, `ProvisioningEnded`.

* **actionModifier**: The context in which the action was logged. The following are the combinations of **action** and **actionModifier**.

    |      action           | actionModifier |
    | --------------------- | -------------- |
    | ProvisioningStarted   | mark           |
    | CreateDeploymentStart | Failed         |
    | CreateDeploymentStart | Succeeded      |
    | CreateDeploymentEnd   | Canceled       |
    | CreateDeploymentEnd   | Failed         |
    | CreateDeploymentEnd   | Succeeded      |
    | ProvisioningEnded     | Failed         |
    | ProvisioningEnded     | Succeeded      |

* **data**: Contains information about this specific create event in the context of the greater create flow. Either the **MessageCode** or the **Message** was blank, or more context and information is needed to debug regression issues. One way to locate the context and information of an error is to perform the following steps.
    
    **NOTE**: The **data** field from the query contains another field named **data**, which may be considered the **data** field of the event.

    1. Locate the last create event whose **data** field contains information. This is typically the **ProvisioningEnded** event, but if that is not available then use the **CreateDeploymentEnd** event. If neither of these are available, then the information was lost and cannot be made available.

    1. Locate the details field in the **data** field of the event. 

    1. The details field should contain a hierarchy of error codes and error messages. The innermost error code or message should be the underlying cause of the deployment failure. 

### Alert regression summaries 
    
The alert is specific to the rules of MDM and does not provide context for the errors or for the extension.  The query for the alert is as follows.

`_CreateFlowRegressionsBase(now(),24h,50)`

To run the query locally in **Kusto.Explorer**, use[http://aka.ms/portalfx/alertregressionsummaries-local](http://aka.ms/portalfx/alertregressionsummaries-local). 

 To run the query in **Kusto.WebExplorer**, use [http://aka.ms/portalfx/alertregressionsummaries](http://aka.ms/portalfx/alertregressionsummaries). 

Input parameters for the query are as follows.

 * The start time. 

 * Number of hours to check.
 
 * Minimum number of creates required.
 
 Filtering the results of the query by specifying an extension  will present a  clear idea of its current state.

The results of the query are as follows.

* **EndTime**: The end time of the time span to scan for errors. Time range: [end time – 24 hours, end time]. 

* **Extension**: The name of the extension. 

* **CreateBladeName**: The name of the create blade from which the create flow originated. 

* **Count**: Number of creates.

* **SuccessBar**: The expected success percentage.

* **Regression**: The number of failed creates.

A  simpler version of this query uses an extension name as a parameter to automatically filter to the necessary section.  For example, for websites the query would be:

`GetCreateRegressionExtSummary(now(),"websitesextension")` 

**NOTE**: This query is the same as the `GetCreateRegressionErrorCount` query, except it is only by extensions  instead of by extension and blade.
 
To run the query locally in **Kusto.Explorer**, use [http://aka.ms/portalfx/alertregressionsummary-ext-local](http://aka.ms/portalfx/alertregressionsummary-ext-local)

 To run the query in **Kusto.WebExplorer**, use [http://aka.ms/portalfx/alertregressionsummary-ext](http://aka.ms/portalfx/alertregressionsummary-ext). 

### All creates

When looking for patterns it is sometimes better to start with a larger picture.  The following query returns a single row for each create.

`GetCreatesByDateRange(ago(1d),now())`

**NOTE**: This query is the same as the `GetCreateRegressionDetails` query, except it is by date range instead of by extension and blade.

To run the query locally in **Kusto.Explorer**, use [http://aka.ms/portalfx/allcreates-local](http://aka.ms/portalfx/allcreates-local). 

 To run the query in **Kusto.WebExplorer**, use [http://aka.ms/portalfx/allcreates](http://aka.ms/portalfx/allcreates). 

The results of the query are as follows.

* **Extension**: The name of the extension. 

* **Name**: Name of the asset type.

* **CreateBladeName**: The name of the create blade from which the create flow originated. 

* **Status**: Contains one of the following values: "Succeeded", "Failed", "Unknown", or "Canceled".  Billing errors included in the "Canceled" category.

* **telemetryId**: Unique ID for the deployment.

* **CustomDeployment**: Contains the value `true` if this is not an ARM deployment.
        
### All creates with additional details

 More information about each create may help identify the main error that is causing the increase in regression numbers. This is in addition to the results of the queries specified in [#all-creates](#all-creates).  The following query returns multiple rows per `telemetryId`, where each `telemetryId` is a single create. 

`GetCreateDetailsByDateRange(ago(1d),now())` 
 
To run the query locally in **Kusto.Explorer**, use  [http://aka.ms/portalfx/allcreatesdetail-local](http://aka.ms/portalfx/allcreatesdetail-local). 

<!--TODO:  Determine whether the following query is incorrect, because it points to GetCreateRegressionErrorCount(now(),"websitesextension","webhostingplancreateblade")
 -->
 To run the query in **Kusto.WebExplorer**, use [http://aka.ms/portalfx/allcreatesdetail](http://aka.ms/portalfx/allcreatesdetail). 

Input parameters for the query are as follows.

* **Endtime**: The end time of the time span to scan for errors. Time range: [end time – 24 hours, end time]. 

* **Extension**: The extension name.

The results of the query are as follows.
 
* **Extension**: The name of the extension.

* **CreateBladeName**: The create blade name specified

* **ErrorCode**: The overall error code that specifies the type of error that occurred

* **Hits**: The number of times this error occurred.

The results of the query also include the following five properties.
     
* **userId**: Represents the user that initiated the create. 

* **sessionId**: Represents the sessions in which the create was initiated. 

* **action**: See [#the-data-field](#the-data-field).

* **actionModifier**: See [#the-data-field](#the-data-field).

* **data**: See [#the-data-field](#the-data-field).
