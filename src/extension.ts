// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// Configuration interface for customizable settings
interface AnimationConfig {
	keywords: string[];
	colors: string[];
	animationSpeed: number; // Animation interval in milliseconds
	glowEffect: boolean;
	wavyUnderline: boolean;
	blinkEffect: boolean;
	languageSpecific: boolean; // NEW: Enable language-specific keywords
	fadeEffect: boolean; // NEW: Add fade in/out effect
	pulseEffect: boolean; // NEW: Add pulse effect
}

// Language-specific keywords - NEW FEATURE
const LANGUAGE_KEYWORDS: { [key: string]: string[] } = {
	typescript: ['function', 'const', 'let', 'var', 'class', 'interface', 'type', 'import', 'export', 'return', 'async', 'await'],
	javascript: ['function', 'const', 'let', 'var', 'class', 'import', 'export', 'return', 'async', 'await'],
	python: ['def', 'class', 'import', 'from', 'return', 'async', 'await', 'with', 'try', 'except'],
	java: ['public', 'private', 'protected', 'class', 'interface', 'return', 'import', 'package'],
	csharp: ['public', 'private', 'protected', 'class', 'interface', 'namespace', 'using', 'return', 'async', 'await'],
	cpp: ['class', 'namespace', 'return', 'include', 'using', 'public', 'private', 'protected'],
	go: ['func', 'package', 'import', 'return', 'type', 'struct', 'interface'],
	rust: ['fn', 'struct', 'enum', 'impl', 'trait', 'use', 'return', 'pub'],
	default: ['function', 'const', 'let', 'var', 'class', 'interface', 'type', 'import', 'export', 'return']
};

// Default configuration - easily customizable with NEW features
const DEFAULT_CONFIG: AnimationConfig = {
	keywords: ['function', 'const', 'let', 'var', 'class', 'interface', 'type', 'import', 'export', 'return'],
	colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#a55eea', '#26de81'],
	animationSpeed: 1000, // 1 second intervals
	glowEffect: true,
	wavyUnderline: true,
	blinkEffect: false,
	languageSpecific: true, // NEW: Enable by default
	fadeEffect: true, // NEW: Enable fade effect
	pulseEffect: false // NEW: Pulse effect (can be CPU intensive)
};

// Class to manage animated syntax highlighting
class AnimatedSyntaxHighlighter {
	private decorationTypes: Map<string, vscode.TextEditorDecorationType> = new Map();
	private animationTimer: NodeJS.Timeout | undefined;
	private currentColorIndex = 0;
	private config: AnimationConfig;
	private disposables: vscode.Disposable[] = [];

	constructor(config: AnimationConfig = DEFAULT_CONFIG) {
		this.config = config;
		this.createDecorationTypes();
		this.startAnimation();
		this.setupEventListeners();
	}

	/**
	 * Creates decoration types for each animation style
	 * This defines how the highlighting will look - ENHANCED with new effects
	 */
	private createDecorationTypes(): void {
		// Clear existing decoration types
		this.decorationTypes.forEach(decoration => decoration.dispose());
		this.decorationTypes.clear();

		this.config.colors.forEach((color, index) => {
			// Calculate opacity for fade effect
			const opacity = this.config.fadeEffect 
				? Math.sin((Date.now() / this.config.animationSpeed) + index) * 0.3 + 0.7 
				: 1;

			// Calculate scale for pulse effect
			const scale = this.config.pulseEffect 
				? Math.sin((Date.now() / (this.config.animationSpeed * 0.5)) + index) * 0.1 + 1 
				: 1;

			const decorationType = vscode.window.createTextEditorDecorationType({
				// Base styling for the highlighted text
				color: color,
				fontWeight: 'bold',
				opacity: opacity.toString(),
				
				// Enhanced glow effect with multiple shadows
				textDecoration: this.config.glowEffect 
					? `none; text-shadow: 0 0 8px ${color}, 0 0 12px ${color}, 0 0 16px ${color}` 
					: 'none',
				
				// Wavy underline effect with enhanced styling
				border: this.config.wavyUnderline 
					? `2px wavy ${color}` 
					: undefined,
				borderStyle: this.config.wavyUnderline ? 'wavy' : undefined,
				borderColor: this.config.wavyUnderline ? color : undefined,
				
				// Enhanced CSS for additional effects
				after: {
					contentText: '',
					border: this.config.wavyUnderline ? `1px solid ${color}` : undefined,
				},

				// NEW: Add subtle background glow
				backgroundColor: this.config.glowEffect 
					? `${color}15` // 15 is hex for very low opacity
					: undefined,
			});

			this.decorationTypes.set(`style-${index}`, decorationType);
		});

		// Enhanced blinking decoration type
		if (this.config.blinkEffect) {
			const blinkDecoration = vscode.window.createTextEditorDecorationType({
				textDecoration: 'none',
				opacity: '0.2',
				backgroundColor: '#ffffff10'
			});
			this.decorationTypes.set('blink', blinkDecoration);
		}
	}

	/**
	 * Sets up event listeners for text changes and editor switches
	 */
	private setupEventListeners(): void {
		// Listen for text document changes
		const onDidChangeTextDocument = vscode.workspace.onDidChangeTextDocument((event) => {
			const editor = vscode.window.activeTextEditor;
			if (editor && editor.document === event.document) {
				// Debounce the update to avoid excessive calls
				setTimeout(() => this.updateDecorations(editor), 100);
			}
		});

		// Listen for active editor changes
		const onDidChangeActiveTextEditor = vscode.window.onDidChangeActiveTextEditor((editor) => {
			if (editor) {
				this.updateDecorations(editor);
			}
		});

		// Listen for visible editors changes
		const onDidChangeVisibleTextEditors = vscode.window.onDidChangeVisibleTextEditors((editors) => {
			editors.forEach(editor => this.updateDecorations(editor));
		});

		this.disposables.push(onDidChangeTextDocument, onDidChangeActiveTextEditor, onDidChangeVisibleTextEditors);
	}

	/**
	 * Starts the animation timer for color transitions and effects
	 */
	private startAnimation(): void {
		this.animationTimer = setInterval(() => {
			// Cycle through colors for animation effect
			this.currentColorIndex = (this.currentColorIndex + 1) % this.config.colors.length;
			
			// Update decorations for all visible editors
			vscode.window.visibleTextEditors.forEach(editor => {
				this.updateDecorations(editor);
			});
		}, this.config.animationSpeed);
	}

	/**
	 * Updates decorations for the given text editor
	 * ENHANCED with language-specific keyword support and performance optimizations
	 */
	private updateDecorations(editor: vscode.TextEditor): void {
		if (!editor) {
			return;
		}

		const document = editor.document;
		const text = document.getText();

		// Performance optimization: Skip very large files
		if (text.length > 100000) {
			return;
		}

		// Clear all existing decorations
		this.decorationTypes.forEach(decoration => {
			editor.setDecorations(decoration, []);
		});

		// NEW: Get language-specific keywords if enabled
		let keywordsToUse = this.config.keywords;
		if (this.config.languageSpecific) {
			const languageId = document.languageId;
			keywordsToUse = LANGUAGE_KEYWORDS[languageId] || LANGUAGE_KEYWORDS.default;
		}

		// Find all keyword matches in the document
		const keywordRanges: Map<string, vscode.Range[]> = new Map();

		keywordsToUse.forEach(keyword => {
			const ranges: vscode.Range[] = [];
			
			// Create regex to find whole words only (not parts of other words)
			const regex = new RegExp(`\\b${keyword}\\b`, 'g');
			let match;

			while ((match = regex.exec(text)) !== null) {
				const startPos = document.positionAt(match.index);
				const endPos = document.positionAt(match.index + match[0].length);
				ranges.push(new vscode.Range(startPos, endPos));
			}

			if (ranges.length > 0) {
				keywordRanges.set(keyword, ranges);
			}
		});

		// Apply decorations with animated colors
		let keywordIndex = 0;
		keywordRanges.forEach((ranges, keyword) => {
			// Calculate which color to use based on animation cycle
			const colorIndex = (this.currentColorIndex + keywordIndex) % this.config.colors.length;
			const decorationType = this.decorationTypes.get(`style-${colorIndex}`);

			if (decorationType) {
				editor.setDecorations(decorationType, ranges);
			}

			keywordIndex++;
		});

		// Apply blink effect if enabled
		if (this.config.blinkEffect && Math.random() > 0.7) {
			const blinkDecoration = this.decorationTypes.get('blink');
			if (blinkDecoration) {
				// Randomly select some ranges to blink
				const allRanges: vscode.Range[] = [];
				keywordRanges.forEach(ranges => allRanges.push(...ranges));
				const blinkRanges = allRanges.filter(() => Math.random() > 0.8);
				
				editor.setDecorations(blinkDecoration, blinkRanges);
				
				// Remove blink effect after short duration
				setTimeout(() => {
					editor.setDecorations(blinkDecoration, []);
				}, 200);
			}
		}
	}

	/**
	 * Updates the configuration and recreates decoration types
	 */
	public updateConfig(newConfig: Partial<AnimationConfig>): void {
		this.config = { ...this.config, ...newConfig };
		this.createDecorationTypes();
		
		// Restart animation with new speed if changed
		if (newConfig.animationSpeed) {
			this.stopAnimation();
			this.startAnimation();
		}

		// Update all visible editors
		vscode.window.visibleTextEditors.forEach(editor => {
			this.updateDecorations(editor);
		});
	}

	/**
	 * Stops the animation timer
	 */
	private stopAnimation(): void {
		if (this.animationTimer) {
			clearInterval(this.animationTimer);
			this.animationTimer = undefined;
		}
	}

	/**
	 * Disposes of all resources
	 */
	public dispose(): void {
		this.stopAnimation();
		this.decorationTypes.forEach(decoration => decoration.dispose());
		this.decorationTypes.clear();
		this.disposables.forEach(disposable => disposable.dispose());
	}
}

// Global instance of the highlighter
let animatedHighlighter: AnimatedSyntaxHighlighter | undefined;

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	console.log('Animated Syntax Highlighting extension is now active!');

	// Initialize the animated syntax highlighter
	animatedHighlighter = new AnimatedSyntaxHighlighter();

	// Command to toggle the animation on/off
	const toggleCommand = vscode.commands.registerCommand('animated-syntax.toggle', () => {
		if (animatedHighlighter) {
			animatedHighlighter.dispose();
			animatedHighlighter = undefined;
			vscode.window.showInformationMessage('Animated syntax highlighting disabled');
		} else {
			animatedHighlighter = new AnimatedSyntaxHighlighter();
			vscode.window.showInformationMessage('Animated syntax highlighting enabled');
		}
	});

	// Command to customize keywords
	const customizeKeywordsCommand = vscode.commands.registerCommand('animated-syntax.customizeKeywords', async () => {
		if (!animatedHighlighter) {
			vscode.window.showWarningMessage('Animated syntax highlighting is not active');
			return;
		}

		const currentKeywords = DEFAULT_CONFIG.keywords.join(', ');
		const input = await vscode.window.showInputBox({
			prompt: 'Enter keywords to highlight (comma-separated)',
			value: currentKeywords,
			placeHolder: 'function, const, let, var, class...'
		});

		if (input) {
			const keywords = input.split(',').map(k => k.trim()).filter(k => k.length > 0);
			animatedHighlighter.updateConfig({ keywords });
			vscode.window.showInformationMessage(`Updated keywords: ${keywords.join(', ')}`);
		}
	});

	// Command to adjust animation speed
	const adjustSpeedCommand = vscode.commands.registerCommand('animated-syntax.adjustSpeed', async () => {
		if (!animatedHighlighter) {
			vscode.window.showWarningMessage('Animated syntax highlighting is not active');
			return;
		}

		const input = await vscode.window.showInputBox({
			prompt: 'Enter animation speed in milliseconds (lower = faster)',
			value: DEFAULT_CONFIG.animationSpeed.toString(),
			placeHolder: '1000'
		});

		if (input) {
			const speed = parseInt(input);
			if (!isNaN(speed) && speed > 0) {
				animatedHighlighter.updateConfig({ animationSpeed: speed });
				vscode.window.showInformationMessage(`Animation speed set to ${speed}ms`);
			} else {
				vscode.window.showErrorMessage('Please enter a valid positive number');
			}
		}
	});

	// Command to show demo
	const showDemoCommand = vscode.commands.registerCommand('animated-syntax.demo', async () => {
		// Create a new untitled document with sample code
		const sampleCode = `// Animated Syntax Highlighting Demo
function greetUser(name: string): string {
    const greeting = "Hello";
    let message = greeting + ", " + name + "!";
    var timeStamp = new Date();
    
    return message;
}

class User {
    constructor(public name: string) {}
    
    greet(): void {
        const message = greetUser(this.name);
        console.log(message);
    }
}

interface UserInterface {
    name: string;
    greet(): void;
}

export { User, UserInterface };
import { User } from './user';

// Watch the keywords get highlighted with animated colors!
const user = new User("Developer");
user.greet();`;

		const document = await vscode.workspace.openTextDocument({
			content: sampleCode,
			language: 'typescript'
		});
		
		await vscode.window.showTextDocument(document);
		vscode.window.showInformationMessage('Demo loaded! Watch the animated keyword highlighting!');
	});

	// NEW: Command to toggle language-specific keywords
	const toggleLanguageSpecificCommand = vscode.commands.registerCommand('animated-syntax.toggleLanguageSpecific', async () => {
		if (!animatedHighlighter) {
			vscode.window.showWarningMessage('Animated syntax highlighting is not active');
			return;
		}

		const currentState = DEFAULT_CONFIG.languageSpecific;
		const newState = !currentState;
		animatedHighlighter.updateConfig({ languageSpecific: newState });
		
		const status = newState ? 'enabled' : 'disabled';
		vscode.window.showInformationMessage(`Language-specific keywords ${status}`);
	});

	// NEW: Command to toggle effects
	const toggleEffectsCommand = vscode.commands.registerCommand('animated-syntax.toggleEffects', async () => {
		if (!animatedHighlighter) {
			vscode.window.showWarningMessage('Animated syntax highlighting is not active');
			return;
		}

		const options = [
			{ label: 'Toggle Glow Effect', value: 'glow' },
			{ label: 'Toggle Wavy Underline', value: 'wavy' },
			{ label: 'Toggle Blink Effect', value: 'blink' },
			{ label: 'Toggle Fade Effect', value: 'fade' },
			{ label: 'Toggle Pulse Effect', value: 'pulse' }
		];

		const selected = await vscode.window.showQuickPick(options, {
			placeHolder: 'Select effect to toggle'
		});

		if (selected) {
			switch (selected.value) {
				case 'glow':
					animatedHighlighter.updateConfig({ glowEffect: !DEFAULT_CONFIG.glowEffect });
					break;
				case 'wavy':
					animatedHighlighter.updateConfig({ wavyUnderline: !DEFAULT_CONFIG.wavyUnderline });
					break;
				case 'blink':
					animatedHighlighter.updateConfig({ blinkEffect: !DEFAULT_CONFIG.blinkEffect });
					break;
				case 'fade':
					animatedHighlighter.updateConfig({ fadeEffect: !DEFAULT_CONFIG.fadeEffect });
					break;
				case 'pulse':
					animatedHighlighter.updateConfig({ pulseEffect: !DEFAULT_CONFIG.pulseEffect });
					break;
			}
			vscode.window.showInformationMessage(`${selected.label} toggled!`);
		}
	});

	// Add commands to context subscriptions for proper cleanup
	context.subscriptions.push(
		toggleCommand,
		customizeKeywordsCommand,
		adjustSpeedCommand,
		showDemoCommand,
		toggleLanguageSpecificCommand,
		toggleEffectsCommand
	);

	// Trigger initial decoration for any open editors
	if (vscode.window.activeTextEditor) {
		// Small delay to ensure everything is initialized
		setTimeout(() => {
			vscode.window.visibleTextEditors.forEach(editor => {
				if (animatedHighlighter) {
					// Force an initial update
					(animatedHighlighter as any).updateDecorations(editor);
				}
			});
		}, 500);
	}

	vscode.window.showInformationMessage('Animated Syntax Highlighting is ready! Try the demo command.');
}

// This method is called when your extension is deactivated
export function deactivate() {
	if (animatedHighlighter) {
		animatedHighlighter.dispose();
		animatedHighlighter = undefined;
	}
}
