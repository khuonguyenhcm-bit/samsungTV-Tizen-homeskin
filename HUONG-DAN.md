# Hướng dẫn cài đặt — Samsung Tizen Home Skin

> **Lưu ý trước khi bắt đầu:** bản này được dựng sẵn theo tài liệu Tizen, **chưa từng chạy trên tivi Samsung thật** (tác giả chưa có máy). Các bước dưới đây là quy trình chuẩn của Samsung cho app Tizen tự ký; nếu gặp lỗi ở bước nào, ghi lại thông báo lỗi — đó là thông tin quý nhất để hoàn thiện bản này.

> ⚠️ **Tự chịu trách nhiệm:** đây là phần mềm cộng đồng cài ngoài kho chính thức. Đặc biệt, **nâng cấp firmware tivi** có thể gỡ app tự cài / tắt Developer Mode / làm app ngừng chạy — cân nhắc kỹ trước khi nâng cấp, và nếu app mất sau khi nâng cấp thì cài lại từ đầu theo hướng dẫn này.

Khác với bản LG (cài 1 lệnh là xong), bản Samsung **rườm rà hơn vì chính sách của Samsung**: mỗi app phải được **ký bằng chứng chỉ chứa mã DUID của chính chiếc tivi** đó. Làm 1 lần đầu thì lâu (~30–45 phút), các lần cập nhật sau nhanh hơn nhiều.

## 1. Cài Tizen Studio trên máy tính

1. Tải **Tizen Studio** từ trang developer.samsung.com (bản cho Mac/Windows đều có) và cài.
2. Mở **Package Manager** trong Tizen Studio, cài thêm:
   - **TV Extensions** (bản mới nhất) + **TV Extension Tools** (mục Extension SDK)
   - **Samsung Certificate Extension**
   - **Certificate Manager** (mục Main SDK / Baseline)

## 2. Bật Developer Mode trên tivi

1. Bấm nút Home → vào **Apps**.
2. Bấm nhanh dãy số **1 2 3 4 5** trên remote — hộp thoại Developer Mode hiện ra.
3. Bật **Developer mode**, nhập **địa chỉ IP của máy tính** đang chạy Tizen Studio.
4. Khởi động lại tivi. Trên màn hình Apps sẽ có dòng chữ đỏ "Developer Mode".

*Mỗi tivi chỉ gắn với 1 máy tính tại một thời điểm — đổi máy tính phải làm lại bước này.*

## 3. Kết nối máy tính với tivi

1. Trong Tizen Studio mở **Device Manager** → **Remote Device Manager** → Scan — tivi xuất hiện trong danh sách (cùng mạng Wi-Fi).
2. Bật công tắc **Connection** của tivi đó sang On. Kết nối thành công là điều kiện để bước sau tự lấy được DUID.

## 4. Tạo chứng chỉ (bước bắt buộc của Samsung)

1. Mở **Tools → Certificate Manager** → bấm **+** tạo profile mới → chọn **Samsung** → **TV**.
2. Tạo **author certificate**: đặt tên + mật khẩu, đăng nhập **tài khoản Samsung** khi được hỏi (miễn phí).
3. Tạo **distributor certificate**: chọn mức **Partner**, ở phần DUID chọn thiết bị tivi vừa kết nối (DUID tự điền) — hoặc tự tra DUID trong **Cài đặt → Hỗ trợ → Giới thiệu về TV này** trên tivi (một số model mới không hiện mục này, khi đó lấy qua Device Manager: chuột phải vào thiết bị → **DUID**).
4. Đặt profile này làm **active**.

*Thiếu bước này app sẽ báo lỗi cài đặt chung chung (error 1181 / -12 tuỳ bản) — đó là lỗi kinh điển của Tizen khi chứng chỉ không khớp DUID.*

## 5. Build + cài lên tivi

Mở Terminal tại thư mục repo này:

```bash
cd Samsungtv-Tizen-homeskin
tizen build-web
tizen package -t wgt -s <tên profile chứng chỉ của bạn>
tizen install -n <file .wgt vừa tạo> -t <tên tivi trong Device Manager>
```

Mở app trên tivi: app **Tizen Home Skin** xuất hiện trong danh sách Apps. Lần mở đầu, app tự liệt kê các app đã cài trên tivi và xếp theo cấu hình.

## 6. Dùng hàng ngày

- **Trái/phải**: di chuyển giữa các ô; **OK**: mở app; tên app chỉ hiện dưới ô đang chọn.
- **Back**: thoát launcher.
- **Nút Home luôn về Smart Hub của Samsung** — đây là giới hạn của Tizen, app không can thiệp được. Mẹo dùng gần tương đương: vào **Cài đặt → Tổng quan → Tính năng thông minh**, tắt "Tự động chạy Smart Hub" và bật **"Tự động chạy ứng dụng dùng gần nhất"** — bật tivi lên sẽ quay lại launcher nếu lần trước bạn đang ở trong launcher.

## 7. Tuỳ biến (trong `js/config.js`)

> **Lưu ý:** bản LG (bản gốc) đã có thêm màn hình Settings chỉnh ngay trên tivi + trang chỉnh bằng điện thoại (cập nhật 26/10). Bản Samsung này chưa có — các tuỳ biến vẫn sửa trong `js/config.js` như bên dưới.

- **Thứ tự đầu hàng:** `orderNames` — khớp theo tên app (không phân biệt hoa thường, khớp một phần). Mặc định: YouTube, Apple Music, Netflix, Apple TV; phần còn lại xếp theo bảng chữ cái.
- **Ẩn app:** `hiddenNames` — thêm tên (một phần cũng được). Launcher tự ẩn chính nó.
- **Icon nét:** thả PNG vuông 1024×1024 vào `icons/` và khai báo trong `iconMap` theo tên app. App không có icon riêng sẽ dùng icon hệ thống Tizen trả về (thường nhỏ, hơi mờ — đó là lý do có thư mục `icons/`).
- **Hình nền:** thay `wallpaper.jpg` bằng ảnh 16:9 bất kỳ.
- **Thời tiết:** sửa `weatherCity`, `latitude`, `longitude` (mặc định TP. Hồ Chí Minh, nguồn Open-Meteo miễn phí).

Sau khi sửa: build + cài lại như mục 5.

## 8. Lỗi thường gặp

- **Cài báo lỗi / app không xuất hiện:** gần như chắc chắn do chứng chỉ — kiểm tra profile đang active, distributor certificate có đúng DUID của tivi này không, và Developer Mode còn bật không.
- **Device Manager không thấy tivi:** khác mạng Wi-Fi, hoặc IP máy tính nhập trên tivi sai (DHCP đổi IP — nên đặt IP tĩnh cho máy tính), hoặc tivi chưa khởi động lại sau khi bật Developer Mode.
- **Mở app thấy "Preview mode":** bạn đang mở `index.html` bằng trình duyệt máy tính — bình thường, API Tizen chỉ tồn tại trên tivi.
- **Một app bấm không mở / báo lỗi mở:** một số app hệ thống của Samsung không cho app khác gọi mở — app sẽ hiện thông báo lỗi thay vì crash.
- **Danh sách thiếu app:** app đó có thể bị lọc bởi `hiddenNames` trong config, hoặc là app hệ thống không công khai tên.

## 9. Ghi công

Bản chuyển của [LGtv-Webos-homeskin](https://github.com/khuonguyenhcm-bit/LGtv-Webos-homeskin) (thiết kế gốc từ webos-vibehack của OmkarK97 / cleanyourtv của Gathin). Hình nền là fan-art Dragon Ball sưu tầm từ Pinterest; icon app thuộc về các hãng tương ứng — chỉ dùng cho mục đích cá nhân.
