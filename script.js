import { createClient } from 'https://esm.sh/@supabase/supabase-js';

// Supabase 설정
const SUPABASE_URL = "https://nxuzpdwzpzrxwyxdtqgo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54dXpwZHd6cHpyeHd5eGR0cWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNzE5MTUsImV4cCI6MjA1Nzc0NzkxNX0.BIDc-F9sLVhdjmnC6N-VjQwEe55nqkZV07X_X-NCLcY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 언어 전환
let language = "en";
let deleteId;

window.toggleLanguage = function () {
    language = language === "en" ? "ko" : "en";
    document.querySelectorAll('.lang').forEach(el => {
        const translations = {
            "Mold ID": "몰드 ID",
            "Mold Category": "몰드 카테고리",
            "Mold Status": "몰드 상태",
            "Inspection Status": "몰드 검사 상태",
            "Inspector": "검사자",
            "Mold": "몰드",
            "Status": "상태",
            "Actions": "관리"
        };
        el.textContent = language === "en" ? Object.keys(translations).find(key => translations[key] === el.textContent) || el.textContent : translations[el.textContent] || el.textContent;
    });
};

// 데이터 저장 함수
window.saveMold = async function () {
    // ... (이전 코드와 동일) ...
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
                        <td>${mold.id}</td>
                        <td>${mold.mold_id}</td>
                        <td>${mold.status} (${localDate})</td>
                        <td>${mold.inspection_status}</td>
                        <td>${mold.inspector}</td>
                        <td>
                            <button onclick="editMold('${mold.id}')">수정</button>
                            <button onclick="deleteMold('${mold.id}')">삭제</button>
                        </td>
                    </tr>
                `;
            });
        } else {
            tableBody.innerHTML = "<tr><td colspan='6'>데이터가 없습니다.</td></tr>";
        }
    } catch (error) {
        console.error("데이터 조회 중 오류 발생:", error);
        alert("데이터 조회 중 오류가 발생했습니다.");
    }
};

// 몰드 데이터 수정 함수
window.editMold = function (moldId) {
    // 수정 폼 표시 및 데이터 채우기
    supabase.from('molds').select('*').eq('id', moldId).then(({ data, error }) => {
        if (error) {
            console.error("데이터 조회 실패:", error);
            alert("데이터 조회 실패: " + error.message);
            return;
        }
        if (data && data.length > 0) {
            const mold = data[0];
            document.getElementById('moldType').value = mold.mold_id.split('/')[0];
            document.getElementById('moldCategory').value = mold.mold_id.split('/')[1];
            document.getElementById('moldNumber').value = mold.mold_id.split('/')[2];
            document.getElementById('moldStatus').value = mold.status;
            document.getElementById('statusDate').value = mold.status_date.substring(0, 16);
            document.getElementById('inspectionStatus').value = mold.inspection_status; // 수정된 부분
            document.getElementById('inspector').value = mold.inspector;
            document.getElementById('editId').value = mold.id;
        }
    });
};

// 몰드 데이터 삭제 함수
window.deleteMold = function (moldId) {
    // 삭제 확인 모달 표시
    document.getElementById('deleteModal').style.display = 'block';
    deleteId = moldId;
};

// 삭제 확인 모달 닫기 함수
window.closeModal = function () {
    document.getElementById('deleteModal').style.display = 'none';
};

// 삭제 확인 함수
document.getElementById('confirmDelete').addEventListener('click', async function () {
    try {
        const { error } = await supabase.from('molds').delete().eq('id', deleteId);
        if (error) {
            console.error("데이터 삭제 실패:", error);
            alert("데이터 삭제 실패: " + error.message);
        } else {
            alert("데이터 삭제 완료!");
            fetchMolds();
        }
        closeModal();
    } catch (error) {
        console.error("데이터 삭제 중 오류 발생:", error);
        alert("데이터 삭제 중 오류가 발생했습니다.");
    }
});
