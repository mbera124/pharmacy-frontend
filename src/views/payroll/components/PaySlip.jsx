import React, { useState, useEffect } from 'react';
import { Col, Row, Select, Dropdown, Button, Menu, notification } from 'antd';
import {
  hrEmployeeService,
  hrSalary,
  userService,
  hrmisReportsService,
} from '../../../_services';;
import { monthNames } from '../../hr-reusables/PeriodFilters/months';
import moment from 'moment';
import { DownOutlined } from '@ant-design/icons';
import { TbDownload } from 'react-icons/tb';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import { MdOutlineAttachEmail } from 'react-icons/md';
// import OnScreenReport from '../../../report/OnScreenReport';
import { RiMailSendLine } from 'react-icons/ri';
import { FcCancel } from 'react-icons/fc';
import { TiWarning } from 'react-icons/ti';
import { getUser } from '../../../_helpers/globalVariables';

const monthFormat = 'M';
const yearFormat = 'YYYY';
const { Option } = Select;
const Payslip = (props) => {
  const user = getUser();
  const defMonth = moment().format(monthFormat);
  const defYear = moment().format(yearFormat);
  const [employeeDetails, SetEmployeeDetails] = useState([]);
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [postingYears, setPostingYears] = useState([]);
  const [staffNumber, setStaffNumber] = useState(null);
  const [payslipParams, setPayslipParams] = useState({
    reportType: 'FINAL',
    salaryMonth: month,
    salaryYear: year,
    reportName: 'PayslipReport',
  });
  const [showOnScreenReport, setShowOnScreenReport] = useState(false);

  useEffect(() => {
    getRoles(user.user_name);
    findYears();
  }, [user, staffNumber, payslipParams, defMonth]);
  const getEmployees = (params) => {
    hrEmployeeService
      .fetchEmployees(params)
      .then((response) => {
        let data = response.data;
        SetEmployeeDetails(data.content);
      })
      .catch((error) => {});
  };
  const getRoles = (params) => {
    let user_name = { userName: params };
    userService
      .fetchUser(user_name)
      .then((response) => {
        let data = response.data.content;
        let roles = data.map((item) => item.roles);
        let exists = roles[0].includes('ROLE_ADMIN');
        //Do not tamper with this unless necessary..
        if (exists) {
          //Admin views all employee payslips for active employees
          params = { employeeStatus: 'ACTIVE' };
          getEmployees(params);
        } else {
          //user views only his payslip
          let params = {
            userName: user.user_name,
            employeeStatus: 'ACTIVE',
          };
          getEmployees(params);
        }
      })
      .catch((error) => {
        console.log('error response', error);
      });
  };
  const findYears = () => {
    hrSalary.getAllPostedSalaries().then((response) => {
      let data = response.data?.content || [];
      if (data.length !== 0) {
        let years = data.map((a) => a.year_processed);
        years.sort();
        var uniqueArray = [];
        for (var value of years) {
          if (uniqueArray.indexOf(value) === -1) {
            uniqueArray.push(value);
          }
        }
        let currentYear = parseInt(defYear);
        let processedYears = uniqueArray.includes(currentYear);
        if (processedYears === false) {
          let finalYear = [...uniqueArray, currentYear];

          setPostingYears(finalYear);
        } else {
          setPostingYears(uniqueArray);
        }
      }
    });
  };
  const selectedmonth = (month) => {
    setMonth(month);
    if (staffNumber) {
      setPayslipParams({ ...payslipParams, salaryMonth: month });
    }
  };
  const selectedYear = (year) => {
    setYear(year);
    if (staffNumber) {
      setPayslipParams({ ...payslipParams, slaryYear: year });
    }
  };
  const onEmployeeSelect = (data) => {
    setStaffNumber(data);
    setPayslipParams({ ...payslipParams, staffNumber: data });
  };
  const menu = (row) => {
    return (
      <Menu onClick={(e) => handleMenuClick(e)}>
        <Menu.Item key='view_payslip'>
          <FaFileInvoiceDollar style={{ color: 'blue', marginRight: 5 }} />
          View Payslip
        </Menu.Item>
        <Menu.Item key='generate_payslip' style={{ marginRight: 5 }}>
          <TbDownload />
          Generate Payslip
        </Menu.Item>
        <Menu.Item key='email_payslip'>
          <MdOutlineAttachEmail style={{ color: 'red', marginRight: 5 }} />
          Email Payslip
        </Menu.Item>
      </Menu>
    );
  };
  const handleMenuClick = (e) => {
    let name = e.key;
    if (staffNumber) {
      if (name === 'view_payslip') {
        setShowOnScreenReport(true);
      } else if (name === 'generate_payslip') {
        downloadReport('PayslipReport');
      } else {
        hrSalary
          .generateEmail(month, year, staffNumber)
          .then((response) => {
            if (response.status === 200) {
              notification.success({
                message: 'Payslip has been emailed to employee',
                icon: <RiMailSendLine style={{ color: 'green' }} />,
              });
            } else {
              notification.warn({
                message: 'There was an error while emailing payslip',
                icon: <FcCancel />,
              });
            }
          })
          .catch((error) => {
            console.log('error', error);
          });
      }
    } else {
      notification.warn({
        message: 'Ensure all fiels have been filled',
        icon: <TiWarning style={{ color: 'red' }} />,
      });
    }
  };
  const downloadReport = (params) => {
    const pars = {
      reportName: params,
      format: 'PDF',
      ...payslipParams,
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
        link.setAttribute('download', `${params.reportName}.pdf`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const closeReport = () => {
    setShowOnScreenReport(!showOnScreenReport);
  };

  return (
    <>
      <div>
        <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
          <Col span={6}>
            <Select
              style={{ width: '100%' }}
              placeholder='Employee Name'
              showSearch
              //   onSelect={(e) => setStaffNumber(e)}
              onChange={(e) => onEmployeeSelect(e)}
            >
              {employeeDetails.map((item, index) => {
                return (
                  <Option key={index} value={item.staff_number}>
                    {item.full_name}
                  </Option>
                );
              })}
            </Select>
          </Col>
          <Col span={6}>
            <Select
              style={{ width: '100%' }}
              onChange={(m) => selectedmonth(m)}
              placeholder='Month'
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
              style={{ width: '100%' }}
              onChange={(y) => selectedYear(y)}
              placeholder='Year'
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
          <Col span={6}>
            <Dropdown overlay={menu()}>
              <Button>
                Action <DownOutlined />
              </Button>
            </Dropdown>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24 }} style={{ marginTop: 5 }}>
          {/* {showOnScreenReport && (
            <OnScreenReport
              title={'Payslip'}
              params={{
                ...payslipParams,
                format: 'HTML',
                showOnScreenReport,
              }}
              key='screen'
              fromHrmis={true}
              RFQreport={true}
            />
          )} */}
          hi
        </Row>
        {showOnScreenReport && (
          <Row gutter={{ xs: 8, sm: 16, md: 24 }} align='bottom'>
            <Col
              span={24}
              className='d-flex justify-content-end'
              align='bottom'
            >
              <Button type='primary' onClick={closeReport}>
                Close Report
              </Button>
            </Col>
          </Row>
        )}
      </div>
    </>
  );
};
export default Payslip;
