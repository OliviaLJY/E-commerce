import { useState } from 'react';
import { 
  TruckIcon, CheckCircle2Icon, ClockIcon, 
  XCircleIcon, ChevronDownIcon, ChevronUpIcon,
  DownloadIcon, CheckIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  shipped: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const statusIcons = {
  pending: <ClockIcon className="h-4 w-4" />,
  shipped: <TruckIcon className="h-4 w-4" />,
  delivered: <CheckCircle2Icon className="h-4 w-4" />,
  cancelled: <XCircleIcon className="h-4 w-4" />
};

const OrderCards = () => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [orders, setOrders] = useState([
    {
      id: 'ORD-2023-001',
      customer: 'John Doe',
      date: '2023-06-15',
      amount: 128.50,
      status: 'shipped',
      items: [
        { name: 'Men\'s Sneakers', price: 89.99, quantity: 1 },
        { name: 'Sports Socks', price: 19.99, quantity: 2 }
      ]
    },
    {
      id: 'ORD-2023-002',
      customer: 'Jane Smith',
      date: '2023-06-14',
      amount: 45.99,
      status: 'delivered',
      items: [
        { name: 'Wireless Earbuds', price: 45.99, quantity: 1 }
      ]
    },
    {
      id: 'ORD-2023-003',
      customer: 'Robert Johnson',
      date: '2023-06-13',
      amount: 210.00,
      status: 'pending',
      items: [
        { name: 'Smart Watch', price: 199.00, quantity: 1 },
        { name: 'Watch Band', price: 11.00, quantity: 1 }
      ]
    }
  ]);
  const { toast } = useToast();

  const toggleSelectOrder = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const exportData = () => {
    const dataToExport = selectedOrders.length > 0
      ? orders.filter(order => selectedOrders.includes(order.id))
      : orders;
    
    const csvContent = [
      ['Order ID', 'Customer', 'Date', 'Amount', 'Status', 'Items'],
      ...dataToExport.map(order => [
        order.id,
        order.customer,
        order.date,
        `$${order.amount.toFixed(2)}`,
        order.status,
        order.items.map(item => `${item.name} (x${item.quantity})`).join('; ')
      ])
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `Exported ${dataToExport.length} order records`,
    });
  };

  const batchProcess = () => {
    if (selectedOrders.length === 0) {
      toast({
        title: "No Orders Selected",
        description: "Please select orders to process first",
        variant: "destructive"
      });
      return;
    }

    const updatedOrders = orders.map(order => {
      if (selectedOrders.includes(order.id)) {
        // Process different statuses differently
        switch(order.status) {
          case 'pending':
            return { ...order, status: 'shipped' };
          case 'shipped':
            return { ...order, status: 'delivered' };
          default:
            return order;
        }
      }
      return order;
    });

    setOrders(updatedOrders);
    setSelectedOrders([]);

    const processedCount = selectedOrders.length;
    toast({
      title: "Batch Process Complete",
      description: `Successfully processed ${processedCount} order${processedCount > 1 ? 's' : ''}`,
    });
  };

  const selectAllOrders = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(order => order.id));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Order Management</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportData}>
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={batchProcess}>
            <CheckIcon className="h-4 w-4 mr-2" />
            Batch Process
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button 
          onClick={selectAllOrders}
          className={`w-5 h-5 rounded border flex items-center justify-center ${
            selectedOrders.length === orders.length 
              ? 'bg-blue-500 border-blue-500 text-white' 
              : 'border-gray-300'
          }`}
        >
          {selectedOrders.length === orders.length && <CheckIcon className="h-3 w-3" />}
        </button>
        <span className="text-sm text-gray-600">
          {selectedOrders.length} of {orders.length} selected
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <div 
            key={order.id} 
            className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
              selectedOrders.includes(order.id) ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => toggleSelectOrder(order.id)}
                  className={`w-5 h-5 rounded border flex items-center justify-center ${
                    selectedOrders.includes(order.id) 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'border-gray-300'
                  }`}
                >
                  {selectedOrders.includes(order.id) && <CheckIcon className="h-3 w-3" />}
                </button>
                <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${statusColors[order.status]}`}>
                  {statusIcons[order.status]}
                  <span className="capitalize">{order.status}</span>
                </div>
                <div>
                  <p className="font-medium">Order: {order.id}</p>
                  <p className="text-sm text-gray-500">{order.date} · {order.customer}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <p className="font-semibold">${order.amount.toFixed(2)}</p>
                <button 
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {expandedOrder === order.id ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </button>
              </div>
            </div>

            {expandedOrder === order.id && (
              <div className="border-t p-4 bg-gray-50">
                <h3 className="font-medium mb-2">Order Items</h3>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <p>{item.name} × {item.quantity}</p>
                      <p>${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t flex justify-end space-x-2">
                  <Button variant="outline">Track Shipment</Button>
                  {order.status === 'pending' && <Button>Ship Now</Button>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderCards;
