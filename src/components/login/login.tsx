import React from 'react';
import {
  Row,
  Col,
  Layout,
  Card,
  Typography,
  Form,
  Input,
  Button,
  notification,
  Divider,
} from 'antd';
import { useLogin } from '@refinedev/core';

const { Title } = Typography;
const { Content } = Layout;

const Login = () => {
  const { mutate: login } = useLogin();

  const handleFinish = async (values: any) => {
    login(values, {
      onSuccess: (data) => {
        if (data.success) {
          notification.success({
            message: 'Login Successful',
            description: 'You have successfully logged in.',
          });
        } else {
          notification.error({
            message: 'Login Failed',
            description: data.error?.message || 'An unknown error occurred',
          });
        }
      },
      onError: (error) => {
        console.error("Login error:", error);
        notification.error({
          message: 'Login Failed',
          description: 'An error occurred while logging in. Please try again later.',
        });
      },
    });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content>
        <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
          <Col xs={24} sm={16} md={12} lg={8}>
            <Card>
              <Title level={2} style={{ textAlign: 'center' }}>Login</Title>
              <Divider />
              <Form layout="vertical" onFinish={handleFinish}>
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[{ required: true, message: 'Please enter your username' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true, message: 'Please enter your password' }]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    Login
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Login;