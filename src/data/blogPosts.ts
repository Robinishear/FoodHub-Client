export type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  category: string;
  content: string;
};

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Top 10 Hidden Gem Restaurants in New York',
    excerpt: 'Discover the most underrated culinary experiences that only locals know about...',
    image: "/blog_shop.avif",
    author: 'Alex Chen',
    date: 'Aug 12, 2026',
    category: 'Lifestyle',
    content:
      'From neighborhood bistros in Brooklyn to family-owned kitchens in Queens, these places deliver unforgettable flavors without the long waits or tourist crowds. Start with small plates, ask for chef specials, and visit during non-peak hours for the best experience.',
  },
  {
    id: 2,
    title: 'The Art of Making Perfect Neapolitan Pizza',
    excerpt: 'Everything you need to know about the dough, the sauce, and the heat...',
    image: "/margarita-pizza.jpg",
    author: 'Chef Mario',
    date: 'Aug 10, 2026',
    category: 'Recipes',
    content:
      'Great Neapolitan pizza starts with a light, elastic dough and high-temperature baking. Use simple ingredients, respect fermentation time, and avoid overloading toppings. A balanced crust and clean tomato flavor make all the difference.',
  },
  {
    id: 3,
    title: 'How Delivery Apps are Balancing Speed and Sustainability',
    excerpt: 'FoodHub commitment to eco-friendly packaging and conscious delivery methods...',
    image: '/blog_food.avif',
    author: 'Emma Wilson',
    date: 'Aug 05, 2026',
    category: 'Inside FoodHub',
    content:
      'Modern delivery systems can stay fast while reducing waste. Route optimization, low-emission delivery partners, and recyclable packaging lower environmental impact without compromising service quality.',
  },
];
