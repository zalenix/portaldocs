
# Azure Portal Glossary
 
 The Azure glossary contains all terms that are in the Azure Portal Extension documents, with the following exceptions.

* Standard English Language

* Standard Computing terms, like the ones found in  [https://techterms.com/](https://techterms.com/). 

* Common acronyms, like the ones found in [https://www.acronymfinder.com](https://www.acronymfinder.com).

The Azure glossary  may or may not contain definitions for terms that are located in the following Microsoft glossaries.

| Title  | Location |
| ------ | -------- |
| Microsoft Office Server Master Glossary | [http://download.microsoft.com/download/1/A/9/1A96F918-793B-4A55-8B36-84113F275ADD/[MS-OFSGLOS].pdf](http://download.microsoft.com/download/1/A/9/1A96F918-793B-4A55-8B36-84113F275ADD/[MS-OFSGLOS].pdf) |
| Microsoft Terminology Collection | [https://www.microsoft.com/en-us/language/Terminology](https://www.microsoft.com/en-us/language/Terminology) |
| Windows Desktop Glossary | [https://msdn.microsoft.com/en-us/library/windows/desktop/dn688965.aspx](https://msdn.microsoft.com/en-us/library/windows/desktop/dn688965.aspx) | 
| Windows Protocols Master Glossary | [https://msdn.microsoft.com/en-us/library/cc232129.aspx](https://msdn.microsoft.com/en-us/library/cc232129.aspx) |


The terms are in alphabetical order.

| Letter      | Letter  | Letter  | Letter        | Letter    | Letter    | Letter      | Letter     | Letter     | Letter    | Letter      | Letter      |
| ----------- | ------- | ------- | ------------- | --------- | --------- | ----------- | ---------- | ---------- | --------- | ----------- | ----------- |
| [Dot](#dot) | [A](#a) | [B](#b) | [C](#c)       | [D](#d)   | [E](#e)   | [F](#f)     | [G](#g)    | [H](#h)    | [I](#i)   | [J](#j)     | [K](#k)     |
| [L](#l)     | [M](#m) | [N](#n) | [O](#o)       | [P](#p)   | [Q](#q)   | [R](#r)     | [S](#s)    | [T](#t)    | [U](#u)   | [V](#v)     | [W](#w)     |
| [X](#x)     | [Y](#y) | [Z](#z) | [Zero](#zero) | [One](#1) | [Two](#2) | [Three](#3) | [Four](#4) | [Five](#5) | [Six](#6) | [Seven](#7) | [Eight](#8) | 
| [Nine](#9)  |         |         |               |           |           |             |            |            |           |             |             | 

## Dot

| Term | Meaning   |
| ---- | --- |
| .NET                      | A software framework developed by Microsoft that runs primarily on Microsoft Windows. | 

## A

| Term | Meaning   |
| ---- | --- |
| A/B Testing | Also known as control group/experimental group testing, where software  is divided into two different presentations, or flights, for different user groups. The users are unaware of which version they are testing. |
| AAD                               | Azure Active Directory |
| above the fold | Initially displayed on the Web page without scrolling. |
| accessibility        | The design of products, devices, services, or environments for people who experience disabilities.                                |
| action bar | A list of actions that an extension can perform, separate from the options that are located on the toolbar. |
| activity log | A log that contains a record of events or actions that have been performed on a site, or by a user or extension. |
| AJAX  | Asynchronous JavaScript And XML |
| alert |  A message about extension behavior. Typically associated with load failures, or performance thresholds.  Based on criteria that are set by the extension developers, if a threshold for an alert is met, an ICM alert that contains the details of the alert is opened and sent to  the  team that owns the extension. This is not the same as a notification. | 
| AMD                               | Asynchronous Module Definition |
| API                               | Application Programmer Interface |
| API contract | An agreement between two pieces of code as to how to pass parameters between them, and how those parameters are processed. |
| Application Insights | An extensible Application Performance Management (APM) service that is used to monitor live web applications. It automatically detect performance anomalies, and  includes  analytics tools to help  diagnose issues and improve performance and usability. |
| area          | Group of blades and parts that are associated with a single user-defined context.  |
| area                 | A project-level folder that is used to organize and partition the source code by categorizing related blades and parts by their data requirements.  |
| aria-label            | An attribute that is used to define a string that labels the current element if a text label might  not be visible on the screen. |
| ARM endpoint | Also known as ARM service endpoint. An endpoint that provides a service by |using Azure Resource Manager (ARM). |
| ARM resource             | Virtual machines, storage accounts, virtual networks, web applications, databases, and third-party services  that an extension will deploy, manage, and monitor as a group. |
| assembly | Binary files that are generated by a project build and that are usually stored in the **bin** directory. | 
| Asset type              | Metadata that provides a way for the Shell to understand high level objects in the extension. They are the Portal's way of understanding the capabilities of a given object.   |
| asynchronous module definition    | A JavaScript API that specifies a mechanism that defines code modules and their dependencies in order to load them asynchronously. |
| avatar menu | A menu that contains references to  fields that store images for use as the identifying icon in the Hub account. |
| availability |  Users can login to a service,  extension, or access panel to use  applications or reset passwords. IT administrators can create, read, write and delete directory  entries  for users, services, and applications.  Also see reliability. |
| Azure Fundamentals | A set of tenets to which each Azure service is expected to adhere. | 
| Azure Insights  |  Activity logs and other tools that provide metadata about extension performance and maintenance. | 
| Azure Portal SDK  | Software Development Kit for developing Azure Portal extensions. |
| Azure Resource Manager (ARM)    | The public API for Azure that accepts calls from the Portal, Azure SDK, and command line.  | 

## B

| Term | Meaning   |
| ---- | --- |
| bake time |  The time to wait between each stage of an extension deployment |
| best practice  | A technique or methodology that, through experience and research, has proven to reliably lead to an expected result. |
| BF               | Black Forest |
| blade         | An Azure SDK object, or an object from a framework API, that contains content by using an HTML template.  That template is bound to properties on the TypeScript class of the object.  The main unit of the Azure UX that can be built using the Azure SDK.   The vertical container that acts as the starting point for any journey.  Web pages that can be loaded in the Portal.  Also known as blade or context pane. |
| blade activation | Causing a blade to open by  selecting data.  The blade may be a context pane, or it may be based on data selected from a grid.  The blade may be elsewhere within the same extension, or it may be from another extension, as specified in the .pdl file for the calling extension.   An extension opens a blade by setting the  `activateOnSelected` selection option to `true`, or by setting specific grid columns to be activatable by setting  `activatable = true`.|
| BladeFullReady            | The time it takes a blade to fully load. | 
| blob                         | Binary large object. |
| big data | Data sets that are very large or very diverse,  including  structured, semi-structured and unstructured datathat may be located in  different sources. The variation in sizes or types of data stores is beyond the ability of traditional databases to capture, manage, and process the data with low-latency.  |
| branch | A collection of code in a content management system. |
| branch | The five Azure environments  in which extensions are run.  They are: Blackforest, Dogfood, FairFax, Mooncake, and the Production Release Candidate(s). |
| Brotli Compression | A data format that is specifically for data streams that use general-purpose the LZ77 lossless compression algorithm and other algorithms in their compression schemes.  This type of compression decreases the size of transmissions of web fonts, and  can now be used to encode any data sent by a web server to a web browser if both client and server support the format.  | 
| browse implementation | The implementation of the Azure Portal, based on the Portal environment, the Resource Provider (RP), and other factors. The portal's common navigation experience that displays a list of  services and resource types that  are available through the Portal. | 
| build verification test  | A subset of regression testing, this is a set of non-exhaustive tests that verify whether the most important application functions work. Its results are used to determine whether a build is stable enough to proceed with further testing. |
| bundling | The software practice of offering several tools or services as one combined product or service package. |
| BVT                      | Build Verification Test |

## C

| Term | Meaning |
| ---- | --- |
| C+E                       | Cloud + Enterprise | 
| cache entries | Request / Response object pairs that are temporarily stored in a file  or other container, typically on the client, to increase browser or other software performance. | 
| caching              | Hosting service extensions use persistent caching, index page caching, and manifest caching, among others. |
| camel casing | The practice of naming variables with compound words such that each word or abbreviation in the name, after the initial word begins with a capital letter, with no intervening spaces or punctuation. |
| CD | Continuous Delivery  |
| CDN | Content Delivery Network | 
| CEC                       | Common Engineering Criteria  | 
| CEGRM                     | CSS Release management team | 
| checklist      | A step-by-step set of instructions that specify  how to accomplish a task. |
| cherry-pick              | Apply the changes introduced by an existing GitHub commit. |
| chrome | The graphic control elements of a browser interface. These include elements like scrollbars, toolbar buttons,  the browser window frame, and other browser helper objects. | 
| ChromeDriver | A standalone server which implements WebDriver's wire protocol, which is a RESTful web service that uses JSON over HTTP.  The three separate pieces that are the browser itself, the Selenium language bindings ("the driver") and an executable downloaded from the Chromium project which acts as a bridge between "chrome" and the "driver". |
| CI  | Continuous Integration | 
| claim | An object that may be encapsulated in a token that can be sent from server to server.  This object might contain a  signed-in user id, name, email,  or  other similar information for authentication and authorization.  |
| CLI                               | Command Line Interface |
| CloudTest | A comprehensive performance platform for validating and optimizing web and mobile user experience. Tests the  load testing and peak event readiness of an extension. |
| CNAME            | Canonical Name record. A type of resource record in the Domain Name System (DNS) that specifies that a domain name is an alias for another domain (the 'canonical' domain). |
| code package | A series of files that contain metadata, in addition to the source code, that is used to install or run the software source.  |
| COGS |   Cost of Goods Sold |
| collector   | An endpoint that collects and transforms information from various provisioners previous to sending it to the provider in a provider-consumer relationship. |
| community cloud | A cloud that runs on the on the same IP address and machines as `portal.azure.com`, and provides vanity URLs, extension filtering, and rebranding functionality to selected partners. The  servers  make decisions dynamically, based on the URL used to access them. Although domain-based configuration is not required, there is great overlap between settings for community clouds and settings for national clouds. |
| compile-time verified lambda | A lambda expression that is verified at compile time.  |
| consumer    | An endpoint that requests  data from a provider that typically acts as a server. |
| Content Delivery Network (CDN) | A distributed network that sends audio, video, images, and other web content to customers.  This includes static images, scripts, and stylesheets. | 
| contract |  A verifiable and precise specification for a  software component that prescribes how to extend abstract data types with preconditions, postconditions and invariants. This is aligned with the conditions and obligations of business contracts.   Client components  must  meet the specified preconditions for an  operation previous to  invoking it on a server component, and the   a server component can test those preconditions previous to  processing the client component request.  Also see promise. | 
| controller           | The main code that links the application to the operating system, or to the server, for   multitasking, or access to other services. Contains intelligence that becomes a part of the data model when using MVVM modeling instead of MVC modeling. |
| CoreXT  | A framework that assists in the  development of .NET  applications and  websites. |
| CORS | Cross-origin resource sharing. A mechanism that defines a way in which a browser and server can interact to determine whether or not it is safe to allow the cross-origin requests to be served.  For example, restricted resources, like  fonts,  may be requested from domains outside the domain from other resources are served. It may use additional HTTP headers to allow users to gain permission to access selected resources from a server on a different origin. | 
| CRUD | Create, Replace, Update, Delete |
| CSS                       | CSS Release management  | 
| CTA | Computed Time of Arrival  |
| curation            | The process of categorizing content around a specific topic or area of interest. Curated items often formed into various types of collections and are displayed together according to theme or purpose. |
| custom deployment | Do-it-Yourself or legacy extension deployment that does not use an Azure Hosting Service. This is not the same as custom configuration of a blade or part. |
| custom domain | See domain-based configuration. |

## D

| Term | Meaning   |
| ---- | --- |
| dashboard | Customizable landing page where  users can resize, re-order, pin, or unpin tiles to create a unique start experience. |
| data atomization | A technique that binds several data views to one data entity, thus presenting a smooth and  consistent experience to the user. Multiple views that represent the same asset are always in sync. |
| data binding  | The process that establishes a connection between the application UI and the business logic  behind the pane. |
| data projection | Combining columns of data in a way that is meaningful to the current topic.  For example, the `county` column may be combined with the `state or province` column to provide a meaningful sort by county. |
| data stack                   | Contains all the information that the browser associates with the current testing session. |
| decorator | A function that adds logic  to a class, method, property or parameter. This is simpler than  creating a new class that extends the target class.  | 
| deep link                    | A link that jumps directly into the extension within the Portal. Each deep link consists of the Portal URL, the target directory domain name or tenant id (e.g. `microsoft.com`), the type prefix (i.e. asset, resource, blade, browse, or marketplace), and the actual target within the extension. |
| deep linking |  Updates the portal URL when a blade is opened, which results in a URL that directly navigates to the new blade. |
| definition file | A file that provides type information for JavaScript code that is inherently not statically typed. Definition files are a fundamental part of using existing JavaScript libraries in TypeScript, and the file suffix is always  *.d.ts. |
| dependency injection technique | A technique whereby one object supplies the dependencies of another object. | 
| desktop state             | A snapshot. |
| DEV                       | Development | 
| Developer Tools Console      | A suite of browser tools, in most browsers, that help developers inspect currently-loaded code, edit pages or variables, diagnose problems, and list requested assets. | 
| DF                       | Dogfood |
| dirty | The contents of a textbox or similar object have been changed from the time that they were originally displayed or instantiated. Related to the most recent value of a variable or observable. |
| display language  | The locale string that is used to display text in the UI.  |
| DIY                      | Do It Yourself |
| DNS                       | Domain Name Server or Domain Name System  | 
| Document Object Model (DOM) | A methodology that treats an  HTML, XHTML, or XML page as a tree structure that contains hierarchical objects. These nodes   represent every item  that is part of the document and can be manipulated programmatically. Visible changes to DOM nodes may be displayed in the browser. |
| domain-based configuration | A  configuration that is used by the Portal and extensions to dynamically obtain settings that are based on the URL that was used to access the Portal. | 
| dSTS  | Datacenter Security Token Service | 

## E

| Term | Meaning    |
| ---- | --- |
| edge servers | A server that is located on the border of a network and serves information between two networks, typically between a private network and the Internet. They perform functions like content delivery, security, or mail delivery. |
| EditScope             | An Azure SDK object that provides a standard way of managing edits over a collection of input or output fields, blades, and extensions. |
| endpoint             | A device that is connected to a LAN and accepts or transmits communications across a network. In terms of directories or Web pages, there may be several endpoints that are defined on the same device. |
| enhanced monitoring  | Provides a comprehensive set of over 50 system metrics and  process aggregates for extensions, at differing granularities.  Metrics can be displayed on consoles or  integrated with  third-party applications. |
| environment              | A configuration of computers in which extensions can be run. For example, some Azure environments are Blackforest, Dogfood, Mooncake, and Production. This is not the same as repository, which contains the source code to run in the environment, although the terms are often used interchangeably.  | 
| essentials | An  overview that contains the most important properties of a resource, in addition to  other Portal links. |
| ETW |  Event Tracing for Windows | 
| experience            | Azure Portal software application from the user perspective, including the blades to which the user has navigated.  |
| experimentation | Releasing two slightly different versions of a new feature to segments of the customer base to determine which  version works better or makes the customer happier. | 
| Express Version 2 (EV2) | Safe, secure and compliant way to roll out services to multiple regions across public and private clouds.  | 
| extension                         | A web application that is loaded by the Portal.  A web application that was developed using the Azure Portal SDK and is made available to users through the Azure Portal.   |
| extension stamp              | An instance of a service in a region. Every extension can deploy one or more extension editions based on testing requirements. The main extension is used for production and is the only one that the Portal will load by default. Also known as configuration or configuration file.   | 

## F

| Term | Meaning   |
| ---- | --- |
| fat arrow | Typescript lambda function.  It captures the "this" variable from the surrounding context. | 
| FAQ            | Frequently Asked Questions |
| feature flag             | A switch that allows a user to turn on or off specific functionalities of an extension. Flags are  passed from the Portal to extensions and their controllers, and are used as an alternative to maintaining multiple source-code branches in order to hide, enable or disable a feature during run time. Most, but not all, feature flags are made available by using the syntax `feature.<featureName> = true`.   |
| feasibility review | An analysis of a proposed project to determine  whether the project should go ahead, be redesigned, or abandoned altogether, from the perspectives of technical and financial feasibility. The review should uncover the strengths and weaknesses of a project while they are relatively inexpensive to address. Also known as feasibility study. |
| feature flag       | A coding technique that allows the enabling or disabling of new code within a solution. It allows the testing and development-level viewing of new features, before they are complete and ready for private preview.  |
| FF                       | Fairfax |
| Figma | Browser-based UI  design tool that assists teams in prototyping and developing consistent and responsive user experiences. |
| first chance exception    | An exception's first pass through the debugger. Exceptions are thrown to the debugger first and then to the actual program.  If the exception is not handled by the program, it gets thrown to the debugger a second time. |
| first-party extension | Internal/ Microsoft extensions that comply with Azure Privacy terms and conditions.  An Azure Portal extension that is developed by Microsoft | 
| flighting^1^               | The process of directing Internet traffic to various editions of an extension, as specified by stamps that represent different stages or regions, or by friendly names. |
| flighting^2^       | Similar to experimentation. The process of selecting users who will receive specific pre-production versions of an extension  by adding them to a flight group. Anyone in a flight group will receive packages that are designated for that particular group. Users  who are not in the flight group  will receive  packages that contain  the non-flighted  version of an extension. Eventually there will be only one version of the new extension, whereupon the customer base is expanded by adding flight groups or by releasing the successfully flighted bits to production.  |
| follower cluster    | A read-only view of a cluster that contains databases. It may have its own set of computers to handle read-only  queries against the database tables. This improves the performance of the cluster  on which the follower cluster is based, especially for the ingestion of new data and the execution of core queries.  |
| format culture    | The locale string that is used for formatting. |
| framework     | A software environment that provides large software platform functionality during the process of building and deploying applications. The larger platform is selectively changed by adding developer code to make software applications. |
| friendly name | Name for a site or an extension that is easier to remember and use than DSN names or IP addresses. Friendly names point to valid versions of an extension that exist in the storage account.  | 
| FullRevealed  | A variable that specifies that the ViewModel within the blade or part has received all of the information that it will display. |
| FYI            | For Your Information 

## G

| Term | Meaning   |
| ---- | --- |
| GA                       | General Availability or  Global Availability | 
| gallery                   | Also known as Marketplace or Azure Portal Marketplace. See Marketplace Gallery. | 
| gallery package       | Contains all assets for a gallery item: icons, screenshots, descriptions, et al. The gallery package is compiled into a file with the .azpkg extension  for transfer between environments. |
| GB Certificate            | Six Sigma Green Belt Certification.  | 
| GB Standard               | GB stands for Guobiao, or “National Standard” in Chinese. The GB standard is the basis for testing products that require certification. |  
| GD&F  | |
| Geneva | A monitoring system that collects stats for use in analyzing and acting on telemetry from  cloud and on-premises environments. |
| geodistribute        | Distribute the extension to all data centers in various geographical locations. |
| geodistribution      | The process of deploying software in multiple geographic regions as a single logical database. |
| geolocation | The identification or estimation of the real-world geographic location of a device, like a mobile phone or Internet-connected computer. |
| GitHub         | A Web-based hosting service for version control or content management. |
| GDPR | General Data Protection Regulation |

## H

| Term | Meaning   |
| ---- | --- |
| hammer.js |  A JavaScript library for detecting touch gestures. |
| hide key | Associated with testing a package previous to publishing it in the Marketplace. Shows specified Marketplace items that are otherwise hidden, or shows unpublished items in the gallery. | 
| High Contrast theming | A set of screen or Web colors  that make it easier to see letters than with  a normal color scheme.    | 
| heterogeneous blade activation | dynamic | 
| homogeneous blade activation |  static | 

## I

| Term | Meaning   |
| ---- | --- |
| IANA | Internet Assigned Numbers Authority | 
| IcM  | Incident Management System |
| idempotent         |  An operation whose result does not change after the initial application. For example, if the client needs to retry a request due to intermittent network issues, the same value will be sent to the server.  This allows the server to ignore the retry if it has already been processed. Even if the request is ignored, the same response will be returned if the client needs the values in the response. |
| iframe                   | An inline frame, used to embed another document within the current HTML document. |
| IIS Express       | Internet Information Services. A Web server for hosting anything on the Web. |
| IRIS              | Intelligent Retinal Imaging Systems, located at [http://www.retinalscreenings.com/](http://www.retinalscreenings.com/). The IRIS platform processes images quickly and accurately so doctors can share data with patients and other clinicians, better prevent diabetic blindness, and help reduce healthcare costs. iRiS Software Systems, located at [https://customers.microsoft.com/en-us/story/irissoftwaresolutions](https://customers.microsoft.com/en-us/story/irissoftwaresolutions). Multi-tenanted, cloud-based Guest Experience Platform that powers more than 3,000 hotels and restaurants worldwide, to deliver an improved end-to-end guest experience. | 
| imperative call     | imperative programming is a programming paradigm that uses statements that change a program's state, or describing how a program operates. An imperative program consists of commands for the computer to perform, and most computer languages are in the imperative style. |
| info balloon | |
| innermost error  | Error messages might be nested as a result of occuring at different levels of processing, and different stages record failure reasons. Consequently, the 'innermost error' should be the original reason why an error occured in the extension. |
| Intellisense | |
| Internet Information Services (IIS) | |
| intersection types | Combines multiple types into one. This allows existing types to be added together  to get a single type that contains  all the features. | 
| IoT  | | 

## J

| Term | Meaning    |
| --- |  ---  |
| Jenkins | |
| JSON Web Token |  JSON-based token that asserts information between the server and the client.  For example, a JWT could assert that the client user has the claim "logged in as admin".  | 
| JIT | Just In Time |
| journey  | A user-defined collection of Azure blades to which the user has navigated in order to accomplish a specific goal or task. A set of experiences, each of which has its own goals, that combine to result in a greater level of competency or knowledge. |
| JWT token | JSON Web Token |

## K

| Term | Meaning   |
| ---- | --- |
| KB | Knowledge Base |
| keyvault | |
| Knockout  (KO)                   | A standalone JavaScript implementation of the Model-View-ViewModel architecture. | 
| Kubernetes | |

## L

| Term | Meaning   |
| ---- | --- |
| L&R  | Learning and Readiness | 
| lambda expression | An anonymous function that is used to create delegates or expression tree types. |
| LBA  | |
| LCID | |
| lifetime | The amount of time an object exists in memory between instantiation and destruction.  It may be automatically destroyed by when a parent object is deallocated, or its existence may be managed by a lifetime manager object or a child lifetime manager object. |
| lifetime manager | Ensures that any resources that are specifically associated with a blade are disposed of when the blade is closed. Each blade has its own lifetime manager. |
| lifetime object | An object that informs the `DataCache` when a specific `DataView` is currently being displayed on the screen. This allows the Shell to make performance adjustments. |
| live tile                         | An object that displays at-a-glance information without opening an app. |
| locale string  | |
| localhost         | A hostname that means this computer or this host.  |
| localized title     |  a title that was created from the localizable strings in the extension that may be  located inside of a standard .NET RESX file. |

## M

| Term | Meaning  |
| ---- | --- |
| major area     | A subject that centers around a specific facet of Azure development. Some major areas are: blades,  controls,  data, forms, parts,   styling, and telemetry. Within these major areas, documents are organized by topic.|
| major topic | See topic. |
| manifest caching | | 
| Marketplace               | See Marketplace Gallery. | 
| Marketplace Gallery       | Also known as the Gallery or Marketplace Gallery.  The blade to which customers will navigate to view or purchase a service or extension.  |
| Marketplace package | A package that contains references to icons and resources, the UI , and other metadata necessary to display a resource or extension  in the Azure Portal "Marketplace" UI. | 
| MC                       | Mooncake |
| MDS                  |  Multilayer Director Switch | 
| MEF       | |
| MEF-export      | |
| menu blade            | |
| minification                 | The process of removing all unnecessary characters from source code and rewriting it to make it smaller without changing its functionality. Removed characters may be whitespace, newlines, comments, and other non-executable items that increase code readability, while rewritten code can be local variable names, boolean logic, etc. Minification reduces the amount of data that is transferred across the Internet. | 
| Mlp | |
| MPAC             | ms.portal.azure.com, the Azure Portal instance for internal Microsoft customers. | 
| MSA                   | Microsoft Account. formerly Windows Live ID.  |
| MSI | |
| Multi-factor authentication (MFA) | |
| MVC                | Model-View-Controller, a methodology of software organization that separates the view from the data storage model in a way that allows the processor or a controller to multitask or switch between applications or orientations without losing data or damaging the view. |
| MVVM                 | Model-View-View-Model methodology.  A  method of software organization that separates the view from the data storage model, but depends on intelligence in the view or in the data objects so that there is no controller module that needs to process or transfer information.  The controller's function is handled instead by the device operating system or by the server that is communicating with the application. This methodology allows the application to multitask, call other functions that are located on the device, or switch between orientations without losing data or damaging the view. |


## N

| Term | Meaning   |
| ---- | --- |
| Narrator | Screen-reading app that allows computer use without a display or mouse to complete common tasks. Screen readers must be compatible with this product for accessibility requirements. |
| national cloud   | Network instances of Microsoft enterprise cloud services that are isolated physically and logically. They are confined within the geographic borders of specific countries and operated by local personnel. See sovereign cloud. |
| no-code browse | A blade that automatically queries ARM for resources of a specific type and displays them in a paged grid. | |
| notification | A short message that contains useful and relevant information and informs the user about an event that has occurred, or may occur, in the system. This is not the same as an alert. |
| npm | |
| NPS                |   Net Promoter Score. The aggregated score of answers to the question ‘How likely are you to recommend this site?’.  Typically served as a popup window. | 
| NuGet | |
| NVDA                  | NonVisual Desktop Access                                                                                                          |

## O

| Term | Meaning   |
| ---- | --- |
| observable | Special Knockout or JavaScript objects that can notify subscribers or other code about changes, and can automatically detect dependencies.  |
| observable array | An observable that allows code to to detect and respond to changes on  a collection of things.   |
| obsolete script              | A script that makes certain parts of the Portal act as legacy code, in order to limit the performance costs of the old functionality to only extensions that are using them. | 
| OIDC | OpenID Connect |
| onestb | Deprecated service or product. Onebox-stb has been deprecated. Please do not use it. Instead sideload directly into df, mpac or production. | 
| OSS library | |
| overarching    | comprehensive; all-embracing. For example, the overarching document contains everything that has to do with related subtopics.   |

## P

| Term | Meaning   |
| ---- | --- |
| P0 scenarios              | The most important user scenarios for an extension. They typically contain critical or showstoppers, without which the extension does not pass its acceptance criteria. Less important scenarios that are typically used for usability testing are categorized as P1, P2, or P3, although some testing can categorize scenarios as far as P10. |
| parameter collection framework | A platform that enables the extension to collect data from the user. |
| parameter collector |  An object that configures the compiler-generated blade reference to supply provider configuration and initial data so that it can  receive  the results from a parameter provider blade. |
| parameter provider |  A data structure sent from the provider back to the collector. It typically mirrors the parameter structure that was sent to the child blade that collected the information. |
| part          | See blade. |
| PCV1                     | Parameter Collector V1 |
| PCV2                     | Parameter Collector V2 |
| PDE | Portal Definition Exports | 
| PDL | Program Definition Language or Portal Definition Language. The XAML API that describes the mapping from a blade or part name to the corresponding ViewModel and  HTML template. Replaced by the new "no-PDL" TypeScript decorator APIs that allow for a blade or part to be developed in a single TypeScript file. |
| PDL                      | Program Design Language |
| perceived responsiveness | Responsiveness that is immediately apparent to an average user. |
| Percentile | A figure that reports the relative standing of a particular value within a statistical data set.  It is a ranking in relation to the rest of the data, instead of the mean, standard deviation, or actual data value. For example, a score at the 80th percentile means that 80% of the scores are lower, and  20% of the scores are higher. | 
| performance      |         |
| Performance telemetry | The recording and transmission of metadata from a remote device to an Information Technologies endpoint for monitoring and analysis. |
| performant | Characterized by an excellent level of effectiveness, responsiveness, or   success. |
| phishing                     | | 
| PHP                       | Recursive acronym for PHP: Hypertext Preprocessor. | 
| PII                   | Personally-identifiable Information |
| PM                        | Program Manager | 
| PM                        | Project Manager | 
| polling | The process that determines which client-side data should be automatically refreshed. The auto-refreshing of client-side data. |
| Portal                       | The web application that hosts the Azure shell.  |
| PPE | |
| preflight  | |
| preview                  | The development phase that is used by the developer and a small audience to validate the functionality of an extension. |
| pricing tier  | A category of Azure pricing. The most common tiers are Basic, Standard, and Premium. Within the tier, customers can select or customize a plan or size. |
| procedure      | See checklist. |
| process validation | A procedure that ensures that the process has completed successfully, within expected levels of granularity. |
| PROD             | Production |
| promise | An object that is returned from asynchronous processing which binds together the results of multiple asynchronous operations.  This is in accordance with a contract that async operation(s) will either complete successfully or will have been rejected. | 
| promise             | A construct used for synchronizing program execution in some concurrent programming languages. A proxy for a result that is initially unknown,  because its  computation process has not  completed. A  promise is the return value of an asynchronous function. |
| property bag | A container that contains different types of object properties. Allows the   addition of properties without modifying the server side object, and with minimal changes to the client code.|
| provider    | An endpoint that acts as a server in a client-server relationship.  The endpoint may be a designated peer instead of an actual server. The client-server relationship is similar to the provider-consumer relationship, and the provider  may collect and transform information from provisioners and collectors previous to sending the information to the client.  | 
| provisioner | An endpoint that sends data to the provider, who then sends it to whatever acts as a consumer in a provider-consumer relationship.  Typically, the provider is a customer-facing endpoint, and may collect and transform information from various provisioners before returning to its role as a primary provider and sending the information to the consumer. 	| 
| proxied observable layer | The `ViewModel` that contains the blade.  It will exist in the separate iframe that communicates with the Portal shell iframe `ViewModel`.  |
| proxy observable (PO)        | A layer over **Knockout** observables that is used to keep in sync an observable's value across iframes. | 
| public endpoint      | |
| Puid | presentation id |
| pull request                 | |
| pureComputed | |
| private preview              | |

## Q

| Term | Meaning   |
| ---- | --- |
| QE                        | Quality Essential |
| query string       | A `uri` that is  used to access the Azure Portal. The part of a uniform resource locator (URL) that contains data. Query strings are generated by form submission, or by being entered into the address bar of the browser after the URL. The  query string is specified by the values following the question mark (?). The values are used in Web processing, along with the path component of the URL. Query strings should not be used to transfer large amounts of data.  | 

## R

| Term | Meaning   |
| ---- | --- |
| random access |  Accessing data in an order that is not sequential. Also known as skip-take, because some records are skipped previous to reading the next one. |
| RBAC | Role based access. Azure resources support simple role-based access through the Azure Active Directory. | 
| RC               | Release Candidate environment, used to deploy daily builds of the Azure Portal. There is no user traffic in this environment. |
| RDFE                      | Red Dog Front End | 
| RDTask | | 
| reactor | |
| region    | The area in the world that that is served by a specific localization site. |
| registration  | The process of updating the Portal configuration so that it can  load an extension. | 
| Relex | |
| reliability | Every extension meets the reliability Service Level Agreement (SLA) of loading successfully at least 99% of the time. |
| renminbi (RMB) | the official currency of the People's Republic of China.   |
| repository            | A file, directory, or server that contains source code and other resources with which to run extensions. A content management system. For example, some repositories are master and dev.  This is not the same as  environment, although the terms are often used interchangeably.  | 
| resource              | The primary point of entry when a customer wants  to work on or view computing resources  like Web apps, VMs, SQL Databases, or  storage accounts. Typically displayed on the resource browse blade or  resource blade. |
| resource features     | |
| resource provider   | A service that supplies the resources that can be deployed and managed by using Resource Manager. Some common resource providers are `Microsoft.Compute`, which supplies the virtual machine resource, `Microsoft.Storage`, which supplies the storage account resource, and `Microsoft.Web`, which supplies resources related to web apps.  |
| resourceType          | The fully qualified name for the categories of resources to display in the BrowseResourceListPart. | 
| REST                      | Representational state transfer   |
| Revealed | The ViewModel within the blade or part has received enough information to begin to display it. |
| RP                       | Resource Provider. Provides resource-specific APIs for management operations, like read, write, or delete. | 
| RP schema                 | Resource Provider schema | 
| RPC                       | Remote Procedure Call | 

## S

| Term | Meaning   |
| ---- | --- |
| SAN                          | Storage Area Network  | 
| sandboxed iframe             | Enables an extra set of restrictions for the content in the iframe.  It can treat the content as being from a unique origin, block form submission or script execution, prevent links from targeting other browsing context, and other items that restrict the behavior of the iframe during testing. | 
| sanitize             | Given a list of acceptable elements, attributes, and CSS properties, **Sanitize** removeS all unacceptable HTML and CSS from a string.  |
| SAS | Shared Access Signature |
| SAW                  | Secure Admin Workstation | 
| same-origin policy | A security policy that allows scripts that are contained in one web page can access data in another web page, but only if both pages share the same URI scheme, host name, and port number.  |
| screen jitter       | Re-displaying a list or blade in many places on the screen, or at different widths with every screen refresh. |
| SDK           | Software Development Kit |
| SDL                       | Security Development Lifecycle |
| SDP                  | Safe Deployment Policy |
| SEO | Search Engine Optimization. |
| server-side code     | Scripts that are located on a server that produce customized responses for each client request to the website, as opposed to the web server serving static web pages. |
| Service 360               | An extension of Service Portfolio Management. It enhances a Service Portfolio by providing a single view of business service performance across an organization, for business processes such as Operation, Risk, Investment, and Finance. | 
| service identity | |
| service principal | |
| shaping data | Selecting or combining properties in a `QueryCache` or `EntityCache` to form variables that are a closer match for the intended `ViewModel`.  This differs from filtering in that filtering selects rows in a `QueryCache` instead of columnar values. | 
| Shell | |
| singleton | |
| SLA                      | Service Level Agreement |
| Selenium                     | Software-testing framework for web applications that  provides a playback tool for authoring tests.  |
| separator  | |
| sideload          | The process of transferring data between two local devices, or between the development platform and the local host. Loading an extension for a specific user session from any source other than the URI that is registered in the Portal. Also side load, side-load. |  
| silent polling        | The status of an operation is not reported while the operation  is in progress |
| single-event high loads | Many requests for the same information, based on a brick-and-mortar occasion that may not be an annual event. |
| single page application           | A web application or web site that interacts with the user by dynamically rewriting the current page  instead of providing entire new pages from a server.  |
| single-sign-on authentication | |
| Sketch | located at  | [http://aka.ms/portalfx/sketch](http://aka.ms/portalfx/sketch)  |
| skip-take | Also known as random access.  Accessing data in an order that is not sequential.  |
| SLA                       | Service Level Agreement | 
| smoke test               | see build verification test  |
| sovereign cloud  | Instances of Azure restricted to a particular group of users. This group may consist of one geopolitical boundary, like a country. It may also consist of one legal boundary, for example, the public sector. |
| SSL                      | Secure Socket Layer |
| stage | | 
| stakeholder              | A person, group or organization that has interest or concern in an organization. Stakeholders can affect or be affected by the organization's actions, objectives and policies. |
| stamp                    | An instance of a service in a region. Every extension can deploy one or more extension editions based on testing requirements. The main extension is used for production and is the only one that the Portal will load by default. Also known as configuration or configuration file.   | 
| startboard                   |  Dashboard. |
| sticky                       | Provides quick statistics and fast access to specific types of testing functionality. |
| style    | A technical term for the effect a  writer or developer can create through attitude, language, and the mechanics of writing.        |
| subscription | | 
| subtopic | An area that is closely related to the main topic, but due to size or granularity, may be in its own file.  There are typically links to subtopics from the topic document, or from other topics in the Azure library.  |
| Scalable Vector Graphics (SVG) |  An XML-based vector image format for two-dimensional Web graphics. |
| synthetic traffic            | Traffic that has been created with a traffic generator and that behaves like real traffic. It can be used to capture the behavior of the network or device under investigation. |

## T

| Term | Meaning   |
| ---- | --- |
| TFS              | Team Foundation Server |
| telemetry | |
| third-party extension     | An Azure Portal extension that is developed by partners outside of Microsoft |
| tile |  distinct sets of information on a small blade. Domain-specific tiles might display  information about a resource, like subnet lists or usage quotas, whereas more generic tiles might display resource health or billing information. The user can move tiles, change their size, or pin frequently-used tiles to a startboard.  Tiles that appeal to a subset of  extension  users  are located in  the tile gallery instead of on the blade. |
| timezone         | The local time of a region or a country, based on factors like time zone maps and Daylight Savings Time. | 
| timezone offset  | The difference, in minutes, between UTC time and the current time in the current locale. |
| toast notification | |
| topic | A specific area of Azure design, development, and support. Most topics are located in the main index or README.md file.  | 
| trace mode         | |
| tracked resource | | 
| trusted authority    | |
| trusted host    | |
| two-factor authentication | 
| type metadata | Data that describes an  object and  its properties.  | 
| Typescript   | aka no-PDL programming. | 
| typings | |


## U

| Term | Meaning   |
| ---- | --- |
| UI                                | User Interface |
| unbundler | The software practice of breaking up combined packages into separate components. |
| untrusted extension | An extension that is not accompanied by an SSL certificate. |
| URI                      | Universal Resource Identifier  | 
| URL              | Uniform Resource Locator |
| usability testing            | Tests that are conducted with real users to determine whether the extension, blade, or part that is being designed or developed  is easy to use and meets the user requests for specific functionality. |
| UTC              | Universal Coordinated Time  |
| UX                                | User Experience |

## V

| Term | Meaning   |
| ---- | --- |
| validation |  The process of ensuring that form or field contents are within the specified constraints for an application.  This includes items like field length or numeric checks. |
| ViewModel | A code construct that separates the application view from the data model.  It conveys relevant streams of data to the View and applies the UI logic.  It also exposes methods, commands, and other elements that maintain the state of the view, or manipulates the data model as the result of actions on the view.  |
| ViewModel                    | Holds all the data associated with the screen. Allows user data to be separated from context pane data and to persist through configuration changes. Also view model, View-Model. |
| voice and tone  | The attitude that a document conveys about its  subject and its readers. Voice can be institutional or academic — i.e.,  objective or formal. Tone can be informative or affective by either providing information or persuading the reader.  |


## W

| Term | Meaning   |
| ---- | --- |
| WARM                 | Windows Azure Release Management |
| waterfalling  | The order in which extension assets are loaded and rendered in a  browser.  This includes  CSS, blades, JSON, HTML, images,  and third party content. Waterfall charts are used to pinpoint areas within  the series of actions that occur between a user and a server that can be made asynchronous, simultaneous, or consolidated.   |
| WCAG                  | Web Content Accessibility Guidelines                             | 
| web worker | A way to for extensions to run scripts in background threads. |
| Weighted Experience Score (WxP) | The percentage of blade usage that meets the performance bar. |
| WHCM                  | Windows High Contrast Mode     |
| whitelist | The practice of specifying an index of approved software elements  that are permitted to be present and active on a Web page. The goal of whitelisting is to protect computers and networks from potentially harmful applications.  |




## X

| Term | Meaning   |
| ---- | --- |

## Y

| Term | Meaning   |
| ---- | --- |

## Z

| Term | Meaning   |
| ---- | --- |
| zip file             | The extracted deployment artifacts that are generated during the build.  They and the  `config.json` file will be deployed to a public endpoint.  |

## Zero

| Term | Meaning   |
| ---- | --- |

## 1

| Term | Meaning   |
| ---- | --- |
| 1CS                       | One Compliance System  | 

## 2

| Term | Meaning   |
| ---- | --- |

## 3

| Term | Meaning   |
| ---- | --- |

## 4

| Term | Meaning   |
| ---- | --- |

## 5

| Term | Meaning   |
| ---- | --- |

## 6

| Term | Meaning   |
| ---- | --- |

## 7

| Term | Meaning   |
| ---- | --- |

## 8

| Term | Meaning   |
| ---- | --- |

## 9

| Term | Meaning   |
| ---- | --- |
| 95th percentile | A score at the 95th percentile means that 95% of the scores are lower, and  5% of the scores are higher. | |
