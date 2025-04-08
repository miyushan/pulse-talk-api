# 🗨️ PulseTalk – Real-time Chat Application

**PulseTalk** is a modern real-time chat application built with **NestJS**, **GraphQL**, **Redis**, and **Prisma**. It enables users to create chat rooms and engage in instant conversations with real-time updates using WebSockets.

---

## 🚀 Features

- ⚡ **Real-time messaging** with WebSockets and GraphQL Subscriptions
- 💬 **Chat room** creation, and management
- 👥 **User authentication & authorization** (JWT-based)
- 📡 **Live user presence** and typing indicators via Redis pub/sub
- 📦 **Modular & scalable** architecture using NestJS
- 🧩 Built with **GraphQL**, **Prisma ORM**, and **Redis**

---

## 📦 Tech Stack

- **Backend Framework**: [NestJS](https://nestjs.com/)
- **API**: [GraphQL](https://graphql.org/) with [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Real-Time**: WebSockets (GraphQL Subscriptions)
- **Pub/Sub**: Redis
- **Authentication**: JWT
- **Database**: PostgreSQL

---

## 🛠️ Getting Started

### 📋 Prerequisites

- Node.js **v20+**
- TypeScript **v5+**
- PostgreSQL
- Redis
- Prisma **v6+**

### ⚙️ Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/miyushan/pulse-talk-api.git
   cd pulse-talk-api
   ```

2. **Install dependencies:**
   `npm install`

3. **Configure environment variables: (.env file content)**
   ```
     NODE_ENV="development" or "production"
     API_PORT=your_preferred_port
     CLIENT_HOST=your_client_url
     DATABASE_URL=your_postgresql_url_
     JWT_ACCESS_SECRET=your_jwt_access_secret
     JWT_REFRESH_SECRET=your_jwt_refresh_secret
     REDIS_HOST=redis_host
     REDIS_PORT=redis_port
     REDIS_PASSWORD=redis_password
   ```
4. **Generate Prisma client:**
   `npx prisma generate`

5. **Run migrations:**
   `npx prisma migrate dev --name init`

6. **For development (with auto-reload):**
   `npm run start:dev`

7. **For production:**

   ```
     npm run build
     npm run start
   ```

8. **GraphQL Endpoints:**
   ```
     http://localhost:3000/graphql
   ```

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- NestJS — Progressive Node.js Framework

- GraphQL — Flexible API Query Language

- Prisma — Type-safe ORM

- Redis — In-memory pub/sub powerhouse

- TypeScript — Strong typing for JS
