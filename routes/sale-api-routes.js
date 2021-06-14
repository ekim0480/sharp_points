// require in our models
const db = require("../models");

module.exports = function (app) {
  // GET route for getting all of the sales
  app.get("/sales", function (req, res) {
    var query = {};
    if (req.query.customer_id) {
      query.CustomerId = req.query.customer_id;
    }
    db.Sale.findAll({
      where: query,
    }).then(function (dbSale) {
      res.json(dbSale);
    });
  });

  // Get route for retrieving a single sale
  app.get("/sales/:id", function (req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Customer
    db.Sale.findOne({
      where: {
        id: req.params.id,
      },
      include: [db.Customer],
    }).then(function (dbSale) {
      res.json(dbSale);
    });
  });

  // post route to create a new sale
  app.post("/sales", function (req, res) {
    var saleData = req.body;
    // console.log(req.body)

    db.Sale.create({
      depCity: saleData.depCity,
      depFlight: saleData.depFlight,
      depDate: saleData.depDate,
      desCity: saleData.desCity,
      retFlight: saleData.retFlight,
      retDate: saleData.retDate,
      saleAmount: saleData.saleAmount,
      points: saleData.points,
      notes: saleData.notes,
      remarks: saleData.remarks,
      CustomerId: saleData.customerId,
    }).then(function (newSale) {
      res.json(newSale);
    });
  });

  // put route to update a sale
  app.put("/sales", function (req, res) {
    // console.log("req body", req.body)
    // console.log("req query", req.params)

    db.Sale.update(req.body, {
      where: {
        id: req.body.id,
      },
    }).then(function (newSale) {
      res.json(newSale);
    });
  });

  // delete route to delete a sale
  app.delete("/sales/:id", function (req, res) {
    db.Sale.destroy({
      where: {
        id: req.params.id,
      },
    }).then(function (dbSale) {
      res.json(dbSale);
    });
  });
};