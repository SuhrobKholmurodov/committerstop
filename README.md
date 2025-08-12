# Most Active GitHub Users in Tajikistan

A responsive web application that displays the most active GitHub users in Tajikistan, ranked by **commits**, **contributions**, or overall activity.

## 🚀 Features
- 📊 View rankings of top active GitHub users
- 🔄 Switch between **Commits**, **Contributions**, and **All** tabs
- 🔍 Search users by username
- 🖼 View user details and avatars
- ⚡ Data updates dynamically with loading indicators
- 🌙 Toggle dark/light mode
- 🔔 Toast notifications for user interactions

## 🛠 Tech Stack
- ⚛ **React & Vite** + **TypeScript**
- 📦 **Redux Toolkit Query** for data fetching & state management
- 🌐 **React Router DOM** for routing
- 🎨 **Tailwind CSS** for styling
- 🧩 **shadcn/ui** components
- ⏱ **Lodash** for debounced search
- 🌙 **react-toggle-dark-mode** for theme switching
- 🔔 **react-fox-toast** for toast notifications

## 📡 Data Fetching
- **Committers Data**  
  Scraped live from [committers.top](https://committers.top) using **Redux Toolkit Query**.  
  Fetches HTML via `https://api.allorigins.win/raw?url=...` to bypass CORS and parses it to extract rankings.

- **GitHub User Details**  
  Pulled directly from the **GitHub REST API**.  
  Uses an optional `VITE_GITHUB_TOKEN` to increase API rate limits.

## 📥 Installation & Setup
### 1️⃣ Clone the repository

```sh
git clone https://github.com/SuhrobKholmurodov/committerstop-tj.git
cd committerstop-tj
```

### 2️⃣ Install dependencies

```sh
pnpm install
```

### 3️⃣ Run the development server

```sh
pnpm dev
```

## 🤝 Contributing
### If you have any ideas, suggestions, or improvements, feel free to contribute by opening issues or submitting pull requests. Your help is always welcome!