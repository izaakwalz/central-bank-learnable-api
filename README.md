# Central Bank Learnable Api

# Learnable 21:Backend Standardization Test

---

## Description

The Central Bank of Learnable have given me a task to setup a basic <b>banking API service</b>
for their platform that makes online banking seamless for their customers.
with the following features:

## Documentaion

###### <b>DOCS ⚡:</b> <a href="https://documenter.getpostman.com/view/9943864/UVR8oSjB">read-api-documention</a>

##### <b>TODOS ⚡:</b> <a href="/docs/todo.md">todo-end-point</a>

## Features

#### User's can:

-   Login
-   Deposit money
-   Withdraw money
-   Transfer funds to other users
-   See a list of their transactions

#### Admin can:

-   Add users
-   Delete users
-   Reverse transactions(transfer)
-   Disable a user’s account

## Usage

### Env Variables

Create a .env file in then root and add the following

-   `PORT = 5000`
-   `NODE_ENV = development`

### Install Dependencies

-   ` npm install`

### Populate Database (users & accounts)

use the following commands to populate the database with some sample users and accounts as well as destroy all data

-   `npm run import-users` Import users to database to create an admin

### Sample User Logins

---

-   email: `demo@example.com` (admin)
-   email: `jon@example.com` (customer)
-   email: `tom@example.com` (customer)

---

### Run

-   `npm run dev`

👾👾👾👾👾👾👾****\_\_\_****👾👾👾👾👾👾👾
