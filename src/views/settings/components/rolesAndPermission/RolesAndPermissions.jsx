import React, { useState, useEffect } from 'react';
import Aos from 'aos';
import 'aos/dist/aos.css';
import {
  Card,
  Button,
  Table,
  Tag,
  Row,
  Col,
  Popconfirm,
  Form,
  Input,
  Switch,
  Select,
  message,
} from 'antd';
import AssignPermissions from './AssignPermissions';
import { hrmisPermission, hrRolesService } from '../../../../_services';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const { Option } = Select;

const Roles = (props) => {
  const start_page = { page: 1, pageSize: 10 };
  const [page, setPage] = useState(start_page);
  const [total_elements, setTotalElements] = useState(0);
  const [searchParams, setSearchParams] = useState({ ...start_page });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showAddRole, setShowAddRole] = useState(false);
  const [showAssignPermission, setShowAssignPermission] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [editValue, setEditValue] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState([]);
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    hrmisPermission
      .fetchPermission()
      .then((resp) => {
        setPermissions(resp.data.content);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    //animation code
    Aos.init();
  }, []);

  useEffect(() => {
    fetchRoles(searchParams);
  }, [searchParams]);

  const fetchRoles = (params) => {
    setLoading(true);
    hrRolesService
      .fetchAllRoles(params)
      .then((resp) => {
        setDataSource(resp.data.content);
        setLoading(false);
        setTotalElements(resp.data?.page_details?.total_elements || 10);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const rolesColumns = [
    {
      title: 'Role Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Button type='link' onClick={() => handleRoles(record)}>
          {text}
        </Button>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '50%',
      render: (text) => <div>{text}</div>,
    },
    {
      title: 'Status',
      dataIndex: 'disabled',
      key: 'disabled',
      width: '12%',
      render: (text, row) =>
        text === true ? (
          <Tag color='red'> Inactive</Tag>
        ) : (
          <Tag color='blue'> Active</Tag>
        ),
    },
    {
      title: 'Action',
      dataIndex: 'edit',
      key: 'edit',
      width: '9%',
      render: (text, record) => (
        <>
          <Row className='d-flex justify-content-between'>
            <Col>
              <AiFillEdit
                style={{ color: '#4082ff', cursor: 'pointer' }}
                onClick={() => handleEditRole(record)}
              />
            </Col>
            <Col>
              <AiFillDelete
                onClick={() => deleteRole(record)}
                style={{
                  color: 'red',
                  marginLeft: '6px',
                  cursor: 'pointer',
                }}
              />
            </Col>
          </Row>
        </>
      ),
    },
  ];

  const handleEditRole = (record) => {
    console.log("Record \t", record)
    setEditValue(record);
    setShowAddRole(true);
    setEditing(true);
    form.setFieldsValue(record);
  };
  const deleteRole = (record) => {
    hrRolesService
      .deleteRole(record.id)
      .then((resp) => {
        message.success('User Role deleted successfully');
        setLoading(false);
        setTotalElements(resp.data?.page_details?.total_elements);
        fetchRoles();
      })
      .catch((err) => {
        setLoading(true);
      });
  };

  const handleDetails = () => {
    setShowAddRole(false);
    setEditValue([]);
    setEditing(false);
    setShowAssignPermission(false);
  };

  const handleRoles = (record) => {
    setShowAddRole(false);
    setShowAssignPermission(true);
    setSelectedRole(record);
  };

  const handleChange = (index) => {
    setData(index.map((i) => permissions[i]));
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
      let content = (data || []).map((item) => ({
        id: item.id,
        name: item.name,
        permission_group: item.permission_group,
      }));

      let params = {
        ...values,
        permission_data: content ? content : null,
      };

      hrRolesService
        .editRole(params, editValue.id)
        .then((resp) => {
          message.success('Role updated successfully');
          setShowAddRole(false);
          setLoading(false);
          fetchRoles();
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      setLoading(true);
      let content = (data || []).map((item) => ({
        id: item.id,
        name: item.name,
        permission_group: item.permission_group,
      }));

      let params = {
        ...values,
        permission_data: content ? content : null,
      };

      hrRolesService
        .createRole(params)
        .then((resp) => {
          message.success('Role created successfully');
          setLoading(false);
          setShowAddRole(false);
          fetchRoles();
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };
  return (
    <div id="content">
      <Card
        type='inner'
        title={
          <>
            {showAddRole ? (
              <>
                <ArrowLeftOutlined
                  onClick={() => handleDetails()}
                  className='arrow-left'
                  style={{
                    fontSize: '1.15em',
                    cursor: 'pointer',
                    marginRight: '10px',
                  }}
                />
                <span>{editing ? 'Edit Roles' : 'Create New Role'}</span>
              </>
            ) : showAssignPermission ? (
              <>
                <ArrowLeftOutlined
                  onClick={() => handleDetails()}
                  className='arrow-left'
                  style={{
                    fontSize: '1.15em',
                    cursor: 'pointer',
                    marginRight: '10px',
                  }}
                />
                <span>Assign Permission:</span>
              </>
            ) : (
              <>
                <ArrowLeftOutlined
                  onClick={() => navigate('/settings')}
                  className='arrow-left'
                  style={{
                    fontSize: '1.15em',
                    cursor: 'pointer',
                    marginRight: '10px',
                  }}
                />
                <span>Roles</span>
              </>
            )}
          </>
        }
        extra={
          <Button
            hidden={showAddRole || showAssignPermission}
            size='small'
            type='primary'
            onClick={() => setShowAddRole(true)}
          >
            {editing ? 'Edit Roles' : 'Create New Role'}
          </Button>
        }
      >
        {showAddRole ? (
          <Card type='inner'>
            <Form
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 16 }}
              // layout='vertical'
              name='roles'
              onFinish={handleSubmit}
              form={form}
            >
              <Col span={16}>
                <Form.Item
                  label={'Role Name'}
                  name='name'
                  rules={[
                    {
                      required: true,
                      message: 'Please input role name!',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item
                  label={'Description'}
                  name='description'
                  rules={[
                    {
                      required: true,
                      message: 'Please input your holiday name!',
                    },
                  ]}
                >
                  <TextArea />
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item
                  label={'Disable'}
                  name='disabled'
                  rules={[
                    {
                      required: true,
                      message: 'Please input your holiday name!',
                    },
                  ]}
                >
                  <Switch />
                </Form.Item>
              </Col>
              {!editing && (
                <Col span={16}>
                  <Form.Item
                    label={'Permissions'}
                    name='permission_data'
                    rules={[
                      {
                        required: false,
                        message: 'Please input your permissions data!',
                      },
                    ]}
                  >
                    <Select
                      mode='multiple'
                      size='default'
                      placeholder='Please select'
                      onChange={handleChange}
                      style={{ width: '100%' }}
                    >
                      {permissions &&
                        permissions.map((item, index) => (
                          <Option key={index} value={index}>
                            {item.name}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
              )}
              <Row className='mt-2'>
                <Col span={14} className='d-flex justify-content-end'>
                  <Button
                    style={{ marginLeft: 20 }}
                    type='primary'
                    htmlType='submit'
                    loading={loading}
                  >
                    {editing ? 'Edit Role' : 'Create Role'}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        ) : showAssignPermission ? (
          <AssignPermissions
            selectedRole={selectedRole}
            handleDetails={handleDetails}
          />
        ) : (
          <Col
            data-aos='fade-up'
            data-aos-easing='ease-out-cubic'
            data-aos-duration='1200'
          >
            <Table
              style={{ marginTop: 2 }}
              loading={loading}
              bordered
              dataSource={dataSource}
              columns={rolesColumns}
              size='small'
              rowKey={(record) => record.id}
              onChange={handleTableChange}
              pagination={{
                current: page?.page,
                pageSize: 10,
                total: total_elements,
              }}
            />
          </Col>
        )}
      </Card>
    </div>
  );
};

export default Roles;
