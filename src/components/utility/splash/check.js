import React, { useEffect } from 'react';
import Confetti from 'react-confetti';

const Check = () => {
    const [isClicked, setIsClicked] = React.useState(false);

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
            backgroundColor: "#2596be",
            width: "40%", height: "250px",
            justifySelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: "10px"
        }}
        >
            <i class="fa-solid fa-check" style={{ fontSize: "35px", padding: "10px", color: "#2596be", borderRadius: "50%", backgroundColor: "white" }}></i>
            <p style={{ fontSize: '20px', color: '#ffffff', paddingTop: "30px" }}>Order successfully placed!</p>
            {isClicked && <Confetti width={window.innerWidth} height={window.innerHeight} />}
        </div>
    );
};

export default Check;

