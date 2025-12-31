I will perform the following actions to address your requests:

1.  **Change Default Theme to Geek Orange**:
    -   Modify `apps/web/src/store/themes/builtInThemes.ts`.
    -   Update the `default` theme (ID: `default`) to use `geekOrangeTheme` instead of `customDefaultTheme`.
    -   Remove the unused `customDefaultTheme` import.
    -   This will effectively replace the original "Green" default theme with "Geek Orange" for all users using the default theme.

2.  **Fix Footer Template Rendering**:
    -   Modify `apps/web/src/components/FooterTemplate/FooterTemplateModal.tsx`.
    -   Update the `generateHtml` function to optimize the HTML string format.
    -   **Add leading newlines (`\n\n`)**: Ensure the inserted HTML is separated from previous content so Markdown parsers recognize it as a block.
    -   **Remove internal indentation**: Strip the 4-space indentation inside the HTML template strings to prevent them from being accidentally parsed as Code Blocks.
    -   **Clean up structure**: Ensure the HTML string is compact and valid.

This will ensure that when you insert a footer template, it renders correctly as a styled HTML block in the preview.