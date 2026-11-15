"use client";
/**
 * Marker function for i18next-parser to find strings in data files.
 * Returns defaultValue if provided, otherwise returns key.
 */
export const t = (key: string, defaultValue?: string) => defaultValue || key;
