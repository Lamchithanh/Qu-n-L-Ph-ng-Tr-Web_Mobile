import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, FileText, X } from "lucide-react";

const ContractTerms = ({ onClose }) => {
  const [expandedSections, setExpandedSections] = useState({});

  // Đóng modal khi nhấn ESC
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Sử dụng màu sắc từ file SCSS
  const colors = {
    primary: "#4f46e5",
    secondary: "#06b6d4",
    gray600: "#666",
    gray200: "#eee",
    yellow400: "#fbbf24",
  };

  const sections = [
    {
      id: "general",
      title: "ĐIỀU 1: QUY ĐỊNH CHUNG",
      content: [
        "1.1. Hai bên tự nguyện thỏa thuận ký kết hợp đồng thuê phòng trọ và cam kết thực hiện đúng các điều khoản được nêu trong hợp đồng.",
        "1.2. Bên B đồng ý cho Bên A thuê phòng trọ và Bên A đồng ý thuê phòng trọ của Bên B theo các điều khoản được quy định trong hợp đồng này.",
        "1.3. Hợp đồng này được lập thành 02 bản có giá trị pháp lý như nhau, mỗi bên giữ 01 bản.",
      ],
    },
    {
      id: "property",
      title: "ĐIỀU 2: ĐỐI TƯỢNG VÀ HIỆN TRẠNG TÀI SẢN CHO THUÊ",
      content: [
        "2.1. Bên B đồng ý cho Bên A thuê phòng trọ tại địa chỉ nêu trong hợp đồng.",
        "2.2. Hiện trạng phòng trọ và trang thiết bị kèm theo (nếu có) được mô tả chi tiết trong biên bản bàn giao tài sản đính kèm hợp đồng này.",
        "2.3. Mục đích thuê: Để ở, không được sử dụng vào mục đích khác khi không có sự đồng ý của Bên B.",
      ],
    },
    {
      id: "duration",
      title: "ĐIỀU 3: THỜI HẠN THUÊ VÀ GIA HẠN HỢP ĐỒNG",
      content: [
        "3.1. Thời hạn thuê được tính từ ngày bắt đầu đến ngày kết thúc như đã nêu trong hợp đồng.",
        "3.2. Khi hết thời hạn thuê, nếu Bên A muốn tiếp tục thuê thì phải thông báo cho Bên B trước ít nhất [THỜI_GIAN_THÔNG_BÁO] ngày. Hai bên sẽ thỏa thuận để ký hợp đồng mới hoặc phụ lục gia hạn hợp đồng.",
        "3.3. Trong thời gian thuê, nếu Bên A muốn chấm dứt hợp đồng trước thời hạn phải thông báo cho Bên B trước ít nhất [THỜI_GIAN_THÔNG_BÁO] ngày và phải chịu mất tiền đặt cọc.",
      ],
    },
    {
      id: "payment",
      title: "ĐIỀU 4: GIÁ THUÊ VÀ PHƯƠNG THỨC THANH TOÁN",
      content: [
        "4.1. Giá thuê phòng trọ được hai bên thống nhất như đã nêu trong hợp đồng.",
        "4.2. Tiền thuê được thanh toán mỗi tháng một lần vào ngày [NGÀY_THANH_TOÁN] của tháng.",
        "4.3. Phương thức thanh toán: Tiền mặt hoặc chuyển khoản theo thông tin tài khoản của Bên B.",
        "4.4. Tiền đặt cọc: Bên A đặt cọc cho Bên B số tiền tương đương [SỐ_THÁNG_ĐẶT_CỌC] tháng tiền thuê. Tiền đặt cọc sẽ được Bên B hoàn trả cho Bên A khi kết thúc hợp đồng và sau khi đã trừ các khoản chi phí phát sinh (nếu có).",
      ],
    },
    {
      id: "utilities",
      title: "ĐIỀU 5: TIỀN ĐIỆN, NƯỚC VÀ CÁC DỊCH VỤ KHÁC",
      content: [
        "5.1. Tiền điện: Tính theo chỉ số công tơ điện vào ngày [NGÀY_GHI_SỐ] hàng tháng, đơn giá [GIÁ_ĐIỆN] đồng/kWh.",
        "5.2. Tiền nước: Tính theo chỉ số đồng hồ nước vào ngày [NGÀY_GHI_SỐ] hàng tháng, đơn giá [GIÁ_NƯỚC] đồng/m³.",
        "5.3. Phí Internet: [PHÍ_INTERNET] đồng/tháng.",
        "5.4. Phí dịch vụ khác (nếu có): [PHÍ_DỊCH_VỤ_KHÁC].",
        "5.5. Bên A có trách nhiệm thanh toán đầy đủ các khoản phí dịch vụ cùng với tiền thuê phòng.",
      ],
    },
    {
      id: "responsibilities_a",
      title: "ĐIỀU 6: QUYỀN VÀ NGHĨA VỤ CỦA BÊN A (BÊN THUÊ)",
      content: [
        "6.1. Quyền của Bên A:",
        "   a) Nhận phòng trọ và trang thiết bị kèm theo (nếu có) theo đúng thỏa thuận.",
        "   b) Yêu cầu Bên B sửa chữa kịp thời những hư hỏng không phải do lỗi của mình.",
        "   c) Được sử dụng các dịch vụ tiện ích kèm theo (nếu có) theo thỏa thuận.",
        "6.2. Nghĩa vụ của Bên A:",
        "   a) Sử dụng phòng trọ đúng mục đích và giữ gìn tài sản trong phòng.",
        "   b) Thanh toán đầy đủ, đúng hạn tiền thuê phòng và các chi phí khác.",
        "   c) Tuân thủ nội quy nhà trọ và quy định của địa phương nơi cư trú.",
        "   d) Không được tự ý cải tạo, sửa chữa, thay đổi kết cấu phòng trọ khi chưa được sự đồng ý của Bên B.",
        "   e) Bồi thường thiệt hại do mình gây ra đối với trang thiết bị, tài sản của Bên B.",
        "   f) Thông báo cho Bên B ít nhất [THỜI_GIAN_THÔNG_BÁO] ngày nếu muốn chấm dứt hợp đồng trước thời hạn.",
      ],
    },
    {
      id: "responsibilities_b",
      title: "ĐIỀU 7: QUYỀN VÀ NGHĨA VỤ CỦA BÊN B (BÊN CHO THUÊ)",
      content: [
        "7.1. Quyền của Bên B:",
        "   a) Nhận tiền thuê phòng đúng hạn theo thỏa thuận.",
        "   b) Kiểm tra, nhắc nhở Bên A việc thực hiện hợp đồng và nội quy nhà trọ.",
        "   c) Đơn phương chấm dứt hợp đồng khi Bên A vi phạm nghiêm trọng các điều khoản trong hợp đồng.",
        "7.2. Nghĩa vụ của Bên B:",
        "   a) Giao phòng trọ và trang thiết bị kèm theo (nếu có) đúng như thỏa thuận.",
        "   b) Bảo đảm quyền sử dụng phòng trọ ổn định cho Bên A trong thời gian thuê.",
        "   c) Bảo dưỡng, sửa chữa kịp thời những hư hỏng không phải do lỗi của Bên A.",
        "   d) Thông báo cho Bên A ít nhất [THỜI_GIAN_THÔNG_BÁO] ngày nếu có thay đổi về giá thuê hoặc chấm dứt hợp đồng trước thời hạn.",
      ],
    },
    {
      id: "rules",
      title: "ĐIỀU 8: NỘI QUY NHÀ TRỌ",
      content: [
        "8.1. Giữ gìn vệ sinh chung, bỏ rác đúng nơi quy định.",
        "8.2. Không gây ồn ào, mất trật tự sau [GIỜ_NGHỈ_TỐI] đến [GIỜ_BẮT_ĐẦU_SÁNG] giờ sáng hôm sau.",
        "8.3. Không tổ chức đánh bạc, sử dụng chất kích thích, ma túy và các hoạt động vi phạm pháp luật khác.",
        "8.4. Không nuôi động vật khi chưa được sự đồng ý của Bên B.",
        "8.5. Không được cho người khác vào ở khi chưa được sự đồng ý của Bên B.",
        "8.6. Tiết kiệm điện, nước và đảm bảo an toàn phòng cháy chữa cháy.",
        "8.7. [NỘI_QUY_BỔ_SUNG].",
      ],
    },
    {
      id: "termination",
      title: "ĐIỀU 9: CHẤM DỨT HỢP ĐỒNG",
      content: [
        "9.1. Hợp đồng chấm dứt trong các trường hợp sau:",
        "   a) Hết thời hạn thuê và không có thỏa thuận gia hạn.",
        "   b) Hai bên thỏa thuận chấm dứt hợp đồng trước thời hạn.",
        "   c) Bên A vi phạm nghiêm trọng các điều khoản trong hợp đồng hoặc nội quy nhà trọ.",
        "   d) Phòng trọ không đảm bảo an toàn cho việc sử dụng hoặc bị hư hỏng nặng.",
        "9.2. Khi chấm dứt hợp đồng, Bên A phải bàn giao phòng trọ và trang thiết bị kèm theo (nếu có) cho Bên B trong tình trạng tốt như khi nhận, trừ hao mòn tự nhiên.",
      ],
    },
    {
      id: "disputes",
      title: "ĐIỀU 10: GIẢI QUYẾT TRANH CHẤP",
      content: [
        "10.1. Trong quá trình thực hiện hợp đồng, nếu có tranh chấp phát sinh, hai bên sẽ cùng nhau thương lượng, hòa giải trên tinh thần thiện chí, hợp tác.",
        "10.2. Trường hợp không thể giải quyết được bằng thương lượng, hòa giải, thì một trong hai bên có quyền yêu cầu Tòa án có thẩm quyền giải quyết theo quy định của pháp luật.",
      ],
    },
    {
      id: "others",
      title: "ĐIỀU 11: ĐIỀU KHOẢN KHÁC",
      content: [
        "11.1. Mọi sửa đổi, bổ sung đối với hợp đồng này phải được lập thành văn bản có chữ ký của cả hai bên.",
        "11.2. Hợp đồng này có hiệu lực kể từ ngày ký.",
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="sticky top-0 p-4 rounded-t-lg flex items-center justify-between z-10"
          style={{
            background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
            color: "white",
          }}
        >
          <div className="flex items-center">
            <FileText className="mr-2" size={24} />
            <h2 className="text-xl font-bold">
              Điều Khoản và Điều Kiện Hợp Đồng Thuê Trọ
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-white hover:bg-opacity-20 transition"
            aria-label="Đóng"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p style={{ color: colors.gray600 }}>
              Hợp đồng thuê phòng trọ này được lập vào ngày được ghi trong phần
              thông tin hợp đồng, giữa các bên sau đây:
            </p>
            <p className="mt-2">
              <strong
                style={{
                  background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                BÊN CHO THUÊ (Bên A):
              </strong>{" "}
              Chủ sở hữu phòng trọ
            </p>
            <p className="mt-2">
              <strong
                style={{
                  background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                BÊN THUÊ (Bên B):
              </strong>{" "}
              Người thuê phòng trọ
            </p>
            <p className="mt-4" style={{ color: colors.gray600 }}>
              Hai bên thống nhất ký kết hợp đồng thuê phòng trọ với các điều
              khoản sau:
            </p>
          </div>

          <div className="space-y-4">
            {sections.map((section) => (
              <div
                key={section.id}
                className="rounded-lg overflow-hidden shadow-sm"
                style={{ border: `1px solid ${colors.gray200}` }}
              >
                <div
                  className="flex justify-between items-center p-4 cursor-pointer"
                  style={{
                    background: expandedSections[section.id]
                      ? `linear-gradient(145deg, #f8fafc, #ffffff)`
                      : `#f8fafc`,
                  }}
                  onClick={() => toggleSection(section.id)}
                >
                  <h3 className="font-bold" style={{ color: colors.primary }}>
                    {section.title}
                  </h3>
                  {expandedSections[section.id] ? (
                    <ChevronUp size={20} style={{ color: colors.primary }} />
                  ) : (
                    <ChevronDown size={20} style={{ color: colors.primary }} />
                  )}
                </div>
                {expandedSections[section.id] && (
                  <div className="p-4 bg-white">
                    {section.content.map((paragraph, idx) => (
                      <p
                        key={idx}
                        className="mb-2"
                        style={{ color: colors.gray600, lineHeight: "1.6" }}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div
            className="mt-8 p-4 rounded-lg"
            style={{ background: "rgba(79, 70, 229, 0.05)" }}
          >
            <p className="text-center" style={{ color: colors.gray600 }}>
              Bằng việc đánh dấu vào ô "Tôi đã đọc và đồng ý với tất cả điều
              khoản và điều kiện của hợp đồng", bạn xác nhận đã hiểu rõ và chấp
              nhận các điều khoản nêu trên.
            </p>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-lg font-medium transition"
              style={{
                background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                color: "white",
                border: "none",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              Tôi đã đọc và hiểu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractTerms;
