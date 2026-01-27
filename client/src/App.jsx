import React, { useEffect } from 'react';
import AuctionCard from './components/AuctionCard';
import { useSocket } from './hooks/useSocket';

function App() {
    const { items, fetchItems, placeBid, socket } = useSocket();

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 p-10 font-sans text-slate-200">
            <div className="container mx-auto max-w-6xl">

                <header className="mb-12 flex justify-between items-end border-b border-slate-800 pb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-white tracking-tight">
                            Live<span className="text-emerald-400">Auction</span>
                        </h1>
                        <p className="text-slate-400 mt-2">Real-time bidding dashboard</p>
                    </div>
                    <div className="text-sm font-mono bg-slate-900 px-3 py-1 rounded border border-slate-800 text-slate-500">
                        User ID: <span className="text-slate-300">{socket?.id ? socket.id.slice(0, 6) : '...'}</span>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((item) => (
                        <AuctionCard
                            key={item.id}
                            item={item}
                            userId={socket?.id}
                            onBid={placeBid}
                        />
                    ))}
                </div>

                {items.length === 0 && (
                    <div className="text-center py-20">
                        <div className="animate-pulse text-slate-600 text-xl">Loading live auctions...</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;