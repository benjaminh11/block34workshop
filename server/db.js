const pg = require("pg");
const uuid = require("uuid");

const client = new pg.Client();

const createTables = async () => {
  try {
    const SQL = `
      DROP TABLE IF EXISTS reservations;
      DROP TABLE IF EXISTS customers;
      DROP TABLE IF EXISTS restaurants;

      CREATE TABLE customers(
        id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      );

      CREATE TABLE restaurants(
        id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      );

      CREATE TABLE reservations(
        id UUID PRIMARY KEY,
        customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
        restaurant_id UUID REFERENCES restaurants(id),
        date DATE NOT NULL,
        party_count INTEGER NOT NULL CHECK (party_count > 0)
      );
    `;
    await client.query(SQL);
    console.log("Tables created successfully.");
  } catch (err) {
    console.error("Error creating tables:", err);
  }
};

// Create a customer
const createCustomer = async (name) => {
  try {
    const SQL = `INSERT INTO customers(id, name) VALUES($1, $2) RETURNING *;`;
    const { rows } = await client.query(SQL, [uuid.v4(), name]);
    return rows[0];
  } catch (err) {
    console.error("Error creating customer:", err);
  }
};

// Create a restaurant
const createRestaurant = async (name) => {
  try {
    const SQL = `INSERT INTO restaurants(id, name) VALUES($1, $2) RETURNING *;`;
    const { rows } = await client.query(SQL, [uuid.v4(), name]);
    return rows[0];
  } catch (err) {
    console.error("Error creating restaurant:", err);
  }
};

// Fetch all customers
const fetchCustomers = async () => {
  try {
    const SQL = `SELECT * FROM customers;`;
    const { rows } = await client.query(SQL);
    return rows;
  } catch (err) {
    console.error("Error fetching customers:", err);
  }
};

// Fetch all restaurants
const fetchRestaurants = async () => {
  try {
    const SQL = `SELECT * FROM restaurants;`;
    const { rows } = await client.query(SQL);
    return rows;
  } catch (err) {
    console.error("Error fetching restaurants:", err);
  }
};

// Create a reservation
const createReservation = async ({
  customerId,
  restaurantId,
  date,
  partyCount,
}) => {
  try {
    const SQL = `INSERT INTO reservations(id, customer_id, restaurant_id, date, party_count) 
                 VALUES($1, $2, $3, $4, $5) RETURNING *;`;
    const { rows } = await client.query(SQL, [
      uuid.v4(),
      customerId,
      restaurantId,
      date,
      partyCount,
    ]);
    return rows[0];
  } catch (err) {
    console.error("Error creating reservation:", err);
  }
};

// Fetch all reservations
const fetchReservations = async () => {
  try {
    const SQL = `SELECT * FROM reservations;`;
    const { rows } = await client.query(SQL);
    return rows;
  } catch (err) {
    console.error("Error fetching reservations:", err);
  }
};

// Delete a reservation
const destroyReservation = async (id) => {
  try {
    const SQL = `DELETE FROM reservations WHERE id=$1;`;
    await client.query(SQL, [id]);
    return true;
  } catch (err) {
    console.error("Error deleting reservation:", err);
  }
};

module.exports = {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  createReservation,
  destroyReservation,
  fetchReservations,
};
