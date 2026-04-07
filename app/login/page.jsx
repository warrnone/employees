"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { swalSuccess, swalError } from "../components/Swal";
import { Form, Input, Button, Alert, Card, Typography } from "antd";
import { UserOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import Image from "next/image";

const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (values) => {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username.trim(),
          password: values.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Login failed");
      }

      swalSuccess("Login สำเร็จ");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      swalError(err.message);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-emerald-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-[28px] overflow-hidden shadow-2xl border border-slate-200 bg-white">
        
        {/* Left Section */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-emerald-600 to-emerald-800 text-white p-10">
          <div>
            <div className="mb-6">
              <Image
                src="/hanuman-logo.jpg"
                alt="Hanuman World"
                width={150}
                height={150}
                className="rounded-full object-cover border-4 border-white/30"
              />
            </div>

            <Title level={2} className="!text-white !mb-2">
              Employee Master
            </Title>

            <Text className="!text-emerald-100 text-base">
              Sign in to manage employee data, organization structure, and HR administration in one place.
            </Text>
          </div>

          <div className="mt-10 rounded-2xl bg-white/10 border border-white/20 p-5 backdrop-blur-sm">
            <p className="text-sm font-semibold mb-2">Demo Account</p>
            <p className="text-sm text-emerald-50">Username: admin</p>
            <p className="text-sm text-emerald-50">Password: 1234</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-center p-6 sm:p-10 bg-white">
          <Card
            variant="borderless"
            className="w-full max-w-md shadow-none"
            styles={{ body: { padding: 0 } }}
          >
            <div className="flex text-center mb-8 ">
              <Image
                src="/hanuman-logo.jpg"
                alt="Hanuman World"
                width={100}
                height={100}
                className="mx-auto rounded-full object-cover"
              />
            </div>

            <div className="mb-8">
              <Title level={2} className="!mb-1 !text-slate-800">
                Welcome Back
              </Title>
              <Text className="text-slate-500">
                Please enter your username and password
              </Text>
            </div>

            {error ? (
              <Alert
                title={error}
                type="error"
                showIcon
                className="!mb-5 rounded-xl"
              />
            ) : null}

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              autoComplete="off"
              size="large"
            >
              <Form.Item
                label={<span className="font-medium text-slate-700">Username</span>}
                name="username"
                rules={[{ required: true, message: "Please enter username" }]}
              >
                <Input
                  prefix={<UserOutlined className="text-slate-400" />}
                  placeholder="Enter username"
                  autoComplete="username"
                  className="!rounded-2xl !py-2"
                />
              </Form.Item>

              <Form.Item
                label={<span className="font-medium text-slate-700">Password</span>}
                name="password"
                rules={[{ required: true, message: "Please enter password" }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-slate-400" />}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  className="!rounded-2xl !py-2"
                />
              </Form.Item>

              <Form.Item className="!mb-3">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  className="login-btn !h-12 !rounded-2xl !bg-slate-900 hover:!bg-slate-800 !border-slate-900 text-sm font-semibold relative overflow-hidden"
                >
                  {loading ? "Signing in..." : "Login"}
                </Button>
              </Form.Item>
            </Form>
            
          </Card>
        </div>
      </div>
    </div>
  );
}