import { Button, Card, Input, message } from "antd";
import { SwapOutlined } from "@ant-design/icons";
import { apiClient } from "../api/client";
import { useEmployeeStore } from "../store/employeeStore";

const { TextArea } = Input;

/**
 * Khu vực 3 — Chuyển đổi địa chỉ hành chính cũ -> mới.
 * API key nằm ở Backend (.env), Frontend chỉ gọi /api/address/convert.
 */
export default function AddressConverter() {
  const { employeeData, newAddress, setNewAddress, isConverting, setIsConverting } =
    useEmployeeStore();

  const handleConvert = async () => {
    if (!employeeData.oldAddress.trim()) {
      message.warning("Chưa có địa chỉ cũ để chuyển đổi.");
      return;
    }
    setIsConverting(true);
    try {
      const { data } = await apiClient.post("/address/convert", {
        oldAddress: employeeData.oldAddress,
      });
      setNewAddress(data.newAddress);
      message.success("Đã chuyển đổi địa chỉ.");
    } catch (err) {
      console.error(err);
      message.error("Không chuyển đổi được địa chỉ. Kiểm tra cấu hình API ở Backend.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: 16 }}>

      <Card size="small" title="Địa chỉ cũ" style={{ marginBottom: 12 }}>
        <TextArea rows={3} value={employeeData.oldAddress} readOnly />
      </Card>

      <Button
        type="primary"
        icon={<SwapOutlined />}
        block
        loading={isConverting}
        onClick={handleConvert}
        style={{ marginBottom: 12 }}
      >
        Chuyển đổi
      </Button>

      <Card size="small" title="Địa chỉ mới">
        <TextArea rows={3} value={newAddress} readOnly placeholder="Chưa chuyển đổi" />
      </Card>
    </div>
  );
}
