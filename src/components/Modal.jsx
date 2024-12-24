import ReactDOM from "react-dom";
import { useState } from "react";

export default function Modal(props) { //needs 2nd argument so , and add
    const { children, handleCloseModal } = props;
    return ReactDOM.createPortal(
        <div className="modal-container">
            <button onClick={handleCloseModal} className="modal-underlay"></button>
            <div className="modal-content">
                {children}
            </div>
        </div>,
        document.getElementById('portal')
    )
}

