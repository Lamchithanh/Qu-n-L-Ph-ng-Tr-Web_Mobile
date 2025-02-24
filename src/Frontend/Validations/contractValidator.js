// src/Backend/validators/contractValidator.js
export const validateContract = (data) => {
  const errors = [];

  // Kiểm tra room_id
  if (!data.room_id) {
    errors.push("Mã phòng là bắt buộc");
  }

  // Kiểm tra tenant_id
  if (!data.tenant_id) {
    errors.push("Mã người thuê là bắt buộc");
  }

  // Kiểm tra ngày bắt đầu
  if (!data.start_date) {
    errors.push("Ngày bắt đầu hợp đồng là bắt buộc");
  }

  // Kiểm tra ngày kết thúc
  if (!data.end_date) {
    errors.push("Ngày kết thúc hợp đồng là bắt buộc");
  }

  // Kiểm tra ngày kết thúc phải sau ngày bắt đầu
  if (data.start_date && data.end_date) {
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);

    if (endDate <= startDate) {
      errors.push("Ngày kết thúc phải sau ngày bắt đầu");
    }
  }

  // Kiểm tra tiền đặt cọc
  if (!data.deposit_amount || data.deposit_amount < 0) {
    errors.push("Tiền đặt cọc không hợp lệ");
  }

  // Kiểm tra tiền thuê hàng tháng
  if (!data.monthly_rent || data.monthly_rent <= 0) {
    errors.push("Tiền thuê hàng tháng không hợp lệ");
  }

  // Kiểm tra ngày thanh toán
  if (!data.payment_date) {
    errors.push("Ngày thanh toán là bắt buộc");
  }

  // Trả về kết quả validate
  return {
    error:
      errors.length > 0
        ? {
            details: errors.map((message) => ({ message })),
          }
        : null,
  };
};

export default validateContract;
