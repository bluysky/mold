// src/utils/calculateInspectorStats.js

// calculateInspectorStats는 각 기간에 대한 몰드 통계를 계산하는 함수
export const calculateInspectorStats = (molds, startDate, endDate) => {
    // 통계 결과를 저장할 객체
    const stats = {};

    // 몰드 데이터를 순회하면서 기간 내에 해당하는 몰드의 통계를 계산
    molds.forEach(mold => {
        // 몰드가 'Shipped' 상태이고 count가 1,500,000 이상인지 먼저 확인
        if (mold.status === 'Shipped' && mold.mold_count >= 1500000) {
            // 몰드의 status_date를 Date 객체로 변환하여 기간 내에 있는지 체크
            const moldDate = new Date(mold.status_date);
            if (moldDate >= startDate && moldDate <= endDate) {
                const inspector = mold.inspector; // 검사자 정보

                // 해당 검사자에 대한 통계가 없으면 초기화
                if (!stats[inspector]) {
                    stats[inspector] = 0;
                }

                // 검사자별로 조건에 맞는 몰드를 카운트
                stats[inspector]++;
            }
        }
    });

    return stats;
};