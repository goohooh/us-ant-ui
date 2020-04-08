import { useState } from 'react';
import Head from 'next/head'
import dynamic from 'next/dynamic';
import { OffCanvas, OffCanvasMenu, OffCanvasBody } from "react-offcanvas";
import LoginForm from './LoginForm';

const Header = dynamic(import ('./Header'),{ssr:false});

export default props => {
    const [isMenuOpened, setIsMenuOpened] = useState(false);

    return (
        <div>
            <Head>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <OffCanvas
                width={300}
                transitionDuration={300}
                effect={"parallax"}
                isMenuOpened={isMenuOpened}
                position={"right"}
            >
                <OffCanvasBody className="main">
                    <Header {...props} setIsMenuOpened={setIsMenuOpened} />
                    {props.children}
                </OffCanvasBody>
                <OffCanvasMenu className="off-canvas shadow">
                    <div className="p-4">
                        <div className="flex justify-between">
                            <h3>My</h3>
                            <button onClick={() => setIsMenuOpened(false)}>X</button>
                        </div>
                        <LoginForm />
                    </div>
                </OffCanvasMenu>
            </OffCanvas>
        </div>
    );
};