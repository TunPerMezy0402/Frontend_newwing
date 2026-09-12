import { Layout } from "antd";
import AiCccdReader from "./components/AiCccdReader";
import FactoryFormPanel from "./components/FactoryFormPanel";
import AddressConverter from "./components/AddressConverter";

const { Content } = Layout;

export default function App() {

  return (
    <Layout style={{ height: "100vh" }}>
      <Content>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "25% 50% 25%",
            height: "calc(100vh - 64px)",
          }}
        >
          <div style={{ borderRight: "1px solid #f0f0f0", overflowY: "auto" }}>
            <AiCccdReader />
          </div>
          <div style={{ overflowY: "auto" }}>
            <FactoryFormPanel />
          </div>
          <div style={{ borderLeft: "1px solid #f0f0f0", overflowY: "auto" }}>
            <AddressConverter />
          </div>
        </div>
      </Content>
    </Layout>
  );
}
