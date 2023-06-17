import React, { useState } from 'react';
import {
    CCol,
    CDropdown,
    CDropdownMenu,
    CDropdownItem,
    CDropdownToggle,
    CWidgetStatsA,
} from '@coreui/react';
import { CChartLine } from '@coreui/react-chartjs';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilOptions } from '@coreui/icons';


const NumberOrders = () => {

    const [chartData, setChartData] = useState({
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'سفارش',
                backgroundColor: 'rgba(255,255,255,.2)',
                borderColor: 'rgba(255,255,255,.55)',
                data: [78, 81, 80, 45, 34, 12, 40],
                fill: true,
            }
        ]
    })

    return (
        <CCol xs="12" sm="6" lg="4">
            <CWidgetStatsA
                className="mb-4"
                color="warning"
                value={
                    <>
                        2.49{' '}
                        <span className="fs-6 fw-normal">
                            (84.7% <CIcon icon={cilArrowTop} />)
                        </span>
                    </>
                }
                title="تعداد سفارشات"
                action={
                    <CDropdown alignment="end">
                        <CDropdownToggle color="transparent" caret={false} className="p-0">
                            <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
                        </CDropdownToggle>
                        <CDropdownMenu>
                            <CDropdownItem>Action</CDropdownItem>
                            <CDropdownItem>Another action</CDropdownItem>
                            <CDropdownItem>Something else here...</CDropdownItem>
                            <CDropdownItem disabled>Disabled action</CDropdownItem>
                        </CDropdownMenu>
                    </CDropdown>
                }
                chart={
                    <CChartLine
                        className="mt-3"
                        style={{ height: '70px' }}
                        data={chartData}
                        options={{
                            plugins: {
                                legend: {
                                    display: false,
                                },
                            },
                            maintainAspectRatio: false,
                            scales: {
                                x: {
                                    display: false,
                                },
                                y: {
                                    display: false,
                                },
                            },
                            elements: {
                                line: {
                                    borderWidth: 2,
                                    tension: 0.4,
                                },
                                point: {
                                    radius: 0,
                                    hitRadius: 10,
                                    hoverRadius: 4,
                                },
                            },
                        }}
                    />
                }
            />
        </CCol>
    )
}

export default NumberOrders;