import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Trash2,
  Eye,
  X,
  Flag,
  Star,
  ChevronLeft,
  ChevronRight,
  Building,
  Home,
  User,
  Mail,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Calendar,
  ExternalLink,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

const AdminReviewsManagement = () => {
  // State quản lý danh sách đánh giá
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho filter và search
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    rating: "all",
    landlord: "all",
    status: "all",
    dateRange: "all",
  });

  // State cho pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(10);

  // State cho modal chi tiết đánh giá
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailReview, setDetailReview] = useState(null);

  // State cho modal xác nhận xóa
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  // State cho modal báo cáo đánh giá
  const [showReportModal, setShowReportModal] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [reportReason, setReportReason] = useState("");

  // State cho modal gửi email
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailContent, setEmailContent] = useState({
    subject: "",
    message: "",
  });

  // Danh sách chủ trọ (giả lập)
  const [landlords, setLandlords] = useState([]);

  // Danh sách trạng thái đánh giá
  const reviewStatuses = [
    {
      id: "active",
      name: "Đang hiển thị",
      color: "text-green-600 bg-green-100",
    },
    {
      id: "reported",
      name: "Bị báo cáo",
      color: "text-orange-600 bg-orange-100",
    },
    { id: "hidden", name: "Đã ẩn", color: "text-red-600 bg-red-100" },
    { id: "waiting", name: "Chờ duyệt", color: "text-blue-600 bg-blue-100" },
  ];

  // Dữ liệu lý do báo cáo
  const reportReasons = [
    "Thông tin sai sự thật",
    "Ngôn ngữ không phù hợp",
    "Spam hoặc quảng cáo",
    "Nội dung thù địch/xúc phạm",
    "Vi phạm quyền riêng tư",
    "Khác",
  ];

  // Giả lập dữ liệu
  useEffect(() => {
    // Giả lập API call cho chủ trọ
    setTimeout(() => {
      const mockLandlords = Array(10)
        .fill()
        .map((_, index) => ({
          id: `landlord_${index + 1}`,
          name: `Chủ trọ ${String.fromCharCode(65 + index)}`,
          phone: `098${index}${index + 1}${index + 2}${index + 3}${index + 4}`,
          email: `landlord${index + 1}@example.com`,
          propertyCount: Math.floor(Math.random() * 10) + 1,
          totalReviews: Math.floor(Math.random() * 100) + 10,
          averageRating: (3 + Math.random() * 2).toFixed(1),
        }));
      setLandlords(mockLandlords);

      // Giả lập API call cho danh sách đánh giá
      const today = new Date();
      const mockReviews = Array(50)
        .fill()
        .map((_, index) => {
          // Ngày đánh giá ngẫu nhiên trong 6 tháng gần đây
          const reviewDate = new Date(today);
          reviewDate.setDate(today.getDate() - Math.floor(Math.random() * 180));

          const selectedLandlord = mockLandlords[index % mockLandlords.length];

          // Xác định trạng thái dựa trên index để giả lập
          let status;
          if (index % 15 === 0) {
            status = "reported";
          } else if (index % 12 === 0) {
            status = "hidden";
          } else if (index % 10 === 0) {
            status = "waiting";
          } else {
            status = "active";
          }

          // Rating ngẫu nhiên từ 1-5 sao
          const rating = Math.floor(Math.random() * 5) + 1;

          // Ảnh kèm theo ngẫu nhiên
          const hasPhotos = index % 4 === 0;
          const photos = hasPhotos
            ? Array(Math.floor(Math.random() * 3) + 1)
                .fill()
                .map((_, i) => `photo_${index}_${i}.jpg`)
            : [];

          // Người thuê ngẫu nhiên
          const tenantName =
            [
              "Nguyễn Văn A",
              "Trần Thị B",
              "Lê Văn C",
              "Phạm Thị D",
              "Hoàng Văn E",
            ][index % 5] + ` ${Math.floor(index / 5) + 1}`;

          // Lý do báo cáo nếu status là reported
          const reportDetails =
            status === "reported"
              ? {
                  reason: reportReasons[index % reportReasons.length],
                  reportedBy: index % 2 === 0 ? "Chủ trọ" : "Người dùng khác",
                  reportDate: new Date(
                    reviewDate.getTime() +
                      86400000 * (Math.floor(Math.random() * 5) + 1)
                  )
                    .toISOString()
                    .split("T")[0],
                  reportDescription:
                    "Người dùng này đã đăng nội dung không phù hợp, vi phạm quy định của chúng tôi.",
                }
              : null;

          // Phản hồi của chủ trọ (chỉ có với một số đánh giá)
          const hasLandlordResponse = index % 3 === 0 && status === "active";
          const landlordResponse = hasLandlordResponse
            ? {
                content:
                  "Cảm ơn bạn đã đánh giá. Chúng tôi rất vui vì bạn đã có trải nghiệm tốt và sẽ tiếp tục cải thiện dịch vụ.",
                responseDate: new Date(
                  reviewDate.getTime() +
                    86400000 * (Math.floor(Math.random() * 3) + 1)
                )
                  .toISOString()
                  .split("T")[0],
              }
            : null;

          // Tạo nội dung đánh giá dựa trên rating
          let reviewContent = "";
          if (rating >= 4) {
            reviewContent =
              "Phòng trọ rất tốt, sạch sẽ và đầy đủ tiện nghi. Chủ trọ nhiệt tình và thân thiện. Tôi rất hài lòng với dịch vụ và sẽ giới thiệu cho bạn bè.";
          } else if (rating >= 3) {
            reviewContent =
              "Phòng ở được, có một số tiện nghi cơ bản. Giá cả hợp lý nhưng cần cải thiện thêm về vấn đề dọn dẹp và bảo trì.";
          } else {
            reviewContent =
              "Tôi không hài lòng với phòng trọ này. Nhiều thiết bị hư hỏng, chủ trọ không nhiệt tình sửa chữa. Giá cả không tương xứng với chất lượng.";
          }

          // Phòng được đánh giá
          const roomNumber = `${(index % 5) + 1}0${(index % 10) + 1}`;
          const propertyName = `Nhà trọ ${String.fromCharCode(
            65 + (index % 10)
          )}`;

          return {
            id: `review_${index + 1}`,
            landlord_id: selectedLandlord.id,
            landlord_name: selectedLandlord.name,
            landlord_email: selectedLandlord.email,
            property_name: propertyName,
            property_address: `${(index % 5) + 1}${(index % 10) + 1} Đường số ${
              (index % 20) + 1
            }, Quận ${(index % 12) + 1}, TP.HCM`,
            room_id: `room_${index % 30}`,
            room_number: roomNumber,
            tenant_id: `tenant_${index % 20}`,
            tenant_name: tenantName,
            tenant_avatar: `avatar_${index % 10}.jpg`,
            rating: rating,
            title:
              rating >= 4
                ? "Rất hài lòng!"
                : rating >= 3
                ? "Tạm được"
                : "Không hài lòng",
            content: reviewContent,
            photos: photos,
            review_date: reviewDate.toISOString().split("T")[0],
            status: status,
            report: reportDetails,
            landlord_response: landlordResponse,
            likes: Math.floor(Math.random() * 10),
            helpfulCount: Math.floor(Math.random() * 5),
            admin_reviewed: index % 7 === 0,
          };
        });

      setReviews(mockReviews);
      setLoading(false);
    }, 1000);
  }, []);

  // Lọc đánh giá theo điều kiện search và filter
  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.property_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.landlord_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.tenant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating =
      filters.rating === "all" ||
      (filters.rating === "5" && review.rating === 5) ||
      (filters.rating === "4" && review.rating === 4) ||
      (filters.rating === "3" && review.rating === 3) ||
      (filters.rating === "2" && review.rating === 2) ||
      (filters.rating === "1" && review.rating === 1);

    const matchesStatus =
      filters.status === "all" || review.status === filters.status;

    const matchesLandlord =
      filters.landlord === "all" || review.landlord_id === filters.landlord;

    let matchesDateRange = true;
    const reviewDate = new Date(review.review_date);
    const today = new Date();

    if (filters.dateRange === "last7days") {
      const last7Days = new Date();
      last7Days.setDate(today.getDate() - 7);
      matchesDateRange = reviewDate >= last7Days;
    } else if (filters.dateRange === "last30days") {
      const last30Days = new Date();
      last30Days.setDate(today.getDate() - 30);
      matchesDateRange = reviewDate >= last30Days;
    } else if (filters.dateRange === "last90days") {
      const last90Days = new Date();
      last90Days.setDate(today.getDate() - 90);
      matchesDateRange = reviewDate >= last90Days;
    }

    return (
      matchesSearch &&
      matchesRating &&
      matchesStatus &&
      matchesLandlord &&
      matchesDateRange
    );
  });

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handler cho việc tìm kiếm
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handler cho việc lọc
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  // Handler xem chi tiết đánh giá
  const handleViewReview = (review) => {
    setDetailReview(review);
    setShowDetailModal(true);
  };

  // Handler mở modal xác nhận xóa
  const handleOpenDeleteModal = (review) => {
    setReviewToDelete(review);
    setShowDeleteModal(true);
  };

  // Handler xóa đánh giá
  const handleDeleteReview = () => {
    setReviews(reviews.filter((review) => review.id !== reviewToDelete.id));
    setShowDeleteModal(false);

    // Nếu đang xem chi tiết đánh giá đó, đóng modal chi tiết
    if (detailReview && detailReview.id === reviewToDelete.id) {
      setShowDetailModal(false);
    }
  };

  // Handler mở modal báo cáo đánh giá
  const handleOpenReportModal = (review) => {
    setCurrentReview(review);
    setReportReason("");
    setShowReportModal(true);
  };

  // Handler xử lý báo cáo đánh giá
  const handleProcessReport = (action) => {
    // action: 'hide' hoặc 'dismiss'
    setReviews(
      reviews.map((review) => {
        if (review.id === currentReview.id) {
          return {
            ...review,
            status: action === "hide" ? "hidden" : "active",
            admin_reviewed: true,
            admin_note:
              reportReason ||
              (action === "hide"
                ? "Đánh giá bị ẩn do báo cáo hợp lệ"
                : "Báo cáo đã được xem xét và từ chối"),
            review_date: new Date().toISOString().split("T")[0],
          };
        }
        return review;
      })
    );
    setShowReportModal(false);

    // Nếu đang xem chi tiết đánh giá đó, cập nhật thông tin chi tiết
    if (detailReview && detailReview.id === currentReview.id) {
      setDetailReview({
        ...detailReview,
        status: action === "hide" ? "hidden" : "active",
        admin_reviewed: true,
        admin_note:
          reportReason ||
          (action === "hide"
            ? "Đánh giá bị ẩn do báo cáo hợp lệ"
            : "Báo cáo đã được xem xét và từ chối"),
        review_date: new Date().toISOString().split("T")[0],
      });
    }
  };

  // Handler mở modal gửi email
  const handleOpenEmailModal = (review) => {
    setCurrentReview(review);
    setEmailContent({
      subject: `Thông báo về đánh giá tại ${review.property_name}`,
      message: `Kính gửi ${review.landlord_name},\n\nChúng tôi xin thông báo về một đánh giá mới từ khách hàng ${review.tenant_name} đối với phòng ${review.room_number} tại ${review.property_name}.\n\nĐánh giá: ${review.rating} sao\nNội dung: "${review.content}"\n\nVui lòng truy cập vào hệ thống để xem chi tiết và phản hồi đánh giá này.\n\nTrân trọng,\nĐội ngũ quản trị hệ thống`,
    });
    setShowEmailModal(true);
  };

  // Handler gửi email
  const handleSendEmail = () => {
    // Trong thực tế, gọi API để gửi email
    console.log(`Gửi email đến ${currentReview.landlord_email}`);
    console.log(`Chủ đề: ${emailContent.subject}`);
    console.log(`Nội dung: ${emailContent.message}`);

    alert(`Đã gửi email thông báo đến ${currentReview.landlord_name}`);
    setShowEmailModal(false);
  };

  // Hiển thị rating dưới dạng sao
  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          size={16}
          className={
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }
        />
      ));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Quản lý đánh giá & phản hồi
        </h1>
        <p className="text-gray-600">
          Quản lý và giám sát tất cả đánh giá từ người dùng trên nền tảng
        </p>
      </div>

      {/* Thanh công cụ */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 space-x-0 md:space-x-4">
          {/* Tìm kiếm */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm đánh giá..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>

          {/* Bộ lọc */}
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Đánh giá:</label>
              <select
                name="rating"
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.rating}
                onChange={handleFilterChange}
              >
                <option value="all">Tất cả</option>
                <option value="5">5 sao</option>
                <option value="4">4 sao</option>
                <option value="3">3 sao</option>
                <option value="2">2 sao</option>
                <option value="1">1 sao</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Trạng thái:</label>
              <select
                name="status"
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="all">Tất cả</option>
                {reviewStatuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Chủ trọ:</label>
              <select
                name="landlord"
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.landlord}
                onChange={handleFilterChange}
              >
                <option value="all">Tất cả chủ trọ</option>
                {landlords.map((landlord) => (
                  <option key={landlord.id} value={landlord.id}>
                    {landlord.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Thời gian:</label>
              <select
                name="dateRange"
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.dateRange}
                onChange={handleFilterChange}
              >
                <option value="all">Tất cả</option>
                <option value="last7days">7 ngày qua</option>
                <option value="last30days">30 ngày qua</option>
                <option value="last90days">90 ngày qua</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng số đánh giá</p>
              <p className="text-2xl font-bold text-gray-800">
                {reviews.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <MessageSquare className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Mới trong 30 ngày:{" "}
            {
              reviews.filter((rev) => {
                const reviewDate = new Date(rev.review_date);
                const last30Days = new Date();
                last30Days.setDate(last30Days.getDate() - 30);
                return reviewDate >= last30Days;
              }).length
            }{" "}
            đánh giá
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đánh giá bị báo cáo</p>
              <p className="text-2xl font-bold text-orange-600">
                {reviews.filter((rev) => rev.status === "reported").length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Flag className="h-6 w-6 text-orange-500" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Cần xử lý:{" "}
            {
              reviews.filter(
                (rev) => rev.status === "reported" && !rev.admin_reviewed
              ).length
            }{" "}
            báo cáo
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đánh giá chờ duyệt</p>
              <p className="text-2xl font-bold text-blue-600">
                {reviews.filter((rev) => rev.status === "waiting").length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Đánh giá mới nhất:{" "}
            {reviews.length > 0
              ? new Date(
                  reviews.sort(
                    (a, b) => new Date(b.review_date) - new Date(a.review_date)
                  )[0].review_date
                ).toLocaleDateString("vi-VN")
              : "N/A"}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đánh giá trung bình</p>
              <div className="flex items-center space-x-1">
                <p className="text-2xl font-bold text-yellow-600">
                  {(
                    reviews.reduce((sum, review) => sum + review.rating, 0) /
                    reviews.length
                  ).toFixed(1)}
                </p>
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mt-1" />
              </div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Star className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500 flex space-x-2">
            <span>5★: {reviews.filter((rev) => rev.rating === 5).length}</span>
            <span>4★: {reviews.filter((rev) => rev.rating === 4).length}</span>
            <span>3★: {reviews.filter((rev) => rev.rating === 3).length}</span>
            <span>2★: {reviews.filter((rev) => rev.rating === 2).length}</span>
            <span>1★: {reviews.filter((rev) => rev.rating === 1).length}</span>
          </div>
        </div>
      </div>

      {/* Danh sách đánh giá */}
      {loading ? (
        <div className="bg-white p-6 rounded-lg shadow-sm flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <p className="text-gray-500">
            Không tìm thấy đánh giá nào phù hợp với điều kiện tìm kiếm.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người đánh giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chủ trọ/Phòng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đánh giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nội dung
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentReviews.map((review) => {
                  const statusObj = reviewStatuses.find(
                    (status) => status.id === review.status
                  );

                  return (
                    <tr key={review.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="mr-2">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                              {review.tenant_name.charAt(0)}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {review.tenant_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(review.review_date).toLocaleDateString(
                                "vi-VN"
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {review.landlord_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Phòng {review.room_number} - {review.property_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {review.likes} lượt thích • {review.helpfulCount} hữu
                          ích
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium">
                          {review.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {review.content.substring(0, 80)}
                          {review.content.length > 80 ? "..." : ""}
                        </div>
                        {review.photos.length > 0 && (
                          <div className="text-xs text-blue-500 mt-1">
                            {review.photos.length} ảnh đính kèm
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusObj.color}`}
                        >
                          {statusObj.name}
                        </span>
                        {review.landlord_response && (
                          <div className="text-xs text-green-600 mt-1">
                            Đã có phản hồi
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewReview(review)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Xem chi tiết"
                          >
                            <Eye size={18} />
                          </button>
                          {review.status === "reported" && (
                            <button
                              onClick={() => handleOpenReportModal(review)}
                              className="text-orange-600 hover:text-orange-900"
                              title="Xử lý báo cáo"
                            >
                              <Flag size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEmailModal(review)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Gửi email thông báo"
                          >
                            <Mail size={18} />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(review)}
                            className="text-red-600 hover:text-red-900"
                            title="Xóa đánh giá"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị{" "}
                  <span className="font-medium">{indexOfFirstReview + 1}</span>{" "}
                  đến{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastReview, filteredReviews.length)}
                  </span>{" "}
                  trong tổng số{" "}
                  <span className="font-medium">{filteredReviews.length}</span>{" "}
                  đánh giá
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1
                        ? "text-gray-300"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft size={16} />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border ${
                        currentPage === i + 1
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      } text-sm font-medium`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages
                        ? "text-gray-300"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight size={16} />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết đánh giá */}
      {showDetailModal && detailReview && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Chi tiết đánh giá
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Thông tin người đánh giá và phòng */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <User size={18} className="mr-2" />
                    Thông tin người đánh giá
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
                        {detailReview.tenant_name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {detailReview.tenant_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {detailReview.tenant_id}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Ngày đánh giá:
                        </span>
                        <span className="text-sm text-gray-900">
                          {new Date(
                            detailReview.review_date
                          ).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Lượt thích:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailReview.likes} lượt
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Đánh giá hữu ích:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailReview.helpfulCount} lượt
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <Home size={18} className="mr-2" />
                    Thông tin phòng/chủ trọ
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Chủ trọ:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailReview.landlord_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Email:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailReview.landlord_email}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Nhà trọ:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailReview.property_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Phòng:
                        </span>
                        <span className="text-sm text-gray-900">
                          {detailReview.room_number}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Địa chỉ:
                        </span>
                        <span className="text-sm text-gray-900 text-right">
                          {detailReview.property_address}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thông tin đánh giá */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <MessageSquare size={18} className="mr-2" />
                    Nội dung đánh giá
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <div className="flex items-center mb-3">
                      <div className="mr-2 font-medium text-gray-900">
                        Đánh giá:
                      </div>
                      <div className="flex">
                        {renderStars(detailReview.rating)}
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="font-medium text-gray-900 mb-1">
                        {detailReview.title}
                      </div>
                      <div className="text-gray-700">
                        {detailReview.content}
                      </div>
                    </div>
                    {detailReview.photos.length > 0 && (
                      <div>
                        <div className="font-medium text-gray-900 mb-2">
                          Hình ảnh đính kèm:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {detailReview.photos.map((photo, index) => (
                            <div
                              key={index}
                              className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400"
                            >
                              <ExternalLink size={20} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {detailReview.report && (
                    <div className="bg-orange-50 border border-orange-200 p-4 rounded-md mb-6">
                      <h3 className="text-lg font-medium text-orange-800 mb-3 flex items-center">
                        <Flag size={18} className="mr-2" />
                        Thông tin báo cáo
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-orange-700">
                            Lý do báo cáo:
                          </span>
                          <span className="text-sm text-orange-900">
                            {detailReview.report.reason}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-orange-700">
                            Người báo cáo:
                          </span>
                          <span className="text-sm text-orange-900">
                            {detailReview.report.reportedBy}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-orange-700">
                            Ngày báo cáo:
                          </span>
                          <span className="text-sm text-orange-900">
                            {new Date(
                              detailReview.report.reportDate
                            ).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                        {detailReview.report.reportDescription && (
                          <div>
                            <span className="text-sm font-medium text-orange-700 block mb-1">
                              Mô tả chi tiết:
                            </span>
                            <p className="text-sm text-orange-900">
                              {detailReview.report.reportDescription}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {detailReview.landlord_response && (
                    <div className="bg-green-50 border border-green-200 p-4 rounded-md">
                      <h3 className="text-lg font-medium text-green-800 mb-3 flex items-center">
                        <MessageSquare size={18} className="mr-2" />
                        Phản hồi từ chủ trọ
                      </h3>
                      <div className="text-sm text-gray-700 mb-2">
                        {detailReview.landlord_response.content}
                      </div>
                      <div className="text-xs text-gray-500">
                        Ngày phản hồi:{" "}
                        {new Date(
                          detailReview.landlord_response.responseDate
                        ).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Trạng thái và hành động */}
              <div className="mt-6">
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-md">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      Trạng thái đánh giá:
                    </h3>
                    <div className="flex items-center mt-2">
                      <span
                        className={`px-3 py-1 rounded-full ${
                          reviewStatuses.find(
                            (s) => s.id === detailReview.status
                          )?.color
                        }`}
                      >
                        {
                          reviewStatuses.find(
                            (s) => s.id === detailReview.status
                          )?.name
                        }
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    {detailReview.status === "reported" && (
                      <button
                        onClick={() => handleOpenReportModal(detailReview)}
                        className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 flex items-center"
                      >
                        <Flag size={16} className="mr-2" />
                        Xử lý báo cáo
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenEmailModal(detailReview)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                    >
                      <Mail size={16} className="mr-2" />
                      Gửi email
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(detailReview)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Xóa đánh giá
                    </button>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {showDeleteModal && reviewToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Xác nhận xóa đánh giá
              </h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                <div className="flex items-start">
                  <AlertCircle size={20} className="text-red-600 mr-3 mt-1" />
                  <p className="text-sm text-red-700">
                    Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không
                    thể hoàn tác.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 mr-2">
                      Người đánh giá:
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {reviewToDelete.tenant_name}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 mr-2">
                      Đánh giá:
                    </span>
                    <div className="flex">
                      {renderStars(reviewToDelete.rating)}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block">
                      Nội dung:
                    </span>
                    <p className="text-sm text-gray-900 mt-1">
                      {reviewToDelete.content.substring(0, 100)}
                      {reviewToDelete.content.length > 100 ? "..." : ""}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteReview}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                >
                  <Trash2 size={16} className="mr-2" />
                  Xác nhận xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal báo cáo đánh giá */}
      {showReportModal && currentReview && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Xử lý báo cáo đánh giá
              </h2>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-orange-50 border border-orange-200 rounded-md p-4 mb-4">
                <h3 className="text-base font-medium text-orange-800 mb-2 flex items-center">
                  <Flag size={16} className="mr-2" />
                  Thông tin báo cáo
                </h3>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-orange-700">Lý do:</span>
                    <span className="text-orange-900">
                      {currentReview.report
                        ? currentReview.report.reason
                        : "Không có thông tin"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-orange-700">
                      Người báo cáo:
                    </span>
                    <span className="text-orange-900">
                      {currentReview.report
                        ? currentReview.report.reportedBy
                        : "Không có thông tin"}
                    </span>
                  </div>
                  {currentReview.report &&
                    currentReview.report.reportDescription && (
                      <div>
                        <span className="font-medium text-orange-700 block">
                          Chi tiết:
                        </span>
                        <p className="text-orange-900 mt-1">
                          {currentReview.report.reportDescription}
                        </p>
                      </div>
                    )}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h3 className="text-base font-medium text-gray-800 mb-2">
                  Nội dung đánh giá
                </h3>
                <div className="flex items-center mb-2">
                  <div className="flex mr-2">
                    {renderStars(currentReview.rating)}
                  </div>
                  <span className="text-sm text-gray-500">
                    từ {currentReview.tenant_name}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{currentReview.content}</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú xử lý:
                </label>
                <textarea
                  rows="3"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập ghi chú về việc xử lý báo cáo này"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleProcessReport("dismiss")}
                  className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 flex items-center"
                >
                  <ThumbsUp size={16} className="mr-2" />
                  Bỏ qua báo cáo
                </button>
                <button
                  onClick={() => handleProcessReport("hide")}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                >
                  <ThumbsDown size={16} className="mr-2" />
                  Ẩn đánh giá
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal gửi email */}
      {showEmailModal && currentReview && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Gửi email thông báo
              </h2>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                <div className="flex">
                  <Mail size={20} className="text-blue-600 mr-3 mt-1" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800 mb-1">
                      Thông tin người nhận
                    </h3>
                    <p className="text-sm text-blue-700">
                      Người nhận: {currentReview.landlord_name}
                      <br />
                      Email: {currentReview.landlord_email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề email:
                </label>
                <input
                  type="text"
                  value={emailContent.subject}
                  onChange={(e) =>
                    setEmailContent({
                      ...emailContent,
                      subject: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung email:
                </label>
                <textarea
                  rows="8"
                  value={emailContent.message}
                  onChange={(e) =>
                    setEmailContent({
                      ...emailContent,
                      message: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSendEmail}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Mail size={16} className="mr-2" />
                  Gửi email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviewsManagement;
