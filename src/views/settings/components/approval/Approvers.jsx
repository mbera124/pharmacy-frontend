import React, { useEffect, useState } from "react";
import CreateApprover from "./CreateApprover";
import Aos from "aos";
import "aos/dist/aos.css";
import {
  Form,
  Col,
  Row,
  Button,
  Table,
  Tag,
  PageHeader,
  Icon,
  Popconfirm,
  message,
} from "antd";
import { hrmisApprovalService } from "_services";
import { Msg } from "common/i18n";

const Approvers = ({ approval, ...props }) => {
  const [createApprover, setCreateApprover] = useState(false);
  const [loading, setLoading] = useState(false);
  const [approvers, setApprovers] = useState(false);

  const approversColumns = [
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
    //animation code
    Aos.init();
  }, []);

  useEffect(() => {
    fetchApprover();
  }, [createApprover]);

  const fetchApprover = () => {
    hrmisApprovalService
      .getApprovers(approval.module_name)
      .then((resp) => {
        setApprovers(resp.data.content);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRemove = (row) => {
    setLoading(true);
    hrmisApprovalService
      .deleteApprover(row.id)
      .then((resp) => {
        message.success("Approver removed successfully");
        setLoading(false);
        fetchApprover();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleCreateApprover = () => {
    setCreateApprover(true);
  };
  return (
    <div>
      <Form>
        {!createApprover && (
          <>
            <PageHeader
              title="Approvals"
              onBack={() => props.setShowApprover(false)}
            />
            <Col style={{ textAlign: "right" }}>
              <Row className="justify-content-end mr-2 mb-2">
                <Button
                  data-aos="fade-down"
                  data-aos-easing="ease-out-cubic"
                  data-aos-duration="2000"
                  onClick={() => handleCreateApprover()}
                  style={{ backgroundColor: "blue", color: "white" }}
                >
                  New Approvers
                </Button>
              </Row>
              <Row>
                <Table
                  loading={loading}
                  dataSource={approvers}
                  columns={approversColumns}
                  bordered
                  size="small"
                  rowKey={(record) => record.id}
                />
              </Row>
            </Col>
          </>
        )}
        {createApprover && (
          <CreateApprover
            setCreateApprover={setCreateApprover}
            approval={approval}
          />
        )}
      </Form>
    </div>
  );
};

const columns = [
  {
    title: <Msg phrase={'Staff Name'} />,
    key: 'staff_name',
    dataIndex: 'staff_name',
  },
  {
    title: <Msg phrase={'Approver Level'} />,
    key: 'approval_level',
    dataIndex: 'approval_level',
  },
  {
    title: <Msg phrase={'Department'} />,
    dataIndex: 'departments',
    key: 'departments',
    render: (departments) => (
      <span>
        {departments.map((data, i) => {
          let color = 'geekblue';
          return (
            <Tag color={color} key={i}>
              <Msg phrase={data?.code_value} />
            </Tag>
          );
        })}
      </span>
    ),
  },
];

const WrappedApproversForm = Form.create({
  name: "create_approver",
})(Approvers);
export default WrappedApproversForm;
