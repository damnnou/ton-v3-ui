import { Button } from "src/components/ui/Button";
import { useSendTransaction } from "src/hooks/common/useSendTransaction";
import { Pool } from "src/hooks/pool/usePool";
import { useRefundTxParams } from "src/hooks/pool/useRefundTxParams";
import { useUserReserves } from "src/hooks/pool/useUserReserves";

export const RefundLiquidity = ({ pool }: { pool: Pool }) => {
    const [userReserve0, userReserve1] = useUserReserves(pool);

    const txParams = useRefundTxParams(pool);

    const { write, isLoading } = useSendTransaction(txParams);

    if (!userReserve0 && !userReserve1) return null;

    return (
        <div className="relative w-full max-w-[500px] rounded-2xl transition-all duration-300 bg-light delay-50 overflow-hidden shadow-2xl shadow-purple-500/10 flex flex-col sm:gap-4 gap-4 border-2 border-border-light sm:p-4 sm:rounded-3xl sm:bg-light p-4">
            <h2 className="mr-auto">My reserves</h2>
            <div className="flex w-full justify-between">
                <p>{pool.token0.symbol}</p>
                <p>{userReserve0?.toLocaleString()}</p>
            </div>
            <div className="flex w-full justify-between">
                <p>{pool.token1.symbol}</p>
                <p>{userReserve1?.toLocaleString()}</p>
            </div>
            <Button onClick={write} className="w-full rounded-xl text-xl" disabled={!txParams || !write || isLoading}>
                Refund tokens
            </Button>
        </div>
    );
};
