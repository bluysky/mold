let language = "en";

window.toggleLanguage = function () {
    language = language === "en" ? "ko" : "en";
    document.querySelectorAll('.lang').forEach(el => {
        const translations = {
            "Mold ID": language === "en" ? "Mold ID" : "몰드 ID",
            "Mold Category": language === "en" ? "Mold Category" : "몰드 카테고리",
            "Enter Number": language === "en" ? "Enter Number" : "번호 입력",
            "Mold Status": language === "en" ? "Mold Status" : "몰드 상태",
            "Inspection Status": language === "en" ? "Inspection Status" : "검사 상태",
            "Inspector": language === "en" ? "Inspector" : "검사자",
            "Mold": language === "en" ? "Mold" : "몰드",
            "Status": language === "en" ? "Status" : "상태",
            "Date/Time": language === "en" ? "Date/Time" : "날짜/시간",
            "Are you sure you're going to delete it?": language === "en" ? "Are you sure you're going to delete it?" : "삭제하시겠습니까?",
            "delete": language === "en" ? "delete" : "삭제",
            "cancel": language === "en" ? "cancel" : "취소",
            "Mold Tracking System": language === "en" ? "Mold Tracking System" : "몰드 추적 시스템",
            "Switch to Korean": language === "en" ? "Switch to Korean" : "한국어로 전환",
            "ID": language === "en" ? "ID" : "아이디",
            "Actions": language === "en" ? "Actions" : "관리",
        };
        el.textContent = translations[el.textContent] || el.textContent;
    });
};
