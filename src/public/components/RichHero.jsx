import React from 'react'

/* Полноширинный hero в стиле дома (как PublicHero abstract):
   фон #0a0a0c + сетка + блюр, flush под крошки (margin-top:-56px как
   первый ребёнок .pub-section). Принимает произвольный контент (children)
   и опциональную скан-анимацию (scan). */
export default function RichHero({ variant = 'slate', scan = false, align = 'left', children }) {
    return (
        <section className="pub-hero-flush rh" style={{
            position: 'relative', display: 'flex', alignItems: 'center',
            minHeight: 180, background: '#0a0a0c',
            boxShadow: '0 4px 24px rgba(0,0,0,0.4)', marginBottom: 32, overflow: 'hidden',
        }}>
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', background: '#0a0a0c' }}>
                <div className={`hero-orb orb-${variant}-1`} />
                <div className={`hero-orb orb-${variant}-2`} />
                <div className="hero-orb orb-base" />
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
                }} />
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
                    backdropFilter: 'blur(100px)', WebkitBackdropFilter: 'blur(100px)',
                    background: 'rgba(10, 10, 12, 0.4)',
                }} />
            </div>

            {scan && <div className="rh-scan" aria-hidden><span /></div>}

            <div className="pub-container rh__inner" style={{
                position: 'relative', zIndex: 4, width: '100%', padding: '34px 32px',
                textAlign: align,
            }}>
                {children}
            </div>
        </section>
    )
}
