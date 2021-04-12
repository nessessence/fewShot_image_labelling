import { Link, useLocation } from 'react-router-dom'
import styles from './style.module.css'

function Navbar() {
    const menu = [
        {
            text: 'Home',
            to: '/'
        },
        {
            text: 'Label',
            to: '/label'
        }
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
                        to={item.to}
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