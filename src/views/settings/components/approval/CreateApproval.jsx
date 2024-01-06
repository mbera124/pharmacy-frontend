import React, { useState, useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import {
  Card,
  Row,
  Col,
  Form,
  Select,
  InputNumber,
  Button,
  Table,
  Popconfirm,
  message,
} from "antd";
import Approvers from "./Approvers";
import { Msg } from "common/i18n";
import { hrmisApprovalService } from "_services";

const { Option } = Select;

const CreateApproval = ({ activeTab, ...props }) => {
  const [showApprover, setShowApprover] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [approvedData, setApprovedData] = useState([]);
  const [editValue, setEditValue] = useState([]);
  const [approval, setApproval] = useState(null);
  const { getFieldDecorator } = props.form;

  useEffect(() => {
    //animation code
    Aos.init();
  }, []);

  let approvalColumns = [
    ...columns,
    {
      title: "Action",
      key: "action",
      width: "10%",
      render: (text, row) => (
        <>
          <Button onClick={() => handleApprover(row)} type="primary">
            Manage Approvers
          </Button>
        </>
      ),
    },
  ];

  useEffect(() => {
    if (activeTab === "approver") {
      fetchApprovals();
    }
  }, [activeTab]);

  const fetchApprovals = () => {
    setLoading(true);
    hrmisApprovalService
      .fetchApprovals()
      .then((resp) => {
        setApprovedData(resp.data.content);
        setLoading(false);
      })
      .catch((err) => {
        console.log("error data \t", err);
        setLoading(false);
      });
  };

  const handleApprover = (row) => {
    setShowApprover(true);
    setApproval(row);
  };

  const cancelEditConfiguration = () => {
    setEditValue(null);
    props.form.resetFields();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      setLoading(true);
      hrmisApprovalService
        .createApprovals(values)
        .then((resp) => {
          message.success("Approval level created successfully");
          setLoading(false);
          fetchApprovals();
        })
        .catch((err) => {
          console.log("error");
          setLoading(false);
        });
    });
  };
  return (
    <div>
      <Card>
        <Row gutter={12}>
          <Col span={24}>
            <Form>
              {showApprover === false && (
                <>
                  <Col
                    lg={8}
                    md={24}
                    sm={24}
                    data-aos="fade-down"
                    data-aos-easing="ease-out-cubic"
                    data-aos-duration="2000"
                  >
                    <Form layout="vertical" onSubmit={handleSubmit}>
                      <Card title="Approval Configuration" type="inner">
                        <Row gutter={8} className="justify-content-center">
                          <Form.Item label={<Msg phrase={"Approval Module"} />}>
                            {getFieldDecorator("module_name", {
                              initialValue: editValue
                                ? editValue.module_name
                                : "",
                              rules: [
                                {
                                  required: false,
                                  message: (
                                    <Msg phrase={"Approval is required"} />
                                  ),
                                },
                              ],
                            })(
                              <Select style={{ width: "100%" }}>
                                <Option value="Leave" key="leave_approval">
                                  {" "}
                                  <Msg phrase={"Leave Approval"} />
                                </Option>
                              </Select>
                            )}
                          </Form.Item>
                          <Form.Item
                            label={<Msg phrase={"No of Levels/Stages"} />}
                          >
                            {getFieldDecorator("no_of_approveres", {
                              initialValue: editValue
                                ? editValue.no_of_approveres
                                : "",
                              rules: [
                                {
                                  required: true,
                                  message: (
                                    <Msg
                                      phrase={
                                        "Please input number of approvers"
                                      }
                                    />
                                  ),
                                },
                              ],
                            })(
                              <InputNumber style={{ width: "100%" }} min={1} />
                            )}
                          </Form.Item>
                          <Form.Item
                            label={
                              <Msg phrase={"Min no. of Approvers per level"} />
                            }
                          >
                            {getFieldDecorator("min_no_of_approvers", {
                              initialValue: editValue
                                ? editValue.min_no_of_approvers
                                : "",
                              rules: [
                                {
                                  required: true,
                                  message: (
                                    <Msg
                                      phrase={
                                        "Please input minimum number of approvers"
                                      }
                                    />
                                  ),
                                },
                              ],
                            })(
                              <InputNumber style={{ width: "100%" }} min={1} />
                            )}
                          </Form.Item>
                        </Row>
                        <Row>
                          <Col span={24} style={{ textAlign: "right" }}>
                            <Popconfirm
                              title="Discard changes?"
                              onConfirm={cancelEditConfiguration}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Button>Cancel</Button>
                            </Popconfirm>

                            <Button
                              type="primary"
                              htmlType="submit"
                              style={{ marginLeft: 8 }}
                              loading={isLoading}
                            >
                              <Msg phrase={"Save"} />
                            </Button>
                          </Col>
                        </Row>
                      </Card>
                    </Form>
                  </Col>
                  <Col lg={16} md={24} sm={24}>
                    <Row>
                      <Table
                        columns={approvalColumns}
                        bordered
                        dataSource={approvedData}
                        size="small"
                        rowKey={(record) => record.module_name}
                      />
                    </Row>
                  </Col>
                </>
              )}
              {showApprover && (
                <Approvers
                  setShowApprover={setShowApprover}
                  approval={approval}
                />
              )}
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

const columns = [
  {
    title: "Aproval Module",
    dataIndex: "module_name",
    key: "module_name",
  },
  {
    title: "Level Numbers",
    dataIndex: "no_of_approveres",
    key: "no_of_approveres",
  },
  {
    title: "Min no of approvers",
    dataIndex: "min_no_of_approvers",
    key: "min_no_of_approvers",
  },
];

const WrappedApprovalSettingsForm = Form.create({
  name: "approval_settings",
})(CreateApproval);
export default WrappedApprovalSettingsForm;
