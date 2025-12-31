I will implement Markdown link support for the Footer Template content and subtitle/tags, AND make the modal a global, larger overlay.

**Plan:**

1.  **Enhance Modal Styling (Global & Larger)**:
    -   Modify `FooterTemplateModal.css`.
    -   Increase `z-index` for `.footer-template-modal-overlay` to ensure it sits on top of everything (e.g., `z-index: 9999`).
    -   Adjust `.footer-template-modal` size:
        -   Increase width to `90vw` (viewport width) or `1000px` max-width.
        -   Increase height to `90vh` (viewport height).
    -   Ensure it is centered and properly overlaying the entire application, not just the editor area.

2.  **Enhance `escapeHtml` Logic for Markdown Links**:
    -   Modify `FooterTemplateModal.tsx`.
    -   Update `escapeHtml` (or rename to `processText`) to handle Markdown links (`[text](url)`).
    -   It should first escape special HTML characters (to prevent XSS), *then* replace Markdown link patterns with `<a href="...">...</a>` tags.
    -   The regex for Markdown links will be used to transform `[text](url)` into `<a href="url" style="...">text</a>`.

3.  **Update `generateHtml`**:
    -   Apply this new link processing to both `tags` (subtitle) and `content` (body text).
    -   The `title` field will remain plain text (or escaped HTML).

4.  **Add User Tip**:
    -   Add a small hint/tip in the UI (e.g., under the textarea or label) explaining that Markdown links are supported.
    -   Example text: "支持 Markdown 链接格式：[链接文字](URL)"

5.  **Verify Rendering**:
    -   Ensure the generated HTML structure (including the new `<a>` tags) is valid and renders correctly in the preview window.
    -   Verify that existing functionality (plain text, line breaks) is preserved.
    -   Verify the modal now covers the entire screen as requested.

This will provide a better user experience with a larger workspace and allow users to insert clickable links in their footer templates.