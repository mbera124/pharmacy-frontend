import React, { useState, useEffect } from 'react';
import { Button, Tooltip, message, Select, Popover } from 'antd';
import request from '../_helpers/request';
import { SYSTEM_REPORTS } from '../_helpers/requests';
import hrmis_request from '../_helpers/requests';
import { fetchGenericReport } from '_reports';

const { Option } = Select;

const ReportDownloader = ({ format, params }) => {
  const [loading, setLoading] = useState(false);
  const [visitData, setVisitData] = useState([]);

  let reportParams = { ...params, format: format };
  let reportRequest;
  if (reportParams.fromHrmis) {
    reportRequest = hrmis_request;
  } else {
    reportRequest = request;
  }

  useEffect(() => {
    if (reportParams.patientNumber) {
      getVisits(reportParams.patientNumber);
    }
  }, []);

  const getVisits = (record) => {
    let params = { patientNumber: record };
    setVisitData([])
    // visitService
    //   .fetchAllVisitsByPatientNumber(params)
    //   .then((response) => {
    //     let content = response?.data || [];
    //     setVisitData(content);
    //   })
    //   .catch((error) => {});
  };

  const downloadFile = () => {
    handleReportDownload();
  };

  const handleReportDownload = (selectedVisitNumber) => {
    setLoading(true);
    let data = {
      visitNumber: selectedVisitNumber ? selectedVisitNumber : undefined,
      ...reportParams,
    };
    if (format === 'html') {
      let parameters = {
        ...params,
        visitNumber: selectedVisitNumber ? selectedVisitNumber : undefined,
        format: 'PDF',
      };
      fetchGenericReport(parameters);
      setLoading(false);
    } else {
      reportRequest
        .get(SYSTEM_REPORTS, { params: data, responseType: 'blob' })
        .then(({ data }) => {
          const downloadUrl = window.URL.createObjectURL(new Blob([data]));
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.setAttribute(
            'download',
            `${reportParams.reportName}.${format.toLowerCase()}`
          ); //any other extension
          document.body.appendChild(link);
          link.click();
          link.remove();
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
          message.error(
            'Error Occurred while Downloading File. Please Try again!'
          );
        });
    }
  };

  const docName = format === 'CSV' ? 'Excel' : format;

  const popOverContent = (
    <Select
      allowClear
      showSearch
      size='small'
      style={{ width: '100%' }}
      placeholder={<Msg phrase={'Select visit'} />}
      dropdownMatchSelectWidth={false}
      dropdownStyle={{ width: 300 }}
      onChange={(e) => handleReportDownload(e)}
    >
      <Option value={null} empty={`empty`}>
        - Download for all visits -
      </Option>
      {visitData.map((item) => (
        <Option value={item.visit_number} key={item.visit_number}>
          <b>
            {item.visit_number}
            {` - `}
            {item.visit_type}
            {` - `}
            {item.start_date}
          </b>
        </Option>
      ))}
    </Select>
  );

  return (
    <>
      {reportParams.fromHrmis || reportParams.fromPatientFile === false ? (
        <Tooltip title={`Download ${docName} Document`}>
          <Button
            loading={loading}
            icon={
              format === 'CSV'
                ? 'file-excel'
                : format === 'DOCX'
                ? 'file-word'
                : format === 'html'
                ? 'printer'
                : 'file-pdf'
            }
            onClick={downloadFile}
            style={{
              color:
                format === 'CSV'
                  ? 'green'
                  : format === 'DOCX'
                  ? 'blue'
                  : format === 'html'
                  ? 'blue'
                  : 'red',
            }}
          />
        </Tooltip>
      ) : (
        <Popover
          content={popOverContent}
          trigger='hover'
          placement='left'
          title={<div>Select visit to download PDF</div>}
        >
          <Button
            loading={loading}
            icon={
              format === 'CSV'
                ? 'file-excel'
                : format === 'DOCX'
                ? 'file-word'
                : format === 'html'
                ? 'printer'
                : 'file-pdf'
            }
            onClick={downloadFile}
            style={{
              color:
                format === 'CSV'
                  ? 'green'
                  : format === 'DOCX'
                  ? 'blue'
                  : format === 'html'
                  ? 'blue'
                  : 'red',
            }}
          />
        </Popover>
      )}
    </>
  );
};

export default ReportDownloader;
