import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey);

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
            "Actions": "관리",
            "Date/Time": "날짜/시간"
        };
        el.textContent = language === "en" ? Object.keys(translations).find(key => translations[key] === el.textContent) || el.textContent : translations[el.textContent] || el.textContent;
    });
};

// 데이터 저장 함수
window.saveMold = async function () {
    try {
        const moldId = document.getElementById("moldType").value + "/" +
            document.getElementById("moldCategory").value + "/" +
            document.getElementById("moldNumber").value;
        const status = document.getElementById("moldStatus").value;
        const inspectionStatus = document.getElementById("inspectionStatus").value;
        const inspector = document.getElementById("inspector").value;
        const editId = document.getElementById("editId").value;

        if (!moldId || !status || !inspectionStatus || !inspector) {
            alert("모든 필드를 입력하세요!");
            return;
        }

        // 현재 날짜와 시간을 ISO 8601 형식으로 변환
        const now = new Date().toISOString();

        let result;
        if (editId) {
            result = await supabase
                .from('molds')
                .update({
                    mold_id: moldId,
                    status: status, // 상태만 저장
                    status_date: now, // 날짜/시간 별도 저장
                    inspection_status: inspectionStatus,
                    inspector
                })
                .eq('id', editId);
        } else {
            result = await supabase
                .from('molds')
                .insert([{
                    mold_id: moldId,
                    status: status, // 상태만 저장
                    status_date: now, // 날짜/시간 별도 저장
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
            // UTC 날짜/시간을 Date 객체로 변환
            const date = new Date(mold.status_date);

            // 현지 시간으로 변환하여 표시
            const localDate = date.toLocaleString(undefined, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            });

                tableBody.innerHTML += `
                    <tr>
                        <td>${mold.id}</td>
                        <td>${mold.mold_id}</td>
                        <td>${mold.status}</td>
                        <td>${mold.inspection_status}</td>
                        <td>${mold.inspector}</td>
                        <td>${localDate}</td> 
                        <td>
                            <button onclick="window.editMold('${mold.id}')">Edit</button>
                            <button onclick="window.deleteMold('${mold.id}')">Delete</button>
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
            const moldParts = mold.mold_id.split('/');
            document.getElementById('moldType').value = moldParts[0];
            document.getElementById('moldCategory').value = moldParts[1];
            document.getElementById('moldNumber').value = moldParts[2];
            document.getElementById('moldStatus').value = mold.status;
            document.getElementById('inspectionStatus').value = mold.inspection_status;
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
