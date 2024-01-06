import React, { useState } from 'react';
import { Tabs } from 'antd';
import Holiday from './Holiday';
import LeaveType from './LeaveType';
import CreateLeave from './CreateLeave';
import LeaveApproval from './LeaveApproval';
import LeaveDays from './LeaveDays';
import LeaveHistory from './LeaveHistory';
import { validatePermission } from '../../../_helpers/globalVariables';

const { TabPane } = Tabs;

const Main = (props) => {
  const [activeTab, setKey] = useState('leavedays');

  const changeTab = (activeKey) => {
    setKey(activeKey);
 };
 
 const items = [
   {
     key: 'leavedays',
     label: 'OverView',
     children: <LeaveDays activeTab={activeTab} />,
   },
   {
     key: '1',
     label: 'Leave Application',
     children: <CreateLeave activeTab={activeTab} />,
   },
   {
     key: 'history',
     label: 'Leave History',
     children: <LeaveHistory activeTab={activeTab} />,
   },
   {
     key: '2',
     label: 'Leave Approval',
     children: <LeaveApproval activeTab={activeTab} />,
   },
   {
     key: '4',
     label: 'Holiday',
     children: <Holiday activeTab={activeTab} />,
   },
   {
     key: '5',
     label: 'Leave Types',
     children: <LeaveType activeTab={activeTab} />,
   },
 ];

  return (
    <div id='content'>
    <Tabs type='card' onChange={changeTab} items={items}>
        {/* {validatePermission('approve_leave_application') && (
          <TabPane tab='Approval' key='2'>
            <LeaveApproval activeTab={activeTab} />
          </TabPane>
        )}
        {validatePermission('view_public_holiday') && (
          <TabPane tab='Holiday' key='4'>
            <Holiday />
          </TabPane>
        )}
        {validatePermission('view_leave_type') && (
          <TabPane tab='Leave Type' key='5'>
            <LeaveType />
          </TabPane>
        )} */}
      </Tabs>
    </div>
  );
};

export default Main;
