import React from 'react';
//import Block from 'react-blocks';
import Background from '../images/dimbg.jpg';


const CenteredLayout = (props) => {
    return (
        <div>
            <img src={Background} alt="bg"
            style={{
                minHeight: '100%',
                minWidth: 1024,
                width: '100%',
                height: 'auto',

                position: 'fixed',
                left: '0',
                top: '0',
            }} />
            <div >
            
                {props.children}
            
            </div>
        </div>
    );    
};

export default CenteredLayout;