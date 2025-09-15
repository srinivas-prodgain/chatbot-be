type TPaginationQParams = {
    page?: string;
    limit?: string;
};
type TPaginationResponse = {
    page: number;
    limit: number;
    total_pages: number;
    total_count: number;
};

export type { TPaginationQParams, TPaginationResponse };
