import React, { useEffect } from 'react'

const st = {
    container: {
        position: 'relative',
        minHeight: 180,
        display: 'flex',
        alignItems: 'center',
        background: '#0a0a0c',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        marginBottom: 32,
        overflow: 'hidden'
    },
    title: {
        fontSize: 32,
        fontWeight: 800,
        margin: '0 0 12px',
        lineHeight: 1.15,
        letterSpacing: '-0.03em',
        background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    desc: {
        fontSize: 15,
        color: 'rgba(235,235,245,0.8)',
        lineHeight: 1.5,
        margin: 0,
        fontWeight: 400,
    },
    counters: {
        display: 'flex', gap: 12, flexWrap: 'wrap'
    }
}

/**
 * Reusable ultra-compact Hero component showcasing 3 distinct layout solutions
 */
export default function PublicHero({ title, description, variant = 'slate', bgImage, bgPosition = 'right center', children, layoutMode = 'split' }) {
    
    // VARIANT 1: PURE ABSTRACT MESH (No Photos)
    // Extremely premium macOS feel, absolutely no cropping issues.
    if (layoutMode === 'abstract') {
        return (
            <section style={st.container}>
                <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', background: '#0a0a0c' }}>
                    {/* Glowing orbs using CSS from public.css */}
                    <div className={`hero-orb orb-${variant}-1`} />
                    <div className={`hero-orb orb-${variant}-2`} />
                    <div className="hero-orb orb-base" />
                    
                    {/* Subtle Grid */}
                    <div style={{
                        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                        maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
                        WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)'
                    }} />
                    
                    {/* Optional Glassmorphism overlay to smooth it out */}
                    <div style={{
                        position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
                        backdropFilter: 'blur(100px)',
                        WebkitBackdropFilter: 'blur(100px)',
                        background: 'rgba(10, 10, 12, 0.4)'
                    }} />
                </div>

                <div className="pub-container" style={{ position: 'relative', zIndex: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0 32px' }}>
                    <div style={{ flex: '1 1 300px', padding: '32px 0' }}>
                        <h1 style={st.title}>{title}</h1>
                        {description && <p style={st.desc}>{description}</p>}
                    </div>
                    {children && <div style={{...st.counters, paddingLeft: 32}}>{children}</div>}
                </div>
            </section>
        )
    }

    // VARIANT 2: THE 50/50 SPLIT
    // Perfectly integrates the 16:9 photo into the right side smoothly.
    if (layoutMode === 'split') {
        return (
            <section style={st.container}>
                <div style={{ position: 'absolute', inset: 0, background: '#0a0a0c', zIndex: 0 }} />
                
                {/* Right side background image (constrained width drastically reduces vertical cropping) */}
                {bgImage && (
                    <div style={{
                        position: 'absolute', right: 0, top: 0, bottom: 0, width: '60%', zIndex: 1,
                        backgroundImage: `url(${bgImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: bgPosition, // Customizable anchor
                        opacity: 0.9
                    }}>
                        {/* Gradient mask to blend the photo seamlessly into the left black area */}
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(to right, #0a0a0c 0%, rgba(10,10,12,0.6) 30%, transparent 100%)'
                        }}/>
                    </div>
                )}
                
                <div className="pub-container" style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0 32px' }}>
                    <div style={{ flex: '1 1 300px', maxWidth: 600, padding: '32px 0', paddingRight: 40 }}>
                        <h1 style={st.title}>{title}</h1>
                        {description && <p style={{...st.desc, maxWidth: 500}}>{description}</p>}
                    </div>
                    {children && <div style={{flex: '0 0 auto', ...st.counters}}>{children}</div>}
                </div>
            </section>
        )
    }

    // VARIANT 3: THE PARALLAX WINDOW
    // The image covers everything, but acts as a dynamic fixed window while scrolling.
    if (layoutMode === 'parallax') {
        return (
            <section style={{
                ...st.container, 
                backgroundAttachment: 'fixed', 
                backgroundImage: `url(${bgImage || ''})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center'
            }}>
                {/* Heavy Dark Overlay to ensure text readability */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,10,12,0.95) 0%, rgba(10,10,12,0.85) 45%, rgba(10,10,12,0.4) 100%)', zIndex: 1 }} />
                
                <div className="pub-container" style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0 32px' }}>
                    <div style={{ flex: '1 1 300px', padding: '32px 0' }}>
                        <h1 style={st.title}>{title}</h1>
                        {description && <p style={{...st.desc, maxWidth: 600}}>{description}</p>}
                    </div>
                    {children && <div style={st.counters}>{children}</div>}
                </div>
            </section>
        )
    }

    return null;
}

/**
 * Animated counter block inside PublicHero.
 */
export function PublicHeroCounter({ animRef, value, label }) {
    const s = {
        counter: {
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 16,
            padding: '12px 20px',
            textAlign: 'left',
            borderTop: '1px solid rgba(255,255,255,0.12)',
            borderLeft: '1px solid rgba(255,255,255,0.06)',
            borderRight: '1px solid rgba(255,255,255,0.02)',
            borderBottom: '1px solid rgba(255,255,255,0.01)',
            minWidth: 100,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(0,0,0,0.15), inset 0 0 12px rgba(255,255,255,0.02)'
        },
        val: { display: 'block', fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 },
        lbl: { display: 'block', fontSize: 10, color: 'rgba(235,235,245,0.6)', marginTop: 4, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }
    }
    return (
        <div ref={animRef} style={s.counter}>
            <span style={s.val}>{value}</span>
            <span style={s.lbl}>{label}</span>
        </div>
    )
}
