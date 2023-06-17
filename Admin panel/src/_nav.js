import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilCart,
  cilBlurLinear,
  cilLibrary,
  cilMoney,
  cilGroup,
  cilPencil,
  cilSatelite,
  cilSpeedometer,
} from '@coreui/icons';
import { CNavGroup, CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'داشبورد',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'اسلایدر',
    to: '/slider',
    icon: <CIcon icon={cilSatelite} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'نظرات',
    to: '/comments',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'رسانه',
    to: '/media',
    icon: <CIcon icon={cilLibrary} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'کتابخانه',
        to: '/media/AllMedia',
      },
      {
        component: CNavItem,
        name: 'افزودن',
        to: '/media/AddMedia',
      }
    ]
  },
  {
    component: CNavGroup,
    name: 'امور فروشگاه',
    to: '/shop',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'دسته بندی',
        to: '/shop/Category',
      },
      {
        component: CNavItem,
        name: 'برند ها',
        to: '/shop/Brand',
      },
      {
        component: CNavItem,
        name: 'معیارهای امتیاز دهی ',
        to: '/shop/Scoring',
      },
      {
        component: CNavItem,
        name: 'مشخصات',
        to: '/shop/Specifications',
      },
      {
        component: CNavItem,
        name: 'ریز مشخصات',
        to: '/shop/SubSpecifications',
      }
    ]
  },
  {
    component: CNavGroup,
    name: 'محصولات',
    to: '/products',
    icon: <CIcon icon={cilBlurLinear} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'فروشندگان ',
        to: '/products/Seller',
      },
      {
        component: CNavItem,
        name: 'اضافه کردن محصول ',
        to: '/products/AddProduct',
      },
      {
        component: CNavItem,
        name: 'لیست محصولات',
        to: '/products/Products',
      },
    ]
  },
  {
    component: CNavGroup,
    name: 'سفارشات',
    to: '/orders',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'سفارشات',
        to: '/orders/Orders',
      },
      {
        component: CNavItem,
        name: 'وضعیت سفارشات',
        to: '/orders/Status',
      },
    ]
  },
  {
    component: CNavGroup,
    name: 'امور کاربران',
    to: '/users',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'کاربران',
        to: '/users/Users',
      },
    ]
  },
]

export default _nav
