import React, { useState, useEffect } from 'react';
import Aos from 'aos';
import 'aos/dist/aos.css';
import {
  Card,
  Row,
  Col,
  Table,
  Form,
  Input,
  Popconfirm,
  Button,
  Select,
  message,
  DatePicker,
  Tag,
  notification,
} from 'antd';
import moment from 'moment';
import {
  leaveTypeService,
  leaveApplication,
  hrEmployeeService,
  userService,
} from '../../../_services';
import { getUser, validatePermission } from '../../../_helpers/globalVariables';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
// import { useSelector } from 'react-redux';

const { Option } = Select;
const { TextArea } = Input;

const CreateLeave = ({ activeTab, ...props }) => {
  const user = getUser();
  const start_page = { page: 1, pageSize: 10 };
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(start_page);
  const [total_elements, setTotalElements] = useState(0);
  const [searchParams, setSearchParams] = useState({
    page: 1,
    pageSize: 10,
    status: 'PENDING',
    employeeUserName: user?.user_name,
  });
  const [startValue, setStartValue] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endOpen, setEndOpen] = useState(false);
  const [endDate, setEndDate] = useState(null);
  const [endValue, setEndValue] = useState(null);
  const [editValue, setEditValue] = useState(null);
  const [leaveType, setLeaveType] = useState([]);
  const [reason, setReason] = useState(false);
  const [value, setValue] = useState(null);
  const [leavesDetails, setLeaveDetails] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [name, setName] = useState(null);
  const [leaveDays, setLeaveDays] = useState(0);
  const [selectedLeave, setSelectedLeave] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [form] = Form.useForm();
  // const language = useSelector((state) => state.i18n);

  useEffect(() => {
    //animation code
    Aos.init();
  }, []);

  useEffect(() => {
    if (activeTab === '1') {
      form.resetFields();
      setLoading(true);
      leaveTypeService
        .fetchLeaveTypes(searchParams)
        .then((resp) => {
          setLeaveType(resp.data.content);
          props.setRefresh(false);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });

      setLoading(true);
      hrEmployeeService
        .fetchEmployees()
        .then((resp) => {
          setEmployee(resp.data.content);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [activeTab]);

  useEffect(() => {
    if (startDate && endDate) {
      let params = {
        fromDate: startDate,
        toDate: endDate,
      };
      setLoading(true);
      leaveApplication
        .fetchDaysSelected(params)
        .then((resp) => {
          let selectedDays = resp.data.content.days_applied;
          if (selectedDays > selectedLeave[0]?.total_accrual) {
            setLoading(false);
            setDisabled(true);
            setLeaveDays(selectedDays);
            return message.warn('Numbers of days exceeds the accrual days!!');
          }
          setDisabled(false);
          setLeaveDays(selectedDays);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [startDate, endDate, selectedLeave]);

  useEffect(() => {
    console.log(user)
    setLoading(true);
    userService
      .fetchUserByUsername(user?.user_name)
      .then((resp) => {
        setName(resp.data.name);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    let params = {
      ...searchParams,
    };
    if (activeTab === '1') {
      fetchLeave(params);
    }
  }, [searchParams, activeTab]);

  useEffect(() => {
    if (value) {
      setLoading(true);
      leaveTypeService
        .fetchLeaveTypeById(value)
        .then((resp) => {
          setReason(resp.data.content.require_reason);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });

      setLoading(true);
      leaveApplication
        .fetchLeaveBalances({ employeeUserName: user?.user_name })
        .then((resp) => {
          let arr = resp.data.content[0].leave_state_data;
          let leave = arr.filter((item) => item.leave_type_id === value);
          setSelectedLeave(leave);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [value]);

  const fetchLeave = (params) => {
    setLoading(true);
    leaveApplication
      .fetchLeaves(params)
      .then((resp) => {
        setLeaveDetails(resp.data.content);
        setTotalElements(resp.data?.page_details?.total_elements || 10);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const leaveColumns = [
    ...columns,
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (text, record) => (
        <>
          {editValue === record.leave_application_id ? (
            <Tag color='orange'>editing...</Tag>
          ) : (
            <Row className='d-flex justify-content-between'>
              <Col>
                <AiFillEdit
                  style={{ color: '#4082ff', cursor: 'pointer' }}
                  onClick={() => editLeave(record)}
                />
              </Col>
              <Col>
                <AiFillDelete
                  onClick={() => deleteLeave(record)}
                  style={{
                    color: 'red',
                    marginLeft: '6px',
                    cursor: 'pointer',
                  }}
                />
              </Col>
            </Row>
          )}
        </>
      ),
    },
  ];

  const cancelEditConfiguration = () => {
    setEditing(false);
    setEditValue(null);
    setLeaveDays(0);
    form.resetFields();
  };

  const deleteLeave = (record) => {
    setLoading(true);
    leaveApplication
      .deleteLeave(record.leave_application_id)
      .then((resp) => {
        message.success('Leave deleted successfully');
        setLoading(false);
        setTotalElements(resp.data?.page_details?.total_elements);
        fetchLeave(searchParams);
      })
      .catch((err) => {
        console.log('Error \t', err);
        setLoading(false);
      });
  };

  const editLeave = (record) => {
    form.resetFields();
    setEditing(true);
    setEditValue(record.leave_application_id);
    setLeaveData(record);
    let params = {
      fromDate: record?.from_date,
      toDate: record.to_date,
    };
    let data = {
      ...record,
      to_date: moment(record?.to_date, 'YYYY-MM-DD'),
      from_date: moment(record?.from_date, 'YYYY-MM-DD'),
    };
    console.log("Data \t", data)
    console.log("Data \t", record)
    form.setFieldsValue(data);
    setLoading(true);
    leaveApplication
      .fetchDaysSelected(params)
      .then((resp) => {
        let selectedDays = resp.data.content.days_applied;
        if (selectedDays > selectedLeave[0]?.total_accrual) {
          setLoading(false);
          setDisabled(true);
          setLeaveDays(selectedDays);
          return message.warn('Numbers of days exceeds the accrual days!!');
        }
        setDisabled(false);
        setLeaveDays(selectedDays);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  //disabling time that has passed selected time  code until handleEndOpenChange
  const onChange = (field, value) => {
    if (field === 'startValue') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
  };

  const onStartChange = (value) => {
    if (value) {
      setStartValue(value);
      onChange('startValue', moment(value).format('YYYY-MM-DD'));
    }
  };

  const onEndChange = (value) => {
    if (value) {
      setEndValue(value);
      onChange('endValue', moment(value).format('YYYY-MM-DD'));
    }
  };

  const disabledDate = (current) => {
    return current && current < moment().add(-1, 'day');
  };
  const disabledEndDate = (endValue) => {
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  const handleStartOpenChange = (open) => {
    if (!open) {
      setEndOpen(true);
    }
  };

  const handleEndOpenChange = (open) => {
    setEndOpen(open);
  };

  const handleTableChange = (data) => {
    let current_page = { page: data.current, pageSize: 10 };
    let params = {
      ...searchParams,
      ...current_page,
    };

    setSearchParams(params);
    setPage(current_page);
  };

  const handleSubmit = (values) => {
        if (editing) {
          const { leave_type_id, leave_reason, from_date, to_date } = values;
          let params = {
            leave_type_id,
            from_date: startDate
              ? startDate
              : moment(from_date).format('YYYY-MM-DD'),
            to_date: endDate ? endDate : moment(to_date).format('YYYY-MM-DD'),
            leave_reason,
            employee_user_name: user?.user_name,
            leave_days: leaveDays,
          };
          setLoading(true);
          leaveApplication
            .updateLeave(editValue, params)
            .then((resp) => {
              message.success('Application updated successfully');
              setLoading(false);
              form.resetFields();
              setEditValue(null);
              setEditing(false);
              fetchLeave(searchParams);
              setLeaveDays(0);
            })
            .catch((err) => {
              console.log(err);
              setLoading(false);
            });
        } else {
          setLoading(true);
          const { leave_type_id, leave_reason, employee_username } = values;
          let params = {
            leave_type_id,
            from_date: startDate,
            to_date: endDate,
            leave_reason,
            employee_user_name: employee_username
              ? employee_username
              : user?.user_name,
            leave_days: leaveDays,
          };
          leaveApplication
            .createLeave(params)
            .then((resp) => {
              notification['success']({
                message: 'Leave Request Submission Successfull',
              });
              setLoading(false);
              form.resetFields();
              setStartValue(null);
              setEndValue(null);
              fetchLeave(searchParams);
              setLeaveDays(0);
            })
            .catch((err) => {
              console.log(err);
              setLoading(false);
            });
        }
  };

  return (
    <div id='content'>
      <Form
        layout={'vertical'}
        name='leave-application'
        onFinish={handleSubmit}
        form={form}
      >
        <Card>
          <Row gutter={8}>
            <Col
              lg={9}
              md={24}
              sm={24}
              data-aos='fade-down'
              data-aos-easing='ease-out-cubic'
              data-aos-duration='2000'
            >
              <Card
                title={'Leave Application'}
                type='inner'
                extra={
                  <>
                    <Tag color='blue'>
                      {selectedLeave[0]?.leave_type_name} :{' '}
                      {selectedLeave[0]?.total_accrual || 0} days
                    </Tag>
                  </>
                }
              >
                <Row>
                  <Col span={24}>
                    <Form.Item label='Name'>
                      <Input value={name ? name : null} disabled />
                    </Form.Item>
                  </Col>
                </Row>
                {validatePermission('create_others_leave_application') && (
                  <Row>
                    <Col span={24}>
                      <Form.Item
                        label='Application For'
                        name='employee_username'
                        rules={[
                          {
                            required: false,
                            message: 'Please input your name!',
                          },
                        ]}
                      >
                        <Select allowClear>
                          {employee &&
                            employee.map((item, index) => (
                              <Option key={index} value={item.username}>
                                {item.full_name}
                              </Option>
                            ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                )}
                <Row>
                  <Col span={24}>
                    <Form.Item
                      label='Leave Type'
                      name='leave_type_id'
                      rules={[
                        {
                          required: true,
                          message: 'Please input your leave name!',
                        },
                      ]}
                    >
                      <Select
                        style={{ width: '100%' }}
                        allowClear
                        showSearch
                        placeholder='Select leave type'
                        onChange={(e) => setValue(e)}
                      >
                        {leaveType &&
                          leaveType.map((item, index) => {
                            return (
                              <Option key={index} value={item.leave_id}>
                                {item.leave_name}
                              </Option>
                            );
                          })}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col lg={10} md={24} sm={24}>
                    <Form.Item
                      label='Start Date'
                      name='from_date'
                      rules={[
                        {
                          required: true,
                          message: 'Please input start date!',
                        },
                      ]}
                    >
                      <DatePicker
                        disabledDate={disabledDate}
                        format='YYYY-MM-DD'
                        placeholder='Start'
                        onChange={onStartChange}
                        onOpenChange={handleStartOpenChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={10} md={24} sm={24}>
                    <Form.Item
                      label='End Date'
                      name='to_date'
                      rules={[
                        {
                          required: true,
                          message: 'Please input end date!',
                        },
                      ]}
                    >
                      <DatePicker
                        disabledDate={disabledEndDate}
                        format='YYYY-MM-DD'
                        onChange={onEndChange}
                        open={endOpen}
                        onOpenChange={handleEndOpenChange}
                        placeholder={'End'}
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={4} md={24} sm={24}>
                    <Form.Item label='Days'>
                      <Input
                        value={leaveDays}
                        style={{ backgroundColor: '#87d068', color: 'white' }}
                        disabled={true}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      label='Reason'
                      name='leave_reason'
                      rules={[
                        {
                          required: true,
                          message: 'Please input leave reason!',
                        },
                      ]}
                    >
                      <TextArea />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  {editing ? (
                    <Row>
                      <Col span={12}>
                        <Form.Item
                          style={{ textAlign: 'bottom-left' }}
                          className='mr-2'
                        >
                          <Popconfirm
                            title='Discard changes?'
                            onConfirm={cancelEditConfiguration}
                            okText='Yes'
                            cancelText='No'
                          >
                            <Button type='danger'>Cancel</Button>
                          </Popconfirm>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item style={{ textAlign: 'right' }}>
                          <Button type='primary' htmlType='submit'>
                            Edit
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  ) : (
                    <Col>
                      <Form.Item style={{ textAlign: 'right' }}>
                        <Button
                          type='primary'
                          htmlType='submit'
                          loading={loading}
                          disabled={disabled}
                        >
                          Submit
                        </Button>
                      </Form.Item>
                    </Col>
                  )}
                </Row>
              </Card>
            </Col>
            <Col lg={15} md={24} sm={24}>
              <Table
                bordered
                columns={leaveColumns}
                rowKey={(record) => record.leave_application_id}
                size='default'
                dataSource={leavesDetails}
                onChange={handleTableChange}
                pagination={{
                  current: page?.page,
                  pageSize: 10,
                  total: total_elements,
                }}
                loading={loading}
              />
            </Col>
          </Row>
        </Card>
      </Form>
    </div>
  );
};

const columns = [
  {
    title: 'Leave Type',
    dataIndex: 'leave_type_name',
    key: 'leave_type_name',
  },
  {
    title: 'Start Date',
    dataIndex: 'from_date',
    key: 'from_date',
  },
  {
    title: 'End Date',
    dataIndex: 'to_date',
    key: 'to_date',
  },
  {
    title: 'Days',
    dataIndex: 'leave_days',
    key: 'leave_days',
  },
  {
    title: 'Status',
    dataIndex: 'leave_state',
    key: 'leave_state',
    width: '10%',
    render: (text) => (
      <Tag
        color={
          text === 'PENDING' ? 'orange' : text === 'APPROVED' ? 'green' : 'red'
        }
      >
        {text === 'PENDING'
          ? 'Not Approved'
          : text === 'APPROVED'
          ? 'Approved'
          : 'Declined'}
      </Tag>
    ),
  },
  {
    title: 'Reason',
    dataIndex: 'leave_reason',
    key: 'leave_reason',
  },
];

export default CreateLeave;
