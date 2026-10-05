# 💰 Backend Ledger

Backend Ledger is a **RESTful financial transaction management API** built with **Node.js, Express.js, MongoDB, and Mongoose**.

The application provides APIs for managing users, accounts, balances, and financial transactions. It focuses on maintaining **consistent account balances, secure authentication, transaction integrity, idempotency, and authorization**.

---

## ✨ Features

### 👤 User Authentication

- User registration and login
- JWT-based authentication
- Authentication using HTTP-only cookies
- Protected API routes
- Logout functionality
- Token blacklist support
- Password hashing
- Authentication middleware

### 🏦 Account Management

- Create and manage financial accounts
- Retrieve account details
- Check account balance
- Associate accounts with users
- Maintain account ownership
- Support multiple accounts

### 💸 Transaction Management

- Create financial transactions
- Credit and debit operations
- Transfer funds between accounts
- Maintain transaction records
- Update account balances atomically
- Prevent invalid transactions
- Transaction history

### 🔄 Transaction Integrity

The application uses **MongoDB transactions** to ensure that financial operations are completed atomically.

For example, during a transfer:

```text
Sender Account
      │
      │ Debit
      ▼
MongoDB Transaction
      │
      │ Credit
      ▼
Receiver Account
```

If any operation fails, the complete transaction can be rolled back to prevent inconsistent balances.

### 🔁 Idempotency

The API supports **idempotency** for transaction requests.

This prevents duplicate transactions when the same request is accidentally submitted multiple times.

```text
Request
   │
   ▼
Idempotency Key
   │
   ├── Already Processed ──► Return Existing Result
   │
   └── New Request ────────► Process Transaction
```

This is especially important for financial systems where duplicate payments or transfers can cause serious issues.

### 📧 Email Notifications

The application supports email notifications using **Nodemailer**.

Emails can be sent for relevant account or transaction events.

---

## 🛠️ Tech Stack

### Backend

- Node.js
- Express.js
- JavaScript

### Database

- MongoDB
- Mongoose

### Authentication & Security

- JWT
- HTTP-only Cookies
- Password Hashing
- Authentication Middleware
- Token Blacklisting

### Communication

- Nodemailer

### Development Tools

- Postman
- npm
- Git & GitHub

---

## 🏗️ Architecture

The Backend Ledger follows a layered backend architecture.

```text
                         ┌───────────────────┐
                         │      Client       │
                         │  Postman / Frontend│
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │   Express Server  │
                         │      Routes       │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │    Middleware     │
                         │ Authentication    │
                         │ Authorization     │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │    Controllers    │
                         │  Business Logic   │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │ Mongoose Models   │
                         │ User / Account /  │
                         │ Transaction       │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │     MongoDB       │
                         │     Database      │
                         └───────────────────┘
```

---

## 📁 Project Structure

```text
Backend-Ledger/
│
├── controllers/
│   ├── auth.controller.js
│   ├── account.controller.js
│   └── transaction.controller.js
│
├── models/
│   ├── user.model.js
│   ├── account.model.js
│   └── transaction.model.js
│
├── routes/
│   ├── auth.routes.js
│   ├── account.routes.js
│   └── transaction.routes.js
│
├── middleware/
│   ├── auth.middleware.js
│   └── ...
│
├── utils/
│   ├── ...
│   └── ...
│
├── config/
│   └── ...
│
├── app.js
├── server.js
├── package.json
├── package-lock.json
├── .env
└── README.md
```

> The exact folder names may vary depending on the current version of the project.

---

## 🗃️ Database Models

### 👤 User

The User model stores authentication and user-related information.

```text
User
│
├── Name
├── Email
├── Password
└── Accounts
```

A user can own one or more accounts.

---

### 🏦 Account

The Account model represents a financial account.

```text
Account
│
├── User
├── Balance
├── Account Details
└── Transaction References
```

The account balance is maintained based on financial transactions.

---

### 💸 Transaction

The Transaction model records financial operations.

```text
Transaction
│
├── Sender Account
├── Receiver Account
├── Amount
├── Transaction Type
├── Status
├── Idempotency Key
└── Timestamp
```

Transactions provide a persistent record of account activity.

---

## 🔗 Database Relationships

```text
                 ┌──────────────┐
                 │     User     │
                 └──────┬───────┘
                        │
                     owns
                        │
                        ▼
                 ┌──────────────┐
                 │    Account   │
                 └──────┬───────┘
                        │
                    performs
                        │
                        ▼
                 ┌──────────────┐
                 │ Transaction  │
                 └──────────────┘
```

---

## 🔐 Authentication Flow

The application uses JWT-based authentication.

```text
User
 │
 ▼
Login
 │
 ▼
Credentials Verified
 │
 ▼
JWT Generated
 │
 ▼
HTTP-only Cookie
 │
 ▼
Authenticated Request
 │
 ▼
Authentication Middleware
 │
 ▼
Protected Controller
```

Using HTTP-only cookies helps prevent client-side JavaScript from directly accessing the authentication token.

---

## 🔒 Authorization

Authentication and authorization are handled separately.

### Authentication

Determines whether the user is logged in.

```text
Is the user authenticated?
        │
     ┌──┴──┐
    YES    NO
     │      │
     ▼      ▼
 Continue  Reject
```

### Authorization

Determines whether the authenticated user has permission to access a particular account or transaction.

```text
Authenticated User
        │
        ▼
Check Resource Ownership
        │
   ┌────┴────┐
  Owner    Not Owner
    │          │
    ▼          ▼
 Allow       Reject
```

---

## 💳 Financial Transaction Flow

A typical account transfer follows this process:

```text
Client Request
      │
      ▼
Authentication
      │
      ▼
Validate Request
      │
      ▼
Check Idempotency
      │
      ▼
Verify Sender Account
      │
      ▼
Check Available Balance
      │
      ▼
Start MongoDB Transaction
      │
      ├───────────────┐
      ▼               ▼
 Debit Sender    Credit Receiver
      │               │
      └───────┬───────┘
              ▼
       Save Transaction
              │
              ▼
       Commit Transaction
              │
              ▼
        Return Response
```

---

## 🔄 MongoDB Transactions

Financial operations require consistency between multiple database documents.

For example, transferring ₹1,000:

```text
Sender Balance
₹10,000
   │
   │ - ₹1,000
   ▼
₹9,000


Receiver Balance
₹5,000
   │
   │ + ₹1,000
   ▼
₹6,000
```

Both operations should succeed together.

If the credit operation fails after the sender has been debited, the MongoDB transaction can roll back the operation.

This prevents situations such as:

```text
Sender:   ₹9,000
Receiver: ₹5,000
```

when the intended result was:

```text
Sender:   ₹9,000
Receiver: ₹6,000
```

---

## 🔁 Idempotency

Idempotency is particularly important in payment and financial APIs.

Suppose a client sends the same request twice because of a network retry.

```text
Request #1
   │
   ▼
Transaction Created
   │
   ▼
Idempotency Key Stored


Request #2
   │
   ▼
Same Idempotency Key
   │
   ▼
Existing Transaction Found
   │
   ▼
Do NOT Create Duplicate Transaction
```

This helps prevent accidental duplicate payments.

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login user |
| POST | `/auth/logout` | Logout user |
| GET | `/auth/me` | Get authenticated user |

### Accounts

| Method | Endpoint | Description |
|---|---|---|
| POST | `/accounts` | Create an account |
| GET | `/accounts` | Get user accounts |
| GET | `/accounts/:id` | Get account details |
| GET | `/accounts/:id/balance` | Get account balance |

### Transactions

| Method | Endpoint | Description |
|---|---|---|
| POST | `/transactions` | Create transaction |
| GET | `/transactions` | Get transaction history |
| GET | `/transactions/:id` | Get transaction details |

> Endpoint names may vary depending on the current implementation of the project.

---

## ⚙️ Environment Variables

Create a `.env` file in the project root.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password
```

Do not commit `.env` or any credentials to GitHub.

Add the following to `.gitignore`:

```text
node_modules/
.env
```

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/backend-ledger.git
```

### 2. Navigate to the Project

```bash
cd backend-ledger
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file and add the required configuration.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 5. Start the Server

For development:

```bash
npm run dev
```

Or start the application directly:

```bash
node app.js
```

The API will be available at:

```text
http://localhost:5000
```

---

## 🧪 API Testing

The API can be tested using **Postman**.

Typical testing flow:

```text
1. Register User
       ↓
2. Login
       ↓
3. Create Account
       ↓
4. Check Balance
       ↓
5. Create Transaction
       ↓
6. Verify Balance
       ↓
7. Check Transaction History
```

---

## 🛡️ Security Features

The application implements several security practices:

- JWT authentication
- HTTP-only authentication cookies
- Password hashing
- Authentication middleware
- Authorization checks
- Token blacklisting
- Input validation
- Protected financial operations
- MongoDB transactions
- Idempotency for transaction requests
- Environment variables for secrets

---

## 📊 Core Business Rules

The ledger follows important financial rules.

### Balance Cannot Become Negative

Before processing a debit:

```text
Available Balance >= Transaction Amount
```

If this condition is false, the transaction should be rejected.

### Atomic Transactions

A transfer involving multiple accounts should either:

```text
Complete Successfully
        OR
Rollback Completely
```

### Duplicate Prevention

The same idempotency key should not result in multiple financial transactions.

### Account Ownership

Users should only be able to access and operate on accounts they are authorized to use.

---

## 📧 Email Notification Flow

The project uses Nodemailer for sending email notifications.

```text
Transaction
    │
    ▼
Transaction Successfully Processed
    │
    ▼
Notification Service
    │
    ▼
Nodemailer
    │
    ▼
User Email
```

---

## 🧠 Key Learning Outcomes

This project provided practical experience with:

- REST API development
- Node.js backend development
- Express.js
- MongoDB and Mongoose
- JWT authentication
- HTTP-only cookies
- Authorization middleware
- Database transactions
- Financial transaction design
- Idempotency
- Error handling
- API validation
- Email notifications
- Postman API testing
- Secure backend architecture

---

## 🔮 Future Improvements

Possible improvements include:

- Role-based access control
- Pagination for transaction history
- Advanced transaction filtering
- Rate limiting
- Request logging
- Redis-based token/session management
- Two-factor authentication
- Audit logs
- Admin dashboard
- Scheduled transaction support
- Improved notification system
- Automated unit and integration tests
- Docker support
- CI/CD pipeline
- API documentation using Swagger/OpenAPI

---

## 📌 Project Status

**Status:** Completed / Portfolio Project

Backend Ledger demonstrates the design of a secure financial backend with authentication, account management, transaction processing, database consistency, and duplicate transaction prevention.

---

## 👨‍💻 Author

**Prashant Kumar**

B.Tech Computer Science & Engineering

---

## ⭐ Support

If you found this project useful, consider giving the repository a ⭐ on GitHub.
