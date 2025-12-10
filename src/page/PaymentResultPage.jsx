import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../style/PaymentResult.css"

export default function PaymentResult() {
    const [params] = useSearchParams();
    const status = params.get("status");
    const navigate = useNavigate();

    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (status === "success") {
            setSuccess(true);
        } else {
            setSuccess(false);
        }
    }, [status]);

    return (
        <div className="result-container">
            {success ? (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="green" viewBox="0 0 24 24" width="110px" height="110px">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z" />
                    </svg>
                    <p>THANH TOÁN THÀNH CÔNG!</p>
                </>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" width="110px" height="110px">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.59 6.41L13.41 12l4.18 4.18-1.41 1.41L12 13.41l-4.18 4.18-1.41-1.41L10.59 12 6.41 7.82 7.82 6.41 12 10.59l4.18-4.18 1.41 1.41z"/>
                    </svg>
                    <p>THANH TOÁN THẤT BẠI!</p>
                </>
            )}

            <button
                className="return-btn"
                onClick={() => navigate("/")}
            >
                Về trang chủ
            </button>
        </div>
    );
}
