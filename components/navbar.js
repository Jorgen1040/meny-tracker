import styles from './navbar.module.css'

export default function navbar() {
    return (
        <nav className={styles.nav}>
            <input className={styles.input} placeholder="Søk etter produkt"/>
        </nav>
    )
}