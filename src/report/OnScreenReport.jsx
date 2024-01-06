import React, { useState, useEffect } from 'react';
import { Card, Button, Tooltip, Spin, Modal, Col, Select, Form, notification } from 'antd';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import useFetchReports from './useFetchReports';
import DownloadReportButton from './ReportDownloader';
// import { Msg } from 'common/i18n';
import DOMPurify from 'dompurify';

const ButtonGroup = Button.Group;
const { Option } = Select;

export default function OnScreenReport({
  title,
  params,
  filterPanel,
  fromHrmis,
  qrfParams,
  fromPatientFile = false,
}) {
  const { reports, loading } = useFetchReports({
    ...params,
    fromHrmis: fromHrmis,
    fromPatientFile: fromPatientFile,
  });
  
  const reportOperations = (
    <ButtonGroup key='1'>
      <DownloadReportButton
        format='PDF'
        params={{
          ...params,
          ...qrfParams,
          fromHrmis,
          fromPatientFile,
        }}
      />
      <DownloadReportButton
        format='DOCX'
        params={{ ...params, fromHrmis, fromPatientFile }}
      />
      <DownloadReportButton
        format='CSV'
        params={{ ...params, fromHrmis, fromPatientFile }}
      />
      {!fromHrmis && (
        <DownloadReportButton
          format='html'
          params={{ ...params, fromHrmis, fromPatientFile }}
        />
      )}
    </ButtonGroup>
  );
  return (
    <Card size='small' title={title} extra={reportOperations}>
      <div>
        {filterPanel && (
          <div>
            Show filters
          </div>
        )}
        <Spin tip='Please Wait ...' spinning={loading}>
          <PerfectScrollbar style={{ height: '60vh' }}>
            <div
              style={{
                margin: '10px',
                display: 'inline-block',
                width: '80%',
                fontSize: '5px',
              }}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(reports) }}
            />
          </PerfectScrollbar>
        </Spin>
      </div>
    </Card>
  );
}
