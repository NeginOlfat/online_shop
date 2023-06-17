import React, { useEffect, useState } from 'react';
import {
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CRow,
} from '@coreui/react';
import { CChartLine } from '@coreui/react-chartjs';
import { getStyle, hexToRgba } from '@coreui/utils';
import { Spinner } from 'src/components/Spinner';
import classes from './dashboard.module.css'


const NumberPayment = () => {

    const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

    const [countallPay, setCountallPay] = useState(0);
    const [chartData, setChartData] = useState({
        labels: ['16', '17', '18', '19', '20', '21', '22'],
        datasets: [
            {
                label: 'پرداختی',
                backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
                borderColor: getStyle('--cui-info'),
                pointHoverBackgroundColor: getStyle('--cui-info'),
                borderWidth: 2,
                data: [
                    random(10, 200),
                    random(10, 200),
                    random(10, 200),
                    random(10, 200),
                    random(10, 200),
                    random(10, 200),
                    random(10, 200),
                ],
                fill: true,
            }
        ]
    });

    useEffect(() => {
        let sum = 0;
        for (let i = 0; i < chartData.datasets[0].data.length; i++) {
            sum += chartData.datasets[0].data[i];
        }
        setCountallPay(sum)
    }, [chartData])

    return (
        <CCol xs="6" sm="6" lg="6">
            <CCard>
                <CCardHeader>
                    تعداد پرداختی های 10 روز گذشته
                </CCardHeader>
                {
                    chartData.labels.length > 0 ?
                        <>
                            <CCardBody>
                                <CChartLine
                                    style={{ height: '300px', marginTop: '40px' }}
                                    data={chartData}
                                    options={{
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                display: false,
                                            },
                                        },
                                        scales: {
                                            x: {
                                                grid: {
                                                    drawOnChartArea: false,
                                                },
                                            },
                                            y: {
                                                ticks: {
                                                    beginAtZero: true,
                                                    maxTicksLimit: 5,
                                                    stepSize: Math.ceil(250 / 5),
                                                    max: 250,
                                                },
                                            },
                                        },
                                        elements: {
                                            line: {
                                                tension: 0.4,
                                            },
                                            point: {
                                                radius: 0,
                                                hitRadius: 10,
                                                hoverRadius: 4,
                                                hoverBorderWidth: 3,
                                            },
                                        },
                                    }}
                                />
                            </CCardBody>
                            <CCardFooter>
                                <CRow>
                                    <CCol xs="4" className={classes.show_info_line_chart}>
                                        <span>دریافتی امروز :</span>
                                        <span>{random(1000, 100000)} تومان</span>
                                    </CCol>
                                    <CCol xs="4" className={classes.show_info_line_chart}>
                                        <span> تعداد پرداختی ها : </span>
                                        <span>{countallPay} </span>
                                    </CCol>
                                    <CCol xs="4" className={classes.show_info_line_chart} style={{ border: '0' }}>
                                        <span>دریافتی کل : </span>
                                        <span>{random(1000, 1000000)} تومان</span>
                                    </CCol>
                                </CRow>
                            </CCardFooter>
                        </>
                        :
                        <Spinner />
                }
            </CCard>
        </CCol>
    )
}

export default NumberPayment;