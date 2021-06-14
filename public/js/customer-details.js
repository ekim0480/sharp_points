$(document).ready(function () {
  // saleContainer holds all of our sales
  var saleContainer = $(".sale-container");
  var saleList = $("tbody");
  // Click event for new sale and delete button
  $(document).on("click", "#deleteSale", handleSaleDelete);
  $(document).on("click", "#newSaleBtn", handleNewSale);
  $(document).on("click", "#editDetailsBtn", handleEditDetails);
  // $(document).on("click", "#viewSale", handleViewSale)
  // Variable to hold our sales
  var sales;

  // The code below handles the case where we want to get sales for a specific customer
  // Looks for a query param in the url for customer_id
  var url = window.location.search;
  var customerId;
  if (url.indexOf("?customer_id=") !== -1) {
    customerId = url.split("=")[1];
    getCustomerData(customerId);
    getSales(customerId);
  }
  // If there's no customerId we just get all sales as usual
  else {
    getSales();
  }

  // function to GET a customer's data
  function getCustomerData(customer) {
    customerId = customer || "";
    if (customerId) {
      customerId = customerId;
    }
    $.get("/customers/" + customerId, function (data) {
      console.log("Customer", data);
    }).then(function (data) {
      // console.log(data.firstName)
      // printing customer data
      // declaring dom variables
      var listEl = document.createElement("ul");
      var li1 = document.createElement("li");
      var li2 = document.createElement("li");
      var li3 = document.createElement("li");
      var li4 = document.createElement("li");
      var li5 = document.createElement("li");
      var li6 = document.createElement("li");

      // set the text content of the list that will be printed
      li1.textContent = "ID: " + data.id;
      li2.textContent = "Name: " + data.lastName + ", " + data.firstName;
      li3.textContent = "Date of Birth: " + data.dob;
      li4.textContent = "Phone: " + data.phone;
      li5.textContent = "E-mail: " + data.email;
      li6.textContent = "Mileage: " + data.mileage;
      // append the list to #customerDetailsRow
      $("#customerDetailsRow").append(listEl);
      // append each list item to the newly appended list
      listEl.appendChild(li1);
      listEl.appendChild(li2);
      listEl.appendChild(li3);
      listEl.appendChild(li4);
      listEl.appendChild(li5);
      listEl.appendChild(li6);
    });
  }

  // This function grabs sales from the database and updates the view
  function getSales(customer) {
    // if customer id is present, print that get and print that customer's sales
    customerId = customer || "";
    if (customerId) {
      customerId = "/?customer_id=" + customerId;
    }
    $.get("/sales" + customerId, function (data) {
      // console.log("Sales", data);
      sales = data;
      // if there are no sales, run displayEmpty
      if (!sales || !sales.length) {
        displayEmpty(customer);
      } else {
        initializeRows();
      }
    });
  }

  // function to create rows for each sale and prepare them to be inserted into the sales table
  function createSaleRow(saleData) {
    // console.log(saleData);
    // console.log(saleData.depCity)
    var newTr = $("<tr>");
    newTr.data("sale", saleData);
    newTr.append("<td>" + saleData.depCity + "</td>");
    newTr.append("<td>" + saleData.depFlight + "</td>");
    newTr.append("<td>" + saleData.depDate + "</td>");
    newTr.append("<td>" + saleData.desCity + "</td>");
    newTr.append("<td>" + saleData.retFlight + "</td>");
    newTr.append("<td>" + saleData.retDate + "</td>");
    newTr.append("<td>" + saleData.saleAmount + "</td>");
    newTr.append("<td>" + saleData.points + "</td>");
    // newTr.append("<td><a id='viewSale' style='cursor:pointer;color:green'>View</a></td>");
    // add view/edit link
    newTr.append(
      "<td><a href='/saleUpdate?sale_id=" + saleData.id + "'>View/Edit</a></td>"
    );
    // add delete link
    newTr.append(
      "<td><a style='cursor:pointer;color:red' id='deleteSale'>Delete</a></td>"
    );
    return newTr;
  }

  // InitializeRows handles appending all of our constructed sale HTML inside saleContainer
  function initializeRows() {
    saleContainer.empty();
    var salesToAdd = [];
    for (var i = 0; i < sales.length; i++) {
      //   console.log(salesToAdd)
      salesToAdd.push(createSaleRow(sales[i]));
    }
    renderSaleList(salesToAdd);
  }

  // function to render sales rows, if present
  function renderSaleList(rows) {
    saleList.children().not(":last").remove();
    saleContainer.children(".alert").remove();
    if (rows.length) {
      //   console.log(rows);
      saleList.prepend(rows);
    } else {
      renderEmpty();
    }
  }
  // function to handle new sale
  function handleNewSale() {
    // extract customerid from url
    var url = window.location.search;
    var customerId;
    if (url.indexOf("?customer_id=") !== -1) {
      customerId = url.split("=")[1];
    }
    // send user to corresponding customer's add sale page
    window.location.href = "/sale?customer_id=" + customerId;
  }

  // function to handle editing customer's details
  function handleEditDetails() {
    // extract customerid from url
    var url = window.location.search;
    var customerId;
    if (url.indexOf("?customer_id=") !== -1) {
      customerId = url.split("=")[1];
    }
    // send user to corresponding customer's update page
    window.location.href = "/customerUpdate?customer_id=" + customerId;
  }

  // This function handles the sale delete
  function handleSaleDelete() {
    // extracting the id of the corresponding sale
    var listItemData = $(this).parent("td").parent("tr").data("sale");
    var id = listItemData.id;
    // console.log(id)
    // show confirm window to ask user to confirm the deletion
    var confirmDelete = confirm("Confirm delete of sale?");
    // if user confirms, make the ajax call to delete the sale
    if (confirmDelete) {
      $.ajax({
        method: "DELETE",
        url: "/sales/" + id,
      }).then(function () {
        // refresh page
        location.reload();
      });
    }
  }

  // This function handles the view link
  // function handleViewSale(){
  //   var listItemData = ($(this).parent("td").parent("tr").data("sale"))
  //   console.log(listItemData)
  //   document.write('<html><body><p id="depCity"></p><p id="depFlight"></p><p id="depDate"></p></body></html>')
  //   document.getElementById("depCity").innerHTML = "Departure City: " + listItemData.depCity
  //   document.getElementById("depFlight").innerHTML = "Departing Flight: " + listItemData.depFlight
  //   document.getElementById("depDate").innerHTML = "Departure Date: " + listItemData.depDate
  // }

  // This function displays a message when there are no sales
  function displayEmpty(id) {
    var query = window.location.search;
    var partial = "";
    if (id) {
      partial = " for Customer #" + id;
    }
    saleContainer.empty();
    var messageH2 = $("<h2>");
    messageH2.css({ "text-align": "center", "margin-top": "50px" });
    messageH2.html("No sales yet" + partial);
    saleContainer.append(messageH2);
  }
});
