import React, { useState, useEffect } from 'react';
import { hrDashboard } from '../../../_services';
import { Card } from 'antd';
import { Column } from '@ant-design/charts';

const JobCountAreaChart = () => {
  const [jobCount, setJobCount] = useState([]);
  useEffect(() => {
    getJobCount();
  }, []);

  const getJobCount = (params) => {
    hrDashboard
      .fetchEmployeesByJobCategory(params)
      .then((resp) => {
        let content = resp?.data || [];
        if (content.length > 0) {
          let payload = content.map((item, index) => {
            return {
              job_category: item?.job_category,
              Jobs: item?.job_category_count,
            };
          });

          setJobCount(payload);
        } else {
          setJobCount([]);
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
        <div className=' mb-3 d-flex justify-content-between'>
          <div
            style={{ textAlign: 'left', fontSize: '15px', fontWeight: '700' }}
          >
            <span>
              <i
                className='fa fa-users'
                style={{ color: '#33D457' }}
                aria-hidden='true'
              ></i>{' '}
              Employee Count By Job Category
            </span>
          </div>
        </div>
        <Column
          autoFit={true}
          data={jobCount}
          xField='job_category'
          yField='Jobs'
          meta={{
            Jobs: {
              alias: 'Employees',
            },
            job_category: {
              alias: 'Job category',
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

export default JobCountAreaChart;
