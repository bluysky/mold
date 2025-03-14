const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3002;  // 로컬에서는 3002 포트를 사용


let molds = [];  // Mold 목록을 저장할 배열

// ✅ "public" 폴더를 정적 파일 폴더로 설정
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// ✅ 서버 API (예제용)
app.post("/add-mold", (req, res) => {
    const newMold = req.body;
    molds.push(newMold); // 새로운 Mold 추가
    console.log("Received data:", req.body);
    res.json({ message: "Mold added successfully!" });
});

app.get("/get-molds", (req, res) => {
    res.json(molds); // 저장된 Mold 목록 반환
});

// ✅ 서버 실행
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
