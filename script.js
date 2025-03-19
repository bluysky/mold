<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mold Management</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
        }
        .container {
            max-width: 1000px;
            margin: 50px auto;
        }
        .table-container {
            margin-top: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f0f0f0;
        }
        form {
            margin-bottom: 20px;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        form label {
            display: block;
            margin-top: 10px;
        }
        form input, form select {
            width: 100%;
            padding: 10px;
            margin-top: 5px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        form button {
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        form button:hover {
            background-color: #0056b3;
        }
        .modal {
            display: none;
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.5);
        }
        .modal-content {
            background-color: #fff;
            margin: 15% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 50%;
            border-radius: 5px;
            position: relative;
        }
        .close-button {
            position: absolute;
            top: 10px;
            right: 10px;
            color: #888;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }
        .close-button:hover,
        .close-button:focus {
            color: #000;
            text-decoration: none;
        }
        #confirmDelete {
            background-color: #dc3545;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
        }
        #confirmDelete:hover {
            background-color: #c82333;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="lang">Mold Management</h1>
        <button onclick="window.toggleLanguage()" class="lang">언어 전환</button>

        <form id="moldForm">
            <label for="moldType" class="lang">Mold ID</label>
            <div style="display: flex;">
                <select id="moldType" style="width: 30%; margin-right: 10px;">
                    <option value="A">Type A</option>
                    <option value="B">Type B</option>
                </select>
                <select id="moldCategory" style="width: 30%; margin-right: 10px;">
                    <option value="01">Category 01</option>
                    <option value="02">Category 02</option>
                </select>
                <input type="text" id="moldNumber" style="width: 40%;" placeholder="Number">
            </div>
            <label for="moldStatus" class="lang">Mold Status</label>
            <select id="moldStatus">
                <option value="Available">Available</option>
                <option value="In Use">In Use</option>
                <option value="Maintenance">Maintenance</option>
            </select>
            <label for="inspectionStatus" class="lang">Inspection Status</label>
            <select id="inspectionStatus">
                <option value="Passed">Passed</option>
                <option value="Failed">Failed</option>
                <option value="Pending">Pending</option>
            </select>
            <label for="inspector" class="lang">Inspector</label>
            <input type="text" id="inspector">
            <input type="hidden" id="editId">
            <button type="button" onclick="window.saveMold()" class="lang">Save</button>
        </form>

        <div class="table-container">
            <h2 class="lang">Mold Status</h2>
            <table>
                <thead>
                    <tr>
                        <th class="lang">Mold</th>
                        <th class="lang">Mold ID</th>
                        <th class="lang">Status</th>
                        <th class="lang">Inspection Status</th>
                        <th class="lang">Inspector</th>
                        <th class="lang">Date/Time</th>
                        <th class="lang">Actions</th>
                    </tr>
                </thead>
                <tbody id="moldTable">
                    <tr>
                        <td colspan="6" class="lang">Loading...</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div id="deleteModal" class="modal">
            <div class="modal-content">
                <span onclick="window.closeModal()" class="close-button">&times;</span>
                <h2 class="lang">Delete Confirmation</h2>
                <p class="lang">Are you sure you want to delete this mold?</p>
                <div style="text-align: right;">
                    <button onclick="window.closeModal()" class="lang">Cancel</button>
                    <button id="confirmDelete" class="lang">Delete</button>
                </div>
            </div>
        </div>
    </div>

    <script type="module">
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
                    "Mold Management": "몰드 관리",
                    "언어 전환": "Language Switch",
                    "Mold ID": "몰드 ID",
                    "Mold Status": "몰드 상태",
                    "Inspection Status": "몰드 검사 상태",
                    "Inspector": "검사자",
                    "Save": "저장",
                    "Mold": "몰드",
                    "Status": "상태",
                    "Actions": "관리",
                    "Date/Time": "날짜/시간",
                    "Loading...": "로드 중...",
                    "Delete Confirmation": "삭제 확인",
                    "Are you sure you want to delete this mold?": "이 몰드를 삭제하시겠습니까?",
                    "Cancel": "취소",
                    "Delete": "삭제",
                    "Number": "번호",
                    "Type A": "타입 A",
                    "Type B": "타입 B",
                    "Category 01": "카테고리 01",
                    "Category 02": "카테고리 02",
                    "Available": "사용 가능",
                    "In Use": "사용 중",
                    "Maintenance": "유지 보수",
                    "Passed": "통과",
                    "Failed": "실패",
                    "Pending": "보류 중",
                    "데이터 저장 완료!": "Data saved successfully!",
                    "데이터 저장 실패: ": "Data saving failed: ",
                    "모든 필드를 입력하세요!": "Please fill in all fields!",
                    "데이터 저장 중 오류 발생:": "Error occurred while saving data:",
                    "데이터 조회 실패: ": "Data retrieval failed: ",
                    "데이터 조회 실패": "Failed to retrieve data",
                    "데이터가 없습니다.": "No data available.",
                     "데이터 조회 중 오류 발생:": "Error occurred while retrieving data.",
                    "Edit": "수정",
                    "Delete": "삭제"
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
                    tableBody.innerHTML = "<tr><td colspan='7' class='lang'>데이터 조회 실패</td></tr>";
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

        // 페이지 로드 시 몰드 데이터 조회
        window.onload = function() {
            fetchMolds();
            window.toggleLanguage(); // 초기에 언어 설정 적용
        };
    </script>
</body>
</html>
