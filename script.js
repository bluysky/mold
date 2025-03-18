import { createClient } from 'https://esm.sh/@supabase/supabase-js';

// 전역 변수로 deleteId 선언
let deleteId; 

// Supabase 설정
const SUPABASE_URL = "https://nxuzpdwzpzrxwyxdtqgo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54dXpwZHd6cHpyeHd5eGR0cWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNzE5MTUsImV4cCI6MjA1Nzc0NzkxNX0.BIDc-F9sLVhdjmnC6N-VjQwEe55nqkZV07X_X-NCLcY";  // 실제 키로 교체
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 데이터 저장 함수
async function saveMold() {
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
        // 업데이트 요청
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
        // 새로운 데이터 삽입
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
        alert("데이터 저장 실패: " + result.error.message);
    } else {
        alert("데이터 저장 완료!");
        fetchMolds();  // 저장 후 데이터 다시 불러오기
        document.getElementById('moldForm').reset();  // 폼 리셋
        document.getElementById('editId').value = '';  // 편집 ID 초기화
    }
}

// 몰드 데이터 조회
async function fetchMolds() {
    const { data, error } = await supabase.from('molds').select('*');

    const tableBody = document.getElementById("moldTable");
    tableBody.innerHTML = "";

    if (error) {
        alert("데이터 조회 실패: " + error.message);
        tableBody.innerHTML = "<tr><td colspan='6'>데이터 조회 실패</td></tr>";
        return;
    }

    if (data && data.length > 0) {
        data.forEach(mold => {
            const localDate = new Date(mold.status_date).toLocaleString("en-US", {
                timeZone: "America/New_York"
            });

            tableBody.innerHTML += ` 
                <tr>
                    <td>${mold.id}</td>
                    <td>${mold.mold_id}</td>
                    <td>${mold.status} (${localDate})</td>
                    <td>${mold.inspection_status}</td>
                    <td>${mold.inspector}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" data-id="${mold.id}" onclick="editMold(this)">수정</button>
                        <button class="btn btn-danger btn-sm" onclick="openModal(${mold.id})">삭제</button>
                    </td>
                </tr>
            `;
        });
    } else {
        tableBody.innerHTML = "<tr><td colspan='6'>데이터가 없습니다.</td></tr>";
    }
}

// 몰드 수정
async function editMold(button) {
    const id = button.getAttribute('data-id');  // 버튼에서 ID 가져오기
    const { data, error } = await supabase.from('molds').select('*').eq('id', id).single();

    if (error) {
        alert("데이터 불러오기 실패: " + error.message);
        return;
    }

    if (data) {
        const [moldType, moldCategory, moldNumber] = data.mold_id.split('/');
        document.getElementById('moldType').value = moldType;
        document.getElementById('moldCategory').value = moldCategory;
        document.getElementById('moldNumber').value = moldNumber;
        document.getElementById('moldStatus').value = data.status;
        document.getElementById('statusDate').value = data.status_date.split('T')[0];
        document.getElementById('inspectionStatus').value = data.inspection_status;
        document.getElementById('inspector').value = data.inspector;
        document.getElementById('editId').value = data.id;
    }
}

// 삭제 모달 열기
function openModal(id) {
    deleteId = id;
    document.getElementById('deleteModal').style.display = "block";
}

// 모달을 닫는 함수
function closeModal() {
    const modal = document.getElementById("deleteModal");
    modal.style.display = "none";  // 모달을 닫는 동작
}

// 몰드 삭제
async function deleteMold() {
    const { error } = await supabase.from('molds').delete().eq('id', deleteId);

    if (error) {    
        alert("삭제 실패: " + error.message);
    } else {
        alert("삭제 완료!");
        fetchMolds();  // 삭제 후 데이터 갱신
    }
    closeModal();
}

// 페이지 로드 후 이벤트 리스너
document.addEventListener('DOMContentLoaded', () => {
    // '수정' 버튼들에 이벤트 리스너 추가
    document.querySelectorAll('.btn-warning').forEach(button => {
        if (button.hasAttribute('data-id')) {
            const id = button.getAttribute('data-id');
            console.log("data-id 값: ", id);  // data-id 값 확인
            button.addEventListener('click', () => {
                editMold(id);  // editMold 호출
            });
        } else {
            console.log("data-id 속성이 없습니다.");
        }
    });

    // 삭제 버튼들에 대한 이벤트 리스너 추가
    document.querySelectorAll('.btn-danger').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            openModal(id);  // 삭제 확인 모달 열기
        });
    });
});


// 모듈로 함수들 내보내기
export { saveMold, editMold, fetchMolds, openModal,  deleteMold };
