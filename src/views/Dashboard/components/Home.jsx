import React from 'react';
import { Card, Row, Col } from 'antd';
import SalaryLineChart from './SalaryLineChart';
import SalaryCard from './SalaryCard';
import JobCountAreaChart from './JobCountAreaChart';
import GenderCard from './GenderCard';
import SalaryByEarnings from './SalaryByEarnings';
import SalaryByDeductions from './SalaryByDeductions';
const Home = () => {
  return (
    <div>
      <Card bordered={false}>
        <Row gutter={[12, 12]}>
          <Col lg={6} md={24} sm={24} xs={24}>
            <GenderCard />
          </Col>
          <Col lg={18} md={24} sm={24} xs={24}>
            <SalaryLineChart />
          </Col>
          <Col lg={6} md={124} sm={24} xs={24}>
            <SalaryCard />
          </Col>
          <Col lg={18} md={24} sm={24} xs={24}>
            <JobCountAreaChart />
          </Col>
          <Col lg={12} md={24} sm={24} xs={24}>
            <SalaryByEarnings />
          </Col>
          <Col lg={12} md={24} sm={24} xs={24}>
            <SalaryByDeductions />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Home;
