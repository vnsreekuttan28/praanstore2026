// 'use client'
// import { Contact, Store, MapPin, Phone, Plus, X, Loader2 } from 'lucide-react'
// import React, { useEffect, useState } from 'react'
// import { addStore, fetchStore, StoreModel } from '../Models/StoreModel';

// const Stores = () => {
//     const [_currentStores, SetCurrentStore] = useState<StoreModel[]>([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [openNewStoreForm, SetOpenStoreForm] = useState(false);

//     // Single State Object for the Form
//     const [formData, setFormData] = useState({
//         id: '',
//         name: '',
//         location: '',
//         contact: '',
//         address: '',
//         order_ids:['']
//     });

//     useEffect(() => {
//         getStores();
//     }, []);

//     const getStores = async () => {
//         setIsLoading(true);
//         try {
//             const storeData = await fetchStore();
//             SetCurrentStore(storeData);
//         } catch (e) {
//             console.error("Failed to fetch stores:", e);
//         } finally {
//             setIsLoading(false);
//         }
//     }

//     const closeForm = () => {
//         setFormData({ id: '', name: '', location: '', contact: '', address: '', order_ids:[''] });
//         SetOpenStoreForm(false);
//     }

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     }

//     const submitNewStore = async () => {
//         if (!formData.id || !formData.name) return alert("Please fill in ID and Name");
        
//         setIsLoading(true);
//         try {
//            // await addStore(formData);
//             await getStores(); // Refresh list
//             closeForm();
//         } catch (e) {
//             alert("Error saving store");
//         } finally {
//             setIsLoading(false);
//         }
//     }

//     return (
//         <div className='h-full flex flex-col p-6 bg-white border border-gray-200 rounded-2xl shadow-sm max-h-[75vh]'>
//             {/* Header Area */}
//             <div className='flex justify-between items-center mb-6'>
//                 <div className='flex gap-4 items-center'>
//                     <div className='bg-green-100 text-green-700 rounded-xl p-3'>
//                         <Store size={24} />
//                     </div>
//                     <div>
//                         <h1 className='text-xl font-bold text-gray-800'>Stores</h1>
//                         <p className='text-xs text-gray-500'>{_currentStores.length} registered outlets</p>
//                     </div>
//                 </div>
//                 <button 
//                     onClick={() => SetOpenStoreForm(true)}
//                     className='bg-green-800 hover:bg-green-900 text-white p-2 px-4 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all'
//                 >
//                     <Plus size={18} /> Add New
//                 </button>
//             </div>

//             {/* List Area */}
//             <div className='flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar'>
//                 {isLoading && _currentStores.length === 0 ? (
//                     <div className='flex justify-center p-10'><Loader2 className='animate-spin text-green-800' /></div>
//                 ) : (
//                     _currentStores.map((store, index) => (
//                         <div key={index} className='group flex flex-col p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-green-50 hover:border-green-200 transition-all cursor-pointer'>
//                             <div className='flex justify-between items-start mb-2'>
//                                 <h2 className='text-lg font-bold text-gray-800'>{store.name}</h2>
//                                 <span className='text-[10px] bg-gray-200 px-2 py-1 rounded-md font-mono'>ID: {store.id}</span>
//                             </div>
//                             <div className='flex items-center gap-2 text-sm text-gray-600 mb-1'>
//                                 <MapPin size={14} className='text-green-600' />
//                                 <span className='truncate'>{store.address}</span>
//                             </div>
//                             <div className='flex items-center gap-2 text-sm text-gray-600'>
//                                 <Phone size={14} className='text-green-600' />
//                                 <span>{store.contact}</span>
//                             </div>
//                         </div>
//                     ))
//                 )}
//             </div>

//             {/* Modal Form */}
//             {openNewStoreForm && (
//                 <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
//                     {/* Backdrop */}
//                     <div onClick={closeForm} className='absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity'></div>

//                     {/* Content */}
//                     <div className='relative bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200'>
//                         <div className='p-6 border-b flex justify-between items-center'>
//                             <h2 className='text-xl font-bold text-gray-800'>Add New Store</h2>
//                             <button onClick={closeForm} className='text-gray-400 hover:text-gray-600'><X /></button>
//                         </div>
                        
//                         <div className='p-6 space-y-4'>
//                             <div className='space-y-1'>
//                                 <label className='text-xs font-bold text-gray-500 uppercase'>Store ID</label>
//                                 <input name="id" value={formData.id} onChange={handleChange} className='w-full p-3 bg-gray-50 rounded-xl border focus:ring-2 ring-green-500 outline-none transition-all' placeholder='ST-001' />
//                             </div>

//                             <div className='space-y-1'>
//                                 <label className='text-xs font-bold text-gray-500 uppercase'>Store Name</label>
//                                 <input name="name" value={formData.name} onChange={handleChange} className='w-full p-3 bg-gray-50 rounded-xl border focus:ring-2 ring-green-500 outline-none transition-all' placeholder='Main Street Outlet' />
//                             </div>

//                             <div className='grid grid-cols-2 gap-4'>
//                                 <div className='space-y-1'>
//                                     <label className='text-xs font-bold text-gray-500 uppercase'>Contact</label>
//                                     <input name="contact" value={formData.contact} onChange={handleChange} className='w-full p-3 bg-gray-50 rounded-xl border focus:ring-2 ring-green-500 outline-none transition-all' placeholder='+91...' />
//                                 </div>
//                                 <div className='space-y-1'>
//                                     <label className='text-xs font-bold text-gray-500 uppercase'>Map URL</label>
//                                     <input name="location" value={formData.location} onChange={handleChange} className='w-full p-3 bg-gray-50 rounded-xl border focus:ring-2 ring-green-500 outline-none transition-all' placeholder='https://maps...' />
//                                 </div>
//                             </div>

//                             <div className='space-y-1'>
//                                 <label className='text-xs font-bold text-gray-500 uppercase'>Physical Address</label>
//                                 <textarea name="address" rows={3} value={formData.address} onChange={handleChange} className='w-full p-3 bg-gray-50 rounded-xl border focus:ring-2 ring-green-500 outline-none transition-all resize-none' placeholder='Full address here...' />
//                             </div>
//                         </div>

//                         <div className='p-6 bg-gray-50 flex gap-3'>
//                             <button onClick={closeForm} className='flex-1 py-3 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-all'>Cancel</button>
//                             <button 
//                                 onClick={submitNewStore} 
//                                 disabled={isLoading}
//                                 className='flex-1 py-3 text-sm font-bold text-white bg-green-800 hover:bg-green-900 rounded-xl transition-all flex justify-center items-center'
//                             >
//                                 {isLoading ? <Loader2 className='animate-spin' size={20} /> : "Save Store"}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }

// export default Stores;