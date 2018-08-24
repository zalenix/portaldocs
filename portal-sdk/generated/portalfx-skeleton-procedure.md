<a name="skeleton-procedure"></a>
## Skeleton Procedure
<!-- topic name is a level 2 at the beginning of the doc>

<!--  required document.  -->

This document describes procedures or checklists that are associated with a topic.  These are the types of items that must all be completed, sometimes in a specific order, in order to accomplish a specific developer task. 

Procedures and checklists do not describe the items that are being manipulated; instead, they describe how to manipulate them. Developers may review the topic or use the procedure in any order.

For the most part, procedures do not include phrases like "as specified in. . ."; references to other topics should have been included in the main topic, or in the overarching document that contains all of the gitHub links. However, a link may be appropriate for  more complicated  procedures  if a subprocedure  is best described in its own subtopic.

<a name="name-of-process"></a>
## Name of Process

This process validates that [state purpose of checklist]. Images of the procedure are optional.  Images  should be included in the document above the procedure that they specify, as in the following diagram.

   ![alt-text](../media/top-extensions-partner-request/partner-request-flow.png "New Project Dialog")

1. Step 1 of procedure

   If possible, make screenshots that include what the screen should look like, or the changes that the developer should make, as in the following image.
    
    ![alt-text](../media//portalfx-extensions-create-first-extension/new-project-template.png "Step Validation")

1. Step 2 of procedure

1. Step 3 of procedure, and so on until the entire procedure or checklist is specified.

1. Optional.  A compliment that indicates that the procedure is complete.

<a name="create-document-with-the-skeleton"></a>
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