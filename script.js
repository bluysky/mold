import { createClient } from 'https://esm.sh/@supabase/supabase-js';

// Supabase 설정
const SUPABASE_URL = "https://nxuzpdwzpzrxwyxdtqgo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54dXpwZHd6cHpyeHd5eGR0cWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNzE5MTUsImV4cCI6MjA1Nzc0NzkxNX0.BIDc-F9sLVhdjmnC6N-VjQwEe55nqkZV07X_X-NCLcY"; // 실제 키로 교체
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 언어 전환
let language = "en";
let deleteId;

function toggleLanguage() {
    language = language === "en" ? "ko" : "en";
    document.querySelectorAll('.lang').forEach(el => {
        const translations = {
            "Mold ID": "몰드 ID",
            "Mold Status": "몰드 상태",
            "Inspection Status": "몰드 검사 상태",
            "Inspector": "검사자",
            "Mold": "몰드",
            "Status": "상태",
            "Actions": "관리"
        };
        el.textContent = language === "en" ? Object.keys(translations).find(key => translations[key] === el.textContent) || el.textContent : translations[el.textContent] || el.textContent;
    });
}

// 데이터 저장 함수
window.saveMold = async function () {
    try {
        const moldId = document.getElementById("moldType").value + "/" +
            document.getElementById("moldCategory").value + "/" +
            document.getElementById("moldNumber").value;
        const status = document.getElementById("moldStatus").value;
        const statusDate = document.getElementById("statusDate").value;
        const inspectionStatus = document.getElementById("inspectionStatus").value;
        const inspector = document.getElementById("inspector").value;
        const editId = document.getElementById("editId").value;

        if (!moldId || !status || !statusDate || !inspectionStatus || !inspector) {
            alert("모든 필드를 입력하세요!");
            return;
        }

        const timestamp = new Date(statusDate).toISOString();

        let result;
        if (editId) {
            result = await supabase
                .from('molds')
                .update({
                    mold_id: moldId,
                    status,
                    status_date: timestamp,
                    inspection_status: inspectionStatus,
                    inspector
                })
                .eq('id', editId);
        } else {
            result = await supabase
                .from('molds')
                .insert([{
                    mold_id: moldId,
                    status,
                    status_date: timestamp,
                    inspection_status: inspectionStatus,
                    inspector
                }]);
        }

        if (result.error) {
            console.error("데이터 저장 실패:", result.error);
            alert("데이터 저장 실패: " + result.error.message);
        } else {
            alert("데이터 저장 완료!");
            fetchMolds();
            document.getElementById('moldForm').reset();
            document.getElementById('editId').value = '';
        }
    } catch (error) {
        console.error("데이터 저장 중 오류 발생:", error);
        alert("데이터 저장 중 오류가 발생했습니다.");
    }
};

// 몰드 데이터 조회
window.fetchMolds = async function () {
    try {
        const { data, error } = await supabase.from('molds').select('*');

        const tableBody = document.getElementById("moldTable");
        tableBody.innerHTML = "";

        if (error) {
            console.error("데이터 조회 실패:", error);
            alert("데이터 조회 실패: " + error.message);
            tableBody.innerHTML = "<tr><td colspan='6'>데이터 조회 실패</td></tr>";
            return;
        }

        if (data && data.length > 0) {
            data.forEach(mold => {
                const localDate = new Date(mold.status_date).toLocaleString("ko-KR", {
                    timeZone: "Asia/Seoul"
                });

                tableBody.innerHTML += `
                    <tr>
                        <td><span class="math-inline">\{mold\.id\}</td\>
<td\></span>{mold.mold_id}</td>
                        <td><span class="math-inline">\{mold\.status\} \(</span>{localDate})</td>
                        <td><span class="math-inline">\{mold\.inspection\_status\}</td\>
<td\></span>{mold.inspector}</td>
                        <td>
                            <button class="btn btn-warning btn-sm"
