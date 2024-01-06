import React, { useState, useEffect } from 'react';

import {
  Card,
  Form,
  Col,
  Row,
  InputNumber,
  Button,
  Select,
  Table,
  Popconfirm,
  message,
  Tag,
} from 'antd';
import { hrLookupConfigurationService } from '../../../_services';
import { EmployeeSearch } from '../../hr-reusables/EmployeeSearch';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';

const { Option } = Select;

const EmployeePayrollItem = (props) => {
  const [isEditing, setEditing] = useState(false);
  const [employeeConfigData, setEmployeeConfigData] = useState([]);
  const [activeConfiguration, setActiveConfiguration] = useState(null);
  const start_page = { page: 1, pageSize: 20 };
  const [total_elements, setTotalElements] = useState(10);
  const [page, setPage] = useState(1);
  const [staffNumber, setStaffNumber] = useState([]);
  const [itemType, setItemType] = useState([]);
  const [form] = Form.useForm();

  const handleEmployee = (employee) => {
    let staff_number = employee ? employee.staff_number : null;
    if (staff_number != null) {
      fetchEmployeeLookUp(staff_number);
    } else {
      setEmployeeConfigData([]);
    }
  };
  const fetchEmployeeLookUp = (e) => {
    setStaffNumber(e);
    hrLookupConfigurationService.getEmployeePayrollItem(e).then((response) => {
      let data = response?.data || [];
      setEmployeeConfigData(data?.content);
      setTotalElements(data?.page_details?.total_elements);
      setPage(data?.page_details?.page);
    });
  };
  const new_columns = [
    {
      title: 'Item Name',
      dataIndex: 'item_name',
      key: 'item_name',
    },
    {
      title: 'Amount',
      dataIndex: 'employee_item_amount',
      key: 'employee_item_amount',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, row) => (
        <>
          {isEditing &&
          activeConfiguration?.employee_payroll_item_id === row?.id ? (
            <Tag color='orange'>editing...</Tag>
          ) : (
            <Row className='d-flex justify-content-between'>
              <Col>
                <AiFillEdit
                  style={{ color: '#4082ff', cursor: 'pointer' }}
                  onClick={() => editConfiguration(row)}
                />
              </Col>
              <Col>
                <AiFillDelete
                  onClick={() => deletePayrollItem(row)}
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
  const fetchLookUp = (record) => {
    if (record) {
      hrLookupConfigurationService
        .fetchPayrollItemsByType(record)
        .then((response) => {
          setItemType(response.data.content);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const editConfiguration = (record) => {
    if (record) {
      form.setFieldsValue(record);
      setActiveConfiguration(record);
      setEditing(true);
    }
  };

  const deletePayrollItem = (record) => {
    if (record) {
      hrLookupConfigurationService
        .deleteEmployeePayrollItem(record?.employee_payroll_item_id)
        .then((resp) => {
          if (resp.status === 200) {
            message.success('Record deleted successfully!');
            hrLookupConfigurationService
              .getEmployeePayrollItem(staffNumber)
              .then((response) => {
                let data = response?.data || [];
                setEmployeeConfigData(data?.content);
                setTotalElements(data?.page_details?.total_elements);
              });
          }
        })
        .catch((error) => {});
    }
  };
  const cancelEditConfiguration = () => {
    setEditing(false);
    setActiveConfiguration(null);
    form.resetFields();
  };
  const handleTableChange = (data) => {
    let current_page = data?.current;
    setPage(current_page);
  };
  const handleSubmit = (values) => {
    //Update Configuration
    if (isEditing && activeConfiguration) {
      let val = {
        ...values,
        employee_payroll_item_id: activeConfiguration.employee_payroll_item_id,
        staff_number: staffNumber,
        payroll_item_id: activeConfiguration.payroll_item_id,
      };
      hrLookupConfigurationService
        .UpdateEmployeePayrollItem(
          activeConfiguration?.employee_payroll_item_id,
          val
        )
        .then((response) => {
          if (response.status === 201) {
            form.resetFields();
            hrLookupConfigurationService
              .getEmployeePayrollItem(staffNumber)
              .then((response) => {
                let data = response?.data || [];
                setEmployeeConfigData(data?.content);
               setTotalElements(data?.page_details?.total_elements);
                form.resetFields();
              });
            // fetchEmployeeLookUp()
            setActiveConfiguration(null);
            setEditing(false);
          } else {
            message.error(
              'An error occurred while updating wemployee configuration(s)'
            );
            setActiveConfiguration(null);
            setEditing(false);
          }
        })
        .catch((error) => {
          setActiveConfiguration(null);
          setEditing(false);
        });
    } else {
      let val = {
        ...values,
        staff_number: staffNumber,
      };
      //save configuration
      hrLookupConfigurationService
        .createEmployeePayrollItem(val)
        .then((response) => {
          if (response.status === 201) {
            message.success('Employee configuration saved successfully');
            form.resetFields();
            // fetchEmployeeLookUp()
            hrLookupConfigurationService
              .getEmployeePayrollItem(staffNumber)
              .then((response) => {
                let data = response?.data || [];
                setEmployeeConfigData(data?.content);
               setTotalElements(data?.page_details?.total_elements);
               form.resetFields();
              });
          } else {
            message.error(
              'An error occurred while saving employee configuration(s)'
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  return (
    <>
      <div style={{ padding: 10 }}>
        <Card style={{ backgroundColor: 'lightgray', height: '10%' }}>
          <Col span={6}>
            <EmployeeSearch employee={handleEmployee} />
          </Col>
        </Card>
        <Card>
          <Form
            layout='vertical'
            name='employeepayroll'
            onFinish={handleSubmit}
            form={form}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
              <Col md={24} lg={11}>
                <Card type='inner' title='New Payroll Item'>
                  <Form.Item
                    label='Item Type'
                    required={true}
                    name='item_type'
                    rules={[
                      {
                        required: true,
                        message: 'Item type is required!',
                      },
                    ]}
                  >
                    <Select
                      style={{ width: '100%' }}
                      allowClear
                      showSearch
                      placeholder='Select type'
                      onChange={(record) => fetchLookUp(record)}
                    >
                      <Option value={`DEDUCTION`} key={`DEDUCTION`}>
                        Deduction
                      </Option>
                      <Option value={`BENEFIT`} key={`BENEFIT`}>
                        Benefit
                      </Option>
                      <Option value={`EARNING`} key={`EARNING`}>
                        Earning
                      </Option>
                      <Option value={`GROSS`} key={`GROSS`}>
                        Gross Amount
                      </Option>
                      <Option value={`NHIF`} key={`NHIF`}>
                        NHIF
                      </Option>
                      <Option value={`PAYE`} key={`PAYE`}>
                        PAYE
                      </Option>
                      <Option value={`PENSION`} key={`PENSION`}>
                        Pension
                      </Option>
                      <Option value={`RELIEF`} key={`RELIEF`}>
                        Relief
                      </Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label='Item Name'
                    required={true}
                    name='payroll_item_id'
                    rules={[
                      {
                        required: true,
                        message: 'Please input item name!',
                      },
                    ]}
                  >
                    <Select
                      style={{ width: '100%' }}
                      allowClear
                      showSearch
                      placeholder=''
                      dropdownStyle={{ minWidth: '15%' }}
                    >
                      {itemType.map((item, index) => {
                        return (
                          <Option key={index} value={item.payroll_item_id}>
                            {item.item_name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label='Amount'
                    required={true}
                    name='employee_item_amount'
                    rules={[
                      {
                        required: true,
                        message: 'Please input amount!',
                      },
                    ]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder='amount'
                      min={0}
                    />
                  </Form.Item>
                  <Row>
                    <Row className='mt-2'>
                      <Col span={12}>
                        <Form.Item
                          style={{
                            textAlign: 'bottom-left',
                            marginRight: '4px',
                          }}
                        >
                          <Popconfirm
                            title='Discard changes?'
                            onConfirm={cancelEditConfiguration}
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
                            {isEditing ? 'Edit' : 'Save'}
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Row>
                </Card>
              </Col>
              <Col md={24} lg={13}>
                <Card type='inner' title='Employee Payroll Items'>
                  <Table
                    columns={new_columns}
                    dataSource={employeeConfigData}
                    onChange={handleTableChange}
                    rowKey={(record) => record?.employee_payroll_item_id}
                    size='small'
                    pagination={{
                      total: total_elements,
                      current: page,
                    }}
                  />
                </Card>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default EmployeePayrollItem;
