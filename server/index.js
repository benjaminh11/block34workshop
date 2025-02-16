require("dotenv").config();
const express = require("express");
const PORT = process.env.PORT || 3000;

const {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  createReservation,
  destroyReservation,
  fetchReservations,
} = require("./db.js");

const app = express();
app.use(express.json());

//GEt Customers
app.get("/api/customers", async (req, res, next) => {
  try {
    res.send(await fetchCustomers());
  } catch (err) {
    next(err);
  }
});

// GET Restaurants
app.get("/api/restaurants", async (req, res, next) => {
  try {
    res.send(await fetchRestaurants());
  } catch (err) {
    next(err);
  }
});

// POST create a reservation
app.post("/api/customers/:id/reservations", async (req, res, next) => {
  try {
    const customerId = req.params.id;
    const { restaurantId, date, partyCount } = req.body;
    const reservation = await createReservation({
      customerId,
      restaurantId,
      date,
      partyCount,
    });
    res.status(201).send(reservation);
  } catch (err) {
    next(err);
  }
});

// GET all reservations
app.get("/api/reservations", async (req, res, next) => {
  try {
    res.send(await fetchReservations());
  } catch (err) {
    next(err);
  }
});

// DELETE a reservation
app.delete(
  "/api/customers/:customer_id/reservations/:id",
  async (req, res, next) => {
    try {
      await destroyReservation(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);

const init = async () => {
  await client.connect();
  console.log("connected to database");
  await createTables();

  const [customer1, customer2, restaurant1, restaurant2] = await Promise.all([
    createCustomer("Ben"),
    createCustomer("Gleyber"),
    createRestaurant("Pizza Palace"),
    createRestaurant("Sushi World"),
  ]);

  app.listen(PORT, () => {
    console.log(`port alive on ${PORT}`);
  });
};

init();
