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
  Button,
  notification,
  Tag,
  Select,
} from 'antd';
import {
  leaveApplication,
  hrCodesService,
  leaveApproverService,
} from '../../../_services';
import moment from 'moment';
import { FcRight } from 'react-icons/fc';

const { TextArea } = Input;
const { Option } = Select;

const LeaveApproval = ({ activeTab, ...props }) => {
  const start_page = { page: 1, pageSize: 10 };
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(start_page);
  const [total_elements, setTotalElements] = useState(0);
  const [searchParams, setSearchParams] = useState({
    page: 1,
    pageSize: 10,
    forApproval: true,
    status: 'PENDING',
  });
  const [leavesDetails, setLeaveDetails] = useState([]);
  const [approve, setApprove] = useState(false);
  const [leaveId, setLeaveId] = useState(null);
  const [department, setDepartment] = useState([]);
  const [canApprove, setCanApprove] = useState(null);
  const [approvalBtn, setApproval] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    let params = {
      ...searchParams,
    };
    if (activeTab === '2') {
      fetchLeave(params);
    }
  }, [searchParams, activeTab]);

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

  useEffect(() => {
    //animation code
    Aos.init();

    if (activeTab === '2') {
      setLoading(true);
      hrCodesService
        .fetchCodes({ codeName: 'DEPARTMENT' })
        .then((resp) => {
          setDepartment(resp.data.content);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [activeTab]);

  const columns = [
    ...leaveColumns,
    {
      title: '',
      key: 'action',
      width: '3%',
      render: (text, record) => (
        <>
          {leaveId === record.leave_application_id && (
            <FcRight style={{ color: 'blue' }} />
          )}
        </>
      ),
    },
  ];

  const cancelEditConfiguration = () => {
    setApprove(false);
    setLeaveId(null);
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

  const onRowClick = (record) => {
    return {
      onClick: () => {
        setCanApprove(record.can_approve);
        setLeaveId(record.leave_application_id);
        setApprove(true);
      },
    };
  };

  const handleStatus = (val) => {
    setSearchParams({
      ...searchParams,
      status:
        val === 'PENDING'
          ? 'PENDING'
          : val === 'APPROVED'
          ? 'APPROVED'
          : val === 'DECLINED'
          ? 'DECLINED'
          : null,
    });
  };

  const handleDepartment = (val) => {
    setSearchParams({
      ...searchParams,
      department_id: val ? val : null,
    });
  };

  const handleBtn = (data) => {
    setApproval(data);
  };

  const handleSubmit = () => {
    let date = moment().format('YYYY-MM-DD HH:mm:ss');
    const { is_approved, comment } = values;
    if (is_approved) {
      let params = {
        comment,
        leave_application_id: leaveId,
        approved_at: date,
      };
      setLoading(true);
      leaveApproverService
        .approveLeave(params)
        .then((resp) => {
          notification['success']({
            message: 'Leave Approval Successfull',
          });
          setSearchParams({
            ...searchParams,
          });
          setLoading(false);
          setApprove(false);
          fetchLeave();
          form.resetFields();
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setApprove(true);
        });
    } else {
      setLoading(true);
      let params = {
        reject_reason: comment,
        leave_application_id: leaveId,
        rejected_at: date,
      };
      leaveApproverService
        .rejectLeave(params)
        .then((resp) => {
          notification['success']({
            message: 'Leave declined Successfully',
          });
          setSearchParams({
            ...searchParams,
          });
          setLoading(false);
          setApprove(false);
          fetchLeave();
          form.resetFields();
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setApprove(true);
        });
    }
 };

  return (
    <div id='content'>
      <Form
        layout='vertical'
        name='leaveapprovals'
        onFinish={handleSubmit}
        form={form}
      >
        <Card>
          <Row gutter={8}>
            <Col span={3}>
              <Form.Item label={'Approved'}>
                <Select
                  allowClear
                  size='small'
                  onChange={handleStatus}
                  style={{ width: '100%' }}
                >
                  <Option key='1' value={'APPROVED'}>
                    Approved
                  </Option>
                  <Option key='2' value={'DECLINED'}>
                    Declined
                  </Option>
                  <Option key='2' value={'PENDING'}>
                    Pending
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label={'Department'}>
                <Select
                  allowClear
                  onChange={handleDepartment}
                  size='small'
                  style={{ width: '100%' }}
                >
                  {department &&
                    department.map((item, index) => (
                      <Option key={index} value={item.code_id}>
                        {item.code_value}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={approve? 17 : 24}>
              <Table
                bordered
                columns={columns}
                rowKey={(record) => record.leave_application_id}
                size='small'
                dataSource={leavesDetails}
                onChange={handleTableChange}
                pagination={{
                  current: page?.page,
                  pageSize: 10,
                  total: total_elements,
                }}
                onRow={onRowClick}
              />
            </Col>
            {approve && (
              <Col
                span={7}
                data-aos='fade-down'
                data-aos-easing='linear'
                data-aos-duration='1300'
              >
                <Card title={'Approve Leave'} type='inner'>
                    <Form.Item
                      label='Action'
                      name='is_approved'
                      rules={[
                        {
                          required: true,
                          message: 'Please select is approved!',
                        },
                      ]}
                    >
                      <Select onSelect={handleBtn}>
                        <Option value={true} key='true'>
                          Approve
                        </Option>
                        <Option value={false} key='false'>
                          Reject
                        </Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label='Approval notes'
                      name='comment'
                      rules={[
                        {
                          required: false,
                          message: 'Please input your comment!',
                        },
                      ]}
                    >
                      <TextArea />
                    </Form.Item>
                  <Row gutter={8}>
                    <Col span={24} style={{ textAlign: 'right' }}>
                      <Button onClick={cancelEditConfiguration}>Cancel</Button>
                      {canApprove && (
                        <Button
                          style={{ marginLeft: 8 }}
                          type='primary'
                          loading={loading}
                          htmlType='submit'
                        >
                          {approvalBtn ? 'Approve' : 'Reject'}
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Card>
              </Col>
            )}
          </Row>
        </Card>
      </Form>
    </div>
  );
};

const leaveColumns = [
  {
    title: 'Name',
    dataIndex: 'employee_name',
    key: 'employee_name',
  },
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

export default LeaveApproval;
