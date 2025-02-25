import React, { useState, useEffect } from "react";
import {
  Search,
  Star,
  MessageCircle,
  Send,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

const ReviewsManagement = () => {
  // State quản lý danh sách đánh giá
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho filter và search
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    room: "all",
    rating: "all",
    dateRange: "all",
  });

  // State cho pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(8);

  // State cho modal phản hồi
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  // Danh sách phòng (giả lập)
  const [rooms, setRooms] = useState([]);

  // Giả lập dữ liệu
  useEffect(() => {
    // Giả lập danh sách phòng
    const mockRooms = Array(10)
      .fill()
      .map((_, index) => ({
        id: `room_${index + 1}`,
        room_number: `${(index % 5) + 1}0${(index % 10) + 1}`,
        tenant_name: `Nguyễn Văn ${String.fromCharCode(65 + (index % 5))} ${
          index + 1
        }`,
      }));
    setRooms(mockRooms);

    // Giả lập danh sách đánh giá
    const mockReviews = Array(30)
      .fill()
      .map((_, index) => {
        const reviewDate = new Date();
        reviewDate.setDate(reviewDate.getDate() - (index % 30));

        const selectedRoom = mockRooms[index % mockRooms.length];

        return {
          id: `review_${index + 1}`,
          room_id: selectedRoom.id,
          room_number: selectedRoom.room_number,
          user_id: `user_${Math.floor(Math.random() * 1000)}`,
          rating: Math.floor(Math.random() * 5) + 1, // 1-5 sao
          review: [
            "Phòng sạch sẽ, thoáng mát.",
            "Dịch vụ tốt, nhân viên nhiệt tình.",
            "Vị trí thuận tiện, gần trung tâm.",
            "Không gian thoải mái, yên tĩnh.",
            "Giá cả hợp lý, phù hợp với sinh viên.",
          ][index % 5],
          created_at: reviewDate.toISOString(),
          reply:
            index % 4 === 0
              ? {
                  content:
                    "Cảm ơn bạn đã góp ý. Chúng tôi sẽ tiếp tục cải thiện dịch vụ.",
                  created_at: new Date().toISOString(),
                }
              : null,
        };
      });

    setReviews(mockReviews);
    setLoading(false);
  }, []);

  // Lọc đánh giá theo điều kiện search và filter
  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.review.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRoom =
      filters.room === "all" || review.room_id === filters.room;

    const matchesRating =
      filters.rating === "all" || review.rating === parseInt(filters.rating);

    let matchesDateRange = true;
    const reviewDate = new Date(review.created_at);
    const today = new Date();

    if (filters.dateRange === "current") {
      matchesDateRange =
        reviewDate.getMonth() === today.getMonth() &&
        reviewDate.getFullYear() === today.getFullYear();
    } else if (filters.dateRange === "last3Months") {
      const last3Months = new Date();
      last3Months.setMonth(today.getMonth() - 3);
      matchesDateRange = reviewDate >= last3Months;
    } else if (filters.dateRange === "thisYear") {
      matchesDateRange = reviewDate.getFullYear() === today.getFullYear();
    }

    return matchesSearch && matchesRoom && matchesRating && matchesDateRange;
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

  // Handler mở modal phản hồi
  const handleOpenReplyModal = (review) => {
    setCurrentReview(review);
    setReplyContent("");
    setShowReplyModal(true);
  };

  // Handler gửi phản hồi
  const handleSendReply = (e) => {
    e.preventDefault();

    if (!replyContent.trim()) {
      alert("Vui lòng nhập nội dung phản hồi");
      return;
    }

    // Cập nhật đánh giá với phản hồi mới
    const updatedReviews = reviews.map((review) => {
      if (review.id === currentReview.id) {
        return {
          ...review,
          reply: {
            content: replyContent,
            created_at: new Date().toISOString(),
          },
        };
      }
      return review;
    });

    setReviews(updatedReviews);
    setShowReplyModal(false);
  };

  // Render các ngôi sao đánh giá
  const renderStars = (rating) => {
    return Array(5)
      .fill()
      .map((_, index) => (
        <Star
          key={index}
          size={16}
          className={`inline-block mr-1 ${
            index < rating ? "text-yellow-500 fill-current" : "text-gray-300"
          }`}
        />
      ));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý đánh giá</h1>
        <p className="text-gray-600">
          Quản lý và theo dõi các đánh giá từ khách thuê
        </p>
      </div>

      {/* Thanh công cụ */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-row justify-between items-center space-x-4">
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
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Phòng:</label>
              <select
                name="room"
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.room}
                onChange={handleFilterChange}
              >
                <option value="all">Tất cả phòng</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    Phòng {room.room_number}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Số sao:</label>
              <select
                name="rating"
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.rating}
                onChange={handleFilterChange}
              >
                <option value="all">Tất cả</option>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} sao
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
                <option value="current">Tháng hiện tại</option>
                <option value="last3Months">3 tháng gần đây</option>
                <option value="thisYear">Năm nay</option>
              </select>
            </div>
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
                    Phòng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đánh giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số sao
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày đánh giá
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Phòng {review.room_number}
                      </div>
                      <div className="text-xs text-gray-500">
                        Mã người dùng: {review.user_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-normal max-w-xs">
                      <div className="text-sm text-gray-900 truncate">
                        {review.review}
                      </div>
                      {review.reply && (
                        <div className="text-xs text-gray-500 mt-1 italic">
                          Phản hồi: {review.reply.content}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStars(review.rating)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenReplyModal(review)}
                        className={`text-blue-600 hover:text-blue-900 ${
                          review.reply ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={!!review.reply}
                      >
                        <MessageCircle size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
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

      {/* Modal phản hồi đánh giá */}
      {showReplyModal && currentReview && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Phản hồi đánh giá
              </h2>
              <button
                onClick={() => setShowReplyModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSendReply} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thông tin đánh giá
                </label>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Phòng: {currentReview.room_number}
                      </span>
                    </div>
                    <div>{renderStars(currentReview.rating)}</div>
                  </div>
                  <p className="text-sm text-gray-800">
                    {currentReview.review}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Ngày đánh giá:{" "}
                    {new Date(currentReview.created_at).toLocaleDateString(
                      "vi-VN"
                    )}
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="reply-content"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nội dung phản hồi <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="reply-content"
                  rows="4"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập phản hồi của bạn..."
                  required
                ></textarea>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReplyModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Send size={16} className="mr-2" />
                  Gửi phản hồi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsManagement;
