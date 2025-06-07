import { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  ImageIcon, GripVerticalIcon, EditIcon, 
  Trash2Icon, PlusIcon, StarIcon, ShoppingCartIcon,
  MessageSquareIcon, ChevronDownIcon, ChevronUpIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ReviewSection = ({ product, onAddReview }) => {
  const [expanded, setExpanded] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState(product.reviews || []);
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors }
  } = useForm();

  const handleAddReview = (data) => {
    const newReview = {
      id: Date.now(),
      user: 'You',
      rating: data.rating ? parseInt(data.rating) : null,
      comment: data.comment || '',
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    };
    
    setReviews([...reviews, newReview]);
    onAddReview(product.id, newReview);
    setShowReviewForm(false);
    reset();
  };

  return (
    <div className="mt-3 border-t pt-3">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => setExpanded(!expanded)}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <MessageSquareIcon className="h-4 w-4 mr-1" />
          <span>Reviews ({reviews.length})</span>
          {expanded ? <ChevronUpIcon className="h-4 w-4 ml-1" /> : <ChevronDownIcon className="h-4 w-4 ml-1" />}
        </button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowReviewForm(true)}
        >
          Add Review
        </Button>
      </div>

      {expanded && (
        <div className="mt-2 space-y-3">
          {reviews.map(review => (
            <div key={review.id} className="p-3 bg-gray-50 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{review.user}</p>
                  {review.rating && (
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i} 
                          className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-500">{review.date}</span>
              </div>
              {review.comment && <p className="mt-1 text-sm">{review.comment}</p>}
            </div>
          ))}
        </div>
      )}

      <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review {product.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAddReview)} className="space-y-4">
            <div>
              <Label>Rating (optional)</Label>
              <Select 
                {...register("rating")}
                defaultValue=""
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rating (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 stars - Excellent</SelectItem>
                  <SelectItem value="4">4 stars - Good</SelectItem>
                  <SelectItem value="3">3 stars - Average</SelectItem>
                  <SelectItem value="2">2 stars - Poor</SelectItem>
                  <SelectItem value="1">1 star - Very Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Review (optional)</Label>
              <Textarea 
                {...register("comment")}
                placeholder="Share your experience (optional)..."
                className="min-h-[100px]"
              />
            </div>
            
            <DialogFooter>
              <Button type="submit">Submit Review</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ProductCard = ({ product, index, moveProduct, onAddToCart, onAddReview, onDelete }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'PRODUCT',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, dropRef] = useDrop(() => ({
    accept: 'PRODUCT',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveProduct(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  }));

  const ref = (node) => {
    dragRef(node);
    dropRef(node);
  };

  return (
    <div 
      ref={ref}
      className={`border rounded-lg p-4 flex items-start space-x-4 bg-white ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <div className="cursor-move p-1">
        <GripVerticalIcon className="h-4 w-4 text-gray-400" />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-sm text-gray-500">SKU: {product.sku}</p>
          </div>
          <div className="flex items-center space-x-1">
            <StarIcon className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm">{product.rating || '4.5'}</span>
          </div>
        </div>
        <div className="mt-2 flex items-center space-x-2">
          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <ImageIcon className="h-6 w-6 text-gray-400" />
            )}
          </div>
          <div className="text-sm text-gray-600">
            <p>Stock: {product.stock}</p>
            <p>Sales: {product.sales}</p>
            <p className="font-semibold">¥{product.price.toFixed(2)}</p>
          </div>
        </div>
        <ReviewSection product={product} onAddReview={onAddReview} />
        <div className="mt-3 flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onAddToCart(product)}
            className="flex items-center space-x-1"
          >
            <ShoppingCartIcon className="h-4 w-4" />
            <span>Add to Cart</span>
          </Button>
        </div>
      </div>
      <div className="flex space-x-2">
        <button className="p-2 text-gray-500 hover:text-blue-500">
          <EditIcon className="h-4 w-4" />
        </button>
        <button 
          className="p-2 text-gray-500 hover:text-red-500"
          onClick={() => onDelete(product.id)}
        >
          <Trash2Icon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const ProductGrid = ({ onAddToCart }) => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Premium Wireless Headphones",
      sku: "SKU-001",
      price: 299.99,
      stock: 50,
      sales: 128,
      rating: 4.8,
      image: "https://nocode.meituan.com/photo/search?keyword=headphones&width=400&height=300",
      reviews: [
        {
          id: 1,
          user: 'John',
          rating: 5,
          comment: 'Excellent sound quality and noise cancellation!',
          date: 'Jun 15, 2023'
        },
        {
          id: 2,
          user: 'Sarah',
          rating: 4,
          comment: 'Comfortable but battery life could be better',
          date: 'Jun 10, 2023'
        }
      ]
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      sku: "SKU-002",
      price: 199.99,
      stock: 75,
      sales: 256,
      rating: 4.6,
      image: "https://nocode.meituan.com/photo/search?keyword=smartwatch&width=400&height=300",
      reviews: []
    },
    {
      id: 3,
      name: "Portable Bluetooth Speaker",
      sku: "SKU-003",
      price: 89.99,
      stock: 100,
      sales: 312,
      rating: 4.7,
      image: "https://nocode.meituan.com/photo/search?keyword=speaker&width=400&height=300"
    },
    {
      id: 4,
      name: "4K Ultra HD Smart TV",
      sku: "SKU-004",
      price: 899.99,
      stock: 30,
      sales: 85,
      rating: 4.9,
      image: "https://nocode.meituan.com/photo/search?keyword=smart+tv&width=400&height=300"
    },
    {
      id: 5,
      name: "Gaming Laptop",
      sku: "SKU-005",
      price: 1499.99,
      stock: 25,
      sales: 42,
      rating: 4.7,
      image: "https://nocode.meituan.com/photo/search?keyword=gaming+laptop&width=400&height=300"
    },
    {
      id: 6,
      name: "Wireless Charger",
      sku: "SKU-006",
      price: 29.99,
      stock: 150,
      sales: 210,
      rating: 4.3,
      image: "https://nocode.meituan.com/photo/search?keyword=wireless+charger&width=400&height=300"
    },
    {
      id: 7,
      name: "Noise Cancelling Earbuds",
      sku: "SKU-007",
      price: 159.99,
      stock: 65,
      sales: 178,
      rating: 4.5,
      image: "https://nocode.meituan.com/photo/search?keyword=earbuds&width=400&height=300"
    },
    {
      id: 8,
      name: "Smart Security Camera",
      sku: "SKU-008",
      price: 129.99,
      stock: 40,
      sales: 95,
      rating: 4.4,
      image: "https://nocode.meituan.com/photo/search?keyword=security+camera&width=400&height=300"
    },
    {
      id: 9,
      name: "Ergonomic Office Chair",
      sku: "SKU-009",
      price: 249.99,
      stock: 35,
      sales: 68,
      rating: 4.6,
      image: "https://nocode.meituan.com/photo/search?keyword=office+chair&width=400&height=300"
    },
    {
      id: 10,
      name: "Electric Toothbrush",
      sku: "SKU-010",
      price: 79.99,
      stock: 120,
      sales: 310,
      rating: 4.2,
      image: "https://nocode.meituan.com/photo/search?keyword=electric+toothbrush&width=400&height=300"
    }
  ]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [imageKeyword, setImageKeyword] = useState('');

  const moveProduct = (dragIndex, hoverIndex) => {
    const newProducts = [...products];
    const draggedProduct = newProducts[dragIndex];
    newProducts.splice(dragIndex, 1);
    newProducts.splice(hoverIndex, 0, draggedProduct);
    setProducts(newProducts);
  };

  const handleDelete = (productId) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  const handleAddReview = (productId, newReview) => {
    setProducts(products.map(product => {
      if (product.id === productId) {
        const updatedReviews = [...(product.reviews || []), newReview];
        const ratings = updatedReviews.filter(r => r.rating).map(r => r.rating);
        const newRating = ratings.length > 0 
          ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
          : product.rating || 4.0;
        return {
          ...product,
          reviews: updatedReviews,
          rating: parseFloat(newRating.toFixed(1))
        };
      }
      return product;
    }));
  };

  const onSubmit = (data) => {
    const newProduct = {
      id: Date.now(),
      name: data.name,
      sku: data.sku,
      price: parseFloat(data.price),
      stock: parseInt(data.stock),
      sales: 0,
      rating: 4.0,
      reviews: [],
      image: `https://nocode.meituan.com/photo/search?keyword=${imageKeyword || 'product'}&width=400&height=300`
    };
    
    setProducts([...products, newProduct]);
    setShowAddDialog(false);
    reset();
    setImageKeyword('');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Product Management</h2>
          <Button onClick={() => setShowAddDialog(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        <div className="space-y-2">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              moveProduct={moveProduct}
              onAddToCart={onAddToCart}
              onAddReview={handleAddReview}
              onDelete={handleDelete}
            />
          ))}
        </div>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new product to your inventory.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Product Name
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  {...register("name", { required: "Product name is required" })}
                />
                {errors.name && (
                  <p className="col-span-4 text-right text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sku" className="text-right">
                  SKU
                </Label>
                <Input
                  id="sku"
                  className="col-span-3"
                  {...register("sku", { required: "SKU is required" })}
                />
                {errors.sku && (
                  <p className="col-span-4 text-right text-sm text-red-500">
                    {errors.sku.message}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price (¥)
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  className="col-span-3"
                  {...register("price", { 
                    required: "Price is required",
                    min: { value: 0.01, message: "Price must be greater than 0" }
                  })}
                />
                {errors.price && (
                  <p className="col-span-4 text-right text-sm text-red-500">
                    {errors.price.message}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right">
                  Stock
                </Label>
                <Input
                  id="stock"
                  type="number"
                  className="col-span-3"
                  {...register("stock", { 
                    required: "Stock is required",
                    min: { value: 0, message: "Stock cannot be negative" }
                  })}
                />
                {errors.stock && (
                  <p className="col-span-4 text-right text-sm text-red-500">
                    {errors.stock.message}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  Image Keywords
                </Label>
                <Input
                  id="image"
                  className="col-span-3"
                  value={imageKeyword}
                  onChange={(e) => setImageKeyword(e.target.value)}
                  placeholder="e.g. headphones, laptop"
                />
              </div>
              
              <DialogFooter>
                <Button type="submit">Add Product</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DndProvider>
  );
};

export default ProductGrid;
