# Dual-Model AI Chat Application

A modern chat application that leverages multiple AI models to provide both thinking and coding assistance. Built with React, Node.js, and Express.

## 🌟 Features

- 💬 Real-time chat interface with AI models
- 🔄 Switch between different AI models
- 💻 Code syntax highlighting
- 📋 Copy code snippets with one click
- 🌓 Dark/Light mode support
- 📱 Responsive design
- ⚡ Fast and efficient
- 🔒 Secure API handling

## 🛠️ Tech Stack

### Frontend
- React.js
- TailwindCSS
- React Markdown
- Syntax Highlighter
- Context API for state management

### Backend
- Node.js
- Express
- JWT Authentication
- REST API

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- API keys for your AI providers

### Installation

1. Clone the repository
```bash
git clone https://github.com/saadkhan2003/Dual-Model-Ai.git
cd Dual-Model-Ai
```

2. Install dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Environment Setup
```bash
# In the client directory, create .env file
REACT_APP_API_URL=your_api_url

# In the server directory, create .env file
PORT=5000
JWT_SECRET=your_jwt_secret
```

4. Start the application
```bash
# Start server (from server directory)
npm start

# Start client (from client directory)
npm start
```

## 📦 Project Structure

```
dual-model-ai/
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── services/
│       └── styles/
└── server/
    ├── routes/
    ├── middleware/
    └── services/
```

## 🔧 Configuration

The application can be configured through environment variables:

### Client
- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_ENV`: Environment (development/production)

### Server
- `PORT`: Server port
- `JWT_SECRET`: Secret for JWT tokens
- `ALLOWED_ORIGINS`: CORS allowed origins

## 💡 Usage

1. Configure your AI providers in the settings
2. Start a new chat session
3. Toggle between thinking and coding modes
4. Use markdown in your messages
5. Copy code snippets with the copy button
6. Regenerate responses when needed

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Saad Khan

## 🙏 Acknowledgments

- Thanks to all the open-source libraries used in this project
- AI provider partners
- Community contributors