import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Blick — Avaliação de desempenho hierárquica'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#14171c',
        backgroundImage:
          'repeating-linear-gradient(45deg, #1b1f26 0, #1b1f26 1px, transparent 1px, transparent 12px)',
      }}
    >
      <div
        style={{
          fontSize: 96,
          fontWeight: 700,
          letterSpacing: '0.05em',
          color: '#c89b4a',
          textTransform: 'uppercase',
          fontFamily: 'monospace',
        }}
      >
        Blick
      </div>
      <div
        style={{
          fontSize: 32,
          color: '#8b909b',
          marginTop: 16,
        }}
      >
        Avaliação de desempenho hierárquica
      </div>
    </div>,
    { ...size },
  )
}
