import React, { useState, useEffect } from 'react';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { Card, Row, Col, Table, Form, Tag, Select } from 'antd';
import { leaveApplication } from '../../../_services';

const { Option } = Select;

const LeaveHistory = ({ activeTab, ...props }) => {
  const start_page = { page: 1, pageSize: 10 };
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(start_page);
  const [total_elements, setTotalElements] = useState(0);
  const [searchParams, setSearchParams] = useState({
    page: 1,
    pageSize: 10,
    status: 'APPROVED',
  });
  const [leavesDetails, setLeaveDetails] = useState([]);

  useEffect(() => {
    let params = {
      ...searchParams,
    };
    if (activeTab === 'history') {
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
  }, []);

  const handleTableChange = (data) => {
    let current_page = { page: data.current, pageSize: 10 };
    let params = {
      ...searchParams,
      ...current_page,
    };

    setSearchParams(params);
    setPage(current_page);
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

  return (
    <div id='content'>
      <Form layout='vertical'>
        <Card>
          <Row gutter={8}>
            <Col span={3}>
              <Form.Item label={'My History'}>
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
                  <Option key='3' value={'PENDING'}>
                    Pending
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Table
                bordered
                columns={leaveColumns}
                rowKey={(record) => record.leave_application_id}
                size='small'
                dataSource={leavesDetails}
                onChange={handleTableChange}
                pagination={{
                  current: page?.page,
                  pageSize: 10,
                  total: total_elements,
                }}
              />
            </Col>
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
  {
    title: 'Approved By',
    dataIndex: 'approvals',
    key: 'approver_employee_name',
    render: (text) => <>{text[0]?.approver_employee_name}</>,
  },
  {
    title: 'Approval Date',
    dataIndex: 'approvals',
    key: 'approved_at',
    render: (text) => <>{text[0]?.approved_at}</>,
  },
  {
    title: 'Approval Notes',
    dataIndex: 'approvals',
    key: 'comment',
    render: (text) => <>{text[0]?.comment}</>,
  },
];

export default LeaveHistory;
