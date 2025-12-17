# MERN Task

This is a **MERN stack application** with separate **frontend** and **backend** folders. The app has **User**, **Admin**, and **Staff** roles with different access permissions.

---

## Prerequisites

* [Node.js](https://nodejs.org/) installed
* npm installed (usually comes with Node.js)

---

## Installation

### 1. Install npm globally (if not already)

```bash
npm install -g npm
```

### 2. Install project dependencies

#### Frontend

```bash
cd frontend
npm install
```

#### Backend

```bash
cd backend
npm install
```

---

## Environment Configuration

### Frontend

1. Inside the `frontend` folder, create a `.env` file **outside the `src` folder**.
2. Add the following:

```env
REACT_APP_API_URL=http://localhost:5001/api
```

> Replace `localhost` with your IP if you are testing on multiple devices.



## Running the Application



```bash

npm run dev
```



---

## Application Usage

### User Access

* Click **Bite Boxx** on homepage to access **User View**
* Users can access the **Cart** and perform shopping actions

### Admin Access

* Click **Admin** on the homepage
* Credentials:

  * Username: `admin`
  * Password: `admin@123`
* Admins **cannot access cart**
* Admins **can create product**
* Admins **can update order status**

### Staff Access

* Click **Admin** on the homepage
* Credentials:

  * Username: `staff`
  * Password: `staff@123`
* Staff **cannot access cart**
* Staff **cannot Create Product**
* Staff **can update order status**
---
