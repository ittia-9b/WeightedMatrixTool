# Weighted Matrix Tool

A modern, interactive web-based tool for creating and analyzing weighted decision matrices. Perfect for decision making, prioritization, and impact analysis.

![Weighted Matrix Tool Demo](docs/images/demo.png)

## Features

- 📊 Interactive weighted matrix creation and editing
- 🎨 Real-time heatmap visualization
- 🌗 Modern dark theme design
- 📱 Fully responsive layout
- ↔️ Dynamic row and column management
- 🔄 Dynamic or fixed scale modes
- 📋 Export to Markdown format
- 🎯 Weighted impact scoring

## Demo

![Feature Demo GIF](docs/images/feature-demo.gif)

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/weighted-matrix-tool.git
```

2. Open `index.html` in your browser or serve it using a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

3. Visit `http://localhost:8000` in your browser

## Usage

1. **Matrix Setup**
   - Use the "Add Row" and "Add Column" buttons to adjust matrix size
   - Click on headers to edit labels
   - Set weights (1-10) for each row using +/- controls

2. **Value Input**
   - Enter values (-10 to +10) in matrix cells
   - Values are automatically weighted and visualized
   - Heatmap updates in real-time

3. **Scale Adjustment**
   - Toggle between dynamic and fixed scaling
   - Dynamic: Adjusts to actual value ranges
   - Fixed: Uses full -10 to +10 scale

4. **Export**
   - Click "Copy as Markdown" to export
   - Includes weights and calculated values
   - Ready for documentation or sharing

## Screenshots

### Main Interface
![Main Interface](docs/images/main-interface.png)

### Heatmap Visualization
![Heatmap Demo](docs/images/heatmap-demo.png)

### Mobile View
![Mobile Interface](docs/images/mobile-view.png)

## Technical Details

### Built With
- HTML5
- CSS3 (Tailwind CSS)
- Vanilla JavaScript
- No external dependencies

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgments

- Inspired by decision matrix methodologies
- UI design influenced by modern dark mode interfaces
- Icons from Heroicons

## Roadmap

- [ ] Save/Load matrix configurations
- [ ] Multiple matrix comparison
- [ ] Additional export formats
- [ ] Collaborative editing support
- [ ] Custom color themes
- [ ] Data visualization options

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/weighted-matrix-tool](https://github.com/yourusername/weighted-matrix-tool) 