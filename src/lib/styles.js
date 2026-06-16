import Markdown from "react-markdown"

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

export const MarkdownExternalLinks = ({children}) => {
  return (
    <Markdown components={{ a(props){
      const {node, ...rest} = props
      return <a {...rest} target="blank">{node.children[0].value} <img src='/election-guide-2026/external.svg' style={{fill: 'var(--link)'}}/></a>
    }}}>
      {children}
    </Markdown>
  )
}