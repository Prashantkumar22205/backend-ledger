Backend Ledger
A backend service for managing users, accounts, balances, and financial transactions using a double-entry ledger architecture. The project is built with Node.js, Express.js, and MongoDB/Mongoose and focuses on transaction integrity, idempotency, authentication, immutable ledger records, and transaction notifications.
🚀 Features
- User registration and login
- JWT-based authentication
- HTTP-only cookie-based session token support
- Token blacklist for logout/invalidation
- Account creation and account listing
- Real-time account balance calculation from ledger entries
- Credit and debit ledger entries
- Double-entry transaction flow
- Transaction idempotency using an idempotency key
- MongoDB transactions for atomic financial operations
- Account status validation (ACTIVE, FROZEN, CLOSED)
- Immutable ledger entries
- System-user support for initial account funding
- Email notifications for registration and successful transactions
- Automatic expiration of blacklisted tokens using MongoDB TTL
🛠️ Tech Stack
Technology	Purpose
Node.js	JavaScript runtime
Express.js	REST API framework
MongoDB	Database
Mongoose	MongoDB ODM
JWT	Authentication
bcryptjs	Password hashing
cookie-parser	Cookie handling
Nodemailer	Email notifications
dotenv	Environment variable management
Nodemon	Development server

backend-ledger/
├── server.js
├── package.json
├── .gitignore
└── src/
    ├── app.js
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── account.controller.js
    │   ├── auth.controller.js
    │   └── transaction.controller.js
    ├── middleware/
    │   └── auth.middleware.js
    ├── models/
    │   ├── account.model.js
    │   ├── auth.model.js
    │   ├── blackList.model.js
    │   ├── ledger.model.js
    │   └── transaction.model.js
    ├── routes/
    │   ├── account.route.js
    │   ├── auth.route.js
    │   └── transaction.route.js
    └── services/
        └── email.service.js
        
🧩 Architecture
The application follows a simple layered backend architecture:
Client
  │
  ▼
Express Routes
  │
  ▼
Authentication Middleware
  │
  ▼
Controllers
  │
  ├── User / Authentication
  ├── Account
  └── Transaction
  │
  ▼
Mongoose Models
  │
  ├── User
  ├── Account
  ├── Transaction
  ├── Ledger
  └── Token Blacklist
  │
  ▼
MongoDB
Email notifications are handled separately through the email service using Nodemailer.
💰 Ledger & Balance Model
The account balance is not stored as a mutable balance field.
Instead, the balance is derived from ledger entries:
Balance = Total Credits - Total Debits
For example:
Account A
-------------------------
CREDIT   ₹10,000
DEBIT     ₹2,500
CREDIT    ₹1,000
-------------------------
Balance  ₹8,500
This approach provides a transaction history that can be used to reconstruct the account balance.
Ledger Entry Types
- CREDIT — money added to an account
- DEBIT — money removed from an account
Ledger records are designed to be immutable. Update and delete operations are explicitly blocked at the Mongoose model level.
🔄 Transaction Flow
A normal transfer follows this sequence:
1. Validate request
        ↓
2. Validate idempotency key
        ↓
3. Check source and destination accounts
        ↓
4. Verify both accounts are ACTIVE
        ↓
5. Calculate sender balance from ledger
        ↓
6. Check sufficient funds
        ↓
7. Start MongoDB transaction
        ↓
8. Create transaction as PENDING
        ↓
9. Create DEBIT ledger entry
        ↓
10. Create CREDIT ledger entry
        ↓
11. Mark transaction COMPLETED
        ↓
12. Commit MongoDB transaction
        ↓
13. Send transaction email
MongoDB sessions are used so the transaction and its ledger entries are committed atomically.
🔑 Idempotency
Every transaction requires an idempotencyKey.
This prevents accidental duplicate processing when the same request is submitted multiple times.
Example:
{
  "fromAccount": "SOURCE_ACCOUNT_ID",
  "toAccount": "DESTINATION_ACCOUNT_ID",
  "amount": 1000,
  "idempotencyKey": "transfer-2026-001"
}
The idempotencyKey is unique in the transaction collection.
If the same key is submitted again, the API checks the existing transaction status instead of creating another transaction.
Possible transaction states:
PENDING
FAILED
COMPLETED
REVERSED
🔐 Authentication
Authentication uses JWT.
A successful registration or login generates a token containing the authenticated user's ID.
User
  │
  ▼
Login / Register
  │
  ▼
JWT generated
  │
  ▼
Cookie / Authorization header
  │
  ▼
Authentication Middleware
  │
  ▼
Authenticated Request
The authentication middleware:
1. Reads the token from the cookie or Authorization header.
2. Checks whether the token is blacklisted.
3. Verifies the JWT.
4. Loads the associated user.
5. Attaches the user to req.user.
Logout
During logout, the token is added to a blacklist and the authentication cookie is cleared.
Blacklisted tokens are automatically removed by MongoDB's TTL mechanism after the configured expiration period.
👤 Account Management
Each account belongs to a user.
Account statuses:
ACTIVE
FROZEN
CLOSED
Only active accounts can participate in normal transactions.
The current account model supports INR by default:
currency: INR
🏦 Initial Funds
The project also supports an initial-funds transaction from a designated system user.
System Account
      │
      │ CREDIT
      ▼
User Account
This route is protected by system-user authentication middleware.
📧 Email Notifications
Nodemailer is used to send:
- Registration/welcome emails
- Successful transaction emails
- Transaction failure email support
Email authentication uses Gmail OAuth2 credentials supplied through environment variables.
📡 API Endpoints
Base URL:
http://localhost:3000
Authentication
Method	Endpoint	Description	Auth
POST	/api/auth/register	Register a new user	No
POST	/api/auth/login	Login	No
POST	/api/auth/logout	Logout	No


Accounts
Method	Endpoint	Description	Auth
POST	/api/accounts/	Create an account	Required
GET	/api/accounts/	Get user's accounts	Required
GET	/api/accounts/balance/:accountId	Get account balance	Required


Transactions
Method	Endpoint	Description	Auth
POST	/api/transaction/	Transfer funds between accounts	Required
POST	/api/transaction/system/initial-funds	Add initial funds to an account	System user


📝 Example Requests
Register
POST /api/auth/register
Content-Type: application/json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
Login
POST /api/auth/login
Content-Type: application/json
{
  "email": "john@example.com",
  "password": "password123"
}
Create Account
POST /api/accounts/
Authorization: Bearer <TOKEN>
Get Balance
GET /api/accounts/balance/<ACCOUNT_ID>
Authorization: Bearer <TOKEN>
Transfer Funds
POST /api/transaction/
Authorization: Bearer <TOKEN>
Content-Type: application/json
{
  "fromAccount": "<SOURCE_ACCOUNT_ID>",
  "toAccount": "<DESTINATION_ACCOUNT_ID>",
  "amount": 500,
  "idempotencyKey": "unique-transfer-001"
}
⚙️ Environment Variables
Create a .env file in the project root:
MongoDB_Key=your_mongodb_connection_string
JWT_SecretKey=your_jwt_secret

EMAIL_USER=your_email
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
REFRESH_TOKEN=your_google_oauth_refresh_token
Never commit .env or real credentials to GitHub.

▶️ Installation & Setup
1. Clone the repository
git clone <your-repository-url>
cd backend-ledger
2. Install dependencies
npm install
3. Configure environment variables
Create .env and add the required MongoDB, JWT, and email credentials.
4. Start the server
node server.js
For development, you can use Nodemon:
npx nodemon server.js
The server runs on:
http://localhost:3000
🗄️ Database Models
User
Stores:
- Name
- Email
- Hashed password
- System-user flag
- Timestamps
Account
Stores:
- User reference
- Account status
- Currency
- Timestamps
Transaction
Stores:
- Source account
- Destination account
- Amount
- Transaction status
- Unique idempotency key
- Timestamps
Ledger
Stores:
- Account reference
- Amount
- Transaction reference
- Entry type (CREDIT / DEBIT)
Ledger fields are immutable to protect transaction history.
Token Blacklist
Stores invalidated JWTs after logout and uses a TTL index for automatic cleanup.
🔒 Important Design Principles
1. Double-Entry Ledger
Every transfer creates two ledger entries:
Sender Account     → DEBIT
Receiver Account   → CREDIT
This keeps the movement of funds traceable.
2. Atomic Transactions
Transaction and ledger operations are executed using a MongoDB session so that a transfer can be committed as a single database operation.
3. Immutable Financial History
Ledger records cannot be updated or deleted through the Mongoose model.
4. Idempotent Transfers
A unique idempotency key protects against duplicate transfer requests.
5. Derived Balance
Account balance is calculated from ledger history instead of being manually updated.
🧪 Testing
The project does not currently include an automated test suite.
API endpoints can be tested using tools such as:
- Postman
- Thunder Client
- Insomnia
- cURL
Recommended testing flow:
Register
   ↓
Login
   ↓
Create Account
   ↓
Create / Assign Initial Funds
   ↓
Check Balance
   ↓
Create Another Account
   ↓
Transfer Funds
   ↓
Check Both Balances
🚧 Current Limitations / Future Improvements
Potential improvements for a production-ready version include:
- Add automated unit and integration tests
- Add request validation using a dedicated validation library
- Add centralized error-handling middleware
- Add rate limiting
- Add API documentation with Swagger/OpenAPI
- Add transaction history endpoints
- Add pagination for accounts and transactions
- Add stronger authorization and ownership checks for every transaction operation
- Improve transaction failure/reversal handling
- Add structured logging and monitoring
- Add Docker support
- Add production deployment configuration
- Add proper secure cookie configuration for production
- Add database indexes and query optimization as the dataset grows
🎯 Project Objective
The primary objective of Backend Ledger is to demonstrate how a backend financial system can manage accounts and money movement using a ledger-based architecture rather than relying on a mutable account balance.
The project emphasizes:
Authentication
      +
Account Management
      +
Double-Entry Ledger
      +
Idempotent Transactions
      +
Atomic Database Operations
      +
Immutable Financial Records
👨‍💻 Author
Prashant Kumar
Built as a backend engineering project to explore financial transaction systems, REST APIs, MongoDB transactions, authentication, and ledger-based accounting.
⭐ If you find this project useful, consider giving the repository a star.
