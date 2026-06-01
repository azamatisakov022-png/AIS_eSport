import { STRUCTURE } from './data/intranetData'
import './intranet.css'

export default function IntranetStructure() {
    return (
        <div className="intra">
            <div className="intra-page-head">
                <div>
                    <h1 className="intra-page-head__title">Структура ГАФКиС</h1>
                    <p className="intra-page-head__sub">Руководство, центральный аппарат, дирекции по видам спорта, областные управления и подведомственные учреждения.</p>
                </div>
            </div>

            <div className="intra-org">
                {/* Director */}
                <div className="intra-org__level intra-org__level--single">
                    <div className="intra-orgnode intra-orgnode--top">
                        <p className="intra-orgnode__title">{STRUCTURE.director.title}</p>
                        <span className="intra-orgnode__sub">{STRUCTURE.director.name}</span>
                    </div>
                </div>

                <div className="intra-org__line" />

                {/* Deputies */}
                <div className="intra-org__level">
                    {STRUCTURE.deputies.map((d, i) => (
                        <div key={i} className="intra-orgnode intra-orgnode--deputy">
                            <p className="intra-orgnode__title">{d.title}</p>
                            <span className="intra-orgnode__sub">{d.name}</span>
                        </div>
                    ))}
                </div>

                <div className="intra-org__line" />

                {/* Departments grid */}
                <div className="intra-org__dept-grid">
                    {STRUCTURE.departments.map((d, i) => (
                        <div key={i} className="intra-org__dept">
                            <h3 className="intra-org__dept-title">{d.title}</h3>
                            <ul className="intra-org__dept-list">
                                {d.subs.map((s, j) => <li key={j}>{s}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
