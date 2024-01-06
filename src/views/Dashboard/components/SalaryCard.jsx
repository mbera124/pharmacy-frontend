import React, { useState, useEffect } from 'react';
import { hrDashboard } from '../../../_services';
import { Card } from 'antd';
import './assets/css/Index.css';
import TotalSalary from './assets/images/totalsalary.png';
import AverageSalary from './assets/images/avgsalary.png';

const SalaryCard = () => {
  const [salary, setSalary] = useState([]);
  useEffect(() => {
    getTotalSalary();
  }, []);

  const getTotalSalary = (params) => {
    hrDashboard
      .fetchTotalandAverageSalaries(params)
      .then((resp) => {
        let content = resp?.data || [];
        setSalary(content);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div>
      <Card
        bodyStyle={{ padding: '7px' }}
        style={{
          height: '480px',
          padding: '12px !important',
        }}
      >
        <Card
          className='salarycards'
          bodyStyle={{
            padding: '0px',
            height: '160px',
          }}
        >
          <div className='salary_icon'>
            {' '}
            <div className='salary_img-class'>
              <img src={TotalSalary} id='salary_img-id' alt='' />
            </div>
          </div>
          <div className='salary_card_body'>
            {' '}
            <span style={{ fontSize: '20px' }}>Total Salary</span> <br></br>
            <span style={{ fontSize: '20px' }}>
              {salary?.total_salaries}
            </span>{' '}
          </div>
        </Card>
        <Card
          className='salarycards'
          bodyStyle={{
            padding: '0px',

            height: '160px',
          }}
        >
          <div className='salary_icon'>
            {' '}
            <div className='salary_img-class'>
              <img src={AverageSalary} id='salary_img-id' alt='' />
            </div>
          </div>
          <div className='salary_card_body'>
            {' '}
            <span style={{ fontSize: '20px' }}>Average Salary</span> <br></br>
            <span style={{ fontSize: '20px' }}>
              {salary?.average_salaries}
            </span>{' '}
          </div>
        </Card>
      </Card>
    </div>
  );
};

export default SalaryCard;
