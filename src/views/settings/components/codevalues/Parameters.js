import React from "react";
import { Card, Table, Button, PageHeader, Row, Select, Col } from "antd";
import { codesColumns } from "./Columns";
import { hrCodesService } from "_services";
import PayrollAddCode from "./AddParameter";
class Parameters extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      dataSource: [],
      columns: codesColumns,
      codeTypes: [],
      currentCode: {},
      showAddCode: false,
      start_page: { page: 1, pageSize: 20 },
      total_elements: 5,
      page: { page: 1, pageSize: 5 },
    };
  }
  componentDidMount() {
    hrCodesService
      .getCodeTypes()
      .then((response) => {
        this.setState({
          codeTypes: response.data.content || [],
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ isLoading: false });
      });

    this.getCodes();
  }

  getCodes = (params) => {
    this.setState({ isLoading: true });
    hrCodesService
      .getCodeValues(params)
      .then((response) => {
        this.setState({
          dataSource: response.data?.content || [],
          isLoading: false,
          total_elements: response.data.page_details.total_elements,
          page: response.data.page_details.page,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ isLoading: false });
      });
  };
  handleChange = (value) => {
    this.setState({
      currentCode: value,
    });
    const params = { codeName: value };
    this.getCodes(params);
  };
  handleTableChange = (data) => {
    let current_page = { page: data?.current, pageSize: data?.pageSize };
this.setState({page:current_page})
  };

  handleOnBack = () =>{
    this.setState({ showAddCode: false })
    this.getCodes();
  }

  render() {
    const {
      dataSource,
      isLoading,
      columns,
      codeTypes,
      showAddCode,
      page,
      total_elements,
    } = this.state;

    return (
      <div id="content">
        <Card>
          {showAddCode ? (
            <PageHeader
              title="Add General Parameter"
              subTitle="New"
              onBack={() => {
                this.handleOnBack();
              }}
              style={{ width: "100%", backgroundColor: "lightgray" }}
            />
          ) : (
            <PageHeader
              title="General Parameters"
              subTitle="Manage General Parameters"
              extra={[
                <Button
                  key="1"
                  type="primary"
                  onClick={() => this.setState({ showAddCode: true })}
                >
                  Add Parameter
                </Button>,
              ]}
              style={{ width: "100%", backgroundColor: "lightgray" }}
            />
          )}
          {!showAddCode ? (
            <>
              <Card style={{ backgroundColor: "whitesmoke" }}>
                <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                  <Col span={8}>
                    <Select
                      allowClear
                      style={{ width: "100%" }}
                      showSearch
                      placeholder="Select parameter type"
                      optionFilterProp="children"
                      onChange={this.handleChange}
                    >
                      {codeTypes &&
                        codeTypes.map((ct, index) => (
                          <Select.Option key={index} value={ct}>
                            {ct}
                          </Select.Option>
                        ))}
                    </Select>
                  </Col>
                </Row>
              </Card>
              <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                <Col span={24}>
                  <Table
                    style={{ marginTop: 10 }}
                    loading={isLoading}
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                    size="small"
                    pagination={{
                      current: page.page,
                      pageSize: 5,
                      total: total_elements,
                    }}
                    onChange={this.handleTableChange}
                  />
                </Col>
              </Row>
            </>
          ) : (
            <PayrollAddCode />
          )}
        </Card>
      </div>
    );
  }
}

export default Parameters;
