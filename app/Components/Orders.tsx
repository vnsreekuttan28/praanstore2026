// 'use client'
// import { ShoppingCart, User, Store, Plus, Trash2, Search, CheckCircle, X, ReceiptText } from 'lucide-react'
// import React, { useEffect, useState } from 'react'
// import { addOrder, fetchOrders, OrderModel, OrderItem } from '../Models/OrderModel'
// import { fetchProducts, ProductModel } from '../Models/ProductsModel'
// import { fetchStore, StoreModel } from '../Models/StoreModel'
// import { fetchUsers, UserModel } from '../Models/UserModel'

// const Orders = () => {
//     // --- State Management ---
//     const [openOrderForm, setOpenOrderForm] = useState(false);
//     const [selectedOrderDetails, setSelectedOrderDetails] = useState<OrderModel | null>(null);
//     const [currentOrders, setCurrentOrders] = useState<OrderModel[]>([]);
//     const [allProducts, setAllProducts] = useState<ProductModel[]>([]);
//     const [allStores, setAllStores] = useState<StoreModel[]>([]);
//     const [allUsers, setAllUsers] = useState<UserModel[]>([]);
    
//     // Form States
//     const [selectedStoreId, setSelectedStoreId] = useState("");
//     const [orderStatus, setOrderStatus] = useState('delivered');
//     const [totalReceived, setTotalReceived] = useState('0');
//     const [isStoreOrder, setIsStoreOrder] = useState(true);
//     const [selectedUserId, setSelectedUserId] = useState('');
//     const [customerName, setCustomerName] = useState('');
//     const [contact, setContact] = useState('');
//     const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [showSuggestions, setShowSuggestions] = useState(false);
//     const [tempItem, setTempItem] = useState<OrderItem>({
//         product_id: '', product_name: '', price: '0', qty: '1', status: 'delivered'
//     });

//     useEffect(() => {
//         loadInitialData();
//     }, []);

//     const loadInitialData = async () => {
//         const [orders, products, stores, users] = await Promise.all([
//             fetchOrders(), fetchProducts(), fetchStore(), fetchUsers()
//         ]);
        
//         // Sorting by ID descending (Newest first)
//         const sortedOrders = [...orders].sort((a, b) => b.id.localeCompare(a.id));
//         setCurrentOrders(sortedOrders);
//         setAllProducts(products);
//         setAllStores(stores);
//         setAllUsers(users);
//     };

//     // --- Helpers ---
//     const formatTimestamp = () => {
//         const now = new Date();
//         const datePart = now.toISOString().replace('T', ' ').replace('Z', '');
//         return `${datePart}000`; // Simulated microseconds for precision ID
//     };

//     const addItemToOrder = () => {
//         if (!tempItem.product_id) return alert("Select a product");
//         setOrderItems([...orderItems, tempItem]);
//         setTempItem({ product_id: '', product_name: '', price: '0', qty: '1', status: 'delivered' });
//         setSearchQuery('');
//     };

//     const grandTotal = orderItems.reduce((acc, item) => acc + (parseFloat(item.price) * parseInt(item.qty)), 0);
//     const creditAmount = grandTotal - parseFloat(totalReceived || '0');

//     const handleSubmitOrder = async () => {
//         if (!selectedUserId) return alert("Please assign a user");
//         if (!customerName) return alert("Customer name is required");
//         if (orderItems.length === 0) return alert("Add at least one item");

//         const newOrder: OrderModel = {
//             id: formatTimestamp(),
//             assiged_by: "Admin",
//             assiged_user_id: selectedUserId,
//             credit_amount: creditAmount.toString(),
//             customer: { name: customerName, contact: contact, address: "NA", id: "NA", location: "NA" },
//             notes: "",
//             orderStatus: orderStatus,
//             order_items: orderItems,
//             payment_method: "Cash",
//             store_id: isStoreOrder ? selectedStoreId : "0",
//             timestamp: new Date().toISOString(),
//             total_received: totalReceived,
//         };

//         await addOrder(newOrder);
//         setOpenOrderForm(false);
//         setOrderItems([]);
//         setTotalReceived('0');
//         loadInitialData();
//     };

//     return (
//         <div className='h-full flex flex-col p-5 border-2 rounded-xl border-gray-200 shadow-xl max-h-[85vh] bg-white overflow-hidden'>
            
//             {/* Header */}
//             <div className='flex justify-between items-center mb-6'>
//                 <div className='flex gap-4 items-center'>
//                     <div className='bg-green-100 rounded-xl p-3 text-green-700'><ShoppingCart size={24}/></div>
//                     <div>
//                         <h1 className='text-xl font-black text-gray-800'>Live Orders</h1>
//                         <p className='text-xs text-gray-500'>{currentOrders.length} transactions found</p>
//                     </div>
//                 </div>
//                 <button onClick={() => setOpenOrderForm(true)} className='bg-green-800 hover:bg-green-900 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-green-100'>
//                     + Create Order
//                 </button>
//             </div>

//             {/* Orders List */}
//             <div className='flex flex-col gap-4 overflow-y-auto pr-2'>
//                 {currentOrders.map((order) => (
//                     <div 
//                         key={order.id} 
//                         onClick={() => setSelectedOrderDetails(order)}
//                         className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col gap-2 hover:border-green-400 hover:shadow-md transition-all cursor-pointer group"
//                     >
//                         <div className='flex justify-between items-start'>
//                             <div>
//                                 <span className='text-[10px] font-mono text-gray-400 group-hover:text-green-600 transition-colors'>#{order.id}</span>
//                                 <h2 className='font-bold text-gray-800 text-lg'>{order.customer.name}</h2>
//                             </div>
//                             <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
//                                 {order.orderStatus}
//                             </span>
//                         </div>
//                         <div className='flex items-center gap-2 text-xs text-gray-600 bg-white p-2 rounded-lg border border-gray-100'>
//                             <User size={12}/> Assigned: <span className='font-bold text-blue-600'>{allUsers.find(u => u.id === order.assiged_user_id)?.name || "Agent " + order.assiged_user_id}</span>
//                         </div>
//                         <div className='flex justify-between mt-2 pt-2 border-t border-dashed'>
//                             <div className='flex flex-col'><span className='text-[10px] text-gray-400 uppercase'>Received</span><span className='font-bold text-green-700'>₹{order.total_received}</span></div>
//                             <div className='flex flex-col text-right'><span className='text-[10px] text-gray-400 uppercase'>Balance</span><span className='font-bold text-red-600'>₹{order.credit_amount}</span></div>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* --- Detail View Modal --- */}
//             {selectedOrderDetails && (
//                 <div className='fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'>
//                     <div className='bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200'>
//                         <div className='p-6 border-b flex justify-between items-center bg-gray-50'>
//                             <div className='flex items-center gap-3'>
//                                 <ReceiptText className='text-green-600' />
//                                 <div>
//                                     <h2 className='text-xl font-black text-gray-800'>Order Summary</h2>
//                                     <p className='text-xs font-mono text-gray-400'>#{selectedOrderDetails.id}</p>
//                                 </div>
//                             </div>
//                             <button onClick={() => setSelectedOrderDetails(null)} className='p-2 hover:bg-gray-200 rounded-full'><X size={20}/></button>
//                         </div>
//                         <div className='p-8 space-y-6'>
//                             <div className='grid grid-cols-2 gap-4'>
//                                 <div className='p-4 bg-blue-50 rounded-2xl'>
//                                     <label className='text-[10px] font-bold text-blue-400 uppercase'>Customer</label>
//                                     <p className='font-bold text-blue-900'>{selectedOrderDetails.customer.name}</p>
//                                     <p className='text-xs text-blue-700'>{selectedOrderDetails.customer.contact}</p>
//                                 </div>
//                                 <div className='p-4 bg-purple-50 rounded-2xl'>
//                                     <label className='text-[10px] font-bold text-purple-400 uppercase'>Status</label>
//                                     <p className='font-bold text-purple-900 capitalize'>{selectedOrderDetails.orderStatus}</p>
//                                     <p className='text-xs text-purple-700'>via {selectedOrderDetails.payment_method}</p>
//                                 </div>
//                             </div>
//                             <div className='border rounded-2xl overflow-hidden'>
//                                 <table className='w-full text-left text-sm'>
//                                     <thead className='bg-gray-100 font-bold text-gray-500'>
//                                         <tr><th className='p-3'>Item</th><th className='p-3 text-center'>Qty</th><th className='p-3 text-right'>Total</th></tr>
//                                     </thead>
//                                     <tbody>
//                                         {selectedOrderDetails.order_items.map((item, i) => (
//                                             <tr key={i} className='border-t'><td className='p-3 font-medium'>{item.product_name}</td><td className='p-3 text-center'>x{item.qty}</td><td className='p-3 text-right font-bold'>₹{parseFloat(item.price) * parseInt(item.qty)}</td></tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                             <div className='flex justify-between items-center pt-4 border-t border-dashed'>
//                                 <div className='text-center'><p className='text-[10px] text-gray-400 uppercase'>Received</p><p className='text-lg font-bold text-green-600'>₹{selectedOrderDetails.total_received}</p></div>
//                                 <div className='text-center'><p className='text-[10px] text-gray-400 uppercase'>Balance</p><p className='text-lg font-bold text-red-600'>₹{selectedOrderDetails.credit_amount}</p></div>
//                                 <div className='text-right'><p className='text-[10px] text-gray-400 uppercase'>Grand Total</p><p className='text-2xl font-black text-gray-800'>₹{selectedOrderDetails.order_items.reduce((s, i) => s + (parseFloat(i.price) * parseInt(i.qty)), 0)}</p></div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* --- Create Order Modal --- */}
//             {openOrderForm && (
//                 <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md'>
//                     <div className='bg-white w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col md:flex-row'>
//                         {/* LEFT: Setup */}
//                         <div className='w-full md:w-1/3 p-8 border-r bg-gray-50/50'>
//                             <h2 className='text-2xl font-black text-gray-800 mb-6'>Order Setup</h2>
//                             <div className='space-y-6'>
//                                 <div className='space-y-2'>
//                                     <label className='text-xs font-bold text-blue-600 uppercase flex items-center gap-2'><User size={14}/> Distribution Agent</label>
//                                     <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} className='w-full p-3 bg-white border rounded-xl shadow-sm outline-none focus:ring-2 ring-blue-500'>
//                                         <option value="">Select Delivery User</option>
//                                         {allUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
//                                     </select>
//                                 </div>
//                                 <div className='flex p-1 bg-gray-200 rounded-xl'>
//                                     <button onClick={() => setIsStoreOrder(true)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${isStoreOrder ? 'bg-white shadow-sm' : 'text-gray-500'}`}>Store</button>
//                                     <button onClick={() => setIsStoreOrder(false)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${!isStoreOrder ? 'bg-white shadow-sm' : 'text-gray-500'}`}>General</button>
//                                 </div>
//                                 {isStoreOrder ? (
//                                     <div className='space-y-2'>
//                                         <label className='text-xs font-bold text-gray-500 uppercase flex items-center gap-2'><Store size={14}/> Select Store</label>
//                                         <select value={selectedStoreId} onChange={(e) => {
//                                             const val = e.target.value;
//                                             setSelectedStoreId(val);
//                                             const s = allStores.find(st => st.id === val);
//                                             if (s) { setCustomerName(s.name); setContact(s.contact); }
//                                         }} className='w-full p-3 bg-white border rounded-xl shadow-sm'>
//                                             <option value="">Choose a Store</option>
//                                             {allStores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
//                                         </select>
//                                     </div>
//                                 ) : (
//                                     <div className='space-y-3'>
//                                         <input placeholder="Customer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className='w-full p-3 border rounded-xl'/>
//                                         <input placeholder="Phone Number" value={contact} onChange={(e) => setContact(e.target.value)} className='w-full p-3 border rounded-xl'/>
//                                     </div>
//                                 )}
//                                 <div className='space-y-2 pt-4 border-t'>
//                                     <label className='text-xs font-bold text-green-600 uppercase'>Payment Received (₹)</label>
//                                     <input value={totalReceived} onChange={(e) => setTotalReceived(e.target.value)} className='w-full p-4 bg-green-50 text-2xl font-black text-green-700 rounded-xl outline-none focus:ring-2 ring-green-500' type="number"/>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* RIGHT: Items */}
//                         <div className='flex-1 p-8 flex flex-col'>
//                             <div className='flex justify-between items-center mb-6'>
//                                 <h3 className='text-xl font-bold flex items-center gap-2'><Plus className='text-green-600'/> Add Items</h3>
//                                 <div className='text-right'>
//                                     <p className='text-[10px] text-gray-400 uppercase font-bold'>Current Total</p>
//                                     <p className='text-2xl font-black'>₹{grandTotal}</p>
//                                 </div>
//                             </div>
//                             <div className='grid grid-cols-12 gap-2 mb-6'>
//                                 <div className='col-span-6 relative'>
//                                     <input value={searchQuery} onFocus={() => setShowSuggestions(true)} onChange={(e) => setSearchQuery(e.target.value)} className='w-full p-3 border rounded-xl bg-gray-50' placeholder='Search Product...'/>
//                                     {showSuggestions && searchQuery && (
//                                         <div className='absolute top-full left-0 w-full bg-white border shadow-2xl rounded-xl z-50 max-h-48 overflow-y-auto mt-1'>
//                                             {allProducts.filter(p => p.product_name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
//                                                 <div key={p.id} onClick={() => {
//                                                     setTempItem({...tempItem, product_id: p.id, product_name: p.product_name, price: p.unit_price});
//                                                     setSearchQuery(p.product_name); setShowSuggestions(false);
//                                                 }} className='p-3 hover:bg-green-50 cursor-pointer border-b text-sm'>{p.product_name} <span className='text-gray-400'>(₹{p.unit_price})</span></div>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                                 <input type="number" value={tempItem.price} onChange={(e) => setTempItem({...tempItem, price: e.target.value})} className='col-span-2 p-3 border rounded-xl text-center' placeholder='Price'/>
//                                 <input type="number" value={tempItem.qty} onChange={(e) => setTempItem({...tempItem, qty: e.target.value})} className='col-span-2 p-3 border rounded-xl text-center' placeholder='Qty'/>
//                                 <button onClick={addItemToOrder} className='col-span-2 bg-gray-900 text-white rounded-xl flex items-center justify-center hover:bg-black transition-all'><Plus/></button>
//                             </div>

//                             <div className='flex-1 border rounded-2xl overflow-hidden bg-white'>
//                                 <table className='w-full text-left'>
//                                     <thead className='bg-gray-100 text-[10px] uppercase font-bold text-gray-500'>
//                                         <tr><th className='p-4'>Item</th><th className='p-4 text-center'>Price</th><th className='p-4 text-center'>Qty</th><th className='p-4 text-center'>Subtotal</th><th className='p-4'></th></tr>
//                                     </thead>
//                                     <tbody className='text-sm'>
//                                         {orderItems.map((item, idx) => (
//                                             <tr key={idx} className='border-b last:border-0'>
//                                                 <td className='p-4 font-bold'>{item.product_name}</td>
//                                                 <td className='p-4 text-center'>₹{item.price}</td>
//                                                 <td className='p-4 text-center'>x{item.qty}</td>
//                                                 <td className='p-4 text-center font-black'>₹{parseFloat(item.price) * parseInt(item.qty)}</td>
//                                                 <td className='p-4 text-right'><button onClick={() => setOrderItems(orderItems.filter((_, i) => i !== idx))} className='text-red-400 hover:text-red-600'><Trash2 size={18}/></button></td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                             <div className='mt-6 flex gap-4'>
//                                 <button onClick={() => setOpenOrderForm(false)} className='px-8 py-4 font-bold text-gray-400 hover:text-gray-600 transition-colors'>Cancel</button>
//                                 <button onClick={handleSubmitOrder} className='flex-1 py-4 bg-green-800 text-white rounded-2xl font-black text-lg shadow-xl shadow-green-200 hover:bg-green-900 transition-all'>Place Order</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }

// export default Orders;