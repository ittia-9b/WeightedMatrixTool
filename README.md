# Weighted Matrix Tool

A powerful web-based decision-making tool that helps you evaluate options against multiple criteria using weighted scores.

## Features

- Create decision matrices with customizable criteria and options
- Assign weights to different criteria to reflect their importance
- Visualize scores with a dynamic heatmap
- Export results to Markdown or CSV formats
- Responsive design that works on desktop and mobile devices
- Dark mode support
- No server required - runs entirely in the browser

## Live Demo

Check out the live demo: [Weighted Matrix Tool](https://yourusername.github.io/weighted-matrix-tool/)

## How to Use

1. **Add Criteria and Options**: Use the "Add Row" button to add criteria (rows) and "Add Column" to add options (columns).
2. **Customize Labels**: Click on any label to edit it.
3. **Assign Weights**: Each criterion (row) has a weight value. Click to increase or right-click to decrease.
4. **Score Options**: For each cell, click to increase the score or right-click to decrease.
5. **Adjust Visualization**: Use the "Dynamic Scale" toggle to adjust the heatmap coloring and the slider to control color intensity.
6. **Export Results**: Convert your matrix to Markdown format and copy it to the clipboard.

## Getting Started

### Local Development

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/weighted-matrix-tool.git
   cd weighted-matrix-tool
   ```

2. Open the project in your favorite code editor.

3. Launch a local server. You can use any of these methods:
   - Using Python: `python -m http.server`
   - Using Node.js: `npx serve`
   - Using VS Code's Live Server extension

4. Open your browser and navigate to the local server address (typically http://localhost:8000 or http://localhost:5000).

### Deployment

The project is ready to be deployed to GitHub Pages:

1. Push your code to a GitHub repository.
2. Go to the repository settings.
3. Scroll down to the GitHub Pages section.
4. Select the branch you want to deploy (usually `main` or `master`).
5. Click Save.

Your app will be available at `https://yourusername.github.io/repository-name/`.

## Project Structure

```
weighted-matrix-tool/
├── index.html              # Main HTML file
├── src/
│   ├── js/
│   │   ├── index.js        # Main JavaScript entry point
│   │   ├── components/     # UI components
│   │   │   ├── Matrix.js   # Matrix component
│   │   │   ├── Export.js   # Export functionality
│   │   │   └── Toast.js    # Toast notifications
│   │   └── utils/
│   │       └── helpers.js  # Utility functions
│   └── styles/
│       ├── main.css        # Main stylesheet
│       └── components/     # Component-specific styles
│           ├── matrix.css
│           ├── export.css
│           ├── toast.css
│           └── heatmap.css
└── README.md               # This file
```

## Browser Compatibility

The Weighted Matrix Tool works in all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by decision matrix techniques used in product management and engineering
- Built with vanilla JavaScript and CSS for maximum performance and compatibility 