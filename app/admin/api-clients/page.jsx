"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Switch,
  Space,
  Tag,
  message,
} from "antd";

export default function ApiClientsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/api-clients");
      const json = await res.json();

      if (!res.ok) throw new Error(json.message);

      setData(json.data || []);
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleOpenCreate = () => {
    setEditing(null);
    form.resetFields();
    setOpenModal(true);
  };

  const handleEdit = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const isEdit = !!editing;
      const url = isEdit
        ? `/api/admin/api-clients/${editing.id}`
        : "/api/admin/api-clients";

      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.message);

      message.success(isEdit ? "อัปเดตสำเร็จ" : "สร้างสำเร็จ");

      setOpenModal(false);
      fetchClients();
    } catch (err) {
      message.error(err.message);
    }
  };

  const handleToggle = async (record) => {
    try {
      const res = await fetch(`/api/admin/api-clients/${record.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_active: !record.is_active,
        }),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.message);

      message.success("อัปเดตสถานะสำเร็จ");
      fetchClients();
    } catch (err) {
      message.error(err.message);
    }
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "client_code",
    },
    {
      title: "Name",
      dataIndex: "client_name",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Contact",
      render: (_, r) => (
        <div>
          <div>{r.contact_name || "-"}</div>
          <div className="text-xs text-slate-500">
            {r.contact_email || ""}
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      render: (_, r) =>
        r.is_active ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    {
      title: "Action",
      render: (_, r) => (
        <Space>
          <Button size="small" onClick={() => handleEdit(r)}>
            Edit
          </Button>

          <Switch
            checked={r.is_active}
            onChange={() => handleToggle(r)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            API Clients
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            จัดการระบบที่สามารถเรียก API ได้
          </p>
        </div>

        <Button type="primary" onClick={handleOpenCreate}>
          + เพิ่ม Client
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
      />

      <Modal
        title={editing ? "แก้ไข Client" : "สร้าง Client"}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onOk={handleSubmit}
        okText="บันทึก"
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="client_code"
            label="Client Code"
            rules={[{ required: true, message: "กรุณากรอก code" }]}
          >
            <Input placeholder="HRM / PAYROLL" />
          </Form.Item>

          <Form.Item
            name="client_name"
            label="Client Name"
            rules={[{ required: true, message: "กรุณากรอกชื่อ" }]}
          >
            <Input placeholder="HRM System" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item name="contact_name" label="Contact Name">
            <Input />
          </Form.Item>

          <Form.Item name="contact_email" label="Contact Email">
            <Input />
          </Form.Item>

          <Form.Item
            name="is_active"
            label="Active"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}