import React, { useState, useEffect } from 'react';

const AuctionCard = ({ item, userId, onBid }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [flashClass, setFlashClass] = useState('');

    const isWinning = item.highestBidderId === userId;
    const isOutbid = item.highestBidderId && !isWinning;
    const isEnded = timeLeft === 'Auction Ended';

    useEffect(() => {
        const timer = setInterval(() => {
            const now = Date.now();
            const diff = item.endTime - now;
            if (diff <= 0) {
                setTimeLeft('Auction Ended');
                clearInterval(timer);
            } else {
                const minutes = Math.floor(diff / 60000);
                const seconds = ((diff % 60000) / 1000).toFixed(0);
                setTimeLeft(`${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [item.endTime]);

    useEffect(() => {
        setFlashClass('bg-emerald-900/30 border-emerald-500/50');
        const timeout = setTimeout(() => setFlashClass(''), 300);
        return () => clearTimeout(timeout);
    }, [item.price]);

    const handleBid = () => {
        onBid(item.id, item.price + 10);
    };

    let cardBorder = 'border-slate-800';
    let shadowGlow = 'hover:shadow-indigo-500/10'; // Default hover glow

    if (isWinning) {
        cardBorder = 'border-emerald-500 ring-1 ring-emerald-500/50';
        shadowGlow = 'shadow-emerald-900/20';
    } else if (isOutbid) {
        cardBorder = 'border-red-500/50';
        shadowGlow = 'shadow-red-900/20';
    }

    return (
        <div className={`
      relative overflow-hidden rounded-xl border bg-slate-900 p-6 
      transition-all duration-300 shadow-xl ${cardBorder} ${shadowGlow} ${flashClass}
    `}>

            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-white tracking-wide">{item.title}</h2>
                {isWinning && (
                    <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-xs font-bold border border-emerald-500/20">
                        Winning
                    </span>
                )}
                {isOutbid && (
                    <span className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs font-bold border border-red-500/20">
                        Outbid
                    </span>
                )}
            </div>

            <div className="mb-6">
                <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">Current Bid</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">${item.price}</span>
                    <span className="text-slate-500 text-sm">USD</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex-1 bg-slate-800/50 rounded-lg p-2 text-center border border-slate-700">
                    <span className={`font-mono text-sm font-medium ${isEnded ? 'text-red-400' : 'text-slate-300'}`}>
                        {timeLeft}
                    </span>
                </div>

                <button
                    onClick={handleBid}
                    disabled={isEnded}
                    className={`
            flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-200
            ${isEnded
                            ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 active:scale-95'
                        }
          `}
                >
                    {isEnded ? 'Closed' : 'Bid $10'}
                </button>
            </div>
        </div>
    );
};

export default AuctionCard;