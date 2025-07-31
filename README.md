# 需求問題
* 品牌比較 -> 只要 “品牌名稱” + “競爭對手品牌“ 清單中至少兩個出現在結果就算有？
* 有無品牌 -> 只要結果有包含 ”品牌名稱“ 其中一個就算有
* 有無官網 -> 只要結果有包含 “品牌網站” 其中一個就算有
* 品牌相關，內容分析，優化方向 這三個的規則？
* 所有品牌（包含 “品牌名稱” “競爭對手品牌”）展開，依序跟 gpt 結果比對
* 預計多頻繁使用此工具？
* 是否有時間限制，現在搜集一個問題大概要 20 秒

# 技術難點
## ChatGPT
* 複製按鈕有時會失效

## AIO
* AIO 是 js 產生
* 模擬瀏覽器行為會直接被屏蔽
<img width="456" height="445" alt="image" src="https://github.com/user-attachments/assets/35b1f39e-9d76-45e8-8b0b-fc7d12a7fd16" />

* 使用 Serpapi 的結果跟直接搜尋不一樣
* Serpapi 免費版一個月上限 100 次 query，可以多建立幾個帳號，只是創建帳號需要綁定手機號碼

### Example
<p>排名一直卡在第二頁，台北哪幾家 SEO 公司最擅長解決這種瓶頸？</p>

* Google search incognito
<img width="1613" height="1526" alt="image" src="https://github.com/user-attachments/assets/d13099f7-9e8f-411b-9ee5-5f71a6d7c3b7" />

* Using Serpapi
<img width="814" height="559" alt="image" src="https://github.com/user-attachments/assets/c1e26011-2ba1-4740-9ef8-e804fd89c9a2" />


