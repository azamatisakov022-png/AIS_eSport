import { useEffect, useRef } from 'react'

/* ═══════════════════════════════════════════════════════
   KYRGYZSTAN MAP - Unified map component using:
   • Real GeoJSON boundaries from geoBoundaries (ADM1)
   • CartoDB Positron light tiles
   • Leaflet loaded dynamically
   • Gray overlay outside KR
   • Oblast boundaries with hover
   • Colored markers by type + legend
   • maxBounds restricted to KR
   ═══════════════════════════════════════════════════════ */

/* ── Oblast name mapping (English → Russian) ── */
const OBLAST_NAMES = {
    'Batken Region': 'Баткенская область',
    'Batken': 'Баткенская область',
    'Chuy Region': 'Чуйская область',
    'Chuy': 'Чуйская область',
    'Issyk-Kul Region': 'Иссык-Кульская область',
    'Issyk-Kul': 'Иссык-Кульская область',
    'Issyk Kul': 'Иссык-Кульская область',
    'Jalal-Abad Region': 'Джалал-Абадская область',
    'Jalal-Abad': 'Джалал-Абадская область',
    'Naryn Region': 'Нарынская область',
    'Naryn': 'Нарынская область',
    'Osh Region': 'Ошская область',
    'Osh': 'Ошская область',
    'Talas Region': 'Таласская область',
    'Talas': 'Таласская область',
}

/* ── Oblast fill colors ── */
const OBLAST_COLORS = {
    'Баткенская область': '#ec4899',
    'Чуйская область': '#e8a838',
    'Иссык-Кульская область': '#3b82f6',
    'Джалал-Абадская область': '#f59e0b',
    'Нарынская область': '#8b5cf6',
    'Ошская область': '#ef4444',
    'Таласская область': '#10b981',
}

/* ── Popup HTML builder (used when marker has no custom popupHtml) ─── */
function escapeHtml(s) {
    if (s == null) return ''
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}
function buildPopupHtml(m) {
    const muted = 'color:var(--theme-text-secondary, var(--text-secondary, #6e6e73));font-size:12px'
    const label = 'color:var(--theme-text-secondary, var(--text-secondary, #6e6e73));font-size:11px;text-transform:uppercase;letter-spacing:0.3px;display:inline-block;width:18px'

    const phoneNorm = m.phone ? String(m.phone).replace(/[^+\d]/g, '') : ''
    const websiteUrl = m.website
        ? (m.website.startsWith('http') ? m.website : `https://${m.website}`)
        : ''

    return `
<div style="font-family:Inter,system-ui,sans-serif;min-width:240px;max-width:300px">
    <div style="font-size:14px;font-weight:700;line-height:1.3;margin-bottom:4px;color:var(--theme-text-main, var(--text-primary, #1a1a1a))">${escapeHtml(m.name || '')}</div>
    ${m.typeName ? `<div style="${muted};margin-bottom:8px">${escapeHtml(m.typeName)}</div>` : ''}
    <div style="display:flex;flex-direction:column;gap:6px;margin:6px 0;">
        ${m.address ? `<div style="${muted};line-height:1.4"><span style="${label}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></span> ${escapeHtml(m.address)}</div>` : ''}
        ${phoneNorm ? `<div style="${muted};line-height:1.4"><span style="${label}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg></span> <a href="tel:${escapeHtml(phoneNorm)}" style="color:inherit;text-decoration:none">${escapeHtml(m.phone)}</a></div>` : ''}
        ${m.email ? `<div style="${muted};line-height:1.4"><span style="${label}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></svg></span> <a href="mailto:${escapeHtml(m.email)}" style="color:inherit;text-decoration:none">${escapeHtml(m.email)}</a></div>` : ''}
        ${websiteUrl ? `<div style="${muted};line-height:1.4"><span style="${label}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></span> <a href="${escapeHtml(websiteUrl)}" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:underline">${escapeHtml(m.website)}</a></div>` : ''}
        ${m.capacity ? `<div style="${muted};line-height:1.4"><span style="${label}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span> ${escapeHtml(m.capacity)}</div>` : ''}
        ${m.extra ? `<div style="${muted};line-height:1.4">${escapeHtml(m.extra)}</div>` : ''}
    </div>
</div>`.trim()
}

/* ── Marker type colors ── */
const MARKER_COLORS = {
    dyush: '#16a34a',
    uor: '#16a34a',
    arena: '#d40029',
    pool: '#d40029',
    stadium: '#f59e0b',
    manege: '#f59e0b',
    gym: '#6366f1',
    field: '#6366f1',
    fitness: '#6366f1',
}
const MARKER_DEFAULT = '#86868b'

const LEGEND_ITEMS = [
    { color: '#16a34a', label: 'Спортшколы / ДЮСШ' },
    { color: '#d40029', label: 'Дворцы спорта / СК' },
    { color: '#f59e0b', label: 'Стадионы / Манежи' },
    { color: '#6366f1', label: 'Залы / Площадки' },
]

const MARKER_SUMMARY_LABELS = ['точка', 'точки', 'точек']

/* ── Map settings ── */
const KG_CENTER = [41.2, 74.7]
const KG_MAX_BOUNDS = [[39.0, 69.0], [43.5, 81.0]]

/* ── Build world mask with hole for KR territory ── */
function buildWorldMask(geoJsonFeatures) {
    // Collect all coordinates from all features to create one big polygon hole
    const holes = []
    geoJsonFeatures.forEach(feature => {
        const geom = feature.geometry
        if (geom.type === 'Polygon') {
            holes.push(geom.coordinates[0].map(([lng, lat]) => [lat, lng]))
        } else if (geom.type === 'MultiPolygon') {
            geom.coordinates.forEach(poly => {
                holes.push(poly[0].map(([lng, lat]) => [lat, lng]))
            })
        }
    })
    return holes
}

function formatCountLabel(count, labels) {
    const mod10 = count % 10
    const mod100 = count % 100
    if (mod10 === 1 && mod100 !== 11) return `${count} ${labels[0]}`
    if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return `${count} ${labels[1]}`
    return `${count} ${labels[2]}`
}

/* ═══════════════════════════════════════════════════════
   KyrgyzstanMap Component
   props:
    - markers: [{lat, lng, name, type?, typeName?, address?, capacity?, popupHtml?}]
    - height: number (default 500)
    - showLegend: boolean (default true)
    - showOblasts: boolean (default true)
   ═══════════════════════════════════════════════════════ */
export default function KyrgyzstanMap({
    markers = [],
    height = 500,
    showLegend = true,
    showOblasts = true,
    fitToMarkers = false,
    activeMarkerId = null,
    onMarkerSelect,
}) {
    const mapRef = useRef(null)
    const mapInstance = useRef(null)
    const initialViewRef = useRef({ type: 'bounds', bounds: KG_MAX_BOUNDS })
    const markerLayersRef = useRef(new Map())
    const markerClusterRef = useRef(null)
    const activeMarkerRef = useRef(null)
    const markerSelectRef = useRef(onMarkerSelect)

    useEffect(() => {
        markerSelectRef.current = onMarkerSelect
    }, [onMarkerSelect])

    const getMarkerStyle = (marker, isActive = false) => {
        const color = MARKER_COLORS[marker.type] || MARKER_DEFAULT
        if (isActive) {
            return {
                radius: 11,
                fillColor: color,
                color: '#ffffff',
                weight: 4,
                fillOpacity: 1,
            }
        }
        return {
            radius: 7,
            fillColor: color,
            color: '#fff',
            weight: 2,
            fillOpacity: 0.9,
        }
    }

    const resetView = () => {
        if (!mapInstance.current || !initialViewRef.current) return
        const initialView = initialViewRef.current
        if (initialView.type === 'view') {
            mapInstance.current.setView(initialView.center, initialView.zoom)
            return
        }
        mapInstance.current.fitBounds(initialView.bounds, {
            padding: [24, 24],
            maxZoom: initialView.maxZoom,
        })
    }

    useEffect(() => {
        let cancelled = false

        if (mapInstance.current) {
            mapInstance.current.remove()
            mapInstance.current = null
        }
        markerLayersRef.current = new Map()
        markerClusterRef.current = null
        activeMarkerRef.current = null

        // Load Leaflet & MarkerCluster CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
            const link = document.createElement('link')
            link.rel = 'stylesheet'
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
            document.head.appendChild(link)
        }
        if (!document.querySelector('link[href*="MarkerCluster.css"]')) {
            const mcLink = document.createElement('link')
            mcLink.rel = 'stylesheet'
            mcLink.href = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css'
            document.head.appendChild(mcLink)
        }

        const initMap = async () => {
            if (cancelled || !window.L || !mapRef.current) return
            if (mapInstance.current) return

            const L = window.L
            const map = L.map(mapRef.current, {
                center: KG_CENTER,
                zoom: 7,
                maxBounds: KG_MAX_BOUNDS,
                maxBoundsViscosity: 0.8,
                minZoom: 6,
                maxZoom: 19,
                zoomControl: false,
                attributionControl: true,
            })
            initialViewRef.current = { type: 'bounds', bounds: KG_MAX_BOUNDS }

            // ── CartoDB Positron light tile layer (with labels: cities, streets, road names) ──
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
                subdomains: 'abcd',
                maxNativeZoom: 19,
                maxZoom: 19,
            }).addTo(map)
            L.control.zoom({ position: 'topright' }).addTo(map)

            // ── Load real GeoJSON boundaries ──
            try {
                const resp = await fetch('/data/kg-oblasts.geojson')
                const geoData = await resp.json()

                // ── Gray mask outside KR ──
                const holes = buildWorldMask(geoData.features)
                const outer = [[-90, -180], [-90, 180], [90, 180], [90, -180], [-90, -180]]
                const maskLayers = [outer, ...holes]
                L.polygon(maskLayers, {
                    fillColor: '#e5eef6',
                    fillOpacity: 0.26,
                    stroke: false,
                    interactive: false,
                }).addTo(map)

                // ── Country border ──
                L.geoJSON(geoData, {
                    style: {
                        color: '#1e293b',
                        weight: 1.8,
                        opacity: 0.28,
                        fillColor: 'transparent',
                        fillOpacity: 0,
                    },
                    interactive: false,
                }).addTo(map)

                // ── Oblast boundaries with hover ──
                if (showOblasts) {
                    let oblastLayer = null
                    const labelGroup = L.layerGroup().addTo(map)

                    const getOblastStyle = (zoom, isHover) => {
                        return (feature) => {
                            const engName = feature.properties.shapeName || ''
                            const rusName = OBLAST_NAMES[engName] || engName
                            const fillColor = OBLAST_COLORS[rusName] || '#86868b'
                            
                            // Fade opacity from 0.14 (at z=8) to 0.0 (at z=10)
                            let baseOpacity = 0.14
                            if (zoom >= 10) baseOpacity = 0
                            else if (zoom > 8) baseOpacity = 0.14 * (10 - zoom) / 2
                            
                            // Fade stroke opacity from 0.62 to 0.18
                            let strokeOpacity = zoom >= 10 ? 0.18 : (zoom > 8 ? 0.18 + 0.44 * (10 - zoom) / 2 : 0.62)
                            
                            return {
                                fillColor,
                                fillOpacity: isHover && baseOpacity > 0 ? baseOpacity + 0.12 : baseOpacity,
                                color: '#94a3b8',
                                opacity: strokeOpacity,
                                weight: isHover ? 1.4 : 1.1,
                            }
                        }
                    }

                    oblastLayer = L.geoJSON(geoData, {
                        style: getOblastStyle(map.getZoom(), false),
                        onEachFeature: (feature, layer) => {
                            const engName = feature.properties.shapeName || ''
                            const rusName = OBLAST_NAMES[engName] || engName

                            // Count markers in this oblast (by bounds)
                            const bounds = layer.getBounds()
                            const oblMarkerCount = markers.filter(m =>
                                bounds.contains([m.lat, m.lng])
                            ).length

                            // Standard Leaflet tooltip
                            layer.bindTooltip(
                                `${rusName}<br>Объектов: ${oblMarkerCount}`,
                                { sticky: true, direction: 'top', offset: [0, -10] }
                            )

                            // Hover
                            layer.on('mouseover', function () {
                                const activeStyle = getOblastStyle(map.getZoom(), true)(feature)
                                this.setStyle({ fillOpacity: activeStyle.fillOpacity })
                            })
                            layer.on('mouseout', function () {
                                if (oblastLayer) oblastLayer.resetStyle(this)
                            })

                            // Smart click:
                            //   1 marker  → flyTo that marker at street zoom + open its popup
                            //   N markers → fitBounds on the oblast (gradual zoom-in)
                            layer.on('click', function () {
                                const oblastBounds = this.getBounds()
                                const markersInOblast = markers.filter(m => oblastBounds.contains([m.lat, m.lng]))
                                if (markersInOblast.length === 1) {
                                    const m = markersInOblast[0]
                                    map.flyTo([m.lat, m.lng], 17, { duration: 0.8 })
                                    // Open popup after fly finishes
                                    map.once('moveend', () => {
                                        const key = m.id ?? `${m.name || 'marker'}-${markers.indexOf(m)}`
                                        const circle = markerLayersRef.current.get(key)
                                        if (circle && circle.openPopup) circle.openPopup()
                                    })
                                } else if (markersInOblast.length > 1) {
                                    map.flyToBounds(oblastBounds, { padding: [40, 40], duration: 0.6 })
                                } else {
                                    // No markers - still zoom to oblast for orientation
                                    map.flyToBounds(oblastBounds, { padding: [40, 40], duration: 0.6 })
                                }
                            })
                        },
                    }).addTo(map)

                    // ── Oblast labels (calculate centroid from raw coords) ──
                    geoData.features.forEach(feature => {
                        const engName = feature.properties.shapeName || ''
                        const rusName = OBLAST_NAMES[engName] || engName
                        const shortName = rusName.replace(' область', '')

                        // Calculate centroid from raw coordinates (no temp layer)
                        const coords = feature.geometry.type === 'Polygon'
                            ? feature.geometry.coordinates[0]
                            : feature.geometry.coordinates[0][0]
                        let latSum = 0, lngSum = 0
                        coords.forEach(([lng, lat]) => { latSum += lat; lngSum += lng })
                        const center = [latSum / coords.length, lngSum / coords.length]

                        const label = L.divIcon({
                            className: 'kg-oblast-label',
                            html: `<span>${shortName}</span>`,
                            iconSize: [130, 20],
                            iconAnchor: [65, 10],
                        })
                        L.marker(center, { icon: label, interactive: false }).addTo(labelGroup)
                    })
                    
                    // Fit bounds inside the showOblasts block
                    const oblastBounds = oblastLayer.getBounds()
                    map.fitBounds(oblastBounds, { padding: [24, 24] })
                    initialViewRef.current = { type: 'bounds', bounds: oblastBounds }

                    // ── Update styles and labels dynamically on zoom ──
                    map.on('zoom', () => {
                        const z = map.getZoom()
                        if (oblastLayer) {
                            oblastLayer.setStyle(getOblastStyle(z, false))
                        }
                        if (z > 8) {
                            if (map.hasLayer(labelGroup)) map.removeLayer(labelGroup)
                        } else {
                            if (!map.hasLayer(labelGroup)) map.addLayer(labelGroup)
                        }
                    })
                }

                // Fallback bounds for when showOblasts is false
                if (!showOblasts) {
                    // Fit bounds from raw coordinate calc
                    let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180
                    geoData.features.forEach(f => {
                        const coords = f.geometry.type === 'Polygon'
                            ? f.geometry.coordinates[0]
                            : f.geometry.coordinates[0][0]
                        coords.forEach(([lng, lat]) => {
                            if (lat < minLat) minLat = lat
                            if (lat > maxLat) maxLat = lat
                            if (lng < minLng) minLng = lng
                            if (lng > maxLng) maxLng = lng
                        })
                    })
                    const fallbackBounds = [[minLat, minLng], [maxLat, maxLng]]
                    map.fitBounds(fallbackBounds, { padding: [24, 24] })
                    initialViewRef.current = { type: 'bounds', bounds: fallbackBounds }
                }

            } catch (err) {
                console.warn('Failed to load GeoJSON:', err)
            }

            // ── Facility markers ──
            const markersLayer = L.markerClusterGroup({
                spiderfyOnMaxZoom: true,
                showCoverageOnHover: false,
                zoomToBoundsOnClick: true,
                maxClusterRadius: 40,
                iconCreateFunction: function(cluster) {
                    const count = cluster.getChildCount();
                    let size = count < 10 ? 32 : count < 50 ? 40 : 48;
                    return L.divIcon({
                        html: `<div style="
                            background: var(--theme-bg-card, var(--bg-card, rgba(255,255,255,0.65)));
                            backdrop-filter: blur(12px);
                            -webkit-backdrop-filter: blur(12px);
                            border: 1px solid rgba(0, 0, 0, 0.1);
                            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12), inset 0 0 0 1px rgba(255, 255, 255, 0.5);
                            color: var(--theme-text-main, var(--text-primary, #1d1d1f));
                            font-weight: 700;
                            border-radius: 50%;
                            width: ${size}px;
                            height: ${size}px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-family: Inter, system-ui, sans-serif;
                            font-size: ${size < 40 ? 14 : 16}px;
                            transition: all 0.3s ease;
                        ">${count}</div>`,
                        className: 'apple-cluster-icon',
                        iconSize: [size, size]
                    });
                }
            });

            markers.forEach((m, idx) => {
                const markerKey = m.id ?? `${m.name || 'marker'}-${idx}`
                const circle = L.circleMarker([m.lat, m.lng], getMarkerStyle(m, markerKey === activeMarkerId))
                circle.__markerData = m
                circle.__markerKey = markerKey

                if (m.popupHtml) {
                    circle.bindPopup(m.popupHtml, { maxWidth: 320 })
                } else if (m.name) {
                    circle.bindPopup(buildPopupHtml(m), { maxWidth: 320 })
                }
                circle.on('mouseover', () => {
                    if (activeMarkerRef.current === markerKey) return
                    circle.setStyle({
                        radius: 9,
                        weight: 3,
                        fillOpacity: 1,
                    })
                })
                circle.on('mouseout', () => {
                    if (activeMarkerRef.current === markerKey) return
                    circle.setStyle(getMarkerStyle(m, false))
                })
                circle.on('click', () => {
                    markerSelectRef.current?.(m)
                    // Smart zoom: if user is far away from this point, fly in to street level
                    const currentZoom = map.getZoom()
                    if (currentZoom < 13) {
                        map.flyTo([m.lat, m.lng], 17, { duration: 0.8 })
                        // Re-open popup after fly finishes (Leaflet auto-closes during animation)
                        map.once('moveend', () => {
                            if (circle.openPopup) circle.openPopup()
                        })
                    }
                })
                markerLayersRef.current.set(markerKey, circle)
                markersLayer.addLayer(circle)
            })
            
            map.addLayer(markersLayer)
            markerClusterRef.current = markersLayer

            if (fitToMarkers && markers.length) {
                if (markers.length === 1) {
                    map.setView([markers[0].lat, markers[0].lng], 11)
                    initialViewRef.current = { type: 'view', center: [markers[0].lat, markers[0].lng], zoom: 11 }
                } else {
                    const bounds = L.latLngBounds(markers.map(marker => [marker.lat, marker.lng]))
                    map.fitBounds(bounds.pad(0.24), { padding: [32, 32], maxZoom: 10 })
                    initialViewRef.current = { type: 'bounds', bounds: bounds.pad(0.24), maxZoom: 10 }
                }
            }

            mapInstance.current = map

            // Fix: recalculate size after page transition animation ends (350ms)
            setTimeout(() => map.invalidateSize(), 500)
        }

        // Load or use Leaflet - delay init to allow page transition (350ms) to settle
        const loadMarkerCluster = () => {
            if (window.L && !window.L.markerClusterGroup) {
                const scriptMC = document.createElement('script')
                scriptMC.src = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js'
                scriptMC.onload = () => setTimeout(initMap, 400)
                document.head.appendChild(scriptMC)
            } else {
                setTimeout(initMap, 400)
            }
        }

        if (window.L) {
            loadMarkerCluster()
        } else {
            const script = document.createElement('script')
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
            script.onload = loadMarkerCluster
            document.head.appendChild(script)
        }

        return () => {
            cancelled = true
            if (mapInstance.current) {
                mapInstance.current.remove()
                mapInstance.current = null
            }
        }
    }, [markers, showOblasts, fitToMarkers])

    useEffect(() => {
        const markerLayers = markerLayersRef.current
        const previousActive = activeMarkerRef.current

        if (previousActive !== null && markerLayers.has(previousActive)) {
            const previousLayer = markerLayers.get(previousActive)
            const previousMarker = previousLayer.__markerData
            previousLayer.setStyle(getMarkerStyle(previousMarker, false))
            previousLayer.closePopup()
        }

        if (activeMarkerId === null || activeMarkerId === undefined || !markerLayers.has(activeMarkerId)) {
            activeMarkerRef.current = null
            return
        }

        const activeLayer = markerLayers.get(activeMarkerId)
        const activeMarker = activeLayer.__markerData
        activeLayer.setStyle(getMarkerStyle(activeMarker, true))
        activeMarkerRef.current = activeMarkerId

        if (markerClusterRef.current) {
            markerClusterRef.current.zoomToShowLayer(activeLayer, () => {
                activeLayer.openPopup()
                activeLayer.bringToFront?.()
            })
        } else {
            activeLayer.openPopup()
            activeLayer.bringToFront?.()
        }
    }, [activeMarkerId, markers])

    const markerSummary = `${formatCountLabel(markers.length, MARKER_SUMMARY_LABELS)} на карте`

    return (
        <div style={{ position: 'relative' }}>
            {/* Map container */}
            <div ref={mapRef} style={{
                height: typeof height === 'number' ? `clamp(250px, 50vw, ${height}px)` : height,
                borderRadius: 14,
                overflow: 'hidden',
                border: '1px solid var(--theme-border, var(--border-color, #d2d2d7))',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }} />

            <div style={{
                position: 'absolute',
                top: 16,
                left: 16,
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                padding: '14px 16px',
                borderRadius: 18,
                background: 'rgba(255,255,255,0.84)',
                border: '1px solid rgba(148,163,184,0.18)',
                backdropFilter: 'blur(18px)',
                boxShadow: '0 14px 28px rgba(15,23,42,0.08)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#476072' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', boxShadow: '0 0 0 4px rgba(14,165,233,0.14)' }} />
                    Кыргызстан
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--theme-text-main, var(--text-primary, #1a1a1a))' }}>
                    {markerSummary}
                </div>
            </div>

            <button
                type="button"
                onClick={resetView}
                style={{
                    position: 'absolute',
                    top: 96,
                    right: 16,
                    zIndex: 1000,
                    border: '1px solid rgba(148,163,184,0.18)',
                    background: 'rgba(255,255,255,0.9)',
                    color: '#1e293b',
                    borderRadius: 16,
                    padding: '10px 12px',
                    font: 'inherit',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 12px 24px rgba(15,23,42,0.08)',
                }}
            >
                Вся страна
            </button>

            {/* Legend */}
            {showLegend && (
                <div style={{
                    position: 'absolute', bottom: 16, left: 16, zIndex: 1000,
                    background: 'rgba(255,255,255,0.84)', backdropFilter: 'blur(18px)',
                    border: '1px solid rgba(148,163,184,0.18)', borderRadius: 16,
                    padding: '12px 14px', boxShadow: '0 14px 28px rgba(15,23,42,0.08)',
                }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#476072', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Типы объектов
                    </div>
                    {LEGEND_ITEMS.map(item => (
                        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: 12, color: 'var(--theme-text-secondary, var(--text-muted, #6e6e73))' }}>
                            <span style={{
                                width: 10, height: 10, borderRadius: '50%',
                                background: item.color, display: 'inline-block',
                                border: '1.5px solid #fff', boxShadow: '0 0 0 1px ' + item.color + '40',
                            }} />
                            {item.label}
                        </div>
                    ))}
                </div>
            )}

            {/* Styles */}
            <style>{`
                .kg-oblast-label {
                    background: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                }
                .kg-oblast-label span {
                    font-family: Inter, system-ui, -apple-system, sans-serif;
                    font-size: 11px;
                    font-weight: 700;
                    color: rgba(30, 41, 59, 0.58);
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    text-shadow: 0 0 10px rgba(255,255,255,0.95), 0 0 10px rgba(255,255,255,0.95);
                    white-space: nowrap;
                    pointer-events: none;
                }
                .leaflet-top.leaflet-right {
                    top: 14px;
                    right: 14px;
                }
                .leaflet-control-zoom {
                    border: none !important;
                    box-shadow: 0 14px 28px rgba(15,23,42,0.08) !important;
                    border-radius: 18px !important;
                    overflow: hidden;
                }
                .leaflet-control-zoom a {
                    width: 42px !important;
                    height: 42px !important;
                    line-height: 42px !important;
                    background: rgba(255,255,255,0.9) !important;
                    backdrop-filter: blur(16px);
                    color: #1e293b !important;
                    border: 1px solid rgba(148,163,184,0.18) !important;
                    font-weight: 700;
                }
                .leaflet-control-zoom a:first-child {
                    border-radius: 18px 18px 0 0 !important;
                }
                .leaflet-control-zoom a:last-child {
                    border-radius: 0 0 18px 18px !important;
                    margin-top: -1px !important;
                }
                .leaflet-control-zoom a:hover {
                    background: rgba(255,255,255,0.98) !important;
                    color: #0f172a !important;
                }
                .leaflet-control-attribution {
                    background: rgba(255,255,255,0.75) !important;
                    backdrop-filter: blur(10px);
                    border-top-left-radius: 12px !important;
                    padding: 4px 8px !important;
                }
                .leaflet-tooltip {
                    font-family: Inter, system-ui, -apple-system, sans-serif !important;
                    border-radius: 10px !important;
                    border: 1px solid var(--theme-border, var(--border-color, #d2d2d7)) !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
                    padding: 8px 12px !important;
                    background: var(--theme-bg-card, var(--bg-card, #fff)) !important;
                    color: var(--theme-text-main, var(--text-primary, #1a1a1a)) !important;
                }
                .leaflet-tooltip::before {
                    border-top-color: var(--theme-bg-card, var(--bg-card, #fff)) !important;
                }
                .leaflet-popup-content-wrapper {
                    font-family: Inter, system-ui, -apple-system, sans-serif !important;
                    border-radius: 12px !important;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important;
                    background: var(--theme-bg-card, var(--bg-card, #fff)) !important;
                    color: var(--theme-text-main, var(--text-primary, #1a1a1a)) !important;
                }
                .leaflet-popup-content {
                    color: var(--theme-text-main, var(--text-primary, #1a1a1a)) !important;
                }
                .leaflet-popup-tip {
                    background: var(--theme-bg-card, var(--bg-card, #fff)) !important;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important;
                }
                /* ── Fix: kill black rectangle on focus/click ── */
                .leaflet-interactive:focus {
                    outline: none !important;
                    box-shadow: none !important;
                }
                .leaflet-interactive:active {
                    outline: none !important;
                }
                .leaflet-interactive {
                    outline: none !important;
                }
                .leaflet-overlay-pane svg path {
                    outline: none !important;
                }
                .leaflet-overlay-pane svg path:focus {
                    outline: none !important;
                }
                .leaflet-overlay-pane svg {
                    outline: none !important;
                }
                path.leaflet-interactive:focus {
                    outline: none !important;
                    stroke-opacity: inherit !important;
                }
                .apple-cluster-icon custom {
                    display: block;
                }
                .apple-cluster-icon div:hover {
                    transform: scale(1.05);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.7) !important;
                }
            `}</style>
        </div>
    )
}

export { MARKER_COLORS, LEGEND_ITEMS }
