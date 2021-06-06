---
layout: layouts/base.njk
title: Algorithms
permalink: /algorithms/
templateClass: tmpl-home
eleventyNavigation:
  key: Algorithms
  order: 7
---
# Algorithms
## Code to indicate question status
This is subject to consultation with Olga Bogdashina
- False: 0
- Not Sure: 1
- Was True: 2
- True: 3
- Was True AND True: 5

## Suggested JSON saved file format
This is a suggestion for discussion
```
{
  "type": SPCR,
  "version": 1,
  "QuestionStatus": [
    {"name": name of question set,
     "status": array of answer code eg [013520]
    },
    ..... more question statuses
  ]
}
```

## Gathering Question Data
Questions come in sets, effectively labeled by sense and category index. We could keep track of the status as a set or as individual questions - or both.

My code to ensure the correct behaviour for the questions requires that there is a wrapper around each question. I did this via form but <fieldset> would be an appropriate tag as a wrapper. This should have an id that matches the name of the checkboxes (or buttons). That way, the name of the button can be used to find the right fieldset and thus obtain all the buttons in the fieldset.

There is nothing to stop us adding a value to the field set tag which indicates the status of the questions. This status can be calculated and set using the function that activates when a button is clicked. We just need to add and subtract when we uncheck/check buttons/checkboxes.

We need a wrapper around the set of questions - around the accordion. This could be a fieldset too with an appropriate class so they are easy to collect.

If having a value set to an array in html is not too difficult, this fieldset could have a value that is set to an array of question status codes. The appropriate code could be set at the same as dealing with a clicked answer: we could update the array of values. But I am not sure this is efficient. It might be better to create this at the end.

Note that now I think collecting the false answers is a good idea. However, if all the answers are set to false, then there is no need to do so: a simple sum of the answer codes is enought to work this out.

## Toggling between views
It should not be difficult to enable toggling between views (Sense first or metacategory first) while keeping the answers to the questions intact.

The head of an accordion links to the body. Therefore, it should be possible to generate all the sets of questions first, giving them an appropriate ID. Note that questions have the same name and ID irrespective of the view type.

Then it should be a matter of generating both views and linking the questions sets to the appropriate accordion in each view. So both views link to the same questions sets. Togging the view is then a matter of setting top, sides, and body accordion headers to visible or not.
