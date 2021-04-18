import { Link, useLocation } from 'react-router-dom'
import styles from './style.module.css'

type MenuItem = {
    text: string,
    to: string,
    disabled: boolean
}

function Navbar() {
    const menu: MenuItem[] = [
        {
            text: 'Home',
            to: '/',
            disabled: false
        },
    ]

    const pathname = useLocation().pathname

    return (
        <div className={styles.navContainer}>
            <div className={styles.navLogo}>
                NoMoreLabel
            </div>
            {
                menu.map(item => (
                    <Link
                        to={item.disabled ? '#' : item.to}
                        className={pathname === item.to ? styles.navItemCurrent : styles.navItem}
                        key={item.to}
                    >
                        {item.text}
                    </Link>
                ))
            }
        </div>
    )
}

export default Navbar