# SciPlot - Scientific Data Visualization

A modern, interactive web application for scientific data visualization and analysis. Built with React, TypeScript, and Recharts.

![SciPlot Preview](https://img.shields.io/badge/status-production-success)

## Features

- 📊 **Interactive Plotting**: Upload CSV or TXT files with X-Y data points
- 🎨 **Customizable Charts**: Adjust titles, axis labels, and ranges
- 🔍 **Zoom & Pan**: Interactive chart navigation with mouse controls
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎯 **Real-time Statistics**: View data count, ranges, mean, and standard deviation
- ⬇️ **Export Ready**: Download your visualizations

## Live Demo

🌐 [View Live App](https://textoimg-n5gbx5s10-sunnylabh111-9130s-projects.vercel.app)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sunnylabh/sci_plot.git
cd sci_plot
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Usage

1. **Upload Data**: Click "Choose File" and select a CSV or TXT file
   - Format: Two columns (X Y) separated by comma, space, or tab
   - Example:
     ```
     0.5, 10.2
     1.0, 15.3
     1.5, 12.7
     ```

2. **Plot Data**: Click "PLOT DATA" to visualize your dataset

3. **Customize**: 
   - Update chart title and axis labels
   - Set custom axis ranges
   - Use mouse to zoom (click and drag) or reset view

## Build for Production

```bash
npm run build
```

The optimized files will be in the `dist/` directory.

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Recharts** - Charting library
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Project Structure

```
sciplot-project/
├── components/
│   ├── Chart.tsx        # Main chart component
│   └── Sidebar.tsx      # Control panel
├── services/
│   └── geminiService.ts # AI analysis service
├── utils/
│   ├── dataUtils.ts     # Data parsing and statistics
│   ├── downloadUtils.ts # Export functionality
│   └── projectFiles.ts  # Project metadata
├── App.tsx              # Main application
├── types.ts             # TypeScript definitions
└── index.tsx            # Entry point
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Author

Built with ❤️ for the scientific community
