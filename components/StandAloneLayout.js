import Head from 'next/head'
import DashboardHeader from "./DashboardHeader";

export default props => {

    return (
        <>
            <Head>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/icon?family=Material+Icons"
                />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i&subset=latin-ext"
                />
            </Head>
            <div className="main">
                <DashboardHeader />
                {props.children}
            </div>
        </>
    );
};