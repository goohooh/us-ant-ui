import { useState } from 'react';
import Head from 'next/head'
import dynamic from 'next/dynamic';
import OffCanvas from "./OffCanvas";

const Header = dynamic(import ('./Header'),{ssr:false});

export default props => {
    const [isMenuOpened, setIsMenuOpened] = useState(false);

    return (
        <>
            <Head>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <div className="main">
                <Header {...props} setIsMenuOpened={setIsMenuOpened} />
                {props.children}
            </div>
            <OffCanvas isMenuOpened={isMenuOpened} setIsMenuOpened={setIsMenuOpened} />
        </>
    );
};