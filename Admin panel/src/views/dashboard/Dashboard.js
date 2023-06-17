import React, { useEffect, useContext, Suspense } from 'react';
import { CRow } from '@coreui/react';
import { Spinner } from 'src/components/Spinner';
import NumberUsers from './NumberUsers';
import NumberOrders from './NumberOrders';
import NumberProducts from './NumberProducts';
import NumberPayment from './NumberPayment';
import OrdersStatus from './OrderStatus';
import GenderStatus from './GenderStatus';


const Dashboard = () => {

  return (
    <>
      <CRow>
        <Suspense fallback={<Spinner />}>
          <NumberUsers />
        </Suspense>
        <Suspense fallback={<Spinner />}>
          <NumberOrders />
        </Suspense>
        <Suspense fallback={<Spinner />}>
          <NumberProducts />
        </Suspense>
      </CRow>
      <CRow>
        <Suspense fallback={<Spinner />}>
          <NumberPayment />
        </Suspense>
        <Suspense fallback={<Spinner />}>
          <OrdersStatus />
        </Suspense>
      </CRow>
      <Suspense fallback={<Spinner />}>
        <GenderStatus />
      </Suspense>
    </>
  )
}

export default Dashboard
