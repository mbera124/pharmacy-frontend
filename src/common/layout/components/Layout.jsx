import React, { useEffect } from 'react';
import {
  LogoutOutlined,
  CopyrightCircleOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LaptopOutlined,
  NotificationOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Button, Layout, Menu, Modal, theme, Input } from 'antd';
import {
  Routes,
  Route,
  Outlet,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { useState } from 'react';
import { NavigationItems } from '../../../config/navigation';
import './assets/css/index.css';
import logo from './assets/images/icon.png';
import './assets/layout.css';
const { Header, Content, Footer, Sider } = Layout;

const Home = () => {
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);
  const [color, setColor] = useState(
    localStorage.getItem('siderColor') || '#200637'
  );
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('hr_id');
    navigate('/login');
  };
  const [item, setItem] = useState(null);

  useEffect(() => {
    if (item && window.innerWidth < 768) {
      setCollapsed(window.innerWidth < 768);
    }
    const handleResize = () => {
      setCollapsed(window.innerWidth < 768); // Update collapsed state when screen size changes
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [item]);

  const handleMenuClick = (item) => {
    setItem(item);
    navigate(item.key);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* <Layout> */}
      <Header
        style={{
          flex: '0 0 auto',
          position: 'fixed', // Fix the header position
          top: 0, // Position at the top of the viewport
          zIndex: 1, // Ensure the header is above other elements
          width: '100%', // Make the header span the full width
          alignItems: 'center',
          background: '#302c94',
          padding: '0 16px', // Add padding to the header for the logo and button alignment
          display: 'flex',
          justifyContent: 'space-between', // To align the logo, button, and app name
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={logo}
            alt='Logo'
            style={{ width: '32px', height: '32px', marginRight: '8px' }}
          />
          <span
            style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}
            onClick={logout}
          >
            Smart HR
          </span>
          <Button
            type='text'
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
              color: 'white',
              marginLeft: '90px',
              display: collapsed ? 'none' : 'block',
            }}
          />
        </div>
        <Button
          onClick={logout}
          style={{
            cursor: 'pointer',
            marginTop: '8px',
            display: collapsed ? 'none' : 'block',
          }}
          icon={<LogoutOutlined />}
        >
          Logout
        </Button>
        <Button
          type='text'
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64,
            color: 'white',
            display: collapsed ? 'block' : 'none',
          }}
        />
      </Header>
      <Content
        style={{
          padding: '64px 0px 0px 0px',
          overflow: 'auto', // Prevent content from overflowing when sidebar is collapsed
        }}
      >
        <Layout style={{ padding: '0px 0', background: 'brown' }}>
          <Sider
            style={{
              background: 'whitesmoke',
              width: '280px',
              borderRight: '3px solid lightgray',
              display: collapsed ? 'none' : 'block',
              overflowY: 'auto',
              flex: '0 0 auto',
              height: 'calc(100vh - 64px)',
              position: 'sticky', // Make the sidebar sticky
              top: '0px', // Adjust the top position to account for the fixed header
              // marginBottom:'30px'
            }}
            width={280}
            collapsed={collapsed}
            trigger={null} 
            collapsible
          >
            {/* <div style={{ height: 'calc(100vh - 64px)' }}> */}
            <Menu
              theme={color}
              defaultSelectedKeys={[useLocation().pathname]}
              defaultOpenKeys={['/home']}
              mode='inline'
              items={NavigationItems}
              onClick={handleMenuClick}
            />
            {/* </div> */}
          </Sider>
          <div style={{ display: 'flex', flexGrow: 1, overflowY: 'hidden' }}>
            <Content
              style={{
                flex: '1 1 auto',
                padding: '0 0px',
                overflow: 'auto', // Prevent content from overflowing when sidebar is collapsed
              }}
            >
              <div className={'outer-outlet'}>
                <div className={'outlet'}>
                  <Outlet />
                </div>
              </div>
            </Content>
          </div>
        </Layout>
      </Content>
      <Footer
        style={{
          flex: '0 0 auto',
          position: 'fixed', // Fix the footer position
          bottom: 0, // Position at the bottom of the viewport
          zIndex: 1, // Ensure the footer is above other elements
          width: '100%', // Make the footer span the full width
          textAlign: 'center',
          background: '#9d3d2c',
          color: 'white',
          marginTop: '2px',
          padding: '3px 0',
          // height: '1%', // Reduce the height of the footer
        }}
      >
        Smart HR ©2023 powered By Smart Applications
      </Footer>
      {/* </Layout> */}
    </div>
  );
};

export default Home;
