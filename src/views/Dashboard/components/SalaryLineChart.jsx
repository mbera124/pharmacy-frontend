import { Card, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import { hrDashboard, hrCodesService } from '../../../_services';
import { Line } from '@ant-design/charts';
import './assets/css/Index.css';
import { defaultMonths } from './months';

const SalaryLineChart = (props) => {
  const [searchParams, setSearchParams] = useState({});
  const { Option } = Select;
  const [department, setDepartment] = useState([]);
  const [salaryData, setSalaryData] = useState(defaultMonths);

  useEffect(() => {
    getDepartments();
  }, []);
  useEffect(() => {
    getSalariesByDepartment(searchParams);
  }, [searchParams]);

  const getDepartments = (params) => {
    let departmentParams = { codeName: 'DEPARTMENT', isActive: true };
    hrCodesService
      .fetchCodes(departmentParams)
      .then((resp) => {
        let content = resp.data?.content || [];
        setDepartment(content);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const getSalariesByDepartment = (params) => {
    hrDashboard
      .fetchSalariesByDepartment(params)
      .then((resp) => {
        let content = resp?.data || [];

        if (content.length > 0) {
          setSalaryData(formatSalaryData(content));
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const formatString = (val) => {
    let newVal;
    if (val) {
      val = val.toLocaleLowerCase();
      newVal = val.charAt(0).toUpperCase() + val.slice(1);
      newVal = newVal.replaceAll('_', ' ');
    }
    return newVal;
  };

  const formatSalaryData = (data) => {
    let formatedSalaryData = data.flatMap((obj) =>
      obj.department_totals_list.map((arr) => {
        const container = {};
        container[arr.department_name] = arr.department_name;
        return { month: formatString(obj.month), ...arr };
      })
    );

    return formatedSalaryData;
  };

  const config = {
    data: salaryData,
    xField: 'month',
    yField: 'total_salary',
    seriesField: 'department_name',
    legend: {
      position: 'top',
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 5000,
      },
    },
    xAxis: {
      label: {
        style: {
          fill: '##000000',
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fill: '##000000',
        },
      },
    },
  };

  const handleSearchByDepartment = (value) => {
    let params;

    if (value) {
      params = {
        department: value,
      };
    } else {
      params = {
        department: null,
      };
    }

    setSearchParams({ ...params });
  };

  return (
    <div>
      <Card
        style={{
          boxShadow: '3px 3px 5px -2px rgba(0,0,0,0.4)',

          margin: 0,
        }}
      >
        <div className='d-flex justify-content-between'>
          <div
            style={{ textAlign: 'left', fontSize: '15px', fontWeight: '700' }}
          >
            <span>
              <i
                className='fa fa-money'
                style={{ color: '#33D457' }}
                aria-hidden='true'
              ></i>{' '}
               Salaries By Departments
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Select
              showSearch
              showArrow={false}
              allowClear
              onChange={handleSearchByDepartment}
              placeholder='Search Department'
              style={{ width: '180px' }}
              optionFilterProp='children'
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {department &&
                department.map((department, index) => (
                  <Option key={index} value={department.code_id}>
                    {formatString(department.code_value)}
                  </Option>
                ))}
            </Select>
          </div>
        </div>

        <Line {...config} />
      </Card>
    </div>
  );
};

export default SalaryLineChart;
