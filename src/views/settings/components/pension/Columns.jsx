import React from 'react';
import { Tag } from 'antd';
export const pensionColumns = [
    {
        title: 'Pension Name',
        dataIndex: 'pension_name',
        key: 'pension_name',
    },
    {
        title: 'Payroll Item',
        dataIndex: 'payroll_item_name',
        key: 'payroll_item_name',
    },
    {
        title: 'Calculation Type',
        dataIndex: 'calculation_type',
        key: 'calculation_type',
        render: (text) => <Tag color='blue'>{text}</Tag>
    },
    {
        title: 'Calculation Value',
        dataIndex: 'calculation_value',
        key: 'calculation_value',
    }
];