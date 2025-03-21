import { collection, addDoc, writeBatch, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Sample categories
const categories = [
  { name: 'Electronics' },
  { name: 'Clothing' },
  { name: 'Home & Kitchen' },
  { name: 'Beauty & Personal Care' },
  { name: 'Toys & Games' },
  { name: 'Sports & Outdoors' },
  { name: 'Books' },
  { name: 'Automotive' },
  { name: 'Health & Household' },
  { name: 'Pet Supplies' }
];

// Sample products (10 per category = 100 products total)
const generateProducts = () => {
  const products = [];
  
  categories.forEach(category => {
    for (let i = 1; i <= 10; i++) {
      const isOnSale = Math.random() > 0.7; // 30% chance of being on sale
      const price = Math.floor(Math.random() * 10000) / 100 + 5; // Random price between $5 and $105
      
      products.push({
        name: `${category.name} Product ${i}`,
        description: `This is a sample ${category.name.toLowerCase()} product. It is product number ${i} in this category.`,
        price,
        images: [
          `https://picsum.photos/seed/${category.name}${i}/400/400`,
          `https://picsum.photos/seed/${category.name}${i}b/400/400`,
          `https://picsum.photos/seed/${category.name}${i}c/400/400`
        ],
        category: category.name,
        inStock: Math.random() > 0.1, // 90% chance of being in stock
        onSale: isOnSale,
        salePrice: isOnSale ? Math.floor(price * 0.8 * 100) / 100 : undefined, // 20% discount on sale items
        popularity: Math.floor(Math.random() * 100), // Random popularity score
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)), // Random date in past ~4 months
        updatedAt: new Date()
      });
    }
  });
  
  return products;
};

export const seedCategories = async () => {
  try {
    const batch = writeBatch(db);
    const categoriesRef = collection(db, 'categories');
    
    categories.forEach((category, index) => {
      const docRef = doc(categoriesRef, `category-${index + 1}`);
      batch.set(docRef, category);
    });
    
    await batch.commit();
    console.log('Categories seeded successfully');
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
};

export const seedProducts = async () => {
  try {
    const products = generateProducts();
    const batch = writeBatch(db);
    const productsRef = collection(db, 'products');
    
    // Firestore batch operations are limited to 500 operations per batch
    // Since we're only adding 100 products, we can do it in one batch
    products.forEach((product, index) => {
      const docRef = doc(productsRef, `product-${index + 1}`);
      batch.set(docRef, product);
    });
    
    await batch.commit();
    console.log('Products seeded successfully');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

export const seedDatabase = async () => {
  await seedCategories();
  await seedProducts();
  console.log('Database seeded successfully');
};

// Run the seed function if this script is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Error seeding database:', error);
      process.exit(1);
    });
} 