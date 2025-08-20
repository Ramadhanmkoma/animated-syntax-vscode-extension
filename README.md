# Animated Syntax Highlighting

A VS Code extension that brings your code to life with beautiful animated syntax highlighting, featuring glowing effects, color transitions, and wavy underlines for specific keywords.

## Features

- **Animated Color Transitions**: Keywords cycle through vibrant colors with smooth transitions
- **Glow Effects**: Beautiful text shadow creates a glowing appearance around keywords
- **Wavy Underlines**: Decorative wavy borders under highlighted keywords
- **Real-time Updates**: Automatically updates decorations as you type or switch files
- **Language-Specific Keywords**: Automatically detects language and highlights relevant keywords
- **Fade & Pulse Effects**: Additional visual effects for enhanced animation
- **Performance Optimized**: Smart handling of large files and efficient rendering
- **Highly Customizable**: Easy configuration of keywords, colors, and animation speed
- **Toggle Support**: Turn features on/off individually as needed

## Default Keywords

The extension now supports language-specific keywords:

**TypeScript/JavaScript**: `function`, `const`, `let`, `var`, `class`, `interface`, `async`, `await`
**Python**: `def`, `class`, `import`, `from`, `return`, `async`, `with`, `try`
**Java**: `public`, `private`, `class`, `interface`, `return`, `import`
**C#**: `public`, `private`, `class`, `namespace`, `using`, `async`
**Go**: `func`, `package`, `import`, `type`, `struct`
**Rust**: `fn`, `struct`, `enum`, `impl`, `trait`, `use`

## Commands

Access these commands via the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

- **Animated Syntax: Show Demo** - Opens a sample file to see the animation in action
- **Animated Syntax: Toggle** - Enable/disable the animated highlighting
- **Animated Syntax: Customize Keywords** - Change which keywords are highlighted
- **Animated Syntax: Adjust Animation Speed** - Modify animation timing
- **Animated Syntax: Toggle Language-Specific Keywords** - Switch between language-specific and custom keywords
- **Animated Syntax: Toggle Visual Effects** - Enable/disable individual effects (glow, wavy, blink, fade, pulse)

## Usage

1. Install the extension
2. Open any code file (TypeScript, JavaScript, etc.)
3. Watch keywords get highlighted with animated colors automatically!
4. Use commands to customize the experience

## Requirements

- VS Code 1.103.0 or higher
- No additional dependencies required

## Extension Settings

This extension contributes settings through commands:

- Customizable keyword list
- Adjustable animation speed
- Toggle animation on/off

## Customization

You can easily customize the extension by:

- Using the "Customize Keywords" command to change highlighted words
- Adjusting animation speed with the "Adjust Animation Speed" command
- Modifying the source code for advanced customization (colors, effects, etc.)

## Release Notes

### 0.0.1

**New Features:**
- Language-specific keyword detection (TypeScript, JavaScript, Python, Java, C#, Go, Rust, C++)
- Enhanced visual effects: fade and pulse animations
- Performance optimizations for large files
- Individual effect toggles (glow, wavy underlines, blink, fade, pulse)
- Improved glow effects with multiple text shadows
- Background glow for enhanced visibility

**New Commands:**
- Toggle Language-Specific Keywords
- Toggle Visual Effects (with quick pick menu)

### 0.0.1

Initial release of Animated Syntax Highlighting:

- Animated color transitions for keywords
- Glow and wavy underline effects
- Real-time text change detection
- Customizable keywords and animation speed
- Demo command with sample code

---

**Enjoy coding with beautiful animated syntax highlighting!**

**Enjoy!**
