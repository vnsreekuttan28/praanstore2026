// 'use client'
// import { Package, Image as ImageIcon, X, Plus } from 'lucide-react'
// import React, { useEffect, useState } from 'react'
// import { ProductModel, fetchProducts, addProduct } from '../Models/ProductsModel'

// const Products = () => {
//     const [_currentProducts, SetCurrentProducts] = useState<ProductModel[]>([]);
//     const [openForm, setOpenForm] = useState(false);
    
//     // Form States matching your DB screenshot fields
//     const [input_id, setInputId] = useState('');
//     const [input_name, setInputName] = useState('');
//     const [input_price, setInputPrice] = useState('');
//     const [input_img, setInputImg] = useState('');

//     useEffect(() => {
//         getProducts();
//     }, [])

//     const getProducts = async () => {
//         try {
//             const data = await fetchProducts();
//             SetCurrentProducts(data);
//         } catch (e) {
//             console.error("Fetch error:", e);
//         }
//     }

//     const closeForm = () => {
//         setInputId('');
//         setInputName('');
//         setInputPrice('');
//         setInputImg('');
//         setOpenForm(false);
//     }

//     const submitNewProduct = async () => {
//         if (!input_id || !input_name) return alert("ID and Name are required");

//         const newProduct: ProductModel = {
//             id: input_id,
//             product_name: input_name,
//             unit_price: input_price,
//             img: input_img,
//             status:""
//         }

//         try {
//             await addProduct(newProduct);
//             getProducts(); // Refresh list
//             closeForm();
//         } catch (e) {
//             alert("Error adding product");
//         }
//     }

//     return (
//         <div className='h-full flex flex-col p-5 border-2 rounded-xl border-gray-500 shadow-xl max-h-[70vh] bg-white'>
//             {/* Header */}
//             <div className='flex justify-between items-center mb-5'>
//                 <div className='flex gap-5 items-center'>
//                     <div className='bg-blue-100 rounded-xl p-2 text-blue-700'><Package /></div>
//                     <h1 className='text-xl font-bold'>Products</h1>
//                 </div>
//                 <button 
//                     onClick={() => setOpenForm(true)}
//                     className='bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2'
//                 >
//                     <Plus size={16} /> Add Product
//                 </button>
//             </div>

//             {/* Product List */}
//             <div className='flex flex-col gap-3 overflow-y-auto pr-2'>
//                 {_currentProducts.map((product) => (
//                     <div key={product.id} className='flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-all'>
//                         <div className='w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center'>
//                             {product.img ? (
//                                 <img src={product.img} alt={product.product_name} className='w-full h-full object-cover' />
//                             ) : (
//                                 <ImageIcon className='text-gray-400' size={20} />
//                             )}
//                         </div>
//                         <div className='flex-1'>
//                             <h3 className='font-bold text-gray-800'>{product.product_name}</h3>
//                             <p className='text-xs text-gray-500'>ID: {product.id}</p>
//                         </div>
//                         <div className='text-right'>
//                             <p className='font-black text-blue-700'>₹{product.unit_price}</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Modal Form */}
//             {openForm && (
//                 <div className='fixed top-0 left-0 w-full h-screen z-50 flex items-center justify-center'>
//                     {/* Overlay */}
//                     <div onClick={closeForm} className='absolute inset-0 bg-black opacity-70 backdrop-blur-sm'></div>

//                     <div className='relative z-10 flex flex-col bg-white p-8 w-full max-w-lg rounded-2xl shadow-2xl'>
//                         <h1 className='text-2xl font-bold mb-6'>Add New Product</h1>
                        
//                         <div className='flex flex-col gap-4'>
//                             <div>
//                                 <label className='text-sm font-semibold ml-1'>Product ID</label>
//                                 <input value={input_id} onChange={(e) => setInputId(e.target.value)} className='w-full p-3 bg-gray-100 rounded-xl outline-none focus:ring-2 ring-blue-500' placeholder='e.g. 1' type="text" />
//                             </div>

//                             <div>
//                                 <label className='text-sm font-semibold ml-1'>Product Name</label>
//                                 <input value={input_name} onChange={(e) => setInputName(e.target.value)} className='w-full p-3 bg-gray-100 rounded-xl outline-none focus:ring-2 ring-blue-500' placeholder='e.g. Coconut Oil' type="text" />
//                             </div>

//                             <div className='grid grid-cols-2 gap-4'>
//                                 <div>
//                                     <label className='text-sm font-semibold ml-1'>Unit Price (₹)</label>
//                                     <input value={input_price} onChange={(e) => setInputPrice(e.target.value)} className='w-full p-3 bg-gray-100 rounded-xl outline-none focus:ring-2 ring-blue-500' placeholder='500' type="text" />
//                                 </div>
//                                 <div>
//                                     <label className='text-sm font-semibold ml-1'>Image URL</label>
//                                     <input value={input_img} onChange={(e) => setInputImg(e.target.value)} className='w-full p-3 bg-gray-100 rounded-xl outline-none focus:ring-2 ring-blue-500' placeholder='https://...' type="text" />
//                                 </div>
//                             </div>
//                         </div>

//                         <div className='flex gap-4 mt-8'>
//                             <button onClick={closeForm} className='flex-1 p-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all'>Cancel</button>
//                             <button onClick={submitNewProduct} className='flex-1 p-4 bg-blue-700 text-white rounded-xl font-bold hover:bg-blue-800 transition-all'>Save Product</button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }

// export default Products