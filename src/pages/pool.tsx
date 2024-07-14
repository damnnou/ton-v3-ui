import { ArrowRight, Info, Search } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { JettonLogo } from "src/components/common/JettonLogo";
import { PoolDetails } from "src/components/pool/PoolDetails";
import { Button } from "src/components/ui/Button";
import { Input } from "src/components/ui/Input";
import { Skeleton } from "src/components/ui/Skeleton";
import { usePoolV3 } from "src/hooks/pool/usePoolV3";

const PoolPage = () => {
    // const [, pool] = usePoolV3(POOL);
    const { poolId } = useParams();
    const [, pool] = usePoolV3(poolId);

    console.log(pool);

    const jetton0 = pool?.jetton0;
    const jetton1 = pool?.jetton1;

    if (!jetton0 || !jetton1 || !pool) {
        return (
            <div className="flex flex-col gap-6 py-20">
                <Skeleton className="w-64 h-10 mr-auto  animate-pulse" />
                <Skeleton className="w-80 h-16" />
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-6 py-20 animate-fade-in">
            <section className="flex w-full items-center justify-between p-8 rounded-3xl border-0 border-border-light bg-light">
                <div className="flex gap-8">
                    <div className="flex w-fit items-center">
                        <JettonLogo jetton={jetton0} size={42} />
                        <JettonLogo className="-ml-2" jetton={jetton1} size={42} />
                    </div>
                    <div className="mr-auto flex flex-col items-start">
                        <h2 className="text-2xl">
                            {jetton0.symbol} / {jetton1.symbol}
                        </h2>
                        <div className="bg-primary-red/30 text-pink-300 rounded-xl px-2 py-1 text-sm">{`${pool.fee / 100}%`}</div>
                    </div>
                </div>
                <div className="w-fit flex gap-16">
                    <div className="flex flex-col items-end">
                        <h3 className="text-lg opacity-50">NFT</h3>
                        <p className="text-xl">2</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <h3 className="text-lg opacity-50">TVL</h3>
                        <p className="text-xl">0</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <h3 className="text-lg opacity-50">Volume (24h)</h3>
                        <p className="text-xl">0</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <h3 className="text-lg opacity-50">Fees (24h)</h3>
                        <p className="text-xl">0</p>
                    </div>
                </div>
            </section>
            <div className="flex gap-4 w-full">
                <PoolDetails pool={pool} />
                <div className="w-2/3 flex flex-col gap-4">
                    <div className="flex gap-4 w-full h-12">
                        <div className="flex items-center relative w-2/3 h-full">
                            <Input
                                placeholder="Search"
                                className="outline-none w-full h-full pl-12 bg-light focus:border-opacity-100 rounded-2xl"
                            />
                            <Search className="absolute left-4 text-border" size={20} />
                        </div>
                        <select className="w-1/3 rounded-2xl bg-light px-4 outline-none">
                            <option>All</option>
                            <option>Active</option>
                            <option>On farming</option>
                            <option>Closed</option>
                        </select>
                    </div>
                    <div className="w-full">
                        <div className="flex flex-col mt-16 items-center justify-center gap-4 text-xl p-4">
                            <Info size={32} />
                            <h3 className="text-2xl">No Position Found</h3>
                            <div className="text-sm opacity-60">
                                <p>You don't have positions for this pool</p>
                                <p>Let's create one!</p>
                            </div>
                            <Button className="rounded-xl">
                                <Link className="flex gap-2" to={`/pool/${poolId}/create-position`}>
                                    Create position <ArrowRight size={20} />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PoolPage;
