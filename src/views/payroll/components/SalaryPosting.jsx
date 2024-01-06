import React, { useState, useEffect } from 'react';

import {
  Card,
  Table,
  Row,
  Col,
  Button,
  Select,
  notification,
  Descriptions,
} from 'antd';
import { hrSalary } from '../../../_services';
import { EmployeeSearch } from '../../hr-reusables/EmployeeSearch';
import moment from 'moment';
import { monthNames } from '../../hr-reusables/PeriodFilters/months';
import WrappedPostSalaryForm from './PostSalary';
import { AiOutlineArrowLeft } from 'react-icons/ai';
const monthFormat = 'M';
const yearFormat = 'YYYY';
const { Option } = Select;

const SalaryPosting = (props) => {
  const defMonth = moment().format(monthFormat);
  const defYear = moment().format(yearFormat);
  const [postedData, setPostedData] = useState([]);
  const [total_elements, setTotalElements] = useState(10);
  const [page, setPage] = useState({ page: 1, pageSize: 20 });
  const [month, setMonth] = useState(defMonth);
  const [year, setYear] = useState(defYear);
  const [showSalaryPosting, setShowSalaryPosting] = useState(false);
  const [staffNumber, setStaffNumber] = useState(null);
  const [employeeName, setEmployeeName] = useState(null);
  const [currentMonthName, setDefaultMonth] = useState(null);
  const [postingYears, setPostingYears] = useState([]);
  const [idNumber, setIdNumber] = useState(null);
  const [primaryContact, setPrimaryContact] = useState(null);
  const [email, setEmail] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [department, setDepartment] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    var newArray = monthNames.filter(function (m) {
      return m.id === defMonth;
    });
    let currentMonthName = newArray[0].name;
    let monthId = newArray[0].id;
    setDefaultMonth(currentMonthName);
    setMonth(monthId);
  }, [defMonth]);

  useEffect(() => {
    hrSalary.getAllProcessedSlaries().then((response) => {
      let data = response.data?.content || [];
      if (data.length !== 0) {
        let years = data.map((a) => a.year_processed);
        // sort the years array in ascending order
        years.sort();
        // Loop through years array and get unique years
        var uniqueArray = [];

        for (var value of years) {
          if (uniqueArray.indexOf(value) === -1) {
            uniqueArray.push(value);
          }
        }

        let currentYear = parseInt(defYear);
        // check if salary posting years includes current year
        let processedYears = uniqueArray.includes(currentYear);
        if (processedYears === false) {
          let finalYear = [...uniqueArray, currentYear];
          setPostingYears(finalYear);
        } else {
          setPostingYears(uniqueArray);
        }
      }
    });
  }, [defYear]);

  const handleEmployee = (employee) => {
    let employeeData = employee ? employee : null;

    setEmployeeName(employeeData?.full_name || null);
    setStaffNumber(employeeData?.staff_number || null);
    setIdNumber(employeeData?.id_number || null);
    setPrimaryContact(employeeData?.phone_number || null);
    setEmail(employeeData?.email_address || null);
    // setDateOfBirth(employeeData)
    setDepartment(employeeData?.department || null);
    setRole(employeeData?.specialization || null);
    if (employeeData?.staff_number != null) {
      let params = {
        month: month,
        staffNumber: employeeData?.staff_number,
        year: year,
        employeeName: employeeData?.full_name,
      };
      fetchPostedSalaries(params);
    }
  };

  const fetchPostedSalaries = (params) => {
    let selectedMonth = params.month;
    let SelectedYear = params.year;
    let StaffNumber = params.staffNumber;
    let employeeFullName = params.employeeName;
    let monthName = params?.monthName || currentMonthName;

    if (StaffNumber !== null) {
      hrSalary
        .getPostedSalaries(selectedMonth, SelectedYear, StaffNumber)
        .then((response) => {
          let data = response.data?.content || [];
          if (data.length === 0) {
            notification.warning({
              message: `${employeeFullName} does not have posted salaries for ${monthName}-${SelectedYear} `,
            });
            setPostedData([]);
          } else {
            setPostedData(data);
          }
        });
    }
  };
  const selectedmonth = (month) => {
    setMonth(month);
    var newArray = monthNames.filter(function (m) {
      return m.id === month;
    });
    let currentMonthName = newArray[0].name;
    setDefaultMonth(currentMonthName);

    if (staffNumber) {
      let params = {
        month: month,
        staffNumber: staffNumber,
        year: year,
        employeeName: employeeName,
        monthName: currentMonthName,
      };
      fetchPostedSalaries(params);
    }
  };
  const selectedYear = (year) => {
    setYear(year);
    if (staffNumber) {
      let params = {
        year: year,
        staffNumber: staffNumber,
        month: month,
        employeeName: employeeName,
      };
      fetchPostedSalaries(params);
    }
  };

  return (
    <>
      <div>
        <Card
          title={
            <>
              {showSalaryPosting ? (
                <>
                  <AiOutlineArrowLeft
                    onClick={() => setShowSalaryPosting(!showSalaryPosting)}
                    className='arrow-left'
                    style={{
                      fontSize: '1.15em',
                      cursor: 'pointer',
                      marginRight: '10px',
                    }}
                  />
                  <span>Salary Posting</span>
                </>
              ) : (
                <span>Salary Posting</span>
              )}
            </>
          }
          extra={[
            <Button
              hidden={showSalaryPosting ? true : false}
              style={{ textAlign: 'right' }}
              type='primary'
              size='small'
              onClick={() => setShowSalaryPosting(!showSalaryPosting)}
            >
              Post Salary
            </Button>,
          ]}
        >
          {!showSalaryPosting ? (
            <>
              <Card style={{ backgroundColor: 'whitesmoke' }}>
                <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                  <Col span={6}>
                    <EmployeeSearch employee={handleEmployee} required={true} />
                  </Col>
                  <Col span={6}>
                    <Select
                      style={{ width: '100%' }}
                      onChange={(m) => selectedmonth(m)}
                      placeholder={currentMonthName}
                      showSearch
                    >
                      {monthNames.map((item, index) => {
                        return (
                          <Option key={index} value={item.id}>
                            {item.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Col>
                  <Col span={6}>
                    <Select
                      placeholder={year}
                      style={{ width: '100%' }}
                      onChange={(y) => selectedYear(y)}
                      allowClear
                    >
                      {postingYears.map((item, index) => {
                        return (
                          <Option key={index} value={item}>
                            {item}
                          </Option>
                        );
                      })}
                    </Select>
                  </Col>
                </Row>
              </Card>

              <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                <Col span={16}>
                  <Table
                    columns={processing_columns}
                    dataSource={postedData}
                    size='small'
                    defaultCurrent={page?.page}
                    total={total_elements}
                  />
                </Col>
                <Col span={8}>
                  <Descriptions
                    title='Employee Details'
                    bordered
                    size='small'
                    column={1}
                  >
                    <Descriptions.Item label='Staff Name'>
                      {employeeName}
                    </Descriptions.Item>
                    <Descriptions.Item label='Staff Number'>
                      {staffNumber}
                    </Descriptions.Item>
                    {/* <Descriptions.Item label="Date of Birth">
                      {dateOfBirth}
                    </Descriptions.Item> */}
                    <Descriptions.Item label='Id Number'>
                      {idNumber}
                    </Descriptions.Item>
                    <Descriptions.Item label='Primary Contact'>
                      {primaryContact}
                    </Descriptions.Item>
                    <Descriptions.Item label='Email'>{email}</Descriptions.Item>
                    <Descriptions.Item label='Department'>
                      {department}
                    </Descriptions.Item>
                    <Descriptions.Item label='Role'>{role}</Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
            </>
          ) : (
            <WrappedPostSalaryForm />
          )}
        </Card>
      </div>
    </>
  );
};

const processing_columns = [
  {
    title: 'Item Type',
    dataIndex: 'item_type',
    key: 'item_type',
  },
  {
    title: 'Item Name',
    dataIndex: 'look_up_name',
    key: 'look_up_name',
  },
  {
    title: 'Amount',
    dataIndex: 'processed_amount',
    key: 'processed_amount',
  },
];
export default SalaryPosting;
