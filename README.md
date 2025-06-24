# NextJS Apps Collection 🚀

A curated collection of Next.js applications showcasing various features, patterns, and best practices for modern web development.

## 📋 Table of Contents

- [Overview](#overview)
- [Projects](#projects)
- [Getting Started](#getting-started)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Development Guidelines](#development-guidelines)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

This repository serves as a comprehensive collection of Next.js applications, each demonstrating different aspects of modern web development including:

- State management with Redux Toolkit
- TypeScript integration
- Testing with Jest and React Testing Library
- UI/UX design patterns
- API development
- Performance optimization
- Responsive design

## 📁 Projects

### 01 - Address Manage App
A comprehensive address book application built with Next.js and Redux Toolkit.

**Features:**
- 📇 Address management (Add, Edit, Delete)
- 🔍 Address lookup functionality
- 📱 Responsive design
- 🧪 Comprehensive testing suite
- 🎨 Modern UI components
- 💾 Local data persistence

**Tech Stack:**
- Next.js
- React 18
- TypeScript
- Redux Toolkit
- Jest + React Testing Library
- CSS Modules

**Quick Start:**
```bash
cd "01 - Address Manage App"
npm install
npm run dev
```

## 🚀 Getting Started

### Prerequisites

- Node.js (>= 16.0.0)
- npm (>= 8.0.0)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Allen5288/NextJS-Apps-Collection.git
cd NextJS-Apps-Collection
```

2. Navigate to any project directory:
```bash
cd "01 - Address Manage App"
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠 Tech Stack

### Core Technologies
- **Framework:** Next.js
- **Language:** TypeScript
- **UI Library:** React 18
- **State Management:** Redux Toolkit
- **Styling:** CSS Modules
- **Testing:** Jest + React Testing Library

### Development Tools
- **Package Manager:** npm
- **Version Control:** Git
- **Code Quality:** ESLint, Prettier (planned)
- **CI/CD:** GitHub Actions (planned)

## 📂 Project Structure

```
NextJS-Apps-Collection/
├── 01 - Address Manage App/
│   ├── pages/                 # Next.js pages
│   ├── src/
│   │   ├── core/             # Business logic
│   │   │   ├── models/       # Data models
│   │   │   ├── reducers/     # Redux slices
│   │   │   ├── services/     # API services
│   │   │   └── store/        # Redux store
│   │   ├── types/            # TypeScript types
│   │   ├── ui/               # UI components
│   │   │   ├── components/   # Reusable components
│   │   │   └── hooks/        # Custom React hooks
│   │   └── utils/            # Utility functions
│   ├── styles/               # Global styles
│   └── __tests__/            # Test files
└── [Future Projects]/        # Additional Next.js applications
```

## 📋 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow component-based architecture
- Implement proper error handling
- Write comprehensive tests
- Use semantic HTML and accessible design

### Testing
- Unit tests for components and utilities
- Integration tests for complex features
- API endpoint testing
- Maintain high test coverage

### Performance
- Optimize bundle size
- Implement code splitting
- Use Next.js built-in optimizations
- Monitor Core Web Vitals

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add some amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Adding New Projects

When adding a new Next.js application:

1. Create a new directory with a descriptive name
2. Follow the established project structure
3. Include comprehensive documentation
4. Add tests for your features
5. Update this main README with project details

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- React community for continuous innovation
- All contributors who help improve this collection

---

⭐ **Star this repository if you find it helpful!**

📧 **Questions?** Feel free to open an issue or contact the maintainers.
