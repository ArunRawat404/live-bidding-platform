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

    const formatUser = (id) => id ? `User ${id.slice(0, 4)}` : 'No one';

    return (
        <div className={`
      relative overflow-hidden rounded-xl border bg-slate-900 p-6 
      transition-all duration-300 shadow-xl ${cardBorder} ${shadowGlow} ${flashClass}
    `}>
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-white tracking-wide">{item.title}</h2>

                {/* Badge Logic */}
                {!isEnded && isWinning && (
                    <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-xs font-bold border border-emerald-500/20">
                        Winning
                    </span>
                )}
                {!isEnded && isOutbid && (
                    <span className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs font-bold border border-red-500/20">
                        Outbid
                    </span>
                )}
            </div>

            {/* Price Section */}
            <div className="mb-6">
                <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">
                    {isEnded ? 'Final Price' : 'Current Bid'}
                </p>
                <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-bold ${isEnded ? 'text-slate-300' : 'text-white'}`}>
                        ${item.price}
                    </span>
                    <span className="text-slate-500 text-sm">USD</span>
                </div>
            </div>

            {/* WINNER REVEAL*/}
            {isEnded ? (
                <div className={`p-4 rounded-lg text-center border ${isWinning ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-slate-800 border-slate-700'}`}>
                    {isWinning ? (
                        <div>
                            <p className="text-2xl mb-1">🏆</p>
                            <p className="text-emerald-400 font-bold text-lg">YOU WON!</p>
                            <p className="text-slate-400 text-sm">Congratulations!</p>
                        </div>
                    ) : (
                        <div>
                            <p className="text-slate-400 font-semibold">Winner</p>
                            <p className="text-white font-mono text-lg">{item.highestBidderId ? formatUser(item.highestBidderId) : 'No Bids'}</p>
                        </div>
                    )}
                </div>
            ) : (
                /* Normal Active State (Timer + Button) */
                <div className="flex items-center gap-4">
                    <div className="flex-1 bg-slate-800/50 rounded-lg p-2 text-center border border-slate-700">
                        <span className="font-mono text-sm font-medium text-slate-300">
                            {timeLeft}
                        </span>
                    </div>

                    <button
                        onClick={handleBid}
                        disabled={isWinning}
                        className={`
              flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-200
              ${isWinning
                                ? 'bg-emerald-600 text-white cursor-default opacity-90'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 active:scale-95'
                            }
            `}
                    >
                        {isWinning ? 'Leading' : 'Bid $10'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default AuctionCard;