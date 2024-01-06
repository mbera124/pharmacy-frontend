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
  DatePicker,
  Popconfirm,
  Button,
  message,
  Tag,
} from 'antd';
import { hrmisHolidayService } from '../../../_services';
import moment from 'moment';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const Holiday = (props) => {
  const start_page = { page: 1, pageSize: 10 };
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(start_page);
  const [total_elements, setTotalElements] = useState(0);
  const [searchParams, setSearchParams] = useState({ ...start_page });
  const [editValue, setEditValue] = useState(null);
  const [holidayData, setHolidayData] = useState(null);
  const [holiday, setHoliday] = useState([]);
  const [date, setDate] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHoliday(searchParams);
  }, [searchParams]);

  useEffect(() => {
    //animation code
    Aos.init();
  }, []);

  const fetchHoliday = (params) => {
    setLoading(true);
    hrmisHolidayService
      .fetchHolidays(params)
      .then((resp) => {
        setHoliday(resp.data.content);
        setTotalElements(resp.data?.page_details?.total_elements || 10);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const holidayColumns = [
    ...columns,
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (text, record) => (
        <>
          {editValue === record.holiday_id ? (
            <Tag color='orange'>editing...</Tag>
          ) : (
            <Row className='d-flex justify-content-between'>
              <Col>
                <AiFillEdit
                  style={{ color: '#4082ff', cursor: 'pointer' }}
                  onClick={() => editHoliday(record)}
                />
              </Col>
              <Col>
                <AiFillDelete
                  onClick={() => deleteHoliday(record)}
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

  const cancel = (e) => {
    console.log(e);
  };

  const editHoliday = (record) => {
    let params = {
      ...record,
      holiday_date: moment(record.holiday_date, 'MM-DD'),
    };
    setEditing(true);
    setEditValue(record.holiday_id);
    setHolidayData(params);
    form.setFieldsValue(params);
  };

  const deleteHoliday = (record) => {
    setLoading(true);
    hrmisHolidayService
      .deleteHoliday(record.holiday_id)
      .then((resp) => {
        message.success('Holiday deleted successfully');
        setLoading(false);
        setTotalElements(resp.data?.page_details?.total_elements);
        fetchHoliday();
      })
      .catch((err) => {
        console.log('Error \t', err);
        setLoading(false);
      });
  };

  const onChange = (date, dateString) => {
    setDate(dateString);
  };

  const cancelEditConfiguration = () => {
    setEditing(false);
    setEditValue(null);
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

  const handleSubmit = (values) => {
    if (editing) {
      setLoading(true);
      const { holiday_name } = values;
      let params = {
        holiday_date: date
          ? date.slice(5)
          : (holidayData?.holiday_date).format('MM-DD'),
        holiday_name,
      };
      hrmisHolidayService
        .updateHoliday(editValue, params)
        .then((resp) => {
          message.success('Holiday updated Successfully');
          setLoading(false);
          setEditing(false);
          setEditValue(null);
          setHolidayData([]);
          setDate(null);
          form.resetFields();
          fetchHoliday();
        })
        .catch((err) => {
          console.log('Error \t', err);
          setLoading(false);
        });
    } else {
      setLoading(true);
      const { holiday_name } = values;
      let params = {
        holiday_date: date.slice(5),
        holiday_name,
      };
      hrmisHolidayService
        .createHoliday(params)
        .then((resp) => {
          message.success('Holiday created Successfully');
          setLoading(false);
          form.resetFields();
          fetchHoliday();
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
        name='holidays'
        onFinish={handleSubmit}
        form={form}
      >
        <Card>
          <Row gutter={24}>
            <Col
              span={8}
              data-aos='fade-down'
              data-aos-easing='ease-out-cubic'
              data-aos-duration='2000'
            >
              <Card title={'Holiday Details'} type='inner'>
                <Form.Item
                  label='Holiday Name'
                  name='holiday_name'
                  rules={[
                    {
                      required: true,
                      message: 'Please input your holiday name!',
                    },
                  ]}
                >
                  <Input placeholder='' style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                  label='Holiday Date'
                  name='holiday_date'
                  rules={[
                    {
                      required: true,
                      message: 'Please input your holiday date!',
                    },
                  ]}
                >
                  <DatePicker
                    placeholder=''
                    onChange={onChange}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
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
            <Col span={16}>
              <Table
                bordered
                columns={holidayColumns}
                loading={loading}
                dataSource={holiday}
                size='default'
                onChange={handleTableChange}
                pagination={{
                  current: page?.page,
                  pageSize: 10,
                  total: total_elements,
                }}
                rowKey={(record) => record.holiday_id}
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
    title: 'Holiday Name',
    dataIndex: 'holiday_name',
    key: 'holiday_name',
  },
  {
    title: 'Holiday Date',
    dataIndex: 'holiday_date',
    key: 'holiday_date',
  },
];

export default Holiday;
