import React from 'react';
import { getFundingTier, getFundingPercent, getFundingBarClass } from '../../../services/utils/memeUtils';

interface FundingBarProps {
    amount: number;
}

const FundingBar: React.FC<FundingBarProps> = ({ amount }) => {
    const tier = getFundingTier(amount);
    const percent = getFundingPercent(amount);
    const barClass = getFundingBarClass(tier);

    return (
        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden mt-3">
            <div
                className={`h-full transition-all duration-500 ease-out ${barClass}`}
                style={{ width: `${percent * 100}%` }}
            />
        </div>
    );
};

export default FundingBar;
