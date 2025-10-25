function validateForm(form) {
  let validationResults = null;
  for (const field in form) {
    const value = form[field].value;
    const required = form[field].required === true;

    const fieldValidation = {
      isValid: true,
      errors: []
    };

    if (required) {
      if (value === null || value === undefined || value === '') {
        fieldValidation.isValid = false;
        fieldValidation.errors.push('Este campo é obrigatório.');
      }
    }

    if (!fieldValidation.isValid) {
      if (!validationResults) validationResults = {};
      validationResults[field] = fieldValidation;
      form[field].status = 'error';
      form[field].errors = fieldValidation.errors;
      setTimeout(() => {
        form[field].status = null;
        form[field].errors = [];
      }, 5000);
    }
  }

  if (validationResults) console.log('Validation Results:', validationResults);
  return validationResults === null;
}

function clearForm(form) {
  for (const field in form) {
    form[field].value = null;
    form[field].status = null;
    form[field].errors = [];
  }
}

function loadData(form, data) {
  for (const field in form) {
    if (data.hasOwnProperty(field)) {
      data[field] = form[field].value;
    }
  }
}

function loadForm(form, data) {
  for (const field in form) {
    if (data.hasOwnProperty(field)) {
      form[field].value = data[field];
    }
  }
}

export default {
  validateForm,
  clearForm,
  loadData,
  loadForm
};