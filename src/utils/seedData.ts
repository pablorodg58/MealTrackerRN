import { Restaurant } from '../types';

export const RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: "Bill's",
    location: '12 Coney Street, York',
    description:
      "Located in the heart of York's historic city centre, Bill's is a vibrant, welcoming eatery housed in a beautiful Georgian building that perfectly blends rustic charm with modern flair, offering seasonal British dishes from breakfast through to dinner.",
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700&q=80',
    dishes: [
      'Crispy Calamari',
      'Pan-Fried Sea Bass Fillet',
      'Sweet Potato Fries & Garlic Greens',
      'Warm Mini Cinnamon Doughnuts',
    ],
  },
  {
    id: '2',
    name: 'YUZU',
    location: 'Unit 6, Enterprise Complex, York',
    description:
      'YUZU brings contemporary Japanese cuisine to York, with an authentic menu of ramen, katsu curries and freshly made gyoza. A cosy spot with a modern atmosphere and friendly staff.',
    imageUrl: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=700&q=80',
    dishes: [
      'Gyoza (Pan-Fried Dumplings)',
      'Chicken Katsu Curry',
      'Tonkotsu Ramen',
      'Edamame',
    ],
  },
  {
    id: '3',
    name: 'Cosy Club',
    location: '19-22 Fossgate, York',
    description:
      'Set in a beautifully converted venue, Cosy Club offers a relaxed all-day dining experience. With an eclectic menu ranging from brunch classics to hearty evening mains, it is the perfect York meeting spot.',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=80',
    dishes: ['Avocado Toast', 'Eggs Benedict', 'Superfood Salad', 'Club Burger'],
  },
  {
    id: '4',
    name: 'Prezzo Italian',
    location: '1 Clifford Street, York',
    description:
      "Prezzo Italian serves classic Italian cuisine in an elegant setting steps away from Clifford's Tower. Enjoy handmade pizzas, fresh pasta and traditional desserts in the heart of York.",
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&q=80',
    dishes: ['Garlic Bread', 'Margherita Pizza', 'Spaghetti Carbonara', 'Tiramisu'],
  },
  {
    id: '5',
    name: 'Byron',
    location: '11 High Ousegate, York',
    description:
      'Byron is renowned for its premium burgers made from 100% British beef, served alongside crispy sides and indulgent shakes. A casual, laid-back burger restaurant in the centre of York.',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&q=80',
    dishes: ['Byron Burger', 'Chicken Wings', 'Sweet Potato Fries', 'Onion Rings'],
  },
  {
    id: '6',
    name: "L'Osteria Italiana",
    location: '31 Castlegate, York',
    description:
      "A hidden gem on Castlegate, L'Osteria Italiana delivers an intimate and authentic Italian dining experience. Homemade pasta, wood-fired dishes and a carefully curated wine list make every visit a true taste of Italy.",
    imageUrl: 'https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=700&q=80',
    dishes: [
      'Bruschetta al Pomodoro',
      'Tagliatelle al Ragù',
      'Saltimbocca alla Romana',
      'Panna Cotta',
    ],
  },
  {
    id: '7',
    name: 'Il Paradiso Del Cibo',
    location: '40 Walmgate, York',
    description:
      'Il Paradiso Del Cibo — "the paradise of food" — is a beloved York institution on Walmgate. Expect generous portions of rustic Italian cooking, from stone-baked pizzas to slow-cooked pasta sauces made fresh every day.',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=700&q=80',
    dishes: [
      'Antipasto Misto',
      'Pizza Diavola',
      "Rigatoni all'Amatriciana",
      'Cannoli Siciliani',
    ],
  },
  {
    id: '8',
    name: 'Ambiente Tapas',
    location: '31 Fossgate, York',
    description:
      'Ambiente Tapas brings the vibrant spirit of Spain to the heart of York. Choose from an extensive selection of hot and cold tapas, premium Spanish wines and sangria, all served in a lively and colourful atmosphere on Fossgate.',
    imageUrl: 'https://images.unsplash.com/photo-1534790566855-4cb788d389ec?w=700&q=80',
    dishes: [
      'Patatas Bravas',
      'Gambas al Ajillo',
      'Croquetas de Jamón',
      'Churros con Chocolate',
    ],
  },
  {
    id: '9',
    name: "Burgsy's",
    location: '9 Walmgate, York',
    description:
      "Burgsy's is York's go-to spot for bold, creative burgers packed with quality ingredients. With an ever-changing specials board and a relaxed street-food vibe, every visit feels like a new adventure.",
    imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=700&q=80',
    dishes: [
      'The Classic Smash Burger',
      'BBQ Bacon Melt',
      'Loaded Cheese Fries',
      'Chocolate Brownie Shake',
    ],
  },
  {
    id: '10',
    name: 'Rustique',
    location: '28 Castlegate, York',
    description:
      'Rustique is a charming French brasserie tucked away on Castlegate, serving classic Gallic dishes in a warm bistro setting. From moules marinière to crème brûlée, it is a little slice of France in the heart of York.',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=80',
    dishes: [
      'Moules Marinière',
      'Steak Frites',
      'Salade Niçoise',
      'Crème Brûlée',
    ],
  },
];

export const getRestaurantById = (id: string): Restaurant | undefined =>
  RESTAURANTS.find((r) => r.id === id);
