# Animated Syntax Highlighting Extension

## Overview

This VS Code extension provides animated syntax highlighting with glowing effects, color transitions, and wavy underlines for specific keywords in your code.

## Features

- ✨ **Animated Color Transitions**: Keywords cycle through different colors
- 🌟 **Glow Effects**: Text shadow creates a glowing appearance
- 🌊 **Wavy Underlines**: Decorative wavy borders under keywords
- ⚡ **Real-time Updates**: Automatically updates as you type
- 🎯 **Customizable**: Easy to modify keywords, colors, and animation speed
- 🔄 **Toggle Support**: Turn the feature on/off as needed

## Default Keywords

The extension highlights these keywords by default:
- `function`
- `const`
- `let` 
- `var`
- `class`
- `interface`
- `type`
- `import`
- `export`
- `return`

## Available Commands

Access these commands via the Command Palette (Ctrl+Shift+P / Cmd+Shift+P):

1. **Animated Syntax: Show Demo** - Opens a sample file to see the animation in action
2. **Animated Syntax: Toggle Animated Syntax Highlighting** - Enable/disable the feature
3. **Animated Syntax: Customize Keywords** - Change which keywords are highlighted
4. **Animated Syntax: Adjust Animation Speed** - Modify how fast colors transition

## How to Test the Extension

### Method 1: Using F5 (Extension Development Host)

1. Open your extension project in VS Code
2. Press `F5` to launch the Extension Development Host
3. In the new VS Code window, run the command: **"Animated Syntax: Show Demo"**
4. Watch the keywords get highlighted with animated colors!

### Method 2: Open Any Code File

1. In the Extension Development Host window, open any TypeScript, JavaScript, or other code file
2. The animation will automatically start highlighting the configured keywords
3. Try typing new keywords to see real-time updates

## Customization

### Changing Keywords

1. Run command: **"Animated Syntax: Customize Keywords"**
2. Enter comma-separated keywords (e.g., "if, else, while, for")
3. Keywords will update immediately

### Adjusting Animation Speed

1. Run command: **"Animated Syntax: Adjust Animation Speed"**
2. Enter speed in milliseconds (lower = faster)
   - Fast: 500ms
   - Normal: 1000ms (default)
   - Slow: 2000ms

### Modifying Colors and Effects (Code Level)

Edit the `DEFAULT_CONFIG` object in `extension.ts`:

```typescript
const DEFAULT_CONFIG: AnimationConfig = {
    keywords: ['your', 'custom', 'keywords'],
    colors: ['#ff6b6b', '#4ecdc4', '#45b7d1'], // Add your colors
    animationSpeed: 1000, // Milliseconds
    glowEffect: true,     // Enable/disable glow
    wavyUnderline: true,  // Enable/disable wavy underlines
    blinkEffect: false    // Enable/disable random blinking
};
```

## Code Architecture

### Main Components

1. **AnimatedSyntaxHighlighter Class**: Core logic for managing decorations and animations
2. **AnimationConfig Interface**: Type-safe configuration structure
3. **Event Listeners**: Handle text changes and editor switches
4. **Decoration Types**: VS Code TextEditorDecorationType for styling

### Key Methods

- `updateDecorations()`: Finds keywords and applies styling
- `createDecorationTypes()`: Sets up CSS-like styling rules
- `startAnimation()`: Manages color cycling timer
- `setupEventListeners()`: Handles VS Code events

## Technical Details

- Uses VS Code's `TextEditorDecorationType` API for styling
- Regex pattern matching for whole-word keyword detection
- Timer-based animation with configurable intervals
- Event-driven updates for real-time responsiveness
- Proper resource cleanup on deactivation

## Troubleshooting

### Extension Not Working?
1. Check the VS Code console for errors (Help > Toggle Developer Tools)
2. Ensure the extension compiled successfully (`npm run compile`)
3. Try reloading the Extension Development Host window

### Performance Issues?
1. Reduce animation speed (increase milliseconds)
2. Reduce the number of keywords
3. Disable some effects (glow, wavy underlines, etc.)

### Keywords Not Highlighting?
1. Ensure the file type is supported (TypeScript, JavaScript, etc.)
2. Check that keywords are spelled correctly
3. Verify the extension is active (check status bar or console)

## Contributing

Feel free to modify the code to add new features:
- Additional animation effects
- Theme integration
- Language-specific keyword sets
- User settings persistence
- Performance optimizations

Happy coding with animated syntax highlighting! ✨
