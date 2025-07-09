import { marked } from 'marked';
import hljs from 'highlight.js';
import katex from 'katex';
import DOMPurify from 'dompurify';

// Configuration de marked avec highlight.js
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (err) {
        console.warn('Highlight.js error:', err);
      }
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
  gfm: true
});

// Renderer personnalisé pour les extensions
const renderer = new marked.Renderer();

// Support des checkboxes
renderer.listitem = function(text) {
  if (/^\s*\[[x ]\]\s*/.test(text)) {
    text = text
      .replace(/^\s*\[ \]\s*/, '<input type="checkbox" disabled> ')
      .replace(/^\s*\[x\]\s*/, '<input type="checkbox" checked disabled> ');
    return `<li class="task-list-item">${text}</li>`;
  }
  return `<li>${text}</li>`;
};

// Support des tables avec classes Tailwind
renderer.table = function(header, body) {
  return `
    <div class="overflow-x-auto my-4">
      <table class="min-w-full border border-slate-600 rounded-lg overflow-hidden">
        <thead class="bg-slate-700">${header}</thead>
        <tbody class="bg-slate-800">${body}</tbody>
      </table>
    </div>
  `;
};

renderer.tablerow = function(content) {
  return `<tr class="border-b border-slate-600">${content}</tr>`;
};

renderer.tablecell = function(content, flags) {
  const tag = flags.header ? 'th' : 'td';
  const align = flags.align ? ` style="text-align: ${flags.align}"` : '';
  const classes = flags.header 
    ? 'px-4 py-2 text-left font-semibold text-slate-200' 
    : 'px-4 py-2 text-slate-300';
  return `<${tag} class="${classes}"${align}>${content}</${tag}>`;
};

// Support des liens avec target="_blank"
renderer.link = function(href, title, text) {
  const titleAttr = title ? ` title="${title}"` : '';
  const isExternal = href?.startsWith('http') || href?.startsWith('//');
  const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
  return `<a href="${href}"${titleAttr}${target} class="text-cyan-400 hover:text-cyan-300 underline">${text}</a>`;
};

// Support des images avec classes responsive
renderer.image = function(href, title, text) {
  const titleAttr = title ? ` title="${title}"` : '';
  const altAttr = text ? ` alt="${text}"` : '';
  return `<img src="${href}"${altAttr}${titleAttr} class="max-w-full h-auto rounded-lg shadow-lg my-4" loading="lazy">`;
};

// Support des citations
renderer.blockquote = function(quote) {
  return `<blockquote class="border-l-4 border-cyan-500 pl-4 py-2 my-4 bg-slate-800/50 rounded-r-lg italic text-slate-300">${quote}</blockquote>`;
};

// Support du code inline et des blocs de code
renderer.code = function(code, language) {
  const validLang = language && hljs.getLanguage(language) ? language : 'plaintext';
  const highlighted = hljs.highlight(code, { language: validLang }).value;
  
  return `
    <div class="relative my-4">
      <div class="flex items-center justify-between bg-slate-700 px-4 py-2 rounded-t-lg">
        <span class="text-xs font-mono text-slate-400">${validLang}</span>
        <button onclick="navigator.clipboard.writeText(\`${code.replace(/`/g, '\\`')}\`)" 
                class="text-xs text-slate-400 hover:text-slate-200 transition-colors">
          Copy
        </button>
      </div>
      <pre class="bg-slate-800 p-4 rounded-b-lg overflow-x-auto"><code class="hljs language-${validLang}">${highlighted}</code></pre>
    </div>
  `;
};

renderer.codespan = function(code) {
  return `<code class="bg-slate-700 text-cyan-300 px-1.5 py-0.5 rounded text-sm font-mono">${code}</code>`;
};

marked.use({ renderer });

export class MarkdownProcessor {
  // Traitement des formules LaTeX inline et en bloc
  private static processLatex(text: string): string {
    // Formules en bloc ($$...$$)
    text = text.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
      try {
        const rendered = katex.renderToString(formula.trim(), {
          displayMode: true,
          throwOnError: false,
          errorColor: '#ef4444'
        });
        return `<div class="katex-display my-4 text-center">${rendered}</div>`;
      } catch (error) {
        return `<div class="bg-red-900/20 border border-red-500/30 rounded p-2 my-4 text-red-400 text-sm">LaTeX Error: ${error}</div>`;
      }
    });

    // Formules inline ($...$)
    text = text.replace(/\$([^$\n]+?)\$/g, (match, formula) => {
      try {
        const rendered = katex.renderToString(formula.trim(), {
          displayMode: false,
          throwOnError: false,
          errorColor: '#ef4444'
        });
        return `<span class="katex-inline">${rendered}</span>`;
      } catch (error) {
        return `<span class="bg-red-900/20 text-red-400 px-1 rounded text-xs">LaTeX Error</span>`;
      }
    });

    return text;
  }

  // Traitement des extensions personnalisées
  private static processCustomExtensions(text: string): string {
    // Support des alertes/callouts
    text = text.replace(/^> \[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)$/gm, (match, type, content) => {
      const colors = {
        NOTE: 'border-blue-500 bg-blue-500/10 text-blue-300',
        TIP: 'border-green-500 bg-green-500/10 text-green-300',
        IMPORTANT: 'border-purple-500 bg-purple-500/10 text-purple-300',
        WARNING: 'border-yellow-500 bg-yellow-500/10 text-yellow-300',
        CAUTION: 'border-red-500 bg-red-500/10 text-red-300'
      };
      
      const colorClass = colors[type as keyof typeof colors] || colors.NOTE;
      
      return `<div class="border-l-4 ${colorClass} p-4 my-4 rounded-r-lg">
        <div class="font-semibold mb-1">${type}</div>
        <div>${content}</div>
      </div>`;
    });

    // Support des mentions @username
    text = text.replace(/@(\w+)/g, '<span class="text-cyan-400 font-medium">@$1</span>');

    // Support des hashtags #tag
    text = text.replace(/#(\w+)/g, '<span class="text-purple-400 font-medium">#$1</span>');

    return text;
  }

  // Fonction principale de conversion Markdown vers HTML
  static toHtml(markdown: string): string {
    if (!markdown.trim()) {
      return '<div class="text-slate-400 italic">Start typing to see preview...</div>';
    }

    try {
      // 1. Traitement des extensions personnalisées
      let processed = this.processCustomExtensions(markdown);
      
      // 2. Traitement LaTeX
      processed = this.processLatex(processed);
      
      // 3. Conversion Markdown vers HTML
      let html = marked(processed);
      
      // 4. Nettoyage de sécurité
      html = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'p', 'br', 'strong', 'em', 'u', 's', 'del',
          'ul', 'ol', 'li', 'blockquote',
          'a', 'img', 'code', 'pre',
          'table', 'thead', 'tbody', 'tr', 'th', 'td',
          'div', 'span', 'input'
        ],
        ALLOWED_ATTR: [
          'href', 'title', 'alt', 'src', 'class', 'style',
          'type', 'checked', 'disabled', 'target', 'rel',
          'onclick', 'loading'
        ]
      });
      
      return html;
    } catch (error) {
      console.error('Markdown processing error:', error);
      return `<div class="bg-red-900/20 border border-red-500/30 rounded p-4 text-red-400">
        <strong>Markdown Error:</strong> ${error}
      </div>`;
    }
  }

  // Détection du type de contenu
  static detectContentType(text: string): 'markdown' | 'latex' | 'plain' {
    const hasMarkdown = /[#*_`\[\]()>-]/.test(text) || /^\s*[-*+]\s/.test(text);
    const hasLatex = /\$.*\$/.test(text) || /\\[a-zA-Z]+/.test(text);
    
    if (hasLatex && hasMarkdown) return 'markdown';
    if (hasLatex) return 'latex';
    if (hasMarkdown) return 'markdown';
    return 'plain';
  }

  // Extraction des métadonnées (front matter)
  static extractMetadata(text: string): { content: string; metadata: Record<string, any> } {
    const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = text.match(frontMatterRegex);
    
    if (!match) {
      return { content: text, metadata: {} };
    }
    
    try {
      const metadata: Record<string, any> = {};
      const frontMatter = match[1];
      
      // Parse simple YAML-like front matter
      frontMatter.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
          const value = valueParts.join(':').trim();
          metadata[key.trim()] = value.replace(/^["']|["']$/g, '');
        }
      });
      
      return { content: match[2], metadata };
    } catch (error) {
      console.warn('Front matter parsing error:', error);
      return { content: text, metadata: {} };
    }
  }
}