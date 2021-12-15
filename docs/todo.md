# Central Bank Learnable Api End-Points

## User's Endpoint:

#### Authentication

-   [x] Login - POST /auth/login
-   [x] Password reset request - POST /auth/request-password-reset
-   [x] Password reset - POST - /auth/reset-password/:code/sign

#### Transactions

-   [x] Deposit money - POST /users/transactions/deposit
-   [x] Withdraw money - POST /users/transactions/withdrawal
-   [x] Transfer funds - POST /users/transactions/transfer
-   [x] View list of Transactions - GET /users/transactions
-   [x] View a type of Transactions - GET /users/transactions?type= `deposit, withdrawl, transfer`

## Admin's Endpoint:

-   [x] Create User - POST /users
-   [x] Diable User - PATCH /users/:userId
-   [x] Delete User - DELETE /users/:userId
-   [ ] Reverse transactions(transfer) - POST /users/transactions
