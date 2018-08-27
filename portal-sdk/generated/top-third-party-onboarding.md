<a name="onboarding-third-party-extensions"></a>
# Onboarding Third-Party Extensions

<a name="onboarding-third-party-extensions-overview"></a>
## Overview

It is important to read this guide carefully, as we rely on you to manage the extension registration-configuration management process in the Portal repository. 

**NOTE**: All third-party extensions must be approved by <a href="mailto:ibiza-onboarding@microsoft.com?subject=Third Party Applications (External partners)">Leon Welicki and Adam Abdelhamed</a> before any work can commence on the extension. Please schedule time with them to discuss the details about the extension and get an approval. 

When you receive the approval, you can submit a third-party request by sending an email to <a href="mailto:ibizafxpm@microsoft.com?subject=New Third Party Extension Onboarding Request: <extensionName>&body=Extension name: <ExtensionName_Extension> <br><br>URLs:  (must adhere to pattern)<br><br>PROD:  <extensionprefix>.hosting.portal.azure.net<br><br>Contact info: <email address of a team containing dev & support contacts for incidents related to extension><br><br>Business Contacts:<management contacts for escalating issues in case of critical business down situations><br><br>Dev leads: <Contacts of Developer teams who can help upgrade the SDK and deploy changes><br><br>PROD on-call email: <email address of a team containing dev & support contacts for incidents related to extension><br><br>">ibizafxpm@microsoft.com</a> instead of using the internal sites that are in this document. The body of the email should contain the following.

**Extension name**: <ExtensionName_Extension> 

**URLs**: (must adhere to pattern)

**PROD**: `<extensionprefix>.hosting.portal.azure.net`

**Contact info**: email address of a team containing dev & support contacts for incidents related to extension

**Business Contacts**: management contacts for escalating issues in case of critical business down situations

**Dev leads**: Contacts of Developer teams who can help upgrade the SDK and deploy changes

**PROD on-call email**: email address of a team containing dev & support contacts for incidents related to extension

**NOTE**: The name of the extension is the same for both the PROD version and the custom deployment version, as specified in [top-extensions-custom-deployment.md](top-extensions-custom-deployment.md). 

For the hosting service, the request should include the name of the extension as `<prefix>.hosting.portal.azure.net/<prefix>`. The email may also contain the extension config file, as specified in [top-extensions-cdn.md#configuring-the-extension](top-extensions-cdn.md#configuring-the-extension).

For more information and any questions about Fx coverage, reach out to 
<a href="mailto:ibiza-onboarding@microsoft.com?subject=Third Party Applications (External partners)">Third Party Applications</a>.

<a name="onboarding-third-party-extensions-overview-communication"></a>
### Communication

Plan ahead for all the outbound communication, blogging, and marketing work that publicizes new services during the time that they are being deployed to customers. This coordination is important, particularly when software release commitments are aligned with the Azure events and conferences. This coordination may be optional for preview releases, but the localized azure.com content and service updates plan are required for stakeholder signoff, if the extension will be deployed to GA.

 
<a name="onboarding-third-party-extensions-glossary"></a>
## Glossary

This section contains a glossary of terms and acronyms that are used in this document. For common computing terms, see [https://techterms.com/](https://techterms.com/). For common acronyms, see [https://www.acronymfinder.com](https://www.acronymfinder.com).

| Term                      | Meaning |
| ---                       | --- |
| .Net                      | A software framework developed by Microsoft that runs primarily on Microsoft Windows. | 
| 1CS                       | One Compliance System  | 
| AAD | | 
| API                       | Application Programming Interface  |
| ARM                       | Azure Resource Manager |
| BladeFullReady            | The time it takes a blade to fully load. | 
| C+E                       | Cloud + Enterprise | 
| CEC                       | Common Engineering Criteria  | 
| CEGRM                     | CSS Release management team | 
| CLI                       | Command Line Interface  | 
| CNAME                     | Canonical Name record. A type of resource record in the Domain Name System (DNS) that specifies that a domain name is an alias for another domain (the 'canonical' domain). | 
| CSS                       | CSS Release management  | 
| Definition file | A file that provides type information for JavaScript code that is inherently not statically typed. Definition files are a fundamental part of using existing JavaScript libraries in TypeScript, and the file suffix is always  *.d.ts. |
| DEV                       | Development | 
| DF                        | Dogfood | 
| DNS                       | Domain Name Server  | 
| DNS                       | Domain Name System  | 
| feasibility review | An analysis of a proposed project to determine  whether the project should go ahead, be redesigned, or abandoned altogether, from the perspectives of technical feasibility and financial feasibility. The review should  uncover the  strengths and weaknesses while they are relatively inexpensive to address. Also known as feasibility study. |
| first-party extension     | An Azure Portal extension that is developed by Microsoft |
| FAQ                       | Frequently Asked Questions | 
| GA                        | Global Availability | 
| gallery                   | Also known as Marketplace or Azure Portal Marketplace. See Marketplace Gallery. | 
| GB Certificate            | Six Sigma Green Belt Certification.  | 
| GB Standard               | GB stands for Guobiao, or “National Standard” in Chinese. The GB standard is the basis for testing products that require certification. | 
| Marketplace               | See Marketplace Gallery. | 
| Marketplace Gallery       | Also known as the Gallery or Marketplace Gallery. | 
| MPAC                      | ms.portal.azure.com, the Azure Portal instance for internal Microsoft customers.  | 
| P0 scenarios              | The most important user scenarios for an extension. Less important scenarios that are used for usability testing are categorized as P1, P2, or P3. |
| PDE                       | Portal Definition Export | 
| PHP                       | Recursive acronym for PHP: Hypertext Preprocessor. | 
| PM                        | Program Manager | 
| PM                        | Project Manager | 
| PROD                      | Production  | 
| QE                        | Quality Essential | 
| RDFE                      | Red Dog Front End | 
| REST                      | Representational state transfer   | 
| RP                        | Resource Provider  | 
| RP schema                 | Resource Provider schema | 
| RPC                       | Remote Procedure Call | 
| SDK                       | Software Development Kit | 
| SDL                       | Security Development Lifecycle |
| Service 360               | An extension of Service Portfolio Management. It enhances a Service Portfolio by providing a single view of business service performance across an organization, for business processes such as Operation, Risk, Investment, and Finance. | 
| single page application | A web application that dynamically rewrites displayed pages instead of providing entire new pages from a server. | 
| SLA                       | Service Level Agreement | 
| SSL                       | Secure Socket Layer  | 
| third-party extensions         |  Extensions that are developed by people that are external to Microsoft.  |
| URL                       | Uniform Resource Locator | 
| VP                        | Vice President | 
| Weighted Experience Score | The percentage of blade usage that meets the performance bar. |
| WxP                       | See Weighted Experience Score.  | 
