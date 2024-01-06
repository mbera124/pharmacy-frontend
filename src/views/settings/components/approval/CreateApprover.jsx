import React, { useState, useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import {
  Card,
  Row,
  Col,
  Table,
  Form,
  Input,
  Popconfirm,
  Button,
  Select,
  message,
  Tag,
  Icon,
  InputNumber,
  PageHeader,
} from "antd";
import { hrCodesService } from "_services";
import { Msg } from "common/i18n";
import { EmployeeSearch } from "../../hr-reusables/EmployeeSearch";
import { hrmisApprovalService } from "_services";

const { Option } = Select;

const CreateApprover = ({ approval, ...props }) => {
  const start_page = { page: 1, pageSize: 10 };
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(start_page);
  const [total_elements, setTotalElements] = useState(0);
  const [searchParams, setSearchParams] = useState({ ...start_page });
  const [staffNumber, setStaffNo] = useState(null);
  const [department, setDepartment] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [approverData, setApproverData] = useState([]);
  const [employeeName, setEmployeeName] = useState(null);
  const { getFieldDecorator } = props.form;

  useEffect(() => {
    //animation code
    Aos.init();
  }, []);

  const approverColumns = [
    ...columns,
    {
      title: "Action",
      key: "action",
      width: "10%",
      render: (text, record) => (
        <Row>
          <Popconfirm
            title={<Msg phrase={"Are you sure?"} />}
            okText={<Msg phrase={"Yes"} />}
            cancelText={<Msg phrase={"No"} />}
            onConfirm={() => handleRemove(record)}
          >
            <Icon type="delete" style={{ color: "red", marginLeft: "10px" }} />
          </Popconfirm>
        </Row>
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    hrCodesService
      .fetchCodes({ codeName: "DEPARTMENT" })
      .then((resp) => {
        setDepartment(resp.data.content);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleTableChange = (data) => {
    let current_page = { page: data.current, pageSize: 10 };
    let params = {
      ...searchParams,
      ...current_page,
    };

    setSearchParams(params);
    setPage(current_page);
  };

  const handleEmployee = (data) => {
    setEmployeeName(data?.full_name);
    setStaffNo(data?.staff_number);
  };

  const handleChange = (index) => {
    setDepartmentData(index.map((i) => department[i]));
  };

  const addItem = (e) => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        if (staffNumber === null) message.warn("Please select an employee");
        const { approval_level } = values;
        let approverDetails = {
          module_name: approval.module_name,
          approval_level,
          staff_number: staffNumber,
          departments: departmentData,
          employee_name: employeeName,
        };

        let newData = [...approverData, approverDetails];
        let approvalData = newData.map((items, index) => ({
          ...items,
          key: index + 1,
        }));

        setApproverData(approvalData);
        props.form.resetFields();
      }
    });
  };

  const handleSubmit = () => {
    if (approverData.length < 1) {
      message.warn("Please add an approver");
    } else {
      setLoading(true);
      hrmisApprovalService
        .createApprover(approverData)
        .then((resp) => {
          message.success("Approver created successfully");
          setLoading(false);
          props.setCreateApprover(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  const handleRemove = (record) => {
    let arr = approverData.filter((items) => items.key !== record.key);
    setApproverData(arr);
  };

  return (
    <div id="content">
      <Row gutter={12}>
        <Col span={24}>
          <Form layout="vertical" onSubmit={addItem}>
            <PageHeader
              title="Approvers"
              onBack={() => props.setCreateApprover(false)}
            />

            <Col
              lg={8}
              md={24}
              sm={24}
              data-aos="fade-down"
              data-aos-easing="ease-out-cubic"
              data-aos-duration="2000"
            >
              <Card title={"Create Approver"} type="inner">
                <Row>
                  <Form.Item label="Employee">
                    <EmployeeSearch employee={handleEmployee} required={true} />
                  </Form.Item>
                  <Form.Item label="Approval Departments">
                    {getFieldDecorator("department", {
                      rules: [
                        {
                          required: true,
                          message: "Please input department name!",
                        },
                      ],
                    })(
                      <Select
                        mode="multiple"
                        size="default"
                        placeholder="Please select"
                        onChange={handleChange}
                      >
                        {department &&
                          department.map((item, index) => (
                            <Option key={index} value={index}>
                              {item.code_value}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item label={<Msg phrase={"Approval Level"} />}>
                    {getFieldDecorator("approval_level", {
                      initialValue: "",
                      rules: [
                        {
                          required: true,
                          message: <Msg phrase={"Select the level"} />,
                        },
                      ],
                    })(
                      <InputNumber min={1} max={4} style={{ width: "100%" }} />
                    )}
                  </Form.Item>
                </Row>
                <Row>
                  {editing ? (
                    <Row>
                      <Col span={12}>
                        <Form.Item style={{ textAlign: "right" }}>
                          <Button type="primary" htmlType="submit">
                            Edit
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  ) : (
                    <Col>
                      <Form.Item style={{ textAlign: "right" }}>
                        <Button type="primary" htmlType="submit">
                          Add
                        </Button>
                      </Form.Item>
                    </Col>
                  )}
                </Row>
              </Card>
            </Col>
          </Form>
          <Col lg={16} md={24} sm={24}>
            <Col>
              <Table
                bordered
                columns={approverColumns}
                loading={loading}
                dataSource={approverData}
                size="small"
                onChange={handleTableChange}
                pagination={{
                  current: page?.page,
                  pageSize: 10,
                  total: total_elements,
                }}
                rowKey={(record) => record.key}
              />
            </Col>
            <Col style={{ textAlign: "right", marginTop: 8 }}>
              <Button loading={loading} onClick={handleSubmit} type="primary">
                <Msg phrase={"Submit"} />
              </Button>
            </Col>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

const columns = [
  {
    title: "Employee Name",
    dataIndex: "employee_name",
    key: "employee_name",
  },
  {
    title: "Department",
    dataIndex: "departments",
    key: "departments",
    render: (departments) => (
      <span>
        {departments.map((data, i) => {
          let color = "geekblue";
          return (
            <Tag color={color} key={i}>
              <Msg phrase={data?.code_value} />
            </Tag>
          );
        })}
      </span>
    ),
  },
  {
    title: "Module Name",
    dataIndex: "module_name",
    key: "module_name",
  },
  {
    title: "Approval Level",
    dataIndex: "approval_level",
    key: "approval_level",
  },
];

const WrappedCreateApproverForm = Form.create({
  name: "create_approver",
})(CreateApprover);
export default WrappedCreateApproverForm;
