import { Card } from 'antd';
import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/charts';
import { hrDashboard } from '../../../_services';
import './assets/css/Index.css';

const SalaryByDeductions = (props) => {
  const [employeeData, setEmployeesData] = useState([]);

  useEffect(() => {
    getEmployeesCountByDeductions();
  }, []);

  const getEmployeesCountByDeductions = (params) => {
    hrDashboard
      .fetchTotalEmployeesByDeductions(params)
      .then((resp) => {
        let content = resp?.data || [];

        if (content.length > 0) {
          setEmployeesData(content);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div>
      <Card
        style={{
          boxShadow: '3px 3px 5px -2px rgba(0,0,0,0.4)',
          margin: 0,
          padding: '60px !important',
        }}
      >
        <div className='d-flex justify-content-between'>
          <div
            style={{ textAlign: 'left', fontSize: '15px', fontWeight: '700' }}
          >
            <span>
              <i
                className='fa fa-minus-square-o'
                style={{ color: '#33D457' }}
                aria-hidden='true'
              ></i>{' '}
             Employees Count By Deductions
            </span>
          </div>
        </div>

        <Column
          data={employeeData}
          xField='deduction_name'
          yField='deduction_count'
          meta={{
            deduction_count: {
              alias: 'Employees',
            },
            deduction_name: {
              alias: 'Deduction name',
            },
          }}
          xAxis={{
            label: {
              autoHide: true,
              autoRotate: false,
              style: {
                fill: '#000000',
              },
            },
          }}
          yAxis={{
            label: {
              style: {
                fill: '#000000',
              },
            },
          }}
        />
      </Card>
    </div>
  );
};

export default SalaryByDeductions;
