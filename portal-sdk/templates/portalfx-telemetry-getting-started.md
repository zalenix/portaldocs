## Getting Started

Starting 2016, Portal Telemetry has moved completely to the Kusto based solution. 

### Pre-requisites

Kusto.Explorer: [Application](http://kusto-us/ke/Kusto.Explorer.application)

### Kusto Cluster Info

Name: AzPortalPartner
Data Source: [https://Azportalpartner.kusto.windows.net](https://Azportalpartner.kusto.windows.net)

### Permissions

All Azure employees should have access to our Kusto clusters. The way permissions are granted is through inheritance of the overall AAD group (`REDMOND\AZURE-ALL-PSV` for teams in C+E, for teams outside `REDMOND\AZURE-ALL-FPS`). We do not grant individuals access to the kusto, you will need to join your respective team's group. To inherit the valid permissions your team should have a standard access group you can join in //ramweb or //myaccess and that group should be configured to have the correct permissions.

If you don't have access, please follow the below steps:

1. Visit [http://aka.ms/standardaccess](http://aka.ms/standardaccess)
1. On the standard access page you will find a table of team projects 'Active ​Azure  Team Projects'
1. Search the table for your team's group (if you are unware of which group to join ask your colleagues)
1. Once you have found the correct group join that group via //myaccess or reach out to team's support alias for further help.
1. Ensure your request has been approved, if you have been denied for any reason please follow up with the group support alias.

#### What if I can't find a group

If you are unable to find a group to join within the table, you may need to create a new group. First confirm that with your colleagues, there may be a group that is named non-intuitively.

If there is still no group you can join, you will need to create a new group. To do that please follow documentation on [http://aka.ms/standardaccess](http://aka.ms/standardaccess).
Look for the link named ['Azure RBAC Getting Started Guide'](http://aka.ms/portalfx/telemetryaccess/newgroup).
There are various steps to follow, unfortunately the Ibiza team do not own this process. The standard access team have step by step videos you can use to follow along. If you need further assistance with creating a new group please contact the 'MyAccess' support team.

For all other questions please reach out to [Ibiza Telemetry](mailto:ibiza-telemetry@microsoft.com).

#### Programmatic access


Please note that we already offer pretty extensive and customized alerting for extensions that may reduce (often eliminates) the need for you to request programmatic accesses. Please see  
https://aka.ms/portalfx/docs/alerting for more details. 
 
However, if you require programmatic access, we're onboarding partners to our dedicated AzPortalPartner follower cluster. 

#### Steps to Onboard

To proceed down the pragmatic access route, please send an e-mail to azurefxg@microsoft.com confirming: 
1. A brief reason why you need access, and who your team is. 
 
1. Which databases (AzurePortal, AzPtlCosmos, hostingservice) you will be accessing.  
(Please note we only provide Viewer (read) access for obvious reasons) 
 
1. You understand that programmatic access to these databases potentially allows 'anonymous' access to the uncensored production logs, and your usage must not allow this. 
 
1. You are following Microsoft best practices for key storage. Typically, this means storing the certificate in KeyVault (not, for example, in source code repositories) and rotating the key at the appropriate frequency. 
 
1. Your handling of any data you access this way will comply with Microsoft PII & GDPR policies. 
    This means, but is no way limited to: 
 
    - Not copying or downloading non-anonymized logs (even to secure systems - unless you have registered those systems with GDPR for deletion and export).  
     - Not making available anonymous access by proxy. For example, a web site or other access mechanism that allows the caller (authed or not) to make non-Delegated requests as the service principal (example: a log search tool that connects directly as the Service Principal or dSTS Service Identity rather than using delegated auth) 
 
6. Your application must not put excessive load on the cluster, particular over popular times (5-7pm PST, 0-1am UTC). 
    - Please supply examples of the queries you will be executing, as well as the schedule/frequency. 
 
7. The AAD App ID of your Service Principal or the dSTS App Id of your dSTS Service Identity. 
 
8. If using an AAD Service Principal: That your application uses cert based auth for its Service Principal see Creating a Certificate-backed Partner Service Principal for details). 
 
9. A contact e-mail for this application that we can reach out to in cases of outage, capacity planning, etc. This should be a team alias rather than an individual for obvious reasons. 
 
10. If you are using the [Kusto Client SDK](https://kusto.azurewebsites.net/docs/api/netfx/about-kusto-data.html) to connect, please set ClientRequestProperties.Application to reflect your application name (older libraries, [no longer documented on Kusto](https://kusto.azurewebsites.net/docs/api/using_the_kusto_client_library.html)) or [embed it the ClientRequestId](https://kusto.azurewebsites.net/docs/api/netfx/request-properties.html#the-clientrequestid-x-ms-client-request-id-property) (newer libraries). If you are using another access method that supports a similar feature (e.g. the REST API directly), please use it. 
 
11. Whether you need to create your own functions and tables (i.e. require write access) in Kusto*. This will involve creating a dedicated database for your team (please supply a suitable name) which you will then be responsible for maintaining (and registering with the GDPR scanner, etc). If you are not sure, start with No and change your mind to Yes later. 
 
Once we receive and approve the onboarding request, we’ll call you as an anti-phishing step. You're app ID will then be enabled with Viewer access for the requested databases. There is no propagation delay between enabling programmatic access and it taking effect. 
 
Please note that Kusto is shared capacity system. As such, we have to reserve the right to shut down applications that put excessive load on the system. To date, we have never had to do this.

#### National Clouds
Partner programmatic access currently is not provided due to us not having sufficient rights in clouds to support this.

It is worth noting that AAD Service Principals are not available to Microsoft employees in National Clouds (only to the local vender). To connect with a National Cloud, you will need to use a dSTS Service Identity. These are supported in all clouds (including Public), so if you want to get a step up your code being National Cloud compatible, you can use these now. The Kusto documentation for this is at https://kusto.azurewebsites.net/docs/concepts/concepts_security_authn_dsts.html?#application-authentication-with-dsts

#### Tips and Tricks
- When testing your queries, you can see the performance cost of current query in the Query Summary tab of the results window. You can also see 30 days of history of queries you have run via .show queries command (note you can apply a where and other clauses to the output of this command)
- You can see the statistics and load history for the AzPortalPartner cluster at https://aka.ms/GaugePartnerCluster. 

#### The Future of the Partner Database
We previously provided a shared database called Partner for this purpose. We are decommissioning that model due to low take-up by partners, partners not respecting naming conventions in the shared space, a large number (literally in the 100s) of abandoned and 'V1/V2/V3' functions, permissions issues to edit functions, and partners tables causing false-positive GDPR S360 alerts to the gauge team. 

Going forward, partners who demonstrate an unavoidable need to create their own functions and tables will be given a database of their own that the partner is admin on. The partner will be responsible for maintaining Security & GDPR compliance (including registration) of that database.

#### Obsolete Best Practices
Note that with the move to follower clusters and other changes, the following advice is no longer relevant and can be ignored: 
- Prefixing you function and table names with your team identifier. Since you own the database, you can adopt whatever conventions you like.
- Runners executing through the Partner database rather against AzurePortal / AzPltCosmos databases directly. This advice was to make it easier for us to identify and disable rouge application. In practice, it didn't work (most partners did not follow the advice, and we can usually identify the runner either by the application name or the nature of the query anyway).Please run through your query from whatever database makes most sense to you.

#### Creating a Certificate-backed Partner Service Principal

Note: 
If you have custom / multiple tenants, make sure you are on the have switched back to the default Microsoft tenant first.

If you already have an application, you can skip forward to the PowerShell part

1. Go to https://ms.portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApp.
1. Click 'New application registration'
1. Fill out the application registration.
    a. Name: Your application's friendly name
	b. Application Type: Choice only matters if you have users signing into your app. Pick the type most appropriate to you.
	c. Sign-on URL / Redirect URL: Choice only matters if you have users signing into your app. 
1. Click 'Create'.The creates the application and a default service principal. Make a note of the Application ID GUID.

Using Powershell to add a certificate credential to a service principal:

1. Install the [Azure Active Directory (MSOnline)](https://docs.microsoft.com/en-us/powershell/azure/install-msonlinev1?view=azureadps-2.0) CommandLets if you haven’t already, and open an elevated PowerShell prompt (an elevated shell is required to run New-MsolServicePrincipalCredential (step 3)).
1. Execute the following code to get the public key from a cert file (feel free to get the public key another way, such as by thumbprint).
	``` powershell 
    $cer = New-Object System.Security.Cryptography.X509Certificates.X509Certificate 
	$cer.Import("C:\temp\ServicePrincipalCertPublicKey.cer")
	$binCert = $cer.GetRawCertData()
	$credValue = [System.Convert]::ToBase64String($binCert);
	 ```
1. Connect to AAD, and get a reference to your application's SP, and add the certificate.
	``` powershell 
	import-module MSOnline Connect-MsolService
	$sp = Get-AzureRmADServicePrincipal -ServicePrincipalName yourApplicationId
	New-MsolServicePrincipalCredential -ObjectId $sp.Id -Type asymmetric -Value 
	$credValue -StartDate $cer.GetEffectiveDateString() -EndDate
	$cer.GetExpirationDateString()
    ```

Rotating a certificate is done by running the New-MsolServicePrincipalCredential for the new certificate, then removing (when ready to do so) the old certificate through Remove-MsolServicePrincipalCredential.

> **Note:** You may also use [AAD Managed Identities](https://azure.microsoft.com/en-us/blog/keep-credentials-out-of-code-introducing-azure-ad-managed-service-identity/) to add a service principal to an already existing application. 

### Kusto Documentation & Links

[Documentation](http://kusto.azurewebsites.net/docs)

[Kusto Discussions](http://idwebelements/GroupManagement.aspx?Group=KusTalk&Operation=join)

### Who can I contact

[Ibiza Performance/ Reliability](mailto:ibiza-perf@microsoft.com;ibiza-reliability@microsoft.com) - Telemetry PM for Ibiza Performance and Reliability Telemetry

[Ibiza Create](mailto:ibiza-create@microsoft.com) - Telemetry PM for Ibiza Create Telemetry

[Azure Fx Gauge Team](mailto:azurefxg@microsoft.com) - Telemetry Team
