import { useState } from 'react';
import { ShoppingCartIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CartSidebar = ({ cart, onRemoveItem, onCheckout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="fixed right-0 top-1/2 transform -translate-y-1/2">
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white p-3 rounded-l-lg shadow-lg flex items-center"
      >
        <ShoppingCartIcon className="h-5 w-5" />
        <span className="ml-1">{cart.reduce((count, item) => count + item.quantity, 0)}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Shopping Cart</h2>
              <button onClick={() => setIsOpen(false)}>
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{item.name} × {item.quantity}</p>
                        <p className="text-sm text-gray-500">¥{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onRemoveItem(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold mb-4">
                    <span>Total:</span>
                    <span>¥{total.toFixed(2)}</span>
                  </div>
                  <Button className="w-full" onClick={onCheckout}>
                    Checkout
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;
