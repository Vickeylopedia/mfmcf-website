import { useEffect } from "react";

const SITE_TITLE_SUFFIX = "MFMCF FUNAAB";

/**
 * Updates document.title on mount or when title changes,
 * restoring the default site title on unmount if requested.
 */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    const previousTitle = document.title;
    if (title) {
      document.title = `${title} — ${SITE_TITLE_SUFFIX}`;
    } else {
      document.title = `${SITE_TITLE_SUFFIX} — Family of Love`;
    }
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}
