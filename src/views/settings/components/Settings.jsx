import React, { useEffect, useState } from 'react';
import { Card, Row, Col, List, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import {
  ContainerTwoTone,
  PlayCircleTwoTone,
  MoneyCollectTwoTone,
  ProfileTwoTone,
  UserOutlined,
  ReadOutlined
} from '@ant-design/icons';
import { UilWallet, UilCheck } from '@iconscout/react-unicons';

const Settings = () => {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    setDataSource(data);
  }, []);

  return (
    <div id='content'>
      <Card size='small' title='Settings'>
        <Row gutter={16}>
          <Col span={24}>
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 2,
                lg: 3,
                xl: 3,
                xxl: 3,
              }}
              dataSource={dataSource}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={item.icon}
                        size={'default'}
                        style={{ lineHeight: 'unset' }}
                      />
                    }
                    title={
                      <Link style={{ textDecoration: 'none' }} to={item.route}>
                        {item.title}
                      </Link>
                    }
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};
const data = [
  {
    title: 'Payroll Item Configurations',
    route: '/settings/payrollitem',
    description: 'Payroll Items',
    icon: (
      <UilWallet
        style={{
          color: 'red',
        }}
      />
    ),
  },
  {
    title: 'Relief',
    route: 'relief',
    description: 'Reliefs',
    icon: (
      <ContainerTwoTone
        style={{
          position: 'absolute',
          top: '7px',
          left: '7.5px',
        }}
      />
    ),
  },
  {
    title: 'Pension',
    route: '/settings/pension',
    description: 'Pension schemes',
    icon: (
      <PlayCircleTwoTone
        style={{
          position: 'absolute',
          top: '7px',
          left: '7.5px',
        }}
      />
    ),
  },
  {
    title: 'NHIF Brackets',
    route: '/settings/nhifbracket',
    description: 'Nhif Bracket',
    icon: (
      <MoneyCollectTwoTone
        style={{
          position: 'absolute',
          top: '7px',
          left: '7.5px',
        }}
      />
    ),
  },
  {
    title: 'PAYE Brackets',
    route: '/settings/payebrackets',
    description: 'Paye Brackets',
    icon: (
      <PlayCircleTwoTone
        style={{
          position: 'absolute',
          top: '7px',
          left: '7.5px',
        }}
      />
    ),
  },
  {
    title: 'Bank Management',
    route: '/settings/bankmanagement',
    description: 'Bank Management',
    icon: (
      <PlayCircleTwoTone
        style={{
          position: 'absolute',
          top: '7px',
          left: '7.5px',
        }}
      />
    ),
  },
  {
    title: 'General Parameters',
    route: '/settings/generalparameters',
    description: 'General Parameters',
    icon: (
      <PlayCircleTwoTone
        style={{
          position: 'absolute',
          top: '7px',
          left: '7.5px',
        }}
      />
    ),
  },
  {
    title: 'Users',
    route: '/settings/users',
    description: 'Users',
    icon: (
      <UserOutlined
        style={{
          color: 'black',
          position: 'absolute',
          top: '7px',
          left: '7.5px',
        }}
      />
    ),
  },
  {
    title: 'Roles and Permissions',
    route: '/settings/rolesandpermissions',
    description: 'Pension schemes',
    icon: (
      <ReadOutlined
        style={{
          position: 'absolute',
          top: '7px',
          left: '7.5px',
        }}
      />
    ),
  },
  {
    title: 'Nssf Tier Management',
    route: '/settings/nssftiers',
    description: 'Nssf Tier Management',
    icon: (
      <PlayCircleTwoTone
        style={{
          color: 'blue',
        }}
      />
    ),
  },
  {
    title: 'Approval Configuration',
    route: '/settings/approval',
    description: 'Pension schemes',
    icon: (
      <UilCheck
        style={{
          color: "green",        }}
      />
    ),
  },
  {
    title: 'Global Configuration',
    route: '/settings/globalconfig',
    description: 'Global Configuration',
    icon: (
      <PlayCircleTwoTone
        style={{
          position: 'absolute',
          top: '7px',
          left: '7.5px',
        }}
      />
    ),
  },
];

export default Settings;
