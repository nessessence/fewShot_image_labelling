import styles from './style.module.css'

type PopupProps = {
    children: React.ReactNode,
    closePopupEvent: () => void,
}

function Popup({ children, closePopupEvent }: PopupProps) {
    const checkOverlayClose = (e: any) => {
        if (e.target.className === styles.overlay) {
            closePopupEvent()
        }
    }

    return (
        <div className={styles.overlay} onClick={checkOverlayClose}>
            <div className={styles.popupContainer}>
                {
                    children
                }
            </div>        
        </div>

    )
}

export default Popup;