import React, { useState, useEffect } from 'react';
import {
  Tabs,
  TreeSelect,
  Row,
  Col,
  Button,
  message,
  Card,
  notification,
} from 'antd';
import { hrRolesService, hrmisPermission } from '../../../../_services';
import { AiOutlineKey } from 'react-icons/ai';

const { TabPane } = Tabs;
const { SHOW_PARENT } = TreeSelect;

const AssignPermissions = (props) => {
  const role = props?.selectedRole;
  const [loading, setLoading] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    if (role === null || role === undefined || role === '')
      return props.handleDetails();
    fetchPermissions();
    getRolePermissions(role.id);
  }, [role, props]);

  useEffect(() => {
    notification['info']({
      message: 'Permissions settings notification',
      description:
        'Please click anywhere below the ALL PERMISSIONS TAB to update users permissions.',
    });
  }, []);

  const fetchPermissions = () => {
    setLoading(false);
    hrmisPermission
      .fetchPermission({ pageSize: 1000 })
      .then((resp) => {
        let data = resp.data.content;
        let permission_group = [
          ...new Set(data.map((item) => item.permission_group)),
        ];

        let tree_data = permission_group.map((item) => ({
          title: item,
          value: item,
          key: item,
          children: data
            .filter((perm) => perm.permission_group === item)
            .map((names) => ({
              title: names.name,
              value: names.id,
              key: names.name,
            })),
        }));
        setPermissions(data);
        setTreeData(tree_data);
        setGroups(permission_group);
        setLoading(false);
      })
      .catch((err) => {
        console.log('error \t', err);
        setLoading(false);
      });
  };

  const getRolePermissions = (id) => {
    setLoading(true);
    hrRolesService
      .fetchRolePermissions(id)
      .then((resp) => {
        let data = resp.data ? resp.data.permission_data : [];
        let final = data.map((p) => p.id);
        setSelectedPermissions(final);
        setLoading(false);
      })
      .catch((err) => {
        console.log('error \t', err);
        setLoading(false);
      });
  };

  const onChange = (checked) => {
    setSelectedPermissions(checked);
  };

  const handleSubmit = () => {
    let final_permissions = [];

    // Find Groups in TreeData, If all Permissions in the group are selected,
    // Only the group is added to the selectedPermissions Array
    let selected_group = selectedPermissions.filter((sp) =>
      groups.includes(sp)
    );

    if (selected_group.length >= 1) {
      selected_group.forEach((element) => {
        final_permissions.push(
          ...permissions.filter((p) => p.permission_group === element)
        );
      });
    }

    //The selected permission plus the initial permissions data
    final_permissions.push(
      ...permissions.filter((p) => selectedPermissions.includes(p.id))
    );

    setLoading(true);
    hrRolesService
      .updateRolePermissions(role.id, final_permissions)
      .then((resp) => {
        message.success('User role updated successfuly');
        setLoading(false);
        props.handleDetails();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleBack = () => {
    props.handleDetails();
  };

  const tProps = {
    treeData,
    value: selectedPermissions,
    showCheckedStrategy: SHOW_PARENT,
    onChange: onChange,
    treeCheckable: true,
    searchPlaceholder: 'Please select',
    style: {
      width: '100%',
    },
  };

  return (
    <div id='content'>
      <Tabs>
        <TabPane
          tab={
            <span>
              <AiOutlineKey style={{ color: 'blue' }} />
              All Permissions
            </span>
          }
          key='assign permission'
        >
          <Row>
            <TreeSelect loading={loading} {...tProps} className='mt-2' />
          </Row>
          <Row className='mt-4'>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button onClick={handleBack}>Cancel</Button>

              <Button
                onClick={handleSubmit}
                loading={loading}
                style={{ marginLeft: 8 }}
                type='primary'
                htmlType='submit'
              >
                Save
              </Button>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AssignPermissions;
