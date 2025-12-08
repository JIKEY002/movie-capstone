export const buildQuery = (query) => {
    let { page, pageSize, filters } = query;

    // xử lý filter
    filters = JSON.parse(filters || '{}') || {};

    for (const [key, value] of Object.entries(filters)) {
        // string
        if (typeof value === 'string') {
            filters[key] = {
                contains: value,
            };
        }

        // date (date)
    }

    // chức năng của hàm max là lấy số lớn nhất
    const pageDefault = 1;
    const pageSizeDefault = 3;
    page = Math.max(pageDefault, Number(page) || pageDefault);
    pageSize = Math.max(pageSizeDefault, Number(pageSize) || pageSizeDefault);

    // (page - 1) * pageSize
    const index = (page - 1) * pageSize;

    return { page, pageSize, filters, index };
};
