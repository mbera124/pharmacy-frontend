import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Tag, Spin, Divider } from 'antd';
import { leaveApplication } from '../../../_services';
import { getUser } from '../../../_helpers/globalVariables';

const LeaveDays = ({ activeTab }) => {
  let time = new Date().toLocaleTimeString();
  const [ctime, setCTime] = useState(time);
  const [loading, setLoading] = useState(false);
  const [leaveDays, setLeaveDays] = useState([]);
  const user = getUser();

  useEffect(() => {
    if (activeTab === 'leavedays') {
      setLoading(true);
      leaveApplication
        .fetchLeaveBalances({ employeeUserName: user?.user_name })
        .then((resp) => {
          setLeaveDays(resp.data.content[0].leave_state_data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [user, activeTab]);

  const updateTime = () => {
    time = new Date().toLocaleTimeString();
    setCTime(time);
  };

  setInterval(updateTime, 1000);

  return (
    <div>
      <Card bodyStyle={{ backgroundColor: '#FFFFFF' }}>
        <Col className='text-align-right mb-2'>
          <Tag color='blue'>
            <b style={{ fontSize: 12 }}>{ctime}</b>
          </Tag>
        </Col>
        {loading ? (
          <Col className='justify-content-center'>
            <Spin />
          </Col>
        ) : (
          <>
            <Row gutter={[8, 8]}>
              {leaveDays.map((item) => (
                <Col
                  lg={8}
                  md={12}
                  sm={12}
                  className='d-flex'
                  key={item.leave_type_id}
                >
                  <Card
                    title={item.leave_type_name}
                    style={{
                      width: '100%',
                      margin: '20px',
                      borderRadius: '30px',
                      overflow: 'hidden',
                    }}
                    headStyle={{
                      backgroundColor: '#87CEEB',
                      fontWeight: 'bold',
                    }}
                    bodyStyle={{ backgroundColor: '#F5F5F5F5' }}
                    hoverable
                  >
                    <Col span={6}>
                      <p>Accrued</p>
                      <p className='p'>{item.total_accrual}</p>
                    </Col>
                    <Col span={2}>
                      <Divider
                        type='vertical'
                        style={{ height: '60px', backgroundColor: '#808080' }}
                      />
                    </Col>
                    <Col span={6}>
                      <p>Balance</p>
                      <p className='p'>{item.total_balance}</p>
                    </Col>
                    <Col span={2}>
                      <Divider
                        type='vertical'
                        style={{ height: '60px', backgroundColor: '#808080' }}
                      />
                    </Col>
                    <Col span={6}>
                      <p>Consumed</p>
                      <p className='p '>{item.total_consumed}</p>
                    </Col>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
      </Card>
    </div>
  );
};

export default LeaveDays;
