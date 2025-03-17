<script type="module">
    import { createClient } from 'https://esm.sh/@supabase/supabase-js';

    const SUPABASE_URL = "postgresql://postgres:[DydAns$61Vx329eQ]@db.nxuzpdwzpzrxwyxdtqgo.supabase.co:5432/postgres";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54dXpwZHd6cHpyeHd5eGR0cWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNzE5MTUsImV4cCI6MjA1Nzc0NzkxNX0.BIDc-F9sLVhdjmnC6N-VjQwEe55nqkZV07X_X-NCLcY";
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    async function saveMold() {
        const moldId = document.getElementById("moldType").value + "/" +
            document.getElementById("moldCategory").value + "/" +
            document.getElementById("moldNumber").value;
        const status = document.getElementById("moldStatus").value;
        const statusDate = document.getElementById("statusDate").value;
        const inspectionStatus = document.getElementById("inspectionStatus").value;
        const inspector = document.getElementById("inspector").value;
        const editId = document.getElementById("editId").value; // 수정 시 ID

        if (!statusDate) {
            alert("날짜를 선택하세요!");
            return;
        }

        const timestamp = new Date(statusDate).toISOString();

        let result;
        if (editId) {
            // 수정 모드
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
            // 저장 모드
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
            fetchMolds();
            document.getElementById('moldForm').reset();
            document.getElementById('editId').value = ''; // 수정 ID 초기화
        }
    }

    async function fetchMolds() {
        const { data, error } = await supabase.from('molds').select('*');

        if (error) {
            alert("데이터 조회 실패: " + error.message);
            return;
        }

        const tableBody = document.getElementById("moldTable");
        tableBody.innerHTML = "";

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
                        <button class="btn btn-warning btn-sm" onclick="editMold(${mold.id})">수정</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteMold(${mold.id})">삭제</button>
                    </td>
                </tr>
            `;
        });
    }

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
            document.getElementById('statusDate').value = data.status_date.split('T')[0];
            document.getElementById('inspectionStatus').value = data.inspection_status;
            document.getElementById('inspector').value = data.inspector;
            document.getElementById('editId').value = data.id; // 수정 ID 설정
        }
    }

    async function deleteMold(id) {
        if (confirm("정말로 삭제하시겠습니까?")) {
            const { error } = await supabase.from('molds').delete().eq('id', id);

            if (error) {
                alert("삭제 실패: " + error.message);
            } else {
                alert("삭제 완료!");
                fetchMolds();
            }
        }
    }
</script>
