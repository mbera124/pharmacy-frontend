import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Modal, Input } from 'antd';
import { debounce } from 'lodash';
import { EmployeeColumns } from './columns';
import { hrEmployeeService } from '../../../_services';
import { AiFillDelete, AiOutlineSearch } from 'react-icons/ai';

export const EmployeeSearch = ({ size = 'default', ...props }) => {
  const [visible, setVisible] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [total_elements, setTotalElements] = useState(10);
  const [page, setPage] = useState({ page: 1, pageSize: 10 });
  const [search, setSearch] = useState(null);
  const [value, setValue] = useState('');
  const [searchParams, setSearchParams] = useState({ pageSize: 10 });
  const [disabled, setDisabled] = useState(false);
  const start_page = { page: 1, pageSize: 10 };
  const [required, setRequired] = useState(false);

  const columns = EmployeeColumns;

  useEffect(() => {
    getEmployees(searchParams);
    if (props.fromReport) {
      setRequired(props.required);
    }
  }, [props.fromReport, props.required, searchParams]);

  const getEmployees = async (data) => {
    let params = {
      search: data.search,
      page: data.page,
      pageSize: data.pageSize,
    };

    setLoading(true);
    setEmployees([]);

    try {
      let response = await hrEmployeeService.fetchAllEmployees(params);
      let data = response.data;
      let content = (data.content || []).map((e) => ({
        staff_number: e.staff_number,
        full_name: e.full_name,
        phone_number: e.tel_number,
        department: e.department_name,
        email_address: e.email_address,
        id_number: e.id_number,
        specialization: e.staff_job_title_name,
      }));
      setEmployees(content);
      setTotalElements(
        data.page_details ? data.page_details.total_elements : 10
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSearch = debounce((params) => {
    setSearchParams({ search: params, ...start_page });
    setSearch(params);
    setPage(start_page);
  }, 500);

  const handleTableChange = (value) => {
    let current_page = { page: value.current, pageSize: 10 };
    let params = { search, ...current_page };

    setSearchParams(params);
    setPage(current_page);
  };

  const handleClear = (params) => {
    setValue(null);
    setDisabled(false);
    props.employee(null);
    setSearchParams(start_page);
    setPage(start_page);
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleRowClick = (record) => {
    return {
      onClick: (event) => {
        props.employee(record);
        setValue(record.full_name);
        setDisabled(true);
        setVisible(false);
        setSearchParams(start_page);
        setSearch(null);
        setPage(start_page);
      },
    };
  };

  const handleCancel = (e) => {
    setVisible(false);
  };

  return (
    <>
      <Input
        size={size}
        value={value}
        suffix={<AiOutlineSearch style={{ color: 'blue' }} />}
        addonAfter={
          <AiFillDelete
            style={{ cursor: 'pointer', color: 'red' }}
            onClick={handleClear}
          />
        }
        placeholder='Search Employee'
        onClick={showModal}
        disabled={disabled}
      />
      <Modal
        destroyOnClose={true}
        open={visible}
        onCancel={handleCancel}
        footer={null}
        width={1000}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
          <Col span={5}>
            <Input
              allowClear
              size='small'
              suffix={<AiOutlineSearch style={{ color: 'blue' }} />}
              placeholder='Search...'
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Col>
        </Row>
        <br />
        <Table
          columns={columns}
          dataSource={employees}
          pagination={{
            total: total_elements,
            current: page.page,
            pageSize: 10,
          }}
          onChange={handleTableChange}
          size='small'
          bordered
          loadinghandleEmployee={isLoading}
          onRow={handleRowClick}
          rowKey={(data) => data.staff_number}
        />
      </Modal>
    </>
  );
};
