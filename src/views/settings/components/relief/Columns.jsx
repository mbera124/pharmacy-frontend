import React from 'react';
import { Tag } from 'antd';
export const reliefColumns = [
    {
        title: 'Relief Name',
        dataIndex: 'relief_name',
        key: 'relief_name',
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
        render: (text) => <Tag color={text === "RATE" ? 'blue' : 'green'}>{text}</Tag>
    },
    {
         title: 'Calculation Value',
        dataIndex: 'calculation_value',
        key: 'calculation_value',
    }
];