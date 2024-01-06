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
  Tag,
} from 'antd';
import { leaveTypeService } from '../../../_services';
import { getUser } from '../../../_helpers/globalVariables';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';

const { Option } = Select;

const LeaveType = (props) => {
  const user = getUser();
  const start_page = { page: 1, pageSize: 10 };
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [consumesFromAnotherLeave, setConsumesFromAnotherLeave] =
    useState(false);
  const [page, setPage] = useState(start_page);
  const [total_elements, setTotalElements] = useState(0);
  const [searchParams, setSearchParams] = useState({
    page: 1,
    pageSize: 10,
    employeeUserName: user?.user_name,
  });
  const [leaveType, setLeaveType] = useState([]);
  const [consumerLeaveType, setConsumerLeaveTypes] = useState([]);
  const [editValue, setEditValue] = useState(null);
  const [leaveTypeData, setLeaveTypeData] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchLeaveType(searchParams);
  }, [searchParams]);

  useEffect(() => {
    consumerLeaveTypes();
  }, [consumesFromAnotherLeave, editing]);

  useEffect(() => {
    //animation code
    Aos.init();
  }, []);

  const fetchLeaveType = (params) => {
    setLoading(true);
    leaveTypeService
      .fetchLeaveTypes(params)
      .then((resp) => {
        setLeaveType(resp.data.content);
        setLoading(false);
        setTotalElements(resp.data?.page_details?.total_elements || 10);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const consumerLeaveTypes = () => {
    setLoading(true);
    leaveTypeService
      .fetchLeaveTypes()
      .then((resp) => {
        if (editing) {
          let data = resp.data.content;
          let leavetypes = data.filter(
            (types) => types.leave_id !== leaveTypeData?.leave_id
          );
          setConsumerLeaveTypes(leavetypes);
        } else {
          setConsumerLeaveTypes(resp.data.content);
        }
        setLoading(false);
      })
      .catch((err) => {
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
          {editValue === record.leave_id ? (
            <Tag color='orange'>editing...</Tag>
          ) : (
            <Row className='d-flex justify-content-between'>
              <Col>
                <AiFillEdit
                  style={{ color: '#4082ff', cursor: 'pointer' }}
                  onClick={() => editLeaveType(record)}
                />
              </Col>
              <Col>
                <AiFillDelete
                  onClick={() => deleteLeaveType(record)}
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

 const editLeaveType = (record) => {
    form.resetFields();
    setEditing(true);
    setEditValue(record.leave_id);
    setLeaveTypeData(record);
    form.setFieldsValue(record);
    setConsumesFromAnotherLeave(record?.consumes_from_another_leave || false);
  };

  const deleteLeaveType = (record) => {
    setLoading(true);
    leaveTypeService
      .deleteLeaveType(record.leave_id)
      .then((resp) => {
        message.success('Leave deleted successfully');
        setLoading(false);
        setTotalElements(resp.data?.page_details?.total_elements);
        fetchLeaveType(searchParams);
      })
      .catch((err) => {
        console.log('Error \t', err);
        setLoading(false);
      });
  };

  const cancelEditConfiguration = () => {
    setEditing(false);
    setEditValue(null);
    setLeaveTypeData(null);
    setConsumesFromAnotherLeave(false);
    form.resetFields();
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

  const handleLeaveConsumption = (value) => {
    setConsumesFromAnotherLeave(value);
  };
  const handleValue = (value) => {
    console.log(value);
  };

  const handleSubmit = (values) => {
    if (editing) {
      const {
        valid_gender,
        consumes_from_another_leave,
        consume_from_id,
        legal_days,
        ...val
      } = values;
      let params = {
        ...val,
        consumes_from_another_leave,
        legal_days: consumes_from_another_leave ? undefined : legal_days,
        valid_gender: valid_gender ? valid_gender : null,
        consume_from_id: consumes_from_another_leave
          ? consume_from_id
          : undefined,
      };
      setLoading(true);
      leaveTypeService
        .updateLeaveType(editValue, params)
        .then((resp) => {
          message.success('Leave details updated Successfully');
          setLoading(false);
          fetchLeaveType(searchParams);
          setEditing(false);
          setEditValue(null);
          form.resetFields();
        })
        .catch((err) => {
          console.log('Error \t', err);
          setLoading(false);
        });
    } else {
      const {
        valid_gender,
        consumes_from_another_leave,
        consume_from_id,
        legal_days,
        ...val
      } = values;
      let params = {
        ...val,
        consumes_from_another_leave,
        legal_days: consumes_from_another_leave ? undefined : legal_days,
        valid_gender: valid_gender ? valid_gender : null,
        consume_from_id: consumes_from_another_leave
          ? consume_from_id
          : undefined,
      };
      setLoading(true);
      leaveTypeService
        .createLeave(params)
        .then((resp) => {
          message.success('Leave generated Successfully');
          setLoading(false);
          form.resetFields();
          fetchLeaveType(searchParams);
        })
        .catch((err) => {
          console.log('Error \t', err);
          setLoading(false);
        });
    }
  };
  return (
    <div id='content'>
      <Form
        layout='vertical'
        name='leavetypes'
        onFinish={handleSubmit}
        form={form}
      >
        <Card>
          <Row gutter={12}>
            <Col lg={8} md={24} sm={24}>
              <Card title={'Leave Details'} type='inner'>
                <Form.Item
                  label='Leave Name'
                  name='leave_name'
                  rules={[
                    {
                      required: true,
                      message: 'Please input your leave name!',
                    },
                  ]}
                >
                  <Input placeholder='' />
                </Form.Item>
                {!consumesFromAnotherLeave ? (
                  <Form.Item
                    label='Legal Days'
                    name='legal_days'
                    rules={[
                      {
                        required: true,
                        message: 'Please input your legal days!',
                      },
                    ]}
                  >
                    <Input placeholder='' type='number' min='1' />
                  </Form.Item>
                ) : null}
                <Form.Item
                  label='Reason'
                  name='require_reason'
                  rules={[
                    {
                      required: true,
                      message: 'Please input your require reason!',
                    },
                  ]}
                >
                  <Select>
                    <Option value={true} key='true'>
                      True
                    </Option>
                    <Option value={false} key='false'>
                      False
                    </Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label='gender'
                  name='valid_gender'
                  rules={[
                    {
                      required: true,
                      message: 'Please input your gender!',
                    },
                  ]}
                >
                  <Select>
                    <Option value='M' key='male'>
                      Male
                    </Option>
                    <Option value='F' key='female'>
                      Female
                    </Option>
                    <Option value='ALL' key='other'>
                      All
                    </Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label='Accrual Type'
                  name='accrual_type'
                  rules={[
                    {
                      required: true,
                      message: 'Please input your accrual type!',
                    },
                  ]}
                >
                  <Select>
                    <Option value='YEARLY' key='Yearly'>
                      Yearly
                    </Option>
                    <Option value='MONTHLY' key='Monthly'>
                      Monthly
                    </Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label='Consumes from Another Leave'
                  name='consumes_from_another_leave'
                  rules={[
                    {
                      required: true,
                      message: 'Please input your consumes from another leave!',
                    },
                  ]}
                >
                  <Select onChange={handleLeaveConsumption}>
                    <Option value={true} key='true'>
                      Yes
                    </Option>
                    <Option value={false} key='false'>
                      No
                    </Option>
                  </Select>
                </Form.Item>
                {consumesFromAnotherLeave ? (
                  <Form.Item
                    label='Leave Type'
                    name='consume_from_id'
                    rules={[
                      {
                        required: true,
                        message: 'Please input consumer!',
                      },
                    ]}
                  >
                    <Select
                      style={{ width: '100%' }}
                      allowClear
                      showSearch
                      placeholder='Select leave type'
                      onChange={(e) => handleValue(e)}
                    >
                      {consumerLeaveType &&
                        consumerLeaveType.map((item, index) => {
                          return (
                            <Option key={index} value={item.leave_id}>
                              {item.leave_name}
                            </Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                ) : null}
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
                        <Button type='primary' htmlType='submit'>
                          Save
                        </Button>
                      </Form.Item>
                    </Col>
                  )}
                </Row>
              </Card>
            </Col>
            <Col lg={16} md={24} sm={24}>
              <Table
                bordered
                columns={leaveColumns}
                loading={loading}
                dataSource={leaveType}
                size='default'
                onChange={handleTableChange}
                pagination={{
                  current: page?.page,
                  pageSize: 10,
                  total: total_elements,
                }}
                rowKey={(record) => record.leave_id}
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
    title: 'Leave Name',
    dataIndex: 'leave_name',
    key: 'leave_name',
  },
  {
    title: 'Legal days',
    dataIndex: 'legal_days',
    key: 'legal_days',
  },
  {
    title: 'Reason',
    dataIndex: 'require_reason',
    key: 'require_reason',
    render: (text) => (
      <Tag color={text === true ? 'blue' : 'orange'}>
        {text === true ? 'True' : 'False'}
      </Tag>
    ),
  },
  {
    title: 'Gender',
    dataIndex: 'valid_gender',
    key: 'valid_gender',
  },
];

export default LeaveType;
