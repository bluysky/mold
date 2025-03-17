<script type="module">
    import { createClient } from 'https://esm.sh/@supabase/supabase-js';

    const SUPABASE_URL = "https://nxuzpdwzpzrxwyxdtqgo.supabase.co";
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

        if (!statusDate) {
            alert("날짜를 선택하세요!");
            return;
        }

        // ✅ 날짜를 timestamp 형식(ISO 8601)으로 변환
        const timestamp = new Date(statusDate).toISOString();

        const { data, error } = await supabase
            .from('molds')
            .insert([{ 
                mold_id: moldId, 
                status, 
                status_date: timestamp, // ✅ timestamp 저장 
                inspection_status: inspectionStatus, 
                inspector 
            }]);

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
            // ✅ timestamp를 한국 시간 (KST)으로 변환
            const localDate = new Date(mold.status_date).toLocaleString("ko-KR", {
                timeZone: "Asia/Seoul"
            });

            tableBody.innerHTML += `
                <tr>
                    <td>${mold.id}</td>
                    <td>${mold.mold_id}</td>
                    <td>${mold.status} (${localDate})</td> <!-- 변환된 날짜 표시 -->
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
