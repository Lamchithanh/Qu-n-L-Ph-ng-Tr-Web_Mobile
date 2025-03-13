import React, { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Calendar,
  User,
  Home,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Download,
  Edit,
  FileSignature,
  Clock,
  Shield,
  X,
  Info,
  Search,
} from "lucide-react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from "../../Style/RentalContract.module.scss";
import SignContractModal from "../Contexts/SignContractModal";
import { CONFIG } from "../config/config";
import { useToast } from "../Contexts/ToastContext";

// Hàm tạo mã hợp đồng ngẫu nhiên (8 ký tự)
const formatContractId = (id) => {
  return `HD${id.toString().padStart(4, "0")}`;
};

const RentalContract = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Thay đổi thành userToken
  const token = localStorage.getItem("userToken");
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [userProfile, setUserProfile] = useState(null);
  const { id: roomId } = useParams();
  const { showToast } = useToast();

  // State management
  const [activeSection, setActiveSection] = useState("overview");
  const [contractData, setContractData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [guestMode, setGuestMode] = useState(false);

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({
    name: "",
    id: "",
    phone: "",
    email: "",
    address: "",
  });

  // Contract signing states
  const [showSignModal, setShowSignModal] = useState(false);
  const [signStatus, setSignStatus] = useState({
    signing: false,
    success: false,
    error: null,
  });

  // Terms expansion
  const [expandedTerms, setExpandedTerms] = useState([]);

  // Service usages
  const [serviceUsages, setServiceUsages] = useState([]);

  // Room data (for guest users)
  const [roomData, setRoomData] = useState(null);

  // Kiểm tra trạng thái đăng nhập và chế độ xem
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    console.log("Token được đọc trong onConfirm:", token);
    setIsLoggedIn(!!token);

    // Nếu đến từ trang chi tiết phòng, chuyển sang chế độ khách
    if (roomId && !token) {
      setGuestMode(true);
      fetchRoomData();
    } else if (token) {
      // Nếu đã đăng nhập, lấy thông tin người dùng
      fetchUserProfile();
      // Nếu có roomId, tức là đang tạo hợp đồng mới
      if (roomId) {
        fetchRoomData();
      } else {
        // Nếu không có roomId, lấy hợp đồng hiện tại của người dùng
        fetchContractData();
      }
    }
  }, [roomId]);

  useEffect(() => {
    if (userProfile && isLoggedIn) {
      // Tự động điền thông tin người dùng vào form
      setEditedInfo({
        name: userProfile.full_name || "",
        id: userProfile.tenant_info?.id_card_number || userProfile.cccd || "",
        phone: userProfile.phone || "",
        email: userProfile.email || "",
        address: userProfile.tenant_info?.permanent_address || "",
      });

      // Kiểm tra xem có thiếu thông tin quan trọng nào không để hiển thị form chỉnh sửa
      const missingInfo =
        !userProfile.full_name ||
        !userProfile.phone ||
        !userProfile.email ||
        !(userProfile.tenant_info?.id_card_number || userProfile.cccd);

      if (missingInfo) {
        setIsEditing(true);
        showToast("Vui lòng bổ sung thông tin cá nhân để ký hợp đồng", "info");
      }
    }
  }, [userProfile]);

  useEffect(() => {
    const token = localStorage.getItem("userToken");

    // Nếu không có token nhưng đã đăng nhập, thử khôi phục
    if (!token && isLoggedIn) {
      // Gọi API để lấy lại token hoặc yêu cầu người dùng đăng nhập lại
      console.warn("Token bị mất, vui lòng đăng nhập lại");
      // Chuyển hướng đến trang đăng nhập
      navigate("/auth", {
        state: {
          returnUrl: `/RentalContract/${roomId}`,
        },
      });
    }
  }, [isLoggedIn, roomId]);

  useEffect(() => {
    const token = localStorage.getItem("userToken");

    // Nếu có token nhưng chưa đăng nhập
    if (token && !isLoggedIn) {
      setIsLoggedIn(true);
      fetchUserProfile();
    }
  }, []);

  // Fetch user profile for logged in users
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("userToken");
      // Kiểm tra token trước khi fetch
      if (!token) {
        console.warn("No token available");
        return;
      }

      const response = await fetch(`${CONFIG.API_URL}/users/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Không thể lấy thông tin người dùng");
      }

      const profileData = await response.json();
      setUserProfile(profileData);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      showToast("Không thể lấy thông tin người dùng", "error");
    }
  };

  useEffect(() => {
    // Chỉ fetch profile khi có token và chưa có profile
    if (token && !userProfile) {
      fetchUserProfile();
    }
  }, [token, userProfile]);

  useEffect(() => {
    if (userProfile && isLoggedIn) {
      // Kiểm soát điều kiện chỉnh sửa chặt chẽ hơn
      const missingInfo =
        !userProfile.full_name ||
        !userProfile.phone ||
        !userProfile.email ||
        !userProfile.cccd;

      // Chỉ mở chế độ chỉnh sửa nếu thực sự thiếu thông tin
      if (missingInfo) {
        setIsEditing(true);
        showToast("Vui lòng bổ sung thông tin cá nhân để ký hợp đồng", "info");
      } else {
        // Nếu đủ thông tin, điền vào form nhưng không mở chế độ chỉnh sửa
        setEditedInfo({
          name: userProfile.full_name || "",
          id: userProfile.cccd || "",
          phone: userProfile.phone || "",
          email: userProfile.email || "",
          address: userProfile.tenant_info?.permanent_address || "",
        });
      }
    }
  }, [userProfile, isLoggedIn]);

  // Fetch room data for contracts
  const fetchRoomData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${CONFIG.API_URL}/rooms/${roomId}`);

      if (!response.ok) {
        throw new Error("Không thể tải thông tin phòng");
      }

      const result = await response.json();

      if (result.success) {
        setRoomData(result.data);
        if (isLoggedIn && userProfile) {
          // Tạo dữ liệu hợp đồng mẫu từ thông tin phòng và người dùng đã đăng nhập
          createContractFromRoomAndUser(result.data, userProfile);
        } else {
          // Tạo dữ liệu hợp đồng mẫu từ thông tin phòng cho khách
          generateSampleContract(result.data);
        }
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setError(error.message);
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Tạo dữ liệu hợp đồng mẫu từ thông tin phòng
  const generateSampleContract = (room) => {
    const today = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 6); // Mặc định 6 tháng

    const sampleContract = {
      id: room.id ? formatContractId(room.id) : "HDTEMP",
      status: "pending",
      startDate: today.toISOString(),
      endDate: endDate.toISOString(),
      room: {
        id: room.id,
        name: room.title,
        number: room.room_number || "",
        address: room.location?.address || "Chưa có địa chỉ",
        area: room.details?.area ? `${room.details.area}m²` : "Chưa cập nhật",
        image: room.images?.[0] || "",
        type: "Phòng trọ",
      },
      tenant: {
        id: "",
        name: "",
        phone: "",
        email: "",
        id_card: "",
      },
      landlord: {
        id: room.contact?.landlord_id || "",
        name: "Chủ trọ",
        phone: room.contact?.phone || "Chưa cập nhật",
        email: room.contact?.email || "Chưa cập nhật",
      },
      payment: {
        rent: parseFloat(room.pricing?.original_price || 0),
        deposit: parseFloat(room.pricing?.original_price || 0) * 2,
        services: [
          { name: "Phí điện", amount: "3,500 VNĐ/kWh" },
          { name: "Phí nước", amount: "25,000 VNĐ/m³" },
          { name: "Internet", amount: "200,000 VNĐ/tháng" },
          { name: "Phí dịch vụ", amount: "200,000 VNĐ/tháng" },
        ],
      },
      terms: generateDefaultTerms(room, today, endDate),
    };

    setContractData(sampleContract);

    // Setup edited info trong trường hợp khách chưa đăng nhập
    setEditedInfo({
      name: "",
      id: "",
      phone: "",
      email: "",
      address: "",
    });

    // Tự động bật chế độ chỉnh sửa nếu đang ở chế độ khách
    setIsEditing(true);
  };

  // Tạo dữ liệu hợp đồng mẫu từ thông tin phòng và thông tin người dùng đã đăng nhập
  const createContractFromRoomAndUser = (room, userData) => {
    try {
      const today = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 6); // Mặc định 6 tháng

      // Tự động lấy thông tin từ profile người dùng
      const tenant = {
        id: userData.tenant_info?.id || "",
        name: userData.full_name || "",
        phone: userData.phone || "",
        email: userData.email || "",
        id_card: userData.tenant_info?.id_card_number || userData.cccd || "",
      };

      const sampleContract = {
        id: generateContractCode(),
        status: "pending",
        startDate: today.toISOString(),
        endDate: endDate.toISOString(),
        room: {
          id: room.id,
          name: room.title,
          number: room.room_number || "",
          address: room.location?.address || "Chưa có địa chỉ",
          area: room.details?.area ? `${room.details.area}m²` : "Chưa cập nhật",
          image: room.images?.[0] || "",
          type: "Phòng trọ",
        },
        tenant: tenant,
        landlord: {
          id: room.contact?.landlord_id || "",
          name: "Chủ trọ",
          phone: room.contact?.phone || "Chưa cập nhật",
          email: room.contact?.email || "Chưa cập nhật",
        },
        payment: {
          rent: parseFloat(room.pricing?.original_price || 0),
          deposit: parseFloat(room.pricing?.original_price || 0) * 2,
          services: [
            { name: "Phí điện", amount: "3,500 VNĐ/kWh" },
            { name: "Phí nước", amount: "25,000 VNĐ/m³" },
            { name: "Internet", amount: "200,000 VNĐ/tháng" },
            { name: "Phí dịch vụ", amount: "200,000 VNĐ/tháng" },
          ],
        },
        terms: generateDefaultTerms(room, today, endDate),
      };

      setContractData(sampleContract);

      // Tự động điền thông tin từ profile
      setEditedInfo({
        name: userData.full_name || "",
        id: userData.tenant_info?.id_card_number || userData.cccd || "",
        phone: userData.phone || "",
        email: userData.email || "",
        address: userData.tenant_info?.permanent_address || "",
      });

      // Kiểm tra xem có thiếu thông tin quan trọng nào không
      const missingInfo =
        !userData.full_name ||
        !userData.phone ||
        !userData.email ||
        !(userData.tenant_info?.id_card_number || userData.cccd);

      // Tự động bật chế độ chỉnh sửa nếu thiếu thông tin
      if (missingInfo) {
        setIsEditing(true);
        showToast("Vui lòng bổ sung thông tin cá nhân để tiếp tục", "info");
      }
    } catch (error) {
      console.error("Lỗi khi tạo hợp đồng:", error);
      showToast("Không thể tạo hợp đồng mới", "error");
    }
  };

  // Tạo các điều khoản mặc định
  const generateDefaultTerms = (room, startDate, endDate) => {
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };

    return [
      {
        id: 1,
        title: "1. Điều khoản chung",
        content:
          "Hai bên tự nguyện thỏa thuận và cam kết thực hiện đúng các điều khoản trong hợp đồng thuê phòng này.",
      },
      {
        id: 2,
        title: "2. Thời hạn cho thuê",
        content: `Thời hạn thuê phòng từ ${formatDate(
          startDate
        )} đến ${formatDate(
          endDate
        )}. Hợp đồng có thể gia hạn nếu hai bên đồng ý.`,
      },
      {
        id: 3,
        title: "3. Giá thuê và thanh toán",
        content: `Giá thuê phòng là ${formatCurrency(
          room.pricing?.original_price || 0
        )}/tháng. Tiền đặt cọc là ${formatCurrency(
          (room.pricing?.original_price || 0) * 2
        )}.`,
      },
      {
        id: 4,
        title: "4. Trách nhiệm của bên thuê",
        content:
          "Bên thuê có trách nhiệm giữ gìn, bảo quản phòng ở và tài sản trong phòng, thanh toán đúng hạn, tuân thủ nội quy chung.",
      },
      {
        id: 5,
        title: "5. Trách nhiệm của bên cho thuê",
        content:
          "Bên cho thuê có trách nhiệm bảo đảm chất lượng phòng ở, đảm bảo quyền sử dụng hợp pháp, sửa chữa kịp thời các hư hỏng không do lỗi của bên thuê.",
      },
    ];
  };

  // Fetch contract data for logged in users
  const fetchContractData = async () => {
    try {
      const token = localStorage.getItem("userToken");
      setLoading(true);

      const response = await fetch(`${CONFIG.API_URL}/contracts/current`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 404) {
        setContractData(null);
        return;
      }

      if (!response.ok) {
        throw new Error("Không thể tải thông tin hợp đồng");
      }

      const result = await response.json();

      if (result.success) {
        setContractData(result.data);
        setEditedInfo({
          name: result.data.tenant.name,
          id: result.data.tenant.id_card,
          phone: result.data.tenant.phone,
          email: result.data.tenant.email,
          address: result.data.tenant.address || "",
        });

        // Lấy thông tin dịch vụ
        fetchServiceUsages(result.data.id);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setError(error.message);
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch service usages
  const fetchServiceUsages = async (contractId) => {
    if (!contractId) return;

    try {
      const token = localStorage.getItem("userToken");
      const response = await fetch(
        `${CONFIG.API_URL}/contracts/${contractId}/service-usages`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const result = await response.json();

      if (result.success) {
        setServiceUsages(result.data);
      }
    } catch (error) {
      showToast("Không thể tải dịch vụ", "error");
    }
  };

  // Toggle terms expansion
  const toggleTerm = (id) => {
    if (expandedTerms.includes(id)) {
      setExpandedTerms(expandedTerms.filter((termId) => termId !== id));
    } else {
      setExpandedTerms([...expandedTerms, id]);
    }
  };

  // Validation functions
  const validateEditedInfo = () => {
    const errors = {};

    if (!editedInfo.name.trim()) {
      errors.name = "Tên không được trống";
    }

    if (!editedInfo.phone.match(/^(0\d{9,10})$/)) {
      errors.phone = "Số điện thoại không hợp lệ";
    }

    if (!editedInfo.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = "Email không hợp lệ";
    }

    if (!editedInfo.id.trim()) {
      errors.id = "Số CMND/CCCD không được trống";
    }

    return errors;
  };

  // Handlers
  const handleUpdateInfo = async () => {
    const validationErrors = validateEditedInfo();

    if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach((error) =>
        showToast(error, "error")
      );
      return;
    }

    if (guestMode || !isLoggedIn) {
      // Trong chế độ khách, chỉ lưu thông tin vào state
      setContractData((prev) => ({
        ...prev,
        tenant: {
          ...prev.tenant,
          name: editedInfo.name,
          id_card: editedInfo.id,
          phone: editedInfo.phone,
          email: editedInfo.email,
        },
      }));
      setIsEditing(false);
      showToast("Đã cập nhật thông tin người thuê", "success");
      return;
    }

    try {
      // Người dùng đã đăng nhập, cập nhật thông tin vào cả hệ thống
      const token = localStorage.getItem("userToken");
      console.log("Token được đọc trong onConfirm:", token);

      // 1. Cập nhật thông tin người dùng
      const userUpdateResponse = await fetch(
        `${CONFIG.API_URL}/users/profile-updateUser`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            full_name: editedInfo.name,
            phone: editedInfo.phone,
            cccd: editedInfo.id,
            address: editedInfo.address,
          }),
        }
      );

      if (!userUpdateResponse.ok) {
        const errorData = await userUpdateResponse.json();
        throw new Error(
          errorData.message || "Không thể cập nhật thông tin người dùng"
        );
      }

      // 2. Nếu đang xem hợp đồng hiện tại, cập nhật thông tin vào hợp đồng
      if (contractData && contractData.id && !roomId) {
        const contractUpdateResponse = await fetch(
          `${CONFIG.API_URL}/contracts/${contractData.id}/tenant-info`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(editedInfo),
          }
        );

        if (!contractUpdateResponse.ok) {
          const errorData = await contractUpdateResponse.json();
          throw new Error(
            errorData.message || "Không thể cập nhật thông tin hợp đồng"
          );
        }
      }

      // Cập nhật state
      setContractData((prev) => ({
        ...prev,
        tenant: {
          ...prev.tenant,
          name: editedInfo.name,
          id_card: editedInfo.id,
          phone: editedInfo.phone,
          email: editedInfo.email,
        },
      }));

      setIsEditing(false);
      showToast("Cập nhật thông tin thành công", "success");

      // Cập nhật thông tin người dùng trong state
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          full_name: editedInfo.name,
          phone: editedInfo.phone,
          cccd: editedInfo.id,
          tenant_info: {
            ...(userProfile.tenant_info || {}),
            id_card_number: editedInfo.id,
            permanent_address: editedInfo.address,
          },
        });
      }
    } catch (error) {
      showToast(error.message || "Lỗi cập nhật thông tin", "error");
    }
  };

  // Xử lý ký hợp đồng
  const handleSignContract = async () => {
    try {
      // Kiểm tra và lấy token từ localStorage
      const token = localStorage.getItem("userToken");
      console.log("Token được kiểm tra:", token);

      // Nếu không có token, hiển thị thông báo lỗi
      if (!token) {
        showToast("Vui lòng đăng nhập để ký hợp đồng", "error");
        return;
      }

      // Kiểm tra thông tin bị thiếu trước khi ký hợp đồng
      if (checkMissingInfo()) {
        setIsEditing(true);
        showToast(
          "Vui lòng bổ sung đầy đủ thông tin cá nhân trước khi ký hợp đồng",
          "error"
        );
        return;
      }

      setSignStatus({ signing: true, success: false, error: null });

      if (isLoggedIn) {
        // Người dùng đã đăng nhập
        if (roomId) {
          // Đang tạo hợp đồng mới
          const createContractResponse = await fetch(
            `${CONFIG.API_URL}/contracts`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                room_id: roomData.id,
                tenant_info: {
                  name: editedInfo.name,
                  id_card: editedInfo.id,
                  phone: editedInfo.phone,
                  email: editedInfo.email,
                  address: editedInfo.address,
                },
                start_date: contractData.startDate,
                end_date: contractData.endDate,
                deposit_amount: contractData.payment.deposit,
                monthly_rent: contractData.payment.rent,
              }),
            }
          );

          if (!createContractResponse.ok) {
            const errorData = await createContractResponse.json();
            throw new Error(errorData.message || "Không thể tạo hợp đồng");
          }

          const createContractResult = await createContractResponse.json();

          // Chuyển đến trang thanh toán
          navigate("/payment-confirmation", {
            state: {
              contractId: createContractResult.data.contractId,
              displayCode: createContractResult.data.displayCode,
              roomId: createContractResult.data.roomId,
              amount: contractData.payment.deposit,
              isNewContract: true,
            },
          });
        } else {
          // Ký hợp đồng hiện tại
          const contractResponse = await fetch(
            `${CONFIG.API_URL}/contracts/${contractData.id}/sign`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!contractResponse.ok) {
            const errorData = await contractResponse.json();
            throw new Error(errorData.message || "Không thể ký hợp đồng");
          }

          const contractResult = await contractResponse.json();

          // Chuyển đến trang thanh toán
          setSignStatus({ signing: false, success: true, error: null });
          navigate("/payment-confirmation", {
            state: {
              contractId: contractData.id,
              amount: contractData.payment.deposit,
            },
          });
        }
      } else {
        // Người dùng chưa đăng nhập - Mở modal để xử lý đăng ký/đăng nhập
        setShowSignModal(true);
        setSignStatus({ signing: false, success: false, error: null });
      }
    } catch (error) {
      console.error("Lỗi ký hợp đồng:", error);
      setSignStatus({
        signing: false,
        success: false,
        error: error.message || "Đã xảy ra lỗi khi ký hợp đồng",
      });
      showToast(
        `Lỗi: ${error.message || "Đã xảy ra lỗi khi ký hợp đồng"}`,
        "error"
      );
    }
  };

  {
    isLoggedIn && !isEditing && userProfile && (
      <div className={styles.autoFillNotice}>
        <Info size={16} />
        <p>Thông tin cá nhân được tự động lấy từ tài khoản của bạn</p>
        <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
          <Edit size={16} /> Chỉnh sửa
        </button>
      </div>
    );
  }

  const checkMissingInfo = () => {
    if (!isLoggedIn) return false;

    const info = editedInfo || {};
    return !info.name || !info.id || !info.phone || !info.email;
  };

  // Các hàm tiện ích
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("vi-VN");

  const renderEmptyState = () => (
    <div className={styles.emptyState}>
      <Search size={64} className={styles.emptyIcon} />
      <h2>Bạn chưa có hợp đồng thuê</h2>
      <p>Hãy tìm và đăng ký thuê phòng để tạo hợp đồng</p>
      <div className={styles.actions}>
        <button onClick={() => navigate("/")} className={styles.primaryButton}>
          <Home size={20} />
          Tìm phòng ngay
        </button>
      </div>
    </div>
  );

  const renderLoadingState = () => (
    <div className={styles.loadingState}>
      <div className={styles.spinner}></div>
      <p>Đang tải thông tin hợp đồng...</p>
    </div>
  );

  const renderErrorState = () => (
    <div className={styles.errorState}>
      <AlertCircle size={64} className={styles.errorIcon} />
      <h2>Đã có lỗi xảy ra</h2>
      <p>{error}</p>
      <div className={styles.actions}>
        <button
          onClick={() => window.location.reload()}
          className={styles.retryButton}
        >
          Thử lại
        </button>
      </div>
    </div>
  );

  const renderContractContent = () => (
    <>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerRoom}>
          <img
            src={
              contractData.room.image || "https://via.placeholder.com/400x300"
            }
            alt={contractData.room.name}
          />
          <div className={styles.roomInfo}>
            <h1>{contractData.room.name}</h1>
            <div className={styles.roomMeta}>
              <span>
                <Home size={16} className={styles.icon} />
                {contractData.room.type}
              </span>
              <span>
                <AlertCircle size={16} className={styles.icon} />
                {contractData.room.area}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.contractStatus}>
          <div className={styles.contractId}>
            <FileText size={20} />
            <span>Mã HĐ: {contractData.id}</span>
          </div>
          <div className={`${styles.status} ${styles[contractData.status]}`}>
            {contractData.status === "pending" ? (
              <>
                <Clock size={20} />
                <span>Chờ ký kết</span>
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                <span>Đã ký kết</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeSection === "overview" ? styles.active : ""
          }`}
          onClick={() => setActiveSection("overview")}
        >
          Tổng quan
        </button>
        <button
          className={`${styles.tab} ${
            activeSection === "terms" ? styles.active : ""
          }`}
          onClick={() => setActiveSection("terms")}
        >
          Điều khoản
        </button>
        <button
          className={`${styles.tab} ${
            activeSection === "payment" ? styles.active : ""
          }`}
          onClick={() => setActiveSection("payment")}
        >
          Thanh toán
        </button>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {activeSection === "overview" && (
          <div className={styles.overview}>
            {/* Contract Period */}
            <div className={styles.section}>
              <h2>
                <Calendar size={20} />
                Thời hạn hợp đồng
              </h2>
              <div className={styles.periodGrid}>
                <div className={styles.periodItem}>
                  <span className={styles.label}>Ngày bắt đầu</span>
                  <span className={styles.value}>
                    {formatDate(contractData.startDate)}
                  </span>
                </div>
                <div className={styles.periodItem}>
                  <span className={styles.label}>Ngày kết thúc</span>
                  <span className={styles.value}>
                    {formatDate(contractData.endDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Parties Information */}
            <div className={styles.partiesGrid}>
              {/* Tenant Info */}
              <div className={styles.partyCard}>
                <h2>
                  <User size={20} />
                  Bên thuê{" "}
                  {guestMode && (
                    <span className={styles.guestNote}>
                      (Thông tin của bạn)
                    </span>
                  )}
                </h2>
                <div className={styles.partyInfo}>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Họ tên:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedInfo.name}
                        onChange={(e) =>
                          setEditedInfo({ ...editedInfo, name: e.target.value })
                        }
                        className={styles.editInput}
                        placeholder="Nhập họ tên đầy đủ"
                      />
                    ) : (
                      <span className={styles.value}>
                        {contractData.tenant.name || "Chưa cập nhật"}
                      </span>
                    )}
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>CMND/CCCD:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedInfo.id}
                        onChange={(e) =>
                          setEditedInfo({ ...editedInfo, id: e.target.value })
                        }
                        className={styles.editInput}
                        placeholder="Nhập số CMND/CCCD"
                      />
                    ) : (
                      <span className={styles.value}>
                        {contractData.tenant.id_card || "Chưa cập nhật"}
                      </span>
                    )}
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Số điện thoại:</span>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedInfo.phone}
                        onChange={(e) =>
                          setEditedInfo({
                            ...editedInfo,
                            phone: e.target.value,
                          })
                        }
                        className={styles.editInput}
                        placeholder="Nhập số điện thoại"
                      />
                    ) : (
                      <span className={styles.value}>
                        {contractData.tenant.phone || "Chưa cập nhật"}
                      </span>
                    )}
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Email:</span>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedInfo.email}
                        onChange={(e) =>
                          setEditedInfo({
                            ...editedInfo,
                            email: e.target.value,
                          })
                        }
                        className={styles.editInput}
                        placeholder="Nhập địa chỉ email"
                      />
                    ) : (
                      <span className={styles.value}>
                        {contractData.tenant.email || "Chưa cập nhật"}
                      </span>
                    )}
                  </div>
                  {!isEditing && isLoggedIn && userProfile && (
                    <div className={styles.autoFillNotice}>
                      <Info size={16} />
                      <p>
                        Thông tin cá nhân được tự động lấy từ tài khoản của bạn
                      </p>
                      <button
                        className={styles.editBtn}
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit size={16} /> Chỉnh sửa
                      </button>
                    </div>
                  )}
                  {isEditing && (
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Địa chỉ thường trú:</span>
                      <input
                        type="text"
                        value={editedInfo.address}
                        onChange={(e) =>
                          setEditedInfo({
                            ...editedInfo,
                            address: e.target.value,
                          })
                        }
                        className={styles.editInput}
                        placeholder="Nhập địa chỉ thường trú"
                      />
                    </div>
                  )}
                  {isEditing && (
                    <div className={styles.editActions}>
                      <button
                        className={styles.saveBtn}
                        onClick={handleUpdateInfo}
                      >
                        Lưu thông tin
                      </button>
                      <button
                        className={styles.cancelBtn}
                        onClick={() => {
                          if (!guestMode) {
                            setEditedInfo({
                              name: contractData.tenant.name,
                              id: contractData.tenant.id_card,
                              phone: contractData.tenant.phone,
                              email: contractData.tenant.email,
                              address: "",
                            });
                            setIsEditing(false);
                          }
                        }}
                      >
                        Hủy
                      </button>
                    </div>
                  )}

                  {guestMode && !isEditing && (
                    <div className={styles.guestModeNote}>
                      <Info size={16} />
                      <p>
                        Thông tin này sẽ được sử dụng để tạo tài khoản cho bạn
                        khi ký hợp đồng
                      </p>
                      <button
                        className={styles.editBtn}
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit size={16} /> Chỉnh sửa
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Landlord Info */}
              <div className={styles.partyCard}>
                <h2>
                  <User size={20} />
                  Bên cho thuê
                </h2>
                <div className={styles.partyInfo}>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Họ tên:</span>
                    <span className={styles.value}>
                      {contractData.landlord.name}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>CMND/CCCD:</span>
                    <span className={styles.value}>
                      {contractData.landlord.id_card || "Thông tin bảo mật"}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Số điện thoại:</span>
                    <span className={styles.value}>
                      {contractData.landlord.phone}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Email:</span>
                    <span className={styles.value}>
                      {contractData.landlord.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "terms" && (
          <div className={styles.terms}>
            <div className={styles.termsHeader}>
              <h2>Điều khoản hợp đồng</h2>
              <p>Vui lòng đọc kỹ các điều khoản dưới đây trước khi ký kết</p>
            </div>

            <div className={styles.termsList}>
              {contractData.terms &&
                contractData.terms.map((term) => (
                  <div key={term.id} className={styles.termItem}>
                    <div
                      className={styles.termHeader}
                      onClick={() => toggleTerm(term.id)}
                    >
                      <h3>{term.title}</h3>
                      {expandedTerms.includes(term.id) ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </div>
                    {expandedTerms.includes(term.id) && (
                      <div className={styles.termContent}>{term.content}</div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeSection === "payment" && (
          <div className={styles.payment}>
            <div className={styles.paymentSummary}>
              <h2>Chi phí thuê</h2>
              <div className={styles.paymentDetails}>
                <div className={styles.paymentItem}>
                  <span className={styles.label}>Tiền thuê hàng tháng</span>
                  <span className={styles.value}>
                    {formatCurrency(contractData.payment.rent)}
                    <span className={styles.discountNote}>
                      (Tháng đầu giảm 10%:{" "}
                      {formatCurrency(contractData.payment.rent * 0.9)})
                    </span>
                  </span>
                </div>
                <div className={styles.paymentItem}>
                  <span className={styles.label}>Tiền đặt cọc</span>
                  <span className={styles.value}>
                    {formatCurrency(contractData.payment.deposit)}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.serviceCharges}>
              <h2>Phí dịch vụ</h2>
              <div className={styles.serviceList}>
                {serviceUsages.length > 0 ? (
                  serviceUsages.map((service) => (
                    <div key={service.id} className={styles.serviceItem}>
                      <span className={styles.serviceName}>
                        {service.name}
                        {service.previous_reading &&
                          service.current_reading && (
                            <span className={styles.usageDetails}>
                              ({service.previous_reading} -{" "}
                              {service.current_reading})
                            </span>
                          )}
                      </span>
                      <span className={styles.serviceAmount}>
                        {formatCurrency(service.total_amount)}
                        <span className={styles.priceUnit}>
                          /{service.price_unit}
                        </span>
                      </span>
                    </div>
                  ))
                ) : (
                  <div className={styles.noServiceData}>
                    <div className={styles.serviceItem}>
                      <span className={styles.serviceName}>Phí điện</span>
                      <span className={styles.serviceAmount}>
                        3,500 VNĐ/kWh
                      </span>
                    </div>
                    <div className={styles.serviceItem}>
                      <span className={styles.serviceName}>Phí nước</span>
                      <span className={styles.serviceAmount}>
                        25,000 VNĐ/m³
                      </span>
                    </div>
                    <div className={styles.serviceItem}>
                      <span className={styles.serviceName}>Internet</span>
                      <span className={styles.serviceAmount}>
                        200,000 VNĐ/tháng
                      </span>
                    </div>
                    <div className={styles.serviceItem}>
                      <span className={styles.serviceName}>Phí dịch vụ</span>
                      <span className={styles.serviceAmount}>
                        200,000 VNĐ/tháng
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.downloadBtn}>
          <Download size={20} />
          Tải hợp đồng PDF
        </button>
        {contractData.status === "pending" && (
          <>
            {!isEditing && (
              <button
                className={styles.editBtn}
                onClick={() => setIsEditing(true)}
              >
                <Edit size={20} />
                {guestMode
                  ? "Chỉnh sửa thông tin cá nhân"
                  : "Cập nhật thông tin cá nhân"}
              </button>
            )}
            <button
              className={styles.signBtn}
              onClick={() => setShowSignModal(true)}
              disabled={isEditing}
            >
              <FileSignature size={20} />
              Ký hợp đồng ngay
            </button>

            {showSignModal && (
              <SignContractModal
                contractInfo={contractData}
                onClose={() => setShowSignModal(false)}
                onConfirm={(data) => {
                  navigate("/payment-confirmation", {
                    state: {
                      contractId: data.contractId,
                      amount: data.amount,
                      isNewContract: data.isNewContract,
                    },
                  });
                  setShowSignModal(false);
                }}
                onSignContract={handleSignContract} // Đổi tên thành onSignContract
                signStatus={signStatus}
                guestMode={guestMode}
              />
            )}
          </>
        )}
      </div>

      {/* Notice */}
      <div className={styles.notice}>
        <Shield size={20} />
        <p>
          Hợp đồng này được bảo vệ bởi luật pháp Việt Nam và được xác thực điện
          tử. Mọi thông tin trong hợp đồng đều được mã hóa và lưu trữ an toàn.
        </p>
      </div>

      {/* Guest Mode Banner */}
      {guestMode && (
        <div className={styles.guestBanner}>
          <Info size={20} />
          <div>
            <h4>Lưu ý khi ký hợp đồng</h4>
            <p>
              Khi ký hợp đồng, hệ thống sẽ tự động tạo tài khoản cho bạn với
              thông tin đã cung cấp. Mật khẩu mặc định sẽ là số điện thoại của
              bạn.
            </p>
          </div>
          {!isLoggedIn && (
            <button
              className={styles.loginBtn}
              onClick={() =>
                navigate("/auth", {
                  state: {
                    returnUrl: `/RentalContract/${roomId}`,
                  },
                })
              }
            >
              Đã có tài khoản? Đăng nhập
            </button>
          )}
        </div>
      )}
    </>
  );

  return (
    <div className={styles.container}>
      {loading
        ? renderLoadingState()
        : error
        ? renderErrorState()
        : !contractData && !guestMode
        ? renderEmptyState()
        : renderContractContent()}
    </div>
  );
};

export default RentalContract;
