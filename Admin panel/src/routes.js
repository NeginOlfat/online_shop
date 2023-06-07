import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const AddMedia = React.lazy(() => import('./views/media/AddMedia'));
const AllMedia = React.lazy(() => import('./views/media/AllMedia'));
const Category = React.lazy(() => import('./views/shop/Category'));
const Brand = React.lazy(() => import('./views/shop/Brand'));
const Scoring = React.lazy(() => import('./views/shop/Scoring'));
const Specifications = React.lazy(() => import('./views/shop/Specifications'));
const SubSpecifications = React.lazy(() => import('./views/shop/SubSpecifications'));
const Seller = React.lazy(() => import('./views/products/Seller'));
const AddProduct = React.lazy(() => import('./views/products/AddProduct'));
const Products = React.lazy(() => import('./views/products/Products'));
const EditProduct = React.lazy(() => import('./views/products/EditProduct'));
const ProductPictures = React.lazy(() => import('./views/products/ProductPictures'));
const Status = React.lazy(() => import('./views/orders/Status'));
const Orders = React.lazy(() => import('./views/orders/Orders'));
const OrderDetails = React.lazy(() => import('./views/orders/OrderDetails'));
const Users = React.lazy(() => import('./views/users/Users'));
const User = React.lazy(() => import('./views/users/User'));
const Comments = React.lazy(() => import('./views/users/Comments'));
const CommentInfo = React.lazy(() => import('./views/users/CommentInfo'));
const Favorites = React.lazy(() => import('./views/users/Favorites'));
const UserOrders = React.lazy(() => import('./views/users/UserOrders'));

const routes = [
  { path: '/', exact: true, name: 'صفحه اصلی' },
  { path: '/dashboard', exact: true, name: 'داشبورد', element: Dashboard },
  { path: '/media/AddMedia', name: 'اضافه کردن پرونده چند رسانه ای', element: AddMedia },
  { path: '/media/AllMedia', name: 'کتابخانه پرونده های چند رسانه ای', element: AllMedia },
  { path: '/shop/Category', name: 'دسته بندی', element: Category },
  { path: '/shop/Brand', name: 'برند ها', element: Brand },
  { path: '/shop/Scoring', name: ' معیارهای امتیاز دهی', element: Scoring },
  { path: '/shop/Specifications', name: 'مشخصات', element: Specifications },
  { path: '/shop/SubSpecifications', name: 'ریز مشخصات', element: SubSpecifications },
  { path: '/products/Seller', name: 'فروشندگان', element: Seller },
  { path: '/products/AddProduct', name: 'اضافه کردن محصول', element: AddProduct },
  { path: '/products/Products', name: ' محصولات', element: Products },
  { path: '/products/product/:productid', exact: true, name: 'ویرایش اطاعات محصول', element: EditProduct },
  { path: '/products/picture/:productid', exact: true, name: 'عکس های محصول', element: ProductPictures },
  { path: '/orders/Status', exact: true, name: ' وضعیت سفارشات ', element: Status },
  { path: '/orders/Orders', exact: true, name: ' سفارشات ', element: Orders },
  { path: '/orders/detail/:orderid', exact: true, name: ' جزئیات سفارش ', element: OrderDetails },
  { path: '/users/Users', exact: true, name: ' کاربران ', element: Users },
  { path: '/users/userinfo/:id', exact: true, name: ' مشخصات کاربران ', element: User },
  { path: '/users/comments/:id', exact: true, name: ' نظرات کاربر ', element: Comments },
  { path: '/commentDetails/:id', exact: true, name: ' جزئیات نظرات کاربر ', element: CommentInfo },
  { path: '/users/favorites/:id', exact: true, name: ' لیست مورد علاقه  ', element: Favorites },
  { path: '/users/userOrders/:id', exact: true, name: ' سفارشات کاربر ', element: UserOrders }
]


export default routes
