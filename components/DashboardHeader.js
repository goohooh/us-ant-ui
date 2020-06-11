import Link from 'next/link';
import { useRouter } from "next/router";

const headerStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  padding: '14px 20px',
  width: '100%',
  height: '70',
  background: '#e0e5ec',
  zIndex: 1000
};

const linkStyle = {
  width: 60,
  flexBasis: 60,
  flexShrink: 0,
};

const DashboardHeader = () => {
  const { query: { symbol = "aapl" }}= useRouter();
  return (
    <div style={headerStyle} className="flex flex-row justify-center items-center shadow-sm">
      <Link href={`/?symbol=${symbol}`}>
        <a style={linkStyle}>
          <img src="/logo.png" alt="logo" />
        </a>
      </Link>
    </div>
  );
}

export default DashboardHeader;
