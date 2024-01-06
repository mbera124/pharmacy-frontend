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
  Divider,
  Button,
  Popconfirm,
  Tag,
  InputNumber,
  Checkbox,
} from 'antd';
import { pensionColumns } from './Columns';
import {
  hrmisPension,
  hrLookupConfigurationService,
  hrmisNssfTierService,
} from '../../../../_services';
import { AiFillEdit, AiFillDelete, AiOutlineArrowLeft } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const Pension = ({ activeTab, ...props }) => {
  const [total_elements, setTotalElements] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(null);
  const [payrollId, setPayrollId] = useState(null);
  const [pensionItems, setPensionItems] = useState([]);
  const [payrollItems, setpayrollItems] = useState([]);
  const [pensionData, setPensionData] = useState([]);
  const [tierTypes, setTierType] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [isStatutory, setIsStatutory] = useState(null);
  const [calculationType, setCalculationType] = useState('RATE');
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
      fetchPensionValue();
      fetchPayrollItem();
      fetchTierTypes();
      fetchTiers();
  }, []);

  const columns = [
    ...pensionColumns,
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <>
          {editValue === record.pension_id ? (
            <Tag color='orange'>editing...</Tag>
          ) : (
            <Row className='d-flex justify-content-between'>
              <Col>
                <AiFillEdit
                  style={{ color: '#4082ff', cursor: 'pointer' }}
                  onClick={() => editPensionValue(record)}
                />
              </Col>
              <Col>
                  <AiFillDelete
                    onClick={() => deletePensionValue(record)}
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

  const fetchPensionValue = () => {
    hrmisPension
      .fetchPension()
      .then((resp) => {
        setPensionItems(resp.data.content);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchTierTypes = () => {
    hrmisNssfTierService
      .fetchTiersTypes()
      .then((resp) => {
        setTierType(resp?.data || []);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchTiers = () => {
    hrmisNssfTierService
      .fetchTiers()
      .then((resp) => {
        setTiers(resp?.data?.content || []);
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
            item.item_type === 'GROSS'
        );
        setpayrollItems(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletePensionValue = (record) => {
    hrmisPension
      .deletePension(record.pension_id)
      .then((resp) => {
        message.success('Pension deleted successfully');
        fetchPensionValue();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const editPensionValue = (record) => {
    form.resetFields();
    setEditing(true);
    setEditValue(record.pension_id);
    setIsStatutory(record?.is_statutory || false);
    setPensionData(record);
    form.setFieldsValue(record);
    setCalculationType(record.calculation_type);
  };

  const cancelEditPension = () => {
    setEditing(false);
    setEditValue(null);
    form.resetFields();
  };

  const handleCheckbox = (e) => {
    setIsStatutory(e.target.checked);
  };

  const handlePayrollItem = (e) => {
    setPayrollId(e);
  };

  const handleSubmit = (values) => {
        if (editing) {
          const { payroll_item_id, ...items } = values;
          let data = {
            ...items,
            payroll_item_id: pensionData.payroll_item_id,
          };
          updatePension(data);
        } else {
          createPension(values);
        }
  };

  const updatePension = (data) => {
    const { payroll_item_id, is_statutory, ...val } = data;
    let params = {
      payroll_item_id: payrollId ? payrollId : data?.payroll_item_id,
      is_statutory: isStatutory,
      ...val,
    };
    hrmisPension
      .updatePension(editValue, params)
      .then((resp) => {
        message.success('Pension Updated successfully');
        fetchPensionValue();
        setEditing(false);
        setEditValue(null);
        form.resetFields();
        setIsStatutory(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const createPension = (values) => {
    hrmisPension
      .createPension(values)
      .then((resp) => {
        message.success('Pension Created Successfully');
        fetchPensionValue();
        form.resetFields();
        setIsStatutory(false);
      })
      .catch((err) => {
        setEditing(false);
        setEditValue(null);
        console.log(err);
      });
  };
  return (
    <div id="content">
      <Card
        title={
          <>
            <AiOutlineArrowLeft
              onClick={() => navigate('/settings')}
              className='arrow-left'
              style={{
                fontSize: '1.15em',
                cursor: 'pointer',
                marginRight: '10px',
              }}
            />
            <span>Pension</span>
          </>
        }
      >
        <Form
          layout='vertical'
          name='pension'
          onFinish={handleSubmit}
          form={form}
        >
          <Row gutter={8}>
            <Col lg={8} md={24} sm={24}>
              <Card type='inner' title='New Pension'>
                <Form.Item
                  label='Pension Name'
                  name='pension_name'
                  rules={[
                    {
                      required: true,
                      message: 'Please input your pension name!',
                    },
                  ]}
                >
                  <Input style={{ width: '100%' }} placeholder='pension name' />
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
                    {tierTypes.map((types, index) => (
                      <Option key={index} value={types}>
                        {types}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                {calculationType !== 'TIERS' ? (
                  <Form.Item
                    label='Calculation Value'
                    name='calculation_value'
                    rules={[
                      {
                        required: true,
                        message: 'Please input your calcu;ation value!',
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
                ) : null}
                <Form.Item>
                  <Form.Item
                    name='is_statutory'
                    rules={[
                      {
                        required: false,
                        message: 'Please input confirm if its statutory !',
                      },
                    ]}
                  >
                    <Checkbox checked={isStatutory} onChange={handleCheckbox}>
                      Is Statutory?
                    </Checkbox>
                  </Form.Item>
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
                            onConfirm={cancelEditPension}
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
              <Card type='inner' title='Pension'>
                <Table
                  dataSource={pensionItems}
                  columns={columns}
                  rowKey={(record) => record?.pension_id}
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

export default Pension;
