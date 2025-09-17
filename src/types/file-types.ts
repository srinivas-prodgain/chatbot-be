export const allowed_file_types = ['pdf', 'txt', 'docx', 'md'] as const;
export type TAllowedFileTypes = (typeof allowed_file_types)[number];

export const ALLOWED_FILE_EXTENSIONS: Record<TAllowedFileTypes, string[]> = {
    pdf: ['.pdf'],
    txt: ['.txt'],
    docx: ['.docx'],
    md: ['.md', '.markdown']
};
export const MAX_FILE_SIZE = 10 * 1024 * 1024;