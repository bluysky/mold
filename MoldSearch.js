document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.getElementById("moldSearchForm");
    const resultsContainer = document.getElementById("resultsContainer");

    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // 입력 값 가져오기
        const moldId = document.getElementById("moldId").value.trim();
        const status = document.getElementById("status").value.trim();
        let statusDate = document.getElementById("statusDate").value;
        const inspect = document.getElementById("inspect").value.trim();

        // 날짜 선택이 없으면 기본으로 일주일 전 날짜 사용
        if (!statusDate) {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            statusDate = oneWeekAgo.toISOString().split("T")[0]; // input type="date" 형식
        }

        // URLSearchParams를 사용해 쿼리 스트링 생성
        const params = new URLSearchParams({
            mold_id: moldId,
            status: status,
            status_date: statusDate,
            inspect: inspect
        });

        fetch(`/search?${params.toString()}`)
            .then(response => response.json())
            .then(data => {
                displayResults(data);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    });

    function displayResults(data) {
        resultsContainer.innerHTML = "";

        if (data.length === 0) {
            resultsContainer.innerHTML = "<p>No results found</p>";
            return;
        }

        const list = document.createElement("ul");
        data.forEach(item => {
            const listItem = document.createElement("li");
            listItem.textContent = `Mold ID: ${item.mold_id}, Status: ${item.status}, Date: ${item.status_date}, Inspect: ${item.inspect}`;
            list.appendChild(listItem);
        });

        resultsContainer.appendChild(list);
    }
});