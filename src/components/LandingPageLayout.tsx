interface LayoutProps {
    children: React.ReactNode;
}

// Layout for the landing page ( Smaller container than Layout2 )

export default function Layout2({ children }: LayoutProps) {
    return (
        // Outer Container
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#eeeeee',
            backgroundImage: 'url(https://img.freepik.com/premium-vector/forest-landscape-silhouette-background_1308-71994.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '20px',
        }}>
            {/* Inner Container */}
            <div style={{
                width: '500px',
                minHeight: '300px',
                backgroundColor: '#242424',
                border: '2px solid #333',
                borderRadius: '8px',
                padding: '40px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}>
                {children} {/* Allow to wrap any content inside this layout */}
            </div>
        </div>
    );
}