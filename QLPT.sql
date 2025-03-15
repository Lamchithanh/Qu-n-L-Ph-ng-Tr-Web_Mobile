CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    full_name VARCHAR(100),
cccd VARCHAR(20) UNIQUE AFTER full_name,
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
    room_type ENUM('boarding_house', 'mini_apartment', 'dormitory', 'other') DEFAULT 'boarding_house',
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
nearby_locations JSON DEFAULT NULL AFTER facilities,
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
display_code VARCHAR(20) AFTER id,
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

--

CREATE TABLE password_resets (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL,
    user_id BIGINT NOT NULL,
    reset_code VARCHAR(10) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used BOOLEAN DEFAULT false,
    INDEX idx_email (email),
    INDEX idx_reset_code (reset_code),
    INDEX idx_expires_at (expires_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE maintenance_requests (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tenant_id BIGINT NOT NULL,
    room_id BIGINT,
    description TEXT NOT NULL,
    status ENUM('pending', 'in_progress', 'completed', 'rejected') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    image_urls JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL
);

-- Các chỉ mục để tối ưu truy vấn
CREATE INDEX idx_maintenance_tenant ON maintenance_requests(tenant_id);
CREATE INDEX idx_maintenance_room ON maintenance_requests(room_id);
CREATE INDEX idx_maintenance_status ON maintenance_requests(status);
CREATE INDEX idx_maintenance_created_at ON maintenance_requests(created_at);

CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    type ENUM('contract', 'payment', 'maintenance', 'room', 'general') DEFAULT 'general',
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    related_id BIGINT,  -- ID của đối tượng liên quan (hợp đồng, hóa đơn, yêu cầu bảo trì...)
    severity ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'low',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Các chỉ mục để tối ưu truy vấn
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_status ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);