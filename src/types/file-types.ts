export const allowedFileTypes = ['pdf', 'txt', 'docx', 'md'] as const;
export type TAllowedFileTypes = (typeof allowedFileTypes)[number];

export const ALLOWED_FILE_EXTENSIONS: Record<TAllowedFileTypes, string[]> = {
    pdf: ['.pdf'],
    txt: ['.txt'],
    docx: ['.docx'],
    md: ['.md', '.markdown']
};
export const MAX_FILE_SIZE = 10 * 1024 * 1024;