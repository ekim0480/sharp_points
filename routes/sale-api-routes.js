// require in our models
const db = require("../models");

module.exports = function (app) {
  // GET route for getting the sales for a specific customer
  app.get("/sales", function (req, res) {
    var query = {};
    if (req.query.customer_id) {
      query.CustomerId = req.query.customer_id;
    }
    db.Sale.findAll({
      where: query,
      include: [db.Customer],
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

  // app.get("/profits", function (req, res) {
  //   console.log("body", req.body)
  //   console.log("param", req.params)
  //   db.Sale.findOne({
  //     attributes: ['profit']
  //   }).then(function (refreshedProfits){
  //     res.json(refreshedProfits)
  //   })
  // })

  // post route to create a blank sale for point redemption
  // purposes
  app.post("/usedPoints", function (req, res) {
    db.Sale.create({
      type: req.body.type,
      points: req.body.pointsUsed,
      notes: req.body.usedPointsOn,
      CustomerId: req.body.customerId,
    }).then(function (newUsedPoints) {
      res.json(newUsedPoints);
    });
  });

  // post route to create a new sale
  app.post("/sales", function (req, res) {
    var saleData = req.body;
    // console.log(req.body)
    db.Sale.create({
      type: saleData.type,
      origin: saleData.origin,
      depDetails: saleData.depDetails,
      depDate: saleData.depDate,
      destination: saleData.destination,
      arrivalDetails: saleData.arrivalDetails,
      arrivalDate: saleData.arrivalDate,
      saleAmount: saleData.saleAmount,
      points: saleData.points,
      accountsReceivable: saleData.accountsReceivable,
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

  // put route to update profit
  app.put("/profits", function (req, res) {
    db.Sale.update(req.body, {
      profit: req.body.profit,
      where: {
        id: req.body.id
      }
    }).then(function (updatedProfit) {
      res.json(updatedProfit)
    })
  })

  // put route to update a sale's accounts receivable when
  // pay in full is clicked
  app.put("/payInFull", function (req, res) {
    console.log(req.body)
    db.Sale.update(req.body, {
      accountsReceivable: req.body.accountsReceivable,
      notes: req.body.notes,
      where: {
        id: req.body.id
      }
    }).then(function (updatedAccountsReceivable) {
      res.json(updatedAccountsReceivable)
    })
  })

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
