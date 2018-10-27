function markAsValid(element, valid) {
  if (!element) {
    return;
  }
  let rootElement = element.parentElement.parentElement;
  if (valid) {
    rootElement.classList.remove("has-error");
  } else {
    rootElement.classList.add("has-error");
  }
  Array.from(rootElement.getElementsByClassName("help-block")).forEach((e) => {
    e.style.display = valid?'none':'block';
  });
}

function validateForm() {
  if (!useValidations){
    return true;
  }
  let invalidElement = null;

  fields.forEach((f) => {
    if (f.autoField ||
        f.allowEmpty ||
        (f.doubleFormOnly && hideDoubleForm) ||
        (f.likudOnly && hideLikud) ||
        (f.nonLikudField && hideNonLikud)
        ){

      return;

    }

    let wfID = f.partOfDate? 'web-form-' + f.partOfDate : getWebFormId(f.name);
    let element = document.getElementById(wfID);

    if (element && (isEmpty(f, element) || !isValidInput(f,element))) {
      if (!invalidElement) {
        invalidElement = element;
      }
      markAsValid(element, false);
    } else {
     markAsValid(element, true);
    }
  });

  if (invalidElement) {
    cursorFocus(invalidElement);
    invalidElement.scrollIntoView();
  }

  return (!invalidElement);
}

function isValidInput(field , element) {
  let res = true;
  if (field.type === 'input'){
    if (field.validationType === 'number' && !isDigitsString(element.value)){
      res = false
    }
  }

  if(field.partOfDate){
    res = editedDatesNames.includes(field.partOfDate);
  }

  return res;
}


function isDigitsString(str){
  return /^\d+$/.test(str);
}

function initializeValidation() {

  fields.forEach((f) => {
   initDateValidationIfDate(f);

    if (f.autoField || f.allowEmpty)
      return;
    
    let wfID = f.partOfDate? 'web-form-' + f.partOfDate : getWebFormId(f.name);
    let element = document.getElementById(wfID);
    if (element) {
      element.oninput = function() {
        markAsValid(element, !isEmpty(f, element));
      };
      element.onpropertychange = element.oninput;
      element.onblur = element.oninput;
    }
  });
}

function initDateValidationIfDate(f){
     if (f.partOfDate && f.name.endsWith('year')){


                   $('#web-form-' + f.partOfDate)
                    .datepicker({
                                  autoclose: true,
                                  startView: 0,
                                  endDate: new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
                                })
                        .on("changeDate", function(e) {
                            editedDatesNames.push(f.partOfDate);
                            console.log('added: ' + f.partOfDate);

                     });
          }
    }

