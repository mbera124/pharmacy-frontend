import React from "react";
import {
  Button,
  PageHeader,
  Form,
  Input,
  Card,
  Select,
  Row,
  Col,
  Divider,
  message,
  Switch,
} from "antd";
import styled from "styled-components";
import { hrCodesService } from "_services";

const StyledForm = styled(Form)`
  .ant-form-item-label {
    padding-bottom: 0px !important;
  }
`;

class AddCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      codeTypes: [],
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
  }

  createCode = (data) => {
    this.setState({
      isLoading: true,
    });
    hrCodesService
      .createCode(data)
      .then((response) => {
        this.setState({
          isLoading: false,
        });
        message.success("Code Created Successful");
        this.props.form.resetFields();
        // this.handleBackTolist();
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        console.log(error);
      });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { ...val } = values;

        let newValues = {
          ...val,
          code_value: this.handleWhiteSpaces(values?.code_value),
          active: values?.active,
        };

        // console.log('Received values of form: ', newValues)
        this.createCode(newValues);
      }
    });
  };

  handleClear = () => {
    this.props.form.resetFields();
  };

  handleWhiteSpaces = (data) => {
    let combined_string = data;
    if (data) {
      combined_string = combined_string.replace(/ /g, "_");
    }

    return combined_string;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { isLoading, codeTypes } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };

    return (
      <div>
        <Card>
          <StyledForm onSubmit={this.handleSubmit} {...formItemLayout}>
            <Row>
              <Form.Item label="Parameter Type" hasFeedback>
                {getFieldDecorator("code_name", {
                  rules: [
                    { required: true, message: "Parameter Type is required" },
                  ],
                })(
                  <Select
                    style={{ width: "100%" }}
                    showSearch
                    placeholder="Select parameter type"
                    optionFilterProp="children"
                  >
                    {codeTypes &&
                      codeTypes.map((ct, index) => (
                        <Select.Option key={index} value={ct}>
                          {ct}
                        </Select.Option>
                      ))}
                  </Select>
                )}
              </Form.Item>

              <Form.Item label="Parameter Value" hasFeedback>
                {getFieldDecorator("code_value", {
                  rules: [
                    { required: true, message: "Parameter value is required" },
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="Active" hasFeedback>
                {getFieldDecorator("active", {
                  initialValue: true,
                  valuePropName: "checked",
                })(<Switch />)}
              </Form.Item>
            </Row>

            <Row>
              <Col span={24} style={{ textAlign: "right" }}>
                <Button onClick={this.handleClear}>Clear</Button>

                <Button
                  loading={isLoading}
                  style={{ marginLeft: 8 }}
                  type="primary"
                  htmlType="submit"
                >
                  Save
                </Button>
              </Col>
            </Row>
          </StyledForm>
        </Card>
      </div>
    );
  }
}

const WrappedPayrollAddCode = Form.create({ name: "Payroll-add-code" })(
  AddCode
);

export default WrappedPayrollAddCode;
