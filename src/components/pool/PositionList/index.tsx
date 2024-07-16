import { ExtendedPosition } from "src/hooks/position/useAllPositions";
import { PositionCard } from "../PositionCard";

export const PositionList = ({ positions }: { positions: ExtendedPosition[] }) => {
    return (
        <div className="w-full flex gap-4">
            {positions.map((position) => (
                <PositionCard key={position.position.liquidity.toString()} position={position} />
            ))}
        </div>
    );
};
