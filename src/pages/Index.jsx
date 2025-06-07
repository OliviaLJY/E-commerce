import { useState } from 'react';
import { 
  Package2Icon, ShoppingCartIcon, PackageIcon, 
  UsersIcon, LineChartIcon, SettingsIcon 
} from 'lucide-react';
import Dashboard from '../components/Dashboard';
import OrderCards from '../components/OrderCards';
import ProductGrid from '../components/ProductGrid';
import CartSidebar from '../components/CartSidebar';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [cart, setCart] = useState([]);

  const handleAddToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (index) => {
    setCart(prevCart => {
      const newCart = [...prevCart];
      newCart.splice(index, 1);
      return newCart;
    });
  };

  const handleCheckout = () => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Checkout successful! Total: ¥${total.toFixed(2)}`);
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gradient-to-r from-[#4F46E5] to-[#2563EB] text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package2Icon className="h-6 w-6" />
            <h1 className="text-xl font-semibold">E-commerce Dashboard</h1>
          </div>
          <nav className="flex space-x-6">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-md ${activeTab === 'dashboard' ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              <div className="flex items-center space-x-2">
                <LineChartIcon className="h-4 w-4" />
                <span>Dashboard</span>
              </div>
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-2 rounded-md ${activeTab === 'orders' ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              <div className="flex items-center space-x-2">
                <ShoppingCartIcon className="h-4 w-4" />
                <span>Orders</span>
              </div>
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`px-3 py-2 rounded-md ${activeTab === 'products' ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              <div className="flex items-center space-x-2">
                <PackageIcon className="h-4 w-4" />
                <span>Products</span>
              </div>
            </button>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-white/10">
              <SettingsIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'orders' && <OrderCards />}
        {activeTab === 'products' && (
          <ProductGrid 
            onAddToCart={handleAddToCart}
          />
        )}
      </main>

      <CartSidebar 
        cart={cart} 
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default Index;
