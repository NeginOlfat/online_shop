import React, { useState } from 'react';
import {
    CCol,
    CDropdown,
    CDropdownMenu,
    CDropdownItem,
    CDropdownToggle,
    CWidgetStatsA,
} from '@coreui/react';
import { CChartBar } from '@coreui/react-chartjs';
import CIcon from '@coreui/icons-react';
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons';


const NumberUsers = () => {

    const [chartData, setChartData] = useState({
        labels: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
            'January',
            'February',
            'March',
            'April',
        ],
        datasets: [
            {
                label: 'کاربر',
                backgroundColor: 'rgba(255,255,255,.2)',
                borderColor: 'rgba(255,255,255,.55)',
                data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
                barPercentage: 0.6,
            }
        ]
    })

    return (
        <CCol xs="12" sm="6" lg="4">
            <CWidgetStatsA
                className="mb-4"
                color="danger"
                value={
                    <>
                        44K{' '}
                        <span className="fs-6 fw-normal">
                            (-23.6% <CIcon icon={cilArrowBottom} />)
                        </span>
                    </>
                }
                title="تعداد کاربران"
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
                    <CChartBar
                        className="mt-3 mx-3"
                        style={{ height: '70px' }}
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
                                        display: false,
                                        drawTicks: false,
                                    },
                                    ticks: {
                                        display: false,
                                    },
                                },
                                y: {
                                    grid: {
                                        display: false,
                                        drawBorder: false,
                                        drawTicks: false,
                                    },
                                    ticks: {
                                        display: false,
                                    },
                                },
                            },
                        }}
                    />
                }
            />
        </CCol>
    )
}

export default NumberUsers;