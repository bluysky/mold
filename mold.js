import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

        const now = new Date().toISOString();

        let result;
        if (editId) {
            result = await supabase
                .from('molds')
                .update({
                    mold_id: moldId,
                    status: status,
                    status_date: now,
                    inspection_status: inspectionStatus,
                    inspector
                })
                .eq('id', editId);
        } else {
            result = await supabase
                .from('molds')
                .insert([{
                    mold_id: moldId,
                    status: status,
                    status_date: now,
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
            tableBody.innerHTML = "<tr><td colspan='7' class='lang'>데이터 조회 실패</td></tr>";
            return;
        }

        if (data && data.length > 0) {
            data.forEach(mold => {
                const date = new Date(mold.status_date);
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
                        <td class="lang">${mold.status}</td>
                        <td class="lang">${mold.inspection_status}</td>
                        <td class="lang">${mold.inspector}</td>
                        <td>${localDate}</td>
                        <td>
                            <button onclick="window.editMold('${mold.id}')" class="lang">Edit</button>
                            <button onclick="window.deleteMold('${mold.id}')" class="lang">Delete</button>
                        </td>
                    </tr>
                `;
            });
        } else {
            tableBody.innerHTML = "<tr ><td colspan='7' class='lang'>데이터가 없습니다.</td></tr>";
        }
    } catch (error) {
        console.error("데이터 조회 중 오류 발생:", error);
        alert("데이터 조회 중 오류가 발생했습니다.");
    }
};

// 몰드 데이터 수정 함수
window.editMold = function (moldId) {
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

// 페이지 로드 시 몰드 데이터 조회
window.onload = function() {
    fetchMolds();
};
