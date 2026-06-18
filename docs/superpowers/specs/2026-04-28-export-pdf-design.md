# Export PDF Feature Design

## Summary

Add "导出 PDF" to the existing export dropdown menu in WeiMD. Uses html2canvas + jsPDF (both already installed) to capture the styled preview panel and generate an A4-paginated PDF.

## Requirements

- Content source: the rendered preview area (right panel), WYSIWYG
- PDF quality: screenshot-based (image PDF), quick and reliable
- Page layout: A4 pagination (210mm x 297mm)
- UI entry point: new menu item in the existing ExportButton dropdown

## Architecture

### Data Flow

```
User clicks "导出 PDF"
  → handleExportPDF()
    → Get preview DOM element (.preview-content > div[ref=previewRef])
    → html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#fff' })
    → Calculate A4 page slices from canvas height
    → jsPDF: add each slice as image per page
    → pdf.save(`${title}_${timestamp}.pdf`)
    → toast success/error
```

### File Changes

**1. `apps/web/src/services/exportService.ts`** — Add `exportPDF` method

```typescript
async exportPDF(previewElement: HTMLElement, title?: string) {
    // 1. html2canvas capture
    const canvas = await html2canvas(previewElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#fff',
    });

    // 2. A4 dimensions in jsPDF units (mm)
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // 3. Create PDF and add pages
    const pdf = new jsPDF('p', 'mm', 'a4');
    let heightLeft = imgHeight;
    let position = 0;
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
    }

    // 4. Save
    pdf.save(`${title || 'WeiMD_Export'}_${getTimestamp()}.pdf`);
}
```

**2. `apps/web/src/components/Header/ExportButton.tsx`** — Add menu item

- Import `FileText` icon from lucide-react
- Add ref/callback to access the preview DOM element
- Add `<button>` in the dropdown menu calling `exportService.exportPDF()`

**3. Preview element access** — The preview content is rendered in `MarkdownPreview.tsx` with a `previewRef`. Need a way to expose this ref or query it from ExportButton. Options:
  - Use `document.querySelector('.preview-content > div')` (simple, no ref forwarding needed)
  - Forward ref from MarkdownPreview via React context or store
  - Recommended: querySelector approach, keeps changes minimal

### Key Implementation Details

- **Scale factor**: `scale: 2` ensures retina-quality capture
- **CORS**: `useCORS: true` for external images (user-uploaded)
- **Image format**: JPEG at 0.95 quality to keep file size reasonable
- **Page slicing**: Uses negative Y offset technique — adds full image at offset position on each page, so each page shows a different slice of the content
- **Filename**: `${title}_${YYYYMMDD_HHMM}.pdf`, same pattern as existing exports

### Error Handling

- html2canvas failure: catch and show `toast.error('导出 PDF 失败')`
- Empty preview: check if element has content before proceeding

### Dependencies

No new dependencies required. Both `html2canvas` (v1.4.1) and `jspdf` (v3.0.4) are already in `apps/web/package.json`.

## Out of Scope

- Vector/text-selectable PDF (future enhancement)
- Custom page size selection
- PDF metadata (author, title fields)
- Print-style pagination (breaking at paragraph boundaries)
- Loading indicator during generation (can add later if needed)
