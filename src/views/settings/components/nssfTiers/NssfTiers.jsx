import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Row,
  Select,
  Table,
  Tag,
  message,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { nssfTierColumns } from './Columns';
import {
  hrmisNssfTierService,
  hrCodesService,
  hrmisPension,
} from '../../../../_services';
import { AiFillEdit, AiOutlineArrowLeft, AiFillDelete } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const NssfTier = (props) => {
  const [createTier, setCreateTier] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(null);
  const [pension, setPension] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [nssfTiersName, setNssfTiersNames] = useState([]);
  const [calculationType, setCalculationType] = useState({
    calcType: null,
  });
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTiers();
    fetchCodes();
    fetchPension();
  }, [createTier]);

  const columns = [
    ...nssfTierColumns,
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <>
          {editValue?.tier_id === record?.tier_id ? (
            <Tag color='orange'>editing...</Tag>
          ) : (
            <Row className='d-flex justify-content-between'>
              <Col>
                <AiFillEdit
                  style={{ color: '#4082ff', cursor: 'pointer' }}
                  onClick={() => editTier(record)}
                />
              </Col>
              <Col>
                <AiFillDelete
                  onClick={() => deleteTier(record)}
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

  const editTier = (row) => {
    setEditValue(row);
    setCalculationType({
      ...calculationType,
      calcType: row?.calculation_type,
    });
    form.setFieldsValue(row);
    setEditing(true);
    setCreateTier(true);
  };

  const deleteTier = (row) => {
    hrmisNssfTierService
      .deleteTier(row?.id)
      .then((resp) => {
        message.success('Tier deleted successfully');
        fetchTiers();
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
  const fetchPension = () => {
    hrmisPension
      .fetchPension()
      .then((resp) => {
        setPension(resp?.data?.content || []);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchCodes = () => {
    hrCodesService
      .fetchCodes({ codeName: 'PENSIONTIER', isActive: true })
      .then((response) => {
        setNssfTiersNames(response.data.content || []);
      })
      .catch((error) => { });
  };

  const handleSubmit = (values) => {
    const { max_deduction, ...val } = values;
    if (editing) {
      let params = {
        max_deduction:
          calculationType?.calcType === 'RATE' ? max_deduction : undefined,
        ...val,
      };

      hrmisNssfTierService
        .editTier(editValue?.id, params)
        .then((resp) => {
          message.success('Nssf Tier updated successfully');
          form.resetFields();
          setCreateTier(false);
          setEditing(false);
          setEditValue(null);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      let params = {
        max_deduction:
          calculationType?.calcType === 'RATE' ? max_deduction : undefined,
        ...val,
      };

      hrmisNssfTierService
        .createTier(params)
        .then((resp) => {
          message.success('Nssf Tier created successfully');
          form.resetFields();
          setCreateTier(false);
          setEditing(false);
          setEditValue(null);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const handleClose = () => {
    setCreateTier(false);
    form.resetFields();
    setEditing(false);
    setEditValue(null);
    setCalculationType({
      ...calculationType,
      calcType: null,
    });
  };
  return (
    <div id='content'>
      <Card
        title={
          <>
            <AiOutlineArrowLeft
              onClick={() => navigate("/settings")}
              // className='arrow-left'
              style={{
                fontSize: '1.15em',
                cursor: 'pointer',
                marginRight: '10px',
              }}
            />
            <span>Nssf Tiers</span>
          </>
        }
      >
        <Form
          layout='vertical'
          name='nssftiers'
          onFinish={handleSubmit}
          form={form}
        >
          <Row gutter={24}>
            <Col lg={8} md={24} sm={24}>
              <Card title={'Create Tier'} type='inner'>
                <Form.Item
                  label='Tier Name'
                  style={{ marginBottom: 8 }}
                  name='tier_id'
                  rules={[
                    {
                      required: true,
                      message: 'Please input your holiday name!',
                    },
                  ]}
                >
                  <Select allowClear={true} showSearch>
                    {nssfTiersName.map((d) => (
                      <Option data_val={d.code} value={d.code_id} key={d.id}>
                        {d.code_value}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label='Pension'
                  name='pension_id'
                  rules={[
                    {
                      required: true,
                      message: 'Please specify your pension!',
                    },
                  ]}
                >
                  <Select allowClear={true} showSearch>
                    {pension.map((pension) => (
                      <Option
                        value={pension.pension_id}
                        key={pension.pension_id}
                      >
                        {pension.pension_name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label={'Limit'}
                  name='tier_limit'
                  rules={[
                    {
                      required: true,
                      message: 'Please input calcType limit!',
                    },
                  ]}
                >
                  <InputNumber style={{ width: '100%' }} min={1} />
                </Form.Item>
                <Form.Item
                  label={'Calculation Type'}
                  name='calculation_type'
                  rules={[
                    {
                      required: true,
                      message: 'Please input your calc type!',
                    },
                  ]}
                >
                  <Select
                    style={{ width: '100%' }}
                    allowClear
                    showSearch
                    placeholder=''
                    onChange={(record) =>
                      setCalculationType({
                        ...calculationType,
                        calcType: record,
                      })
                    }
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
                  label={'Deduction'}
                  name='deduction'
                  rules={[
                    {
                      required: true,
                      message: 'Please input your deduction!',
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    max={calculationType?.calcType === 'RATE' ? 100 : Infinity}
                    formatter={(value) =>
                      calculationType?.calcType === 'RATE'
                        ? `${value}%`
                        : `${value}`
                    }
                  />
                </Form.Item>
                {calculationType?.calcType === 'RATE' ? (
                  <Form.Item
                    label={'Maximum Deduction'}
                    name='max_deduction'
                    rules={[
                      {
                        required: true,
                        message: 'Please input max deduction!',
                      },
                    ]}
                  >
                    <InputNumber style={{ width: '100%' }} min={1} />
                  </Form.Item>
                ) : null}
                <Row className='mt-4'>
                  <Col span={24} style={{ textAlign: 'right' }}>
                    <Popconfirm
                      title='Discard changes?'
                      okText='Yes'
                      cancelText='No'
                      onConfirm={handleClose}
                    >
                      <Button type='primary' danger>
                        Cancel
                      </Button>
                    </Popconfirm>

                    <Button
                      type='primary'
                      htmlType='submit'
                      style={{ marginLeft: 8 }}
                      loading={false}
                    >
                      {editing ? 'Edit' : 'Save'}
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col lg={16} md={24} sm={24}>
              <Table
                columns={columns}
                size='small'
                dataSource={tiers}
                bordered
                rowKey={(record) => record.tier_id}
              />
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default NssfTier;
