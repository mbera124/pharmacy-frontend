import { Tag } from "antd";
import React from "react";

export const nssfTierColumns = [
  {
    title: 'Tier Name',
    key: 'tier_name',
    dataIndex: 'tier_name',
  },
  {
    title: 'Pension Name',
    key: 'pension_name',
    dataIndex: 'pension_name',
  },
  {
    title: 'Limit',
    key: 'tier_limit',
    dataIndex: 'tier_limit',
  },
  {
    title: 'Calculation Type',
    key: 'calculation_type',
    dataIndex: 'calculation_type',
    render: (text) => (
      <Tag color={text === 'RATE' ? 'blue' : 'green'}>
        {text === 'RATE' ? 'Rate' : 'Fixed'}
      </Tag>
    ),
  },
  {
    title: 'Limit Deduction',
    key: 'deduction',
    dataIndex: 'deduction',
  },
  {
    title: 'Maximum Deduction',
    key: 'max_deduction',
    dataIndex: 'max_deduction',
  },
];