import LoginForm from './LoginForm';

export default ({ isMenuOpened, setIsMenuOpened }) => (
    <div className="fixed top-0 w-screen h-screen box-border flex flex-row-reverse" style={{
        left: isMenuOpened ? "0%" : "100%",
        zIndex: 10000,
        backgroundColor: "rgba(0 ,0 ,0, 0.6)"
    }}>
        <div className="fixed top-0 w-4/5 h-screen bg-white p-4 box-border transition duration-100" style={{
            right: isMenuOpened ? "0%" : "-100%",
            zIndex: 10001,
        }}>
            <div className="flex justify-between">
                <h3>My</h3>
                <button onClick={() => setIsMenuOpened(false)}>X</button>
            </div>
            <LoginForm />
        </div>
    </div>
);