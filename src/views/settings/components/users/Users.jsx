import React, { useState, useEffect } from 'react';
import {
  Table,
  Tag,
  Form,
  Input,
  Select,
  Switch,
  Card,
  Button,
  Row,
  Col,
  Divider,
  message,
} from 'antd';
import { userService, hrRolesService } from '../../../../_services';
import { AiFillEdit, AiOutlineArrowLeft } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const Users = (props) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [createUser, setCreateUser] = useState(false);
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const goBack = () => {
    navigate(-1);
  };

  const fetchRoles = (params) => {
    setLoading(true);
    hrRolesService
      .fetchAllRoles(params)
      .then((resp) => {
        setDataSource(resp.data.content);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const fetchUsers = () => {
    setLoading(true);
    userService
      .fetchUser()
      .then((resp) => {
        setUsers(resp.data.content);
        setLoading(false);
      })
      .catch((err) => {
        console.log('ERROR', err);
        setLoading(false);
      });
  };

  const userColumns = [
    ...columns,
    {
      title: 'Action',
      key: 'action',
      width: '5%',
      render: (text, row) => (
        <Row className='d-flex justify-content-between'>
          <Col>
            <AiFillEdit
              style={{ color: '#4082ff', cursor: 'pointer' }}
              onClick={() => handleEdit(row)}
            />
          </Col>
        </Row>
      ),
    },
  ];

  const handleEdit = (row) => {
    console.log(row);
    setUser(row);
    form.setFieldsValue(row);
    setCreateUser(true);
    setEditing(true);
  };

  const handleChange = (index) => {
    setData(index.map((i) => dataSource[i]));
  };

  const handleBackTolist = (index) => {
    setCreateUser(false);
    setUser(null);
  };

  const handleSubmit = (values) => {
    if (editing) {
      setLoading(true);
      userService
        .editUser(user.username, values)
        .then((resp) => {
          message.success('User details updated successfully');
          setCreateUser(false);
          fetchUsers();
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      setLoading(true);
      userService
        .createUser(values)
        .then((resp) => {
          setLoading(false);
          message.success('User registered successfully');
          setCreateUser(false);
          fetchUsers();
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  console.log(createUser);
  return (
    <div id='content'>
      <Card>
        {!createUser ? (
          <Row justify='space-between'>
            <Col>
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
                  <span>User</span>
                </>
            </Col>
            <Col>
              <Button type='primary' size="small" onClick={() => setCreateUser(true)}>
                Create User
              </Button>
            </Col>
          </Row>
        ) : (
          <Row justify='space-between'>
            <Col>
              <h3>{user ? 'Edit User' : 'Create New User'}</h3>
            </Col>
            <Col>
              <Button
                onClick={() => goBack()}
                type='text'
                icon={<ArrowLeftOutlined />}
              >
                Back
              </Button>
            </Col>
          </Row>
        )}
        {createUser ? (
          <Card
            style={{ width: 600, marginLeft: 20 }}
            size='default'
            form={form}
          >
            <Form
              layout='vertical'
              name='users'
              onFinish={handleSubmit}
              form={form}
            >
              <Form.Item
                label={'Name'}
                hasFeedback
                name='name'
                rules={[
                  {
                    required: true,
                    message: 'Please input your name!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={'Username'}
                hasFeedback
                name='username'
                rules={[
                  {
                    required: true,
                    message: 'Please input your user name!',
                  },
                ]}
              >
                <Input disabled={user ? true : false} />
              </Form.Item>
              <Form.Item
                label={'Roles'}
                name='roles'
                rules={[
                  {
                    required: true,
                    message: 'Please select your roles!',
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
                  {dataSource.map((d) => (
                    <Option value={d.name} key={d.id}>
                      {d.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label={'Email'}
                hasFeedback
                name='email'
                rules={[
                  {
                    required: true,
                    message: 'Please input your email!',
                  },
                ]}
              >
                <Input disabled={user ? true : false} />
              </Form.Item>
              <Form.Item
                label={'Phone Number'}
                name='phone_number'
                rules={[
                  {
                    required: true,
                    message: 'Please input your phone number!',
                  },
                ]}
              >
                <Input maxLength={10} />
              </Form.Item>
              <Form.Item
                label={'Active'}
                name='enabled'
                rules={[
                  {
                    required: true,
                    message: 'Please input your status!',
                  },
                ]}
              >
                <Select>
                  <Option value={true} key='true'>
                    Active
                  </Option>
                  <Option value={false} key='false'>
                    Inactive
                  </Option>
                </Select>
              </Form.Item>
              <Divider style={{ marginBottom: 5 }} />
              <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                  <Button
                    onClick={handleBackTolist}
                    style={{ marginRight: 5 }}
                    type='primary'
                    danger
                  >
                    Cancel
                  </Button>
                  {user ? (
                    <Button loading={loading} type='primary' htmlType='submit'>
                      Edit
                    </Button>
                  ) : (
                    <Button loading={loading} type='primary' htmlType='submit'>
                      Save
                    </Button>
                  )}
                </Col>
              </Row>
            </Form>
          </Card>
        ) : (
          <Table
            dataSource={users}
            columns={userColumns}
            bordered
            size='small'
            rowKey={(record) => record.id}
            loading={loading}
          />
        )}
      </Card>
    </div>
  );
};

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Username',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: 'Roles',
    dataIndex: 'roles',
    key: 'roles',
    render: (roles) => (
      <span>
        {roles.map((role, i) => {
          let color = 'geekblue';
          return (
            <Tag color={color} key={i}>
              {role.toUpperCase()}
            </Tag>
          );
        })}
      </span>
    ),
  },
  {
    title: 'Phone Number',
    dataIndex: 'phone_number',
    key: 'phone_number',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Status',
    dataIndex: 'enabled',
    key: 'enabled',
    width: '5%',
    render: (text, row) =>
      text ? <Tag color='blue'>Active</Tag> : <Tag color='red'>Inactive</Tag>,
  },
];

export default Users;
