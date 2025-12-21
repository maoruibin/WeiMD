I will implement the "Footer Template" feature and remove the "Insert Name Card" feature as requested.

### 1. Clean up "Insert Name Card" feature
- **Remove Files**: Delete `apps/web/src/components/WechatProfile/` directory (including Modal, CSS, and Element definition).
- **Update Header**: In `apps/web/src/components/Header/Header.tsx`, remove `WechatProfileModal` import, state, and menu item.
- **Update Main**: In `apps/web/src/main.tsx`, remove the import of `WechatProfileElement`.

### 2. Implement "Footer Template" feature
- **Create Component**: Create `apps/web/src/components/FooterTemplate/FooterTemplateModal.tsx` and its CSS file.
  - **Features**:
    - Template selection (3 styles: Default Centered, Card Style, Contact/QR Style).
    - Input fields (Title, Tags, Content) that update based on selection.
    - Real-time preview of the HTML.
    - Save configuration to `localStorage` for persistence.
  - **Templates**:
    - **Default**: Centered title, tags with separators, divider line, and content (matches your screenshot).
    - **Card**: A clean box with background color and border.
    - **Simple**: Minimalist layout for simple signatures.
- **Update Toolbar**: In `apps/web/src/components/Editor/Toolbar.tsx`:
  - Add a "Footer Template" button (using `PanelBottom` icon).
  - Integrate `FooterTemplateModal`.
  - On confirmation, insert the generated HTML into the editor using the existing `onInsert` prop.

### 3. Execution Order
1.  Remove old Wechat Profile files and references.
2.  Create the new `FooterTemplateModal` component and styles.
3.  Modify `Toolbar.tsx` to add the new button and connect the modal.
