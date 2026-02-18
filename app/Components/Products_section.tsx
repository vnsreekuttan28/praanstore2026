'use client'
import { Package, Search, Trash } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { addProduct, deactivateProduct, deleteProduct, fetchProducts, ProductModel } from '../Models/ProductsModel'

const Products_section = () => {

    const [_currentProducts, SetcurrentProducts] = useState<ProductModel[]>([])
    const [_allProducts, SetAllProducts] = useState<ProductModel[]>([])
    const [_filteredProducts, SetFilteredProducts] = useState<ProductModel[]>([])
    const [searchQuerry, setSearchQuery] = useState('')
    const [opneProductform, SetOpenproductform] = useState(false);
    const [opneDeleteform, SetOpenDeleteform] = useState(false);
    const [Refresh, Setrefresh] = useState(false);
    const [input_productid, Setinput_productid] = useState('')
    const [input_productName, Setinput_productName] = useState('')
    const [input_productprice, Setinput_productprice] = useState('')
    const [input_productimg, Setinput_productimg] = useState('')
    const [input_productstatus, Setinput_productstatus] = useState('active')
    const [selectedProduct, SetselectedProduct] = useState<ProductModel>()
     const [isfetched, Setisfetched]=useState(false);

    


    useEffect(() => {
        getProducts();
        Setisfetched(true);


    }, [Refresh])

    useEffect(() => {
        filterProducts();
        Setinput_productid((_allProducts.length + 1).toString())


    }, [_currentProducts, searchQuerry])

    //get producys list
    const getProducts = async () => {
        const products = await fetchProducts();
        const activeproducts=products.filter((p)=>{
            return(
                p.status==="active"
            )
        })
        SetcurrentProducts(activeproducts);
        SetAllProducts(products);
        Setinput_productid((_allProducts.length + 1).toString())


    }

    //filter products
    const filterProducts = () => {
        const query = searchQuerry.toLowerCase()
        SetFilteredProducts(_currentProducts.filter((p) => {
            return (
                p.product_name.toLowerCase().includes(query)


            );
        }))
    }

    const closeform = () => {
        Setinput_productName('');
        Setinput_productimg('');
        Setinput_productprice('');
        SetOpenproductform(false)

    }

    //add product
    const submitProduct = async () => {

        //      img: string;
        // id: string;
        // product_name: string;
        // unit_price: string;
        // status:string
        const product = {
            id: input_productid,
            product_name: input_productName,
            img: input_productimg,
            unit_price: input_productprice,
            status: input_productstatus,
        }
        await addProduct(product).then(() => {
            closeform()
            Setrefresh(!Refresh)
        })

    }

    const editProduct=(product:ProductModel)=>{
         Setinput_productid(product.id);
         Setinput_productName(product.product_name);
        Setinput_productimg(product.img);
        Setinput_productprice(product.unit_price);
        SetOpenproductform(true)

    }


    const prepareDelete = (product: ProductModel) => {
        SetselectedProduct(product)
        SetOpenDeleteform(true)

    }

    const DeleteProduct = async () => {
        if (selectedProduct) {
            deactivateProduct(selectedProduct).then(() => {
                SetOpenDeleteform(false);
                Setrefresh(!Refresh)
            })
        }
                
        //     await deleteProduct(selectedProduct).then(() => {
        //         SetOpenDeleteform(false);
        //         Setrefresh(!Refresh)
        //     })
        // }



    }

    return (
        <div className='w-full flex flex-col border-2 border-gray-500 rounded-xl p-4  '>

            {/* Header */}
            <div className='w-full flex items-center gap-5 '>
                <div className='bg-green-100 text-green-700 rounded-xl p-3'>
                    <Package size={24} />
                </div>

                <div className='flex flex-col gap-2'>
                    <h1 className='font-bold text-xl'>Products</h1>
                    <p className='text-sm text-gray-500'>{_currentProducts.length} products found</p>
                </div>



                <div className='flex flex-1 flex-row-reverse'>
                    <div onClick={() => {closeform(); SetOpenproductform(true);  }} className={`px-4 py-2 bg-green-600 rounded-xl text-white cursor-pointer hover:bg-green-700 hover:shadow ${isfetched?"flex":"hidden"}`}>+Add New</div>
                </div>

            </div>

            <div className='w-full p-2 flex gap-2 items-center bg-gray-200 rounded-xl mt-5'>
                <Search size={20} />
                <input onChange={(e) => { setSearchQuery(e.target.value) }} placeholder='Search users with name or contact or id' className='w-full  p-2 border-0 focus:outline-none text-sm ring-0 ' />

            </div>



            {/* list */}
            <div className='h-[1065px] overflow-y-scroll  [&::-webkit-scrollbar]:hidden'>

            
            <div className='grid grid-cols-4 gap-5 mt-10     '>
                {_filteredProducts.map((product, index) => {




                    return <div onClick={() => {editProduct(product) }} key={index} className=' border-2 border-gray-300 w-full px-4 py-2 bg-green-50 rounded-xl cursor-pointer hover:shadow-sm hover:border-green-200'>
                        <div className='w-full flex justify-between items-center'>


                            <h1 className='text-md font-semibold'>{product.product_name}</h1>


                            <h1 className='text-sm text-gray-500 '>ID:#{product.id}</h1>
                        </div>




                        <div className='w-full flex justify-between'>
                            <p className='text-sm font-light'>₹{product.unit_price}/ unit</p>
                            <div onClick={(e) => { e.stopPropagation(); prepareDelete(product); }} className='hover:bg-red-200 rounded-xl p-2 '>
                                <Trash size={20} color='red' className='  rounded-xl' />
                            </div>


                        </div>

                        {/* <div className='w-full text-sm flex justify-between'>
                            <p>Completd Orders:{completedOrder.length}</p>
                            <p>Pending Orders:{pendingOrder.length}</p>

                        </div> */}





                    </div>
                })}

            </div>
            </div>
            {opneProductform &&
                <div className='fixed inset-0 z-10 p-4  flex items-center justify-center '>
                    {/* overlay */}
                    <div onClick={() => { SetOpenproductform(false) }} className='absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity'></div>

                    {/* content */}
                    <div className='relative  bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 '>
                        <div className='p-4 flex flex-col gap-5'>

                            <h1 className='w-full text-lg font-semibold border-b border-gray-100'>Product Info</h1>

                            <div className='w-full flex flex-col'>
                                <h1 className='text-xs'>ProductID (assiged automatically)</h1>
                                <input className='w-full p-2 bg-gray-200 rounded-xl' value={input_productid} readOnly={true} type="text" />
                            </div>

                            <div className='w-full flex flex-col'>
                                <h1 className='text-xs'>Product Name </h1>
                                <input onChange={((e) => { Setinput_productName(e.target.value) })} className='w-full p-2 bg-gray-200 rounded-xl' value={input_productName} type="text" />
                            </div>

                            <div className='w-full flex flex-col'>
                                <h1 className='text-xs'>Unit Price </h1>
                                <input onChange={((e) => { Setinput_productprice(e.target.value) })} className='w-full p-2 bg-gray-200 rounded-xl' value={input_productprice} type="number" />
                            </div>

                            <div className='w-full flex flex-col'>
                                <h1 className='text-xs'>image URL</h1>
                                <input onChange={((e) => { Setinput_productimg(e.target.value) })} className='w-full p-2 bg-gray-200 rounded-xl' value={input_productimg} type="url" />
                            </div>

                            <div className='w-full flex justify-center gap-5 items-center cursor-pointer'>
                                <h1 className="text-sm" onClick={closeform}>Cancel</h1>
                                <div onClick={submitProduct} className=' text-white px-2 py-2 bg-green-500 rounded-xl hover:shadow-2xl hover:bg-green-700'>Submit</div>
                            </div>



                        </div>


                    </div>
                </div>

            }

            {opneDeleteform &&
                <div className='fixed inset-0 z-10 p-4  flex items-center justify-center '>
                    {/* overlay */}
                    <div onClick={() => { SetOpenproductform(false) }} className='absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity'></div>

                    {/* content */}
                    <div className='relative  bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 '>
                        <div className='p-4 flex flex-col gap-5'>

                            <h1 className='w-full text-center text-lg font-semibold border-b border-gray-100'>Delete Product</h1>

                            <div className='w-full flex flex-col justify-center'>
                                <p className='w-full text-center'>Confirm detletion of the procuct {selectedProduct?.product_name}</p>
                            </div>

                           

                            <div className='w-full flex justify-center gap-5 items-center cursor-pointer'>
                                <h1 className="text-sm" onClick={() => { SetOpenDeleteform(false) }}>Cancel</h1>
                                <div onClick={DeleteProduct} className=' text-white px-2 py-2 bg-red-500 rounded-xl hover:shadow-2xl hover:bg-red-700'>Submit</div>
                            </div>



                        </div>


                    </div>
                </div>

            }

        </div>
    )
}

export default Products_section
