import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

const Check = () => {
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        setIsClicked(true);
        const timer = setTimeout(() => {
            setIsClicked(false);
        }, 3000);
        return () => clearTimeout(timer);
    },[]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifySelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: "10px"
        }}
        >
            <i className="fa-solid fa-check" style={{ fontSize: "35px", padding: "10px", color: "#fff", borderRadius: "50%", backgroundColor: "#2596be" }}></i>
            <p style={{ fontSize: '20px', color: '#2596be', paddingTop: "30px" }}>Order successfully placed!</p>
            {isClicked && <Confetti width={window.innerWidth} height={window.innerHeight} />}
        </div>
    );
};

export default Check;

