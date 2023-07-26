import React, { useState, useEffect } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import { FaPlus, FaEye, FaEdit, FaFileImage } from "react-icons/fa";
import { BsTrashFill } from "react-icons/bs";
import axios from "axios";

import 'react-toastify/dist/ReactToastify.css';
import ProductSellers from "./ProductSellers";
import AddSeller from "./AddSeller";
import classes from "./products.module.css";

const Products = () => {

  const [products, setProducts] = useState([]);
  const [modalInfoSeller, setModalInfoSeller] = useState(false);
  const [modalAddSeller, setModalAddSeller] = useState(false);
  const [attribute, setAttribute] = useState([]);
  const [productName, setProductName] = useState('');
  const [mainCategoryList, setMainCategoryList] = useState([]);
  const [catId, setCatId] = useState(null);
  const [sellerList, setSellerList] = useState([]);
  const [sellerId, setSellerId] = useState(null);
  const [color, setColor] = useState('black');
  const [numberOfProduct, setNumberOfProduct] = useState(1);
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [productId, setProductId] = useState(null);

  useEffect(() => {
    axios({
      url: '/',
      method: 'post',
      data: {
        query: `
               query($page: Int, $limit: Int, $productId: ID){
                getAllProduct (page: $page,limit: $limit,productId: $productId){
                    _id,
                    persianName,
                    englishName,
                    rate,
                    description,
                    original,
                    images {
                        _id,
                        name,
                        dir
                    },
                    category {
                        _id,
                        name
                    },
                    brand {
                        _id,
                        name
                    },
                    attribute {
                        _id
                        seller {
                            _id,
                            name
                        },
                        color,
                        stock,
                        price,
                        discount
                    },
                    details {
                        productSpecsDetails {
                            _id,
                            specs {
                                specs,
                                _id
                            },
                            name
                            label
                        },
                    value,
                    }
                }
            }`,
        variables: {
          "page": 1,
          "limit": 100,
          "productId": null
        },
      }
    }).then((response) => {
      if (response.data.errors) {
        toast.error('خطا در دریافت اطلاعات محصولات')
      }
      else {
        const { getAllProduct } = response.data.data
        setProducts(getAllProduct);
      }
    }).catch((er) => console.log(er));
  }, []);

  useEffect(() => {
    axios({
      url: '/',
      method: 'post',
      data: {
        query: `
                query getAllCategory($page: Int, $limit: Int,$mainCategory:Boolean, $parentCategory: Boolean, $catId:ID ) {
                    getAllCategory (input : {page: $page, limit: $limit, mainCategory:$mainCategory, parentCategory:$parentCategory, catId:$catId}) {
                        _id,
                        name
                    }
                }`,
        variables: {
          "page": 1,
          "limit": 100,
          "mainCategory": true,
          "parentCategory": false,
          "catId": null
        },
      }
    }).then((response) => {
      const { getAllCategory } = response.data.data;
      setMainCategoryList(getAllCategory);
    }).catch((er) => console.log(er));
  }, []);

  const toggleInfoSeller = (attribute, name) => {
    if (!modalInfoSeller) {
      setAttribute(attribute);
      setModalInfoSeller(true);
      setProductName(name)
    } else {
      setAttribute([]);
      setModalInfoSeller(false);
      setProductName('')
    }
  }

  const handleChangeColor = (event, index) => {
    const field = { ...attribute[index] };
    field.color = event.target.value;
    const newAttribute = [...attribute];
    newAttribute[index] = field;
    setAttribute(newAttribute);
  }

  const handleChangeStock = (event, index) => {
    const field = { ...attribute[index] };
    field.stock = event.target.value;
    const newAttribute = [...attribute];
    newAttribute[index] = field;
    setAttribute(newAttribute);
  }

  const handleChangePrice = (event, index) => {
    const field = { ...attribute[index] };
    field.price = event.target.value;
    const newAttribute = [...attribute];
    newAttribute[index] = field;
    setAttribute(newAttribute);
  }

  const handleChangeDiscount = (event, index) => {
    const field = { ...attribute[index] };
    field.discount = event.target.value;
    const newAttribute = [...attribute];
    newAttribute[index] = field;
    setAttribute(newAttribute);
  }

  const editSeller = () => {
    const tmpAttribute = [];
    attribute.map((item) => {
      tmpAttribute.push({
        _id: item._id,
        seller: item.seller._id,
        color: item.color,
        price: parseInt(item.price),
        discount: parseInt(item.discount),
        stock: parseInt(item.stock)
      })
    });
    axios({
      url: '/',
      method: 'post',
      data: {
        query: `
                mutation UpateProductAttribute($input: InputUpdateProductAttribute){
                    updateProductAttribute (input: $input) {
                        status,
                        message
                    }
                }`,
        variables: {
          "input": {
            "isAddSeller": false,
            "productId": "",
            "attribute": tmpAttribute
          }
        },
      }
    }).then((response) => {
      if (response.data.errors) {
        toast.error('خطا در ویرایش اطلاعات فروشندگان')
      }
      else {
        const { message } = response.data.data.updateProductAttribute;
        toast.success(message)
      }
    }).catch((er) => console.log(er));
  }

  const toggleAddSeller = (name, id) => {
    if (!modalAddSeller) {
      setProductName(name);
      setModalAddSeller(true);
      setProductId(id);
    } else {
      setProductName('');
      setModalAddSeller(false);
      setProductId('');
    }
  }

  const categoryHandler = (event) => {
    setCatId(event.target.value);
    axios({
      url: '/',
      method: 'post',
      data: {
        query: `
                query  getAllSeller($categoryId: ID!){
                    getAllSeller(categoryId: $categoryId) {
                        _id,
                        name,
                        label
                    }
                }`,
        variables: {
          "categoryId": event.target.value
        },
      }
    }).then((response) => {
      const { getAllSeller } = response.data.data;
      setSellerList(getAllSeller);
    }).catch((er) => console.log(er))
  }

  const sellerHandler = (event) => {
    setSellerId(event.target.value);
  }

  const colorHandler = (event) => {
    setColor(event.target.value);
  }

  const numberOfProductHandler = (event) => {
    setNumberOfProduct(event.target.value);
  }

  const priceHandler = (event) => {
    setPrice(event.target.value);
  }

  const discountHandler = (event) => {
    setDiscount(event.target.value);
  }

  const addSellerToProduct = () => {
    axios({
      url: '/',
      method: 'post',
      data: {
        query: `
                mutation UpateProductAttribute($input: InputUpdateProductAttribute){
                    updateProductAttribute (input: $input) {
                        status,
                        message
                    }
                }`,
        variables: {
          "input": {
            "isAddSeller": true,
            "productId": productId,
            "attribute": {
              "seller": sellerId,
              "color": color,
              "stock": parseInt(numberOfProduct),
              "price": parseInt(price),
              "discount": parseInt(discount)
            }
          }
        },
      }
    }).then((response) => {
      if (response.data.errors) {
        toast.error('خطا در ثبت اطلاعات فروشنده')
      }
      else {
        const { message } = response.data.data.updateProductAttribute;
        toast.success(message)
        setModalAddSeller(false)
      }
    }).catch((er) => console.log(er));
  }

  return (
    <>
      <CCard>
        <ToastContainer />
        <CCardHeader>
          <h6>محصولات</h6>
        </CCardHeader>
        <CCardBody>
          {
            products.length > 0 ?
              <CTable>
                <CTableHead>
                  <CTableRow color="light" className={classes.productDetalis}>
                    <CTableHeaderCell scope="col">نام محصول </CTableHeaderCell>
                    <CTableHeaderCell scope="col">عکس</CTableHeaderCell>
                    <CTableHeaderCell scope="col">برند</CTableHeaderCell>
                    <CTableHeaderCell scope="col">فروشندگان</CTableHeaderCell>
                    <CTableHeaderCell scope="col">امتیاز</CTableHeaderCell>
                    <CTableHeaderCell scope="col">عملیات</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {
                    products.map((item) => {
                      const link = `/products/product/${item._id}`;
                      const pictureLink = `/products/picture/${item._id}`;
                      return (

                        <CTableRow className={classes.productDetalis} key={item._id} >
                          <CTableDataCell>
                            <p>{item.persianName}</p>
                            <p>{item.englishName}</p>
                          </CTableDataCell>
                          <CTableDataCell>
                            <img src={require(`${process.env.REACT_APP_PUBLIC_URL}${item.original}`)} alt={item.image} />
                          </CTableDataCell>
                          <CTableDataCell>{item.brand.name}</CTableDataCell>
                          <CTableDataCell>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                              <CButton color="info" size="sm" onClick={() => toggleInfoSeller(item.attribute, item.persianName)}>
                                <FaEye className={classes.plusIcon} />
                              </CButton>
                              <CButton color="danger" size="sm" onClick={() => toggleAddSeller(item.persianName, item._id)} >
                                <FaPlus className={classes.plusIcon} />
                              </CButton>
                            </div>
                          </CTableDataCell>
                          <CTableDataCell>
                            {item.rate ? item.rate : 0}
                          </CTableDataCell>
                          <CTableDataCell >
                            <div style={{ display: "flex", flexDirection: "row" }}>
                              <CButton color="info" size="sm" className={classes.operation}>
                                <NavLink to={link} ><FaEdit className={classes.plusIcon} /></NavLink>
                              </CButton>
                              <CButton color="warning" size="sm" className={classes.operation}>
                                <NavLink to={pictureLink} ><FaFileImage className={classes.plusIcon} /></NavLink>
                              </CButton>
                              <CButton color="danger" size="sm" className={classes.operation}>
                                <BsTrashFill className={classes.plusIcon} />
                              </CButton>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      )
                    })
                  }
                </CTableBody>
              </CTable>
              :

              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
          }

        </CCardBody>
      </CCard>
      {
        modalInfoSeller && (
          <ProductSellers
            modal={modalInfoSeller}
            toggleInfoSeller={toggleInfoSeller}
            attribute={attribute}
            productName={productName}
            handleChangeColor={handleChangeColor}
            handleChangeStock={handleChangeStock}
            handleChangePrice={handleChangePrice}
            handleChangeDiscount={handleChangeDiscount}
            editSeller={editSeller}
          />
        )
      }
      {
        modalAddSeller && (
          <AddSeller
            modal={modalAddSeller}
            toggleAddSeller={toggleAddSeller}
            productName={productName}
            categories={mainCategoryList}
            categoryHandler={categoryHandler}
            sellers={sellerList}
            sellerHandler={sellerHandler}
            color={color}
            colorHandler={colorHandler}
            numberOfProduct={numberOfProduct}
            numberOfProductHandler={numberOfProductHandler}
            price={price}
            priceHandler={priceHandler}
            discount={discount}
            discountHandler={discountHandler}
            addSellerToProduct={addSellerToProduct}
          />
        )
      }
    </>
  )
}

export default Products;
