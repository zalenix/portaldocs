<a name="skeleton"></a>
# Skeleton
<!-- topic name is a level 1 header at the beginning of the doc-->

This document contains the skeleton for authoring Azure documents that are stored in gitHub. The skeleton will be used by gitHub to generate the document for the entire topic.  This information is contained in this document as gitHub commands so that an author can fill them in when the subtopics are written, and then generate the topic document.
This is the only document within the topic that contains an H1-level header.

1. Documents are organized by  major areas.  Some major areas are as follows:

   * blades
   * controls 
   * create
   * data
   * forms
   * parameters
   * parts
   * samples
   * styling
   * telemetry
   * ux

1. Within these major areas, documents are organized by topic. Some topics are object names or specific principles. For example, some filenames are `portalfx-blades-outputs.md`, `portalfx-controls-editor.md`, and `portalfx-forms-designing.md`.

1. There are some topics that do not have a major area. They are not specific to one topic, and consequently, may be linked to within several topics. A partial list is as follows.

   * portalfx-extensions-branches.md
   * portalfx-extensions-cnames.md
   * portalfx-extensions-contacts.md
   * top-extensions-developmentPhases.md
   * top-extensions-production-ready-metrics.md
   * top-extensions-publishing.md
   * portalfx-extensions-qualityEssentials.md
   * portalfx-stackoverflow.md
   * portalfx-extensions-status-codes.md

1. Subtopics that occur within topics, like overviews or procedures, will always use that word as the last node within the filename.  However, the author has the option of including the overview and the procedure in the topic document instead of using a GitHub include statement. 

Subtopics that are specific to a topic are self-naming, in one or two words. The last node of the file is the name of the subtopic, and is used to sort subtopics within the topic. Some filenames are `portalfx-telemetry-alerting-overview.md`, `portalfx-telemetry-alerting-performance.md` or `portalfx-style-guide-utility-classes.md`. 

1. Best Practices, FAQ's, and glossaries use a slightly different naming convention, in that they are named `portalfx-extensions-bp-<major-area>`,  `portalfx-extensions-faq-<major-area>`, `portalfx-extensions-glossary-<major-area>`, respectively.

1. Subtopic files are contained within the topic document in the following order.

    | Name                                           | Purpose |
    | ---------------------------------------------- | ------- |
    | `portalfx-<major-area>-<topic>-overview.md`    | Required. General discussion of topic. May be included in the topic document instead of remaining a separate file. |
    | `portalfx-<major-area>-<topic>-<subtopic1>.md` | Optional. A section that is used when the topic goes deeper than an overview.  The last item in the overview may be a table that links to these sections, in addition to relying on the gitHub includes that are a part of the overarching document. |
    | `portalfx-<major-area>-<topic>-<subtopic2>.md` | Optional. A section that is used when the topic goes deeper than an overview. |
    | `portalfx-<major-area>-<topic>-procedure.md`   | Optional.  Checklist document. Used when there are specific steps to follow, or when there are specific tasks whose completion must be verified. May be included in the topic document instead of remaining a separate file. |
    | `portalfx-extensions-bp-<topic>.md`            | Optional. Best Practices for the topic. |
    | `portalfx-extensions-faq-<topic>.md`           | Optional. Frequently Asked Questions for the topic. |
    | `portalfx-extensions-glossary-<topic>.md`      | Required. Glossary for the topic. |

1. Sections that have been written for other documents can be linked to within the subtopics using normal gitHub linking procedures. This is best practice, and is preferred over copying and modifying paragraphs from file to file. If the section is a separate file, the link would resemble the following: `[portalfx-<major-area>-<topic>-<subtopic1>.md](portalfx-<major-area>-<topic>-<subtopic1>.md)`. Otherwise, if the section is a paragraph within a separate topic, the link would resemble the following `[portalfx-<major-area>-<topic>.md#<subtopic1>](portalfx-<major-area>-<topic>.md#<subtopic1>)`.

1. Files are included in a topic by gitHub, based on the topic-subtopic relationship. They are linked to in this overarching document with gitHub commands.  Because this skeleton file also functions as a sample document, the gitHub commands in the following section are slightly malformed.  To use this skeleton to create a new topic, fill in the parameters that are designated with angle brackets, and then enclose the gitHub command in curly brackets.

 **NOTE**: The command "gitdown" is at the beginning of each inclusion line and is enclosed in double quotes.
 
<!-- required Overview document.  -->
<!-- gitdown": "include-file", "file": "../templates/portalfx-<topic>-overview.md"} -->
   
<a name="skeleton-overview"></a>
## Overview

<!-- topic name is a level 2 at the beginning of the doc>

<!--  required document.  -->
This document describes the topic at a general level.  If portions of the topic lend itself to further discussion, a subtopic document is a good idea. If so, the subtopics are not included in this document; instead, they are included in the overarching document that contains a gitHub link to this overview.  This method reduces gitHub commands to one document per topic.

Subtopic documents can be authored along the same lines.

<!--  optional subtopic documents. Use these when the topic goes deeper than an overview. The overview may contain a table that links to these sections, in addition to (or instead of) relying on the following gitHub includes. -->
<!-- gitdown": "include-file", "file":  "../templates/portalfx-<major-area>-<topic>-<subtopic1>.md"  -->
<!-- gitdown": "include-file", "file":  "../templates/portalfx-<major-area>-<topic>-<subtopic2>.md"  -->

<!-- optional checklist document. Use this when there are specific steps to follow, or when there are specific tasks that the developer must verify as being completed. -->
<!-- gitdown": "include-file", "file": "../templates/portalfx-<major-area>-<topic>-procedure.md"  -->
   ## Skeleton Procedure
<!-- topic name is a level 2 at the beginning of the doc>

<!--  required document.  -->

This document describes procedures or checklists that are associated with a topic.  These are the types of items that must all be completed, sometimes in a specific order, in order to accomplish a specific developer task. 

Procedures and checklists do not describe the items that are being manipulated; instead, they describe how to manipulate them. Developers may review the topic or use the procedure in any order.

For the most part, procedures do not include phrases like "as specified in. . ."; references to other topics should have been included in the main topic, or in the overarching document that contains all of the gitHub links. However, a link may be appropriate for  more complicated  procedures  if a subprocedure  is best described in its own subtopic.

<a name="skeleton-name-of-process"></a>
## Name of Process

This process validates that [state purpose of checklist]. Images of the procedure are optional.  Images  should be included in the document above the procedure that they specify, as in the following diagram.

   ![alt-text](../media/portalfx-partner-request-process/partner-request-flow.png "New Project Dialog")

1. Step 1 of procedure

   If possible, make screenshots that include what the screen should look like, or the changes that the developer should make, as in the following image.
    
    ![alt-text](../media/portalfx-overview/new-project-template.png "Step Validation")

1. Step 2 of procedure

1. Step 3 of procedure, and so on until the entire procedure or checklist is specified.

1. Optional.  A compliment that indicates that the procedure is complete.

<a name="skeleton-create-document-with-the-skeleton"></a>
## Create document with the skeleton

The following is a sample procedure. It specifies how to author a document in the Azure library.

1. Make a copy all of the `skeleton` files in the template directory.  

1. Rename each file with the major area and the topic, for example, `portalfx-controls-*.md`, in which case, the overarching document is the `top-extensions-controls.md` file. 

1. Author the topic by placing the appropriate content in each file. Ensure that each topic or subtopic is complete and accurate.

1. At the end of the process, delete files that have no content, like Best Practices or FAQ.

1. Cross-check the document content against the links that were planned for inclusion. If all links have been used in the topic or subtopics, delete the FYI document.

1. Glossarize the topic by locating and defining on first mention all words that are used within the topic.  Exceptions are in the following list.
   * Common English usage, as specified in major dictionaries like [Cambridge](https://dictionary.cambridge.org), [Merriam-Webster](https://www.merriam-webster.com), [Oxford](https://en.oxforddictionaries.com), [Random House](http://www.dictionary.com).
  
   * Common computing terms as specified in major sources like [https://techterms.com/](https://techterms.com/).
  
   * Common acronyms as specified in major sources like [https://www.acronymfinder.com](https://www.acronymfinder.com).

 1. Amend the overarching document so that the gitHub commands include each existing section once and only once. The overarching skeleton document includes placeholders for this purpose.
  
<!--  optional subtopic documents. Use these when the topic goes deeper than an overview. The overview may contain a table that links to these sections, in addition to (or instead of) relying on the following gitHub includes. -->
<!-- gitdown": "include-file", "file":  "../templates/portalfx-<major-area>-<topic>-<subtopic1>.md"  -->
<!-- gitdown": "include-file", "file":  "../templates/portalfx-<major-area>-<topic>-<subtopic2>.md"  -->

<!-- optional Best Practices document -->
<!-- gitdown": "include-file", "file": "../templates/portalfx-<major-area>-bp-<topic>.md"  -->
   
<a name="skeleton-best-practices"></a>
## Best Practices
<!-- Title is required, as a level 2 heading.  If appropriate, the phrase ' for <topic>' can be appended. -->

This document contains best practices that are associated with the topic whose name is a node in the filename. Best practices are procedures other than the typical guidance for the topic or subtopic, and therefore were not mentioned in the overall discussion of the topic or subtopic. They also were not included in a procedure or checklist document for the topic. If there are no best practices for a topic, this optional document can be added when appropriate.

Best practices often result in improved performance, smaller software footprint, increased reusability and maintainability, or similar factors. Some practices are documented in industry practice, like the ***Testing Computer Software*** textbook that is located at [https://www.researchgate.net/publication/220689439_Testing_computer_software_2_ed](https://www.researchgate.net/publication/220689439_Testing_computer_software_2_ed). Although [Stackoverflow](https://stackoverflow.microsoft.com) contains good ideas, it is a forum centered more around answering questions than providing best practices.

In the discussion, mention why these practices are considered best practices, or are good practice for the industry or within software development.  If some of these practices are results of usability studies, a sentence like the following is appropriate.

"This section also includes practices that are recommended based on customer feedback and usability studies."

Descriptions that are in other ***Best Practices*** documents should not be copied into this document.  Instead, summarize the procedure here and use a link to the content  in the other document. In some instances the link is sufficient and does not require an explanation to be added to this document. These links are usually called out with the phrase "For more information, see . . . " and are the last sentence in the section.  

For more information, see [portalfx-extensions-bp-debugging.md](portalfx-extensions-bp-debugging.md).

* * * 

<a name="skeleton-best-practices-best-practice-description"></a>
### Best Practice Description

The title of the practice should be less than about five words long. The titles, which are H3 headings in HTML, do not need to be numbered.

The description or procedure should be no more than about five paragraphs long, where a paragraph is no less than four sentences.

Each best practice section ends with three asterisks, as in '* * *', to include a separator between topics.

* * * 

<a name="skeleton-best-practices-best-practice-example"></a>
### Best Practice Example

<a name="skeleton-best-practices-onebox-stb-has-been-deprecated"></a>
### Onebox-stb has been deprecated

Onebox-stb is no longer available. Please do not use it. Instead, migrate extensions to sideloading. For more information about sideloading, see [top-extensions-sideloading.md](top-extensions-sideloading.md).

For help on migration, reach out to <a href="mailto:ibiza-onboarding@microsoft.com?subject=Help on Migration">Ibiza Onboarding</a>.

* * * 


<!-- optional FAQ document -->
<!-- gitdown": "include-file", "file": "../templates/portalfx-<major-area>-faq-<topic>.md"  -->
   ## Frequently asked questions for Authoring Azure Documents
<!-- Title is required, as a level 2 heading.  If appropriate, the phrase ' for <topic>' can be appended. -->

FAQ's are items that are encountered many times, and developer teams appreciate the opportunity to answer the question only once and then direct individuals to this best answer.

The entire FAQ should be above the fold.  Any answer that requires scrolling to be read, at a normal default browser font size, should be added to the document topic or subtopic instead.

In some instances, the FAQ answer can contain the phrase "for more information about" and a link to the answer.  If the topic is complete, instead of writing a solution in the FAQ, just use the link.

The format for an FAQ item is comprised of the following five items. 

1.  ###Link

    The level-H3 heading is  a link to the FAQ so that other documents can use it to land on the page. The link can be crafted from the title, and should be less than about five words long.

1.  ***title***

    The title is styled in italics, and always ends with a question mark.  It is optional to begin the title with "Q: ". Titles that are obviously copied from sources like [Stackoverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza) should not be edited unless they are very long.  If the title contains multiple questions, some of them can be removed after the answer is crafted.

1.  Description

    This field is optional when the title of the FAQ describes the entire situation. This content may be from sources like **Stackoverflow**. The author who provides the answer may choose to describe the situation in more detail.

1. The word "SOLUTION:" followed by the solution to the question. 

1.  Three Asterisks 

    This styling displays a separator between FAQ's.

* * *

<a name="skeleton-best-practices-sample-faq-conversations"></a>
### Sample FAQ Conversations

<a name="skeleton-best-practices-sas-tokens"></a>
### SAS Tokens

***Can I provide a SAS token instead of keyvault for EV2 to access the storage account ?***

SOLUTION:
The current rolloutspec generated by **ContentUnbundler** only provides support for using keyvault. If you would like to use SAS tokens, please submit a request on [user voice](https:\\aka.ms\portalfx\uservoice).

* * *

<a name="skeleton-best-practices-"></a>
### 

***Q: When will support for friendly names become available ?***

Azure support for friendly names became available in SDK release 5.0.302.834.

* * *

<a name="skeleton-best-practices-other-topic-questions"></a>
### Other \<topic>  questions

***How can I ask questions about \<topic> ?***

You can ask questions on Stackoverflow with the tag [ibiza](https://stackoverflow.microsoft.com/questions/tagged/ibiza).

The Stackoverflow FAQ item should be included in every topic that contains an FAQ subtopic. For a list of Stackoverflow tags, see [portalfx-stackoverflow.md](portalfx-stackoverflow.md).

* * *
   
<!-- required Glossary document. -->
<!-- gitdown": "include-file", "file": "../templates/portalfx-extensions-glossary-<major-area>.md"  -->
   ## Skeleton Glossary 

<!-- ## <major-area> <topic> 

<!-- topic name is a level 2 at the beginning of the doc.  Including the major area in the name is optional, as in the preceding level 2 header. -->

<!--  The Glossary is a required document.  -->

This document contains all terms that are in the topic, with the following exceptions.
* Standard English Language
* Standard Computing terms, like the ones found in  [https://techterms.com/](https://techterms.com/). 
* Common acronyms, like the ones found in [https://www.acronymfinder.com](https://www.acronymfinder.com).

The document may or may not contain definitions for terms that are located in the following Microsoft glossaries.
| Title  | Location |
| ------ | -------- |
| Microsoft Office Server Master Glossary | [http://download.microsoft.com/download/1/A/9/1A96F918-793B-4A55-8B36-84113F275ADD/[MS-OFSGLOS].pdf](http://download.microsoft.com/download/1/A/9/1A96F918-793B-4A55-8B36-84113F275ADD/[MS-OFSGLOS].pdf) |
| Microsoft Terminology Collection | [https://www.microsoft.com/en-us/language/Terminology](https://www.microsoft.com/en-us/language/Terminology) |
| Windows Desktop Glossary | [https://msdn.microsoft.com/en-us/library/windows/desktop/dn688965.aspx](https://msdn.microsoft.com/en-us/library/windows/desktop/dn688965.aspx) | 
| Windows Protocols Master Glossary | [https://msdn.microsoft.com/en-us/library/cc232129.aspx](https://msdn.microsoft.com/en-us/library/cc232129.aspx) |

| Term           | Meaning |
| -------------- | -------- |
| above the fold | Initially displayed on the Web page without scrolling. |
| best practice  | A technique or methodology that, through experience and research, has proven to reliably lead to a desired result. |
| checklist      | A step-by-step set of instructions on how to accomplish a task. |
| FAQ            | Frequently Asked Questions |
| FYI            | For Your Information 
| gitHub         | A Web-based hosting service for version control or content management. |
| major area     | 
| overarching    | comprehensive; all-embracing. For example, the overarching skeleton document contains everything that has to do with Azure skeleton topics. Its name is used in skeleton subtopic files.  |
| procedure      | See checklist. |
| process validation | A procedure that ensures that the process has completed successfully, within expected levels of granularity. |
| SAS | Shared Access Signature |
| separator  |
| topic |
| subtopic |
| 