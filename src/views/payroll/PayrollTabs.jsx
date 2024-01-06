import React, { useEffect, useState } from 'react';
import { Card, Tabs } from 'antd';
import SalaryProcessing from './components/SalaryProcessing'
import SalaryPosting from './components/SalaryPosting'
import WrappedEmployeeLookUpForm from './components/EmployeePayrollItems'
import Payslip from './components/PaySlip'


const PayRollTabs = (props) => {
 const [activeTab, setKey] = useState('leavedays');

 const changeTab = (activeKey) => {
   setKey(activeKey);
 };

 const items = [
   {
     key: 'emp_payroll_items',
     label: 'Employee Payroll Items',
     children: <WrappedEmployeeLookUpForm activeTab={activeTab} />,
   },
   {
     key: 'salary_processiong',
     label: 'Salary Processing',
     children: <SalaryProcessing activeTab={activeTab} />,
   },
   {
     key: 'salary_posting',
     label: 'Salary Posting',
     children: <SalaryPosting activeTab={activeTab} />,
   },
   {
     key: 'payslip',
     label: 'Payslip',
     children: <Payslip activeTab={activeTab} />,
   },
 ];

 return (
   <div id='content'>
     <Card>
       <Tabs type='card' onChange={changeTab} items={items}></Tabs>
     </Card>
   </div>
 );
};

export default PayRollTabs;
