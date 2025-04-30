// src/utils/rangeUtils.js
export const getDailyRange = (today) => {
    const start = new Date(today.setHours(0, 0, 0, 0));  // 오늘 자정
    const end = new Date(today.setHours(23, 59, 59, 999));  // 오늘 마지막 순간
    return { start, end };
};

export const getWeeklyRange = (today) => {
    const start = new Date(today.setDate(today.getDate() - today.getDay()));  // 이번 주 시작일
    const end = new Date(today.setDate(today.getDate() - today.getDay() + 6));  // 이번 주 종료일
    return { start, end };
};

export const getMonthlyRange = (today) => {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);  // 이번 달 1일
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);  // 이번 달 마지막 날
    return { start, end };
};
