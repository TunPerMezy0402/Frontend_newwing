import { Button, Card, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { useEmployeeStore } from "../store/employeeStore";

const FACTORY_FORM_URL = "https://nwing.info/SupplierInterview";

// Chuyển ngày về dạng YYYY-MM-DD
const formatDate = (date: string) => {
  if (!date) return "";

  // Đã đúng dạng YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  // DD/MM/YYYY -> YYYY-MM-DD
  const match = date.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (match) {
    const [, day, month, year] = match;
    return `${year}-${month}-${day}`;
  }

  return date;
};

export default function FactoryFormPanel() {
  const { employeeData, newAddress } = useEmployeeStore();

  const copyText = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value || "");
      message.success("Đã sao chép");
    } catch {
      message.error("Không thể sao chép");
    }
  };

  // Lấy thôn/xóm, xã, tỉnh từ địa chỉ mới
  const addressParts = (newAddress || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const province = addressParts[addressParts.length - 1] || "";
  const commune = addressParts[addressParts.length - 2] || "";
  const village = addressParts[addressParts.length - 3] || "";

  const Field = ({
    label,
    value,
  }: {
    label: string;
    value: string;
  }) => (
    <div
      style={{
        flex: 1,
        border: "1px solid #ddd",
        borderRadius: 6,
        padding: "8px 10px",
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: "#888",
          marginBottom: 4,
        }}
      >
        {label}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span
          style={{
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value || "—"}
        </span>

        <Button
          size="small"
          icon={<CopyOutlined />}
          onClick={() => copyText(value || "")}
        />
      </div>
    </div>
  );

  return (
    <Card title="Thông tin lao động" style={{ height: "100%" }}>
      {/* Dòng 1 */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <Field
          label="Họ và tên"
          value={employeeData.fullName || ""}
        />
        <Field
          label="Ngày sinh"
          value={formatDate(employeeData.dateOfBirth || "")}
        />

        <Field
          label="Số CCCD"
          value={employeeData.identityNumber || ""}
        />


        <Field
          label="Ngày cấp"
          value={formatDate(employeeData.dateOfIssue || "")}
        />
      </div>

      {/* Dòng 2 */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <Field
          label="Tỉnh"
          value={province}
        />
        <Field
          label="Xã"
          value={commune}
        />
        <Field
          label="Thôn/Xóm"
          value={village}
        />


      </div>

      <iframe
        src={FACTORY_FORM_URL}
        title="Newwing"
        style={{
          width: "100%",
          height: "calc(100vh - 330px)",
          border: "1px solid #ddd",
          borderRadius: 6,
        }}
      />
    </Card>
  );
}