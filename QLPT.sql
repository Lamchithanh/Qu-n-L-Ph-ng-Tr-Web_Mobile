CREATE DATABASE Quan_Ly_Phong_Tro;
USE Quan_Ly_Phong_Tro;
-- Users table
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    full_name VARCHAR(100),
    avatar VARCHAR(255),
    role ENUM('admin', 'staff', 'tenant', 'landlord_pending', 'landlord') DEFAULT 'tenant',
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);

-- Landlords table
CREATE TABLE landlords (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    id_card_number VARCHAR(20) UNIQUE,
    address TEXT,
    business_license VARCHAR(255),
    property_documents JSON,
    description TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_landlords_user ON landlords(user_id);
CREATE INDEX idx_landlords_status ON landlords(status);

-- Rooms table
CREATE TABLE rooms (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    landlord_id INT NULL,
    room_number VARCHAR(20) UNIQUE NOT NULL,
    floor INT,
    area DECIMAL(10,2),
    -- Thay đổi từ DECIMAL(10,2) thành DECIMAL(15,0) để lưu trữ số nguyên
    price DECIMAL(15,0) NOT NULL CHECK (price >= 0),
    discounted_price DECIMAL(15,2) NULL,
    status ENUM('available', 'occupied', 'maintenance') DEFAULT 'available',
    description TEXT,
    facilities JSON DEFAULT NULL,
    images JSON DEFAULT NULL,
    rating DECIMAL(2,1) DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
    review_count INT DEFAULT 0 CHECK (review_count >= 0),
    current_views INT DEFAULT 0 CHECK (current_views >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    INDEX idx_room_status (status),
    INDEX idx_room_price (price),
    INDEX idx_room_floor (floor),
    INDEX idx_deleted_at (deleted_at)
);


CREATE TABLE user_favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  room_id BIGINT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME DEFAULT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- Thêm CHECK CONSTRAINT nếu chưa có
ALTER TABLE rooms MODIFY COLUMN rating DECIMAL(2,1) DEFAULT 0 CHECK (rating BETWEEN 0 AND 5);
ALTER TABLE rooms MODIFY COLUMN review_count INT DEFAULT 0 CHECK (review_count >= 0);
ALTER TABLE rooms MODIFY COLUMN current_views INT DEFAULT 0 CHECK (current_views >= 0);

-- Thêm DEFAULT NULL cho JSON columns nếu chưa có
ALTER TABLE rooms MODIFY COLUMN facilities JSON DEFAULT NULL;
ALTER TABLE rooms MODIFY COLUMN images JSON DEFAULT NULL;

-- Thêm chỉ mục nếu chưa có
CREATE INDEX idx_room_status ON rooms(status);
CREATE INDEX idx_room_price ON rooms(price);
CREATE INDEX idx_room_floor ON rooms(floor);
CREATE INDEX idx_deleted_at ON rooms(deleted_at);

CREATE TABLE reviews (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  room_id BIGINT NOT NULL,
  rating DECIMAL(3,1) NOT NULL,
  review TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME DEFAULT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);

CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_rooms_price ON rooms(price);
CREATE INDEX idx_rooms_floor ON rooms(floor);

-- Tenants table
CREATE TABLE tenants (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    full_name VARCHAR(100),
    id_card_number VARCHAR(20) UNIQUE,
    permanent_address TEXT,
    phone VARCHAR(20),
    emergency_contact VARCHAR(100),
    avatar VARCHAR(255),
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_tenants_phone ON tenants(phone);
CREATE INDEX idx_tenants_id_card ON tenants(id_card_number);
CREATE INDEX idx_tenants_status ON tenants(status);

-- Contracts table
CREATE TABLE contracts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    room_id BIGINT,
    tenant_id BIGINT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    deposit_amount DECIMAL(10,2),
    monthly_rent DECIMAL(10,2),
    payment_date INT,
    terms_conditions TEXT,
    rating DECIMAL(2,1) DEFAULT NULL,
    review TEXT DEFAULT NULL,
    status ENUM('active', 'terminated', 'expired') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX idx_contracts_dates ON contracts(start_date, end_date);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_tenant_room ON contracts(tenant_id, room_id);

-- Amenities table
CREATE TABLE amenities (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50)
);

CREATE TABLE room_amenity_relations (
    room_id BIGINT,
    amenity_id BIGINT,
    PRIMARY KEY (room_id, amenity_id),
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
);

-- Services table
CREATE TABLE services (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    price_unit VARCHAR(20),
    price DECIMAL(10,2),
    description TEXT,
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Service Usage table
CREATE TABLE service_usage (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    contract_id BIGINT,
    service_id BIGINT,
    previous_reading DECIMAL(10,2),
    current_reading DECIMAL(10,2),
    usage_amount DECIMAL(10,2),
    month INT,
    year INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

CREATE INDEX idx_service_usage_date ON service_usage(year, month);
CREATE INDEX idx_service_usage_contract ON service_usage(contract_id);

-- Invoices table
CREATE TABLE invoices (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    contract_id BIGINT,
    month INT,
    year INT,
    room_fee DECIMAL(10,2),
    services_fee JSON,
    total_amount DECIMAL(10,2),
    due_date DATE,
    status ENUM('pending', 'paid', 'overdue') DEFAULT 'pending',
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE
);

CREATE INDEX idx_invoices_contract ON invoices(contract_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_date ON invoices(year, month);
CREATE INDEX idx_invoices_due ON invoices(due_date);

-- Payments table
CREATE TABLE payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    invoice_id BIGINT,
    amount DECIMAL(10,2),
    payment_method VARCHAR(50),
    payment_date TIMESTAMP,
    transaction_id VARCHAR(100),
    status BOOLEAN DEFAULT true,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_payments_date ON payments(payment_date);
CREATE INDEX idx_payments_status ON payments(status);

-- Insert Users
INSERT INTO users (username, password_hash, email, phone, full_name, role) VALUES
('admin1', SHA2('admin123', 256), 'admin@example.com', '0901234567', 'Nguyen Van Admin', 'admin'),
('staff1', SHA2('staff123', 256), 'staff1@example.com', '0901234568', 'Tran Thi Staff', 'staff'),
('tenant1', SHA2('tenant123', 256), 'tenant1@example.com', '0901234569', 'Le Van A', 'tenant'),
('tenant2', SHA2('tenant123', 256), 'tenant2@example.com', '0901234570', 'Pham Thi B', 'tenant'),
('tenant3', SHA2('tenant123', 256), 'tenant3@example.com', '0901234571', 'Hoang Van C', 'tenant'),
('tenant4', SHA2('tenant123', 256), 'tenant4@example.com', '0901234572', 'Nguyen Thi D', 'tenant'),
('tenant5', SHA2('tenant123', 256), 'tenant5@example.com', '0901234573', 'Tran Van E', 'tenant'),
('tenant6', SHA2('tenant123', 256), 'tenant6@example.com', '0901234574', 'Le Thi F', 'tenant'),
('tenant7', SHA2('tenant123', 256), 'tenant7@example.com', '0901234575', 'Pham Van G', 'tenant'),
('tenant8', SHA2('tenant123', 256), 'tenant8@example.com', '0901234576', 'Hoang Thi H', 'tenant');

-- Insert Rooms
INSERT INTO rooms (room_number, floor, area, price, status, description, facilities) VALUES
('101', 1, 25.5, 3000000, 'available', 'Phòng tiêu chuẩn tầng 1', '{"air_con": true, "water_heater": true, "fridge": false}'),
('102', 1, 30.0, 3500000, 'occupied', 'Phòng rộng tầng 1', '{"air_con": true, "water_heater": true, "fridge": true}'),
('201', 2, 25.5, 3200000, 'available', 'Phòng tiêu chuẩn tầng 2', '{"air_con": true, "water_heater": true, "fridge": false}'),
('202', 2, 30.0, 3700000, 'occupied', 'Phòng rộng tầng 2', '{"air_con": true, "water_heater": true, "fridge": true}'),
('301', 3, 25.5, 3400000, 'maintenance', 'Phòng tiêu chuẩn tầng 3', '{"air_con": true, "water_heater": true, "fridge": false}'),
('302', 3, 30.0, 3900000, 'available', 'Phòng rộng tầng 3', '{"air_con": true, "water_heater": true, "fridge": true}'),
('401', 4, 25.5, 3600000, 'occupied', 'Phòng tiêu chuẩn tầng 4', '{"air_con": true, "water_heater": true, "fridge": false}'),
('402', 4, 30.0, 4100000, 'available', 'Phòng rộng tầng 4', '{"air_con": true, "water_heater": true, "fridge": true}'),
('501', 5, 25.5, 3800000, 'occupied', 'Phòng tiêu chuẩn tầng 5', '{"air_con": true, "water_heater": true, "fridge": false}'),
('502', 5, 30.0, 4300000, 'available', 'Phòng rộng tầng 5', '{"air_con": true, "water_heater": true, "fridge": true}');

-- Insert Tenants
INSERT INTO tenants (user_id, full_name, id_card_number, permanent_address, phone, emergency_contact) VALUES
(3, 'Le Van A', '001301000001', '123 Nguyen Hue, Q1, TP.HCM', '0901234569', 'Le Van B - 0909123456'),
(4, 'Pham Thi B', '001301000002', '456 Le Loi, Q1, TP.HCM', '0901234570', 'Pham Van C - 0909123457'),
(5, 'Hoang Van C', '001301000003', '789 Ham Nghi, Q1, TP.HCM', '0901234571', 'Hoang Thi D - 0909123458'),
(6, 'Nguyen Thi D', '001301000004', '321 Dong Khoi, Q1, TP.HCM', '0901234572', 'Nguyen Van E - 0909123459'),
(7, 'Tran Van E', '001301000005', '654 Le Thanh Ton, Q1, TP.HCM', '0901234573', 'Tran Thi F - 0909123460'),
(8, 'Le Thi F', '001301000006', '987 Nguyen Du, Q1, TP.HCM', '0901234574', 'Le Van G - 0909123461'),
(9, 'Pham Van G', '001301000007', '147 Ly Tu Trong, Q1, TP.HCM', '0901234575', 'Pham Thi H - 0909123462'),
(10, 'Hoang Thi H', '001301000008', '258 Pasteur, Q1, TP.HCM', '0901234576', 'Hoang Van I - 0909123463'),
(NULL, 'Nguyen Van I', '001301000009', '369 Nam Ky Khoi Nghia, Q3, TP.HCM', '0901234577', 'Nguyen Thi K - 0909123464'),
(NULL, 'Tran Thi K', '001301000010', '147 Nguyen Dinh Chieu, Q3, TP.HCM', '0901234578', 'Tran Van L - 0909123465');

-- Insert Contracts
INSERT INTO contracts (room_id, tenant_id, start_date, end_date, deposit_amount, monthly_rent, payment_date, status) VALUES
(2, 1, '2024-01-01', '2024-12-31', 7000000, 3500000, 5, 'active'),
(4, 2, '2024-01-01', '2024-12-31', 7400000, 3700000, 5, 'active'),
(7, 3, '2024-01-01', '2024-12-31', 7200000, 3600000, 5, 'active'),
(9, 4, '2024-01-01', '2024-12-31', 7600000, 3800000, 5, 'active'),
(1, 5, '2023-01-01', '2023-12-31', 6000000, 3000000, 5, 'expired'),
(3, 6, '2023-01-01', '2023-12-31', 6400000, 3200000, 5, 'expired'),
(5, 7, '2023-06-01', '2023-12-31', 6800000, 3400000, 5, 'terminated'),
(6, 8, '2023-06-01', '2023-12-31', 7800000, 3900000, 5, 'terminated'),
(8, 9, '2024-02-01', '2025-01-31', 8200000, 4100000, 5, 'active'),
(10, 10, '2024-02-01', '2025-01-31', 8600000, 4300000, 5, 'active');

-- Insert Services
INSERT INTO services (name, price_unit, price, description) VALUES
('Điện', 'kWh', 3500, 'Giá điện sinh hoạt'),
('Nước', 'm3', 15000, 'Giá nước sinh hoạt'),
('Internet', 'tháng', 200000, 'Internet tốc độ cao'),
('Dọn vệ sinh', 'lần', 100000, 'Dọn vệ sinh hàng tuần'),
('Giặt ủi', 'kg', 30000, 'Giặt ủi theo cân'),
('Giữ xe', 'tháng', 100000, 'Phí giữ xe máy'),
('Thu gom rác', 'tháng', 50000, 'Thu gom rác hàng ngày'),
('Bảo vệ', 'tháng', 100000, 'Dịch vụ bảo vệ 24/7'),
('Sửa chữa', 'lần', 200000, 'Sửa chữa cơ bản'),
('Phí quản lý', 'tháng', 100000, 'Phí quản lý chung cư');

-- Insert Service Usage
INSERT INTO service_usage (contract_id, service_id, previous_reading, current_reading, usage_amount, month, year) VALUES
(1, 1, 0, 100, 100, 1, 2024),
(1, 2, 0, 5, 5, 1, 2024),
(2, 1, 0, 120, 120, 1, 2024),
(2, 2, 0, 6, 6, 1, 2024),
(3, 1, 0, 90, 90, 1, 2024),
(3, 2, 0, 4, 4, 1, 2024),
(4, 1, 0, 150, 150, 1, 2024),
(4, 2, 0, 7, 7, 1, 2024),
(5, 1, 0, 110, 110, 1, 2024),
(5, 2, 0, 5, 5, 1, 2024);

-- Insert Invoices
INSERT INTO invoices (contract_id, month, year, room_fee, services_fee, total_amount, due_date, status) VALUES
(1, 1, 2024, 3500000, '{"electricity": 350000, "water": 75000, "internet": 200000}', 4125000, '2024-01-05', 'paid'),
(2, 1, 2024, 3700000, '{"electricity": 420000, "water": 90000, "internet": 200000}', 4410000, '2024-01-05', 'paid'),
(3, 1, 2024, 3600000, '{"electricity": 315000, "water": 60000, "internet": 200000}', 4175000, '2024-01-05', 'pending'),
(4, 1, 2024, 3800000, '{"electricity": 525000, "water": 105000, "internet": 200000}', 4630000, '2024-01-05', 'pending'),
(5, 1, 2024, 3000000, '{"electricity": 385000, "water": 75000, "internet": 200000}', 3660000, '2024-01-05', 'overdue'),
(6, 1, 2024, 3200000, '{"electricity": 350000, "water": 75000, "internet": 200000}', 3825000, '2024-01-05', 'paid'),
(7, 1, 2024, 3400000, '{"electricity": 350000, "water": 75000, "internet": 200000}', 4025000, '2024-01-05', 'paid'),
(8, 1, 2024, 3900000, '{"electricity": 350000, "water": 75000, "internet": 200000}', 4525000, '2024-01-05', 'pending'),
(9, 2, 2024, 4100000, '{"electricity": 350000, "water": 75000, "internet": 200000}', 4725000, '2024-02-05', 'pending'),
(10, 2, 2024, 4300000, '{"electricity": 350000, "water": 75000, "internet": 200000}', 4925000, '2024-02-05', 'pending');

-- Insert Payments
INSERT INTO payments (invoice_id, amount, payment_method, payment_date, transaction_id, status, note) VALUES
(1, 4125000, 'bank_transfer', '2024-01-03 10:00:00', 'TXN123456789', true, 'Thanh toán đúng hạn'),
(2, 4410000, 'cash', '2024-01-04 11:00:00', 'CASH123456789', true, 'Thanh toán đúng hạn'),
(3, 4175000, 'bank_transfer', '2024-01-05 14:00:00', 'TXN123456790', true, 'Thanh toán đúng hạn'),
(4, 4630000, 'cash', '2024-01-05 15:00:00', 'CASH123456790', true, 'Thanh toán đúng hạn'),
(5, 3660000, 'bank_transfer', '2024-01-06 16:00:00', 'TXN123456791', true, 'Thanh toán trễ hạn'),
(6, 3825000, 'momo', '2024-01-04 09:00:00', 'MOMO123456789', true, 'Thanh toán qua Momo'),
(7, 4025000, 'zalopay', '2024-01-03 10:30:00', 'ZALO123456789', true, 'Thanh toán qua ZaloPay'),
(8, 4525000, 'bank_transfer', '2024-01-05 11:30:00', 'TXN123456792', true, 'Thanh toán đúng hạn'),
(9, 4725000, 'cash', '2024-02-03 13:30:00', 'CASH123456791', true, 'Thanh toán đúng hạn'),
(10, 4925000, 'momo', '2024-02-04 14:30:00', 'MOMO123456790', true, 'Thanh toán đúng hạn');

INSERT INTO landlords (user_id, id_card_number, address, business_license, property_documents, description, status) VALUES
(1, '012345678901', '123 Đường ABC, TP.HCM', 'BL-20240201', '{"ownership_cert": "cert_001.pdf"}', 'Chủ trọ lâu năm', 'approved');

INSERT INTO contracts (room_id, tenant_id, start_date, end_date, deposit_amount, monthly_rent, payment_date, terms_conditions, status) VALUES
(2, 1, '2024-01-01', '2024-12-31', 6000000, 3000000, 5, 'Hợp đồng có giá trị 1 năm', 'active'),
(4, 2, '2024-02-01', '2024-12-31', 7000000, 3500000, 5, 'Hợp đồng có giá trị 1 năm', 'active'),
(7, 3, '2024-03-01', '2024-12-31', 7200000, 3600000, 5, 'Hợp đồng có giá trị 1 năm', 'active');

INSERT INTO services (name, price_unit, price, description, status) VALUES
('Điện', 'kWh', 3500, 'Giá điện theo đồng hồ', true),
('Nước', 'm³', 15000, 'Giá nước theo đồng hồ', true),
('Internet', 'tháng', 100000, 'Phí internet hàng tháng', true),
('Gửi xe', 'tháng', 100000, 'Phí gửi xe máy', true);

INSERT INTO service_usage (contract_id, service_id, previous_reading, current_reading, usage_amount, month, year) VALUES
(1, 1, 50, 70, 20, 2, 2024), -- 20 kWh điện
(1, 2, 15, 18, 3, 2, 2024), -- 3 m³ nước
(1, 3, 0, 1, 1, 2, 2024), -- Internet tháng 2
(2, 1, 40, 60, 20, 2, 2024), -- 20 kWh điện
(2, 2, 10, 13, 3, 2, 2024), -- 3 m³ nước
(3, 4, 0, 1, 1, 2, 2024); -- Gửi xe tháng 2

INSERT INTO invoices (contract_id, month, year, room_fee, services_fee, total_amount, due_date, status) VALUES
(1, 2, 2024, 3000000, '{"electricity": 70000, "water": 45000, "internet": 100000}', 3215000, '2024-02-10', 'pending'),
(2, 2, 2024, 3500000, '{"electricity": 70000, "water": 45000, "internet": 100000}', 3715000, '2024-02-10', 'pending'),
(3, 2, 2024, 3600000, '{"parking": 100000}', 3700000, '2024-02-10', 'paid');

INSERT INTO payments (invoice_id, amount, payment_method, payment_date, transaction_id, status, note) VALUES
(3, 3700000, 'Bank Transfer', '2024-02-05 10:30:00', 'TXN_202402051030', true, 'Thanh toán đầy đủ hóa đơn tháng 2');

UPDATE rooms 
SET facilities = JSON_OBJECT(
  'fridge', true,
  'air_con', true,
  'water_heater', true,
  'nearby_facilities', JSON_OBJECT(
    'shopping_mall', JSON_OBJECT('distance', 'Đang cập nhật', 'description', 'đến trung tâm thương mại'),
    'bus_station', JSON_OBJECT('distance', 'Đang cập nhật', 'description', 'đến trạm xe buýt'),
    'office_area', JSON_OBJECT('distance', 'Đang cập nhật', 'description', 'đến khu văn phòng')
  )
)
WHERE id = 2;

SELECT 
    r.*,
    GROUP_CONCAT(DISTINCT a.id) as amenity_ids,
    GROUP_CONCAT(DISTINCT a.name) as amenity_names,
    GROUP_CONCAT(DISTINCT a.icon) as amenity_icons,
    (
      SELECT COUNT(*)
      FROM contracts c
      WHERE c.room_id = r.id
      AND c.status = 'active'
    ) as active_contracts,
    JSON_OBJECT(
      'fridge', COALESCE(JSON_EXTRACT(r.facilities, '$.fridge'), false),
      'air_con', COALESCE(JSON_EXTRACT(r.facilities, '$.air_con'), false),
      'water_heater', COALESCE(JSON_EXTRACT(r.facilities, '$.water_heater'), false)
    ) as formatted_facilities
FROM rooms r
LEFT JOIN room_amenity_relations rar ON r.id = rar.room_id
LEFT JOIN amenities a ON rar.amenity_id = a.id
WHERE r.id = 2 AND r.deleted_at IS NULL
GROUP BY r.id;
