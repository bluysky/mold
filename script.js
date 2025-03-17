<script type="module">
    import { createClient } from 'https://esm.sh/@supabase/supabase-js';

    const SUPABASE_URL = "https://nxuzpdwzpzrxwyxdtqgo.supabase.co";
    const SUPABASE_ANON_KEY = "nxuzpdwzpzrxwyxdtqgo";
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    async function saveMold() {
        const moldId = document.getElementById("moldType").value + "/" + 
                       document.getElementById("moldCategory").value + "/" +
                       document.getElementById("moldNumber").value;
        const status = document.getElementById("moldStatus").value;
        const statusDate = document.getElementById("statusDate").value;
        const inspectionStatus = document.getElementById("inspectionStatus").value;
        const inspector = document.getElementById("inspector").value;

        const { data, error } = await supabase
            .from('molds')
            .insert([{ mold_id: moldId, status, status_date: statusDate, inspection_status: inspectionStatus, inspector }]);

        if (error) {
            alert("데이터 저장 실패: " + error.message);
        } else {
            alert("데이터 저장 완료!");
            fetchMolds();
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
            tableBody.innerHTML += `
                <tr>
                    <td>${mold.id}</td>
                    <td>${mold.mold_id}</td>
                    <td>${mold.status} (${mold.status_date})</td>
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

    async function deleteMold(id) {
        const { error } = await supabase.from('molds').delete().eq('id', id);

        if (error) {
            alert("삭제 실패: " + error.message);
        } else {
            alert("삭제 완료!");
            fetchMolds();
        }
    }
</script>
