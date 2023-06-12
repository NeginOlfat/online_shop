import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

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
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
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
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
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
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
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
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
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
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
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
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
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
