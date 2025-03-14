// 폼을 제출할 때 실행되는 함수
document.getElementById("moldForm").addEventListener("submit", function(event) {
    event.preventDefault(); // 폼 제출 기본 동작 방지

    const moldPrefix = document.getElementById("moldPrefix").value;
    const moldMiddle = document.getElementById("moldMiddle").value;
    const moldSuffix = document.getElementById("moldSuffix").value;
    const machineNumber = document.getElementById("machineNumber").value;
    const status = document.getElementById("status").value;
    const maintenance = document.getElementById("maintenance").value;
    const maintenanceDateTime = document.getElementById("maintenanceDateTime").value;

    // 새로운 Mold 데이터 객체
    const newMold = {
        moldID: `${moldPrefix}-${moldMiddle}-${moldSuffix}`,
        machineNumber: machineNumber,
        status: status,
        maintenance: maintenance,
        maintenanceDateTime: maintenanceDateTime
    };

    // 서버로 데이터 전송
    fetch('/add-mold', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMold),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        fetchMolds(); // 폼 제출 후 목록 갱신
    })
    .catch(error => {
        console.error('Error adding mold:', error);
    });

    // 폼 초기화
    document.getElementById("moldForm").reset();
});

// Mold 데이터를 서버에서 가져오는 함수
function fetchMolds() {
    fetch('/get-molds')
        .then(response => response.json())
        .then(data => {
            const moldTableBody = document.getElementById("moldTableBody");
            moldTableBody.innerHTML = ""; // 기존 내용 초기화

            data.forEach(mold => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${mold.moldID}</td>
                    <td>${mold.machineNumber}</td>
                    <td>${mold.status}</td>
                    <td>${mold.maintenance}</td>
                    <td>${mold.maintenanceDateTime}</td>
                `;
                moldTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching molds:', error);
        });
}

// 페이지 로드 후 Mold 데이터 가져오기
document.addEventListener("DOMContentLoaded", function() {
    fetchMolds();
});
