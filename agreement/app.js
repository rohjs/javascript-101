const form = document.querySelector('.signup-form')
const checkAll = document.querySelector('.form-check-all input')
const checkboxes = document.querySelectorAll('.form-group input')
const submitButton = document.querySelector('button')

const agreements = {
  termsOfService: false,
  privacyPolicy: false,
  allowPromotions: false,
}

form.addEventListener('submit', function (e) {
  e.preventDefault()
})

checkboxes.forEach(function (item) {
  item.addEventListener('input', toggleCheckbox)
})

function toggleCheckbox(e) {
  const { checked, id } = e.currentTarget
  if (!checked) {
    checkAll.checked = false
  }
  agreements[id] = checked
  this.parentNode.classList.toggle('active')
  toggleSubmitButton()
}

function toggleSubmitButton() {
  const { termsOfService, privacyPolicy } = agreements
  if (termsOfService && privacyPolicy) {
    submitButton.removeAttribute('disabled')
  } else {
    submitButton.setAttribute('disabled', '')
  }
}

checkAll.addEventListener('click', function (e) {
  const { checked } = e.currentTarget
  if (checked) {
    checkboxes.forEach(function (item) {
      item.checked = true
      agreements[item.id] = true
      item.parentNode.classList.add('active')
    })
  } else {
    checkboxes.forEach(function (item) {
      item.checked = false
      agreements[item.id] = false
      item.parentNode.classList.remove('active')
    })
  }
  toggleSubmitButton()
})
