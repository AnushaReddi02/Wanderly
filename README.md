# 🌍 Wanderly – Travel & Stay Booking Platform

Wanderly is a full-stack web application inspired by platforms like Airbnb, designed to help users explore, list, and book unique travel stays around the world.

It provides a seamless experience for both travelers and property owners with features like authentication, listing management, reviews, and interactive UI.

---

## 🚀 Live Demo

🔗 **Live Site:** https://wanderly-16o5.onrender.com  

🔗 **GitHub Repository:** https://github.com/AnushaReddi02/Wanderly  

---

## ✨ Features

- 🏡 **Explore Listings** – Browse various travel stays with images and details  
- ➕ **Add New Listings** – Users can create and manage their own listings  
- ✏️ **Edit & Delete Listings** – Full CRUD functionality  
- 🔐 **Authentication & Authorization** – Secure login/signup system  
- ⭐ **Reviews & Ratings** – Users can leave feedback on listings  
- 📍 **Map Integration** – View property locations interactively  
- 🎨 **Responsive UI** – Clean and modern interface using Bootstrap  


---

## 🛠️ Tech Stack

### 🌐 Frontend
- HTML5  
- CSS3  
- Bootstrap  
- EJS (Embedded JavaScript Templates)  

### ⚙️ Backend
- Node.js  
- Express.js  

### 🗄️ Database
- MongoDB  
- Mongoose  

### 🔐 Authentication
- Passport.js  
- Express-session  

---

## 📂 Project Structure
```
📁 Wanderly
│
├── 📁 controllers/        # Route logic (MVC controllers)
├── 📁 init/               # Initial data / DB setup
├── 📁 models/             # Mongoose schemas (Listing, Review)
├── 📁 routes/             # Express routes
├── 📁 utils/              # Custom utilities (wrapAsync, errors)
├── 📁 views/              # EJS templates
├── 📁 public/             # Static files (CSS, JS)
│
├── 📄 app.js              # Main server file
├── 📄 cloudConfig.js      # Cloudinary configuration
├── 📄 middlewares.js      # Custom middleware
├── 📄 schema.js           # Joi validation schemas
│
├── 📄 package.json        # Dependencies
├── 📄 package-lock.json   # Dependency lock
├── 📄 .env                # Environment variables
├── 📄 .gitignore          # Ignored files
│
└── 📁 node_modules/       # Installed packages
```


---

## 🚀 Getting Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com/AnushaReddi02/Wanderly.git
cd Wanderly
```
2️⃣ Install dependencies
```
npm install
```
3️⃣ Setup environment variables
Create a .env file and add:

```
MONGO_URL=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
```
4️⃣ Run the app

```
node app.js
```
5️⃣ Open in browser

```
http://localhost:3000
```
🔐 Authentication Flow
Users can register & login
Only logged-in users can:
Add listings
Edit/delete their own listings
Post reviews

---

## 🖼️ Screenshots

### 📌 Listings Page
![Listings Page](https://github.com/AnushaReddi02/Wanderly/blob/main/listingsPage.png?raw=true)

### ➕ Add New Listing
![Add Listing](https://github.com/AnushaReddi02/Wanderly/blob/main/Screenshot%202026-04-26%20191310.png?raw=true)

---



📌 Future Enhancements
 💳 Payment Integration (Stripe/Razorpay) <br>
 ❤️ Wishlist / Favorites <br>
 🔍 Advanced Filters & Search <br>
 📱 Mobile responsiveness improvements <br>
 🧑‍💼 Admin dashboard <br>
 🤝 Contributing <br>

---

Contributions are always welcome!

Fork the repo
- Create a new branch (feature-name)
- Commit your changes
- Push to your branch
- Open a Pull Request
-📄 License

This project is licensed under the MIT License.

---

👩‍💻 Author

Anusha Reddi <br>
🔗 GitHub: https://github.com/AnushaReddi02

💡 Inspiration

Inspired by Airbnb-style booking platforms to practice full-stack development using MERN concepts.
