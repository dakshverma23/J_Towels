import { Button, Form, Input, Tabs, message } from "antd";
import { useNavigate } from "react-router-dom";
import SplitHeading from "../components/venetian/SplitHeading";
import { useVenetianReveal } from "../hooks/useVenetianReveal";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function AuthPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const rootRef = useVenetianReveal();

  return (
    <div ref={rootRef} className="pt-24 md:pt-28">
      <section className="ven-container pb-12">
        <div className="ven-reveal">
          <SplitHeading lines={["ACCOUNT", "ACCESS"]} className="ven-heading-xl" />
        </div>
      </section>

      <section className="ven-container max-w-lg pb-24">
        <div className="ven-reveal border border-ven-line bg-white p-8 md:p-10">
          <Tabs
            items={[
              {
                key: "login",
                label: "Login",
                children: (
                  <Form
                    layout="vertical"
                    onFinish={async (v) => {
                      try {
                        await login(v.email, v.password);
                        message.success("Welcome back");
                        navigate("/");
                      } catch {
                        message.error("Invalid credentials");
                      }
                    }}
                  >
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                      <Input.Password size="large" />
                    </Form.Item>
                    <Button htmlType="submit" className="ven-btn w-full">
                      Sign In
                    </Button>
                  </Form>
                )
              },
              {
                key: "register",
                label: "Register",
                children: (
                  <Form
                    layout="vertical"
                    onFinish={async (v) => {
                      try {
                        await register(v.name, v.email, v.password);
                        navigate("/");
                      } catch {
                        message.error("Registration failed");
                      }
                    }}
                  >
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
                      <Input.Password size="large" />
                    </Form.Item>
                    <Button htmlType="submit" className="ven-btn w-full">
                      Create Account
                    </Button>
                  </Form>
                )
              },
              {
                key: "admin",
                label: "Admin",
                children: (
                  <Form
                    layout="vertical"
                    onFinish={async (v) => {
                      try {
                        const { data } = await api.post("/auth/bootstrap-admin", v);
                        localStorage.setItem("jt_token", data.token);
                        navigate("/admin");
                        window.location.reload();
                      } catch {
                        message.error("Invalid setup key");
                      }
                    }}
                  >
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                      <Input.Password size="large" />
                    </Form.Item>
                    <Form.Item name="setupKey" label="Setup Key" rules={[{ required: true }]}>
                      <Input.Password size="large" />
                    </Form.Item>
                    <Button htmlType="submit" className="ven-btn w-full">
                      Create Admin
                    </Button>
                  </Form>
                )
              }
            ]}
          />
        </div>
      </section>
    </div>
  );
}
