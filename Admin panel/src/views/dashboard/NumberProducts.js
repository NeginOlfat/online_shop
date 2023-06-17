import React, { useState } from 'react';
import {
    CCol,
    CDropdown,
    CDropdownMenu,
    CDropdownItem,
    CDropdownToggle,
    CWidgetStatsA,
} from '@coreui/react';
import { getStyle } from '@coreui/utils';
import { CChartLine } from '@coreui/react-chartjs';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilOptions } from '@coreui/icons';


const NumberProducts = () => {

    const [chartData, setChartData] = useState({
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'محصول',
                backgroundColor: 'transparent',
                borderColor: 'rgba(255,255,255,.55)',
                pointBackgroundColor: getStyle('--cui-info'),
                data: [1, 18, 9, 17, 34, 22, 11],
            }
        ]
    })

    return (
        <CCol xs="12" sm="6" lg="4">
            <CWidgetStatsA
                className="mb-4"
                color="info"
                value={
                    <>
                        $6.200{' '}
                        <span className="fs-6 fw-normal">
                            (40.9% <CIcon icon={cilArrowTop} />)
                        </span>
                    </>
                }
                title="تعداد محصولات"
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
                        className="mt-3 mx-3"
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
                                    grid: {
                                        display: false,
                                        drawBorder: false,
                                    },
                                    ticks: {
                                        display: false,
                                    },
                                },
                                y: {
                                    min: -9,
                                    max: 39,
                                    display: false,
                                    grid: {
                                        display: false,
                                    },
                                    ticks: {
                                        display: false,
                                    },
                                },
                            },
                            elements: {
                                line: {
                                    borderWidth: 1,
                                },
                                point: {
                                    radius: 4,
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

export default NumberProducts;