// ... 기존 import 구문 ...

function MoldEdit() {
    // ... 기존 상태 변수 선언 ...

    const handleSubmit = async (e) => {
        e.preventDefault();
        const now = new Date().toISOString(); // UTC 형식의 날짜 및 시간 문자열
        const { error } = await supabase
            .from('molds')
            .update({
                mold_id: moldId,
                status: status,
                status_date: now, // 현재 날짜 및 시간으로 업데이트
                inspection_status: inspectionStatus,
                inspector: inspector,
                mold_count: moldCount,
                unit_id: unitId,
            })
            .eq('id', id);
        if (error) {
            console.error(t('Failed to update mold:'), error);
        } else {
            navigate('/mold-list');
        }
    };

    // ... 나머지 함수 및 return 구문 ...
}

export default MoldEdit;