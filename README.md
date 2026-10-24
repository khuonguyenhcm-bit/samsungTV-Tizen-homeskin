# Samsungtv-Tizen-homeskin

**Tiếng Việt** — Bản chuyển (port) của bộ [LGtv-Webos-homeskin](https://github.com/khuonguyenhcm-bit/LGtv-Webos-homeskin) sang **tivi Samsung chạy Tizen**: hình nền tràn màn hình, đồng hồ lớn + thời tiết góc trái, **một hàng icon vuông ở đáy**, tên app chỉ hiện khi ô được chọn.

**English** — A port of the [LGtv-Webos-homeskin](https://github.com/khuonguyenhcm-bit/LGtv-Webos-homeskin) home skin to **Samsung Tizen TVs**: full-screen wallpaper, big clock + weather in the top-left, **one bottom row of square app tiles**, labels shown only on the focused tile.

![Launcher screenshot — LG version / bản LG](https://raw.githubusercontent.com/khuonguyenhcm-bit/LGtv-Webos-homeskin/main/docs/screenshot.jpg)

> Ảnh trên là bản LG đang chạy thật. Bản Tizen dùng chung thiết kế và tài nguyên.
> The photo shows the LG version running. The Tizen port shares its design and assets.

## ⚠️ Trạng thái / Status

**Bản dựng trước, CHƯA kiểm chứng trên tivi Samsung thật** (tác giả chưa có máy Samsung). Code viết theo tài liệu Tizen chính thức, cú pháp đã kiểm tra, nhưng lần cài đầu tiên lên máy thật có thể cần chỉnh sửa nhỏ. Nếu bạn cài thử, rất mong nhận phản hồi/PR.

**Pre-built port, NOT yet tested on a real Samsung TV** (the author doesn't own one). Written against the official Tizen docs and syntax-checked, but the first install on real hardware may need small fixes. Test reports and PRs are very welcome.

## Khác gì so với bản LG / How it differs from the LG version

| | LG webOS | Samsung Tizen |
| --- | --- | --- |
| Đóng gói / Package | `.ipk`, cài bằng `ares` | `.wgt`, ký + cài bằng Tizen Studio |
| Ký app / Signing | Không cần — Developer Mode là đủ | **Bắt buộc ký bằng chứng chỉ chứa DUID của chính chiếc tivi** |
| Liệt kê app / App list | Đồng bộ từ máy tính (SSAP) | App tự hỏi Tizen (`tizen.application.getAppsInfo`) |
| Nút Home / Home button | Có mẹo kéo về launcher (home-watch) | **Không thay được** — Home luôn về Smart Hub của Samsung |
| Ô Settings/Inputs | Có (tiêm thêm) | Chưa có ở bản này |

## ⚠️ Cảnh báo — tự chịu trách nhiệm / Warning — use at your own risk

Đây là phần mềm cộng đồng cài ngoài kho ứng dụng chính thức (sideload) — **bạn tự chịu trách nhiệm khi cài và sử dụng**. Đặc biệt về **nâng cấp firmware của tivi**: bản cập nhật của Samsung có thể gỡ app tự cài, tắt Developer Mode hoặc làm app ngừng hoạt động. Hãy cân nhắc kỹ trước khi nâng cấp firmware; nếu đã nâng cấp mà app mất, cài lại từ đầu theo hướng dẫn trong repo. Tác giả không chịu trách nhiệm cho bất kỳ trục trặc nào phát sinh từ việc cài đặt, sử dụng hay nâng cấp.

This is community software installed outside the official app store (sideloading) — **you install and use it at your own risk**. In particular regarding **TV firmware upgrades**: a Samsung update can remove sideloaded apps, disable Developer Mode, or break the app. Think carefully before upgrading your TV's firmware; if an upgrade removes the app, reinstall from scratch following this repo's guide. The author takes no responsibility for any issues arising from installing, using, or upgrading.

## Giới hạn của Tizen (đọc trước khi cài) / Tizen limitations (read first)

Bộ này **tự chứa trọn bộ** như bản LG — tải đúng repo này là đủ, không cần repo nào khác. Nhưng nền tảng Tizen có những giới hạn cứng mà không bộ cài nào vượt qua được:

This repo is **fully self-contained** like the LG version — this download is all you need. But Tizen itself has hard limits no installer can remove:

1. **Mỗi tivi một chứng chỉ riêng** — app phải ký bằng chứng chỉ chứa DUID của chính tivi đó; không có chuyện 1 file cài cho mọi nhà như bản LG. Đổi tivi là ký lại.
   **One certificate per TV** — the app must be signed with a certificate containing that TV's DUID; there is no single file that installs everywhere like the LG version. A different TV means re-signing.
2. **Nút Home bất khả xâm phạm** — Home luôn mở Smart Hub của Samsung. Chỉ có mẹo "tự mở lại app dùng gần nhất" khi bật tivi (xem hướng dẫn).
   **The Home button is untouchable** — it always opens Samsung's Smart Hub. The only near-equivalent is "Autorun Last App" at power-on (see the guide).
3. **Tivi chỉ gắn với 1 máy tính** tại một thời điểm cho Developer Mode — đổi máy tính phải ghép lại từ đầu.
   **One computer per TV** for Developer Mode at a time — switching computers means pairing again.
4. **App tự cài có thể bị gỡ khi tivi cập nhật lớn / reset** — khi đó chỉ cần cài lại theo hướng dẫn.
   **Sideloaded apps may be removed by major TV updates / resets** — just reinstall per the guide.
5. **Chưa có ô Settings/Inputs và chưa kéo-thả sắp xếp** như bản LG — thứ tự chỉnh trong `js/config.js`.
   **No Settings/Inputs tiles and no drag-to-reorder yet**, unlike the LG version — order is set in `js/config.js`.

## Cài đặt / Install

Đọc **[HUONG-DAN.md](HUONG-DAN.md)** (tiếng Việt) hoặc **[GUIDE-EN.md](GUIDE-EN.md)** (English). Tóm tắt: cài Tizen Studio → bật Developer Mode trên tivi (Apps → bấm `12345` → nhập IP máy tính) → tạo chứng chỉ chứa DUID của tivi → `tizen build-web` + `tizen package -t wgt` + `tizen install`.

Short version: install Tizen Studio → enable Developer Mode on the TV (Apps → press `12345` → enter your computer's IP) → create a certificate containing your TV's DUID → `tizen build-web` + `tizen package -t wgt` + `tizen install`.

## Tuỳ biến / Customising

Mọi thứ nằm trong `js/config.js`: thứ tự app đầu hàng (khớp theo tên), app cần ẩn, icon riêng trong `icons/` (khớp theo tên app), thành phố thời tiết (toạ độ Open-Meteo). Đổi hình nền: thay `wallpaper.jpg` (ảnh 16:9).

Everything lives in `js/config.js`: front-of-row order (matched by app name), hidden apps, bundled icons in `icons/` (matched by app name), weather city (Open-Meteo coordinates). Replace `wallpaper.jpg` (16:9) for your own background.

## Ghi công / Credits

- Thiết kế + tài nguyên: bộ [LGtv-Webos-homeskin](https://github.com/khuonguyenhcm-bit/LGtv-Webos-homeskin), xây trên launcher webos-vibehack của OmkarK97 / cleanyourtv của Gathin.
- Hình nền là fan-art Dragon Ball (Kame House) sưu tầm từ Pinterest; icon app thuộc về các hãng tương ứng — chỉ dùng cho mục đích cá nhân.
- Design and assets come from the LG version, itself built on OmkarK97's webos-vibehack / Gathin's cleanyourtv. Wallpaper is Dragon Ball fan art from Pinterest; app icons belong to their brands — personal use only.

Làm bởi / Made by [khuong nguyen](https://khuong.cloud) với sự trợ giúp của audi (Muse).
