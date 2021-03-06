$(document).ready(function () {
  // Looks for a query param in the url for customer_id and get's that customer's data
  var url = window.location.search;
  var customerId;
  if (url.indexOf("?customer_id=") !== -1) {
    customerId = url.split("=")[1];
    getCustomerData(customerId);
  }
  // var mileageId
  // event listener for the submit button
  $(document).on(
    "submit",
    "#customerUpdateForm",
    handleCustomerUpdateFormSubmit
  );

  // code block to get user admin status
  var hasAdmin;

  function getUser() {
    $.get("/userData", function (data) {
      // reassign global variable
      hasAdmin = data.hasAdmin;
      // if admin, add profits link to navbar
      if (hasAdmin == true) {
        $("#profitsNav").append(
          '<a class="nav-link" href="/profits">Profits</a>'
        );
      }
    });
    return hasAdmin;
  }
  getUser();

  // function to get the corresponding customer's data
  function getCustomerData(customer) {
    customerId = customer || "";
    if (customerId) {
      customerId = customerId;
    }
    $.get("/customers/" + customerId, function (data) {
      console.log("Customer", data);
    }).then(function (data) {
      // mileageId = data.Mileages[0].id
      // selecting radio button
      $("input[name=gender][value=" + data.gender + "]").attr(
        "checked",
        "checked"
      );
      // pre-inserting the customer's data into the corresponding input fields
      $("#idInput").val(data.id);
      $("#firstNameInput").val(data.firstName);
      $("#lastNameInput").val(data.lastName);
      $("#dobInput").val(data.dob);
      $("#phoneInput").val(data.phone);
      $("#emailInput").val(data.email);
      // if (data.Mileage == null) {
      //   $("#mileageInput").val("")
      // } else {
      // $("#mileageInput").val(data.Mileages[0].mileage);

      // }
    });
  }

  // function to handle form submission
  function handleCustomerUpdateFormSubmit(event) {
    event.preventDefault();

    // if required fields are missing, alert and terminate function
    if (
      !$("#firstNameInput").val().trim().trim() ||
      !$("#lastNameInput").val().trim().trim() ||
      !$("#phoneInput").val().trim().trim()
    ) {
      alert("You are missing a required field!");
      return;
      // otherwise ...
    } else {
      var selectedGender = $("#genderFieldset input[type='radio']:checked");
      if (selectedGender.length > 0) {
        genderInput = selectedGender.val();
      }

      // convert name inputs to upper case for consistency
      var firstNameUpper = $("#firstNameInput").val().trim().toUpperCase();
      var lastNameUpper = $("#lastNameInput").val().trim().toUpperCase();

      // set up object with customer data to be sent
      var updateCustomer = {
        id: $("#idInput").val().trim(),
        firstName: firstNameUpper,
        lastName: lastNameUpper,
        gender: selectedGender.val().trim(),
        dob: $("#dobInput").val().trim(),
        phone: $("#phoneInput").val().trim(),
        email: $("#emailInput").val().trim(),
        // mileage: $("#mileageInput").val().trim(),
      };
      // console.log(JSON.stringify(updateCustomer))
      // make ajax call with PUT method to update the corresponding customer's data with data in updateCustomer object.
      $.ajax({
        method: "PUT",
        url: "/customers",
        contentType: "application/json",
        data: JSON.stringify(updateCustomer),
        dataType: "json",
        // success: function() {
        //   console.log(mileageId)
        // }
      }).then(function (updateCustomer) {
        console.log("updateCustomer", updateCustomer);
        // console.log()
        alert("Customer Information Updated!");
        // send user back to the corresponding customer's details page
        window.location.href =
          "/customerDetails?customer_id=" + $("#idInput").val();
      });
    }
  }
});
