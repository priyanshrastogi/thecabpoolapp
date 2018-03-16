import React from 'react';

const Footer = () => {
    return (
        <div className="text-center" style={{marginTop: '100px'}}>
            <p>&copy; {new Date().getFullYear()}, Priyansh Rastogi.<br/>The Cabpool App.</p>
        </div>
    );
}

export default Footer;