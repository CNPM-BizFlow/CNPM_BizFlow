# BizFlow - Nền Tảng Chuyển Đổi Số Cho Hộ Kinh Doanh Cá Thể

**BizFlow** là giải pháp quản lý bán hàng "All-in-One" dành riêng cho các hộ kinh doanh cá thể, cửa hàng vật liệu xây dựng, và tạp hóa. 

Khác với các phần mềm kế toán phức tạp, **BizFlow** tập trung vào trải nghiệm **"POS Đơn Giản"** và tính năng **"Ra Lệnh Bằng Giọng Nói/Văn Bản"** (AI) giúp chủ cửa hàng không rành công nghệ vẫn có thể tạo đơn và quản lý công nợ dễ dàng.

##  Tính Năng Nổi Bật (Signature Features)

### 1.  AI Assistant (Trợ Lý Ảo)
- **Tạo đơn hàng bằng lời nói**: "Lấy 5 bao xi măng Hà Tiên cho chú Ba, ghi nợ".
- **Xử lý ngôn ngữ tự nhiên**: Tự động nhận diện khách hàng, sản phẩm và tạo Draft Order.
- **Real-time Feedback**: Phản hồi tức thì ngay khi nhập lệnh.

### 2.  POS Bán Hàng Tinh Gọn
- Giao diện Clean/Minimal, tối ưu cho thao tác chạm trên màn hình cảm ứng.
- Tạo đơn, in hóa đơn, và trừ kho chỉ trong 3 bước.
- Hoạt động mượt mà trên cả PC, Tablet và Mobile.

### 3.  Sổ Công Nợ Thông Minh
- Theo dõi chi tiết "Ai nợ mình" và "Mình nợ ai".
- Tự động nhắc nợ khi đến hạn.
- Lịch sử giao dịch minh bạch, dễ dàng đối soát với khách hàng.

### 4.  Báo Cáo 
- Biểu đồ doanh thu ngày/tháng đơn giản, dễ hiểu.
- Báo cáo lãi lỗ tạm tính (không cần kiến thức kế toán chuyên sâu).
- Tự động sinh bút toán tuân thủ Thông tư 88/2021/TT-BTC (khi cần xuất báo cáo thuế).

---

##  Công Nghệ Sử Dụng (Tech Stack)

### Frontend (Giao Diện)
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v3 (Custom Design System)
- **Icons**: Phosphor Icons (Duotone)
- **AI UX**: Real-time feedback components

### Backend (Xử Lý)
- **Core**: Python (Flask)
- **Architecture**: Clean Architecture (Domain Driven Design)
- **Database**: MySQL 8.0
- **Auth**: JWT (Flask-JWT-Extended)

---

# Hướng Dẫn Phát Triển (Development Guide)

Tài liệu này hướng dẫn chi tiết cách thiết lập môi trường phát triển cho **BizFlow** (Fullstack).

## 1. Yêu Cầu Hệ Thống (Prerequisites)
- **OS**: Windows, macOS, hoặc Linux.
- **Python**: 3.10 trở lên.
- **Node.js**: 18.17 trở lên (Khuyên dùng LTS).
- **Database**: MySQL 8.0 (hoặc Docker container).
- **Git**: Phiên bản mới nhất.

---

## 2. Thiết Lập Backend (Flask API)

### Bước 2.1: Cấu hình Database
Tạo database mới trong MySQL:
```sql
CREATE DATABASE bizflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Bước 2.2: Cài đặt và Chạy

1. **Tạo/Kích hoạt môi trường ảo:**
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # Mac/Linux:
   source .venv/bin/activate
   ```

2. **Cài đặt thư viện:**
   ```bash
   pip install -r src/requirements.txt
   ```

3. **Cấu hình biến môi trường:**
   Đảm bảo file `src/.env` có thông tin kết nối đúng:
   ```ini
   MYSQL_USER=root
   MYSQL_PASSWORD=your_password
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_DATABASE=bizflow
   ```

4. **Tạo dữ liệu mẫu (Seeding):**
   ```bash
   python src/seed.py
   ```
   *Lệnh này sẽ tạo các tài khoản admin/owner mặc định.*

5. **Khởi chạy Server:**
   ```bash
   python src/app.py
   ```
   Server sẽ chạy tại: `http://localhost:9999`

---

## 3. Thiết Lập Frontend (Next.js)

### Bước 3.1: Cài đặt Dependencies
Mở terminal **mới**, đi vào thư mục frontend:
```bash
cd frontend
npm install
```

### Bước 3.2: Chạy Server phát triển
```bash
npm run dev
```
Truy cập ứng dụng tại: `http://localhost:3000`

---

## 4. Tài Khoản Test (Mặc Định)

| Vai Trò | Email | Mật Khẩu |
| :--- | :--- | :--- |
| **Admin** | `admin@bizflow.vn` | `admin123` |
| **Chủ Hộ (Owner)** | `owner@bizflow.vn` | `owner123` |
| **Nhân Viên** | `nhanvien@bizflow.vn` | `nhanvien123` |

## 5. Quy Trình Phát Triển (Workflow)
1. **Sửa Frontend**: Next.js hỗ trợ Hot Reload, chỉ cần lưu file là thấy thay đổi.
2. **Sửa Backend**: Flask server cũng tự động reload khi code thay đổi (nếu bật debug mode).
3. **Linting**:
   - Frontend: `npm run lint`
   - Backend: (Cài đặt `flake8` hoặc `black` nếu cần).

---




##  Cấu Trúc Dự Án (Clean Architecture)

```
src/
├── api/                # Controllers & Routes
├── domain/             # Business Rules & Entities
├── services/           # Application Logic
├── infrastructure/     # Database Models & External Services
├── app.py              # Main Application Entry
├── config.py           # App Configuration
├── seed.py             # Sample Data Script
└── requirements.txt    # Python Dependencies
```
