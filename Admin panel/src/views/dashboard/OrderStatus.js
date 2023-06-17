import React, { useEffect, useState } from 'react';
import {
    CCol,
    CRow,
    CCardBody,
    CCard,
    CCardHeader,
    CCardFooter
} from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify';
import { Spinner } from 'src/components/Spinner';
import { CChart } from '@coreui/react-chartjs';
import axios from 'axios';

const OrdersStatus = () => {

    const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#d34836',
                    '#72cb93',
                    '#2f353a',
                    '#e4e5e6',
                    '#000000'
                ]
            },
        ]
    });

    useEffect(() => {
        axios({
            url: '/',
            method: 'post',
            data: {
                query: `
               query getAllOrderStatus  {
                    getAllOrderStatus {
                        name,
                    }
                }`,
            }
        }).then((response) => {
            if (response.data.errors) {
                toast.error('خطا در دریافت لیست وضعیت سفارشات')
            }
            else {
                const { getAllOrderStatus } = response.data.data;
                const statusData = { ...chartData }
                getAllOrderStatus.map(item => {
                    statusData.labels.push(item.name)
                    statusData.datasets[0].data.push(random(1, 10))
                });
                setChartData(statusData)
            }
        }).catch((er) => console.log(er));
    }, []);

    return (
        <CCol xs="5" sm="5" lg="5">
            <ToastContainer />
            <CCard>
                <CCardHeader>
                    وضعیت سفارشات
                </CCardHeader>
                {
                    chartData.labels.length > 0 ?
                        <>
                            <CCardBody style={{ height: 500 }}>
                                <CChart
                                    type="doughnut"
                                    data={chartData}
                                />
                            </CCardBody>
                        </>
                        :
                        <Spinner />
                }
            </CCard>
        </CCol>
    )
}

export default OrdersStatus;