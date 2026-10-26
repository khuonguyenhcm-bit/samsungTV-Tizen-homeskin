# Install guide — Samsung Tizen Home Skin

> **Before you start:** this port was pre-built from Samsung's official Tizen documentation and has **never run on a real Samsung TV** (the author doesn't own one). The steps below are Samsung's standard self-signing flow; if something fails, the exact error message is the most valuable thing you can report back.

> ⚠️ **Use at your own risk:** this is community software installed outside the official store. In particular, a **TV firmware upgrade** can remove sideloaded apps, disable Developer Mode, or break the app — think before upgrading, and if the app is gone after an upgrade, reinstall from scratch with this guide.

Unlike the LG version (one command and done), the Samsung version is **more involved because of Samsung's policy**: every app must be **signed with a certificate containing your specific TV's DUID**. The first setup takes ~30–45 minutes; updates after that are quick.

## 1. Install Tizen Studio on your computer

1. Download **Tizen Studio** from developer.samsung.com (Mac/Windows) and install it.
2. Open **Package Manager** inside Tizen Studio and add:
   - **TV Extensions** (latest) + **TV Extension Tools** (Extension SDK section)
   - **Samsung Certificate Extension**
   - **Certificate Manager** (Main SDK / Baseline section)

## 2. Enable Developer Mode on the TV

1. Press Home → open **Apps**.
2. Quickly press **1 2 3 4 5** on the remote — the Developer Mode dialog appears.
3. Turn **Developer mode** on and enter **your computer's IP address**.
4. Restart the TV. The Apps screen now shows a red "Developer Mode" label.

*A TV pairs with only one computer at a time — switching computers means redoing this step.*

## 3. Connect the computer to the TV

1. In Tizen Studio open **Device Manager** → **Remote Device Manager** → Scan — your TV appears (same Wi-Fi network required).
2. Flip its **Connection** switch to On. A working connection is what lets the next step fetch the TV's DUID automatically.

## 4. Create the certificate (Samsung's mandatory step)

1. Open **Tools → Certificate Manager** → **+** to create a profile → choose **Samsung** → **TV**.
2. Create an **author certificate**: name + password, and sign in with a **Samsung account** when asked (free).
3. Create a **distributor certificate**: **Partner** level, and select your connected TV in the DUID section (it fills in automatically) — or look the DUID up on the TV under **Settings → Support → About This TV** (hidden on some newer models; in that case right-click the device in Device Manager → **DUID**).
4. Set this profile **active**.

*Skipping or mismatching this step produces generic install errors (1181 / -12 depending on version) — the classic Tizen failure when the certificate doesn't match the TV's DUID.*

## 5. Build + install to the TV

In a terminal, in this repo's folder:

```bash
cd Samsungtv-Tizen-homeskin
tizen build-web
tizen package -t wgt -s <your certificate profile name>
tizen install -n <the .wgt file just created> -t <TV name from Device Manager>
```

On the TV, **Tizen Home Skin** appears in your Apps list. On first launch it lists the TV's installed apps itself and orders them per the config.

## 6. Day-to-day use

- **Left/Right**: move between tiles; **OK**: open the app; a tile's name only appears while it's focused.
- **Back**: exit the launcher.
- **The Home button always opens Samsung's Smart Hub** — that's a Tizen limitation no app can override. Closest workaround: **Settings → General → Smart Features**, turn "Autorun Smart Hub" off and **"Autorun Last App"** on — the TV then returns to the launcher at power-on if the launcher was the last thing open.

## 7. Customising (in `js/config.js`)

> **Note:** the LG original gained an on-TV Settings screen plus a phone settings page (26 Oct update). This Samsung port does not have it yet — customisation still happens in `js/config.js`, below.

- **Front-of-row order:** `orderNames` — matched against app names (case-insensitive substring). Default: YouTube, Apple Music, Netflix, Apple TV; the rest is alphabetical.
- **Hide apps:** `hiddenNames` — partial names are fine. The launcher hides itself automatically.
- **Sharp icons:** drop a square 1024×1024 PNG into `icons/` and map it in `iconMap` by app name. Apps without a bundled icon use the system icon Tizen reports (usually small and soft — hence the `icons/` folder).
- **Wallpaper:** replace `wallpaper.jpg` with any 16:9 image.
- **Weather:** edit `weatherCity`, `latitude`, `longitude` (default Ho Chi Minh City, free Open-Meteo data).

After editing: rebuild + reinstall as in section 5.

## 8. Troubleshooting

- **Install errors / app never appears:** almost certainly the certificate — check the active profile, that the distributor certificate carries *this* TV's DUID, and that Developer Mode is still on.
- **Device Manager can't find the TV:** different Wi-Fi network, wrong computer IP entered on the TV (DHCP changed it — give the computer a static IP), or the TV wasn't restarted after enabling Developer Mode.
- **The app says "Preview mode":** you're opening `index.html` in a desktop browser — expected; the Tizen API only exists on the TV.
- **A tile won't open:** some Samsung system apps refuse to be launched by other apps; the launcher shows an error toast instead of crashing.
- **An app is missing from the row:** it may be filtered by `hiddenNames` in the config, or it may be a system app that doesn't publish a name.

## 9. Credits

A port of [LGtv-Webos-homeskin](https://github.com/khuonguyenhcm-bit/LGtv-Webos-homeskin) (original design from OmkarK97's webos-vibehack / Gathin's cleanyourtv). The wallpaper is Dragon Ball fan art found on Pinterest; app icons belong to their respective brands — personal use only.
