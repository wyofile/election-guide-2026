import Markdown from "react-markdown"
import Link from "next/link"

export const PARTIES = [
  { key: 'REP', noun: 'Republican', adjective: 'Republican', color: '#d73027', gradient: 'linear-gradient(to top, #fefefe 0%,#fcfefe 6%, #d73027 98%)'},
  { key: 'DEM', noun: 'Democrat', adjective: 'Democratic', color: '#4575b4', gradient: 'linear-gradient(to top, #fefefe 0%,#fcfefe 6%, #4575b4 98%)' },
  { key: 'IND', noun: 'Independent', adjective: 'Independent', color: '#666', gradient: 'linear-gradient(to top, #fefefe 0%,#fcfefe 6%, #666 98%)' },
  { key: 'LBR', noun: 'Libertarian', adjective: 'Libertarian', color: '#e89a0b', gradient: 'linear-gradient(to top, #fefefe 0%, #fcfefe 6%, #e89a0b 98%'},
  { key: 'CT', noun: 'Constitution', adjective: 'Constitution', color: '#a355db', gradient: 'linear-gradient(to top, #fefefe 0%, #fcfefe 6%, #a355db 98%'},
]

export const STATUS = [
  { key: 'active', label: '➡️ Active' },
  { key: 'lost-primary', label: '❌ Lost Aug. 20 primary' },
  { key: 'lost-general', label: '❌ Lost Nov. 5 general election' },
  { key: 'won-general', label: '✅ Won Nov. 5 general election' },
  { key: 'dropout', label: '❌ Withdrawn'}
]

export const MarkdownExternalLinks = ({ children }) => {
  return (
    <Markdown 
      components={{ 
        a(props) {
          // Destructure href and children out of props
          const { node, href, children: linkContent, ...rest } = props;
          
          // Determine if the link is external
          const isExternal = href && (href.startsWith('http') || href.startsWith('mailto:'));

          if (isExternal) {
            return (
              <a 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer" // Security best practice for _blank links
                {...rest}
              >
                {linkContent}
                <img 
                  src='/election-guide-2026/external.svg' 
                  alt=""
                  style={{ 
                    fill: 'var(--link)', 
                    display: 'inline-block', 
                    marginLeft: '4px', 
                    width: '0.85em' // Scales with the surrounding text size
                  }} 
                />
              </a>
            );
          }

          // County clerk links open the modal instead of scrolling to an anchor.
          if (href === '#clerk-locator') {
            return (
              <button
                type="button"
                className="markdown-inline-btn"
                onClick={() => window.dispatchEvent(new CustomEvent('open-clerk-modal'))}
                {...rest}
              >
                {linkContent}
              </button>
            );
          }

          // If it's an internal link (e.g., "/candidates/john-doe" or "#voter-faq"),
          // use the Next.js Link component for lightning-fast SPA routing.
          return (
            <Link href={href || '#'} {...rest}>
              {linkContent} ↓
            </Link>
          );
        }
      }}
    >
      {children}
    </Markdown>
  );
}