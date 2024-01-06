import React from "react";
import { Card, DatePicker, Row, Button, Tooltip } from "antd";
import DownloadReportButton from "./ReportDownloader";
import { useSelector } from "react-redux";

const ButtonGroup = Button.Group;
const { RangePicker } = DatePicker;

export const ReportDisplay = ({ title }) => {
  const language = useSelector((state) => state.i18n);
  let params;
  return (
    <Card title={title} size="small">
      <Card bordered>
        <Row type="flex">
          <RangePicker
            placeholder={[
              language?.phrases?.["Start Date"] || "Start Date",
              language?.phrases?.["End Date"] || "End Date",
            ]}
          />
        </Row>
      </Card>
      <Row type="flex" justify="center">
        <ButtonGroup key="1">
          <DownloadReportButton format="PDF" params={params} />
          <DownloadReportButton format="CSV" params={params} />
          <Tooltip title="Print Document">
            <Button icon="printer" />
          </Tooltip>
          <Tooltip title="EMail Document">
            <Button icon="mail" />
          </Tooltip>
        </ButtonGroup>
        <div>
          <Button type="primary">Search</Button>
          <Button style={{ marginLeft: 5 }}>Reset</Button>
        </div>
      </Row>
    </Card>
  );
};
