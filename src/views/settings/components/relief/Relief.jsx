import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  message,
  Row,
  Form,
  Col,
  Select,
  Input,
  Button,
  Popconfirm,
  Tag,
  InputNumber,
} from 'antd';
import { reliefColumns } from './Columns';
import {
  hrmisRelief,
  hrLookupConfigurationService,
} from '../../../../_services';
import { useNavigate } from 'react-router-dom';
import { AiFillEdit, AiFillDelete, AiOutlineArrowLeft } from 'react-icons/ai';
// import ArrowLeftOutlined from '@ant-design/icons';

const { Option } = Select;
const Relief = (...props) => {
  const [total_elements, setTotalElements] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(null);
  const [reliefItems, setReliefItems] = useState([]);
  const [payrollItems, setpayrollItems] = useState([]);
  const [reliefData, setReliefData] = useState([]);
  const [calculationType, setCalculationType] = useState(null);
  const [payrollId, setPayrollId] = useState(null);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    fetchReliefValue();
    fetchPayrollItem();
  }, []);

  const columns = [
    ...reliefColumns,
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <>
          {editValue === record.relief_id ? (
            <Tag color='orange'>editing...</Tag>
          ) : (
            <Row className='d-flex justify-content-between'>
              <Col>
                <AiFillEdit
                  style={{ color: '#4082ff', cursor: 'pointer' }}
                  onClick={() => editReliefValue(record)}
                />
              </Col>
              <Col>
                <AiFillDelete
                  onClick={() => deleteReliefValue(record)}
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

  const fetchReliefValue = () => {
    hrmisRelief
      .fetchRelief()
      .then((resp) => {
        setReliefItems(resp.data.content);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchPayrollItem = () => {
    hrLookupConfigurationService
      .getAllPayrollItems()
      .then((resp) => {
        let itemData = resp.data.content;
        const result = itemData.filter(
          (item) =>
            item.item_type === 'EARNING' ||
            item.item_type === 'BENEFIT' ||
            item.item_type === 'GROSS' ||
            item.item_type === 'NHIF' ||
            item.item_type === 'PAYE'
        );

        setpayrollItems(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteReliefValue = (record) => {
    hrmisRelief
      .deleteRelief(record.relief_id)
      .then((resp) => {
        message.success('Relief deleted successfully');
        fetchReliefValue();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const editReliefValue = (record) => {
    form.resetFields();
    setEditing(true);
    setEditValue(record.relief_id);
    setReliefData(record);
    form.setFieldsValue(record);
    setCalculationType(record.calculation_type);
  };

  const cancelEditRelief = () => {
    setEditing(false);
    setEditValue(null);
    form.resetFields();
  };

  const handlePayrollItem = (e) => {
    setPayrollId(e);
  };

  const handleSubmit = (values) => {
    if (editing) {
      const { payroll_item_id, ...items } = values;
      let data = {
        ...items,
        payroll_item_id: reliefData.payroll_item_id,
      };
      updateRelief(data);
    } else {
      createRelief(values);
    }
  };

  const updateRelief = (data) => {
    const { payroll_item_id, ...val } = data;
    let params = {
      payroll_item_id: payrollId ? payrollId : data?.payroll_item_id,
      ...val,
    };
    hrmisRelief
      .updateRelief(editValue, params)
      .then((resp) => {
        message.success('Relief Updated successfully');
        fetchReliefValue();
        setEditing(false);
        setEditValue(null);
        form.resetFields();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const createRelief = (values) => {
    hrmisRelief
      .createRelief(values)
      .then((resp) => {
        message.success('Relief Created Successfully');
        fetchReliefValue();
        form.resetFields();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div id='content'>
      <Card
        title={
          <>
            <AiOutlineArrowLeft
              onClick={() => navigate('/settings')}
              // className='arrow-left'
              style={{
                fontSize: '1.15em',
                cursor: 'pointer',
                marginRight: '10px',
              }}
            />
            <span>Relief</span>
          </>
        }
      >
        <Form
          layout='vertical'
          name='relief'
          onFinish={handleSubmit}
          form={form}
        >
          <Row gutter={8}>
            <Col lg={8} md={24} sm={24}>
              <Card type='inner' title='New Relief'>
                <Form.Item
                  label='Relief Name'
                  name='relief_name'
                  rules={[
                    {
                      required: true,
                      message: 'Please input your releif name!',
                    },
                  ]}
                >
                  <Input style={{ width: '100%' }} placeholder='relief name' />
                </Form.Item>

                <Form.Item
                  label='Calculation Payroll Item'
                  name='payroll_item_id'
                  rules={[
                    {
                      required: true,
                      message: 'Please input your payroll item!',
                    },
                  ]}
                >
                  <Select
                    style={{ width: '100%' }}
                    allowClear
                    showSearch
                    placeholder='Select type'
                    onChange={handlePayrollItem}
                  >
                    {payrollItems.map((data, index) => {
                      return (
                        <Option key={index} value={data.payroll_item_id}>
                          {data.item_name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>

                <Form.Item
                  label='Calculation Type'
                  name='calculation_type'
                  rules={[
                    {
                      required: true,
                      message: 'Please input your calculation type!',
                    },
                  ]}
                >
                  <Select
                    style={{ width: '100%' }}
                    allowClear
                    showSearch
                    placeholder=''
                    onChange={(record) => setCalculationType(record)}
                  >
                    <Option value={`RATE`} key={`RATE`}>
                      {`Rate`}
                    </Option>
                    <Option value={`FIXED`} key={`FIXED`}>
                      {`Fixed`}
                    </Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label='Calculation Value'
                  name='calculation_value'
                  rules={[
                    {
                      required: true,
                      message: 'Please input your calculation value!',
                    },
                  ]}
                >
                  <InputNumber
                    max={calculationType === 'RATE' ? 100 : Infinity}
                    formatter={(value) =>
                      calculationType === 'RATE' ? `${value}%` : `${value}`
                    }
                    min={0}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                <Row style={{ textAlign: 'right', marginTop: '2px' }}>
                  {editing ? (
                    <Row>
                      <Col span={12}>
                        <Form.Item
                          style={{ textAlign: 'bottom-left' }}
                          className='mr-2'
                        >
                          <Popconfirm
                            title='Discard changes?'
                            onConfirm={cancelEditRelief}
                            okText='Yes'
                            cancelText='No'
                          >
                            <Button type='primary' danger>
                              Cancel
                            </Button>
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
              <Card type='inner' title='Reliefs'>
                <Table
                  dataSource={reliefItems}
                  columns={columns}
                  rowKey={(record) => record?.relief_id}
                  size='small'
                  pagination={{
                    total: total_elements,
                  }}
                />
              </Card>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default Relief;
