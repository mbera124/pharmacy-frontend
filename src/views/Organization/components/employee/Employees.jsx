import { Table, Button, List, Card, Avatar, Col, Row } from 'antd';
import Meta from 'antd/es/card/Meta';
import React, { useEffect, useState } from 'react';
import { hrEmployeeService } from '../../../../_services';
import user from '../../../../../src/common/layout/components/assets/images/user.png';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const EmployeeList = () => {
  const [data, setData] = useState([]);
  const [isKanbanView, setIsKanbanView] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getEmployees();
  }, []);
  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'imageData',
      key: 'imageData',
      render: () => (
        <Avatar
          src={data.imageData ? `data:image/*;base64,${data.imageData}` : user}
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: 'Staff Number',
      dataIndex: 'staff_number',
      key: 'staff_number',
    },
    {
      title: 'Email',
      dataIndex: 'email_address',
      key: 'email_address',
    },
    {
      title: 'mobile',
      dataIndex: 'tel_number',
      key: 'tel_number',
    },
    {
      title: 'Job Category',
      dataIndex: 'employee_category_name',
      key: 'employee_category_name',
    },
    {
      title: 'Dept',
      dataIndex: 'department_name',
      key: 'department_name',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
       render: (text, record) => (
            <Row className='d-flex justify-content-between'>
              <Col>
                <AiFillEdit
                  style={{ color: '#4082ff', cursor: 'pointer' }}
                  onClick={() => editEmployee(record)}
                />
              </Col>
            </Row>
      ),
    },
  ];

  const editEmployee = (record) => {
    console.log('Holiday \t', record);
  };

  const getEmployees = () => {
    hrEmployeeService
      .fetchAllEmployees()
      .then((response) => {
        console.log('response', response);
        setData(response.data.content);
      })
      .catch((error) => {});
  };
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
  };

  const toggleView = () => {
    setIsKanbanView(!isKanbanView);
  };

  return (
    <div id='content'>
      <Card bordered={false}>
        <Button onClick={toggleView}>
          {isKanbanView ? 'Switch to List View' : 'Switch to Kanban View'}
        </Button>
        {isKanbanView ? (
          <List
            grid={{
              gutter: 16,
              xs: 1, // On small screens, display 1 card per row
              sm: 2, // On medium screens, display 2 cards per row
              md: 3, // On large screens, display 3 cards per row
              lg: 4, // On extra-large screens, display 4 cards per row
              xl: 4, // On extra-extra-large screens, display 4 cards per row
            }}
            dataSource={data}
            renderItem={(data) => (
              <List.Item>
                <Card style={{ width: 300 }}>
                  <Meta
                    avatar={
                      <Avatar
                        src={
                          data.imageData
                            ? `data:image/*;base64,${data.imageData}`
                            : user
                        }
                      />
                    }
                    title={data.first_name}
                  />
                </Card>
              </List.Item>
            )}
            onDragEnd={onDragEnd}
          />
        ) : (
          <Table columns={columns} dataSource={data} />
        )}
      </Card>
    </div>
  );
};

export default EmployeeList;
