import pymysql

# Danh sách các mật khẩu phổ biến nhất
passwords_to_try = [
    "",             # Mật khẩu rỗng (XAMPP/WAMP mặc định)
    "123456",       # Phổ biến nhất
    "12345678",     # Phổ biến nhì
    "1234",         # Ngắn gọn
    "root",         # Trùng tên user
    "admin",        # Quản trị
    "password",     # Mặc định tiếng Anh
    "mysql"         # Tên phần mềm
]

print("--- BẮT ĐẦU DÒ MẬT KHẨU MYSQL ---")

found = False
for pwd in passwords_to_try:
    try:
        print(f"Dang thu mat khau: '{pwd}' ... ", end="")
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password=pwd,
            port=3306
        )
        print("THANH CONG! ✅")
        print(f"\n>>> MAT KHAU DUNG LA: '{pwd}'")
        if pwd == "":
            print("(Nghĩa là bạn để trống, không điền gì cả)")
        
        found = True
        connection.close()
        break
    except pymysql.err.OperationalError:
        print("Sai ❌")
    except Exception as e:
        print(f"Lỗi khác: {e}")

if not found:
    print("\n--- KHÔNG TÌM THẤY ---")
    print("Có thể bạn đã đặt một mật khẩu rất lạ, hoặc MySQL chưa bật.")