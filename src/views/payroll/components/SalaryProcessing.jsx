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
import { hrSalary, hrmisReportsService } from '../../../_services';
import { EmployeeSearch } from '../../hr-reusables/EmployeeSearch';
import SalaryProcessingForm from './ProcessSalary';
import moment from 'moment';
import { monthNames } from '../../hr-reusables/PeriodFilters/months';
import { AiOutlineArrowLeft, AiFillPrinter } from 'react-icons/ai';
const monthFormat = 'M';
const yearFormat = 'YYYY';
const { Option } = Select;

const SalaryProcessing = (props) => {
  const defMonth = moment().format(monthFormat);
  const defYear = moment().format(yearFormat);
  const [processedData, setProcessedData] = useState([]);
  const [total_elements, setTotalElements] = useState(10);
  const [page, setPage] = useState({ page: 1, pageSize: 20 });
  const [month, setMonth] = useState(defMonth);
  const [year, setYear] = useState(defYear);
  const [viewSalaryDetails, setViewSalaryDetails] = useState(false);
  const [staffNumber, setStaffNumber] = useState(null);
  const [employeeName, setEmployeeName] = useState(null);
  const [currentMonthName, setDefaultMonth] = useState(null);
  const [processingYears, setProcessingYears] = useState([]);
  const [idNumber, setIdNumber] = useState(null);
  const [primaryContact, setPrimaryContact] = useState(null);
  const [email, setEmail] = useState(null);
  const [department, setDepartment] = useState(null);
  const [role, setRole] = useState(null);
  const [searchParams, setSearchParams] = useState(page);

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
        // check if salary processing years includes current year
        let processedYears = uniqueArray.includes(currentYear);
        if (processedYears === false) {
          let finalYear = [...uniqueArray, currentYear];
          setProcessingYears(finalYear);
        } else {
          setProcessingYears(uniqueArray);
        }
      }
    });
  }, [defYear]);
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
  const handleEmployee = (employee) => {
    let employeeData = employee ? employee : null;
    setEmployeeName(employeeData?.full_name || null);
    setStaffNumber(employeeData?.staff_number || null);
    setIdNumber(employeeData?.id_number || null);
    setPrimaryContact(employeeData?.phone_number || null);
    setEmail(employeeData?.email_address || null);
    setDepartment(employeeData?.department || null);
    setRole(employeeData?.specialization || null);

    if (employeeData?.staff_number != null) {
      let params = {
        month: month,
        staffNumber: employeeData?.staff_number,
        year: year,
        employeeName: employeeData?.full_name,
      };
      fetchProcessedSalaries(params);
    }
  };

  const fetchProcessedSalaries = (params) => {
    let selectedMonth = params.month;
    let SelectedYear = params.year;
    let employeeNumber = params.staffNumber;
    let employeeFullName = params.employeeName;
    let monthName = params?.monthName || currentMonthName;
    if (employeeNumber !== null) {
      hrSalary
        .getProcessedSalaries(selectedMonth, SelectedYear, params.staffNumber)
        .then((response) => {
          let data = response.data?.content || [];
          if (data.length === 0) {
            notification.warn({
              message: `${employeeFullName} does not have processed salaries for ${monthName}-${SelectedYear} `,
            });
            setProcessedData([]);
          } else {
            setProcessedData(data);
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
      fetchProcessedSalaries(params);
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
      fetchProcessedSalaries(params);
    }
  };
  const downloadReport = () => {
    let params = {
      salaryYear: year,
      staffNumber: staffNumber,
      salaryMonth: month,
      reportType: 'INTERIM',
    };
    const pars = {
      reportName: 'PayslipReport',
      ...params,
    };
    getReport(pars);
  };
  const getReport = (params) => {
    hrmisReportsService
      .generateReport({ ...params, format: 'PDF' })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${employeeName}InterimPayslip.pdf`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSalaryProcessing = () => {
    setViewSalaryDetails(!viewSalaryDetails);
    setProcessedData([]);
  };

   const handleTableChange = (value) => {
     let current_page = { page: value.current, pageSize: 10 };
     let params = { search, ...current_page };

     setSearchParams(params);
     setPage(current_page);
   };
  return (
    <>
      <div id='content'>
        <Card
          title={
            <>
              {viewSalaryDetails ? (
                <>
                  <AiOutlineArrowLeft
                    onClick={() => handleSalaryProcessing()}
                    className='arrow-left'
                    style={{
                      fontSize: '1.15em',
                      cursor: 'pointer',
                      marginRight: '10px',
                    }}
                  />
                  <span>Salary Processing</span>
                </>
              ) : (
                <span>Salary Processing</span>
              )}
            </>
          }
          extra={[
            <Button
              hidden={viewSalaryDetails ? true : false}
              style={{ textAlign: 'right' }}
              type='primary'
              size='small'
              onClick={() => setViewSalaryDetails(!viewSalaryDetails)}
            >
              View
            </Button>,
          ]}
        >
          {!viewSalaryDetails ? (
            <SalaryProcessingForm />
          ) : (
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
                      placeholder='Select Month'
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
                      placeholder='Select year'
                      style={{ width: '100%' }}
                      onChange={(y) => selectedYear(y)}
                      allowClear
                    >
                      {processingYears.map((item, index) => {
                        return (
                          <Option key={index} value={item}>
                            {item}
                          </Option>
                        );
                      })}
                    </Select>
                  </Col>
                  {processedData.length > 0 && (
                    <Col span={6} className='d-flex justify-content-end'>
                      <AiFillPrinter
                        style={{ cursor: "pointer", color: "blue", fontSize: '26px'}}
                        title='Print Interim Payslip'
                        onClick={downloadReport}
                      ></AiFillPrinter>
                    </Col>
                  )}
                </Row>
              </Card>

              <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                <Col span={16}>
                  <Table
                    columns={processing_columns}
                    onChange={handleTableChange}
                    dataSource={processedData}
                    size='small'
                    defaultCurrent={page?.page}
                    total={total_elements}
                    rowKey={(record) => record?.employeeNumber}
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
          )}
        </Card>
      </div>
    </>
  );
};
export default SalaryProcessing;
