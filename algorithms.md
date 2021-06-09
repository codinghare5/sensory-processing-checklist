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
     "status": array of answer code eg [013520], or 0 if the answer to all questions is 'False'.
    },
    ..... more question statuses
  ]
}
```
## Changing button code to checkboxes
The issue is that with buttons the status has not been changed when clicked and you have to change the status manually (by toggling a class).

With checkboxes, the status has been changed. So you have to work out what to do based on the change.

### changed to not checked
FalseButton: On change: if now false it was true. But if it was true then no other checkboxes were checked. If now false no checkboxes are checked. This is not allowed to change checked back to true. In other words FalseButton.checked has to stay true.

Notsure: On change if now false it was true. Only NotSure was checked. Now it is not checked so we have to check FalseButton.

If currentvalue - this value > 0 then either WasTrue or TrueNow is clicked and thisButton is also either TrueNow or WasTrue. We are in the situation where the original status was that both WasTrue and TrueNow were checked. So all we have to do is set currentvalue to currentvalue - thisvalue.

### changed to checked

## Gathering Question Data
Questions come in sets, effectively labeled by sense and category index. We could keep track of the status as a set or as individual questions - or both.

My code to ensure the correct behaviour for the questions requires that there is a wrapper around each question. I did this via <form> but <fieldset> would be an appropriate tag as a wrapper. This should have an id that matches the name of the checkboxes (or buttons). That way, the name of the button can be used to find the right fieldset and thus obtain all the buttons in the fieldset.

There is nothing to stop us adding a value to the field set tag which indicates the status of the questions. This status can be calculated and set using the function that activates when a button is clicked. We just need to add and subtract when we uncheck/check buttons/checkboxes.

We need a wrapper around the set of questions - around the accordion body. This could be a fieldset too with an appropriate class so they are easy to collect.

If having a value set to an array in html is not too difficult, this fieldset could have a value that is set to an array of question status codes. The appropriate code could be set at the same as dealing with a clicked answer: we could update the array of values. But I am not sure this is efficient. It might be better to create this at the end. But this might be too intensive to compute and it may be better to do it at the end.

Suggested code (not tested). 

```
<div id="body-{{ topidpart }}-{{ sideindex }}-{{ bodyindex }}" //accordion body id
            class="accordion-collapse collapse" 
            aria-labelledby="headingOne"
            data-bs-parent="#{{ topidpart }}-{{ sideindex }}">
  <fieldset class="QuestionSet" // so can collect sets of questions
                id="{{sense}}-{{category-index}} 
                value=array of values - maybe>

    {% for question in questionarray %}
      {% set questionName = senseid + '-' + catindex + '-' + loop.index %}
      <div class="accordion-body">
        <fieldset class="Question" // so can grab all questions
                    id="{{questionName}} // used to grab all the buttons/checkboxes
                    value= code value of combination>
          {{ question }} // should this be a tag of some sort?

          {# use class=row to spread radio inputs #}
          <div class="row row-cols-auto justify-content-center">
            {% for opt in  questionOptions %}
              //code to generate button/checkboxes 
              // name of all buttons/checkboxes should {{questionName}}
              //        Same as the id in the fieldset.
              //        Then the name can be used to grab the fieldset and thus the 
              //            rest of the buttons
            {% endfor %}
          </div>
        </fieldset>
      </div>
    {% endfor %}

  </div> <!-- end row -->
</div> <!-- end accordion body -->
```

Note that if we store the answers to a questions set as an array (collect QuestionSet rather than Question), there is a need to collect the questions where the answers are false. However, where all the answers are set to false, then there is no need to record the answers. A simple sum of the answer codes is enough to work this out. 

Then when we read in the saved file, we just need to loop through it, grab the appropriate question set and set the answers. To save repeated searching for a question set, we could save the question set in the file with just 0 or null for the array - then we can loop through the question sets as long as everything is in the correct order.

## Form Submission
We can have a button to submit the form, but it does not have to be a submit button: it can just be an ordinary button.

When this button is clicked we 
```
Create header information
Create an array of question sets for the json file

GATHER an array of QuestionSet
LOOP through the question sets
  GATHER an array of questions from QuestionSet (may be only one)
  CREATE array to put question answer codes in (or get the array)
  LOOP through each question (not needed if array is in QuestionSet)
    insert code into array of answer code
  
  SUM question codes // no point adding in an array of 0
  PUSH question set to array of question sets

WRITE as JSON file using appropriate dialog to save a file
```

It is probably best to create the array of question codes when it comes to saving the results.

  


## Toggling between views
It should not be difficult to enable toggling between views (Sense first or metacategory first) while keeping the answers to the questions intact.

The head of an accordion links to the body. Therefore, it should be possible to generate all the sets of questions first, giving them an appropriate ID (as is done anyway). Note that questions have the same name and ID irrespective of the view type.

Then it should be a matter of generating both views and linking the questions sets to the appropriate accordion in each view. So both views link to the same questions sets. Togging the view is then a matter of setting top, sides, and body accordion headers to visible or not.

We just need to set classes such as SenseFirst and MetaCategoryFirst so that we can grab the tags to toggle.
