# DA2 – Backend Server

**DA2** là **backend server bằng Node.js + Express**, sử dụng MongoDB để phục vụ cho “Đồ án 2” (DA2). Dự án cung cấp REST API cơ bản, bao gồm xác thực người dùng (JWT), gửi email, và các endpoint phục vụ nghiệp vụ khác.

---

##  Tóm tắt

- **Công nghệ**: Node.js, Express.js, MongoDB (via Mongoose)
- **Xác thực**: JWT access & refresh tokens
- **Email**: gửi email qua SMTP (ví dụ Gmail)
- **Cấu hình**: dễ dàng qua file `.env`
- **Mục tiêu**: Nền tảng backend cơ sở vững chắc, có thể mở rộng cho ứng dụng phim, e-commerce, hệ thống loyalty, v.v.

---

##  Tính năng

- **REST API skeleton**: khởi tạo dễ dàng cho các endpoint hàm CRUD, xác thực, và bảo vệ route.
- **Xác thực người dùng**: đăng ký, đăng nhập, refresh token, bảo vệ route bằng middleware.
- **Email Verification**: cho phép gửi email (ví dụ: xác thực tài khoản, cấp lại mật khẩu).
- **Quản lý cấu hình bảo mật**: tách rõ JWT secret, refresh secret, email credentials, v.v.

---

##  Cài đặt & chạy

1. Clone repo:
   ```bash
   git clone https://github.com/MinTuanit/DA2.git
   cd DA2

# run 
    npm install
    npm start
    
---

## Liên hệ / Góp ý

Nếu bạn có ý tưởng cải tiến, báo lỗi hoặc muốn tích hợp thêm tính năng (như voice search, scheduling, loyalty…), cứ mở Issues
 hoặc gửi pull request nhé!
