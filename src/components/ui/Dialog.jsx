import { useEffect, useRef } from 'react';
import { cx } from '../../lib/cx.js';
import './Dialog.css';

export function Dialog({ open, onClose, className, children, ...props }) {
    const ref = useRef(null);

    useEffect(() => {
        const dialog = ref.current;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    return (
        <dialog
            ref={ref}
            className={cx('dialog', className)}
            onClose={onClose}
            onClick={(e) => e.target === e.currentTarget && onClose()}
            {...props}
        >
            <button className="dialog-close" type="button" onClick={onClose} aria-label="Sluiten">×</button>
            {children}
        </dialog>
    );
}
