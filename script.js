// 데이터 저장 함수
window.saveMold = async function () {
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

    const timestamp = new Date(statusDate).toISOString();  // statusDate를 ISO 형식으로 변환

    let result;
    if (editId) {
        // 수정 처리
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
        fetchMolds();  // 데이터 갱신
        document.getElementById('moldForm').reset();  // 폼 초기화
        document.getElementById('editId').value = '';  // editId 초기화
    }
};

// 몰드 수정
async function editMold(id) {
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
        document.getElementById('statusDate').value = data.status_date.split('T')[0]; // 날짜만 입력
        document.getElementById('inspectionStatus').value = data.inspection_status;
        document.getElementById('inspector').value = data.inspector;
        document.getElementById('editId').value = data.id;  // 수정할 id 값
    }
}

// 삭제 모달 열기
function openModal(id) {
    deleteId = id;
    document.getElementById('deleteModal').style.display = "block";
}

// 삭제 모달 닫기
function closeModal() {
    document.getElementById('deleteModal').style.display = "none";
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
    closeModal();  // 모달 닫기
}