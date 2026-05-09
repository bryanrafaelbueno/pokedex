<div align="center">
  <img src="https://i.imgur.com/8GghEXD.png" alt="Pokédex Logo" width="300">
</div>

# Pokédex

An interactive web application that displays Pokémon cards with detailed information from the [PokeAPI](https://pokeapi.co/).

## Features

- **Interactive Card Flip**: Hover over cards to flip and view detailed Pokémon statistics
- **4000+ Pokémon**: Browse through all available Pokémon from the PokeAPI
- **Responsive Grid Layout**: Cards automatically arrange based on screen size
- **Pokemon Information Displayed**:
  - Front: Pokémon image and name
  - Back: Types, HP, Attack, Defense, Height, and Weight
- **Real-time Data**: Fetches live data from PokeAPI on page load
- **Type Capitalization**: All Pokémon types are properly formatted with capitalized text

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js with Express
- **API**: [PokeAPI v2](https://pokeapi.co/api/v2/)

## Project Structure

```
pokedex/
├── ClientContent/
│   ├── index.html       # Main HTML file
│   ├── index.css        # Styling and card flip animations
│   ├── index.js         # Frontend logic
│   ├── 404/             # 404 error page
│   │   ├── 404.html
│   │   └── 404.css
│   └── fonts/           # Pokemon font files
├── images/              # Server-side images
├── TESTS/               # Test files
├── index.js             # Main server file
├── package.json         # Project dependencies
├── Procfile             # Heroku deployment file
└── README.md            # This file
```

## Installation & Setup

### Requirements
- Node.js (v12 or higher)
- npm (Node Package Manager)

### Steps

1. **Clone or extract the project**
   ```bash
   cd pokedex-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```
   or
   ```bash
   node index.js
   ```

4. **Open in browser**
   - Navigate to `http://localhost:3000` (or your configured port)

## Usage

1. **Browse Pokémon**: The page automatically loads 4000+ Pokémon from the PokeAPI
2. **Flip Cards**: Hover over any Pokémon card to see its detailed stats
3. **View Details**: The back of the card shows:
   - Pokémon name
   - Type(s)
   - HP (Hit Points)
   - ATK (Attack) and DEF (Defense) stats
   - Height (in meters)
   - Weight (in kilograms)

## API Reference

This project uses the **[PokeAPI v2](https://pokeapi.co/api/v2/)**

### Main Endpoints Used

- `GET /pokemon?limit=4000&offset=0` - Get list of Pokémon
- `GET /pokemon/{id}` - Get detailed info for a specific Pokémon

### Data Retrieved

- Sprites (front_default image)
- Types
- Stats (HP, Attack, Defense)
- Height & Weight

## Styling Notes

- **Card Dimensions**: 160px × 220px
- **Flip Animation**: 0.8s cubic-bezier easing
- **Color Scheme**: Dark theme with golden accents for labels
- **Font**: Custom "8-BIT WONDER" font for Pokémon names

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Any modern browser supporting:
  - CSS 3D Transforms
  - ES6 JavaScript
  - Fetch API

## Known Issues

- Cards skip if Pokémon image is unavailable (filtered on load)
- Large initial load time due to fetching 4000+ Pokémon

## Future Improvements

- Add search/filter functionality
- Implement pagination for better performance
- Add favorites/bookmarking feature
- Mobile touch support for card flips
- Add more detailed stats and moves
- Implement lazy loading for images

## License

This project uses publicly available data from [PokeAPI](https://pokeapi.co/).
