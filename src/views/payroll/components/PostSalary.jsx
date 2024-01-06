import React, { useState, useEffect } from 'react';

import {
  Card,
  Form,
  Col,
  Row,
  Button,
  notification,
  Select,
  Input,
  Popconfirm,
} from 'antd';
import { hrSalary } from '../../../_services';
import moment from 'moment';
import { monthNames } from '../../hr-reusables/PeriodFilters/months';
const { Option } = Select;
const monthFormat = 'M';
const yearFormat = 'YYYY';

const PostSalary = (props) => {
  const defMonth = moment().format(monthFormat);
  const defYear = moment().format(yearFormat);
  const [year, setYear] = useState(defYear);
  const [month, setMonthId] = useState(defYear);
  const [currentMonthName, setDefaultMonth] = useState(null);
  const [monthName, setMonthName] = useState(currentMonthName);
  const form = Form.useForm();

  useEffect(() => {
    var newArray = monthNames.filter(function (m) {
      return m.id === defMonth;
    });
    let monthName = newArray[0].name;
    let monthId = newArray[0].id;
    setDefaultMonth(monthName);
    // setMonth(monthId);
  }, [defMonth]);

  const months = (month) => {
    setMonthId(month)
    var newArray = monthNames.filter(function (m) {
      return m.id === month;
    });
    let monthName = newArray[0].name;
    setMonthName(monthName);
  };
  const handleSubmit = (values) => {
    let monthsName = monthName;
    let val = { year: values?.year || year, month: values?.month || month };
    hrSalary
      .postSalary(val)
      .then((response) => {
        if (response.status === 200) {
          notification.success({
            message: `Salary for ${monthsName}/${year} has been posted`,
          });
          form.resetFields();
        } else {
          notification.warn({
            message: 'There was an error while posting salaries',
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div>
        <Card>
          {/* <Row gutter={{ xs: 8, sm: 16, md: 24 }}> */}
            <Form
              layout='horizontal'
              onFinish={handleSubmit}
              name='postsalary'
            >
              <Row
                gutter={{ xs: 8, sm: 16, md: 24 }}
                style={{ paddingLeft: 5 }}
              >
                <Col span={8}>
                  <Form.Item label='Month'>
                    <Select
                      style={{ width: '100%' }}
                      allowClear
                      onChange={(m) => months(m)}
                      placeholder={currentMonthName}
                      showSearch
                    >
                      {monthNames.map((item, index) => {
                        return (
                          <Option key={index} value={item.id}>
                            {item.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label='Year'>
                    <Input placeholder='input year' disabled value={year} />
                  </Form.Item>
                </Col>
              </Row>
                <Form.Item style={{ textAlign: 'right' }}>
                  <Popconfirm
                    title='Are you sure you want to post salaries? This action is irreversible!'
                    onConfirm={handleSubmit}
                  >
                    <Button type='primary'> Post Salary</Button>
                  </Popconfirm>
                </Form.Item>
            </Form>
          {/* </Row> */}
        </Card>
      </div>
    </>
  );
};

export default PostSalary;
