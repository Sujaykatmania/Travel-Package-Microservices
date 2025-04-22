# 🚀 TravelPackageMicroservices

A microservices-based travel package booking platform with personalized recommendations and dynamic discounts. Built by Team 11 for the JackFruit Problem in Cloud Computing, this project showcases both Phase 1 and Phase 2, including integration with Team 6’s services.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Setup](#setup)
- [Usage](#usage)
- [Project Demo](#project-demo)
- [Integrations](#integrations)
- [Future Enhancements](#future-enhancements)
- [Conclusion](#conclusion)
- [Contributors](#contributors)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

This project is a comprehensive travel package booking platform built using a microservices architecture. It leverages modern frontend technologies and containerized deployment to provide a seamless and scalable user experience. The platform includes services for user management, package administration, discounts, recommendations, and more.

---

## 🧰 Technologies Used

- **Frontend**: React.js, TailwindCSS, React Router DOM
- **Backend**: Flask (Python)
- **Database**: MongoDB
- **Containerization**: Docker, Docker Compose
- **Reverse Proxy**: Nginx

---

## ✨ Features

- 🔐 User authentication and management
- 📦 Travel package browsing and management
- 💡 Personalized recommendations
- 💸 Dynamic discounts
- 🖥️ Admin dashboard
- 📱 Responsive frontend

---

## 🛠️ Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/TravelPackageMicroservices.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd TravelPackageMicroservices
   ```

3. **Build and start the services using Docker Compose**:
   ```bash
   docker-compose up --build
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Microservices:
     - Admin Service: http://localhost:5001
     - Discount Service: http://localhost:5003
     - Recommendation Service: http://localhost:5004
     - User Service: http://localhost:5005

---

## 📖 Usage

- Visit `http://localhost:3000` to access the frontend.
- Use the admin dashboard at `http://localhost:5001/admin` to manage packages.
- API documentation is available at `http://localhost:5005/api/docs` for the user service.

---

## 🎥 Project Demo

### Phase 1

![Home Page](path/to/homepage.png)
*Home Page showcasing travel packages*

![Package Details](path/to/packagedetails.png)
*Detailed view of a travel package*

![Admin Dashboard](path/to/admindashboard.png)
*Admin dashboard for managing packages*

### Phase 2 - Integrations

![Dynamic Pricing](path/to/dynamicpricing.png)
*Admin editing packages with dynamic pricing from Team 6*

![Push Notification](path/to/pushnotification.png)
*Push notification on user checkout from Team 6*

*Note: Replace `path/to/*.png` with the actual paths to your screenshots.*

---

## 🔗 Integrations

In Phase 2, we collaborated with Team 6 to integrate their services:

- **Dynamic Pricing**: The admin microservice calls Team 6’s pricing API to adjust package prices dynamically.
- **Push Notifications**: The user microservice triggers notifications via Team 6’s service upon actions like checkout.

---

## 🔮 Future Enhancements

- 🌍 Multi-language support
- 📱 Mobile app integration
- 📊 Analytics dashboard
- 🤖 AI-powered recommendations
- 💳 Booking & payment integration

---

## 📝 Conclusion

This project demonstrates a robust, scalable travel booking platform using a microservices architecture. From Phase 1’s foundational setup to Phase 2’s seamless integration with Team 6, each component was designed with separation of concerns, modularity, and extensibility in mind. The use of containerization, modern tech stacks, and inter-team collaboration ensures the system is production-ready and adaptable to future needs.

**Happy Traveling!** ✈️🌍

---

## 👥 Contributors

### Team 11:

- Sujay S.K (PES1UG22AM1169)
- Venkat S (PES1UG22AM1188)
- Vishwanath S (PES1UG22AM1194)
- Vismaya V.U (PES1UG22AM1195)

### Special Mentions (Integrated With) - Team 6:

- Rohan Rameshan Kallummal (PES1UG22AM134)
- Shyam VS (PES1UG22AM156)
- Sudhanva Chari (PES1UG22AM167)
- T S Shreyas (PES1UG22AM174)

---

## 🤝 Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) for more information.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.