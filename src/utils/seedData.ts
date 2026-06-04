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
    location: 'Goodramgate, York',
    description:
      'Byron is renowned for its premium burgers made from 100% British beef, served alongside crispy sides and indulgent shakes. A casual, laid-back burger restaurant in the centre of York.',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&q=80',
    dishes: ['Byron Burger', 'Chicken Wings', 'Sweet Potato Fries', 'Onion Rings'],
  },
];

export const getRestaurantById = (id: string): Restaurant | undefined =>
  RESTAURANTS.find((r) => r.id === id);
