const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let supabaseQuery = supabase.from('molds').select('*');
    const searchPatternParts = [];

    if (moldIdPrefix1) {
        searchPatternParts.push(moldIdPrefix1);
    }
    if (moldIdSuffix) {
        searchPatternParts.push(moldIdSuffix);
    }
    const searchPattern = searchPatternParts.join('-');

    if (searchPattern) {
        // 정확히 해당 패턴으로 시작하는 mold_id 검색 (대소문자 구분 없이)
        supabaseQuery = supabaseQuery.ilike('mold_id', `${searchPattern}%`);
    }

    const query = {};
    if (status) query.status = status;
    if (inspector) query.inspector = inspector;
    if (inspectionStatus) query.inspection_status = inspectionStatus;
    if (unitId) query.unit_id = unitId;

    supabaseQuery = supabaseQuery.match(
        Object.keys(query).reduce((obj, key) => {
            if (key !== 'mold_id' && key !== 'status_date' && query[key] !== null && query[key] !== undefined && query[key] !== '') {
                obj[key] = query[key];
            }
            return obj;
        }, {})
    );

    if (startDate && endDate) {
        supabaseQuery = supabaseQuery
            .gte('status_date', `${startDate}T00:00:00Z`)
            .lte('status_date', `${endDate}T23:59:59Z`);
    }

    if (moldCount && moldCountOperator) {
        switch (moldCountOperator) {
            case 'eq':
                supabaseQuery = supabaseQuery.eq('mold_count', moldCount);
                break;
            case 'gt':
                supabaseQuery = supabaseQuery.gt('mold_count', moldCount);
                break;
            case 'lt':
                supabaseQuery = supabaseQuery.lt('mold_count', moldCount);
                break;
            case 'gte':
                supabaseQuery = supabaseQuery.gte('mold_count', moldCount);
                break;
            case 'lte':
                supabaseQuery = supabaseQuery.lte('mold_count', moldCount);
                break;
            default:
                break;
        }
    } else if (moldCount && !moldCountOperator) {
        supabaseQuery = supabaseQuery.eq('mold_count', moldCount);
    }

    try {
        const {data: fetchedData, error: fetchError} = await supabaseQuery;

        if (fetchError) throw fetchError;

        const sortedResults = [...fetchedData].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        setSearchResults(sortedResults);

    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};
