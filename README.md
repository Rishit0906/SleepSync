# 🌙 SleepSync - Sleep Tracking App

**One-Line Pitch:** Log your sleep, uncover patterns, and boost your rest with our intuitive tracking app!

## 📋 Overview

SleepSync empowers users to monitor sleep duration, quality, and factors like mood or caffeine intake. Using charts and insights, it helps develop better sleep habits for improved health and productivity.

## ✨ Features

- **📊 Dashboard**: View sleep statistics, trends, and recent logs
- **➕ Sleep Logging**: Easy-to-use form to track sleep details
- **💡 Insights**: Discover patterns and get personalized tips
- **📈 Charts**: Visual representation of sleep data using Chart.js
- **💾 Local Storage**: All data stored locally in your browser
- **📱 Responsive Design**: Works perfectly on mobile and desktop
- **♿ Accessible**: Built with WCAG guidelines in mind

## 🎨 Design System

### Color Palette
- **Primary**: `#4A5FD9` (Deep Blue) - Trust, tranquility
- **Secondary**: `#8B9FE8` (Soft Periwinkle) - Calm, soothing
- **Accent**: `#FFB86C` (Warm Orange) - Energy, awakening
- **Success**: `#6BCF7F` (Soft Green) - Good sleep quality
- **Background**: `#F8F9FE` (Light Blue-tinted)

### Typography
- Font Family: Inter (Google Fonts)
- Clean, modern, and highly readable

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension for VS Code (optional)

### Installation

1. Clone or download this repository
2. Open the project folder in VS Code
3. Right-click on `index.html` and select "Open with Live Server"
4. Or simply open `index.html` in your browser

### File Structure
```
SleepSync/
├── index.html          # Main HTML file
├── css/
│   └── styles.css     # All styles and design system
├── js/
│   └── app.js         # Application logic and interactivity
├── .vscode/
│   └── settings.json  # Live Server configuration
├── .gitignore         # Git ignore file
└── README.md          # This file
```

## 💻 Technical Features

### JavaScript Functionality
- **Chart.js Integration**: Beautiful, interactive charts
- **LocalStorage API**: Persistent data storage
- **Date/Time Calculations**: Accurate sleep duration tracking
- **Form Validation**: Real-time input validation
- **Responsive Navigation**: Smooth view switching
- **Toast Notifications**: User feedback for actions

### UX Design Principles
- **Mobile-First**: Optimized for small screens
- **Progressive Disclosure**: Information revealed gradually
- **Immediate Feedback**: Visual confirmations for all actions
- **Clear Visual Hierarchy**: Easy scanning and navigation
- **Accessibility**: ARIA labels, keyboard navigation, focus styles

## 📱 Usage

### Logging Sleep
1. Navigate to "Log Sleep" tab
2. Fill in your sleep details:
   - Date, bedtime, and wake time
   - Sleep quality (1-10 scale)
   - Mood upon waking
   - Factors affecting sleep
   - Optional notes
3. Click "Save Sleep Log"

### Viewing Dashboard
- See your average sleep duration and quality
- View current streak and total logs
- Interactive chart showing last 7 days
- Recent sleep logs with details

### Exploring Insights
- Best sleep day of the week
- Optimal bedtime for quality sleep
- Top factors correlating with good sleep
- Weekly trends and personalized tips

## 🛠️ Development

### Key Functions
- `calculateSleepDuration()`: Calculates hours slept
- `updateChart()`: Renders sleep data visualization
- `updateDashboard()`: Refreshes all dashboard statistics
- `handleFormSubmit()`: Processes new sleep logs

### Browser Console Commands
```javascript
// Clear all data
SleepSync.clearData()

// Export data as JSON
SleepSync.exportData()

// View current state
SleepSync.state
```

## 🎯 Future Enhancements

- [ ] Dark mode toggle
- [ ] Data import/export functionality
- [ ] Sleep goal setting
- [ ] Comparison with recommended sleep times
- [ ] Advanced analytics (monthly/yearly trends)
- [ ] PWA support for offline usage
- [ ] Social sharing of achievements
- [ ] Integration with sleep trackers

## 📄 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Created with ❤️ for better sleep tracking

---

**Track better, sleep better.** 🌙✨
