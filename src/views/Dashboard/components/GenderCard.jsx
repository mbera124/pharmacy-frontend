import React, { useEffect, useState } from 'react';
import { hrDashboard } from '../../../_services';
import { Card } from 'antd';
import './assets/css/Index.css';
import ManImage from './assets/images/man.png';
import Woman from './assets/images/woman.png';
import Other from './assets/images/que.png';
import TotalEmployees from './assets/images/allemployees.png';

const GenderCard = () => {
  const [employeesData, setEmployeesData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    getEmployeesCount();
  }, []);

  const getEmployeesCount = (params) => {
    setLoading(true);
    hrDashboard
      .fetchTotalEmployees(params)
      .then((resp) => {
        let content = resp?.data || [];
        setEmployeesData(content);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
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
        <Card className='sidecards' bodyStyle={{ padding: '0px' }}>
          <div className='total_employees_icon'>
            {' '}
            <div className='total_employees_img-class'>
              <img src={TotalEmployees} id='total_employees_img-id' alt='' />
            </div>
          </div>
          <div className='total_employees_card_body'>
            {' '}
            <span style={{ fontSize: '20px' }}>Total Employees</span> <br></br>
            <span style={{ fontSize: '20px' }}>
              {employeesData?.total_employees}
            </span>{' '}
          </div>
        </Card>
        <Card className='sidecards' bodyStyle={{ padding: '0px' }}>
          <div className='men_icon'>
            {' '}
            <div className='img-class'>
              <img src={ManImage} id='img-id' alt='' />
            </div>
          </div>
          <div className='men_card_body'>
            {' '}
            <span style={{ fontSize: '20px' }}>Total men</span> <br></br>
            <span style={{ fontSize: '20px' }}>
              {employeesData?.male_count}
            </span>{' '}
          </div>
        </Card>
        <Card className='sidecards' bodyStyle={{ padding: '0px' }}>
          <div className='women_icon'>
            {' '}
            <div className='img-class'>
              <img src={Woman} id='img-id' alt='' />
            </div>
          </div>
          <div className='women_card_body'>
            {' '}
            <span style={{ fontSize: '20px' }}>Total Women</span> <br></br>
            <span style={{ fontSize: '20px' }}>
              {employeesData?.female_count}
            </span>{' '}
          </div>
        </Card>
        <Card className='sidecards' bodyStyle={{ padding: '0px' }}>
          <div className='others_icon'>
            {' '}
            <div className='img-class'>
              <img src={Other} id='img-id' alt='' />
            </div>
          </div>
          <div className='others_card_body'>
            {' '}
            <span style={{ fontSize: '20px' }}>Others </span> <br></br>
            <span style={{ fontSize: '20px' }}>
              {employeesData?.other_count}
            </span>{' '}
          </div>
        </Card>
      </Card>
    </div>
  );
};

export default GenderCard;
