# 廣得好 CanDuckGo Marketing Site — Agent 指引

呢個 repo 係 `canduckgo.com` 嘅 production 靜態網站，獨立於 `../CanDuckGo/` Unity repo。

## 產品同私隱約束

- 網站介紹「廣得好 CanDuckGo」並提供 Support、Privacy、Terms 公開 URL。
- 貫徹 app 嘅「預設唔收集」原則：唔好加入 analytics、tracking、cookies、帳戶、newsletter、email capture、form backend 或任何訪客資料儲存。
- Support 表格只可以 compose `mailto:support@canduckgo.com`；網站本身唔傳送或儲存表格內容。
- 所有 runtime 字型、Three.js 同產品資產都要由同一網站提供，避免第三方 request。
- 外部服務、追蹤、資料收集或 legal copy 改動必須先得到 owner 明確批准。

## 開發同發佈

- 對話同文件用繁體中文（廣東話語感）；code 同 commit message 用英文。
- 本機開發：`npm run dev`。
- 每次改動最少要通過：`npm run build`，並喺 desktop 同 mobile browser 驗證受影響頁面、連結、互動同 console。
- `main` push 會經 `.github/workflows/deploy.yml` 發佈 GitHub Pages。
- Production domain 固定係 `canduckgo.com`；`public/CNAME` 同 workflow `SITE_BASE=/` 要保持一致。
- 公開 repo 唔代表開源；除已列明第三方授權外，唔好自行加入 code／原創資產 license。

## 視覺同內容

- `/Users/michaelyung/Downloads/design_handoff_canduckgo_marketing_site/` 係 2026-07 原始高保真 handoff；改版前以入面 screenshot、copy 同 voxel 規格做 source of truth。
- 繁中／英文內容要同步更新；語言 toggle、四個直接 URL 同 responsive layout 都要保持可用。
- Kosefont subset、game screenshots 同 voxel models 係產品資產；保留 attribution，唔好用 placeholder 取代。
- Privacy／Terms 係上架材料；產品行為改變時要同步更新，但正式上架前仍要 owner 安排法律審閱。
