# Export PDF Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "导出 PDF" menu item to WeiMD's export dropdown that captures the styled preview panel and generates an A4-paginated PDF.

**Architecture:** html2canvas captures the preview DOM as a canvas image, then jsPDF slices it into A4 pages. No new dependencies — both packages are already installed in `apps/web/`.

**Tech Stack:** html2canvas v1.4.1, jsPDF v3.0.4, React, Zustand, lucide-react icons

---

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `apps/web/src/services/exportService.ts` | Add `exportPDF` method |
| Modify | `apps/web/src/components/Header/ExportButton.tsx` | Add PDF menu item + handler |
| No change | `apps/web/src/components/Preview/MarkdownPreview.tsx` | Preview DOM accessed via querySelector |

---

### Task 1: Add `exportPDF` method to exportService

**Files:**
- Modify: `apps/web/src/services/exportService.ts`

- [ ] **Step 1: Add imports at the top of the file**

Add these two imports after the existing imports (after line 5):

```typescript
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
```

- [ ] **Step 2: Add the `exportPDF` method to `exportService` object**

Add this method inside the `exportService` object (after the `exportHTML` method, before the closing `}`):

```typescript
    /**
     * 导出为 PDF（截图式）
     */
    async exportPDF(previewElement: HTMLElement, title?: string) {
        try {
            const canvas = await html2canvas(previewElement, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#fff',
                logging: false,
            });

            const imgWidth = 210;
            const pageHeight = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/jpeg', 0.95);

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position -= pageHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            const filename = `${title || 'WeiMD_Export'}_${getTimestamp()}.pdf`;
            pdf.save(filename);
            toast.success('已导出 PDF');
        } catch (error) {
            console.error('Export PDF failed:', error);
            toast.error('导出 PDF 失败');
        }
    },
```

- [ ] **Step 3: Verify the file compiles**

Run: `cd /Users/gudong/code/workpace/WeiMD && pnpm --filter @wemd/web build`
Expected: Build succeeds with no TypeScript errors related to exportService.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/services/exportService.ts
git commit -m "feat: add exportPDF method to exportService using html2canvas + jsPDF"
```

---

### Task 2: Add "导出 PDF" menu item to ExportButton

**Files:**
- Modify: `apps/web/src/components/Header/ExportButton.tsx`

- [ ] **Step 1: Add `FileText` icon import**

Change line 2 from:

```typescript
import { Send, ChevronDown, FileDown } from 'lucide-react';
```

to:

```typescript
import { Send, ChevronDown, FileDown, FileText } from 'lucide-react';
```

- [ ] **Step 2: Add the `handleExportPDF` handler function**

Add this function after the `handleExportMD` function (after line 29):

```typescript
    const handleExportPDF = async () => {
        const previewContent = document.querySelector('.preview-content');
        if (!previewContent) {
            toast.error('预览内容未找到');
            return;
        }
        setIsOpen(false);
        await exportService.exportPDF(previewContent as HTMLElement, title);
    };
```

Note: We need to import `toast` for the error case. Add at the top of the file (after the existing imports):

```typescript
import toast from 'react-hot-toast';
```

- [ ] **Step 3: Add the menu item button in the dropdown**

In the JSX, after the existing "导出 Markdown" button (after line 51), add:

```tsx
                    <button className="export-menu-item" onClick={handleExportPDF}>
                        <FileText size={16} />
                        <span>导出 PDF</span>
                    </button>
```

- [ ] **Step 4: Verify the app runs**

Run: `cd /Users/gudong/code/workpace/WeiMD && pnpm dev:web`
Expected: Dev server starts, no compilation errors. Open browser, check that the export dropdown shows both "导出 Markdown" and "导出 PDF" items.

- [ ] **Step 5: Manual test — export a PDF**

In the browser:
1. Write some markdown content in the editor
2. Click the export dropdown arrow
3. Click "导出 PDF"
4. Verify a PDF file downloads with the correct filename pattern
5. Open the PDF and verify it contains the styled preview content

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/components/Header/ExportButton.tsx
git commit -m "feat: add '导出 PDF' menu item to export dropdown"
```
