import React, { useEffect, useState } from 'react';
import { Card, Input, Tabs, List, Switch, InputNumber, TimePicker } from 'antd';
import { hrmisConfigService } from '../../../../_services';
import { debounce } from 'lodash';
import moment from 'moment';

const { TabPane } = Tabs;

const Configurations = (props) => {
  const [isLoading, setLoading] = useState(false);
  const [settings, setSettings] = useState([]);
  const [types, setTypes] = useState([]);
  const [activeKey, setActiveKey] = useState('0');

  useEffect(() => {
    fetchConfigurations();
    fetchConfigurationGroups();
  }, []);

  const fetchConfigurationGroups = () => {
    hrmisConfigService
      .getConfigurationGroups()
      .then((resp) => {
        setTypes(resp?.data?.content || []);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchConfigurations = () => {
    hrmisConfigService
      .fetchConfigList({ pageSize: 100 })
      .then((response) => {
        let data = response.data.content;
        setSettings(data);
      })
      .catch((error) => {});
  };

  const editConfig = (id, config, index) => {
    hrmisConfigService
      .editConfig(id, config)
      .then((response) => {
        fetchConfigurations();
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const changeValue = debounce((state, item, index) => {
    let config = {
      ...item,
      config_value: state,
    };
    setLoading(true);
    editConfig(item.config_id, config, index);
  }, 2000);

  const changeToggleEnabled = debounce((state, item, index) => {
    let config = {
      ...item,
      enabled: state,
    };
    setLoading(true);
    editConfig(item.config_id, config, index);
  }, 0);

  const handleReportChange = (value) => {
    setActiveKey(value);
  };

  return (
    <div id='content'>
      <Card type='inner' title={<b>Global Configuration</b>}>
        <Tabs
          defaultActiveKey='0'
          tabPosition='top'
          onChange={handleReportChange}
        >
          {settings &&
            types.map((type, key) => (
              <TabPane tab={type} key={key}>
                <List
                  itemLayout='horizontal'
                  dataSource={
                    settings
                      ? settings.filter((e) => e.config_group === type)
                      : null
                  }
                  loading={isLoading}
                  renderItem={(item, index) => (
                    <List.Item>
                      <List.Item.Meta
                        title={<b>{item.config_name}</b>}
                        description={item.config_description}
                      />
                      <div>
                        {item.field_type === 'Boolean' ? (
                          <Switch
                            onChange={(state) =>
                              changeValue(
                                state === true ? '1' : '0',
                                item,
                                index
                              )
                            }
                            checked={item.config_value === '1' ? true : false}
                            checkedChildren={"Enabled"}
                            unCheckedChildren={"Disabled"}
                          />
                        ) : item.field_type === 'String' ? (
                          <Input
                            value={item.config_value}
                            onChange={(e) =>
                              changeValue(e.target.value, item, index)
                            }
                          />
                        ) : item.field_type === 'Double' ? (
                          <InputNumber
                            min={0}
                            step={0.01}
                            value={Number(item.config_value)}
                            onChange={(num) => changeValue(num, item, index)}
                          />
                        ) : item.field_type === 'Integer' &&
                          item.name === 'UnpaidOrdersLimit' ? (
                          <>
                            <InputNumber
                              disabled={!item.enabled}
                              min={0}
                              value={Number(item.config_value)}
                              onChange={(num) => changeValue(num, item, index)}
                            />
                            {` `}
                            <Switch
                              onChange={(state) =>
                                changeToggleEnabled(state, item, index)
                              }
                              checked={item.enabled}
                              checkedChildren={"Enabled"}
                              unCheckedChildren={"Disabled"}
                            />
                          </>
                        ) : item.field_type === 'Integer' ? (
                          <InputNumber
                            min={0}
                            value={Number(item.config_value)}
                            onChange={(num) => changeValue(num, item, index)}
                          />
                        ) : item.field_type === 'Timer' ? (
                          <>
                            <TimePicker
                              allowClear={false}
                              value={moment(item.config_value, 'HH:mm')}
                              disabled={!item.enabled}
                              format='HH:mm'
                              size='small'
                              onChange={(num) =>
                                changeValue(
                                  moment(num).format('HH:mm'),
                                  item,
                                  index
                                )
                              }
                            />
                            {` `}
                            <Switch
                              onChange={(state) =>
                                changeToggleEnabled(state, item, index)
                              }
                              checked={item.enabled}
                              checkedChildren={"Enabled"}
                              unCheckedChildren={"Disabled"}
                            />
                          </>
                        ) : null}
                      </div>
                    </List.Item>
                  )}
                />
              </TabPane>
            ))}
        </Tabs>
      </Card>
    </div>
  );
};

export default Configurations;
