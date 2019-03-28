---
title: "Sublime And VSCode Configuration"
date: "2017-08-24"
category: "dev"
emoji: "🍇"
---

### Sublime Setting-User

```json
{
  "always_show_minimap_viewport": true,
  "bold_folder_labels": true,
  "color_scheme": "Packages/User/SublimeLinter/Dracula (SL).tmTheme",
  "font_face": "Source Code Pro",
  "font_options":
  [
    "gray_antialias"
  ],
  "font_size": 17,
  "ignored_packages":
  [
    "JSLint",
    "Vintage"
  ],
  "indent_guide_options":
  [
    "draw_normal",
    "draw_active"
  ],
  "line_padding_bottom": 2,
  "line_padding_top": 2,
  "overlay_scroll_bars": "enabled",
  "tab_size": 4,
  "theme": "Default.sublime-theme",
  "translate_tabs_to_spaces": true
}
```

### Sublime Package Control settings

```json
{
  "bootstrapped": true,
  "in_process_packages":
  [
  ],
  "installed_packages":
  [
    "A File Icon",
    "AutoFileName",
    "Babel",
    "Boxy Theme",
    "Colorsublime",
    "CSS3",
    "Dracula Color Scheme",
    "Emmet",
    "ESLint",
    "JSLint",
    "Material Theme",
    "Package Control",
    "React ES6 Snippets",
    "SublimeCodeIntel",
    "SublimeLinter",
    "SublimeLinter-jsxhint",
    "SublimeLinter-pylint",
    "Theme - Delta",
    "TrailingSpaces",
    "TypeScript"
  ]
}
```

### Sublime Python3 Build System

```json
{
    "cmd": ["python3", "-u", "$file"],
    "file_regex": "^[ ]File \"(...?)\", line ([0-9]*)",
    "selector": "source.python"
}
```

### VSCode

```json
{
    "editor.fontFamily": "Source Code Pro, Fira Code, Menlo, Monaco, 'Courier New', monospace",
    "editor.lineHeight": 20,
    "editor.tabSize": 2,
    "workbench.startupEditor": "newUntitledFile",
    "editor.fontSize": 16,
    "terminal.integrated.fontSize": 14,
    "workbench.editor.enablePreviewFromQuickOpen": false,
    "editor.fontWeight": "300",
    "workbench.colorTheme": "Dracula",
    "git.autofetch": true,
    "gitlens.keymap": "alternate",
    "gitlens.advanced.messages": {
        "suppressCommitHasNoPreviousCommitWarning": false,
        "suppressCommitNotFoundWarning": false,
        "suppressFileNotUnderSourceControlWarning": false,
        "suppressGitVersionWarning": false,
        "suppressLineUncommittedWarning": false,
        "suppressNoRepositoryWarning": false,
        "suppressResultsExplorerNotice": false,
        "suppressShowKeyBindingsNotice": true
    },
    "workbench.iconTheme": "vscode-icons",
    "gitlens.historyExplorer.enabled": true,
    "javascript.updateImportsOnFileMove.enabled": "always", // close annoying
    "typescript.updateImportsOnFileMove.enabled": "always", // close annoying
    "gitlens.showWhatsNewAfterUpgrades": false, // close annoying
    "javascript.suggest.autoImports": false, // close annoying
    "typescript.suggest.autoImports": false, // close annoying
    "workbench.activityBar.visible": false,
    "workbench.sideBar.location": "left",
    "workbench.statusBar.visible": true,
    "editor.minimap.enabled": true,
    "editor.renderWhitespace": "all",
    "editor.renderControlCharacters": false,
    "breadcrumbs.enabled": false,
    "editor.parameterHints.enabled": false, // disable pop-up parameter hints that show documentation and/or type information as you type
    "workbench.colorCustomizations": {
        "titleBar.activeBackground": "#B2B3B3",
        "titleBar.activeForeground":"#000000",
    }
}
```

### VSCode key-binding (user)

```json
// Place your key bindings in this file to overwrite the defaults
[
  { "key": "cmd+1","command": "workbench.action.openEditorAtIndex1" },
  { "key": "cmd+2","command": "workbench.action.openEditorAtIndex2" },
  { "key": "cmd+3","command": "workbench.action.openEditorAtIndex3" },
  { "key": "cmd+4","command": "workbench.action.openEditorAtIndex4" },
  { "key": "cmd+5","command": "workbench.action.openEditorAtIndex5" },
  { "key": "cmd+6","command": "workbench.action.openEditorAtIndex6" },
  { "key": "cmd+7","command": "workbench.action.openEditorAtIndex7" },
  { "key": "cmd+8","command": "workbench.action.openEditorAtIndex8" },
  { "key": "cmd+9","command": "workbench.action.openEditorAtIndex9" }
]
```

