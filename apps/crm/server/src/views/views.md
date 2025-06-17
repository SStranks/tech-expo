# 📁 Folder: `views/`

## 📌 Purpose

Contains server-rendered templates (e.g. emails, PDFs, or SSR pages). Often used with template engines like EJS, Handlebars, or MJML.

## 📐 Scope

- Email templates
- PDF layouts
- SSR HTML (if any)

## 🔗 Dependencies

- `mjml`, `handlebars`, `ejs`, etc.

## 📄 Example Files

| File           | Description             |
| -------------- | ----------------------- |
| `welcome.mjml` | New user email template |
| `invoice.html` | PDF invoice HTML layout |

## 🧠 Common Patterns

- Separate data-binding from layout
- Keep templates minimal; push logic to services
