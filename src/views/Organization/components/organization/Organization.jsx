import React, { useState, useEffect } from 'react';
import { hrOrganization } from '../../../../_services';
import {
  Form,
  Input,
  Row,
  Col,
  Button,
  AutoComplete,
  message,
  Divider,
  Upload,
  Select,
  Card,
} from 'antd';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Countries from './Country.json';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const AutoCompleteOption = AutoComplete.Option;

const { Option } = Select;
const Organization = (props) => {
  const [autoCompleteResult, setAutoCompleteResult] = useState([]);
  const [countries, setCountries] = useState([]);
  const [organization_data, setOrganizationData] = useState(null);
  const [addressData, setAddressData] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [organizationId, setOrganizationId] = useState(null);
  const [hideDeleteImageBtn, setHideDeleteImageBtn] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);
  const [fileToSave, setFileToSave] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    let params = { activeStatus: true };
    hrOrganization
      .fetchOrganization(params)
      .then((response) => {
        const { contact_data, ...newValues } = response.data.content;
        let organization = {
          ...newValues,
          contact_data: {
            ...contact_data,
            mobile: contact_data.mobile,
            telephone: contact_data.telephone,
          },
        };
        if (organization.id) {
          hrOrganization
            .fetchOrganizationLogo(organization?.id)
            .then((resp) => {
              let data = resp.data?.content?.file_url;
              // setImageUrl(data || null);
              if (data) {
                setHideDeleteImageBtn(false);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
        let addressData = organization?.address_data[0];
        let contactData = organization?.contact_data[0];
        let params = {
          website: organization?.website,
          tax_number: organization?.tax_number,
          active: organization?.active,
          organization_name: organization?.organization_name,
          legal_name: organization?.legal_name,
          ...addressData,
          ...contactData,
        };
        form.setFieldsValue(params);
        setOrganizationData(organization);
        setOrganizationId(organization?.id);
        setAddressData(organization?.address_data[0]);
        setContactData(organization?.contact_data[0]);
      })
      .catch((error) => {
        // message.warning(error.data.message)
        console.log(error);
      });
    setCountries(Countries);
  }, []);

  const handleSubmit = (values) => {
    const {
      telephone,
      mobile,
      email,
      country,
      county,
      town,
      postal_code,
      address,
      address_type,
      prefix,
      ...newValues
    } = values;
    let organization = {
      ...newValues,
      address_data: [
        {
          county: county,
          address_type: address_type,
          address: address,
          country: country,
          postal_code: postal_code,
          town: town,
        },
      ],
      contact_data: [
        {
          email: email,
          telephone: telephone,
          mobile: mobile,
        },
      ],
    };

    if (organization_data && organizationId) {
      setLoading(true);
      hrOrganization
        .updateOrganization(organizationId, organization)
        .then((response) => {
          message.success(response.data.message);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });

      let fd = new FormData();
      if (fileToSave) {
        fd.append('orglogo', fileToSave);
        if (organization_data?.org_logo_id === null) {
          hrOrganization
            .createOrganizationLogo(organizationId, fd)
            .then((resp) => {
              message.success(resp.data.message);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          hrOrganization
            .updateOrganizationLogo(organizationId, fd)
            .then((resp) => {
              message.success(resp.data.message);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    } else {
      setLoading(true);
      hrOrganization
        .createOrganization(organization)
        .then((response) => {
          let id = response?.data?.content?.id;
          setLoading(false);
          message.success(response.data.message);
          let fd = new FormData();
          if (fileToSave) {
            fd.append('orglogo', fileToSave);
            hrOrganization
              .createOrganizationLogo(id, fd)
              .then((resp) => {
                message.success(resp.data.message);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    }
  };

  const handleWebsiteChange = (value) => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(
        (domain) => `${value}${domain}`
      );
    }
    setAutoCompleteResult(autoCompleteResult);
  };

  const websiteOptions = autoCompleteResult.map((website) => (
    <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
  ));

  const handleChangeImage = (info) => {
    if (info.file.status === 'done') {
      setImageUrl(URL.createObjectURL(info.file.originFileObj));
      setFileToSave(info.file.originFileObj);
      setHideDeleteImageBtn(false);
    }
  };

  const removeImage = () => {
    if (organizationId && imageUrl) {
      hrOrganization
        .deleteOrganizationLogo(organizationId)
        .then((response) => {
          message.success('Image deleted successfuly');
          setImageUrl(null);
          setFileToSave(null);
          setHideDeleteImageBtn(true);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setImageUrl(null);
      setFileToSave(null);
      setHideDeleteImageBtn(true);
    }
  };

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  return (
    <div id="content">
      <Card type={'inner'} style={{ padding: 10 }}>
        <Form
          layout={'vertical'}
          name='organization'
          onFinish={handleSubmit}
          form={form}
        >
          <Divider>
            <b>Organization Information</b>
          </Divider>
          <Row gutter={[16, 16]}>
            <Col span={20}>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Form.Item
                    label='Organization Name'
                    name='organization_name'
                    rules={[
                      {
                        required: true,
                        message: 'Please input your organization name!',
                      },
                    ]}
                  >
                    <Input placeholder='' />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label='Legal Name'
                    name='legal_name'
                    rules={[
                      {
                        required: true,
                        message: 'Please input your legal name!',
                      },
                    ]}
                  >
                    <Input placeholder='' />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label='Tax Number'
                    name='tax_number'
                    rules={[
                      {
                        required: false,
                        message: 'Please input your tax no.!',
                      },
                    ]}
                  >
                    <Input placeholder='' />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label='Website'
                    name='website'
                    rules={[
                      {
                        required: false,
                        message: 'Please input your website!',
                      },
                    ]}
                  >
                    <AutoComplete
                      dataSource={websiteOptions}
                      onChange={handleWebsiteChange}
                      placeholder=''
                    >
                      <Input />
                    </AutoComplete>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label='Status'
                    name='active'
                    rules={[
                      {
                        required: true,
                        message: 'Please input your active!',
                      },
                    ]}
                  >
                    <Select>
                      <Option value={true} key={'active'}>
                        Active
                      </Option>
                      <Option value={false} key={'inactive'}>
                        Inactive
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={4}>
              <Form.Item
                label=''
                name='avatar'
                rules={[
                  {
                    required: false,
                    message: 'Please input your org logo!',
                  },
                ]}
              >
                <Upload
                  name='avatar'
                  listType='picture-card'
                  className='avatar-uploader'
                  showUploadList={false}
                  customRequest={dummyRequest}
                  onChange={handleChangeImage}
                  style={{ borderRadius: '10px' }}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt='avatar'
                      style={{ width: '100%' }}
                    />
                  ) : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
              <Button
                hidden={hideDeleteImageBtn}
                style={{ marginLeft: 20, marginTop: -15 }}
                size='small'
                onClick={removeImage}
                type='primary'
                danger
              >
                Delete
              </Button>
            </Col>
          </Row>
          <Divider>
            <b>Address</b>
          </Divider>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item
                label='Address'
                name='address'
                rules={[
                  {
                    required: false,
                    message: 'Please input your address!',
                  },
                ]}
              >
                <Input placeholder='' />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label='Address Type'
                name='address_type'
                rules={[
                  {
                    required: false,
                    message: 'Please input your address_type!',
                  },
                ]}
              >
                <Select allowClear>
                  <Option value={'Billing'} key={'Billing'}>
                    Billing
                  </Option>
                  <Option value={'Office'} key={'Office'}>
                    Office
                  </Option>
                  <Option value={'Personal'} key={'Personal'}>
                    Personal
                  </Option>
                  <Option value={'Postal'} key={'Postal'}>
                    Postal
                  </Option>
                  <Option value={'Current'} key={'Current'}>
                    Current
                  </Option>
                  <Option value={'Permanent'} key={'Permanent'}>
                    Permanent
                  </Option>
                  <Option value={'Other'} key={'Other'}>
                    Other
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label='Town'
                name='town'
                rules={[
                  {
                    required: false,
                    message: 'Please input your town!',
                  },
                ]}
              >
                <Input placeholder='' />
              </Form.Item>
            </Col>
            {/* </Row>

          <Row gutter={24}> */}
            <Col span={6}>
              <Form.Item
                label='Postal Code'
                name='postal_code'
                rules={[
                  {
                    required: true,
                    message: 'Please input your postal code!',
                  },
                ]}
              >
                <Input placeholder='' />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label='Country'
                name='country'
                rules={[
                  {
                    required: true,
                    message: 'Please input your country!',
                  },
                ]}
              >
                <Select showSearch allowClear>
                  {countries.map((country) => (
                    <Option key={country.code} value={country.name}>
                      {country.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label='County'
                name='country'
                rules={[
                  {
                    required: true,
                    message: 'Please input your country!',
                  },
                ]}
              >
                <Input placeholder='' />
              </Form.Item>
            </Col>
          </Row>
          <Divider>
            <b>Contact</b>
          </Divider>
          <Row gutter={24}>
            <Col span={7}>
              <Form.Item
                label='Email Address'
                name='email'
                rules={[
                  {
                    required: true,
                    message: 'Please input your email!',
                  },
                ]}
              >
                <Input placeholder='' />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                name='mobile'
                rules={[
                  {
                    required: true,
                    message: 'Please input your mobile!',
                  },
                ]}
              >
                <PhoneInput
                  defaultCountry={'KE'}
                  placeholder='Enter mobile number'
                  style={{ marginTop: 28 }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name='telephone'
                rules={[
                  {
                    required: true,
                    message: 'Please input your telephone!',
                  },
                ]}
              >
                <PhoneInput
                  defaultCountry={'KE'}
                  placeholder='Enter Telephone number'
                  style={{ marginTop: 28 }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item style={{ textAlign: 'right' }}>
            <Button type='primary' htmlType='submit' loading={loading}>
              {organization_data ? 'Update' : 'Save'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Organization;
