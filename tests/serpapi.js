import { getJson } from "serpapi";

getJson({
  // q: "台北有哪些 SEO 公司口碑佳，成功把客戶關鍵字從第 3 頁拉到首頁？",
  q: "drop shipping",
  api_key: "65ad88529c4cdee7d182501eee6927161fa2f440adb69af8c62e939b16612e0f"
}, (json) => {
  console.log(json["ai_overview"]);
});