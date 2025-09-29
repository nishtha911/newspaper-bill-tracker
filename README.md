---

# PaperTrail: A Newspaper Bill Tracker

PaperTrail is a full-stack web application designed to help users track daily newspaper subscription expenses. Developed for personal use to help my mother manage her household bills, it provides a clean interface for logging and monitoring expenses monthly :)

<img width="1895" height="865" alt="image" src="https://github.com/user-attachments/assets/4e9ac6e3-571f-4b79-ba4a-adb9fa112b47" />
<img width="1901" height="862" alt="image" src="https://github.com/user-attachments/assets/cd435f91-1402-4162-860a-9cf455dd2cd2" />




---

## Features

* Monthly Calendar View: View expenses in a calendar format with easy navigation between months.
* Daily Expense Tracking: Input daily costs for two newspapers, *Aaj ka Anand* and *Times of India*.
* Real-time Totals: Instantly calculates daily and monthly totals as data is entered.
* Persistent Data Storage: Data is stored in PostgreSQL for reliability across sessions.
* Responsive Design: Accessible and user-friendly across devices (mobile, tablet, desktop).

---

## Technologies Used

This project is built using the PERN stack:

* PostgreSQL: Relational database to store all bill entries.
* Express.js: Backend framework for handling API requests.
* React: Frontend library for building the dynamic calendar interface.
* Node.js: Server-side runtime environment powering the backend.

---

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

* Node.js (v14 or higher) and npm
* PostgreSQL installed and running

### Backend Setup

1. Navigate to the `server` directory.
2. Install dependencies:

   ```bash
   npm install
   ```
3. Configure your PostgreSQL connection string in a `.env` file.
4. Start the server:

   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the `client` directory.
2. Install dependencies:

   ```bash
   npm install
   ```
3. Start the React application:

   ```bash
   npm run dev
   ```
4. Open your browser and go to: [http://localhost:3000](http://localhost:3000)

---

## Contributing

Contributions are welcome. If you find a bug or have an idea for a new feature, please open an issue or submit a pull request. Thank you!!!

---
