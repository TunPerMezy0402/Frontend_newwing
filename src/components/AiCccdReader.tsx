import { useCallback, useRef, useState } from "react";
import { Button, Card, Form, Input, Space, Typography, message } from "antd";
import { PictureOutlined } from "@ant-design/icons";
import { apiClient } from "../api/client";
import { useEmployeeStore } from "../store/employeeStore";

const { Text } = Typography;

/**
 * Khu vực 1 — AI đọc CCCD.
 * CHỈ hỗ trợ dán ảnh bằng Ctrl+V — không cho tải tệp lên. Ảnh chỉ giữ trong
 * state phiên làm việc, gửi tạm thời cho Backend để AI Vision xử lý.
 */
export default function AiCccdReader() {
  const {
    employeeData,
    setEmployeeData,
    frontImagePreview,
    backImagePreview,
    setFrontImagePreview,
    setBackImagePreview,
    isExtracting,
    setIsExtracting,
    confirmEmployeeData,
  } = useEmployeeStore();

  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFile = (file: File, side: "front" | "back") => {
    const url = URL.createObjectURL(file);
    if (side === "front") {
      setFrontFile(file);
      setFrontImagePreview(url);
    } else {
      setBackFile(file);
      setBackImagePreview(url);
    }
  };

  // Ctrl+V dán ảnh — dán lần đầu vào mặt trước, lần thứ hai vào mặt sau
  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (!file) continue;
          if (!frontFile) {
            handleFile(file, "front");
          } else if (!backFile) {
            handleFile(file, "back");
          } else {
            message.info("Đã có đủ ảnh 2 mặt. Xóa phiên nếu muốn dán lại.");
          }
          e.preventDefault();
          return;
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [frontFile, backFile]
  );

  const handleExtract = async () => {
    if (!frontFile && !backFile) {
      message.warning("Vui lòng dán ít nhất một ảnh CCCD (Ctrl+V).");
      return;
    }
    setIsExtracting(true);
    try {
      const formData = new FormData();
      if (frontFile) formData.append("frontImage", frontFile);
      if (backFile) formData.append("backImage", backFile);

      const { data } = await apiClient.post("/api/ai/extract-cccd", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setEmployeeData(data);
      message.success("AI đã đọc xong thông tin CCCD. Vui lòng kiểm tra lại.");
    } catch (err) {
      console.error(err);
      message.error("Không đọc được thông tin từ ảnh. Vui lòng thử lại hoặc nhập tay.");
    } finally {
      setIsExtracting(false);
    }
  };

  const pastePlaceholderStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 120,
    border: "1px dashed #d9d9d9",
    borderRadius: 4,
    color: "#8c8c8c",
    background: "#fafafa",
  };

  return (
    <div
      ref={containerRef}
      onPaste={handlePaste}
      tabIndex={0}
      style={{ height: "100%", overflowY: "auto", padding: 16, outline: "none" }}
    >

      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        <div style={{ display: "flex", gap: 12 }}>
          <Card size="small" title="Mặt trước" style={{ flex: 1, minWidth: 0 }}>
            {frontImagePreview ? (
              <img
                src={frontImagePreview}
                alt="CCCD mặt trước"
                style={{ width: "100%", borderRadius: 4 }}
              />
            ) : (
              <div style={pastePlaceholderStyle}>
                <PictureOutlined style={{ fontSize: 22 }} />
                <Text type="secondary" style={{ fontSize: 12, textAlign: "center" }}>
                  Ctrl+V để dán ảnh mặt trước
                </Text>
              </div>
            )}
          </Card>

          <Card size="small" title="Mặt sau" style={{ flex: 1, minWidth: 0 }}>
            {backImagePreview ? (
              <img
                src={backImagePreview}
                alt="CCCD mặt sau"
                style={{ width: "100%", borderRadius: 4 }}
              />
            ) : (
              <div style={pastePlaceholderStyle}>
                <PictureOutlined style={{ fontSize: 22 }} />
                <Text type="secondary" style={{ fontSize: 12, textAlign: "center" }}>
                  Ctrl+V để dán ảnh mặt sau
                </Text>
              </div>
            )}
          </Card>
        </div>

        <Button
          type="primary"
          block
          loading={isExtracting}
          onClick={handleExtract}
          disabled={!frontFile && !backFile}
        >
          AI phân tích ảnh
        </Button>

        <Card size="small">
          <Form layout="vertical" size="small">
            <Form.Item label="Họ tên">
              <Input
                value={employeeData.fullName}
                onChange={(e) => setEmployeeData({ fullName: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Số CCCD">
              <Input
                value={employeeData.identityNumber}
                onChange={(e) => setEmployeeData({ identityNumber: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Ngày sinh">
              <Input
                value={employeeData.dateOfBirth}
                onChange={(e) => setEmployeeData({ dateOfBirth: e.target.value })}
              />
            </Form.Item>
                     <Form.Item label="Ngày cấp">
              <Input
                value={employeeData.dateOfIssue}
                onChange={(e) => setEmployeeData({ dateOfIssue: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Giới tính">
              <Input
                value={employeeData.gender}
                onChange={(e) => setEmployeeData({ gender: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Địa chỉ (cũ)">
              <Input.TextArea
                rows={2}
                value={employeeData.oldAddress}
                onChange={(e) => setEmployeeData({ oldAddress: e.target.value })}
              />
            </Form.Item>
          </Form>
          <Button type="default" block onClick={confirmEmployeeData}>
            Xác nhận thông tin
          </Button>
        </Card>
      </Space>
    </div>
  );
}